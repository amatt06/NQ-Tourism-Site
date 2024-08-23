// main.js

/*
 * Utility function to debounce events
 * Debouncing ensures a function is not called too frequently,
 * which improves performance and prevents unnecessary operations.
 */
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/*
 * Easing function for smooth scrolling
 * Calculates the current scroll position based on the easing function
 * to create a smooth scrolling effect.
 */
function getScrollEase(currentTime, startScroll, changeInScroll, totalDuration) {
    currentTime /= totalDuration / 2;
    if (currentTime < 1) return changeInScroll / 2 * currentTime * currentTime + startScroll;
    currentTime--;
    return -changeInScroll / 2 * (currentTime * (currentTime - 2) - 1) + startScroll;
}

/*
 * Smoothly scrolls to the target section when a navigation link is clicked
 * Uses the getScrollEase function to animate the scroll to the target element.
 */
function smoothScroll(targetSelector, duration) {
    const startScroll = window.scrollY; // Starting vertical scroll position
    const navbarHeight = document.querySelector('nav').offsetHeight; // Height of the navigation bar
    const targetElement = document.querySelector(targetSelector);

    if (!targetElement) {
        console.error(`Target element ${targetSelector} not found.`);
        return;
    }

    const targetPosition = targetElement.offsetTop - navbarHeight; // Position of the target section adjusted for navbar height
    const distanceToScroll = targetPosition - startScroll; // Total distance to scroll
    let startTime = null; // Time when the animation starts

    /*
     * Function to animate scrolling
     * Uses requestAnimationFrame for smooth animation of the scroll.
     */
    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const currentScroll = getScrollEase(timeElapsed, startScroll, distanceToScroll, duration);
        window.scrollTo(0, currentScroll); // Scroll to the calculated position
        if (timeElapsed < duration) requestAnimationFrame(animateScroll); // Continue animation if not finished
    }

    requestAnimationFrame(animateScroll); // Start the animation
}

/*
 * Determines the number of visible images based on window width
 * Returns the number of images that should be visible based on screen size.
 */
function calculateVisibleImages() {
    if (window.innerWidth <= 480) return 1; // Small screens show 1 image
    if (window.innerWidth <= 768) return 2; // Medium screens show 2 images
    return 3; // Larger screens show 3 images
}

/*
 * Updates the carousel position and progress bar
 * Adjusts the carousel position and updates the progress bar based on the number of visible images.
 */
function updateCarousel() {
    const visibleImages = calculateVisibleImages(); // Number of images visible
    const imageWidth = gallery.children[0].offsetWidth; // Width of a single image
    gsap.to(gallery, {
        x: -scrollPosition * imageWidth,
        duration: 0.1,
        ease: 'power2.out'
    });
    progressBar.value = ((scrollPosition + visibleImages) / gallery.children.length) * 100; // Update progress bar
}

/*
 * Updates the navigation indicator based on the current section in view
 * Highlights the current section link and adjusts the indicator position.
 */
function updateNavIndicator() {
    const sections = document.querySelectorAll('section');
    const isSmallScreen = window.innerWidth <= 768;
    const navIndicator = document.getElementById('nav-indicator');

    if (isSmallScreen) {
        navIndicator.style.display = 'none'; // Hide on small screens
        return;
    }

    navIndicator.style.display = 'block'; // Show on larger screens
    const navLinks = document.querySelectorAll('#main-nav ul li a');
    let currentSectionId = '';
    let maxVisibleHeight = 0;

    /*
     * Determine the section with the maximum visible height
     * This helps in identifying the current section in view.
     */
    sections.forEach(function (section) {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);

        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            currentSectionId = section.getAttribute('id');
        }
    });

    /*
     * Update navigation links and indicator position
     * The indicator is adjusted to align with the active navigation link.
     */
    navLinks.forEach(function (link) {
        link.classList.remove('active'); // Remove active class from all links
        if (link.getAttribute('href').substring(1) === currentSectionId) {
            link.classList.add('active'); // Add active class to current section link
            const linkRect = link.getBoundingClientRect();
            const navRect = link.parentElement.parentElement.getBoundingClientRect();
            navIndicator.style.width = `${linkRect.width}px`; // Update indicator width
            navIndicator.style.left = `${linkRect.left - navRect.left}px`; // Update indicator position
        }
    });
}

