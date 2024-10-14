// Imports.
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import {initReactI18next, useTranslation} from "react-i18next";
//%STATIC_PAGES_IMPORT%//

// Global state.
import { useState, useEffect } from "react";
import globalContext from "./context";

// Get the pages.
import * as PAGES from "./config/pages.json";

// Are there any pages?
if(Object.keys(PAGES["default"]).length === 0) {
    throw new Error("There are no pages defined.");
}

// Get the validation functions.
import * as VALIDATION_FUNCTIONS from "./functions/validation.js";

// Validate the pages and add the page paths to an array.
const validationFunctionsOfPage = {};
for (const page in PAGES["default"]) {
    let pathFound = false;
    let fileFound = false;
    const validationFunctionsOfCurrentPage = {};

    // Check for required entries and also that the randomness category is above zero when specified.
    for (const key in PAGES["default"][page]) {
        if (key === "path" && PAGES["default"][page][key] !== "") {
            pathFound = true;
        }

        if (key === "file" && PAGES["default"][page][key] !== "") {
            fileFound = true;
        }

        // todo: I am leaving the below in temporarily so the old way of accessing validation functions still works.
        //  should be removed once the props.validation way of accessing them is deprecated.
        if (key === "functions" && PAGES["default"][page][key] !== "") {
            if(!Array.isArray(PAGES["default"][page][key])) {
                throw new Error("There is a page defined which has a wrong functions array.");
            }
            for(const functionIndex in PAGES["default"][page][key]) {
                if(typeof PAGES["default"][page][key][functionIndex] !== "string") {
                    throw new Error("There is a page defined which has a wrong functions array.");
                }
                validationFunctionsOfCurrentPage[PAGES["default"][page][key][functionIndex]] = VALIDATION_FUNCTIONS[PAGES["default"][page][key][functionIndex]];
            }
            validationFunctionsOfPage[page] = validationFunctionsOfCurrentPage;
        }
    }

    if (!pathFound || !fileFound) {
        throw new Error("There is a page defined which is not properly structured or has missing data.");
    }
}

// Get the parameter.
import * as PARAMETER from "./config/parameter.json";
// Extract parameter values only - parameter type and other properties are not needed in the pages.
const parameterValues = Object.fromEntries(
    Object.entries(PARAMETER["default"]).map(([key, val]) => [key, val.value])
);

// Validate the parameter.
for (const parameter in PARAMETER["default"]) {
    let typeFound = false;
    let valueFound = false;

    // Check for required entries.
    for (const key in PARAMETER["default"][parameter]) {
        if (key === "type" && PARAMETER["default"][parameter][key] !== "") {
            typeFound = true;
        }

        if (key === "value" && PARAMETER["default"][parameter][key] !== "") {
            valueFound = true;
        }
    }

    if (!typeFound || !valueFound) {
        throw new Error("There is a parameter defined for a page which is not properly structured or has missing data.");
    }
}

// Get the session parameter for local development.
import * as SESSION from "./config/session.json";

// Get the helper functions.
import * as HELPER_FUNCTIONS from "./functions/helper.js";

// Initialize localization.
import * as LANGUAGE_OPTIONS from "./config/language.json";

// Using a function as loadPath for the i18n-Backend achieves the following:
// Template components inside local_packages can have their own localizations.
// For these, the namespace should be "bmt-template-components-NAME".
function getLoadPath(lng, ns){
    if (ns[0].startsWith("bmt-template-components")){
        return import.meta.env.VITE_PUBLIC_PATH + '/local_packages/{{ns}}/locales/{{lng}}.json'
    }
    return import.meta.env.VITE_PUBLIC_PATH + '/locales/{{lng}}.json'
}
LANGUAGE_OPTIONS["default"]["backend"]["loadPath"] = getLoadPath;
i18n.use(initReactI18next).use(Backend).init(LANGUAGE_OPTIONS["default"]);

// Dummy code here to represent the language switcher.
// i18n.changeLanguage("de");

// Formatter to capitalize first letter of an interpolated string in translations.
i18n.services.formatter.add("capitalize", input => input.charAt(0).toUpperCase() + input.slice(1))

// Build the routes for the router.
const routes = [];
if(import.meta.env.DEV) {
    for (const key in PAGES["default"]) {
        const currentPage = await import(
        "./pages/" + PAGES["default"][key]["file"]
            );
        routes.push({
            name: key,
            path: PAGES["default"][key]["path"],
            page: currentPage["default"],
        });
    }
} else {
    //%STATIC_PAGES%//
}

// Determine the page order.
import pageOrder from "./functions/pageOrder.js";
const pagePaths = pageOrder(PAGES.default, parameterValues);
// note: If subject has changed device or similar, template will use the order stored in global state instead.

// Create the router and specify the default route as the first page in the pagePaths array.
const router = createBrowserRouter(Array.prototype.concat([
        {
            path: "/",
            element: <Navigate to={pagePaths[0]} replace />
        }],
    routes.map((route) => ({
        path: route.path,
        element: <route.page parameter={PARAMETER["default"]} session={SESSION["default"]} validation={validationFunctionsOfPage[route.name]} helper={HELPER_FUNCTIONS}/>,
    }))
), {
    basename: import.meta.env.VITE_PUBLIC_PATH
});

function Wrapper() {
    // Initialize the global state and define some keys.
    const [state, setState] = useState({});
    const keyOrderOfPages = "order-of-pages";

    const { i18n } = useTranslation()

    // Write the defined order of pages to the global state on first load.
    useEffect(() => {
        if (state[keyOrderOfPages] === undefined){
            setState((prevState) => ({
                ...prevState,
                [keyOrderOfPages]: pagePaths
            }));
        } else {
            // todo: this would not work as it is, because it happens too late:
            //  When this is executed, "/" will have been visited already.
            //  for the dev wrapper, this is (currently) irrelevant. For production, find some solution.
            router.routes[0].element = <Navigate to={state[keyOrderOfPages][0]} replace />;
        }
    }, []);

    // Prepare helper functions.
    const c = function (value) {
        return HELPER_FUNCTIONS['currency'](value, SESSION['default']['currency'], i18n.language)
    };
    const n = function (value, { fixedDigits , maxDigits }={}){
        return HELPER_FUNCTIONS['numberFormatter'](value, fixedDigits , maxDigits, i18n.language)
    };
    const relativeDate = function ([number, unit]){
        return HELPER_FUNCTIONS['relativeDateFormatter']([number, unit], i18n.language)
    };

    const contextValue = {
        'parameter': parameterValues,
        'validation': VALIDATION_FUNCTIONS,
        'c': c,
        'n': n,
        'relativeDate': relativeDate,
        'state': state,
        'setState': setState,
    };

    // Return the template when the translations are loaded.
    return (
        <React.Suspense fallback="Loading...">
            <React.StrictMode>
                <globalContext.Provider value={contextValue}>
                    <RouterProvider router={router} />
                </globalContext.Provider>
            </React.StrictMode>
        </React.Suspense>
    );
}

export default Wrapper;
