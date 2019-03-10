document.addEventListener("DOMContentLoaded", (e) => {
    window.slider = new Slider("#my-slider"); // making it global to make it accessible from the console
    slider.init(); 
});