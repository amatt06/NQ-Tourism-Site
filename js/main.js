// main.js

// GSAP Implementation
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // Create ScrollTrigger instance for the hero section
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top 60%', // Starts when the top of the hero section is 60% down the viewport
        end: 'bottom 40%', // Ends when the bottom of the hero section is 40% down the viewport
        onEnter: () => {
            // Animate h1 heading
            gsap.fromTo('h1',
                {opacity: 0, y: -50},
                {opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.2}
            );

            // Animate sub-heading with a slight delay
            gsap.fromTo('#sub-heading',
                {opacity: 0, y: 30},
                {opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.4}
            );
        },
        onLeaveBack: () => {
            // Reset the properties when the user scrolls back up
            gsap.set('h1', {clearProps: 'opacity,y'});
            gsap.set('#sub-heading', {clearProps: 'opacity,y'});
            gsap.set('.hero-button', {clearProps: 'opacity,scale'});
        },
        onEnterBack: () => {
            // Replay the animations when scrolling back into view
            gsap.fromTo('h1',
                {opacity: 0, y: -50},
                {opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.2}
            );

            gsap.fromTo('#sub-heading',
                {opacity: 0, y: 30},
                {opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.4}
            );
        },
    });

    // Section headings (h2) animation
    gsap.utils.toArray('h2').forEach(h2 => {
        gsap.from(h2, {
            scrollTrigger: {
                trigger: h2,
                start: 'top 75%',
                end: 'bottom 25%',
                scrub: true,
                toggleActions: 'play none none reverse',
            },
            y: 50,
            opacity: 0,
            duration: 3
        });
    });

    // Carousel container slide in animation
    const carouselContainer = document.querySelector('.gallery-container');

    if (carouselContainer) {
        gsap.fromTo(carouselContainer,
            {x: '-100%'},  // Start position (off-screen to the left)
            {
                x: '0%',  // End position (original position)
                duration: 2.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: carouselContainer,
                    start: 'top 80%',  // Start animation when the top of the carousel container is 80% from the top of the viewport
                    end: 'top 20%',
                    scrub: ease(),  // Smooth animation
                    toggleActions: 'play none none reverse',  // Replays the animation when scrolling back
                }
            }
        );
    }

    // Animate bubble selectors
    gsap.utils.toArray('.bubble').forEach(bubble => {
        gsap.fromTo('.bubble',
            {opacity: 0, y: 50},
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.2, // Adjust the time between each bubble's animation
                scrollTrigger: {
                    trigger: '#itinerary',
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    });
});

// Content functions and initialisations
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

function initCarousel() {
    const nextButton = document.querySelector('.next');
    const gallery = document.querySelector('.image-gallery');
    const progressBar = document.querySelector('sl-progress-bar');
    let scrollPosition = 0;

    function getVisibleImages() {
        if (window.innerWidth <= 480) {
            return 1;
        } else if (window.innerWidth <= 768) {
            return 2;
        } else {
            return 3;
        }
    }

    function updateCarousel() {
        const visibleImages = getVisibleImages();
        const imageWidth = gallery.children[0].offsetWidth;
        gsap.to(gallery, {
            x: -scrollPosition * imageWidth,
            duration: 0.1,
            ease: 'power2.out',
        });
        progressBar.value = ((scrollPosition + visibleImages) / gallery.children.length) * 100;
    }

    nextButton.addEventListener('click', () => {
        const visibleImages = getVisibleImages();
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
    initItineraryForm();
    initCarousel();
}

/**
 * Wait for the DOM to fully load before initialising.
 * Ensures that all elements are available for manipulation.
 */
document.addEventListener('DOMContentLoaded', init);
