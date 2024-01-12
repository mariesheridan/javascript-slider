window.addEventListener('load', event => {
    const mobileState = window.matchMedia('(max-width: 768px)');
    var touchstartX = null;
    var touchstartY = null;
    var touchendX = null;
    var touchendY = null;
    const sensitivity = 50;

    const wrap = (value, min, max) => {
        let output = value;

        if (value < min) {
            output = max;
        } else if (value > max) {
            output = min;
        }

        return output;
    }

    const adjustSlidePosition = (categoryDiv, curSlide) => {
        let slides = categoryDiv?.querySelectorAll('.slide');
        //   move slide by 100%
        slides?.forEach((slide, indx) => {
            let curPosition = indx - curSlide;
            slide.style.transform = `translateX(${100 * (curPosition)}%)`;
            updateSliderTitle(slide, curPosition);
        });
    }

    const moveSlider = (categoryDiv, curSlideDiv, moveRight) => {
        var slides = [...categoryDiv.querySelectorAll(".slide")];
        let maxSlide = slides.length - 1;
        let curSlideIndex = [...categoryDiv.querySelectorAll('.slide')].indexOf(curSlideDiv);
        let moveCount = moveRight ? 1 : -1;
        let nextSlideIndex = wrap(curSlideIndex + moveCount, 0, maxSlide);
        let nextSlideDiv = slides[nextSlideIndex];

        slides.forEach((slide) => {
            slide?.classList.remove('shown-in-slider');
        });
        nextSlideDiv?.classList.add('shown-in-slider');

        let endSlide = moveRight ? maxSlide : 0;

        if (curSlideIndex === endSlide) {
            // Append the next slide beside the currentSlide before animating.
            if (moveRight) {
                curSlideDiv?.parentElement?.appendChild(nextSlideDiv);
            } else {
                curSlideDiv?.parentElement?.insertBefore(nextSlideDiv, curSlideDiv);
            }
            curSlideIndex = [...categoryDiv.querySelectorAll('.slide')].indexOf(curSlideDiv);
            adjustSlidePosition(categoryDiv, curSlideIndex);
            // Delay is needed to ensure that the new positioning is in place
            setTimeout(() => {
                nextSlideIndex = [...categoryDiv.querySelectorAll('.slide')].indexOf(nextSlideDiv);
                adjustSlidePosition(categoryDiv, nextSlideIndex);
            }, 50)
        } else {
            adjustSlidePosition(categoryDiv, nextSlideIndex);
        }
    }

    const moveSliderRight = (categoryDiv, curSlideDiv) => {
        moveSlider(categoryDiv, curSlideDiv, true);
    }

    const moveSliderLeft = (categoryDiv, curSlideDiv) => {
        moveSlider(categoryDiv, curSlideDiv, false);
    }

    const setPositionNumber = (categoryDiv) => {
        let slides = categoryDiv?.querySelectorAll('.slide');
        let position = 0;
        slides.forEach((slide) => {
            slide.setAttribute('data-sort-position', position++);
        });
    }

    const setupSlider = (categoryDiv, curSlide = 0) => {
        adjustSlidePosition(categoryDiv, curSlide);
        setPositionNumber(categoryDiv);

        // select next slide button
        const nextSlide = categoryDiv?.querySelector(".btn-next");

        const nextSlideListener = () => {
            let curSlideDiv = categoryDiv.querySelector('.slide.shown-in-slider');
            moveSliderRight(categoryDiv, curSlideDiv);
        }

        // add event listener and navigation functionality
        nextSlide?.removeEventListener("click", nextSlideListener);
        nextSlide?.addEventListener("click", nextSlideListener);

        // select prev slide button
        const prevSlide = categoryDiv?.querySelector(".btn-prev");

        const prevSlideListener = () => {
            let curSlideDiv = categoryDiv.querySelector('.slide.shown-in-slider');
            moveSliderLeft(categoryDiv, curSlideDiv);
        }

        // add event listener and navigation functionality
        prevSlide?.removeEventListener("click", prevSlideListener);
        prevSlide?.addEventListener("click", prevSlideListener);

        setupSliderSwipe(categoryDiv);
    }

    const setupSliderSwipe = (categoryDiv) => {
        const slides = categoryDiv?.querySelectorAll(".slide");
        slides.forEach((slide) => {
            function touchStartListener(event) {
                touchstartX = event.changedTouches[0].screenX;
                touchstartY = event.changedTouches[0].screenY;
            }

            function touchEndListener(event) {
                touchendX = event.changedTouches[0].screenX;
                touchendY = event.changedTouches[0].screenY;

                if ((touchendX + sensitivity) < touchstartX) {
                    moveSliderRight(categoryDiv, slide);
                }

                if ((touchendX - sensitivity) > touchstartX) {
                    moveSliderLeft(categoryDiv, slide);
                }
            }

            slide?.removeEventListener('touchstart', touchStartListener, false);
            slide?.addEventListener('touchstart', touchStartListener, false);
            slide?.removeEventListener('touchend', touchEndListener, false);
            slide?.addEventListener('touchend', touchEndListener, false);
        });
    }

    const getCurrentSlidePosition = (slides, currentSlideId) => {
        let curPos = 0;
        for (let i = 0; i < slides.length; i++) {
            const id = slides[i].querySelector('.slide').getAttribute('data-id');
            if (id === currentSlideId) {
                curPos = i;
                break;
            }
        }
        return curPos;
    }

    const updateSliderTitle = (slide, pos) => {
        if (pos === 0) {
            let title = slide?.getAttribute('data-title');
            let sliderTitleDiv = slide?.closest('.content')?.querySelector('.slider-title');
            if (sliderTitleDiv) {
                sliderTitleDiv.innerHTML = title;
            }
        }
    }

    // Initialise mobile elements
    const content = document.querySelector('.content');

    let firstSlide = document.querySelector('.slide');
    firstSlide?.classList.add('shown-in-slider');

    setupSlider(content);
});
