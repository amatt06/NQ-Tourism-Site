/* Utility function to debounce events
Prevents a function from being called too often, improving performance by limiting the rate at which the function is invoked. */
function debounceEvent(callbackFunction, delayTime = 10, executeImmediately = true) {
    let timeoutId;
    return function () {
        const context = this, args = arguments;

        // Defines the function to be executed after the delay
        const laterExecution = function () {
            timeoutId = null;
            if (!executeImmediately) callbackFunction.apply(context, args);
        };

        // Determines if the function should be called immediately
        const shouldCallNow = executeImmediately && !timeoutId;

        // Clears the existing timeout, if any, to restart the debounce timer
        clearTimeout(timeoutId);

        // Sets a new timeout to execute the function after the specified delay
        timeoutId = setTimeout(laterExecution, delayTime);

        // Calls the function immediately if `executeImmediately` is true and no timeout exists
        if (shouldCallNow) callbackFunction.apply(context, args);
    };
}

/* Easing function for smooth scrolling
Provides a smooth transition effect when scrolling, based on a quadratic easing formula. */
function calculateEasingTransition(elapsedTime, startPosition, totalDistance, duration) {
    // Normalizes the time value to fit within a half-duration
    elapsedTime /= duration / 2;

    // Applies easing for the first half of the scroll duration
    if (elapsedTime < 1) return totalDistance / 2 * elapsedTime * elapsedTime + startPosition;

    // Applies easing for the second half of the scroll duration
    elapsedTime--;
    return -totalDistance / 2 * (elapsedTime * (elapsedTime - 2) - 1) + startPosition;
}

/* Smoothly scrolls to the target section when a navigation link is clicked
Uses the easing function to create a smooth scrolling animation to the specified section of the page. */
function smoothScrollToSection(targetSelector, scrollDuration) {
    // Gets the current scroll position and the target position
    const startingYPosition = window.scrollY;
    const navigationBarHeight = document.querySelector('nav').offsetHeight;
    const targetSectionYPosition = document.querySelector(targetSelector).offsetTop - navigationBarHeight;

    // Calculates the distance to scroll
    const distanceToScroll = targetSectionYPosition - startingYPosition;
    let startTime = null;

    // Animation function that will be called on each frame
    function executeScrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;

        // Calculates the time elapsed since the start of the animation
        const timeElapsed = currentTime - startTime;

        // Calculates the new Y position using the easing function
        const newYPosition = calculateEasingTransition(timeElapsed, startingYPosition, distanceToScroll, scrollDuration);

        // Scrolls the window to the new position
        window.scrollTo(0, newYPosition);

        // Continues the animation until the duration is reached
        if (timeElapsed < scrollDuration) requestAnimationFrame(executeScrollAnimation);
    }

    // Initiates the animation
    requestAnimationFrame(executeScrollAnimation);
}

/* Updates the navigation indicator based on the currently visible section
Dynamically highlights the navigation link corresponding to the section currently visible in the viewport. */
function updateNavigationIndicator() {
    const sections = document.querySelectorAll('section');
    const isScreenSmall = window.innerWidth <= 768;
    const navIndicatorElement = document.getElementById('nav-indicator');

    // Hides the navigation indicator on small screens to avoid clutter
    if (isScreenSmall) {
        navIndicatorElement.style.display = 'none';
        return;
    } else {
        navIndicatorElement.style.display = 'block';
    }

    // Retrieves all navigation links
    const navLinks = document.querySelectorAll('#main-nav ul li a');
    let mostVisibleSection = '';
    let maxVisibleHeight = 0;

    // Iterates through each section to determine which one is most visible
    sections.forEach(function (section) {
        const sectionRect = section.getBoundingClientRect();
        const visibleHeight = Math.min(window.innerHeight, sectionRect.bottom) - Math.max(0, sectionRect.top);

        // Updates the most visible section based on its visible height
        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            mostVisibleSection = section.getAttribute('id');
        }
    });

    // Updates the navigation links and indicator position to highlight the current section
    navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === mostVisibleSection) {
            link.classList.add('active');
            const linkRect = link.getBoundingClientRect();
            const navRect = link.parentElement.parentElement.getBoundingClientRect();
            navIndicatorElement.style.width = linkRect.width + 'px';
            navIndicatorElement.style.left = (linkRect.left - navRect.left) + 'px';
        }
    });
}

/* Initialises smooth scroll for the hero button
Adds an event listener to the hero button, enabling smooth scrolling to the itinerary section when clicked. */
function initHeroButtonSmoothScroll() {
    const heroButtonElement = document.getElementById('hero-button');
    if (heroButtonElement) {
        heroButtonElement.addEventListener('click', function (event) {
            event.preventDefault();
            smoothScrollToSection('#itinerary', 1200);
        });
    }
}

