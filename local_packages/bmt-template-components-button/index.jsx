// Imports.
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Imports for accessing the global state.
import { useContext } from "react";
import globalContext from "../../src/context";

// The component.
const Button = (props) => {
    // Initialize constants.
    const navigate = useNavigate();
    const { state, setState } = useContext(globalContext);
    const { t } = useTranslation('bmt-template-components-button');
    const keyOrderOfPages = "order-of-pages";
    const currentTarget = props.target ?? '';
    const currentURL = location.href;

    // Click handling.
    const handleClick = function(e) {
        if(currentTarget !== '') {
            if(currentTarget.startsWith('#')) {
                location.href = currentTarget;
                history.replaceState(null, null, currentURL);
            } else {
                navigate("/" + currentTarget);
            }
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

    // Return the component.
    return (
        <div className="my-5 flex justify-center">
            <button className="btn btn-outline btn-secondary" type="button" onClick={handleClick}>
                { props.children ?? t("next") }
            </button>
        </div>
    );
};

// Checking props.
Button.propTypes = {
    target: PropTypes.string,
}

// Export.
export default Button;
