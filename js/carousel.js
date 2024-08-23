// carousel.js

// Initialise variables for carousel functionality
var nextButton = document.querySelector('.next');
var gallery = document.querySelector('.image-gallery');
var progressBar = document.querySelector('sl-progress-bar');
var scrollPosition = 0;

// Determines the number of visible images based on window width
function getVisibleImages() {
    if (window.innerWidth <= 480) {
        return 1;
    } else if (window.innerWidth <= 768) {
        return 2;
    } else {
        return 3;
    }
}

// Updates the carousel position and progress bar
function updateCarousel() {
    var visibleImages = getVisibleImages();
    var imageWidth = gallery.children[0].offsetWidth;
    gsap.to(gallery, {
        x: -scrollPosition * imageWidth,
        duration: 0.1,
        ease: 'power2.out'
    });
    progressBar.value = ((scrollPosition + visibleImages) / gallery.children.length) * 100;
}

// Handles the next button click to scroll images
nextButton.addEventListener('click', function () {
    var visibleImages = getVisibleImages();
    if (scrollPosition < gallery.children.length - visibleImages) {
        scrollPosition++;
    } else {
        scrollPosition = 0;
    }
    updateCarousel();
});

window.addEventListener('resize', updateCarousel);
updateCarousel();