// Imports.
import React, { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';

// The component.
const TextArea = (props) => {

    const { t } = useTranslation('bmt-template-components-text-area');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyValue = key + '_value';
    const keyStatus = key + '_status';

    const keyRequiredErrorOccurred = key + '_required-error-occurred';
    const keyNumberOfRequiredErrors = key + '_number-of-required-errors';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';
    const keyRequiredErrorMessageShown = key + '_required-error-message-shown';

    // Functions for handling interaction with the component.
    const onInput = () => {
        // Change global state to hide the pattern error message (if visible).
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: 0,
            [keyShowRequiredErrorMessage]: false
        }));
    };

    const onBlur = (e) => {
        // Get the value.
        const inputElem = e.target;

        // Check if required and the string is empty.
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
            // Add to the global state.
            setState((prevState) => ({
                ...prevState,
                [keyValue]: inputElem.value,
                [keyStatus]: 1
            }));
        }
    };

    // Initial state values.
    useEffect(() => {
        // Add to the global state.
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: 0,
            [keyValue]: "",
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

            <div className="w-full">
                <textarea
                    name={props.name}
                    className={`block p-2.5 border border-grey-500 rounded-lg w-full ${
                        state[keyStatus] === 1 ? "input-success" : state[keyStatus] === -1 ? "input-error" : ""
                    }`}
                    rows={4}
                    placeholder={
                        props.placeholder !== undefined ? props.placeholder :t ("default-placeholder")
                    }
                    onInput={onInput}
                    onBlur={onBlur}
                    required={props.required !== undefined ? props.required : false}
                />
            </div>

            {
                state[keyShowRequiredErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">
                            { props.requiredErrorMessage || t("default-required-error-message") }
                        </span>
                    </div>
                )
            }
        </div>
    );
};

// Checking props.
TextArea.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    requiredErrorMessage: PropTypes.string,
    required: PropTypes.bool
}

// Export.
export default TextArea;
