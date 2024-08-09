// carousel.js

const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const gallery = document.querySelector('.image-gallery');
const progressBar = document.querySelector('sl-progress-bar');

let scrollPosition = 0;

prevButton.addEventListener('click', () => {
    if (scrollPosition > 0) {
        scrollPosition--;
        updateCarousel();
    }
});

nextButton.addEventListener('click', () => {
    if (scrollPosition < gallery.children.length - 3) {
        scrollPosition++;
        updateCarousel();
    }
});

function updateCarousel() {
    const imageWidth = gallery.children[0].offsetWidth;
    gallery.style.transform = `translateX(-${scrollPosition * imageWidth}px)`;
    progressBar.value = ((scrollPosition + 1) / (gallery.children.length - 2)) * 100;
}
