// Imports.
import React from "react";
import sanitizeHtml from 'sanitize-html';

// The component.
const Text = (props) => {
    let currentStringDirty
    if (Array.isArray(props.children)) {
        // In case of multiple children: Filter out undesired, falsy values and join the rest.
        currentStringDirty = props.children.filter(x => ![undefined, false, null].includes(x)).join(" ")
    } else {
        currentStringDirty = props.children;
    }

    // Sanitize the string (HTML).
    let currentStringClean = sanitizeHtml(currentStringDirty, {
        allowedTags: ['b', 'i', 'br']
    });

    // Set the paragraphs.
    currentStringClean = '<p class=\'my-2\'>' + currentStringClean;
    currentStringClean = currentStringClean + '</p>';
    currentStringClean = currentStringClean.replace(/<br(\s?\/)?>/gi, '</p><p class=\'my-2\'>');
    currentStringClean = currentStringClean.replace(/\n\n/g, '</p><p class=\'my-2\'>');

    // Return the component.
    return (
        <div dangerouslySetInnerHTML={{ __html: currentStringClean }} />
    );
};

// Export.
export default Text;
