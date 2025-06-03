// Particle system for cursed energy effects
export class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#6E44FF', '#0B356F', '#FF304F']; // Cursed energy colors
        this.init();
        this.animate();
    }

    init() {
        // Set canvas size
        const updateSize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener('resize', updateSize);

        // Create initial particles
        for (let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 5 + 2,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            life: 1,
            maxLife: Math.random() * 3 + 2
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 0.01;

            // Particle fading effect
            this.ctx.globalAlpha = particle.life;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // Replace dead particles
            if (particle.life <= 0) {
                this.particles[index] = this.createParticle();
            }

            // Wrap particles around screen
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

export function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.6;
    `;
    document.body.appendChild(canvas);
    new ParticleSystem(canvas);
}
