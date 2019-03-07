    Slider.prototype.createBulletWrap = function( slide ) {
        let bulletWrap = util.createEl("bulletWrap");
        // bullet
        let bullet = util.createEl("bullet pointer");
        let slideDataIndex = slide.getAttribute("data-index");
        bullet.setAttribute("data-index", slideDataIndex);
        // img
        let imgSrc = slide.querySelector("img").getAttribute("src");
        let img = util.createEl("", "img");
        img.src = imgSrc;
        img.alt = "bullet";
        // appending
        bulletWrap.append( bullet );
        bullet.append( img );
        return bulletWrap;
    };

    Slider.prototype.createBullets = function() {
        let bulletsGroup = util.createEl("bullets");
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
    }
    
    Slider.prototype.createBulletsNavigation = function() {

        let { bulletsGroup, bullets } = this.createBullets();

        bulletsGroup.addEventListener( "click", (e) => {
            let bullet = e.target.closest(".bullet");
            if ( bullet ) {
                let dataIndex = bullet.getAttribute("data-index");
                let slide = this.$slidesWindow.querySelector(`[data-index='${dataIndex}']`);
                slide.scrollIntoView({behavior:"smooth"});
            };
        })
    

        // bulletsGroup
        //     .querySelectorAll(".bullet").forEach( bullet => {

        //         bullet.addEventListener("click", () => {
        //             bullet.classList.toggle("active")
        //         });

        //     });

        this.$slidesWindow.addEventListener("scroll", e => {
            let currPosition = this.$slidesWindow.scrollLeft;
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

            

            let slides = this.$slidesWindow.querySelectorAll(".slide");
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


        })



    }

