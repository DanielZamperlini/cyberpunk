// Advanced animations and effects
class AnimationController {
  constructor() {
    this.animations = new Map();
    this.isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.init();
  }

  init() {
    this.setupGlitchEffect();
    this.setupTypingEffect();
    this.setupHoverEffects();
    this.setupMouseFollower();
    this.setupScrollTriggers();
  }

  // Glitch text effect
  setupGlitchEffect() {
    if (this.isReducedMotion) return;

    const glitchElements = document.querySelectorAll('.glitch-text');

    glitchElements.forEach((element) => {
      const originalText = element.textContent;
      element.setAttribute('data-text', originalText);

      this.createGlitchAnimation(element, originalText);
    });
  }

  createGlitchAnimation(element, text) {
    const glitchChars = '!@#$%^&*+ []{}|;: ,.<>?~`';
    let isGlitching = false;

    const glitch = () => {
      if (isGlitching || this.isReducedMotion) return;

      isGlitching = true;
      const iterations = 15;
      let currentIteration = 0;

      const glitchInterval = setInterval(() => {
        let glitchedText = ' ';

        for (let i = 0; i < text.length; i++) {
          if (Math.random() < 0.3) {
            glitchedText +=
              glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            glitchedText += text[i];
          }
        }

        element.textContent = glitchedText;
        currentIteration++;

        if (currentIteration >= iterations) {
          clearInterval(glitchInterval);
          element.textContent = text;
          isGlitching = false;
        }
      }, 80);
    };

    // Trigger glitch every 5-10 seconds
    const triggerGlitch = () => {
      setTimeout(() => {
        glitch();
        triggerGlitch();
      }, Math.random() * 5000 + 5000);
    };

    triggerGlitch();
  }

  // Typing effect
  setupTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');

    typingElements.forEach((element) => {
      const text = element.getAttribute('data-typing');
      const speed = parseInt(element.getAttribute('data-speed')) || 100;

      this.typeText(element, text, speed);
    });
  }

  typeText(element, text, speed) {
    if (this.isReducedMotion) {
      element.textContent = text;
      return;
    }

    element.textContent = '';
    let i = 0;

    const typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);
  }

  // Advanced hover effects
  setupHoverEffects() {
    this.setupCardTiltEffect();
    this.setupMagneticButtons();
    this.setupRippleEffect();
  }

  setupCardTiltEffect() {
    if (this.isReducedMotion) return;

    const tiltCards = document.querySelectorAll('.project-card, .stat-card');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform =
          'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  setupMagneticButtons() {
    if (this.isReducedMotion) return;

    const magneticElements = document.querySelectorAll('.cyber-btn, .nav-link');

    magneticElements.forEach((element) => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        element.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  setupRippleEffect() {
    const rippleElements = document.querySelectorAll('.cyber-btn');

    rippleElements.forEach((element) => {
      element.addEventListener('click', (e) => {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    pointer-events: none;
                `;

        element.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
          ripple.remove();
        });
      });
    });

    // Add ripple keyframe
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
      document.head.appendChild(style);
    }
  }

  // Mouse follower effect
  setupMouseFollower() {
    if (this.isReducedMotion || window.innerWidth < 768) return;

    const follower = document.createElement('div');
    follower.classList.add('mouse-follower');
    follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            transform: translate(-50%, -50%);
        `;

    document.body.appendChild(follower);

    let mouseX = 0,
      mouseY = 0;
    let followerX = 0,
      followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;

      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';

      requestAnimationFrame(animateFollower);
    };

    animateFollower();

    // Change follower on hover
    const hoverElements = document.querySelectorAll('a, button, .nav-link');
    hoverElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        follower.style.transform = 'translate(-50%, -50%) scale(2)';
        follower.style.background =
          'radial-gradient(circle, rgba(138, 43, 226, 0.6) 0%, transparent 70%)';
      });

      element.addEventListener('mouseleave', () => {
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.background =
          'radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, transparent 70%)';
      });
    });
  }

  // Scroll-triggered animations
  setupScrollTriggers() {
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          scrollObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollElements.forEach((element) => {
      scrollObserver.observe(element);
    });
  }

  animateElement(element) {
    if (this.isReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      return;
    }

    const animationType = element.getAttribute('data-animation') || 'slideUp';

    switch (animationType) {
      case 'slideLeft':
        element.style.animation = 'slideInLeft 0.8s ease-out forwards';
        break;
      case 'slideRight':
        element.style.animation = 'slideInRight 0.8s ease-out forwards';
        break;
      case 'scale':
        element.style.animation = 'fadeInScale 0.8s ease-out forwards';
        break;
      default:
        element.style.animation = 'slideInUp 0.8s ease-out forwards';
    }

    element.classList.add('animate');
  }

  // Parallax scrolling effect
  setupParallaxScrolling() {
    if (this.isReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach((element) => {
        const rate = scrolled * (element.getAttribute('data-parallax') || 0.5);
        element.style.transform = `translateY(${rate}px)`;
      });
    });
  }

  // Text reveal animation
  setupTextReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    revealElements.forEach((element) => {
      const text = element.textContent;
      const words = text.split(' ');

      element.innerHTML = words
        .map((word) => `<span class="word">${word}</span>`)
        .join(' ');

      const wordElements = element.querySelectorAll('.word');

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateWords(wordElements);
            revealObserver.unobserve(entry.target);
          }
        });
      });

      revealObserver.observe(element);
    });
  }

  animateWords(words) {
    words.forEach((word, index) => {
      setTimeout(() => {
        word.style.animation = 'slideInUp 0.6s ease-out forwards';
      }, index * 100);
    });
  }
}

// Initialize animation controller
const animationController = new AnimationController();

// Export for global use
window.AnimationController = AnimationController;
