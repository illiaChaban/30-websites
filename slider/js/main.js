/* 
TO DOs:
1. this slider assumes that all images have the same relative aspect ratio -> change
2. put bullets inside slider instead of as a sibling
3. refactor , put different functionality into different files
4. fix bug --> when draggin from side to side it scrolls to the second image ( reorganizeSlides causing issue ?)
*/



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

    createBulletsNavigation() {
        // should be this.$slider.querySele...
        let bulletsGroup = document.querySelector(".bullets");
        let bullets = bulletsGroup.querySelectorAll(".bullet");



        // bulletsGroup
        //     .querySelectorAll(".bullet").forEach( bullet => {

        //         bullet.addEventListener("click", () => {
        //             bullet.classList.toggle("active")
        //         });

        //     });

        this.$slidesWrap.addEventListener("scroll", e => {
            let allSlidesWidth = this.$slideGroup.offsetWidth;
            let currPosition = this.$slidesWrap.scrollLeft;
            // find slide indexes that are in view with percentage
            let currViewBoundaries = [ currPosition, currPosition + this.sliderRect.width ];
            let x = currViewBoundaries.map( a => a / this.sliderRect.width );


            let leftSlideIndex =  Math.floor( x[0] );
            // let rightSlideIndex = leftSlideIndex + 1;
            let rightSlideIndex = Math.floor( x[1] );
            // let secondSlideIndex = Math.floor( x[1] );
            // let direction = secondSlideIndex > firstSlideIndex ? 1 : -1;



            let leftSlideCoef = x[0] % 1;
            let leftSlidePersentage = Math.round( leftSlideCoef * 100 );
            let rightSlidePersentage = leftSlidePersentage - 100 ;

            bulletsGroup.style.setProperty('--left-bullet-layer-percentage', leftSlidePersentage + "%" );
            bulletsGroup.style.setProperty('--right-bullet-layer-percentage', rightSlidePersentage + "%" );

            

            let slides = this.$slidesWrap.querySelectorAll(".slide");
            let slideFrom = slides[ leftSlideIndex ];
            let slideTo = slides[ rightSlideIndex ] || slides[ 0 ];
            let bulletIndexFrom = slideFrom.getAttribute( "data-index" );
            let bulletIndexTo = slideTo.getAttribute( "data-index" );
            


            // refactor !!!!!
            bullets.forEach( bullet => {
                bullet.classList.remove("from", "to", "active");
            })
            bullets[ bulletIndexFrom ].classList.add("from", "active");
            bullets[ bulletIndexTo ].classList.add("to", "active");

            // enlarge active bullet
            // leftSlidePersentage === 0 && bullets[ bulletIndexFrom ].classList.add("active");
            rightSlidePersentage === -100 && bullets[ bulletIndexTo ].classList.remove("active");
            // console.log(bulletIndexFrom)

            // console.log({leftSlideIndex, rightSlideIndex, leftSlidePersentage, rightSlidePersentage })
            
            // let info = {
            //     firstSlideCoef: x[0] % 1,
            //     secondSlideCoef: x[1] % 1, // === firstSlideCoef


            // }

            // console.log({ allSlidesWidth, currPosition });
            // console.log(x)
            // console.log( {leftSlidePersentage, rightSlidePersentage} )

        })



    }

    resizeSlider() {
        // updating Slider height based on natural aspect ratio
        // of the first image and current slider's width
        // ---- using the first image as a template for now
        // ---- ideally should get average aspect ratio from all images
        // checking if image has already loaded
        let loadedImg = new Promise( (resolve, reject) => {
            let img = this.$slides[0].querySelector("img");
            if ( img.complete ) {
                resolve( {img, status: "complete"} )
            } else {
                img.addEventListener( "load", () => resolve( {img, status: "loaded"} ))
            }
        })
        loadedImg.then( ({img, status}) => {
            let aspectRatio = this.getImgNaturalAspectRatio( img );
            this.adjustSliderHeight( aspectRatio );
            this.resizeSlides();
            // console.log("slider Resized", {status});
        })
    }

    applyInitialStyles() {
        this.$slider.classList.add("slider", "activated", "center"); // activating CSS rules
        // add grab cursor to images
        this.$slides.forEach( slide => {
            slide.querySelector("img").classList.add("grab");
        });
    }

    getImgNaturalAspectRatio( img ) {
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        let aspectRatio = width / height;
        return aspectRatio;
    };

    adjustSliderHeight( aspectRatio ) {
        this.updateSliderDimensionsInfo();
        let currWidth = this.sliderRect.width;
        let newHeight = currWidth / aspectRatio;
        this.$slidesWrap.style.height = newHeight + "px";
        this.updateSliderDimensionsInfo();
    };

    updateSliderDimensionsInfo() {
        this.sliderRect = this.$slidesWrap.getBoundingClientRect();
    }

    resizeSlides() {
        let {width, height} = this.sliderRect;
        this.$slides.forEach( slide => {
            slide.setAttribute("style", `width: ${width}px; height: ${height}px`);
        });
    };


    bindSliderResizing() {
        window.addEventListener( "resize", e => this.resizeSlider() );
        document.addEventListener( "fullscreenchange", e => this.resizeSlider() );
    };
    
    indexSlides() {
        let i = 0;
        this.$slides.forEach( slide => {
            slide.setAttribute("data-index", i);
            i++;
        })
    };
    
    createArrows() {
        let arrowLeftWrap = util.createEl("arrow left");
        let arrowLeftButton = util.createEl("pointer", "button");
        let arrowRightWrap = util.createEl("arrow right");
        let arrowRightButton = util.createEl("pointer", "button");
    
        // bindArrows to scrolling slides
        arrowLeftButton.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() - 1 ));
        arrowRightButton.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() + 1 ));
    
        // adding arrows css
        // let arrowStylesLink = util.createEl("", "link");
        // arrowStylesLink.setAttribute("rel", "stylesheet");
        // arrowStylesLink.setAttribute("type", "text/css");
        // arrowStylesLink.setAttribute("media", "screen");
        // arrowStylesLink.setAttribute("href", "arrows.css");
        // document.querySelector("head").append(arrowStylesLink);
        // arrowStylesLink.addEventListener("load", () => this.resizeSlider());

        // appending arrows
        arrowRightWrap.append( arrowRightButton );
        arrowLeftWrap.append( arrowLeftButton );
        this.$slider.append( 
            arrowLeftWrap,
            arrowRightWrap 
        );

        this.bindArrowsStyleAnimation();
    };

    bindArrowsStyleAnimation() {
        // animate background linear gradient and opacity + 
        // arrow color depending on the mouse position
        let root = document.documentElement;
        slider.$slider.querySelectorAll(".arrow").forEach( arrowWrap => {
            arrowWrap.addEventListener('mousemove', e => {
                let mouseToArrowCloseness;
                if ( e.target.tagName === "BUTTON" ) {
                    mouseToArrowCloseness = 1;
                } else {
                    let arrowButton = e.target.querySelector("button");
                    let { left, top, width, height } = arrowButton.getBoundingClientRect();
                    let arrowButtonCenter = [ left + width/2, top + height/2 ];
                    let { clientX, clientY } = e;
                    let mousePosition = [ clientX, clientY ];
                    mouseToArrowCloseness = util.findMouseToCenterCloseness( mousePosition, arrowButtonCenter );
                    mouseToArrowCloseness = Number(mouseToArrowCloseness) > 0.25 ? mouseToArrowCloseness : "0.25";
                    // console.log({ mouseToArrowCloseness })
                }
                root.style.setProperty('--mouse-close-to-arrow', mouseToArrowCloseness);
            });
        });
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

            // disable arrow when draggin --> bug !!!!!!!!
            // this.$slider.querySelectorAll(".arrow").forEach( arrow => arrow.classList.add("hide") );
            
            this.sliderMouseDown = true; 
            this.reorganizeSlides();
            // save drag start position to determine the length of a drag
            this.dragStartPosition = e.clientX; 
            e.target.classList.replace("grab", "grabbing");
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


        // disable arrow when draggin --> bug !!!!!!!!
        // this.$slider.querySelectorAll(".arrow").forEach( arrow => arrow.classList.remove("hide") );


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

        e.target.classList.replace("grabbing", "grab"); 
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
        
        // ### checking scrolling state to prevent user from scrolling to the next slide before
        // ### current animation finishes
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

        let alignToTop = false; // otherwise page jumps to focus on the element
        currSlide.scrollIntoView( alignToTop );
    };

    
    preventDefaultLinkBehavior(e) {
        if ( e.path.find( (el) => el.tagName === "A" ) !== -1 ) e.preventDefault();
    };
}

document.addEventListener("DOMContentLoaded", () => {
    window.slider = new Slider("#my-slider"); // making it global to make it accessible from the console
    slider.init(); 



});