// Enhanced Three.js 3D Scene with Moving Yellow Stars
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 50;

// --- 1. REMOVED GEOMETRIC SHAPES SECTION HERE --- 

// --- 2. ADDED SOFT BLUR TEXTURE GENERATOR ---
// This creates a "glow" texture so stars look like soft dots, not squares
function getSoftStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Draw a radial gradient (white center -> transparent edge)
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');     // Center bright
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)'); // Mid blur
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Edge transparent

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

const starTexture = getSoftStarTexture();

// ==================== ENHANCED STAR SYSTEM ====================

const createStarField = (count, size, color, speedMultiplier) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Spread stars out more to fill the empty space left by shapes
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 200;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;

        velocities.push({
            x: (Math.random() - 0.5) * 0.05 * speedMultiplier,
            y: (Math.random() - 0.5) * 0.05 * speedMultiplier,
            z: (Math.random() - 0.5) * 0.02 * speedMultiplier
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: size,
        color: color,
        map: starTexture,      // APPLY THE BLUR TEXTURE
        transparent: true,
        opacity: 0.9,
        alphaTest: 0.05,       // Helps with transparency rendering
        blending: THREE.AdditiveBlending,
        depthWrite: false      // Prevents stars from blocking each other
    });

    const stars = new THREE.Points(geometry, material);
    stars.userData.velocities = velocities;
    return stars;
};

// Create layers (Slightly larger sizes to make the blur visible)
const starLayer1 = createStarField(300, 1.5, 0xFFD700, 1);    // Large gold stars
const starLayer2 = createStarField(400, 1.0, 0xFFE55C, 1.5);  // Medium yellow stars
const starLayer3 = createStarField(500, 0.8, 0xFFF8DC, 2);    // Small cream stars

scene.add(starLayer1);
scene.add(starLayer2);
scene.add(starLayer3);

// Add some special twinkling stars
const twinkleStars = createStarField(50, 2.5, 0xFFD700, 0.5);
scene.add(twinkleStars);

// Mouse parallax effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // --- 3. REMOVED SHAPE ROTATION LOOP HERE ---

    // Animate star layers
    [starLayer1, starLayer2, starLayer3].forEach(layer => {
        const positions = layer.geometry.attributes.position.array;
        const velocities = layer.userData.velocities;

        for (let i = 0; i < velocities.length; i++) {
            const i3 = i * 3;

            // Move stars
            positions[i3] += velocities[i].x;
            positions[i3 + 1] += velocities[i].y;
            positions[i3 + 2] += velocities[i].z;

            // Wrap around if stars go too far
            if (positions[i3] > 100) positions[i3] = -100;
            if (positions[i3] < -100) positions[i3] = 100;
            if (positions[i3 + 1] > 100) positions[i3 + 1] = -100;
            if (positions[i3 + 1] < -100) positions[i3 + 1] = 100;
            if (positions[i3 + 2] > 50) positions[i3 + 2] = -50;
            if (positions[i3 + 2] < -50) positions[i3 + 2] = 50;
        }

        layer.geometry.attributes.position.needsUpdate = true;
    });

    // Twinkling effect
    const time = Date.now() * 0.001;
    twinkleStars.material.opacity = 0.5 + Math.sin(time * 2) * 0.5;

    // Rotate entire star field slowly
    starLayer1.rotation.y += 0.0002;
    starLayer2.rotation.y -= 0.0003;
    starLayer3.rotation.y += 0.0001;

    // Mouse parallax
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
