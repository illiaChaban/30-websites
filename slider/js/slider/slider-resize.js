    Slider.prototype.resizeSlider = function() {
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

    Slider.prototype.applyInitialStyles = function() {
        this.$slider.classList.add("slider", "activated", "center"); // activating CSS rules
        // add grab cursor to images
        this.$slides.forEach( slide => {
            slide.querySelector("img").classList.add("grab");
        });
    }

    Slider.prototype.getImgNaturalAspectRatio = function( img ) {
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        let aspectRatio = width / height;
        return aspectRatio;
    };

    Slider.prototype.adjustSliderHeight = function( aspectRatio ) {
        this.updateSliderDimensionsInfo();
        let currWidth = this.sliderRect.width;
        let newHeight = currWidth / aspectRatio;
        this.$slidesWindow.style.height = newHeight + "px";
        this.updateSliderDimensionsInfo();
    };

    Slider.prototype.updateSliderDimensionsInfo = function() {
        this.sliderRect = this.$slidesWindow.getBoundingClientRect();
    }

    Slider.prototype.resizeSlides = function() {
        let {width, height} = this.sliderRect;
        this.$slides.forEach( slide => {
            slide.setAttribute("style", `width: ${width}px; height: ${height}px`);
        });
    };


    Slider.prototype.bindSliderResizing = function() {
        window.addEventListener( "resize", e => this.resizeSlider() );
        document.addEventListener( "fullscreenchange", e => this.resizeSlider() );
    };