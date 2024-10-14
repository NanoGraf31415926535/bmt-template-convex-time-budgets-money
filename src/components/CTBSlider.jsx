import SliderGroup from "bmt-template-components-slider-group";
import PropTypes from "prop-types";

import {useContext} from "react";
import globalContext from "../context";

const CTBSlider = (props) => {

    const { c, relativeDate } = useContext(globalContext);

    const step = Math.floor(props.budget / props.numSteps*10000)/10000;
    // note: numSteps omits the 0 position (deliberately).
    // rounding down deals with the potential problem that the final step may otherwise be minimally above max due to
    // numerical imprecision, which would prevent it from being selectable.

    const basePayoff = props.basePayoff ?? 0;

    const date0 = relativeDate(props.leftDate);
    const date1 = relativeDate(props.rightDate);

    function capitalize(input){
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    const decisionLabel = <div className={"font-medium"}>{props.decisionLabel}</div>;

    const exchangeRateLabel = <div className={"text-center"}>{props.exchangeRateLabel}</div>;


    const leftLabel = <div className={"flex flex-col items-start"}>
        <div className={"font-medium text-lg"}>{capitalize(date0.relativeString)}</div>
        <div className={"text-sm"}>{date0.longString}</div>
    </div>;

    const rightLabel = <div className={"flex flex-col items-end"}>
        <div className={"font-medium text-lg"}>{capitalize(date1.relativeString)}</div>
        <div className={"text-sm"}>{date1.longString}</div>
    </div>;

    const leftOutcomeCallback = (value) => (
        <span className="text-xl">{c(props.budget - value + basePayoff)}</span>
    );
    const rightOutcomeCallback = (value) => (
        <span className="text-xl">{c(value * props.exchangeRate + basePayoff)}</span>
    );

    return <SliderGroup
        label={decisionLabel}
        name={props.name}
        min={0}
        max={props.budget}
        step={step}
        defaultValue={props.defaultValue}
        leftLabel={leftLabel}
        rightLabel={rightLabel}
        centerLabel={exchangeRateLabel}
        required={props.required}
        disabled={props.disabled}
        leftOutcomeCallback={leftOutcomeCallback}
        rightOutcomeCallback={rightOutcomeCallback}
    />
}

const relativeDateType = function(props, propName, componentName) {
    const prop = props[propName];
    const units = ["days", "weeks", "months"]
    if (!Array.isArray(prop) || prop.length !== 2 || !Number.isInteger(prop[0]) || !units.includes(prop[1])) {
        return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. Got ${JSON.stringify(prop)}, expected an array of the form [Integer, "days"|"weeks"|"months"].`)
    }
}

CTBSlider.propTypes = {
    name: PropTypes.string.isRequired,
    decisionLabel: PropTypes.node,
    exchangeRateLabel: PropTypes.node,
    budget: PropTypes.number.isRequired,
    numSteps: PropTypes.number.isRequired,
    leftDate: PropTypes.oneOfType([relativeDateType]).isRequired,
    rightDate: PropTypes.oneOfType([relativeDateType]).isRequired,
    defaultValue: PropTypes.number,
    required: PropTypes.bool,
    basePayoff: PropTypes.number,
    exchangeRate: PropTypes.number.isRequired,
}

CTBSlider.validationType = "SliderGroup";

export default CTBSlider;