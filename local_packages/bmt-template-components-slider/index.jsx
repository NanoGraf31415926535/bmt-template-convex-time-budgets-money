// Imports.
import React, { useEffect, useContext } from "react";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';

// The slider.
const Slider = (props) => {
    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyStatus = key + '_status';
    const keyValue = key + '_value';

    const keyRequiredErrorOccurred = key + '_required-error-occurred';
    const keyNumberOfRequiredErrors = key + '_number-of-required-errors';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';
    const keyRequiredErrorMessageShown = key + '_required-error-message-shown';

    const marks = Number(props.max / props.step);

    // Functions for handling interaction with the component.
    const handleInput = (e) => {
        const rangeElem = e.target;

        if (props.required !== undefined && props.required && rangeElem.value === "") {
            setState((prevState) => ({
                ...prevState,
                [keyStatus]: -1,
                [keyValue]: "",
                [keyRequiredErrorOccurred]: 1,
                [keyNumberOfRequiredErrors]: prevState[keyNumberOfRequiredErrors] + 1,
                [keyShowRequiredErrorMessage]: true,
                [keyRequiredErrorMessageShown]: 1,
            }));
        } else if (rangeElem.value === "") {
            setState((prevState) => ({
                ...prevState,
                [keyStatus]: 0,
                [keyValue]: "",
                [keyShowRequiredErrorMessage]: false,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                [keyStatus]: 1,
                [keyValue]: rangeElem.value,
                [keyShowRequiredErrorMessage]: false,
            }));
        }
    };

    // Initial state values.
    useEffect(() => {
        // Add to the global state.
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: props.defaultValue ? 1 : 0,
            [keyValue]: props.defaultValue ?? "",
            [keyRequiredErrorOccurred]: 0,
            [keyNumberOfRequiredErrors]: 0,
            [keyShowRequiredErrorMessage]: false,
            [keyRequiredErrorMessageShown]: 0,
        }));
    }, []);

    // Return the component.
    return (
        <div className="my-4">
            <div className="mb-1">
                {props.label}
            </div>

            <div className="w-full md:w-1/2 xxl:w-1/4 form-control">
                <input
                    type="range"
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    name={props.name}
                    className={`range range-sm ${
                        state[keyStatus] === 1 ? "range-success" : state[keyStatus] === -1 ? "range-error" : ""
                    }`}
                    defaultValue={props.defaultValue ?? ""}
                    onInput={handleInput}
                    required={props.required !== undefined ? props.required : false}
                />
                {
                    props.showMarks !== undefined && props.showMarks &&
                    (
                        <div className="w-full flex justify-between text-xs px-2">
                            {
                                [...Array(marks + 1)].map((_, index) => {
                                    return (
                                        <div className="flex flex-col justify-center items-center gap-2 text-md" key={index}>
                                            <span>|</span>
                                            <span>{props.min + index * props.step}</span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )
                }
            </div>

            {
                props.requiredErrorMessage !== undefined && props.requiredErrorMessage !== "" && state[keyShowRequiredErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">{props.requiredErrorMessage}</span>
                    </div>
                )
            }
        </div>
    );
};

// Checking props.
Slider.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    defaultValue: PropTypes.number,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string,
    showMarks: PropTypes.bool
}

// Export.
export default Slider;
