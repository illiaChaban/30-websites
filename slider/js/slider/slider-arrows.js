Slider.prototype.initArrows = function() {
    try {
        this.createArrows();
        if ( this.isMobileUser() ) {
            this.bindArrowsTouch();
        } else {
            this.bindArrowsClick();
            this.applyDesktopStylesToArrows();
            this.bindArrowsStyleAnimationOnHover();
        }
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
};

Slider.prototype.applyDesktopStylesToArrows = function() {
    // preventing style bugs on Iphone so that "hover" state
    // isn't being activated on touch
    this.arrows.wraps.forEach( wrap => {
        wrap.classList.add("desktop");
    });
}

Slider.prototype.isMobileUser = function() {
    try {
        let usesMobile = window.navigator.userAgent.match(/Mobile/) ? true : false;
        console.log({usesMobile});
        return usesMobile;
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
}

Slider.prototype.createArrows = function() {
    let arrowLeftWrap = this.createEl("arrow left");
    let arrowLeftButton = this.createEl("pointer", "button");
    let arrowRightWrap = this.createEl("arrow right");
    let arrowRightButton = this.createEl("pointer", "button");

    // appending arrows
    arrowRightWrap.append( arrowRightButton );
    arrowLeftWrap.append( arrowLeftButton );
    this.$slider.querySelector(".slidesWrap").append( 
        arrowLeftWrap,
        arrowRightWrap 
    );

    // caching arrows
    this.arrows = { 
        wraps: [ arrowLeftWrap, arrowRightWrap ],
        buttons: [ arrowLeftButton, arrowRightButton ]
    };
};


Slider.prototype.bindArrowsClick = function () {
    // bindArrows to scrolling slides
    let [ arrowLeftButton, arrowRightButton ] = this.arrows.buttons;
    arrowLeftButton.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() - 1 ));
    arrowRightButton.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() + 1 ));
};

Slider.prototype.bindArrowsTouch = function () {
    this.arrows.wraps.forEach( (arrowWrap, i) => {
        arrowWrap.addEventListener("touchstart", () => {
            arrowWrap.classList.add("touch")
        });
        arrowWrap.addEventListener("touchend", () => {
            try {
                arrowWrap.classList.remove("touch");
                let slideDirection = i === 0 ? -1 : 1;
                let nextSlideIndex = this.findCurrSlideChildIndex() + slideDirection;
                this.focusOnSlide( nextSlideIndex );
            } catch(e) {
                displayErrorOnThePage && displayErrorOnThePage(e);
            }

        });
    })
};

Slider.prototype.bindArrowsStyleAnimationOnHover = function() {
    // animate background linear gradient and opacity + 
    // arrow color depending on how close the mouse is to the arrow button
    let root = document.documentElement;
    this.arrows.wraps.forEach( arrowWrap => {
        arrowWrap.addEventListener('mousemove', e => {
            // if (!this.arrowWasTouched) {
                let mouseToArrowCloseness = this.findMouseToArrowCloseness(e);
                root.style.setProperty('--mouse-close-to-arrow', mouseToArrowCloseness);

            // }
        });
    });
};

Slider.prototype.findMouseToArrowCloseness = function(e) {
    let mouseToArrowCloseness;
    if ( e.target.tagName === "BUTTON" ) {
        mouseToArrowCloseness = 1;
    } else {
        let arrowButton = e.target.querySelector("button");
        let { left, top, width, height } = arrowButton.getBoundingClientRect();
        let arrowButtonCenter = [ left + width/2, top + height/2 ];
        let { clientX, clientY } = e;
        let mousePosition = [ clientX, clientY ];
        let arrowWrapRect = e.target.getBoundingClientRect();
        mouseToArrowCloseness = this.findMouseToCenterCloseness( mousePosition, arrowButtonCenter, arrowWrapRect );
        // setting minimum value
        mouseToArrowCloseness = Number(mouseToArrowCloseness) > 0.25 ? mouseToArrowCloseness : "0.25";
    }

    return mouseToArrowCloseness
}

Slider.prototype.findMouseToCenterCloseness = function( mousePosition, center, arrowWrapRect ) {
    let [x1,y1] = mousePosition;
    let [x2,y2] = center; 
    let xClose = this.findRelativePointsCloseness(x1,x2, arrowWrapRect.width/2);
    let yClose = this.findRelativePointsCloseness(y1,y2, arrowWrapRect.height/2);
    let closeness = ( xClose + yClose ) / 2;
    return closeness.toFixed(3);
};

Slider.prototype.findRelativePointsCloseness = function( x1, x2, maxDistance ) {
    // closeness >= 0 and closeness <= 1
    // if x1 === x2 => closeness = 1
    // else closeness ==> 0
    let distanceX = Math.abs( x2 - x1 );
    let relativeDistance = distanceX / maxDistance
    let xRelativeCloseness = 1 - relativeDistance; // 1 is max, points coincide
    if (xRelativeCloseness < 0 ) xRelativeCloseness = 0;
    if ( xRelativeCloseness > 1  ) {
        console.log({ x1, x2, maxDistance, distanceX})
        throw new Error(`relative closeness value can't be more that 1, current value is ${xRelativeCloseness}`);
    }
    return xRelativeCloseness;
};