// Imports.
import Button from "bmt-template-components-button";
import Container from "bmt-template-components-container";
import Text from "bmt-template-components-text";
import Title from "bmt-template-components-title";
import ValidatedNumberInput from "bmt-template-components-validated-number-input";
import CTBSlider from "../components/CTBSlider";
import globalContext from "../context";
import {SelectInput, SelectInputOption} from "bmt-template-components-select-input";
import {RadioInput, RadioInputOption} from "bmt-template-components-radio-input";
import Slider from "bmt-template-components-slider";
import { useTranslation } from "react-i18next";
import {useContext} from "react";


// The component.
const P0_forwords = (props) => {
    // Mandatory definitions.
    const { t, i18n } = useTranslation();
    const { parameter, validation, c, n, relativeDate, state } = useContext(globalContext);

    const exampleExchangeRate = 1.1;
    const exampleDefault = 6;
    const exampleExchangeRate2 = 1.25;
    const exampleExchangeRate3 = 1.5;
    const controlSplitTargetPosition = 6;  // 4th position from the left
    // Careful when changing these: depending on exampleExchangeRate3, split-question could be impossible to answer if
    // the currency rounds to fewer decimals than exampleExchangeRate3 has. By choosing 1.5 and 6 steps as target,
    // this is impossible.
    const controlSplitTargetAmount = parameter.basePayoff +
        (parameter.numSteps - controlSplitTargetPosition) * parameter.budget / parameter.numSteps

    // In this case, we need to extract the left/right values from the CTBslider component,
    // because we'd like to show them in the text as well.
    let leftValue = parameter.budget - state["instructions-example_value"] + parameter.basePayoff
    let rightValue = state["instructions-example_value"] * exampleExchangeRate + parameter.basePayoff

    const translationStrings = {
        numDecisionsTotal: parameter.exchangeRates.length * 3,
        leftValue: c(leftValue),
        rightValue: c(rightValue),
        amount: c("symbol") === "points" ? t("amount-of-points") : t("amount-of-money"),
        oneUnit: c(1),
        rateUnit: c(exampleExchangeRate),
        date0: relativeDate(parameter.dates[0]).relativeString,
        date1: relativeDate(parameter.dates[1]).relativeString,
    }

    return (
        <Container>
            <Title>{t("forwords-title-1")}</Title>
            <Text>{t("forwords-text-1", translationStrings)}</Text>

            <CTBSlider
                name={"instructions-example"}
                label={t("forwords-example-label")}
                budget={parameter.budget}
                numSteps={parameter.numSteps}
                leftDate={parameter.dates[0]}
                rightDate={parameter.dates[2]}
                defaultValue={exampleDefault}
                exchangeRate={exampleExchangeRate}
                basePayoff={parameter.basePayoff}
            />
            <Text>{t("forwords-text-2", translationStrings)}</Text>

            
            <Title>{t("forwords-title-2")}</Title>
            <Text>{t("forwords-text-3")}</Text>

                <CTBSlider
                    name={"forwords-text-4"}
                    decisionLabel={t("forwords-text-4", translationStrings)}
                    exchangeRateLabel={t("forwords-text-5", translationStrings)}
                    budget={parameter.budget}
                    numSteps={parameter.numSteps}
                    leftDate={parameter.dates[0]}
                    rightDate={parameter.dates[2]}
                    exchangeRate={exampleExchangeRate2}
                    basePayoff={parameter.basePayoff}
                />

                <Text>{t("forwords-maximum-date2-label")}</Text>

                <div className={"h-8"}></div>

                <Title size={"h2"}>{t("control-questions")}</Title>


                <Text>{t("control-text-3", translationStrings)}</Text>

                <ValidatedNumberInput
                    name="control-maximum-date2"
                    label={ t("forwords-maximum-date2-label", translationStrings) }
                    additionalInformationText={ t("control-maximum-date2-additional-information-text", translationStrings) }
                    solutionInformationText={ t("control-maximum-date2-solution-information-text", translationStrings) }
                    validationCallback={ validation["controlMaximum2"] }
                    required
                    unit={c("symbol")}
                />
                <SelectInput
                    name="select-input"
                    label={ t("select-input-label") }
                    placeholder={ t("select-input-placeholder") }
                    //defaultValue={2}
                    valueErrorMessage={ t("select-input-value-error-message") }
                    required
                    requiredErrorMessage={ t("select-input-required-error-message") }
                >
                    <SelectInputOption value={1}>{ t("select-input-first-option") }</SelectInputOption>
                    <SelectInputOption value={2}>{ t("select-input-second-option") }</SelectInputOption>
                    <SelectInputOption value={3}>{ t("select-input-third-option") }</SelectInputOption>
                </SelectInput>
                <RadioInput
                    name="radio-input"
                    label={ t("radio-input-label") }
                    required
                    requiredErrorMessage={ t("radio-input-required-error-message") }
                >
                    <RadioInputOption value={1}>{ t("radio-input-first-option") }</RadioInputOption>
                    <RadioInputOption value={2}>{ t("radio-input-second-option") }</RadioInputOption>
                    <RadioInputOption value={3}>{ t("radio-input-third-option") }</RadioInputOption>
                </RadioInput>
                <Slider
                    name="slider"
                    label={ t("slider-label") }
                    min={0}
                    max={10}
                    step={1}
                    //defaultValue={3}
                    required
                    requiredErrorMessage={ t("slider-required-error-message") }
                    showMarks
                />
            <Button />
        </Container>
        
    );
    };


// Export.
export default P0_forwords;