/* Initialises the navigation indicator and event listeners
Sets up the scroll and resize event listeners to update the navigation indicator dynamically. */
function initNavigationIndicator() {
    // Debounce is used to limit the frequency of updates for better performance
    window.addEventListener('scroll', debounceEvent(updateNavigationIndicator));
    window.addEventListener('resize', debounceEvent(updateNavigationIndicator));
    updateNavigationIndicator();

    // Adds smooth scroll functionality to each navigation link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(function (navLink) {
        navLink.addEventListener('click', function (event) {
            event.preventDefault();
            const targetSectionId = this.getAttribute('href');
            smoothScrollToSection(targetSectionId, 1200);
        });
    });
}

/* Initialises the burger menu for smaller screens
Adds functionality to open and close the side navigation menu on smaller screens. */
function initResponsiveBurgerMenu() {
    const burgerMenuButton = document.getElementById('burger-menu');
    const sideNavigationMenu = document.getElementById('side-nav');

    // Toggles the side navigation menu when the burger button is clicked
    burgerMenuButton.addEventListener('click', function () {
        sideNavigationMenu.classList.toggle('open');
    });

    // Closes the side navigation menu when a link within it is clicked
    sideNavigationMenu.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            sideNavigationMenu.classList.remove('open');
        }
    });
}

/* Determines the number of visible images based on window width
Helps the carousel adjust to different screen sizes by determining how many images should be visible at once. */
function getNumberOfVisibleImages() {
    if (window.innerWidth <= 480) {
        return 1;
    } else if (window.innerWidth <= 768) {
        return 2;
    } else {
        return 3;
    }
}

/* Updates the carousel position and progress bar
Repositions the carousel images and updates the progress bar to reflect the current position. */
function updateImageCarousel(galleryElement, progressBarElement, scrollPosition) {
    const visibleImagesCount = getNumberOfVisibleImages();
    const imageWidth = galleryElement.children[0].offsetWidth;

    // Uses GSAP for smooth scrolling animation within the carousel
    gsap.to(galleryElement, {
        x: -scrollPosition * imageWidth,
        duration: 0.1,
        ease: 'power2.out'
    });

    // Updates the progress bar based on the number of visible images and total images
    progressBarElement.value = ((scrollPosition + visibleImagesCount) / galleryElement.children.length) * 100;
}

/* Handles the next button click to scroll images in the carousel
 Moves the carousel to the next set of images when the user clicks the next button. */
function handleNextButtonClick(galleryElement, progressBarElement) {
    let scrollPosition = 0;
    const visibleImagesCount = getNumberOfVisibleImages();

    // Returns a function that will increment the scroll position or reset it to 0
    return function () {
        if (scrollPosition < galleryElement.children.length - visibleImagesCount) {
            scrollPosition++;
        } else {
            scrollPosition = 0;
        }
        updateImageCarousel(galleryElement, progressBarElement, scrollPosition);
    };
}

/* Initialises the carousel functionality
Sets up the carousel to respond to next button clicks and window resize events. */
function initImageGalleryCarousel() {
    const nextButtonElement = document.querySelector('.next');
    const imageGalleryElement = document.querySelector('.image-gallery');
    const progressBarElement = document.querySelector('sl-progress-bar');
    let scrollPosition = 0;

    // Binds the next button click handler
    nextButtonElement.addEventListener('click', handleNextButtonClick(imageGalleryElement, progressBarElement));

    // Updates the carousel when the window is resized
    window.addEventListener('resize', function () {
        updateImageCarousel(imageGalleryElement, progressBarElement, scrollPosition);
    });

    // Initial update of the carousel
    updateImageCarousel(imageGalleryElement, progressBarElement, scrollPosition);
}

/* Initialises the itinerary form interactions.
 Sets up form submission handling and bubble selection toggling for the itinerary form. */
function initItineraryFormInteractions() {
    const formElement = document.getElementById('itinerary-form');
    const confirmationMessageElement = document.getElementById('confirmation-message');
    const submitButtonElement = document.getElementById('submit-btn');
    const descriptorElement = document.getElementById('itinerary-descriptor');
    const bubbleElements = document.querySelectorAll('.bubble');
    const confirmationSoundElement = document.getElementById('confirmation-sound');

    // Handles form submission
    submitButtonElement.addEventListener('click', function (event) {
        event.preventDefault();
        formElement.style.display = 'none';
        descriptorElement.style.display = 'none';
        confirmationMessageElement.style.display = 'block';

        // Plays a confirmation sound when the form is submitted
        confirmationSoundElement.play();
    });

    // Toggles the selected state of bubbles when clicked
    bubbleElements.forEach(function (bubbleElement) {
        bubbleElement.addEventListener('click', function () {
            this.classList.toggle('selected');
        });
    });
}

/*/ Main initialisation function
Calls the initialisation functions for various features of the website. */
function init() {
    initNavigationIndicator();         // Initialise navigation indicator
    initItineraryFormInteractions();   // Initialise itinerary form interactions
    initImageGalleryCarousel();        // Initialise image carousel
    initHeroButtonSmoothScroll();      // Initialise smooth scroll for hero button
    initResponsiveBurgerMenu();        // Initialise responsive burger menu
}

/* Waits for the DOM to fully load before initialising
Ensures that all DOM elements are available before executing any scripts. */
document.addEventListener('DOMContentLoaded', init);