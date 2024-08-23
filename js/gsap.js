// gsap.js

// Register GSAP
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