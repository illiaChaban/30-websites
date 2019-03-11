document.addEventListener("DOMContentLoaded", (e) => {
    window.slider = new Slider("#my-slider"); // making it global to make it accessible from the console
    slider.init(); 
});

function displayErrorOnThePage( error ) {
    console.error(error);
    let errorParagraph = "<p>" + error.message + "   ||   " + error.stack + "</p>";
    document.getElementById("error-message").innerHTML += errorParagraph;
}
