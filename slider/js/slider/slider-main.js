/* 
TO DOs:
1. this slider assumes that all images have the same relative aspect ratio -> change
2. put bullets inside slider instead of as a sibling
3. refactor , put different functionality into different files
4. fix bug --> when draggin from side to side it scrolls to the second image ( reorganizeSlides causing issue ?)
5. add touch events
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
        this.resizeSlider();
        this.bindSliderResizing();
        this.initArrows();
        this.initDragDrop();
        this.initBullets();
        console.log("Slider was initialized");
    };


    

    




}