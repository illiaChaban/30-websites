
Slider.prototype.findCurrSlideChildIndex = function() {
    try {
        let sliderOffset = this.$slidesWindow.scrollLeft;
        let currentSlideIndex = Math.round( sliderOffset / this.sliderRect.width );
        return currentSlideIndex;
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
}

Slider.prototype.findCurrSlide = function() {
    try {
        let i = this.findCurrSlideChildIndex()
        return this.getSlideFromChildIndex(i);
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
};

Slider.prototype.getSlideFromChildIndex = function( childIndex ) {
    try{
        return this.$slideGroup.children[ childIndex ];
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
}

Slider.prototype.focusOnCurrSlide = function() {
    this.focusOnSlide( this.findCurrSlideChildIndex() );
};

Slider.prototype.focusOnSlide = function( childIndexOrSlide ) {
    try {
        if ( this.sliderIsScrolling ) return console.warn("still scrolling"); 
    
        let childIndex = typeof childIndexOrSlide === "number" ? 
                                childIndexOrSlide :
                                this.findSlideChildIndex( childIndexOrSlide );

        if ( childIndex < 0 || childIndex >= this.$slides.length ) {
            // getting updated child index ( 0 or the last one )
            childIndex = childIndex < 0 ? 0 : this.$slides.length - 1;
            // appending fist slide or prepending last slide to make infinite slider
            this.reorganizeSlides();
        } 
        this.scrollToSlideChildIndex( childIndex );
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
};

Slider.prototype.scrollToSlideChildIndex = function( childIndex ) {
    let step = 20;
    let slidePositionLeft = childIndex * this.sliderRect.width;
    let intervalId = setInterval( () => this.stepScrollSlide( slidePositionLeft, intervalId, step), 10 );
}

Slider.prototype.stepScrollSlide = function( slidePositionLeft, intervalId, step=20 ) {
    let currPosition = this.$slidesWindow.scrollLeft;
    let positionDiff = slidePositionLeft - currPosition;
    let direction = positionDiff > 0 ? 1 : -1;
    if ( Math.abs( positionDiff ) < step ) {
        this.$slidesWindow.scrollLeft = slidePositionLeft;
        clearInterval( intervalId );
        this.sliderIsScrolling = false;
    } else {
        this.$slidesWindow.scrollLeft += ( direction * step );
        // ### checking scrolling state to prevent user from scrolling to the next slide before
        this.sliderIsScrolling = true;
    }
};

Slider.prototype.findSlideChildIndex = function(slide) {
    let childrenArray = [ ...this.$slideGroup.children];
    let childIndex = childrenArray.findIndex( x => x === slide );
    return childIndex;
}

Slider.prototype.reorganizeSlides = function() {
    try {
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
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
};

