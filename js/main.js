// main.js

// Utility function to debounce events
function debounce(func, wait, immediate) {
    var timeout;
    wait = wait || 10;
    immediate = (immediate === undefined) ? true : immediate;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Easing function for smooth scrolling
function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

// Smoothly scrolls to the target section when a navigation link is clicked
function smoothScroll(target, duration) {
    var start = window.scrollY;
    var navbarHeight = document.querySelector('nav').offsetHeight;
    var targetPosition = document.querySelector(target).offsetTop - navbarHeight;
    var distance = targetPosition - start;
    var startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        var timeElapsed = currentTime - startTime;
        var run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}

function updateNavIndicator() {
    const sections = document.querySelectorAll('section');
    const isSmallScreen = window.innerWidth <= 768;
    const navIndicator = document.getElementById('nav-indicator');

    // Hide the indicator on small screens
    if (isSmallScreen) {
        navIndicator.style.display = 'none';
        return; // Exit early, no need to update on small screens
    } else {
        navIndicator.style.display = 'block';
    }

    const navLinks = document.querySelectorAll('#main-nav ul li a');
    let currentSection = '';
    let maxVisibleHeight = 0;

    // Determine which section is mostly visible in the viewport
    sections.forEach(function (section) {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);

        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            currentSection = section.getAttribute('id');
        }
    });

    // Update the navigation links and indicator position
    navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
            const rect = link.getBoundingClientRect();
            const navRect = link.parentElement.parentElement.getBoundingClientRect();
            navIndicator.style.width = rect.width + 'px';
            navIndicator.style.left = (rect.left - navRect.left) + 'px';
        }
    });
}

// Smooth scroll initialisation for the hero button
function initHeroButton() {
    var heroButton = document.getElementById('hero-button');
    if (heroButton) {
        heroButton.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScroll('#itinerary', 1200);
        });
    }
}

// Initialises the navigation indicator and sets up event listeners
function initNavIndicator() {
    window.addEventListener('scroll', debounce(updateNavIndicator));
    window.addEventListener('resize', debounce(updateNavIndicator));
    updateNavIndicator();

    const navLinks = document.querySelectorAll('nav ul li a'); // Select both main and burger menu links

    navLinks.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScroll(targetId, 1200);
        });
    });
}

// Initialises the burger menu for smaller screens
function initBurgerMenu() {
    var burgerMenu = document.getElementById('burger-menu');
    var sideNav = document.getElementById('side-nav');

    burgerMenu.addEventListener('click', function () {
        sideNav.classList.toggle('open');
    });

    // Close the side nav when a link is clicked
    sideNav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            sideNav.classList.remove('open');
        }
    });
}

// Initialises the carousel functionality
function initCarousel() {
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
}

// Initialises the itinerary form interactions
function initItineraryForm() {
    var form = document.getElementById('itinerary-form');
    var confirmationMessage = document.getElementById('confirmation-message');
    var submitButton = document.getElementById('submit-btn');
    var descriptor = document.getElementById('itinerary-descriptor');
    var bubbles = document.querySelectorAll('.bubble');
    var confirmationSound = document.getElementById('confirmation-sound');

    // Handles form submission
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        form.style.display = 'none';
        descriptor.style.display = 'none';
        confirmationMessage.style.display = 'block';
        confirmationSound.play();
    });

    // Toggles bubble selection
    bubbles.forEach(function (bubble) {
        bubble.addEventListener('click', function () {
            this.classList.toggle('selected');
        });
    });
}

// Main initialisation function
function init() {
    initNavIndicator();
    initItineraryForm();
    initCarousel();
    initHeroButton();
    initBurgerMenu();
}

// Waits for the DOM to fully load before initialising
document.addEventListener('DOMContentLoaded', init);