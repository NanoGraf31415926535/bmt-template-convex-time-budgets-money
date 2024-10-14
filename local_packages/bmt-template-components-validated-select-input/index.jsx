// Imports.
import React, { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';
import "bootstrap-icons/font/bootstrap-icons.css";

// The validated select input.
export const ValidatedSelectInput = (props) => {

    const { t } = useTranslation('bmt-template-components-validated-select-input');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyValue = key + '_value';
    const keyPreviousValues = key + '_previous-values';
    const keyStatus = key + '_status';

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

    const handleInput = (e) => {
        const selectElem = e.target;

        if (props.required !== undefined && props.required && selectElem.value === "") {
            setState((prevState) => ({
                ...prevState,
                [keyStatus]: -1,
                [keyValue]: "",
                [keyRequiredErrorOccurred]: 1,
                [keyNumberOfRequiredErrors]: prevState[keyNumberOfRequiredErrors] + 1,
                [keyShowRequiredErrorMessage]: true,
                [keyRequiredErrorMessageShown]: 1,
            }));
        } else if (selectElem.value === "") {
            setState((prevState) => ({
                ...prevState,
                [keyStatus]: 0,
                [keyValue]: "",
                [keyShowRequiredErrorMessage]: false,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                [keyStatus]: 0,
                [keyValue]: selectElem.value,
                [keyShowRequiredErrorMessage]: false,
            }));
        }
    };

    // Initial state values.
    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            [keyStatus]: 0,
            [keyValue]: props.defaultValue ?? "",
            [keyPreviousValues]: [],
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

            <div className="w-full form-control">
                <select
                    name={props.name}
                    className={`select select-bordered bg-gray-100 ${
                        state[keyStatus] === 1 ? "select-success" : state[keyStatus] === -1 ? "select-error" : ""
                    }`}
                    defaultValue={props.defaultValue ?? ""}
                    onInput={handleInput}
                    required={props.required !== undefined ? props.required : false}
                >
                    <option value="" disabled>
                        {props.placeholder}
                    </option>
                    {props.children}
                </select>
            </div>
            {
                state[keyShowRequiredErrorMessage] &&
                (
                    <div className="ml-1 mt-1">
                        <span className="label-text-alt text-red-500">
                            { props.requiredErrorMessage || t("default-required-error-message")}
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

// The validated select input option.
export const ValidatedSelectInputOption = (props) => {
    return (
        <option value={props.value}>
            {props.children}
        </option>
    );
};

// Checking props.
ValidatedSelectInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.number,
    additionalInformationTitle: PropTypes.string,
    additionalInformationText: PropTypes.string,
    solutionInformationTitle: PropTypes.string,
    solutionInformationText: PropTypes.string,
    validationCallback: PropTypes.func.isRequired,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string
}

ValidatedSelectInputOption.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired
}