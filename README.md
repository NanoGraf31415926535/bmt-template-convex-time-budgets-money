

# BMT Template Prototype

This is the blueprint/boilerplate for a BMT template.

New templates should be started by first forking the bmt-template-prototype on gitlab, thereby creating a new repository with the desired name. Clone the new repository to get a local copy to develop the template, which can then be uploaded to the new repo on gitlab any time. Note that this means that every template will be a separate repository.

This workflow will allow to merge changes to the prototype into the individual templates in the future: Changes to the basic functionality of templates will be distributed this way, e.g. to the wrapper for local development or helper functions. Note that during the normal template development workflow, developers will never push to the prototype repository itself.

The rest of this document gives a brief intro into the most important aspects regarding template development:

- [BMT Template Prototype](#bmt-template-prototype)
  * [Setup](#setup)
  * [Technologies](#technologies)
- [Documentation](#documentation)
  * [Versioning in BMT](#versioning-in-bmt)
  * [General layout](#general-layout)
  * [Standard components](#standard-components)
    + [Text and layout](#text-and-layout)
    + [Form](#form)
    + [Inputs](#inputs)
    + [Validated inputs](#validated-inputs)
    + [Downloading/updating standard components](#downloadingupdating-standard-components)
    + [Creating new components](#creating-new-components)
  * [Styling](#styling)
  * [Parameters](#parameters)
  * [Currency](#currency)
  * [Translations](#translations)
  * [Control questions and validation](#control-questions-and-validation)
  * [Navigation](#navigation)
  * [Global state](#global-state)
  * 


## Setup

To start a new template, follow these steps:

1. Fork the prototype
   - Cloning is done on gitlab itself.
   - Make sure to use the namespace `bmt/templates`and a name of the form `bmt-template-NAME`for the fork.
2. Clone the new repository to a local folder. Install dependencies using npm:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
The development server will start running, and you can access the project in your browser at http://localhost:5173.

4. Please change the "name" entry in `package.json` to whichever name you gave to the repository.

5. Make a copy of `.env.example` in the top-level directory and rename it to just `.env`. (Contents can stay as they are.)

## Technologies

The following technologies are used in this project:

- Vite
- JavaScript
- React
- React Router
- i18n
- tailwindcss and daisyUI

# Documentation


## Versioning in BMT

A few words on the versioning requirements behind the overarching project might be helpful to understand some decisions in how the indicudal templates are structured, e.g. the way standard components are included.

A core requirement for BMT is to ensure that if a subject takes part in a study and thus goes through a sequence o f measurement templates, it must remain possible to  recreate the exact experience as it is today in the future, both for demos and replication studies.  One cornerstone in this is strict versioning of templates – which consequently are set up as independent repositories. Once initial development is finished, any changes in appearance, language, or functionality will mean a new version of the template (of course we should try to bundle these as much as possible). The older versions will remain usable, thus allowing the desired recreation. Note that this also makes it necessary to do versioning of the subcomponents a template might use: If a standard component changes, templates need to keep using its old version until the next version shift of the template itself. (This is the reason why components are included as subtrees in the template repositories, which will mean that a template always comes with a "freeze" of them and is able to run as intended, even if changes to the compoenents might have happened since the template's development).


## General layout

The templates in this project are defined as JavaScript React components. The pages of a template are defined in separate .jsx files inside the `src/pages` folder, and each page has a corresponding entry in `src/config/pages.json`.
The prototype comes with two example pages that demonstrate the usage of the basic components. These and their entries in `pages.json` should of course be deleted once you start development of a new template.

**Conventions**: Page file names should follow the convention `Number_Name`, e.g. `0_Instructions`, `1_ControlQuestions`, etc. Entries in `pages.json` should be short and clear. See the section [Naming conventions and rules](#naming-conventions-and-rules) for details. The routes defined there are for development; when the templates are served to subjects later on, the routes will be obfuscated.

The `wrapper` is a React component that allows to test the templates during development independently of the (future) backend. It wraps the template  handles the routing, internationalization and passing the parameters. The `wrapper` is defined in the `src/wrapper.jsx` file and should not be modified.

## Standard components

A set of standard components is provided in the `local_packages`folder. As much as possible, template development should make use of these to ensure consistent functionality and appearance. If adaptations to the existing components are necessary, we should discuss these as a team; changes should then be distributed via the component's gitlab repo to the individual templates.


### Text and layout

- `<Container>` is repsonsible for the basic layout and should enclose all content of a page.
- `<Text>`: For text; the contents will essentially be wrapped in \<p\> tags. Almost always, the contents should go through a translation function (see there). It is possible to use a few basic tags in texts. Currently:
    - `<b></b>` for bold
    - `<i></i>` for italics
    - `\n\n` for paragraph separation (contents before and after will be rendered in separate `<p>`'s). A single `<br>` has the same effect.

  If further text markup is required for some template (e.g. color, strike through, ...) let us know, and we will discuss implementation.
- `<Title>` For headers. Standard will produce a left-aligned h1. Use `size="h2"` or `"h3"` for subheaders, and `align="center"` or `"right"` if needed.


### Form

- All inputs on a page should be enclosed in a `<Form>`. The form provides a "submit" button and handles frontend and backend validation.

### Inputs

- Currently: `NumberInput, TextInput, TextArea, RadioInput, SelectInput, MultipleChoice`
- These are used to elicit decisions and responses by subjects.
- Refer to the example pages of the prototype for details on usage.
- The name prop is quite important; it signifies the key under which the response is stored (in the global state and later in the database, see section...). Therefore:
    - **Input names need to be unique within a template.**
    - Names should clearly convey what the decision/question is so that experimenters downloading the data immediately understand it. Consult with the scientific personnel on this.

### Validated inputs

- For the input components, additional validated versions exist.
- The validated versions of the input components are used for **control questions** which typically follow after the initial instructions pages.
- Subjects are required to answer these questions correctly to proceed, thereby demonstrating that they have read instructions carefully. See the separate section on validation for details.

### Downloading/updating standard components

- As discussed under versioning, components themselves are also versioned
- Therefore, they reside in separate gitlab repositories and are included as **git subtrees** in the individual template repos.
- The prototype comes with a collection that can be used out of the box.
- If a new component needs to be added later on, this can be done as follows. Suppose you want to add the component `bmt-template-components-form` to a template that does not have it yet. In a system console in the root directory of the template, run
```bash
git subtree add --prefix local_packages/bmt-template-components-form https://gitlab.rlp.net/bmt/templates/components/bmt-template-components-form.git main
```
- Then, add an according line to `package.json` (use the existing component entries for guidance.)
- Again, all this is only necessary if the component is not already included!
- To instead **update** an already included component, run

```bash
git subtree pull --prefix local_packages/bmt-template-components-form https://gitlab.rlp.net/bmt/templates/components/bmt-template-components-form.git main
```
- Keep in mind that updating components generally requires a version increase (if the template has been published already - does not apply to the initial development stage of course.)
- As mentioned, the template prototype comes with a collection of components, which do not have to be added. Instead, you can remove unused components as last step of the development process to clean up things a little.

### Creating new components

- Often, templates will need components that do not exist yet.
- We suggest to develop them "locally" as part of the respective template first.
- If the created components are more general and might be used in other templates, let us know about them and we will provide them via gitlab as the others.


## Styling


- We are using tailwind with daisyui.
- In general, design should strive to be "minimal".
- Beyond that, there are currently no fixed rules/systems in place. We will come to that once other areas are fixed and a few templates exist to have an overview of what design elements need recurring solutions.
- Design should be responsive and all templates should be usable nicely on phones, down to iPhone SE (375 x 667 px).


- If given a template from another platform to recreate for BMT, try to strip down design as much as possible: 
- Use BMT standard components as much as possible. 
- Leave out borders, boxes, rulers, background colors etc., unless they are important for the user to understand the page.
- If in doubt, consult with scientific personnel.


## Parameters

- A central feature of BMT templates is parametrization. 
- Parameters refer to properties of the decision situation or social interaction that the template represents that can in principle vary. When a study is run, the researcher can decide on specific values. The participants will then see the template with these filled in.
- In the development stage of a template, parameters are set in `parameter.json`. Here's an example:
```json
{
  "repeat": {
      "type": "boolean",
      "value": true
  },
  "endowment": {
      "type": "number",
      "min": 5,
      "max": 20,
      "value": 10
  }
}
```
- All page components of a template can automatically access all parameters via `props.parameter.NAME.value`.
- The idea is that the template will later be able to be run with different values for these.
- The `"value"` serves as a default during development. However, the template in the example should also work with "repeat" turned off (whatever that may mean concretely). You can test this by simply changing the json and test whether everything looks as intended.
- Parameters will typically be reflected in many aspects of a template, for example:
  - The instruction texts.
  - The control questions:
    - Should use reasonable values relative to the parameters.
    - Example: In a game, participants receive a specific amount of money as endowment (=initially available funds). Example: 10.
    - Control questions might ask what happens if they invest a specific fraction, e.g. 5 (The question should then always be about half of the endowment: If the endowment is 20 instead, the control question should ask about investment of 10 etc.)
    - Validation functions also have access to parameters automatically (see there).
  - In the logic of the template itself, if it is a bit more complex: 
    - For example: How many decisions a subject faces, and which ones.
  - Possible answers:
    - e.g. a range of [0, 1/10, 2/20, ... ]  of the endowment.
    - Number inputs might use parameters or derived quantities e.g. as min/max.
  - The payment logic (not implemented yet, but TBD soon.)
  - Dicuss specific choices relating to the parameters of a template with the scientific personnel which should give guidance.

 

## Currency

- It will be possible to run studies with different currencies.
- In economic experiments, it is also quite customary to not reference e.g. dollar amounts directly, but instead use "points" which will be converted to dollars at the end at a given conversion rate.
  - Thus, "15 points", "2 Talers", etc. should be treated as currency amounts just as "$10" would be. (This functionality is not yet implmenented, but will follow soon.)
- There is a special `c`function available in all templates that handles two things:
  1. Filling in the currency of the experiment, which is of course not known in advance: Could be €, $, points, etc.
  2. It formats the output appropriately, depending on both currency and language. For example: 
     - c(1) will become "$1.00" if the currency is USD and language is English, 
     - but "1,00$" if the language is German,
     - "1 Lira" if it is unusual to display decimal amounts in the given currency,
     - c(1) -> "1 point" if the currency is points, but c(2) -> "2 points"
     - "1 Punkt"/"2 Punkte" instead if the language is German, etc.
- See the example pages for the definition of the function - it should just be copied to all template pages:
````js
    const c = function (value) { return props.helper["currency"](value, props.session['currency'], i18n.language) };
````
- The function takes numeric inputs and outputs a string.
- All currency amounts should be passed through the `c`function for display formatting, meaning:
  - Template texts should never directly reference/contain a currency or currency symbol.
  - You should **always pass numeric values** for display through this function if they represent e.g. an amount of dollars or points.
  - Any calculations should be done beforehand.
  - The global state/database however should store raw numeric values.

## Translations

- One important feature of BMT is to support different languages. 
- Code and texts are therefore separated.
- Internationalization is handled using the `i18next` library and in particular its `t` function, which should be defined at the top of each template page (as in the example pages):
```
    const { t, i18n } = useTranslation();
```
- Any text in the templates should then **not**  be in the source code itself, but instead in the file `public/locales/en.json` (for English; `de.json` for the german translation, etc.)
- Here is an example:
```json
{
  "title": "Coin toss game",
  "instructions-paragraph-0": "This is an example paragraph. It could contain arbitrary text that will be shown to subjects. It can even have <b>bold</b> tags etc.",
  "instructions-paragraph-1": "And another one.",
  "instructions-paragraph-2": "The experiment will take {{numberRounds}} rounds. Your endowment is {{endowment}}.",
  "instructions-start": "Start",
  "please-choose": "Please choose one of the options:",
  "decision": "Decision",
  "decision-of": "of"
}
```
- In the template code, you would then access these string using the `t` function with the according key:
```js
return <Container>
    <Title>{t("title")}</Title>
    <Text>{t("instructions-paragraph-0")}</Text>
    <Text>{t("instructions-paragraph-1")}</Text>
</Container>
```
- It is also possible to use placeholders in the translation strings and then pass variables or parameters as a second argument to the `t` function, which will fill them in accordingly.
```js
let numberRounds = 10;
return <Text>
  {
      t("instructions-paragraph-2", 
          {"numberRounds": numberRounds, "endowment": c(props.parameter.endowment.value)})
  }
</Text>
```
- Here, it is of course assumed that an according parameter `endowment` is defined in `parameter.json`. 
- Note that it represents a currency amount - so in the example, the currency-formatting function `c` is applied, before passing the resulting string to the translation function `t`.

## Control questions and validation

- A common pattern is that instructions are followed by a page with control questions, which subjects need to get correctly before proceeding.
- Such questions should be implemented using the validated input fields.
- For these, a validation function can be specified;. 
- (This form of validation will be server-side, while e.g. basic pattern or min-max-validation will be client side. Failed attempts will also automatically be logged.)
- To use such a validation function, first define it in `src/function/validation.js`. The function should take two arguments: value (of the input field at submit), and parameter, which gives you access to all template parameters inside the function. E.g.:
```js
export const exampleValidationFunction = function (input, parameter) {
    return input.toString() === parameter.endowment.value.toString();
};
```
- In addition, the function needs to be made available to the respective page by an entry in `pages.json`:
```json
{
"second-page": {
    "path": "/second-page",
    "file": "secondPage.jsx",
    "functions": ["exampleValidationFunction"]
    }
}
```
- It can then be used as validation function for the inputs on that page:
```js
<ValidatedNumberInput
    name="example-validated-input"
    // ...
    validationCallback={ props.validation["exampleValidationFunction"] }
    required
    requiredErrorMessage={ t("validated-number-input-required-error-message") }
/>

```
## Navigation

- The most simple form of navigation is handled by the button that is already provided by the `<Form>` component: 
- It will run validations, and if everything is fine, go to the next page.

- More complex forms: Conditional navigation, randomized page orders are to be discussed. Will be filled in here.


## Global state

- The BMT templates use a global state to store and pass around user input etc. 
- The global state is essentially a js object provided via the React context hook to the individual pages/components of a template. 
- It is also the main interface between the frontend component and the database: 
- It is how the data is passed once the template is finished, and also how the session state is restored from the database, e.g. if the participant changes device mid-template
- This is also the reason that template developers never directly interact with a backend API.


- If you are working with the standard components, direct interaction with the global state is typically not necessary: The components take care of this. (The input components' name prop corresponds to the key in the global state.)
- Anything stored in the global state should be serializable as json, to ensure that storing/restoring works as intended.


- Instructions on working directly with the global state for more complex templates will follow here.

## Naming conventions and rules


### Preface: Structure of an experiment

Experiments typically consist of pages that can be categorized as follows:
- Instructions 
  - where the rules are laid out; no inputs
- Control Questions
  - Subjects are asked to answer questions that test their understanding
  - Can only proceed with correct answers
  - Inputs are always **validated** versions!
- Decisions
  - Subjects get to make their actual choices
  - Often, there are multiples or sequences of these
    - If many very similar pages follow, we should probably implement them not as separate pages, but by using some logic.
- Welcome and end screens, perhaps feedback before the end
  - usually, these do not have to be implemented for BMT (as they will be provided not by the template, but the site itself)
  - If in doubt, ask the scientists before implementing these.

### Naming of pages

- Page files should be named with a number, and the category they fall into. Example:
  - `0_Instructions`
  - `1_Control`
  - `2_Decision`
- If multiple pages for one category exist:
  - You can append a number, such as this:
    - `0_Instructions1`
    - `1_Instructions2`
    - `2_Control`
    - `3_Decision`
  - Sometimes, appending words that signify the difference is preferable.
  - Suppose an experiment has Sender and Receiver roles. The subject goes through them one after the other. The page sequence could be:
      - `0_InstructionsGeneral`
      - `1_InstructionsSender`
      - `2_ControlSender`
      - `3_DecisionSender`
      - `4_InstructionsReceiver`
      - `5_ControlReceiver`
      - `6_DecisionReceiver`

### Translation keys 

Please **also see the separate file** `Components.md` for copy & paste-able blueprint code and translation strings for each of the standard components.


- In the `en.json` files etc., the entries should be ordered/organized by page, if possible. 
  - Use empty lines for some grouping.
  - Entries that are used on many pages should be placed at the top of the file.
- Use kebab-case for the keys, and use numbering at the end for similar elements, e.g. all the text blocks on a page.
- Use the page name for things like text and title.
- Basic example:
```json
{
  "instructions-1-title": "Title of Instructions1 page.",
  "instructions-1-text-1": "First text block of Instructions1 page.",
  "instructions-1-text-2": "Second text block of Instructions1 page.",
  
  "control-title": "Title of Control page.",
  "control-text-1": "First text block of the Control page.",
  "control-text-2": "Second text block of the Control page."
}
```
- Keep in mind that you can group paragraphs into a single translation string using `\n\n` to separate paragraphs.

### Input fields

- The **name** prop of the input component is important:
  - It has to be unique.
  - It should be informative about the content of the input.
    - (because it will be the column name when the data is exported later etc.)
    - For this reason, try to avoid names like "decision-1".
    - If many similar decisions follow each other, of course some naming convention like that needs to be used.
    - But ideally, the name should then capture the differences between the questions.
    - Example: Suppose the subject makes 5 choices: "Would you prefer 100€ today or X€ tomorrow", where X is 102, 104, 106, ...
    - Then the fields might be named "decision_102", "decision_104", etc.
- Control questions should always use validated input fields, using a validation function. On the other hnd, they should not make use of min/max.
  - Control question inputs should be named "control-"..., and then something to identify what they are asking for: "control-maximum-contribution", etc.
- If in doubt about the naming: pick something that seems reasonable and mark for review by someone from the scientific side.


- Input fields often have many associated translation strings as additional props, especially the validated version for control questions.
- For these, you should follow the convention "input-name-prop-name". For example, this could be the component asking for a maximum amount that can be sent to another player:
```jsx
 <ValidatedNumberInput
    name="control-maximum"
    label={t("control-maximum-label")}
    placeholder={t("control-maximum-placeholder")}
    additionalInformationTitle={t("control-maximum-additional-information-title")}
    additionalInformationText={t("control-maximum-additional-information-text")}
    solutionInformationTitle={t("control-maximum-solution-information-title")}
    solutionInformationText={t("control-maximum-solution-information-text")}
    validationCallback={props.validation.controlMaximum}
    required
    requiredErrorMessage={t("control-maximum-required-error-message")}
/>
```
- Often, you will not have the actual texts for these props (for example, because they do not exist for the experiments that we are adapting for BMT).
- In that case, simply **repeat** the according key in the language json file. For the above example, the relevant lines in `en.json` could be:

```json
{
  "control-maximum-label": "What is the maximum number of points you may send to the recipient?",
  "control-maximum-additional-information-title": "control-maximum-additional-information-title",
  "control-maximum-placeholder": "control-maximum-placeholder",
  "control-maximum-additional-information-text": "control-maximum-additional-information-text",
  "control-maximum-required-error-message": "control-maximum-required-error-message"
}
```

Again, please check `Components.md` for copy & paste-able  code and blueprint translation strings for each of the standard components.
