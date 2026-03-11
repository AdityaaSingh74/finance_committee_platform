/**
 * Fluid Ambient Background — Slow, organic, warm-toned gradient mesh.
 * Inspired by high-end editorial sites and modern landing pages.
 * Uses Canvas API for smooth, non-distracting animation.
 */

class FluidBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.orbs = [];
        this.animFrame = null;

        // Warm, muted woodish palette — low-saturation, high warmth
        this.palette = [
            { r: 212, g: 190, b: 165 }, // warm oak
            { r: 232, g: 218, b: 198 }, // linen
            { r: 196, g: 164, b: 132 }, // walnut
            { r: 245, g: 235, b: 220 }, // alabaster warm
            { r: 220, g: 200, b: 178 }, // soft cedar
        ];

        this.resize();
        this.initOrbs();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
    }

    initOrbs() {
        this.orbs = [];
        const count = 5;
        for (let i = 0; i < count; i++) {
            const c = this.palette[i % this.palette.length];
            this.orbs.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                r: 350 + Math.random() * 300,
                speedX: (Math.random() - 0.5) * 0.18,
                speedY: (Math.random() - 0.5) * 0.18,
                color: c,
                phase: Math.random() * Math.PI * 2,
            });
        }
    }

    drawOrb(orb) {
        const t = this.time * 0.0004;
        const px = orb.x + Math.sin(t + orb.phase) * 80;
        const py = orb.y + Math.cos(t * 0.7 + orb.phase) * 60;

        const gradient = this.ctx.createRadialGradient(px, py, 0, px, py, orb.r);
        gradient.addColorStop(0, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},0.38)`);
        gradient.addColorStop(0.5, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},0.12)`);
        gradient.addColorStop(1, `rgba(${orb.color.r},${orb.color.g},${orb.color.b},0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    animate() {
        this.time++;

        // clear with warm base
        this.ctx.fillStyle = '#F7F5F0';
        this.ctx.fillRect(0, 0, this.w, this.h);

        // draw orbs
        this.orbs.forEach(orb => {
            orb.x += orb.speedX;
            orb.y += orb.speedY;
            // soft bounce
            if (orb.x < -200) orb.x = this.w + 200;
            if (orb.x > this.w + 200) orb.x = -200;
            if (orb.y < -200) orb.y = this.h + 200;
            if (orb.y > this.h + 200) orb.y = -200;

            this.drawOrb(orb);
        });

        this.animFrame = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
    }
}

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new FluidBackground('fluid-bg-canvas');
});
