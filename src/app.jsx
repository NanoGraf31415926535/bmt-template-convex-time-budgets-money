// Imports.
import ReactDOM from 'react-dom/client'
import Wrapper from "./wrapper";

// Hook in the app into the DOM when the correct page is shown.
if(document.getElementById('app')) {
    ReactDOM.createRoot(document.getElementById('app')).render(
        <Wrapper />
    )
}
