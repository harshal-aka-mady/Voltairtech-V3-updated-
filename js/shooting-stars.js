// Enhanced Shooting Stars Generator - Creates dynamic 3D falling star effect

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {

    // Check if shooting-stars container exists
    const shootingStarsContainer = document.querySelector('.shooting-stars');
    if (!shootingStarsContainer) {
        console.warn('Shooting stars container not found');
        return;
    }

    function createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star-dynamic';

        // Random horizontal position
        const startX = Math.random() * 100;

        // Random size for 3D depth effect (smaller = farther away)
        const size = Math.random() * 3 + 1; // 1-4px

        // Random duration for varied speeds
        const duration = Math.random() * 2 + 2; // 2-4 seconds

        // Random delay
        const delay = Math.random() * 1;

        star.style.cssText = `
            position: fixed;
            left: ${startX}%;
            top: -10px;
            width: ${size}px;
            height: ${size * 15}px;
            background: linear-gradient(to bottom, transparent, rgba(255, 215, 0, ${0.6 + size * 0.1}), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            transform: rotate(45deg);
            box-shadow: 0 0 ${size * 3}px rgba(255, 215, 0, 0.8);
            animation: fallingStar ${duration}s linear ${delay}s forwards;
        `;

        shootingStarsContainer.appendChild(star);

        // Remove star after animation
        setTimeout(() => {
            if (star && star.parentNode) {
                star.remove();
            }
        }, (duration + delay) * 1000);
    }

    // Add CSS animation for falling stars
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fallingStar {
            0% {
                transform: translateY(0) translateX(0) rotate(45deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) translateX(${Math.random() * 100}px) rotate(45deg);
                opacity: 0;
            }
        }
        
        .shooting-star-dynamic {
            filter: blur(0.5px);
        }
    `;
    document.head.appendChild(style);

    // Create shooting stars periodically
    setInterval(() => {
        createShootingStar();
    }, 800); // Create a new star every 800ms

    // Create initial batch for immediate effect
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createShootingStar(), i * 200);
    }
});
