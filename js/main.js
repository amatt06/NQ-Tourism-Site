// main.js

// Utility function to debounce events (e.g., scroll, resize)
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

// Update the position and width of the navigation indicator
function updateNavIndicator() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const navIndicator = document.getElementById('nav-indicator');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 70; // Adjust for sticky header
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

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

// Function to initialize the navigation indicator and set up event listeners
function initNavIndicator() {
    window.addEventListener('scroll', debounce(updateNavIndicator));
    window.addEventListener('resize', debounce(updateNavIndicator));
    updateNavIndicator();
}

// Main initialization function
function init() {
    initNavIndicator();
}

// Wait for the DOM to fully load before initializing
document.addEventListener('DOMContentLoaded', init);
