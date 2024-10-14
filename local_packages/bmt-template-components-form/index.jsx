// Imports.
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// Imports for accessing the global state.
import { useContext } from "react";
import globalContext from "../../src/context";
import { useNavigate } from "react-router-dom";

// The component.
const Form = (props) => {
    const { t } = useTranslation('bmt-template-components-form');
    // Get the global state and define the keys for accessing data in the global state.
    const navigate = useNavigate();
    const { state, setState } = useContext(globalContext);
    const keyOrderOfPages = "order-of-pages";
    const key = props.name;
    const keyShowSolutionModal = key + '_show-solution-modal';
    const keySolutionModalShown = key + '_solution-modal-shown';
    const keySubmitCount = key + '_submit-count';
    const currentTarget = props.target ?? '';

    // Initial state values.
    useEffect(() => {
        // Add to the global state.
        setState((prevState) => ({
            ...prevState,
            [keyShowSolutionModal]: false,
            [keySolutionModalShown]: 0,
            [keySubmitCount]: 0,
        }));
    }, []);

    // Functions for handling interaction with the component.
    const toggleSolutionModal = () => {
        // Change global state according to the current state.
        if (!state[keyShowSolutionModal] && state[keySolutionModalShown] === 0) {
            setState((prevState) => ({
                ...prevState,
                [keyShowSolutionModal]: true,
                [keySolutionModalShown]: 1,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                [keyShowSolutionModal]: false,
            }));
        }
    };

    const onSubmit = (e) => {
        // Do not use the standard submit handling.
        e.preventDefault();

        // Probably wrap the children because a single child is not contained in an array.
        let propsChildrenWrapper = null;
        if (!Array.isArray(props.children)) {
            propsChildrenWrapper = Array(props.children);
        } else {
            propsChildrenWrapper = props.children;
        }

        // Check for required errors for components with specific implementation.
        // Currently: slider-group.
        // todo: this is preliminary. We will probably want to re-organize the validation code anyways and then
        //  decide on order, precedence etc., e.g. whether patternError needs to run even if a requiredError was found.
        //  once that is settled, we can also decide whether to collect checks in a single loop etc.
        // todo: how to handle composed components (e.g. CTBSlider is a specialization of SliderGroup;
        //  ideally, should check only the latter; but it will not be a direct child of form.
        let requiredErrorFound = false;

        for (let i = 0; i < propsChildrenWrapper.length; i++) {

            const currentChild = propsChildrenWrapper[i];
            // Get some data about the component.
            const typeOfChild = React.isValidElement(currentChild) &&
                typeof currentChild.type !== "string" ? (currentChild.validationType || currentChild.type.name) : "";
            // note: .validationType allows to validate a specialized component the same way
            //  the original component would be validated. To that end, add the name of the original component as
            //  according property before exporting the specialized component.
            
            switch (typeOfChild){
                case "CTBSlider":
                    const required = currentChild.props.required;
                    const key = currentChild.props.name;
                    const keyActivated = `${key}_activated`;
                    const keyActivatedError = `${key}_activated_error`;

                    if (required && !state[keyActivated]){
                        setState((prevState) => ({
                            ...prevState,
                            [keyActivatedError]: true,
                        }));
                        requiredErrorFound = true
                    }
                    break;

                default:
                    break;

            }
        }
        // todo: For now, skip all other validation and fail if at least one requiredError occurred
        if (requiredErrorFound){
            return;
        }

        // First check if there is pattern error in one of the relevant children.
        let patternErrorFound = false;
        for (let i = 0; i < propsChildrenWrapper.length; i++) {
            // Stop?
            if (patternErrorFound) {
                break;
            }

            // Get the current children.
            const currentChild = propsChildrenWrapper[i];

            // Get some data about the component.
            const typeOfChild = React.isValidElement(currentChild) && typeof currentChild.type !== "string" ? currentChild.type.name : "";

            // Behave according to the current component type.
            // Only some children may have the functionality of checking for a pattern.
            // Define some keys for accessing the global state.
            const currentKey = currentChild.props.name;
            const currentKeyShowPatternErrorMessage = currentKey + '_show-pattern-error-message';

            switch (typeOfChild) {
                case "TextInput":
                    // Check.
                    if (state[currentKeyShowPatternErrorMessage]) {
                        patternErrorFound = true;
                        continue;
                    }

                    break;

                case "ValidatedTextInput":
                    // Check.
                    if (state[currentKeyShowPatternErrorMessage]) {
                        patternErrorFound = true;
                        continue;
                    }

                    break;

                default:
                    break;
            }
        }

        // Only validate, when there was no pattern error found.
        if (patternErrorFound) {
            return;
        }

        // Validate.
        let validationErrorFound = false;
        for (let i = 0; i < propsChildrenWrapper.length; i++) {
            // Get the current children.
            const currentChild = propsChildrenWrapper[i];

            // Get some data about the component.
            const typeOfChild = currentChild.type.name;

            // Behave according to the current component type.
            switch (typeOfChild) {
                case "ValidatedTextInput": {
                    // Define some keys for accessing the global state.
                    const currentKey = currentChild.props.name;
                    const currentKeyValue = currentKey + '_value';
                    const currentKeyPreviousValues = currentKey + '_previous-values';
                    const currentKeyStatus = currentKey + '_status';

                    const currentKeyShowAdditionalInformation = currentKey + '_show-additional-information';
                    const currentKeyAdditionalInformationShown = currentKey + '_additional-information-shown';
                    const currentKeyAdditionalInformationAvailable = currentKey + '_additional-information-available';

                    const currentKeyValidationErrorOccurred = currentKey + '_validation-error-occurred';
                    const currentKeyNumberOfValidationErrors = currentKey + '_number-of-validation-errors';

                    const currentKeyShowSolutionInformation = currentKey + '_show-solution-information';
                    const currentKeySolutionInformationShown = currentKey + '_solution-information-shown';
                    const currentKeySolutionInformationAvailable = currentKey + '_solution-information-available';

                    // Get the current value of the field.
                    const currentValue = state[currentKeyValue];
                    const currentValidationResult = currentChild.props.validationCallback(currentValue, props.parameter);

                    // Behave according to the result.
                    if (currentValidationResult) {
                        // Adjust the global state.
                        setState((prevState) => ({
                            ...prevState,
                            [currentKeyStatus]: 1,
                            [currentKeyShowAdditionalInformation]: false,
                        }));
                    } else {
                        // Set the flag to not submit but keep going.
                        validationErrorFound = true;

                        // Is the error count above the threshold?
                        if (state[currentKeyNumberOfValidationErrors] + 1 >= props.maxErrorCount) {
                            // Increase the error count in the global state and show the solution information.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: false,
                                [currentKeyShowSolutionInformation]: prevState[currentKeySolutionInformationAvailable],
                                [currentKeySolutionInformationShown]: prevState[currentKeySolutionInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));

                            // Show modal.
                            toggleSolutionModal();
                        } else {
                            // Increase the error count in the global state.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: prevState[currentKeyAdditionalInformationAvailable],
                                [currentKeyAdditionalInformationShown]: prevState[currentKeyAdditionalInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));
                        }
                    }
                    break;
                }

                case "ValidatedNumberInput": {
                    // Define some keys for accessing the global state.
                    const currentKey = currentChild.props.name;
                    const currentKeyValue = currentKey + '_value';
                    const currentKeyPreviousValues = currentKey + '_previous-values';
                    const currentKeyStatus = currentKey + '_status';

                    const currentKeyShowAdditionalInformation = currentKey + '_show-additional-information';
                    const currentKeyAdditionalInformationShown = currentKey + '_additional-information-shown';
                    const currentKeyAdditionalInformationAvailable = currentKey + '_additional-information-available';

                    const currentKeyValidationErrorOccurred = currentKey + '_validation-error-occurred';
                    const currentKeyNumberOfValidationErrors = currentKey + '_number-of-validation-errors';

                    const currentKeyShowSolutionInformation = currentKey + '_show-solution-information';
                    const currentKeySolutionInformationShown = currentKey + '_solution-information-shown';
                    const currentKeySolutionInformationAvailable = currentKey + '_solution-information-available';

                    // Get the current value of the field.
                    const currentValue = state[currentKeyValue];
                    const currentValidationResult = currentChild.props.validationCallback(currentValue, props.parameter);

                    // Behave according to the result.
                    if (currentValidationResult) {
                        // Adjust the global state.
                        setState((prevState) => ({
                            ...prevState,
                            [currentKeyStatus]: 1,
                            [currentKeyShowAdditionalInformation]: false,
                        }));
                    } else {
                        // Set the flag to not submit but keep going.
                        validationErrorFound = true;

                        // Is the error count above the threshold?
                        if (state[currentKeyNumberOfValidationErrors] + 1 >= props.maxErrorCount) {
                            // Increase the error count in the global state and show the solution information.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: false,
                                [currentKeyShowSolutionInformation]: prevState[currentKeySolutionInformationAvailable],
                                [currentKeySolutionInformationShown]: prevState[currentKeySolutionInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));

                            // Show modal.
                            toggleSolutionModal();
                        } else {
                            // Increase the error count in the global state.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: prevState[currentKeyAdditionalInformationAvailable],
                                [currentKeyAdditionalInformationShown]: prevState[currentKeyAdditionalInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));
                        }
                    }
                    break;
                }

                case "ValidatedSelectInput": {
                    // Define some keys for accessing the global state.
                    const currentKey = currentChild.props.name;
                    const currentKeyValue = currentKey + '_value';
                    const currentKeyPreviousValues = currentKey + '_previous-values';
                    const currentKeyStatus = currentKey + '_status';

                    const currentKeyShowAdditionalInformation = currentKey + '_show-additional-information';
                    const currentKeyAdditionalInformationShown = currentKey + '_additional-information-shown';
                    const currentKeyAdditionalInformationAvailable = currentKey + '_additional-information-available';

                    const currentKeyValidationErrorOccurred = currentKey + '_validation-error-occurred';
                    const currentKeyNumberOfValidationErrors = currentKey + '_number-of-validation-errors';

                    const currentKeyShowSolutionInformation = currentKey + '_show-solution-information';
                    const currentKeySolutionInformationShown = currentKey + '_solution-information-shown';
                    const currentKeySolutionInformationAvailable = currentKey + '_solution-information-available';

                    // Get the current value of the field.
                    const currentValue = state[currentKeyValue];
                    const currentValidationResult = currentChild.props.validationCallback(currentValue, props.parameter);

                    // Behave according to the result.
                    if (currentValidationResult) {
                        // Adjust the global state.
                        setState((prevState) => ({
                            ...prevState,
                            [currentKeyStatus]: 1,
                            [currentKeyShowAdditionalInformation]: false,
                        }));
                    } else {
                        // Set the flag to not submit but keep going.
                        validationErrorFound = true;

                        // Is the error count above the threshold?
                        if (state[currentKeyNumberOfValidationErrors] + 1 >= props.maxErrorCount) {
                            // Increase the error count in the global state and show the solution information.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: false,
                                [currentKeyShowSolutionInformation]: prevState[currentKeySolutionInformationAvailable],
                                [currentKeySolutionInformationShown]: prevState[currentKeySolutionInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));

                            // Show modal.
                            toggleSolutionModal();
                        } else {
                            // Increase the error count in the global state.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: prevState[currentKeyAdditionalInformationAvailable],
                                [currentKeyAdditionalInformationShown]: prevState[currentKeyAdditionalInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));
                        }
                    }
                    break;
                }

                case "ValidatedRadioInput": {
                    // Define some keys for accessing the global state.
                    const currentKey = currentChild.props.name;
                    const currentKeyValue = currentKey + '_value';
                    const currentKeyPreviousValues = currentKey + '_previous-values';
                    const currentKeyStatus = currentKey + '_status';

                    const currentKeyShowAdditionalInformation = currentKey + '_show-additional-information';
                    const currentKeyAdditionalInformationShown = currentKey + '_additional-information-shown';
                    const currentKeyAdditionalInformationAvailable = currentKey + '_additional-information-available';

                    const currentKeyValidationErrorOccurred = currentKey + '_validation-error-occurred';
                    const currentKeyNumberOfValidationErrors = currentKey + '_number-of-validation-errors';

                    const currentKeyShowSolutionInformation = currentKey + '_show-solution-information';
                    const currentKeySolutionInformationShown = currentKey + '_solution-information-shown';
                    const currentKeySolutionInformationAvailable = currentKey + '_solution-information-available';

                    // Get the current value of the field.
                    const currentValue = state[currentKeyValue];
                    const currentValidationResult = currentChild.props.validationCallback(currentValue, props.parameter);

                    // Behave according to the result.
                    if (currentValidationResult) {
                        // Adjust the global state.
                        setState((prevState) => ({
                            ...prevState,
                            [currentKeyStatus]: 1,
                            [currentKeyShowAdditionalInformation]: false,
                        }));
                    } else {
                        // Set the flag to not submit but keep going.
                        validationErrorFound = true;

                        // Is the error count above the threshold?
                        if (state[currentKeyNumberOfValidationErrors] + 1 >= props.maxErrorCount) {
                            // Increase the error count in the global state and show the solution information.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: false,
                                [currentKeyShowSolutionInformation]: prevState[currentKeySolutionInformationAvailable],
                                [currentKeySolutionInformationShown]: prevState[currentKeySolutionInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));

                            // Show modal.
                            toggleSolutionModal();
                        } else {
                            // Increase the error count in the global state.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: prevState[currentKeyAdditionalInformationAvailable],
                                [currentKeyAdditionalInformationShown]: prevState[currentKeyAdditionalInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));
                        }
                    }
                    break;
                }

                case "ValidatedMultipleChoice": {
                    // Define some keys for accessing the global state.
                    const currentKey = currentChild.props.name;
                    const currentKeyValue = currentKey + '_values';
                    const currentKeyPreviousValues = currentKey + '_previous-values';
                    const currentKeyStatus = currentKey + '_status';

                    const currentKeyShowAdditionalInformation = currentKey + '_show-additional-information';
                    const currentKeyAdditionalInformationShown = currentKey + '_additional-information-shown';
                    const currentKeyAdditionalInformationAvailable = currentKey + '_additional-information-available';

                    const currentKeyValidationErrorOccurred = currentKey + '_validation-error-occurred';
                    const currentKeyNumberOfValidationErrors = currentKey + '_number-of-validation-errors';

                    const currentKeyShowSolutionInformation = currentKey + '_show-solution-information';
                    const currentKeySolutionInformationShown = currentKey + '_solution-information-shown';
                    const currentKeySolutionInformationAvailable = currentKey + '_solution-information-available';

                    // Get the current value of the field.
                    const currentValue = state[currentKeyValue];
                    const currentValidationResult = currentChild.props.validationCallback(currentValue, props.parameter);

                    // Behave according to the result.
                    if (currentValidationResult) {
                        // Adjust the global state.
                        setState((prevState) => ({
                            ...prevState,
                            [currentKeyStatus]: 1,
                            [currentKeyShowAdditionalInformation]: false,
                        }));
                    } else {
                        // Set the flag to not submit but keep going.
                        validationErrorFound = true;

                        // Is the error count above the threshold?
                        if (state[currentKeyNumberOfValidationErrors] + 1 >= props.maxErrorCount) {
                            // Increase the error count in the global state and show the solution information.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: false,
                                [currentKeyShowSolutionInformation]: prevState[currentKeySolutionInformationAvailable],
                                [currentKeySolutionInformationShown]: prevState[currentKeySolutionInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));

                            // Show modal.
                            toggleSolutionModal();
                        } else {
                            // Increase the error count in the global state.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: prevState[currentKeyAdditionalInformationAvailable],
                                [currentKeyAdditionalInformationShown]: prevState[currentKeyAdditionalInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));
                        }
                    }
                    break;
                }

                case "ValidatedSlider": {
                    // Define some keys for accessing the global state.
                    const currentKey = currentChild.props.name;
                    const currentKeyValue = currentKey + '_value';
                    const currentKeyPreviousValues = currentKey + '_previous-values';
                    const currentKeyStatus = currentKey + '_status';

                    const currentKeyShowAdditionalInformation = currentKey + '_show-additional-information';
                    const currentKeyAdditionalInformationShown = currentKey + '_additional-information-shown';
                    const currentKeyAdditionalInformationAvailable = currentKey + '_additional-information-available';

                    const currentKeyValidationErrorOccurred = currentKey + '_validation-error-occurred';
                    const currentKeyNumberOfValidationErrors = currentKey + '_number-of-validation-errors';

                    const currentKeyShowSolutionInformation = currentKey + '_show-solution-information';
                    const currentKeySolutionInformationShown = currentKey + '_solution-information-shown';
                    const currentKeySolutionInformationAvailable = currentKey + '_solution-information-available';

                    // Get the current value of the field.
                    const currentValue = state[currentKeyValue];
                    const currentValidationResult = currentChild.props.validationCallback(currentValue, props.parameter);

                    // Behave according to the result.
                    if (currentValidationResult) {
                        // Adjust the global state.
                        setState((prevState) => ({
                            ...prevState,
                            [currentKeyStatus]: 1,
                            [currentKeyShowAdditionalInformation]: false,
                        }));
                    } else {
                        // Set the flag to not submit but keep going.
                        validationErrorFound = true;

                        // Is the error count above the threshold?
                        if (state[currentKeyNumberOfValidationErrors] + 1 >= props.maxErrorCount) {
                            // Increase the error count in the global state and show the solution information.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: false,
                                [currentKeyShowSolutionInformation]: prevState[currentKeySolutionInformationAvailable],
                                [currentKeySolutionInformationShown]: prevState[currentKeySolutionInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));

                            // Show modal.
                            toggleSolutionModal();
                        } else {
                            // Increase the error count in the global state.
                            setState((prevState) => ({
                                ...prevState,
                                [currentKeyStatus]: -1,
                                [currentKeyValidationErrorOccurred]: 1,
                                [currentKeyNumberOfValidationErrors]: prevState[currentKeyNumberOfValidationErrors] + 1,
                                [currentKeyShowAdditionalInformation]: prevState[currentKeyAdditionalInformationAvailable],
                                [currentKeyAdditionalInformationShown]: prevState[currentKeyAdditionalInformationAvailable] ? 1 : 0,
                                [currentKeyPreviousValues]: prevState[currentKeyPreviousValues] + [prevState[currentValue]],
                            }));
                        }
                    }
                    break;
                }

                default:
                    break;
            }
        }

        // Increase the submit count in the global state.
        setState((prevState) => ({
            ...prevState,
            [keySubmitCount]: prevState[keySubmitCount] + 1,
        }));

        // Submit when there are no validation errors.
        if (!validationErrorFound) {
            if(currentTarget !== '') {
                navigate("/" + currentTarget);
            } else {
                // Get the current position in the pagePaths array.
                const currentPathArray = window.location.pathname.split('/');
                const currentPath = '/' + currentPathArray[currentPathArray.length - 1];
                const currentPathIndex = state[keyOrderOfPages].indexOf(currentPath);

                // Jump to the next page if the current page is not the last one.
                if (currentPathIndex < state[keyOrderOfPages].length - 1) {
                    navigate(state[keyOrderOfPages][currentPathIndex + 1]);
                } else {
                    console.log("Last one.");
                    // TODO: Finalize when the current page is the last one.
                }
            }
        }
    };

    // Return the component.
    return (
        <>
            {
                props.children !== undefined && <>
                    <form className="my-5 form-control" noValidate onSubmit={onSubmit}>
                        {props.children}
                        <div className="mt-10 flex justify-center">
                            <button className="btn btn-outline btn-primary" type="submit">
                                {t("submit")}
                            </button>
                        </div>
                    </form>
                    <div className={`modal ${state[keyShowSolutionModal] && "modal-open"}`}>
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">
                                { props.solutionModalTitle || t("default-solution-modal-title")}
                            </h3>
                            <p className="py-4">
                                { props.solutionModalText || t("default-solution-modal-text", {count: props.maxErrorCount})}
                            </p>

                            <div className="modal-action">
                                <label htmlFor="my-modal" className="btn" onClick={toggleSolutionModal}>
                                    { props.solutionModalButton || t("default-solution-modal-button") }
                                </label>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

// Checking props.
Form.propTypes = {
    name: PropTypes.string.isRequired,
    parameter: PropTypes.object,
    maxErrorCount: PropTypes.number,
    solutionModalTitle: PropTypes.string,
    solutionModalText: PropTypes.string,
    solutionModalButton: PropTypes.string,
    target: PropTypes.string
}

// Export.
export default Form;