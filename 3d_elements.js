import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 15; // Ensure the camera is positioned to see the cube

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFD700, 10);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

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

// Create the Floating Rotating Glass Cube
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2); // Make cube slightly larger for better visibility
const cubeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x87CEEB, // Light sky blue tint for the glass
    transparent: true, // Allow transparency
    opacity: 0.7, // Semi-transparent for better visibility
    roughness: 0.2, // Smooth surface (close to zero for glass-like effect)
    metalness: 0.8, // Reflectivity (high for glass)
    reflectivity: 0.9, // Reflects light like glass
    clearcoat: 1.0, // Adds an extra shiny layer
    clearcoatRoughness: 0.1, // Slightly rough for realism
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, 0); // Center the cube in the scene
scene.add(cube);

let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Add Dragging Behavior for the Cube
window.addEventListener('mousedown', (event) => {
    // Raycasting to detect if the cube is clicked
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        isDragging = true;
        dragOffset.x = intersects[0].point.x - cube.position.x;
        dragOffset.y = intersects[0].point.y - cube.position.y;
    }
});

window.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Plane for dragging
        const dragIntersect = new THREE.Vector3();

        raycaster.ray.intersectPlane(dragPlane, dragIntersect);
        cube.position.set(dragIntersect.x - dragOffset.x, dragIntersect.y - dragOffset.y, cube.position.z);
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

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
