// Imports.
import React from "react";
import PropTypes from 'prop-types';

// The bullet point list.
export const BulletPointList = (props) => {
    return (
        <div className="my-2">
            {
                props.label !== undefined && props.label !== "" &&
                <div className="mb-1">
                    {props.label}
                </div>
            }
            <ul className='list-disc list-inside'>
                {props.children}
            </ul>
        </div>
    );
};

// The bullet point list item.
export const BulletPointListItem = (props) => {
    return (
        <li>
            {props.children}
        </li>
    );
};

// Checking props.
BulletPointList.propTypes = {
    label: PropTypes.string,
}