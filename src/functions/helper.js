// Helper function to style number values according to current locale.
export const numberFormatter = function (value, fixedDigits , maxDigits, language){
    const options = {useGrouping: "min2"};
    if (fixedDigits !== undefined){
        options.minimumFractionDigits = fixedDigits;
        options.maximumFractionDigits = fixedDigits;
    } else if (maxDigits  !== undefined) {
        options.maximumFractionDigits = maxDigits;
    } else {
        options.maximumFractionDigits = 2;
    }
    return new Intl.NumberFormat(language, options).format(value);
};

// The helper function for styling a currency value accordingly.
export const currency = function (value, currency, currentLanguage) {
  // Special arguments:
  // "symbol": "€", "$", ...
  // "singular" and "plural": euro(s), dollar(s) , point(s) ...  This supports text such as
  // "You can distribute the points any way you like", "For every euro that you invest...", etc.

  // Custom currency "points" is often used in experiments. Lacking support in Intl., according rules are implemented here.
  // Because we are using a word, we must follow grammatical rules of the current language regarding cardinalities.
  // See below for a more detailed explanation.
  if (currency === "points"){
    if (value === "singular") {
      return pointCardinalities[currentLanguage].singular
    }
    if (value === "plural" || value === "symbol"){
      // As no symbol exists for points, the generic plural is used as symbol too.
      return pointCardinalities[currentLanguage].plural
    }
    // Format the value as a string, using number formatting rules of the language. We allow at most 1 decimal for points.
    const valueString = new Intl.NumberFormat(currentLanguage, { maximumFractionDigits: 1, useGrouping: "min2" }).format(value);
    // Determine the cardinality category for the given value (depending on language, can be 'zero', 'one', 'two', 'few', 'many', or 'other')
    const cardinality = new Intl.PluralRules(currentLanguage).select(value)
    // Get the template string that corresponds to language and cardinality and insert the value.
    return pointCardinalities[currentLanguage][cardinality].replace("{{value}}", valueString);
  }

  // All other currencies. Special arguments handled before numbers.

  // Symbol: Let currency formatter format 1 to output e.g. "€1.00", extract symbol only.
  if (value === "symbol"){
    return Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency: currency
    }).formatToParts(1).find(x => x.type === "currency").value;
  }

  if (value === "singular") {
    // Look up if words for the language/currency combo exist in currencyWords, using optional chaining (?.).
    // Fallback: Let currency formatter format 1 to output e.g. "1 euro", extract currency word only.
    // (Fallback not used as default because it often outputs more than desired, e.g. "US dollar".)
    return currencyWords?.[currentLanguage]?.[currency]?.singular ||
        Intl.NumberFormat(currentLanguage, {
          style: 'currency',
          currency: currency,
          currencyDisplay: "name",
          maximumFractionDigits: 0
        }).formatToParts(1).find(x => x.type === "currency").value;
  }

  if (value === "plural") {
    // Similar to singular. Fallback here: Format 100 to output e.g. "100 euros", extract currency word only.
    return currencyWords?.[currentLanguage]?.[currency]?.plural ||
        Intl.NumberFormat(currentLanguage, {
          style: 'currency',
          currency: currency,
          currencyDisplay: "name",
          maximumFractionDigits: 0
        }).formatToParts(100).find(x => x.type === "currency").value;
  }

  // For numeric values, use the currency formatter in a straightforward way.
  return Intl.NumberFormat(currentLanguage, {
    style: 'currency',
    currency: currency
  }).format(value);
};

