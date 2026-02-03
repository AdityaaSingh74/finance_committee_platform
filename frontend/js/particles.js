/* ===== ENHANCED PARTICLE SYSTEM ===== */
class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isInitialized = false;
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createParticles();
        this.setupMouseTracking();
        this.isInitialized = true;
    }
    
    createParticles() {
        const particleCount = window.innerWidth < 768 ? 8 : 15;
        const types = ['teal', 'gold', 'neon-cyan'];
        const sizes = ['small', 'medium', 'large'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random type and size
            const type = types[Math.floor(Math.random() * types.length)];
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            
            particle.classList.add(type, size);
            
            // Random horizontal position
            particle.style.left = Math.random() * 100 + '%';
            
            // Random animation delay
            particle.style.animationDelay = Math.random() * 15 + 's';
            
            // Random animation duration variation
            const duration = 12 + Math.random() * 8;
            particle.style.animationDuration = duration + 's';
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    setupMouseTracking() {
        if (window.innerWidth < 768) return; // Skip on mobile for performance
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Make nearby particles react to mouse
            this.particles.forEach(particle => {
                const rect = particle.getBoundingClientRect();
                const particleX = rect.left + rect.width / 2;
                const particleY = rect.top + rect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(this.mouseX - particleX, 2) + 
                    Math.pow(this.mouseY - particleY, 2)
                );
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    const angle = Math.atan2(particleY - this.mouseY, particleX - this.mouseX);
                    const moveX = Math.cos(angle) * force * 20;
                    const moveY = Math.sin(angle) * force * 20;
                    
                    particle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.5})`;
                    particle.classList.add('hover-effect');
                    
                    setTimeout(() => {
                        particle.classList.remove('hover-effect');
                        particle.style.transform = '';
                    }, 300);
                }
            });
        });
    }
    
    // Clean up particles
    destroy() {
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
        this.isInitialized = false;
    }
    
    // Recreate particles on resize
    handleResize() {
        if (window.innerWidth < 768 && this.particles.length > 8) {
            // Reduce particles on mobile
            while (this.particles.length > 8) {
                const particle = this.particles.pop();
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }
        } else if (window.innerWidth >= 768 && this.particles.length < 15) {
            // Add more particles on desktop
            this.destroy();
            this.init();
        }
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.particleSystem = new ParticleSystem('particlesContainer');
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.particleSystem) {
                window.particleSystem.handleResize();
            }
        }, 250);
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.particleSystem) {
            window.particleSystem.destroy();
        }
    });
});

export { ParticleSystem };