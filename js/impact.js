import { state, actions, updateState } from './state.js';

// Mock data - in production this would come from a backend API
const impactStats = {
    wasteCollected: { value: 2500, unit: 'kg' },
    volunteers: 1200,
    hoursDedicated: 5000,
    beachesCleaned: 15
};

export function initializeImpactStats() {
    updateStats();
    setupCounterAnimation();
}

function updateStats() {
    // In production, this would fetch from an API
    updateState(actions.SET_IMPACT_STATS, impactStats);
}

function setupCounterAnimation() {
    const numbers = document.querySelectorAll('.stat-number');
    
    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const updateNumber = () => {
            current += increment;
            const value = Math.round(current);
            
            if (value > end) {
                element.textContent = formatNumber(end);
                return;
            }
            
            element.textContent = formatNumber(value);
            requestAnimationFrame(updateNumber);
        };
        
        requestAnimationFrame(updateNumber);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = parseInt(element.textContent);
                animateValue(element, 0, finalValue, 2000);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    numbers.forEach(number => observer.observe(number));
}

function formatNumber(value) {
    if (typeof value === 'object' && value.value !== undefined) {
        // Handle values with units
        const formattedValue = value.value >= 1000 
            ? value.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value.value.toString();
        return `${formattedValue} ${value.unit}`;
    }
    
    // Handle simple numbers
    if (value >= 1000) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value + (value === impactStats.beachesCleaned ? '' : '+');
}

// Animation for impact statistics
export function initImpactAnimations() {
    const stats = document.querySelectorAll('.stat-number');
    const options = {
        root: null,
        threshold: 0.5,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent.replace(/[^0-9]/g, ''));
                animateValue(target, 0, finalValue);
                observer.unobserve(target);
            }
        });
    }, options);

    stats.forEach(stat => observer.observe(stat));
}

function animateValue(obj, start, end, duration = 2000) {
    let startTimestamp = null;
    const unit = obj.textContent.replace(/[0-9,]/g, '').trim();
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        
        // Format number with commas and add unit
        obj.textContent = currentValue.toLocaleString() + (unit ? ' ' + unit : '');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Add cursed energy particles to impact cards
export function addCursedEnergyEffects() {
    const cards = document.querySelectorAll('.impact-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseover', () => {
            createCursedEnergyParticles(card);
        });
    });
}

function createCursedEnergyParticles(element) {
    const particleCount = 5;
    const colors = ['#6E44FF', '#0B356F', '#FF304F'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'cursed-particle';
        
        const size = Math.random() * 5 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
        `;
        
        const startX = Math.random() * element.offsetWidth;
        const startY = Math.random() * element.offsetHeight;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        element.appendChild(particle);
        
        // Animate particle
        requestAnimationFrame(() => {
            particle.style.transition = 'all 1s ease-out';
            particle.style.transform = `translate(
                ${(Math.random() - 0.5) * 100}px,
                ${(Math.random() - 0.5) * 100}px
            )`;
            particle.style.opacity = '0.8';
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        });
    }
}
