class Slider {
    constructor(selector) {
        this.$slider = document.querySelector(selector);
        // this.$slider.classList.add("activated", "center"); // activating css
        this.$slidesWrap = this.$slider.querySelector(".slidesWrap");
        this.$slideGroup = this.$slider.querySelector(".slides");
        this.$slides = this.$slider.querySelectorAll("div.slide");
        this.sliderRect;
        this.sliderMouseDown = false;
        this.dragStartPosition = null;
        // this.currentSlide = 0;
    }

    sizeSlides() {
        let {width, height} = this.sliderRect;
        this.$slides.forEach( slide => {
            slide.setAttribute("style", `width: ${width}px; height: ${height}px`);
        });
    };

    init() {
        console.log("hello");
        this.$slider.classList.add("activated", "center");
        this.sliderRect = this.$slidesWrap.getBoundingClientRect();
        this.sizeSlides();
        this.indexSlides();
        this.preventDefaultLinkBehavior();
        this.bindDragDropSlides();
        this.createArrows();
        this.reorganizeSlides();
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
    
    // var arrows; 
    createArrows() {
        let arrowLeft = util.createEl("arrow pointer left", "button");
        let arrowRight = util.createEl("arrow pointer right", "button");
    
        // bindArrows
        // code for exceptions !!!!!!!!!!!!!!
        arrowLeft.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() - 1 ));
        arrowRight.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() + 1 ));
    
        this.$slider.append( arrowLeft, arrowRight );
    
    
    }
    
    
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
    
    findCurrSlide( i = this.findCurrSlideChildIndex() ) {
        let currentSlide = this.$slideGroup.children[ i ];
        return currentSlide;
    };
    
    bindDragDropSlides() {
        this.$slidesWrap.addEventListener("mousedown", (e) => { 
            e.preventDefault();
            this.sliderMouseDown = true; 
            // save drag start position to determine the length of a drag
            this.dragStartPosition = e.clientX; 
        });
        this.$slidesWrap.addEventListener("mouseup", (e) => { 
            e.preventDefault();
            this.sliderMouseDown = false; 
            // update dragging history
            this.focusOnDraggedSlide(e);
            this.dragStartPosition = null; // clear drag start position
        });
        document.addEventListener("mousemove", (e) => this.dragSlide(e) );
    };

    focusOnDraggedSlide(e) {
        if ( !this.dragStartPosition ) {
            console.error( "drag Start position doesn't exist!")
            this.focusOnCurrSlide();
        };

        let dragLength = this.dragStartPosition - e.clientX;
        let dragLengthAbs = Math.abs( dragLength );
        if ( dragLengthAbs > 100 || dragLengthAbs > (this.sliderRect.width/4) ) {
            let currSlideIndex = this.findCurrSlideChildIndex();
            let direction = dragLength > 0 ? 1 : (-1);
            this.focusOnSlide( currSlideIndex + direction );
        } else {
            this.focusOnCurrSlide();
        }

    }
    
    focusOnCurrSlide() {
        let currSlideIndex = this.findCurrSlideChildIndex();
        this.focusOnSlide( currSlideIndex );
    };
    
    focusOnSlide( childIndex, options={} ) {
        let { time = 200, interval = 10 } = options; // default options


        if ( childIndex < 0 ) {
            console.warn("childIndex not in range 0");
            // add code for infinite slider
            // return;
        }

        if ( childIndex >= this.$slides.length ) {
            console.warn("childIndex not in range (length)");
            // add code for infinite slider
            // return;
        }

        // not animated scroll
        if ( time === 0 ) {
            this.$slidesWrap.scrollLeft = childIndex * this.sliderRect.width;
            return;
        }




        let neededSlideLeftOffset = childIndex * this.sliderRect.width;
        let stepsNum = time / interval;
        if ( !util.isInteger( stepsNum ) ) throw new Error( `Specified time should be divisible by ${interval}`);
    
        let currSlideLeftOffset = this.$slidesWrap.scrollLeft;
        let leftOffsetDiff = neededSlideLeftOffset - currSlideLeftOffset;
        let step = leftOffsetDiff / stepsNum;
    
        let intervalId = setInterval( move, interval );
        // let intervalId = setInterval( () => this.animateSlideMove(leftOffsetDiff, neededSlideLeftOffset, step, intervalId), interval );
        let that = this;
        function move() {
            if ( Math.abs( leftOffsetDiff ) <= Math.abs( step ) ) {
                that.$slidesWrap.scrollLeft = neededSlideLeftOffset;
                clearInterval( intervalId );
                that.reorganizeSlides(childIndex);
            } else {
                that.$slidesWrap.scrollLeft += step;
                leftOffsetDiff -= step;
            }
        }
    }

    reorganizeSlides() {
        // prepending / appending last/ first slide to the slider to make
        // it look infinite

        // focusing on next/previous slide because prepended/appended slide gets focus 
        // automatically since scrollLeft property is set to its position
        let currentSlideIndex = this.findCurrSlideChildIndex();
        if ( currentSlideIndex === (this.$slides.length - 1) ) {
            let firstSlide = this.$slideGroup.children[0];
            this.$slideGroup.append( firstSlide );
            this.focusOnSlide( currentSlideIndex-1, {time:0} ); 
        } else
        if ( currentSlideIndex === 0 ) {
            let lastSlide = this.$slideGroup.children[ this.$slides.length -1 ];
            this.$slideGroup.prepend( lastSlide );
            this.focusOnSlide( 1, {time:0} );
        }

    }
    
    
    preventDefaultLinkBehavior() {
        this.$slider.querySelectorAll("a").forEach( link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
            })
        });

        // this.$slider.addEventListener("click", (e) => {
        //     if ( e.path.find( el => el.tagName === "A") !== -1 ) {
        //         e.preventDefault();
        //     }
        // })
    };
    
}

var util = {
    isInteger: (n) => {
        return n % 1 === 0;
    },
    createEl: ( className, tag="div" ) => {
        let el = document.createElement( tag );
        el.className = className;
        return el;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    slider = new Slider(".slider");
    slider.init(); 
});