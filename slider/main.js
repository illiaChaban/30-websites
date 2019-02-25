var $slider = document.querySelector(".slider");
var $slidesWrap = $slider.querySelector(".slidesWrap");
var $slideGroup = $slider.querySelector(".slides");
var $slides = document.querySelectorAll("div.slide");
var sliderRect;
var sliderMouseDown = false;
var currentSlide = 0;

// class Slider {
//     constructor(selector) {
//         this.$slider = document.querySelector(selector);
//         this.$slider.classList.add("activated");
//         this.$slideGroup = $slider.querySelector(".slides");
//         this.$slides = this.$slider.querySelectorAll("div.slide");
//         this.sliderRect = $slider.getBoundingClientRect();
//         this.sliderMouseDown = false;
//         this.currentSlide = 0;
//     }
// }



function init() {
    console.log("hello");
    $slider.classList.add("activated", "center");
    sliderRect = $slidesWrap.getBoundingClientRect();
    sizeSlides();
    // indexSlides();
    preventDefaultLinkBehavior();
    bindDragDropSlides();
    createArrows();
};

function sizeSlides() {
    let {width, height} = sliderRect;
    $slides.forEach( slide => {
        slide.setAttribute("style", `width: ${width}px; height: ${height}px`);
    })
};

function indexSlides() {
    let i = 0;
    $slides.forEach( slide => {
        slide.setAttribute("data-index", i);
        i++;
    })
};

// var arrows; 
function createArrows() {
    let arrowLeft = createEl("arrow pointer left", "button");
    let arrowRight = createEl("arrow pointer right", "button");

    // bindArrows
    let currSlideIndex = findCurrSlideChildIndex();
    // code for exceptions !!!!!!!!!!!!!!
    arrowLeft.addEventListener("click", () => focusOnSlide( findCurrSlideChildIndex() - 1 ));
    arrowRight.addEventListener("click", () => focusOnSlide( findCurrSlideChildIndex() + 1 ));

    $slider.append( arrowLeft, arrowRight );


}

function createEl( className, tag="div" ) {
    let el = document.createElement( tag );
    el.className = className;
    return el;
};


function dragSlide(e) {
    if ( sliderMouseDown ) {
        if ( e.path.includes($slidesWrap) ) {
            let { movementX, clientX, clientY } = e;
            $slidesWrap.scrollLeft -= movementX;
            // console.log({clientX, l: $slider.scrollLeft, e})
        } else {
            sliderMouseDown = false;
            focusOnCurrSlide();
        }
    }
};

function findCurrSlideChildIndex() {
    let sliderOffset = $slidesWrap.scrollLeft;
    let currentSlideIndex = Math.round( sliderOffset / sliderRect.width );
    return currentSlideIndex;
}

function findCurrSlide( i = findCurrSlideChildIndex() ) {
    let currentSlide = $slideGroup.children[ i ];
    return currentSlide;
};

function bindDragDropSlides() {
    $slidesWrap.addEventListener("mousedown", (e) => { 
        e.preventDefault();
        sliderMouseDown = true; 
    });
    $slidesWrap.addEventListener("mouseup", (e) => { 
        e.preventDefault();
        sliderMouseDown = false; 
        focusOnCurrSlide();
        // let link = currSlide.querySelector("a");
        // findCurrentSlide().querySelector("a").focus();
        // console.log(findCurrentSlide(), link, document.activeElement)
    });
    document.addEventListener("mousemove", dragSlide );
}

function focusOnCurrSlide() {
    let currSlideIndex = findCurrSlideChildIndex();
    focusOnSlide( currSlideIndex );
};

function focusOnSlide( childIndex, time = 200, interval = 10 ) {
    if ( childIndex < 0 || childIndex >= $slides.length ) {
        console.warn("childIndex not in range");
        // add code for infinite slider
        return;
    }
    let neededSlideLeftOffset = childIndex * sliderRect.width;
    let stepsNum = time / interval;
    if ( !isInteger( stepsNum ) ) throw new Error( `Specified time should be divisible by ${interval}`);

    let currSlideLeftOffset = $slidesWrap.scrollLeft;
    let leftOffsetDiff = neededSlideLeftOffset - currSlideLeftOffset;
    let step = leftOffsetDiff / stepsNum;

    let intervalId = setInterval( move, interval );
    function move() {
        if ( Math.abs( leftOffsetDiff ) <= Math.abs( step ) ) {
            $slidesWrap.scrollLeft = neededSlideLeftOffset;
            clearInterval( intervalId );
        } else {
            $slidesWrap.scrollLeft += step;
            leftOffsetDiff -= step;
        }
    }
    console.log({stepsNum, step})

}

// function animateSliding( neededSlideLeftOffset, time, interval = 10 ) {


// }

function isInteger(n) {
    return n % 1 === 0;
}

function preventDefaultLinkBehavior() {
    $slider.querySelectorAll("a").forEach( link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
        })
    });
};

document.addEventListener("DOMContentLoaded", init );