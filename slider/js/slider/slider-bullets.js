Slider.prototype.initBullets = function() {
    try {
        this.indexSlides();
        let { bulletsGroup, bullets } = this.createBullets();
        // caching variables
        this.bulletsGroup = bulletsGroup;
        this.bullets = bullets;
        this.bindNavigationToBulletClick();
        this.bindBulletShadowToSliderScroll();
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
};

Slider.prototype.indexSlides = function() {
    let i = 0;
    this.$slides.forEach( slide => {
        slide.setAttribute("data-index", i);
        i++;
    });
};

Slider.prototype.createBulletWrap = function( slide ) {
    let bulletWrap = this.createEl("bulletWrap");
    // bullet
    let bullet = this.createEl("bullet pointer");
    let slideDataIndex = slide.getAttribute("data-index");
    // indexing bullet
    bullet.setAttribute("data-index", slideDataIndex);
    // img
    let imgSrc = slide.querySelector("img").getAttribute("src");
    let img = this.createEl("", "img");
    img.src = imgSrc;
    img.alt = "bullet";
    // appending
    bulletWrap.append( bullet );
    bullet.append( img );
    return bulletWrap;
};

Slider.prototype.createBullets = function() {
    let bulletsGroup = this.createEl("bullets");
    let bulletWraps = [];
    this.$slides.forEach( slide => {
        let bulletWrap = this.createBulletWrap( slide );
        bulletWraps.push(bulletWrap);
    });
    bulletsGroup.append( ...bulletWraps );
    this.$slider.append( bulletsGroup );

    let bullets = bulletWraps.map( x => x.children[0]);
    bullets[0].classList.add("active", "from"); // activating first bullet
    return { bulletsGroup, bullets };
};

Slider.prototype.bindNavigationToBulletClick = function() {
    let bulletsGroup = this.bulletsGroup || this.$slider.querySelector(".bullets");
    bulletsGroup.addEventListener( "click", e => this.navigateToSlideOnBulletClick(e) );
};

Slider.prototype.navigateToSlideOnBulletClick = function(e) {
    try {
        let bullet = e.target.closest(".bullet");
        if ( bullet ) {
            let dataIndex = bullet.getAttribute("data-index");
            let slide = this.$slidesWindow.querySelector(`[data-index='${dataIndex}']`);
            slide.scrollIntoView({behavior:"smooth", block: "end", inline: "nearest"});
        };
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
}

Slider.prototype.bindBulletShadowToSliderScroll = function () {
    this.$slidesWindow.addEventListener("scroll", () => this.scrollBulletShadow() )
};

Slider.prototype.scrollBulletShadow = function() {
    try {
        let bulletsGroup = this.bulletsGroup || this.$slider.querySelector(".bullets");
        let bullets = this.bullets || bulletsGroup.querySelectorAll(".bullet");
    
        let currPosition = this.$slidesWindow.scrollLeft;
        // find slide indexes that are in view with percentage
        let currViewBoundaries = [ currPosition, currPosition + this.sliderRect.width ];
        let currSlidesCoef = currViewBoundaries.map( position => position / this.sliderRect.width );
    
        // find slides child indexes based on view
        let leftSlideIndex =  Math.floor( currSlidesCoef[0] );
        let rightSlideIndex = Math.floor( currSlidesCoef[1] );
    
        // find percentage of the slide that is visible
        let leftSlideVisibilityCoef = currSlidesCoef[0] % 1;
        let leftSlideVisibilityPersentage = Math.round( leftSlideVisibilityCoef * 100 );
        let rightSlidePersentage = leftSlideVisibilityPersentage - 100 ;
    
        // setting css variables values
        bulletsGroup.style.setProperty('--left-bullet-layer-percentage', leftSlideVisibilityPersentage + "%" );
        bulletsGroup.style.setProperty('--right-bullet-layer-percentage', rightSlidePersentage + "%" );
        
        // finding bullets relative to slides that are being scrolled
        let slides = this.$slidesWindow.querySelectorAll(".slide");
        let slideFrom = slides[ leftSlideIndex ];
        let slideTo = slides[ rightSlideIndex ] || slides[ 0 ];
        let bulletIndexFrom = slideFrom.getAttribute( "data-index" );
        let bulletIndexTo = slideTo.getAttribute( "data-index" );
        
        // removing classes
        bullets.forEach( bullet => {
            bullet.classList.remove("from", "to", "active");
        });
        // applying classes to active bullets
        bullets[ bulletIndexFrom ].classList.add("from", "active");
        bullets[ bulletIndexTo ].classList.add("to", "active");
    
        // when animation is ended remove active class from the second bullet
        rightSlidePersentage === -100 && bullets[ bulletIndexTo ].classList.remove("active");
    } catch(e) {
        displayErrorOnThePage && displayErrorOnThePage(e);
    }
};


