# BMT components

A brief overview over the usage of the base components. 
There are blocks of jsx and json below for each component. These can be used to copy-paste in the components as you assemble a page.

You will note that the jsx blocks have some commented out props. The idea is: 
- The non-commented should usually be present. 
- The commented props are optional and should be used only if there is good reason.
  - The template description will usually specify something if this is the case. 
- Please **remove the commented out props** in your code if they are not needed.


Likewise, the json blocks are **often divided by an empty line.** 
- The top part is the **default** that should basically always be copied. 
- The bottom are strings that are needed **only** if the according optional prop is used, as specified by the template description. Usually **just don't copy the bottom ones** into the language.json.

- Make sure to adapt NAME to something distinct for each component usage. (Use ctrl-r to make sure it is consistent for all props/strings of a component.)


- For some strings, the template descriptions/originals will give no details
- Mainly for validated components: 
  - additional-information-text
  - solution-information-text
- For such translation strings, just repeat the key as value in the language.json, e.g.:
```json
  "NAME-additional-information-text": "NAME-additional-information-text",
```
- Note that the `label` props represent the question text, and should always have actual text rather than a placeholder.

### Button

- The Button component is used for all navigation, most often to simply go to the next page.
- It has a default label ("Next") that should usually be used. Just don't pass children.
- In case another text is explicitly desired (we'll let you know!) pass an according translation string as child.
- Likewise, the default is to go to the next page. To achieve this, just do not pass any `target`as prop.
- If the button should lead to another page specifically, or the navigation target needs to depend on some condition, use the `target`prop. 
  - To go to `.../control`, just use `target="control"` etc.
- Examples:
```jsx
// standard case, correct 95% of times:
<Button />

// Specific target and label.
<Button target={"instructions"}>
  {t("back-to-instructions")}
</Button>
```

### Form
- Should wrap **all inputs** of a page.
- NAME should just be the page name. E.g. "control", "sender-decision", etc.
- Holds both for control pages with validated input fields, and decision pages with regular fields.
- The solution modal is only needed for control pages. These three props should be **removed for decision pages**. In that case, they do ***not*** have to be added to `en.json`

- If needed, one can also navigate to specific pages rather than the next by using the `target`prop as for the Button.

```jsx
<Form
    name="NAME-form"
    parameter={props.parameter}
    maxErrorCount={3}
    
    // solutionModalTitle={ t('NAME-form-solution-modal-title') }
    // solutionModalText={ t('NAME-form-solution-modal-text') }
    // solutionModalButton={ t('NAME-form-solution-modal-button') }
>
```
Here, all strings are optional and go together with the optional props! Only use them in language.json them if specifically asked to replace the defaults.
```json
{
  "NAME-form-solution-modal-title": "NAME-form-solution-modal-title",
  "NAME-form-solution-modal-text": "NAME-form-solution-modal-title",
  "NAME-form-solution-modal-button": "NAME-form-solution-modal-title"
}
```

### Text Input
- NAME should tell which variable the subject is supposed to enter here.
  - For example, if the question asks what the subject studies, it should be "field-of-study".
```jsx
<TextInput
    name="NAME"
    label={ t("NAME-label") }
    required
    
    // placeholder={ t("NAME-placeholder") }
    // patternErrorMessage={ t("NAME-pattern-error-message") }
    // requiredErrorMessage={ t("NAME-required-error-message") }
    // pattern="^([0-9]{1,3})?$"
/>
```
```json
{
  "NAME-label": "QUESTION TEXT",
  
  "NAME-placeholder": "NAME-placeholder",
  "NAME-pattern-error-message": "NAME-pattern-error-message",
  "NAME-required-error-message": "NAME-required-error-message"
}
```
- The optional pattern prop can be used to restrict inputs using regex patterns.
- Only use when needed for a specific purpose. (e.g. input is an email address).
- Example: restrict inputs to 1-999:
````jsx
    pattern="^([0-9]{1,3})?$"
````

### Validated Text Input
- NAME should start with "control-", and pick up some feature of the question that is asked.
  - Example: "What is the maximum amount of points you can donate?" -> "control-maximum".

```jsx
<ValidatedTextInput
    name="NAME"
    label={ t("NAME-label") }
    validationCallback={ props.validation["FUNCTION"] }
    required
    additionalInformationText={ t("NAME-additional-information-text") }
    solutionInformationText={ t("NAME-solution-information-text") }

    // placeholder={ t("NAME-placeholder") }
    // patternErrorMessage={ t("NAME-pattern-error-message") }
    // requiredErrorMessage={ t("NAME-required-error-message") }
    // additionalInformationTitle={ t("NAME-additional-information-title") }
    // solutionInformationTitle={ t("NAME-solution-information-title") }
/>
```
```json
{
  "NAME-label":  "QUESTION TEXT",
  "NAME-additional-information-text": "NAME-additional-information-text",
  "NAME-solution-information-text": "NAME-solution-information-text",

  "NAME-placeholder": "NAME-placeholder",
  "NAME-required-error-message": "NAME-required-error-message"
  "NAME-pattern-error-message": "NAME-pattern-error-message",
  "NAME-additional-information-title": "NAME-additional-information-title",
  "NAME-solution-information-title": "NAME-solution-information-title",
}
```
- As for the normal TextInput, a regex pattern can be provided as optional prop if needed.

### NumberInput
- NAME should tell which variable the subject is supposed to enter here.
    - For example, if the field asks how many point the sender wants to send: "sender-decision"
- prop "unit" (optional, but should be used whenever it makes sense) allows to specify a unit for the input, e.g. "€", "percent", "days" etc.
- If the input refers to a currency amount (or points!), use `unit={c("symbol")}` . This will input the currency symbol. If the current currency is points, it will put points instead. 
- If it is anything else, please make sure to input an according translation string and put an entry into en.json.
- Unit is commented out below, but unlike the other commented out props, it should usually be used (but has to be adapted for anything that is not an amount of currency).

```jsx
<NumberInput
    name="NAME"
    label={ t("NAME-label") }
    min={-5}
    max={5}
    required
    // unit={c("symbol")}

    // placeholder={ t("NAME-placeholder") }
    // requiredErrorMessage={ t("NAME-required-error-message") }
    // valueErrorMessage={ t("NAME-value-error-message") }

/>
```
```json
{
  "NAME-label": "QUESTION TEXT",
  
  "NAME-placeholder": "NAME-placeholder",
  "NAME-value-error-message": "NAME-value-error-message",
  "NAME-required-error-message": "NAME-required-error-message"
}
```

### ValidatedNumberInput
- NAME should start with "control-", and pick up some feature of the question that is asked.
    - Example: "What is the maximum amount of points you can donate?" -> "control-maximum".
- Can also use `unit` as for the normal number input.
```jsx
<ValidatedNumberInput
    name="NAME"
    label={ t("NAME-label") }
    additionalInformationText={ t("NAME-additional-information-text") }
    solutionInformationText={ t("NAME-solution-information-text") }
    validationCallback={ props.validation["FUNCTION"] }
    required
    // unit={c("symbol")}

    // placeholder={ t("NAME-placeholder") }
    // additionalInformationTitle={ t("NAME-additional-information-title") }
    // solutionInformationTitle={ t("NAME-solution-information-title") }
    // requiredErrorMessage={ t("NAME-required-error-message") }
    // min={-5}
    // max={5}

/>
```

```json
{
  "NAME-label": "QUESTION TEXT",
  "NAME-additional-information-text": "NAME-additional-information-text",
  "NAME-solution-information-text": "NAME-solution-information-text",

  "NAME-placeholder": "NAME-placeholder",
  "NAME-value-error-message": "NAME-value-error-message",
  "NAME-additional-information-title": "NAME-additional-information-title",
  "NAME-solution-information-title": "NAME-solution-information-title",
  "NAME-required-error-message": "NAME-required-error-message"
}
```

- Min/max should typically **not be used for validated** number fields (subject should be free to make any mistakes.)
- However, in theory one can use them, should the need ever arise in a special case:


### RadioInput
- if possible, use telling names for the option labels rather than numbers ("male", "female", etc)
```jsx
<RadioInput
    name="NAME"
    label={ t("NAME-label") }
    required

    // requiredErrorMessage={ t("NAME-required-error-message") }
    // defaultValue={2}
>
  <RadioInputOption value={1}>{ t("NAME-option-1")}</RadioInputOption>
  <RadioInputOption value={2}>{ t("NAME-option-2")}</RadioInputOption>
  // ...
</RadioInput>
```

```json
{
  "NAME-label": "QUESTION TEXT",
  "NAME-option-1": "NAME-option-1",
  "NAME-option-2": "NAME-option-2"
  
}
```

### ValidatedRadioInput
- if possible, use telling names for the option labels rather than numbers ("male", "female", etc)
```jsx
<RadioInput
    name="NAME"
    label={ t("NAME-label") }
    required
    additionalInformationText={ t("NAME-additional-information-text") }
    solutionInformationText={ t("NAME-solution-information-text") }
    validationCallback={ props.validation["thirdFunction"] }


    // requiredErrorMessage={ t("NAME-required-error-message") }
    // defaultValue={2}
    // additionalInformationTitle={ t("NAME-additional-information-title") }
    // solutionInformationTitle={ t("NAME-solution-information-title") }
>
  <RadioInputOption value={1}>{ t("NAME-option-1")}</RadioInputOption>
  <RadioInputOption value={2}>{ t("NAME-option-2")}</RadioInputOption>
  // ...
</RadioInput>
```

```json
{
  "NAME-label": "QUESTION TEXT",
  "NAME-option-1": "NAME-option-1",
  "NAME-option-2": "NAME-option-2",
  "...": "...",

  
  "NAME-additional-information-title": "NAME-additional-information-title",
  "NAME-solution-information-title": "NAME-solution-information-title",
  "NAME-required-error-message": "NAME-required-error-message",
}
```

### SelectInput
- if possible, use telling names for the option values and labels rather than numbers ("male", "female", etc)
```jsx
<SelectInput
    name="NAME"
    label={ t("NAME-label") }
    required

    // placeholder={ t("NAME-placeholder") }
    // requiredErrorMessage={ t("NAME-required-error-message") }
    // defaultValue={2}
>
  <SelectInputOption value={1}>{ t("NAME-option-1")}</SelectInputOption>
  <SelectInputOption value={2}>{ t("NAME-option-2")}</SelectInputOption>
  // ...
</SelectInput>
```

```json
{
  "NAME-label": "QUESTION TEXT",
  "NAME-option-1": "NAME-option-1",
  "NAME-option-2": "NAME-option-2",


  "NAME-required-error-message": "NAME-required-error-message",
  "NAME-placeholder": "NAME-placeholder"
}
```

### ValidatedSelectInput
- if possible, use telling names for the option labels rather than numbers ("male", "female", etc)
```jsx
<SelectInput
    name="NAME"
    label={ t("NAME-label") }
    required
    additionalInformationText={ t("NAME-additional-information-text") }
    solutionInformationText={ t("NAME-solution-information-text") }
    validationCallback={ props.validation["thirdFunction"] }


    // placeholder={ t("NAME-placeholder") }
    // requiredErrorMessage={ t("NAME-required-error-message") }
    // defaultValue={2}
    // additionalInformationTitle={ t("NAME-additional-information-title") }
    // solutionInformationTitle={ t("NAME-solution-information-title") }
>
  <SelectInputOption value={1}>{ t("NAME-option-1")}</SelectInputOption>
  <SelectInputOption value={2}>{ t("NAME-option-2")}</SelectInputOption>
  // ...
</SelectInput>
```

```json
{
  "NAME-label": "QUESTION TEXT",
  "NAME-option-1": "NAME-option-1",
  "NAME-option-2": "NAME-option-2",
  "...": "...",

  
  "NAME-additional-information-title": "NAME-additional-information-title",
  "NAME-solution-information-title": "NAME-solution-information-title",
  "NAME-required-error-message": "NAME-required-error-message",
  "NAME-placeholder": "NAME-placeholder"  
}
```
