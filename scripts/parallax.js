// Parallax and advanced scroll effects
class ParallaxController {
    constructor() {
        this.isEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.scrollY = 0;
        this.elements = new Map();
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        this.setupParallaxElements();
        this.setupScrollListener();
        this.setupScrollProgress();
        this.setupSectionAnimations();
        this.setupMouseParallax();
        this.requestAnimationFrame();
    }
    
    setupParallaxElements() {
        // Background parallax layers
        this.createParallaxLayers();
        
        // Section elements with different speeds
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            const speed = (index % 3) * 0.1 + 0.1; // Vary speeds
            this.elements.set(section, {
                element: section,
                speed: speed,
                type: 'section'
            });
        });
        
        // Individual parallax elements
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const direction = element.getAttribute('data-direction') || 'up';
            
            this.elements.set(element, {
                element: element,
                speed: speed,
                direction: direction,
                type: 'custom'
            });
        });
    }
    
    createParallaxLayers() {
        const backgroundEffects = document.querySelector('.background-effects');
        
        // Create multiple parallax layers
        for (let i = 0; i < 3; i++) {
            const layer = document.createElement('div');
            layer.classList.add('parallax-layer', `layer-${i}`);
            layer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 120%;
                z-index: ${-10 - i};
                opacity: ${0.1 - i * 0.02};
                background: ${this.getLayerBackground(i)};
                will-change: transform;
            `;
            
            backgroundEffects.appendChild(layer);
            
            this.elements.set(layer, {
                element: layer,
                speed: (i + 1) * 0.15,
                type: 'background'
            });
        }
    }
    
    getLayerBackground(index) {
        const patterns = [
            'radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 60%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, rgba(57, 255, 20, 0.05) 0%, transparent 50%)'
        ];
        
        return patterns[index];
    }
    
    setupScrollListener() {
        let ticking = false;
        
        const updateScroll = () => {
            this.scrollY = window.pageYOffset;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }, { passive: true });
    }
    
    setupScrollProgress() {
        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.classList.add('scroll-progress');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #00d4ff, #8a2be2);
            transform: scaleX(0);
            transform-origin: left;
            z-index: 10000;
            transition: transform 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        this.elements.set(progressBar, {
            element: progressBar,
            type: 'progress'
        });
    }
    
    setupSectionAnimations() {
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                const rect = section.getBoundingClientRect();
                const isVisible = entry.isIntersecting;
                
                if (isVisible) {
                    this.animateSection(section, rect);
                }
            });
        }, {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '-50px 0px'
        });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    animateSection(section, rect) {
        const elements = section.querySelectorAll('.glass-card, .project-card, .stat-card');
        
        elements.forEach((element, index) => {
            if (!element.classList.contains('parallax-animated')) {
                setTimeout(() => {
                    element.style.transform = 'translateY(0) scale(1)';
                    element.style.opacity = '1';
                    element.classList.add('parallax-animated');
                }, index * 100);
            }
        });
    }
    
    setupMouseParallax() {
        if (window.innerWidth < 768) return;
        
        const parallaxElements = document.querySelectorAll('.hero-visual, .project-image');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;
            
            parallaxElements.forEach((element, index) => {
                const intensity = (index + 1) * 0.02;
                const x = mouseX * intensity * 100;
                const y = mouseY * intensity * 100;
                
                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    requestAnimationFrame() {
        const animate = () => {
            this.updateParallaxElements();
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    updateParallaxElements() {
        this.elements.forEach((data, key) => {
            const { element, speed, direction, type } = data;
            
            switch (type) {
                case 'background':
                    this.updateBackgroundLayer(element, speed);
                    break;
                    
                case 'section':
                    this.updateSectionParallax(element, speed);
                    break;
                    
                case 'custom':
                    this.updateCustomParallax(element, speed, direction);
                    break;
                    
                case 'progress':
                    this.updateScrollProgress(element);
                    break;
            }
        });
    }
    
    updateBackgroundLayer(element, speed) {
        const yPos = -(this.scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    }
    
    updateSectionParallax(element, speed) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + this.scrollY;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        const scrolled = this.scrollY - elementTop + windowHeight;
        const rate = scrolled * speed;
        
        if (rect.bottom >= 0 && rect.top <= windowHeight) {
            const opacity = Math.max(0, Math.min(1, 1 - (Math.abs(rect.top - windowHeight / 2) / windowHeight)));
            element.style.opacity = opacity * 0.1 + 0.9;
        }
    }
    
    updateCustomParallax(element, speed, direction) {
        const rect = element.getBoundingClientRect();
        
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
            let transform = '';
            const distance = this.scrollY * speed;
            
            switch (direction) {
                case 'up':
                    transform = `translateY(${-distance}px)`;
                    break;
                case 'down':
                    transform = `translateY(${distance}px)`;
                    break;
                case 'left':
                    transform = `translateX(${-distance}px)`;
                    break;
                case 'right':
                    transform = `translateX(${distance}px)`;
                    break;
                case 'scale':
                    const scale = 1 + (distance / 1000);
                    transform = `scale(${Math.max(0.5, Math.min(1.5, scale))})`;
                    break;
                case 'rotate':
                    transform = `rotate(${distance * 0.1}deg)`;
                    break;
            }
            
            element.style.transform = transform;
        }
    }
    
    updateScrollProgress(element) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = this.scrollY / scrollHeight;
        
        element.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
    }
    
    // Advanced effects
    setupAdvancedEffects() {
        this.setupDepthOfField();
        this.setupColorShift();
        this.setupWaveEffect();
    }
    
    setupDepthOfField() {
        const layers = document.querySelectorAll('.parallax-layer');
        
        layers.forEach((layer, index) => {
            const depth = index + 1;
            const blur = Math.max(0, (this.scrollY / 1000) * depth);
            
            layer.style.filter = `blur(${blur}px)`;
        });
    }
    
    setupColorShift() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, 1 - (rect.top / window.innerHeight)));
            
            const hueShift = progress * 30;
            section.style.filter = `hue-rotate(${hueShift}deg)`;
        });
    }
    
    setupWaveEffect() {
        const waveElements = document.querySelectorAll('[data-wave]');
        
        waveElements.forEach(element => {
            const amplitude = parseFloat(element.getAttribute('data-wave-amplitude')) || 10;
            const frequency = parseFloat(element.getAttribute('data-wave-frequency')) || 0.01;
            
            const wave = Math.sin((this.scrollY + element.offsetTop) * frequency) * amplitude;
            element.style.transform = `translateY(${wave}px)`;
        });
    }
    
    // Responsive handling
    handleResize() {
        if (window.innerWidth < 768) {
            this.isEnabled = false;
            
            // Reset transforms on mobile
            this.elements.forEach((data, key) => {
                const { element } = data;
                element.style.transform = '';
                element.style.opacity = '';
                element.style.filter = '';
            });
        } else {
            this.isEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
    }
    
    // Performance optimization
    optimizePerformance() {
        // Use will-change property
        this.elements.forEach((data, key) => {
            const { element } = data;
            element.style.willChange = 'transform, opacity';
        });
        
        // Throttle updates based on device performance
        const isLowPerformance = navigator.hardwareConcurrency < 4 || 
                                navigator.deviceMemory < 4;
        
        if (isLowPerformance) {
            // Reduce update frequency for low-performance devices
            let lastUpdate = 0;
            const originalUpdate = this.updateParallaxElements.bind(this);
            
            this.updateParallaxElements = () => {
                const now = Date.now();
                if (now - lastUpdate > 32) { // ~30fps instead of 60fps
                    originalUpdate();
                    lastUpdate = now;
                }
            };
        }
    }
}

// Initialize parallax controller
let parallaxController;

document.addEventListener('DOMContentLoaded', () => {
    parallaxController = new ParallaxController();
});

// Handle resize events
window.addEventListener('resize', () => {
    if (parallaxController) {
        parallaxController.handleResize();
    }
});

// Export for global use
window.ParallaxController = ParallaxController;