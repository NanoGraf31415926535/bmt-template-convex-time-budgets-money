// This function determines the page order of a given template. It should return an array of paths: ["/firstPage", "/second", ...].
// The prototype default just returns the order from pages.json.
// If needed for a given template, one can condition on parameter values, shuffle some or all pages, etc.
function pageOrder(pagesJSON, parameter){
    const defaultOrder = Object.values(pagesJSON).map(page => page.path);
    return defaultOrder
 }

 // Utility for randomization.
function shuffle(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

 export default pageOrder;