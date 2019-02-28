class Slider {
    constructor(selector) {
        this.$slider = document.querySelector(selector);
        this.$slidesWrap = this.$slider.querySelector(".slidesWrap");
        this.$slideGroup = this.$slider.querySelector(".slides");
        this.$slides = this.$slider.querySelectorAll("div.slide");
        this.sliderRect;
        this.sliderMouseDown = false;
        this.dragStartPosition = null;
        this.sliderIsScrolling = false;
        this.lastSliderPosition = null;
    }

    sizeSlides() {
        let {width, height} = this.sliderRect;
        this.$slides.forEach( slide => {
            slide.setAttribute("style", `width: ${width}px; height: ${height}px`);
        });
    };

    init() {
        this.$slider.classList.add("slider", "activated", "center"); // activating CSS rules
        this.sliderRect = this.$slidesWrap.getBoundingClientRect(); // getting new measurements
        this.sizeSlides();
        // this.indexSlides();
        this.bindDragDropSlides();
        this.createArrows();
        console.log("Slider was initialized")
    };
    
    sizeSlides() {
        let {width, height} = this.sliderRect;
        this.$slides.forEach( slide => {
            slide.setAttribute("style", `width: ${width}px; height: ${height}px`);
        })
    };
    
    indexSlides() {
        let i = 0;
        this.$slides.forEach( slide => {
            slide.setAttribute("data-index", i);
            i++;
        })
    };
    
    createArrows() {
        let arrowLeft = util.createEl("arrow pointer left", "button");
        let arrowRight = util.createEl("arrow pointer right", "button");
    
        // bindArrows
        arrowLeft.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() - 1 ));
        arrowRight.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() + 1 ));
    
        this.$slider.append( arrowLeft, arrowRight );
    };
    
    dragSlide(e) {
        if ( this.sliderMouseDown ) {
            if ( e.path.includes(this.$slidesWrap) ) {
                // dragging
                this.$slidesWrap.scrollLeft -= e.movementX;
            } else {
                // if while dragging mouse went out of the slider area, focus on the current slide
                this.sliderMouseDown = false;
                this.focusOnCurrSlide();
            }
        }
    };
    
    findCurrSlideChildIndex() {
        let sliderOffset = this.$slidesWrap.scrollLeft;
        let currentSlideIndex = Math.round( sliderOffset / this.sliderRect.width );
        return currentSlideIndex;
    }
    
    findCurrSlide() {
        let i = this.findCurrSlideChildIndex()
        return this.getSlideFromChildIndex(i);
    };

    getSlideFromChildIndex( childIndex ) {
        return this.$slideGroup.children[ childIndex ];
    }
    
    bindDragDropSlides() {
        this.$slidesWrap.addEventListener("click", e => this.preventDefaultLinkBehavior(e) );
        this.$slidesWrap.addEventListener("mousedown", e => this.startDragSlide(e) );
        this.$slidesWrap.addEventListener("mousemove", e => this.dragSlide(e) );
        this.$slidesWrap.addEventListener("mouseup", e => this.dropSlide(e) );
    };

    startDragSlide(e) {
        e.preventDefault();
        if ( !this.sliderIsScrolling ) {
            this.sliderMouseDown = true; 
            this.reorganizeSlides();
            // save drag start position to determine the length of a drag
            this.dragStartPosition = e.clientX; 
        } else { 
            console.warn( "scrolling slide is still being animated"); 
        }
    }

    dropSlide(e) {
        e.preventDefault();
        if ( !this.sliderMouseDown ) return; // haven't started dragging

        if ( !this.dragStartPosition ) {
            console.error( "drag Start position doesn't exist!")
            this.focusOnCurrSlide();
        };

        let dragLength = this.dragStartPosition - e.clientX;
        let dragLengthAbs = Math.abs( dragLength );
        // will focus on the next slide if drag length is more than 100px or 1/4 of the whole slider
        let shouldFocusOnNextSlide = dragLengthAbs > 100 || dragLengthAbs > (this.sliderRect.width/4);
        if ( shouldFocusOnNextSlide ) {
            let currSlideIndex = this.findCurrSlideChildIndex();
            // finding a "direction" ("-1" or "+1") of the drag
            let direction = dragLength > 0 ? 1 : (-1); 
            let newSlideChildIndex = currSlideIndex + direction;
            this.focusOnSlide( newSlideChildIndex );
        } else {
            this.focusOnCurrSlide();
        }

        this.sliderMouseDown = false;
        this.dragStartPosition = null; // clear drag start position
    }
    
    focusOnCurrSlide() {
        this.focusOnSlide( this.findCurrSlideChildIndex() );
    };
    
    focusOnSlide( childIndex  ) {
        if ( this.sliderIsScrolling ) { console.warn("still scrolling"); return; }

        if ( childIndex < 0 || childIndex >= this.$slides.length ) {
            // getting updated child index ( 0 or the last one )
            childIndex = childIndex < 0 ? 0 : this.$slides.length - 1;
            // appending fist slide or prepending last slide to make infinite slider
            this.reorganizeSlides();
        } 
        let slide = this.$slideGroup.children[ childIndex ];
        slide.scrollIntoView({behavior: "smooth"});
        
        // --- instead of implementing my own scroll, I've decided it will be easier
        // --- and more readable to reuse scrollIntoView with updating the state on the go
        // if interval time is lower than 30, it updates too quickly and "updateSliderIsScrollingState" might not work correctly
        let intervalId = setInterval( () => this.updateSliderIsScrollingState( intervalId ), 30 );
    };

    updateSliderIsScrollingState( intervalId ) {
        if ( this.lastSliderPosition === null ) {
            this.sliderIsScrolling = true;

            // set initial slider position on scrolling animation start
            this.lastSliderPosition = this.$slidesWrap.scrollLeft;
            return;
        } 
        if ( this.lastSliderPosition === this.$slidesWrap.scrollLeft ) {
            this.sliderIsScrolling = false;
            clearInterval( intervalId );
            this.lastSliderPosition = null; // reset last slider position
        } else {
            this.lastSliderPosition = this.$slidesWrap.scrollLeft;
        }
    };

    reorganizeSlides() {
        // prepending / appending last/ first slide to the slider to make it look infinite

        // focusing on next/previous slide because prepended/appended slide gets focus 
        // automatically since scrollLeft property is set to its position
        let currSlideIndex = this.findCurrSlideChildIndex();
        let currSlide = this.getSlideFromChildIndex( currSlideIndex );
        switch( currSlideIndex ) {
            case 0:
                let lastSlide = this.$slideGroup.children[ this.$slides.length -1 ];
                this.$slideGroup.prepend( lastSlide );
                break;
            case this.$slides.length - 1:
                let firstSlide = this.$slideGroup.children[0];
                this.$slideGroup.append( firstSlide );
                break;
        };
        currSlide.scrollIntoView();
    }
    
    preventDefaultLinkBehavior(e) {
        if ( e.path.find( (el) => el.tagName === "A" ) !== -1 ) e.preventDefault();
    };
}

window.util = {
    isInteger: (n) => {
        return n % 1 === 0;
    },
    createEl: ( className, tag="div" ) => {
        let el = document.createElement( tag );
        el.className = className;
        return el;
    },
};

document.addEventListener("DOMContentLoaded", () => {
    window.slider = new Slider("#my-slider"); // making it global to make it accessible from the console
    slider.init(); 
});