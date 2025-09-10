// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupScrollAnimations();
  setupParticleSystem();
  setupSkillBars();
  setupContactForm();
  setupMatrixRain();
  setupFloatingShapes();
  setupSmoothScrolling();
}

// Navigation functionality
function setupNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close menu when clicking nav links
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
  });
}

// Scroll animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Add scroll animation class to elements
  const animateElements = document.querySelectorAll(
    '.glass-card, .stat-card, .skill-category, .project-card, .soft-skill',
  );

  animateElements.forEach((el) => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
}

// Particle system
function setupParticleSystem() {
  const particlesContainer = document.querySelector('.particles-container');

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * 2;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = startX + 'px';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';

    particlesContainer.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, (duration + delay) * 1000);
  }

  // Create particles periodically
  setInterval(createParticle, 500);

  // Create initial batch
  for (let i = 0; i < 10; i++) {
    setTimeout(createParticle, i * 200);
  }
}

// Skill bars animation
function setupSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillLevel = entry.target.getAttribute('data-skill');
          entry.target.style.width = skillLevel + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  skillBars.forEach((bar) => {
    skillObserver.observe(bar);
  });
}

// Matrix rain effect
function setupMatrixRain() {
  const codeRain = document.querySelector('.code-rain');

  if (!codeRain) return;

  const characters =
    '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  function createMatrixColumn() {
    const column = document.createElement('div');
    column.classList.add('matrix-column');

    let text = '';
    for (let i = 0; i < 20; i++) {
      text += characters[Math.floor(Math.random() * characters.length)] + '\n';
    }

    column.textContent = text;
    column.style.left = Math.random() * 100 + '%';
    column.style.animationDuration = Math.random() * 3 + 2 + 's';
    column.style.animationDelay = Math.random() * 2 + 's';

    codeRain.appendChild(column);

    // Remove column after animation
    setTimeout(() => {
      if (column.parentNode) {
        column.parentNode.removeChild(column);
      }
    }, 5000);
  }

  // Create matrix columns periodically
  setInterval(createMatrixColumn, 300);

  // Create initial batch
  for (let i = 0; i < 8; i++) {
    setTimeout(createMatrixColumn, i * 100);
  }
}

// Floating shapes
function setupFloatingShapes() {
  const shapesContainer = document.querySelector('.floating-shapes');

  function createShape() {
    const shape = document.createElement('div');
    const shapes = ['circle', 'square', 'triangle'];
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];

    shape.classList.add('floating-shape', shapeType);

    const size = Math.random() * 30 + 10;
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + size;
    const duration = Math.random() * 15 + 10;

    shape.style.width = size + 'px';
    shape.style.height = size + 'px';
    shape.style.left = startX + 'px';
    shape.style.top = startY + 'px';

    // Random color
    const colors = ['#00d4ff', '#8a2be2', '#39ff14', '#ff6b6b'];
    shape.style.background = colors[Math.floor(Math.random() * colors.length)];
    shape.style.opacity = '0.1';

    shapesContainer.appendChild(shape);

    // Animate the shape
    shape
      .animate(
        [
          {
            transform: 'translateY(0) rotate(0deg)',
            opacity: '0.1',
          },
          {
            transform: `translateY(-${
              window.innerHeight + 200
            }px) rotate(360deg)`,
            opacity: '0',
          },
        ],
        {
          duration: duration * 1000,
          easing: 'linear',
          fill: 'forwards',
        },
      )
      .addEventListener('finish', () => {
        if (shape.parentNode) {
          shape.parentNode.removeChild(shape);
        }
      });
  }

  // Create shapes periodically
  setInterval(createShape, 2000);

  // Create initial batch
  for (let i = 0; i < 5; i++) {
    setTimeout(createShape, i * 400);
  }
}

// Smooth scrolling
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });
}

// Utility functions
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 70;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  notification.textContent = message;

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#00d4ff' : '#ff6b6b'};
        color: #000000;
        border-radius: 8px;
        z-index: 10000;
        font-family: 'Roboto Mono', monospace;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Hide notification
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Keyboard navigation
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
});

// Performance optimizations
let ticking = false;

function updateScrollPosition() {
  // Update scroll-dependent elements here
  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateScrollPosition);
    ticking = true;
  }
}

window.addEventListener('scroll', requestScrollUpdate);

// Preload critical resources
function preloadResources() {
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
    'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap',
  ];

  criticalFonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = font;
    document.head.appendChild(link);
  });
}

// Initialize preloading
preloadResources();

// Export functions for global use
window.scrollToSection = scrollToSection;
