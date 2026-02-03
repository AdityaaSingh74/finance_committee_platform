/* ===== PAGE TRANSITION SYSTEM ===== */
class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        // Add page loaded class for fade-in effect
        document.body.classList.add('page-loading');
        
        // Trigger fade-in after DOM is ready
        requestAnimationFrame(() => {
            document.body.classList.remove('page-loading');
            document.body.classList.add('page-loaded');
        });
        
        // Setup internal link interception
        this.setupLinkInterception();
        
        // Handle browser back/forward buttons
        this.setupPopStateHandler();
    }
    
    setupLinkInterception() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (!link || this.isTransitioning) return;
            
            // Check if it's an internal link (same domain, not hash, not external)
            const href = link.getAttribute('href');
            if (!href || 
                href.startsWith('#') || 
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                link.hasAttribute('download') ||
                link.hasAttribute('target') ||
                (href.startsWith('http') && !href.includes(window.location.hostname))) {
                return;
            }
            
            // Skip form submissions and special actions
            if (link.onclick || link.getAttribute('role') === 'button') {
                return;
            }
            
            e.preventDefault();
            this.transitionTo(href);
        });
    }
    
    setupPopStateHandler() {
        window.addEventListener('popstate', (e) => {
            if (this.isTransitioning) return;
            
            // Fade out, then reload the page
            document.body.classList.add('page-exit');
            setTimeout(() => {
                window.location.reload();
            }, 300);
        });
    }
    
    transitionTo(url) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Add exit animation
        document.body.classList.add('page-exit');
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
    
    // Public method to manually trigger transition
    navigate(url) {
        this.transitionTo(url);
    }
    
    // Reset transition state (useful for SPA scenarios)
    reset() {
        this.isTransitioning = false;
        document.body.classList.remove('page-exit');
    }
}

// Initialize page transitions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitions = new PageTransitions();
});

export { PageTransitions };