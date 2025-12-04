// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Newsletter form submission
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    // Show success message (in production, this would submit to a backend)
    const submitButton = newsletterForm.querySelector('button');
    const originalText = submitButton.textContent;
    submitButton.textContent = '✓ Subscribed!';
    submitButton.style.backgroundColor = '#10b981';
    emailInput.value = '';
    
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.style.backgroundColor = '';
    }, 3000);
});

// Game card button interactions
const gameButtons = document.querySelectorAll('.game-card .btn-secondary');
gameButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const gameCard = button.closest('.game-card');
        const gameName = gameCard.querySelector('h3').textContent;
        // Visual feedback
        button.textContent = 'Loading...';
        button.disabled = true;
        
        // Simulate navigation (in production, this would navigate to game details page)
        setTimeout(() => {
            console.log(`Viewing details for: ${gameName}`);
            button.textContent = 'View Details';
            button.disabled = false;
        }, 1000);
    });
});

// Hero button interaction
const heroButton = document.querySelector('.hero .btn-primary');
if (heroButton) {
    heroButton.addEventListener('click', () => {
        const gamesSection = document.getElementById('games');
        if (gamesSection) {
            gamesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Genre card interactions
const genreCards = document.querySelectorAll('.genre-card');
genreCards.forEach(card => {
    card.addEventListener('click', () => {
        const genreName = card.querySelector('h3').textContent;
        // Visual feedback
        genreCards.forEach(c => c.style.opacity = '0.5');
        card.style.opacity = '1';
        
        // Simulate filtering (in production, this would filter games by genre)
        console.log(`Browsing ${genreName} games...`);
        setTimeout(() => {
            genreCards.forEach(c => c.style.opacity = '1');
        }, 1500);
    });
});

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe game cards, genre cards, and review cards for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.game-card, .genre-card, .review-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Combined scroll handler for better performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Add active state to navigation based on scroll position
            const sections = document.querySelectorAll('section[id]');
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });

            // Add parallax effect to hero section
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.backgroundPositionY = scrollY * 0.5 + 'px';
            }
            
            ticking = false;
        });
        ticking = true;
    }
});

console.log('GameHub website loaded successfully! 🎮');
