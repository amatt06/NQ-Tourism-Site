// carousel.js

const nextButton = document.querySelector('.next');
const gallery = document.querySelector('.image-gallery');
const progressBar = document.querySelector('sl-progress-bar');

let scrollPosition = 0;

function getVisibleImages() {
    if (window.innerWidth <= 480) {
        return 1; // Mobile screens show 1 image
    } else if (window.innerWidth <= 768) {
        return 2; // Smaller screens show 2 images
    } else {
        return 3; // Desktop screens show 3 images
    }
}

function updateCarousel() {
    const visibleImages = getVisibleImages();
    const imageWidth = gallery.children[0].offsetWidth;
    gallery.style.transform = `translateX(-${scrollPosition * imageWidth}px)`;
    progressBar.value = ((scrollPosition + visibleImages) / gallery.children.length) * 100;
}

nextButton.addEventListener('click', () => {
    const visibleImages = getVisibleImages();
    if (scrollPosition < gallery.children.length - visibleImages) {
        scrollPosition++;
    } else {
        scrollPosition = 0; // Go back to the first image
    }
    updateCarousel();
});

window.addEventListener('resize', updateCarousel);

updateCarousel();
