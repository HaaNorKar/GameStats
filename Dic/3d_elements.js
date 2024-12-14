import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 15;

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
scene.add(ambientLight);

// Create Raindrops
const rainDrops = [];
const rainGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8); // Thin cylinder for raindrops
const rainMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color for rain

for (let i = 0; i < 500; i++) {
    const rainDrop = new THREE.Mesh(rainGeometry, rainMaterial);
    rainDrop.position.set(
        (Math.random() - 0.5) * 50, // Random X position
        Math.random() * 20,         // Random Y position (higher start)
        (Math.random() - 0.5) * 50  // Random Z position
    );
    rainDrops.push(rainDrop);
    scene.add(rainDrop);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Move each raindrop downward
    rainDrops.forEach(drop => {
        drop.position.y -= 0.1; // Falling speed
        if (drop.position.y < -10) {
            drop.position.y = 20; // Reset to top
            drop.position.x = (Math.random() - 0.5) * 50; // Randomize X position
            drop.position.z = (Math.random() - 0.5) * 50; // Randomize Z position
        }
    });

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
