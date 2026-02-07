// Main JavaScript - Animations, Effects, and Interactions

// ==================== Loading Screen ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500); // Reduced to 1.5 seconds
});

// ==================== Cursor Glow Effect ====================
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ==================== Typed.js Effect ====================
if (document.getElementById('typed-text')) {
    new Typed('#typed-text', {
        strings: [
            'AI-Powered Automation',
            'Intelligent Chatbots',
            'Custom Web Solutions',
            'Data-Driven Insights',
            'Business Transformation'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// ==================== Statistics Counter Animation ====================
const stats = document.querySelectorAll('.stat-number');
let animated = false;

function animateStats() {
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        updateCounter();
    });
}

// Trigger stats animation on scroll
const statsSection = document.getElementById('stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
            animateStats();
            animated = true;
        }
    });
});

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ==================== Service Card 3D Tilt Effect ====================
const serviceCards = document.querySelectorAll('[data-tilt]');

serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        card.style.boxShadow = `0 20px 40px rgba(212, 175, 55, 0.4)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.boxShadow = '';
    });
});

// ==================== GSAP ScrollTrigger Animations ====================
if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);

    // Animate service cards on scroll
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '#services',
            start: 'top 80%'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });

    // About cards are now visible by default (animation removed for better UX)
    // The breathing-anim class in CSS handles subtle animation

    // Parallax effect for  sections
    gsap.to('#hero .hero-content', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 200,
        opacity: 0
    });
}

// ==================== Smooth Scroll for Navigation ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Random Geometric Shape Spawner ====================
function spawnRandomShape() {
    const shape = document.createElement('div');
    const size = Math.random() * 50 + 20;
    const rotation = Math.random() * 360;
    const left = Math.random() * 100;

    shape.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: transparent;
        border: 2px solid rgba(212, 175, 55, 0.3);
        left: ${left}%;
        top: -100px;
        transform: rotate(${rotation}deg);
        pointer-events: none;
        z-index: 1;
        animation: float-down 10s linear forwards;
    `;

    document.body.appendChild(shape);

    setTimeout(() => {
        shape.remove();
    }, 10000);
}

// Spawn shapes periodically
setInterval(spawnRandomShape, 3000);

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float-down {
        to {
            top: 110%;
            transform: rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Breathing Animation for About Cards ====================
// Already handled in CSS with .breathing-anim class

// ==================== Form Input Focus Effects ====================
const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
        this.style.transform = 'scale(1)';
    });
});

// ==================== Console Easter Egg ====================
console.log('%c🚀 Voltair Tech', 'color: #D4AF37; font-size: 24px; font-weight: bold;');
console.log('%cPioneering AI Automation in Mumbai', 'color: #FFD700; font-size: 14px;');
console.log('%cInterested in our services? Contact us at: info@voltairtech.com', 'color: white; font-size: 12px;');
