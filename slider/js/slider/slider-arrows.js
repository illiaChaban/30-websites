Slider.prototype.initArrows = function() {
    this.createArrows();
    this.bindArrowsStyleAnimation();
};

Slider.prototype.createArrows = function() {
    let arrowLeftWrap = util.createEl("arrow left");
    let arrowLeftButton = util.createEl("pointer", "button");
    let arrowRightWrap = util.createEl("arrow right");
    let arrowRightButton = util.createEl("pointer", "button");

    // bindArrows to scrolling slides
    arrowLeftButton.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() - 1 ));
    arrowRightButton.addEventListener("click", () => this.focusOnSlide( this.findCurrSlideChildIndex() + 1 ));

    // appending arrows
    arrowRightWrap.append( arrowRightButton );
    arrowLeftWrap.append( arrowLeftButton );
    this.$slider.querySelector(".slidesWrap").append( 
        arrowLeftWrap,
        arrowRightWrap 
    );
};

Slider.prototype.bindArrowsStyleAnimation = function() {
    // animate background linear gradient and opacity + 
    // arrow color depending on how close the mouse is to the arrow button
    let root = document.documentElement;
    this.$slider.querySelectorAll(".arrow").forEach( arrowWrap => {
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