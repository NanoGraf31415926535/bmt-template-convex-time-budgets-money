// Imports.
import React, { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';
import "bootstrap-icons/font/bootstrap-icons.css";

// The component.
const ValidatedTextInput = (props) => {

    const { t } = useTranslation('bmt-template-components-validated-text-input');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyValue = key + '_value';
    const keyPreviousValues = key + '_previous-values';
    const keyStatus = key + '_status';

    const keyPatternErrorOccurred = key + '_pattern-error-occurred';
    const keyNumberOfPatternErrors = key + '_number-of-pattern-errors';
    const keyShowPatternErrorMessage = key + '_show-pattern-error-message';
    const keyPatternErrorMessageShown = key + '_pattern-error-message-shown';

    const keyShowAdditionalInformation = key + '_show-additional-information';
    const keyAdditionalInformationShown = key + '_additional-information-shown';
    const keyAdditionalInformationAvailable = key + '_additional-information-available';

    const keyShowSolutionInformation = key + '_show-solution-information';
    const keySolutionInformationShown = key + '_solution-information-shown';
    const keySolutionInformationAvailable = key + '_solution-information-available';

    const keyValidationErrorOccurred = key + '_validation-error-occurred';
    const keyNumberOfValidationErrors = key + '_number-of-validation-errors';

    const keyRequiredErrorOccurred = key + '_required-error-occurred';
    const keyNumberOfRequiredErrors = key + '_number-of-required-errors';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';
    const keyRequiredErrorMessageShown = key + '_required-error-message-shown';

    // Functions for handling interaction with the component.
    const toggleAdditionalInformation = () => {
        // Change global state.
        setState((prevState) => ({
            ...prevState,
            [keyShowAdditionalInformation]: !prevState[keyShowAdditionalInformation],
            [keyAdditionalInformationShown]: 1,
        }));
    };

    const onInput = () => {
        // Change global state to hide the pattern error message.
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: 0,
            [keyShowPatternErrorMessage]: false,
            [keyShowRequiredErrorMessage]: false
        }));
    };

    const onBlur = (e) => {
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
            // Check if the input matches the pattern (if existent).
            if (props.pattern !== undefined && props.pattern !== "") {
                // Validate.
                const regExpObject = new RegExp(props.pattern);
                const currentValue = inputElem.value;

                // Set/Remove error class.
                if (regExpObject.test(currentValue)) {
                    // Add to the global state.
                    setState((prevState) => ({
                        ...prevState,
                        [keyValue]: inputElem.value,
                        [keyStatus]: 0,
                    }));
                } else {
                    // Remove value from global state and set the error flag
                    setState((prevState) => ({
                        ...prevState,
                        [keyValue]: "",
                        [keyStatus]: -1,
                        [keyPatternErrorOccurred]: 1,
                        [keyNumberOfPatternErrors]: prevState[keyNumberOfPatternErrors] + 1,
                        [keyShowPatternErrorMessage]: true,
                        [keyPatternErrorMessageShown]: 1,
                    }));
                }
            } else {
                // Add to the global state.
                setState((prevState) => ({
                    ...prevState,
                    [keyValue]: inputElem.value,
                    [keyStatus]: 0,
                }));
            }
        }
    };

    // Initial state values.
    useEffect(() => {
        // Add to the global state.
        setState((prevState) => ({
            ...prevState,
            [keyValue]: "",
            [keyPreviousValues]: [],
            [keyStatus]: 0,
            [keyPatternErrorOccurred]: 0,
            [keyNumberOfPatternErrors]: 0,
            [keyShowPatternErrorMessage]: false,
            [keyPatternErrorMessageShown]: 0,
            [keyShowAdditionalInformation]: false,
            [keyAdditionalInformationShown]: 0,
            [keyAdditionalInformationAvailable]: (props.additionalInformationTitle !== undefined && props.additionalInformationTitle !== "") || (props.additionalInformationText !== undefined && props.additionalInformationText !== ""),
            [keyShowSolutionInformation]: false,
            [keySolutionInformationShown]: 0,
            [keySolutionInformationAvailable]: (props.solutionInformationTitle !== undefined && props.solutionInformationTitle !== "") || (props.solutionInformationText !== undefined && props.solutionInformationText !== ""),
            [keyValidationErrorOccurred]: 0,
            [keyNumberOfValidationErrors]: 0,
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
                <span>
                    {props.label}
                </span>
                {
                    state[keyAdditionalInformationAvailable] &&
                    (
                        <button onClick={toggleAdditionalInformation} className="ml-2 text-xl text-gray-500 leading-[0]" type="button">
                            <i className="bi bi-info-circle align-middle"/>
                        </button>
                    )
                }
            </div>


            <div className="w-full">
                <input
                    type="text"
                    name={props.name}
                    className={`input input-bordered w-full ${
                        state[keyStatus] === 1 ? "input-success" : state[keyStatus] === -1 ? "input-error" : ""
                    }`}
                    placeholder={
                        props.placeholder !== undefined  ? props.placeholder : t("default-placeholder")
                    }
                    onInput={onInput}
                    onBlur={onBlur}
                    required={props.required !== undefined ? props.required : false}
                />
            </div>

            {
                state[keyShowPatternErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">
                            { props.patternErrorMessage || t("default-pattern-error-message") }
                        </span>
                    </div>
                )
            }

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

            {
                state[keyAdditionalInformationAvailable] && state[keyShowAdditionalInformation] &&
                (
                    <div className="ml-1 mt-1">
                        <div>
                            <strong>{ props.additionalInformationTitle || t("default-additional-information-title")}</strong>
                        </div>
                        {
                            props.additionalInformationText !== undefined && props.additionalInformationText !== "" &&
                            <div>
                                {props.additionalInformationText}
                            </div>
                        }
                    </div>
                )
            }

            {
                state[keySolutionInformationAvailable] && state[keyShowSolutionInformation] &&
                (
                    <div className="ml-1 mt-1">
                        <div>
                            <strong>{ props.solutionInformationTitle || t("default-solution-information-title")}</strong>
                        </div>
                        {
                            props.solutionInformationText !== undefined && props.solutionInformationText !== "" &&
                            <div>
                                {props.solutionInformationText}
                            </div>
                        }
                    </div>
                )
            }
        </div>
    );
};

// Checking props.
ValidatedTextInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    pattern: PropTypes.string,
    patternErrorMessage: PropTypes.string,
    additionalInformationTitle: PropTypes.string,
    additionalInformationText: PropTypes.string,
    solutionInformationTitle: PropTypes.string,
    solutionInformationText: PropTypes.string,
    validationCallback: PropTypes.func.isRequired,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string,
}

// Export.
export default ValidatedTextInput;
