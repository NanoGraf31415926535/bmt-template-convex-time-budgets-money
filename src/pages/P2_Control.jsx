// Imports.
import Container from "bmt-template-components-container";
import Title from "bmt-template-components-title";
import Text from "bmt-template-components-text";
import ValidatedNumberInput from "bmt-template-components-validated-number-input";
import Form from "bmt-template-components-form";

import CTBSlider from "../components/CTBSlider";

import { useTranslation } from "react-i18next";

import {useContext} from "react";
import globalContext from "../context";


// The component.
const P2_Control = (props) => {
    // Mandatory definitions.
    const { t, i18n } = useTranslation();
    const { parameter, validation, c, relativeDate } = useContext(globalContext);



    const exampleExchangeRate2 = 1.25;
    const exampleExchangeRate3 = 1.5;
    const controlSplitTargetPosition = 6;  // 4th position from the left
    // Careful when changing these: depending on exampleExchangeRate3, split-question could be impossible to answer if
    // the currency rounds to fewer decimals than exampleExchangeRate3 has. By choosing 1.5 and 6 steps as target,
    // this is impossible.
    const controlSplitTargetAmount = parameter.basePayoff +
        (parameter.numSteps - controlSplitTargetPosition) * parameter.budget / parameter.numSteps


    const translationStrings = {
        numDecisionsTotal: parameter.exchangeRates.length * 3,
        amount: props.session['currency'] === "points" ? t("amount-of-points") : t("amount-of-money"),
        oneUnit: c(1),
        rateUnit2: c(exampleExchangeRate2),
        rateUnit3: c(exampleExchangeRate3),
        date0: relativeDate(parameter.dates[0]).relativeString,
        date1: relativeDate(parameter.dates[1]).relativeString,
        date2: relativeDate(parameter.dates[2]).relativeString,
        controlSplitTargetAmount: c(controlSplitTargetAmount),
        controlMaximum2Solution: c(parameter.budget * exampleExchangeRate2),
        controlMaximum0Solution: c(parameter.budget),
        controlSplitSolution: c(controlSplitTargetPosition * exampleExchangeRate3 + parameter.basePayoff)
    }

    return (
        <Container>
            <Title>{t("control-title")}</Title>
            <Text>{t("control-text-1")}</Text>
            <Form
                name="control-form"
                parameter={props.parameter}
                maxErrorCount={3}
            >

                <CTBSlider
                    name={"instructions-example-2"}
                    decisionLabel={t("instructions-example-2-decision-label", translationStrings)}
                    exchangeRateLabel={t("instructions-example-2-exchange-rate-label", translationStrings)}
                    budget={parameter.budget}
                    numSteps={parameter.numSteps}
                    leftDate={parameter.dates[0]}
                    rightDate={parameter.dates[2]}
                    exchangeRate={exampleExchangeRate2}
                    basePayoff={parameter.basePayoff}
                />

                <Text>{t("control-text-2")}</Text>

                <div className={"h-8"}></div>

                <Title size={"h2"}>{t("control-questions")}</Title>


                <Text>{t("control-text-3", translationStrings)}</Text>

                <ValidatedNumberInput
                    name="control-maximum-date2"
                    label={ t("control-maximum-date2-label", translationStrings) }
                    additionalInformationText={ t("control-maximum-date2-additional-information-text", translationStrings) }
                    solutionInformationText={ t("control-maximum-date2-solution-information-text", translationStrings) }
                    validationCallback={ validation["controlMaximum2"] }
                    required
                    unit={c("symbol")}
                />

                <ValidatedNumberInput
                    name="control-maximum-date0"
                    label={ t("control-maximum-date0-label", translationStrings) }
                    additionalInformationText={ t("control-maximum-date0-additional-information-text", translationStrings) }
                    solutionInformationText={ t("control-maximum-date0-solution-information-text", translationStrings) }
                    validationCallback={ validation["controlMaximum0"] }
                    required
                    unit={c("symbol")}
                />

                <Text>{t("control-text-4")}</Text>

                <CTBSlider
                    name={"instructions-example-3"}
                    decisionLabel={t("instructions-example-3-decision-label", translationStrings)}
                    exchangeRateLabel={t("instructions-example-3-exchange-rate-label", translationStrings)}
                    budget={parameter.budget}
                    numSteps={parameter.numSteps}
                    leftDate={parameter.dates[1]}
                    rightDate={parameter.dates[2]}
                    c={c}
                    exchangeRate={exampleExchangeRate3}
                    basePayoff={parameter.basePayoff}
                />

                <ValidatedNumberInput
                    name="control-split"
                    label={ t("control-split-label", translationStrings) }
                    additionalInformationText={ t("control-split-additional-information-text", translationStrings) }
                    solutionInformationText={ t("control-split-solution-information-text", translationStrings) }
                    validationCallback={ validation["controlSplit"] }
                    required
                    unit={c("symbol")}

                />
            </Form>
        </Container>
    );
};

// Export.
export default P2_Control;


