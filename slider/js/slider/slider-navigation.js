    
    Slider.prototype.findCurrSlideChildIndex = function() {
        let sliderOffset = this.$slidesWindow.scrollLeft;
        let currentSlideIndex = Math.round( sliderOffset / this.sliderRect.width );
        return currentSlideIndex;
    }
    
    Slider.prototype.findCurrSlide = function() {
        let i = this.findCurrSlideChildIndex()
        return this.getSlideFromChildIndex(i);
    };

    Slider.prototype.getSlideFromChildIndex = function( childIndex ) {
        return this.$slideGroup.children[ childIndex ];
    }
    

    
    Slider.prototype.focusOnCurrSlide = function() {
        this.focusOnSlide( this.findCurrSlideChildIndex() );
    };
    
    Slider.prototype.focusOnSlide = function( childIndex  ) {
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

    Slider.prototype.updateSliderIsScrollingState = function( intervalId ) {
        if ( this.lastSliderPosition === null ) {
            this.sliderIsScrolling = true;

            // set initial slider position on scrolling animation start
            this.lastSliderPosition = this.$slidesWindow.scrollLeft;
            return;
        } 
        if ( this.lastSliderPosition === this.$slidesWindow.scrollLeft ) {
            this.sliderIsScrolling = false;
            clearInterval( intervalId );
            this.lastSliderPosition = null; // reset last slider position
        } else {
            this.lastSliderPosition = this.$slidesWindow.scrollLeft;
        }
    };

    Slider.prototype.reorganizeSlides = function() {
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
