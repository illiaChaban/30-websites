/* 
TO DOs:
1. this slider assumes that all images have the same relative aspect ratio -> change
4. create Desktop and mobile arrows
*/



class Slider {
    constructor(selector) {
        this.$slider = document.querySelector(selector);
        this.$slidesWindow = this.$slider.querySelector(".slidesWindow");
        this.$slideGroup = this.$slider.querySelector(".slides");
        this.$slides = this.$slider.querySelectorAll("div.slide");
        this.sliderRect;
        this.sliderIsScrolling = false;
    }

    init() {
        this.applyInitialStyles();
        this.initSliderResize();
        this.initArrows();
        this.initDragDrop();
        this.initBullets();
        console.log("Slider was initialized");
    };

    applyInitialStyles() {
        this.$slider.classList.add("slider", "activated", "center"); // activating CSS rules
        // add grab cursor to images
        this.$slides.forEach( slide => {
            slide.querySelector("img").classList.add("grab");
        });
    };

    createEl( className, tag="div" ) {
        let el = document.createElement( tag );
        el.className = className;
        return el;
    };
};