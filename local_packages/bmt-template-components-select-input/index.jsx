// Imports.
import React, { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';

// The select input.
export const SelectInput = (props) => {

    const { t } = useTranslation('bmt-template-components-select-input');

    // Get the global state and define the keys for accessing data in the global state.
    const { state, setState } = useContext(globalContext);
    const key = props.name;

    const keyStatus = key + '_status';
    const keyValue = key + '_value';

    const keyRequiredErrorOccurred = key + '_required-error-occurred';
    const keyNumberOfRequiredErrors = key + '_number-of-required-errors';
    const keyShowRequiredErrorMessage = key + '_show-required-error-message';
    const keyRequiredErrorMessageShown = key + '_required-error-message-shown';

    // Functions for handling interaction with the component.
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
                [keyStatus]: 1,
                [keyValue]: selectElem.value,
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
                            { props.requiredErrorMessage || t("default-required-error-message") }
                        </span>
                    </div>
                )
            }
        </div>
    );
};

// The select input option.
export const SelectInputOption = (props) => {
    return (
        <option value={props.value}>
            {props.children}
        </option>
    );
};

// Checking props.
SelectInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.number,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string,
}

SelectInputOption.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired
}
