// main.js

// GSAP Implementation
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function () {
    // Create a ScrollTrigger instance for the hero section
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top 60%', // Animation starts when the top of the hero section is 60% down the viewport
        end: 'bottom 40%', // Animation ends when the bottom of the hero section is 40% down the viewport
        onEnter: function () {
            // Animate the main heading (h1)
            gsap.fromTo('h1',
                { opacity: 0, y: -50 },
                { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.2 }
            );

            // Animate the sub-heading with a slight delay
            gsap.fromTo('#sub-heading',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.4 }
            );
        },
        onLeaveBack: function () {
            // Reset properties when scrolling back up
            gsap.set('h1', { clearProps: 'opacity, y' });
            gsap.set('#sub-heading', { clearProps: 'opacity, y' });
            gsap.set('.hero-button', { clearProps: 'opacity, scale' });
        },
        onEnterBack: function () {
            // Replay animations when scrolling back into view
            gsap.fromTo('h1',
                { opacity: 0, y: -50 },
                { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.2 }
            );

            gsap.fromTo('#sub-heading',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.4 }
            );
        }
    });

    // Animate section headings (h2)
    gsap.utils.toArray('h2').forEach(function (h2) {
        gsap.from(h2, {
            scrollTrigger: {
                trigger: h2,
                start: 'top 75%',
                end: 'bottom 25%',
                scrub: true, // Smooth animation
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 3
        });
    });

    // Carousel container slide-in animation
    var carouselContainer = document.querySelector('.gallery-container');

    if (carouselContainer) {
        gsap.fromTo(carouselContainer,
            { x: '-100%' },  // Animation starts with the container off-screen to the left
            {
                x: '0%',  // Animation ends with the container in its original position
                duration: 2.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: carouselContainer,
                    start: 'top 80%',  // Animation starts when the top of the container is 80% down the viewport
                    end: 'top 20%',
                    scrub: true,  // Smooth animation
                    toggleActions: 'play none none reverse'  // Replays animation when scrolling back
                }
            }
        );
    }

    // Experiences container slide-in animation
    var experiencesContainer = document.querySelector('.experiences-grid');

    if (experiencesContainer) {
        gsap.fromTo(experiencesContainer,
            { x: '100%' },  // Animation starts with the container off-screen to the right
            {
                x: '0%',  // Animation ends with the container in its original position
                duration: 2.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: experiencesContainer,
                    start: 'top 80%',  // Animation starts when the top of the container is 80% down the viewport
                    end: 'top 20%',
                    scrub: true,  // Smooth animation
                    toggleActions: 'play none none reverse'  // Replays animation when scrolling back
                }
            }
        );
    }

    // Animate bubble selectors
    gsap.utils.toArray('.bubble').forEach(function (bubble) {
        gsap.fromTo('.bubble',
            { opacity: 0, y: 50 },
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
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
});

// Content functions and initializations

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