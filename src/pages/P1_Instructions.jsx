// Imports.
import Button from "bmt-template-components-button";
import Container from "bmt-template-components-container";
import Text from "bmt-template-components-text";
import Title from "bmt-template-components-title";

import CTBSlider from "../components/CTBSlider";

import { useTranslation } from "react-i18next";
import {useContext} from "react";
import globalContext from "../context";

// The component.
const P2_Control = (props) => {
    // Mandatory definitions.
    const { t, i18n } = useTranslation();
    const { parameter, validation, c, n, relativeDate, state } = useContext(globalContext);

    const exampleExchangeRate = 1.1;
    const exampleDefault = 6;

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
            <Title>{t("instructions-title")}</Title>
            <Text>{t("instructions-text-1", translationStrings)}</Text>

            <CTBSlider
                name={"instructions-example"}
                label={t("instructions-example-label")}
                budget={parameter.budget}
                numSteps={parameter.numSteps}
                leftDate={parameter.dates[0]}
                rightDate={parameter.dates[1]}
                defaultValue={exampleDefault}
                exchangeRate={exampleExchangeRate}
                basePayoff={parameter.basePayoff}
            />
            <Text>{t("instructions-text-2", translationStrings)}</Text>

            <Button />
        </Container>
    );
};


// Export.
export default P2_Control;