/*
 * Initializes the hero button
 * Sets up the event listener for the hero button to scroll to the itinerary section.
 */
function initHeroButton() {
    const heroButton = document.getElementById('hero-button');
    if (heroButton) {
        heroButton.addEventListener('click', function (event) {
            event.preventDefault();
            smoothScroll('#itinerary', 1200); // Scroll to the itinerary section
        });
    }
}

/*
 * Initializes the navigation indicator and sets up event listeners
 * Sets up scroll and resize event listeners, and handles click events for navigation links.
 */
function initNavIndicator() {
    window.addEventListener('scroll', debounce(updateNavIndicator)); // Debounced scroll event
    window.addEventListener('resize', debounce(updateNavIndicator)); // Debounced resize event
    updateNavIndicator(); // Initial update

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const targetSelector = this.getAttribute('href');
            smoothScroll(targetSelector, 1200); // Scroll to the section linked by the clicked navigation link
        });
    });
}

/*
 * Initializes the burger menu for smaller screens
 * Sets up the event listener for the burger menu and side navigation.
 */
function initBurgerMenu() {
    const burgerMenu = document.getElementById('burger-menu');
    const sideNav = document.getElementById('side-nav');

    if (burgerMenu && sideNav) {
        burgerMenu.addEventListener('click', function () {
            sideNav.classList.toggle('open'); // Toggle the side navigation menu
        });

        sideNav.addEventListener('click', function (event) {
            if (event.target.tagName === 'A') {
                sideNav.classList.remove('open'); // Close the side navigation menu when a link is clicked
            }
        });
    } else {
        console.error('Burger menu or side nav not found.');
    }
}

/*
 * Initializes the carousel functionality
 * Sets up the carousel and its interaction with the next button.
 */
function initCarousel() {
    const nextButton = document.querySelector('.next');
    const gallery = document.querySelector('.image-gallery');
    const progressBar = document.querySelector('sl-progress-bar');
    let scrollPosition = 0;

    /*
     * Updates the carousel and progress bar
     * Adjusts the carousel position and updates the progress bar based on visible images.
     */
    function updateCarousel() {
        const visibleImages = calculateVisibleImages();
        const imageWidth = gallery.children[0].offsetWidth;
        gsap.to(gallery, {
            x: -scrollPosition * imageWidth,
            duration: 0.1,
            ease: 'power2.out'
        });
        progressBar.value = ((scrollPosition + visibleImages) / gallery.children.length) * 100;
    }

    /*
     * Handles the next button click to scroll images
     * Updates the carousel position based on the button click.
     */
    nextButton.addEventListener('click', function () {
        const visibleImages = calculateVisibleImages();
        if (scrollPosition < gallery.children.length - visibleImages) {
            scrollPosition++;
        } else {
            scrollPosition = 0;
        }
        updateCarousel(); // Update carousel position and progress bar
    });

    window.addEventListener('resize', updateCarousel); // Update carousel on resize
    updateCarousel(); // Initial update
}

/*
 * Initializes the itinerary form interactions
 * Sets up form submission and bubble selection functionality.
 */
function initItineraryForm() {
    const form = document.getElementById('itinerary-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    const submitButton = document.getElementById('submit-btn');
    const descriptor = document.getElementById('itinerary-descriptor');
    const bubbles = document.querySelectorAll('.bubble');
    const confirmationSound = document.getElementById('confirmation-sound');

    if (submitButton) {
        submitButton.addEventListener('click', function (event) {
            event.preventDefault();
            form.style.display = 'none'; // Hide form
            descriptor.style.display = 'none'; // Hide descriptor
            confirmationMessage.style.display = 'block'; // Show confirmation message
            confirmationSound.play(); // Play confirmation sound
        });
    } else {
        console.error('Submit button not found.');
    }

    /*
     * Handles the bubble selection
     * Toggles the 'selected' class on bubble elements when clicked.
     */
    bubbles.forEach(function (bubble) {
        bubble.addEventListener('click', function () {
            this.classList.toggle('selected');
        });
    });
}

/*
 * Main initialization function
 * Calls all initialization functions to set up the page.
 */
function init() {
    initNavIndicator();
    initItineraryForm();
    initCarousel();
    initHeroButton();
    initBurgerMenu();
}

// Waits for the DOM to fully load before initializing
document.addEventListener('DOMContentLoaded', init); 