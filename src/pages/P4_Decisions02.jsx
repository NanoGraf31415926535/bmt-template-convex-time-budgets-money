// Imports.
import Calendar from "bmt-template-components-calendar";
import Container from "bmt-template-components-container";
import Title from "bmt-template-components-title";
import Text from "bmt-template-components-text";
import CTBSlider from "../components/CTBSlider";
import Form from "bmt-template-components-form";

import { useTranslation } from "react-i18next";

import {useContext} from "react";
import globalContext from "../context";


// The component.
const P4_Decisions02 = (props) => {
    // Mandatory definitions.
    const { t, i18n } = useTranslation();
    const { parameter, c, relativeDate } = useContext(globalContext);

    const offset = parameter.exchangeRates.length  // number of previous decisions.
    const [date0, date1, date2] = parameter.dates.map(relativeDate)

    const translationProps = {
        numDecisionsPer: parameter.exchangeRates.length,
        numDecisionsTotal: parameter.exchangeRates.length * 3,
        relativeDate0: date0.relativeString,
        relativeDate1: date1.relativeString,
        relativeDate2: date2.relativeString,
        longDate0: date0.longString,
        longDate1: date1.longString,
        longDate2: date2.longString,
        oneUnit: c(1),
        decisionsFrom: 1 + offset,
        decisionsTo: parameter.exchangeRates.length + offset
    }

    return (
        <Container>
            <Title>{t("decisions-title", translationProps)}</Title>
            <Text>{t("decisions-02-text-1", translationProps)}</Text>

            <Calendar
                startDate={date0.dateObject}
                endDate={date2.dateObject}
            />

            <Text>{t("decisions-02-text-2", translationProps)}</Text>

            <Form
                name="decisions-02-form"
                parameter={props.parameter}
                maxErrorCount={3}
            >
                {
                    parameter.exchangeRates.map((exchangeRate, index) =>
                        <CTBSlider
                            key={index}
                            name={`decision_02_${exchangeRate}`}
                            decisionLabel={t("decision-label", {number: index + 1 + offset})}
                            exchangeRateLabel={t("exchange-rate-label", {oneUnit: c(1), rateUnit: c(exchangeRate)})}
                            budget={parameter.budget}
                            numSteps={parameter.numSteps}
                            leftDate={date0.relative}
                            rightDate={date2.relative}
                            exchangeRate={exchangeRate}
                            basePayoff={parameter.basePayoff}
                            required
                        />
                    )
                }
            </Form>
        </Container>
    );
};

// Export.
export default P4_Decisions02;


