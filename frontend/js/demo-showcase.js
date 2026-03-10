/* ===== DEMO SHOWCASE SCRIPT ===== */
class DemoShowcase {
    constructor() {
        this.demoActions = [
            { 
                title: '3D Coin Animation', 
                description: 'Floating golden rupee coin with rotation and hover effects',
                selector: '.hero-3d-coin'
            },
            { 
                title: 'Particle System', 
                description: 'Interactive particles that react to mouse movement',
                action: () => this.highlightParticles()
            },
            { 
                title: 'Holographic Cards', 
                description: 'Cards with shimmer sweep and 3D tilt effects',
                selector: '.sponsor-card, .event-card'
            },
            { 
                title: 'Toast Notifications', 
                description: 'Animated notification system with different types',
                action: () => this.showToastDemo()
            },
            { 
                title: 'Page Transitions', 
                description: 'Smooth fade transitions between pages',
                description: 'Click navigation links to see smooth transitions'
            },
            { 
                title: 'Modal Animations', 
                description: 'Glassmorphic modals with smooth animations',
                action: () => this.showModalDemo()
            }
        ];
        
        this.init();
    }
    
    init() {
        // Add demo showcase button
        this.addShowcaseButton();
        
        // Don't auto-highlight - let demo data be the focus
        console.log('Demo mode active - Demo data loaded and visible');
    }
    
    addShowcaseButton() {
        const showcaseBtn = document.createElement('div');
        showcaseBtn.id = 'demo-showcase-btn';
        showcaseBtn.innerHTML = `
            <div class="showcase-icon">🎪</div>
            <div class="showcase-text">Demo Showcase</div>
        `;
        showcaseBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--gradient-cosmic);
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            cursor: pointer;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            transition: all 0.3s var(--ease-out);
            font-weight: 600;
            font-size: 0.9rem;
        `;
        
        showcaseBtn.addEventListener('mouseenter', () => {
            showcaseBtn.style.transform = 'translateY(-2px) scale(1.05)';
            showcaseBtn.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
        });
        
        showcaseBtn.addEventListener('mouseleave', () => {
            showcaseBtn.style.transform = 'translateY(0) scale(1)';
            showcaseBtn.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
        });
        
        showcaseBtn.addEventListener('click', () => {
            this.runShowcase();
        });
        
        document.body.appendChild(showcaseBtn);
    }
    
    highlightNextDemo() {
        const currentDemo = this.demoActions[this.currentDemoIndex || 0];
        
        if (currentDemo.selector) {
            const elements = document.querySelectorAll(currentDemo.selector);
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('demo-highlight');
                    setTimeout(() => {
                        el.classList.remove('demo-highlight');
                    }, 2000);
                }, index * 100);
            });
        }
        
        // Show info toast
        if (window.showToast && currentDemo.action) {
            window.showToast('Click to explore features manually!', 'info', 3000);
        }
    }
    
    highlightParticles() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.classList.add('hover-effect');
                setTimeout(() => {
                    particle.classList.remove('hover-effect');
                }, 1000);
            }, index * 50);
        });
    }
    
    showToastDemo() {
        const types = ['success', 'error', 'info', 'warning'];
        const messages = [
            '🎉 Sponsor added successfully!',
            '⚠️ Budget limit reached',
            'ℹ️ System update available',
            '✨ New feature unlocked!'
        ];
        
        types.forEach((type, index) => {
            setTimeout(() => {
                if (window.showToast) {
                    window.showToast(messages[index], type, 3000);
                }
            }, index * 800);
        });
    }
    
    showModalDemo() {
        // Create a demo modal
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎨 Visual Demo</h3>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <p style="color: var(--text-secondary); margin-bottom: 15px;">
                        This modal showcases the glassmorphic design with smooth animations!
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="btn-primary" onclick="this.closest('.modal').remove()">Awesome!</button>
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        }, 5000);
    }
    
    runShowcase() {
        this.currentDemoIndex = 0;
        this.highlightNextDemo();
    }
}

// Initialize demo showcase - Always active for presentation mode
document.addEventListener('DOMContentLoaded', () => {
    window.demoShowcase = new DemoShowcase();
});

export { DemoShowcase };