// Imports.
import React, { useEffect, useContext } from "react";
import globalContext from "../../src/context";
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";

import style from "./SliderGroup.module.css";

// todo: validations (really needed: required, in case of no default. No custom validated version fine at first)
// todo: pulse looks bad in ff
// todo: maybe style thumb consistently across browsers
// todo: enable colored track as an option


// The slider group
const SliderGroup = (props) => {

    const { t } = useTranslation('bmt-template-components-slider-group');

    const { state, setState } = useContext(globalContext);

    const key = props.name;
    const keyInitialized =  `${key}_initialized`;
    const keyActivated = `${key}_activated`;
    const keyActivatedError = `${key}_activated_error`;
    const keyValue = `${key}_value`;

    useEffect(() => {
        if (!state[keyInitialized]){
            setState((prev)=>({
                ...prev,
                [keyInitialized]: true,
                [keyActivated]: props.defaultValue !== undefined,
                [keyValue]: props.defaultValue !== undefined ? props.defaultValue  : "",
            }))
        }
    }, []);

    function activate(e){
        if (!state[keyActivated]) {
            setValue(e.target.value)
            setState((prev)=>({
                ...prev,
                [keyActivated]: true
            }))
        }
    }

    function setValue(value){
        setState((prev)=>({
            ...prev,
            [keyValue]: value
        }))

    }

    return <div className="shadow-md p-5 rounded-md border border-slate-200 my-4">
        <div className={"mb-3"}>{props.label}</div>
        <div
            className={`${style["double-range-wrap"]} ${state[keyActivated] ? "" : style.inactive}`}
        >
            <div className="grid grid-cols-2 sm:flex sm:justify-between">
                <div>{props.leftLabel}</div>
                <div className={"order-last sm:order-none col-span-2 sm:col-auto"}>{props.centerLabel}</div>
                <div>{props.rightLabel}</div>
            </div>
            <div className={"relative"}>
                <input
                    type="range"
                    className={`${style.mozSlider} slider-range form-range w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer`}
                    onChange={(e)=>setValue(e.target.value)}
                    onTouchStart={activate}
                    onMouseDown={activate}
                    value={state[keyValue] !== undefined ? state[keyValue] : ""}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    disabled={props.disabled === true}
                />
                {   !state[keyActivated] &&
                    // <div className={`absolute z-10 t-0 bg-white bg-opacity-60 px-2 left-1/2 -translate-x-1/2 font-medium ${state[keyActivatedError]? "text-red-500" : ""}`}>
                    <div className={`absolute pointer-events-none z-10 top-0 ${style.activateOverlay} px-4 left-1/2 -translate-x-1/2 font-medium ${state[keyActivatedError]? "text-red-500" : ""}`}>
                        {t("please-activate")}
                    </div>
                }
            </div>
            {
                (props.showTicks || props.tickLabels) &&
                <div className="w-full flex justify-between text-xs">
                    {
                        [...Array((props.max-props.min)/props.step + 1)].map((_, index) => {
                            return (
                                <div className="flex flex-col justify-center w-0 items-center  px-2 text-md" key={index}>
                                    { props.showTicks && <span>|</span> }
                                    { props.tickLabels === "auto" ?
                                        <span className={"mt-1"}>{props.min + index * props.step}</span> :
                                        props.tickLabels ?
                                            <span className={"mt-1"}>{props.tickLabels[index]}</span> :
                                            null
                                    }
                                </div>
                            );
                        })
                    }
                </div>

            }
            {
                ( props.leftOutcomeCallback || props.centerOutcomeCallback || props.rightOutcomeCallback ) &&
                <div className="border rounded p-2 mt-2 font-medium relative">

                    {
                        (props.leftOutcomeCallback || props.rightOutcomeCallback) &&
                        <div className={"flex justify-between"}>
                            <output>
                                <div className={`transition-opacity duration-700 ${state[keyActivated] ? "opacity-100" : "invisible opacity-0"}`}>
                                    {state[keyActivated] ? props.leftOutcomeCallback?.(state[keyValue]) : props.leftOutcomeCallback?.(props.min)}
                                </div>
                            </output>
                            <output>
                                <div className={`transition-opacity duration-700 ${state[keyActivated] ? "opacity-100" : "invisible opacity-0"}`}>
                                    {state[keyActivated] ? props.rightOutcomeCallback?.(state[keyValue]) : props.rightOutcomeCallback?.(props.min)}
                                </div>
                            </output>
                        </div>
                    }
                    {
                        (props.centerOutcomeCallback) &&
                        <div className={"flex justify-center"}>
                            <output>
                                <div className={`transition-opacity duration-700 ${state[keyActivated] ? "opacity-100" : "invisible opacity-0"}`}>
                                    {state[keyActivated] ? props.centerOutcomeCallback(state[keyValue]) : props.centerOutcomeCallback(props.min)}
                                </div>
                            </output>
                        </div>
                    }
                </div>
            }
        </div>
    </div>

};

// Checking props.
SliderGroup.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    required: PropTypes.bool,
    requiredErrorMessage: PropTypes.string,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.number,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    leftLabel: PropTypes.node,
    centerLabel: PropTypes.node,
    rightLabel: PropTypes.node,
    leftOutcomeCallback: PropTypes.func,
    centerOutcomeCallback: PropTypes.func,
    rightOutcomeCallback: PropTypes.func,
    showTicks: PropTypes.bool,
    tickLabels: PropTypes.PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.oneOf(['auto']),
    ]),
}

// Export.
export default SliderGroup;
