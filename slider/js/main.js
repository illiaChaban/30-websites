document.addEventListener("DOMContentLoaded", (e) => {
    window.slider = new Slider("#my-slider"); // making it global to make it accessible from the console
    slider.init(); 
});


// #########################################
// helper functions to debug on Iphone
// #########################################

function displayErrorOnThePage( error ) {
    console.error( error );
    // let errorParagraph = "<p>" + error.message + "   ||   " + error.stack + "</p>";
    // showParagraphOnThePage( errorParagraph );
};

function dbg( ...msg ) {
    let p = "<p>" + msg.join(" ") + "</p>";
    showParagraphOnThePage( p );
};

function showParagraphOnThePage( p ) {
    let errorElement = document.getElementById("error-message");
    errorElement.innerHTML = p + errorElement.innerHTML;
};

