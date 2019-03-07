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
        this.sliderMouseDown = false;
        this.dragStartPosition = null;
        this.sliderIsScrolling = false;
        this.lastSliderPosition = null;
    }

    init() {
        this.applyInitialStyles();
        this.resizeSlider();
        this.bindSliderResizing();
        this.createArrows();
        this.bindDragDropSlides();

        this.indexSlides();
        this.createBulletsNavigation();
        console.log("Slider was initialized");
    };


    
    indexSlides() {
        let i = 0;
        this.$slides.forEach( slide => {
            slide.setAttribute("data-index", i);
            i++;
        })
    };
    




}