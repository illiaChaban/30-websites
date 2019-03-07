    Slider.prototype.createArrows = function() {
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
        this.$slider.querySelector(".slidesWrap").append( 
            arrowLeftWrap,
            arrowRightWrap 
        );

        this.bindArrowsStyleAnimation();
    };

    Slider.prototype.bindArrowsStyleAnimation = function() {
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