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
 * Updates the position and width of the navigation indicator based on the current scroll position.
 * Highlights the navigation link corresponding to the currently visible section.
 */
function updateNavIndicator() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const navIndicator = document.getElementById('nav-indicator');
    let currentSection = '';

    // Determine the current section based on scroll position
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 70; // Adjust for sticky header
        if (window.scrollY >= sectionTop) {
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
 * Calls the updateNavIndicator function to ensure the indicator is in the correct initial position.
 */
function initNavIndicator() {
    window.addEventListener('scroll', debounce(updateNavIndicator));
    window.addEventListener('resize', debounce(updateNavIndicator));
    updateNavIndicator();
}


//Main initialisation function.
function init() {
    initNavIndicator();
}

/**
 * Wait for the DOM to fully load before initialising.
 * Ensures that all elements are available for manipulation.
 */
document.addEventListener('DOMContentLoaded', init);
