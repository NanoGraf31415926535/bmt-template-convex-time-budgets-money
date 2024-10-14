// Imports.
import React from "react";
import PropTypes from 'prop-types';

// The component.
const Title = (props) => {
    return (
        <>
            {
                props.size !== undefined && props.size === 'h1' &&
                <h1 className={"text-2xl sm:text-3xl font-medium text-gray-900 mt-2 mb-4"
                    + (props.alignment !== undefined && props.alignment === "left" ? " text-left" : "")
                    + (props.alignment !== undefined && props.alignment === "center" ? " text-center" : "")
                    + (props.alignment !== undefined && props.alignment === "right" ? " text-right" : "")
                }>
                    {props.children}
                </h1>
            }
            {
                props.size !== undefined && props.size === 'h2' &&
                <h2 className={"text-lg sm:text-2xl font-medium text-gray-900 mt-1 mb-3"
                    + (props.alignment !== undefined && props.alignment === "left" ? " text-left" : "")
                    + (props.alignment !== undefined && props.alignment === "center" ? " text-center" : "")
                    + (props.alignment !== undefined && props.alignment === "right" ? " text-right" : "")
                }>
                    {props.children}
                </h2>
            }
            {
                props.size !== undefined && props.size === 'h3' &&
                <h3 className={"text-sm sm:text-lg font-medium text-gray-900 mt-1 mb-3"
                    + (props.alignment !== undefined && props.alignment === "left" ? " text-left" : "")
                    + (props.alignment !== undefined && props.alignment === "center" ? " text-center" : "")
                    + (props.alignment !== undefined && props.alignment === "right" ? " text-right" : "")
                }>
                    {props.children}
                </h3>
            }
            {
                props.size === undefined &&
                <h1 className={"text-2xl sm:text-3xl font-medium text-gray-900 mt-2 mb-4"
                    + (props.alignment !== undefined && props.alignment === "left" ? " text-left" : "")
                    + (props.alignment !== undefined && props.alignment === "center" ? " text-center" : "")
                    + (props.alignment !== undefined && props.alignment === "right" ? " text-right" : "")
                }>
                    {props.children}
                </h1>
            }
        </>
    );
};

// Checking props.
Title.propTypes = {
    size: PropTypes.string,
    alignment: PropTypes.string,
}

// Export.
export default Title;