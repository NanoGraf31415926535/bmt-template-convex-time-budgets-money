// Imports.
import React from "react";

// The component.
const Container = (props) => {
    return (
        <section className="text-gray-600 body-font">
            <div className="container w-full md:w-3/4 max-w-[800px] mx-auto px-3 py-3">
                {props.children}
            </div>
        </section>
    );
};

// Export.
export default Container;
