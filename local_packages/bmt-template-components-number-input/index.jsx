// Imports.
import React, { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';

// The component.
const NumberInput = (props) => {

    const { t } = useTranslation('bmt-template-components-number-input');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyValue = key + '_value';
    const keyStatus = key + '_status';

    const keyValueErrorOccurred = key + '_value-error-occurred';
    const keyNumberOfValueErrors = key + '_number-of-value-errors';
    const keyShowValueErrorMessage = key + '_show-value-error-message';
    const keyValueErrorMessageShown = key + '_value-error-message-shown';

    const keyRequiredErrorOccurred = key + '_required-error-occurred';
    const keyNumberOfRequiredErrors = key + '_number-of-required-errors';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';
    const keyRequiredErrorMessageShown = key + '_required-error-message-shown';

    // Functions for handling interaction with the component.
    const onInput = () => {
        // Change global state to hide the pattern error message.
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: 0,
            [keyShowValueErrorMessage]: false,
            [keyShowRequiredErrorMessage]: false
        }));
    };

    const onBlur = (e) => {
        // Get the value.
        const inputElem = e.target;

        // Check if the input is a number.
        // Set/Remove error class.
        if(props.required !== undefined && props.required && inputElem.value === "") {
            // Remove value from global state and set the error flag
            setState((prevState) => ({
                ...prevState,
                [keyValue]: "",
                [keyStatus]: -1,
                [keyRequiredErrorOccurred]: 1,
                [keyNumberOfRequiredErrors]: prevState[keyNumberOfRequiredErrors] + 1,
                [keyShowRequiredErrorMessage]: true,
                [keyRequiredErrorMessageShown]: 1,
            }));
        } else {
            if (isNaN(parseFloat(inputElem.value)) || !isFinite(inputElem.value)) {
                // Remove value from global state and set the error flag
                setState((prevState) => ({
                    ...prevState,
                    [keyValue]: "",
                    [keyStatus]: -1,
                    [keyValueErrorOccurred]: 1,
                    [keyNumberOfValueErrors]: prevState[keyNumberOfValueErrors] + 1,
                    [keyShowValueErrorMessage]: true,
                    [keyValueErrorMessageShown]: 1,
                }));
            } else if (props.max !== undefined && inputElem.value > props.max || props.min !== undefined && inputElem.value < props.min) {
                // Remove value from global state and set the error flag
                setState((prevState) => ({
                    ...prevState,
                    [keyValue]: "",
                    [keyStatus]: -1,
                    [keyValueErrorOccurred]: 1,
                    [keyNumberOfValueErrors]: prevState[keyNumberOfValueErrors] + 1,
                    [keyShowValueErrorMessage]: true,
                    [keyValueErrorMessageShown]: 1,
                }));
            } else {
                // Add to the global state.
                setState((prevState) => ({
                    ...prevState,
                    [keyValue]: inputElem.value,
                    [keyStatus]: 1
                }));
            }
        }
    };

    // Initial state values.
    useEffect(() => {
        // Add to the global state.
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: 0,
            [keyValue]: "",
            [keyValueErrorOccurred]: 0,
            [keyNumberOfValueErrors]: 0,
            [keyShowValueErrorMessage]: false,
            [keyValueErrorMessageShown]: 0,
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

            <div className="join">
                <input
                    type="number"
                    min={props.min}
                    max={props.max}
                    name={props.name}
                    className={`input input-bordered join-item w-40 ${
                        state[keyStatus] === 1 ? "input-success" : state[keyStatus] === -1 ? "input-error" : ""
                    }`}
                    placeholder={
                        props.placeholder || t("default-placeholder")
                    }
                    onInput={onInput}
                    onBlur={onBlur}
                    required={props.required !== undefined ? props.required : false}
                />
                {
                    props.unit &&
                    <div className={"join-item px-5 flex items-center justify-center bg-gray-300 font-medium"}>
                        {props.unit}
                    </div>
                }
            </div>

            {
                state[keyShowValueErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">
                            {
                                props.valueErrorMessage ??
                                (props.min !== undefined && props.max !== undefined) ?
                                    t("default-value-error-message-minmax", {min: props.min, max: props.max}) :
                                    props.min !== undefined ? t("default-value-error-message-min", {min: props.min}) :
                                        t("default-value-error-message-max", {max: props.max})
                            }
                        </span>
                    </div>
                )
            }

            {
                state[keyShowRequiredErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">
                            {props.requiredErrorMessage ?? t("default-required-error-message") }
                        </span>
                    </div>
                )
            }
        </div>
    );
};

// Checking props.
NumberInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    unit:PropTypes.string,
    valueErrorMessage: PropTypes.string,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string
}

// Export.
export default NumberInput;