/* This table implements the plural rules of all supported languages for the word "points". This is not straightforward,
  because languages differ in how different numbers are treated. For example, depending on language, 0 is singular or
  plural; similarly, in some languages 1.5 is singular, in others plural. Some languages even have specific endings or
  compositions for specific numbers or ranges of numbers. For example, czech uses a different ending for 2-4 than for
  quantities 5+. In French, 1000 points, but 10000000 de points. For more background and details for each language, see
  https://www.unicode.org/cldr/charts/45/supplemental/language_plural_rules.html We implement these rules using
  Intl.PluralRules, which for every numeric value returns one of the following categories: 'zero', 'one', 'two', 'few',
  'many',   and 'other'. Every language uses a subset of these 6 cardinalities (see the link). The according forms of
  "points" must then be provided in pointCardinalities below. */
const pointCardinalities = {
  cs: {one: "{{value}} bod", few: "{{value}} body", many: "{{value}} bodu", other: "{{value}} bodů", singular: "bod", plural: "bodů"},
  de: {one: "{{value}} Punkt", other: "{{value}} Punkte", singular: "Punkt", plural: "Punkte"},
  en: {one: "{{value}} point", other: "{{value}} points", singular: "point", plural: "points"},
  fr: {one: "{{value}} point", many: "{{value}} de points", other: "{{value}} points", singular: "point", plural: "points" }
};

const currencyWords = {
  de: {
    eur: {singular: "Euro", plural: "Euro"},
    usd: {singular: "Dollar", plural: "Dollar"}
  },
  en: {
    eur: {singular: "euro", plural: "euros"},
    usd: {singular: "dollar", plural: "dollars"}
  }
}

// Helper function to style dates, which are input in a relative way.
export const relativeDateFormatter = function([number, unit], language){
    /* Utility for handling "in X days/weeks/months" in templates.
       Input: [number, unit], with unit "days"|"weeks"|"months". E.g. [4, "weeks"].
       - currently: Month refers to same day, e.g. june 6, in 1 month: july 6. If day does not exist, it is lowered: 31->30.
       Output is always relative to today.
       Output object contains:
       - dateObject: js Date
       - relative: [number, unit] (= same as input)
       - longString: "July 4th, 24"
       - numericString: "7/4/24"
       - relativeString: "today", "in 6 days", "in 4 weeks" etc.
    */

    const numericFormatter = new Intl.DateTimeFormat(language,
        {year: "2-digit", month: "numeric", day: "numeric"});
    const longFormatter = new Intl.DateTimeFormat(language,
        {year: "2-digit", month: "long", day: "numeric"});
    let relativeFormatter;
    let dateObject, longString, numericString, relativeString;
    if (number === 0) {
        dateObject = new Date();
        longString = longFormatter.format(dateObject);
        numericString = numericFormatter.format(dateObject);
        relativeFormatter = new Intl.RelativeTimeFormat(language, {style: "long", numeric: "auto"})
        relativeString = relativeFormatter.format(0, "day")   // -> translation of "today"
    } else {
        if (unit === "days") {
            dateObject = addDays(new Date(), number);
        } else if (unit === "weeks") {
            dateObject = addDays(new Date(), number * 7);
        } else if (unit === "months") {
            dateObject = addMonths(new Date(), number)
        } else {
            throw new Error('Unknown time unit.');
        }
        longString = longFormatter.format(dateObject);
        numericString = numericFormatter.format(dateObject);
        relativeFormatter = new Intl.RelativeTimeFormat(language, {style: "long", numeric: "always"});
        relativeString = relativeFormatter.format(number, unit);
    }
    return {
        dateObject: dateObject,
        relative: [number, unit],
        longString: longString,
        numericString: numericString,
        relativeString: relativeString
    }
}

function addDays(date, days) {
    // Utility to add days to a Date object; input is unaltered, returns a new object.
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addMonths(date, months) {
    // Utility to add months to a Date object; input is unaltered, returns a new object.
    // Leaves day of the month unaltered, if possible: e.g. june 6, in 1 month = july 6.
    // If day does not exist, it is lowered: 31->30.

    let newDate = new Date(date);
    const day = newDate.getDate();
    newDate.setMonth(newDate.getMonth() + +months);
    if (newDate.getDate() !== day)
        newDate.setDate(0);
    return newDate;
}


