import { state, actions, updateState } from './state.js';
import { initializeMap } from './map.js';
import { initializeWeatherWidget } from './weather.js';
import { initParticles } from './particles.js';
import { initImpactAnimations, addCursedEnergyEffects } from './impact.js';

// Environment variables and API keys would typically be in a .env file
const config = {
    weatherApiKey: process.env.WEATHER_API_KEY || 'YOUR_WEATHER_API_KEY',
};

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    setupMobileNav();
    
    // Make functions available globally
    window.joinEvent = joinEvent;
    window.initializeWeatherWidget = initializeWeatherWidget;
});

async function initializeApp() {
    await getUserLocation();
    await loadScripts();
    initializeMap();
    initializeWeatherWidget();
    initializeImpactStats();
    setupModalHandlers(); // Add this line
}

// Geolocation
async function getUserLocation() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        state.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        
        return state.currentLocation;
    } catch (error) {
        console.error('Error getting location:', error);
        // Fall back to default location
        state.currentLocation = { lat: 0, lng: 0 };
    }
}

// Map Initialization (placeholder for map integration)
function initializeMap() {
    // This will be implemented with your chosen map provider
    console.log('Map initialization pending API key');
}

// Weather Widget
async function initializeWeatherWidget() {
    // This will be implemented with your chosen weather API
    console.log('Weather widget initialization pending API key');
}

// Event Listeners
function setupEventListeners() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Implement join cleanup logic
            console.log('Join cleanup clicked');
        });
    }

    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Mobile Navigation
function setupMobileNav() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav-menu');
    
    // Add mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    header.insertBefore(mobileMenuBtn, nav);
    
    // Toggle menu
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.innerHTML = nav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Create cursed energy particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'cursed-particles';
    document.body.appendChild(particlesContainer);

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 3 and 8 pixels
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 4000);
    }

    // Create new particles periodically
    setInterval(createParticle, 200);
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initParticles();
    
    // Initialize weather widget
    initializeWeatherWidget();
    
    // Initialize impact section animations
    initImpactAnimations();
    addCursedEnergyEffects();
    
    // Initialize cursed pattern effect
    initCursedPattern();
});

function initCursedPattern() {
    const patterns = document.querySelectorAll('.cursed-pattern');
    patterns.forEach(pattern => {
        pattern.style.opacity = '0';
        requestAnimationFrame(() => {
            pattern.style.transition = 'opacity 1s ease-in-out';
            pattern.style.opacity = '0.1';
        });
    });
}

// Modal Functions
function setupModalHandlers() {
    const modal = document.getElementById('domainModal');
    const openButtons = document.querySelectorAll('.cta-button');
    const closeButton = document.querySelector('.close');
    const registrationForm = document.getElementById('registrationForm');

    // Open modal
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'block';
            // Add cursed energy particle effect
            addCursedEnergyEffects(modal);
        });
    });

    // Close modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registrationForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send this to your backend
        console.log('Registration data:', data);
        
        // Show success message and close modal
        alert('Welcome to the domain! Your registration is complete.');
        modal.style.display = 'none';
        registrationForm.reset();
    });
}

// Utility Functions
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Export functions for modular use
export {
    initializeApp,
    getUserLocation,
    initializeMap,
    initializeWeatherWidget
};
