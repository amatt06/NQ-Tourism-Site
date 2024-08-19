// main.js

/**
 * Utility function to debounce events.
 * Delays the processing of the event handler until after a specified wait time has elapsed since the last event.
 */
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function () {
        const context = this, args = arguments;
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

/**
 * Easing function for smooth scrolling.
 */
function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

/**
 * Smoothly scrolls to the target section when a navigation link is clicked.
 * Offsets for the sticky navbar.
 */
function smoothScroll(target, duration) {
    const start = window.scrollY;
    const navbarHeight = document.querySelector('nav').offsetHeight;
    const targetPosition = document.querySelector(target).offsetTop - navbarHeight;
    const distance = targetPosition - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}

/**
 * Updates the position and width of the navigation indicator based on the current scroll position.
 * Highlights the navigation link corresponding to the currently visible section.
 */
function updateNavIndicator() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const navIndicator = document.getElementById('nav-indicator');
    let currentSection = '';
    let maxVisibleHeight = 0;

    // Determine which section is mostly visible
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);

        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            currentSection = section.getAttribute('id');
        }
    });

    // Update the navigation links and indicator
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
            const rect = link.getBoundingClientRect();
            const navRect = link.parentElement.parentElement.getBoundingClientRect();
            navIndicator.style.width = `${rect.width}px`;
            navIndicator.style.left = `${rect.left - navRect.left}px`;
        }
    });
}

/**
 * Initialises the navigation indicator and sets up event listeners for scroll and resize events.
 * Also sets up smooth scrolling for navigation links.
 */
function initNavIndicator() {
    window.addEventListener('scroll', debounce(updateNavIndicator));
    window.addEventListener('resize', debounce(updateNavIndicator));
    updateNavIndicator();

    document.querySelectorAll('nav ul li a' && 'a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScroll(targetId, 1200);
        });
    });
}

/**
 * Initializes the itinerary form interactions.
 * Handles form submission, showing a confirmation message, and managing Shoelace components.
 */
function initItineraryForm() {
    const form = document.getElementById('itinerary-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    const submitButton = document.getElementById('submit-btn');
    const descriptor = document.getElementById('itinerary-descriptor');
    const bubbles = document.querySelectorAll('.bubble');

    // Handle form submission
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        form.style.display = 'none';
        descriptor.style.display = 'none';
        confirmationMessage.style.display = 'block';
    });

    bubbles.forEach(bubble => {
        bubble.addEventListener('click', function () {
            this.classList.toggle('selected');
        });
    });
}

/**
 * Main initialisation function.
 * Sets up the navigation indicator.
 */
function init() {
    initNavIndicator();
    initItineraryForm()
}

/**
 * Wait for the DOM to fully load before initialising.
 * Ensures that all elements are available for manipulation.
 */
document.addEventListener('DOMContentLoaded', init);
