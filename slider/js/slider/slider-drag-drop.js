Slider.prototype.initDragDrop = function() {
        this.$slidesWindow.addEventListener("click", e => this.preventDefaultLinkBehavior(e) );
        this.$slidesWindow.addEventListener("mousedown", e => this.startDragSlide(e) );
        this.$slidesWindow.addEventListener("mousemove", e => this.dragSlide(e) );
        this.$slidesWindow.addEventListener("mouseup", e => this.dropSlide(e) );
        // touch events
        this.$slidesWindow.addEventListener("touchstart", e => this.startDragSlide(e) );
        this.$slidesWindow.addEventListener("touchmove", e => this.dragSlide(e) );
        this.$slidesWindow.addEventListener("touchend", e => this.dropSlide(e) );
};

Slider.prototype.startDragSlide = function(e) {
    try{
        e.preventDefault();
        if ( !this.sliderIsScrolling ) {
            // disable arrow when draggin --> bug !!!!!!!!
            // this.$slider.querySelectorAll(".arrow").forEach( arrow => arrow.classList.add("hide") );
            this.sliderMouseDown = true; 
            this.reorganizeSlides();
            this.slideStartDrag = this.findCurrSlideChildIndex();
            // save drag start position to determine the length of a drag
            this.dragStartPosition = this.lastDragPosition = e.clientX || e.touches[0].clientX; 
            e.target.classList.replace("grab", "grabbing");
        } else { 
            console.warn( "scrolling slide is still being animated"); 
        }
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
}

Slider.prototype.dropSlide = function(e) {
    try {
        e.preventDefault();
        if ( !this.sliderMouseDown ) return; // haven't started dragging
    
        if ( !this.dragStartPosition ) {
            console.error( "drag Start position doesn't exist!")
            this.focusOnCurrSlide();
        };
    
    
        // disable arrow when draggin --> bug !!!!!!!!
        // this.$slider.querySelectorAll(".arrow").forEach( arrow => arrow.classList.remove("hide") );
        let clientX = e.clientX || this.lastDragPosition;
        let dragLength = this.dragStartPosition - clientX;
        let dragLengthAbs = Math.abs( dragLength );
        // will focus on the next slide if drag length is more than 100px or 1/4 of the whole slider
        let shouldFocusOnNextSlide = dragLengthAbs > 100 || dragLengthAbs > (this.sliderRect.width/4);
        if ( shouldFocusOnNextSlide ) {
            // finding a "direction" ("-1" or "+1") of the drag
            let direction = dragLength > 0 ? 1 : (-1); 
            let newSlideChildIndex = this.slideStartDrag + direction;
            this.focusOnSlide( newSlideChildIndex );
    
        } else {
            this.focusOnCurrSlide();
        }
    
        e.target.classList.replace("grabbing", "grab"); 
        this.sliderMouseDown = false;
        this.dragStartPosition = null; // clear drag start position
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
}

    
Slider.prototype.dragSlide = function(e) {
    try {
        if ( this.sliderMouseDown ) {
            if ( e.composedPath().includes(this.$slidesWindow) ) {
                // dragging
                let movementX = e.movementX;
                if ( movementX === undefined ) {
                    // updating for touchmoves
                    let clientX = e.touches[0].clientX;
                    movementX = clientX - this.lastDragPosition;
                    this.lastDragPosition = clientX;
                }
                // console.log({movementX})
                this.$slidesWindow.scrollLeft -= movementX;
            } else {
                // if while dragging mouse went out of the slider area, focus on the current slide
                this.sliderMouseDown = false;
                this.focusOnCurrSlide();
            }
        }
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
};

    
Slider.prototype.preventDefaultLinkBehavior = function(e) {
    try {
        if ( e.path.find( (el) => el.tagName === "A" ) !== -1 ) e.preventDefault();
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
};