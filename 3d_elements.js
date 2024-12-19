// Importer Three.js biblioteket fra en CDN
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Initialiser Scene, Kamera og Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threeCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); // Sett renderer-størrelsen lik vinduet
camera.position.z = 15; // Plasser kameraet slik at det kan se kuben

// Legg til lys i scenen
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Genererer lys slik at nettsiden blir mer opplyst 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFD700, 10); // Retningslys med gyllen farge
// Plassering av lyset på nettsiden 
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Opprett regndråper
const rainDrops = []; // Array for lagring av rægndråpa
const rainGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8); // Formen til regndråpene, (syliderer)
const rainMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // velg farge for regn dråpene (Hvit)

for (let i = 0; i < 500; i++) { // lager regndråper (500)
    const rainDrop = new THREE.Mesh(rainGeometry, rainMaterial);
    // Sett regndråper til tilfeldige posisjoner 
    rainDrop.position.set(
        (Math.random() - 0.5) * 50, // Tilfeldig X-posisjon for horisontalt 
        Math.random() * 20,         // Tilfeldig Y-posisjon for vertikalt
        (Math.random() - 0.5) * 50  // Tilfeldig Z-posisjon for dybde / 3d etter å ha følgt etter x- og y- aksen
    );
    rainDrops.push(rainDrop); // Legg regndråper til arrayet
    scene.add(rainDrop); // Legg regndråper til nettsiden
}

// Opprett en flyvende og roterende glasskube for å være fancy
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2); // Formen til kuben / utseende til kuben
const cubeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x87CEEB, // Velg farge for kuben (Lys lys blå)
    transparent: true, // Velg den til å være gjennomsiktig
    opacity: 0.7, // Velg hvor gjennomsiktig 
    roughness: 0.2, // Velg hvor smooth/ glatt overflaten skal være
    metalness: 0.8, // Hvor mye kuben skal reflektere
    reflectivity: 0.9, // Reflekterer lys som glass
    clearcoat: 1.0, // Ekstra lag for glans (slik at den skinner bedre)
    clearcoatRoughness: 0.1, // Bestemmer hvor matt eller glatt ekstra laget skal være
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, 0); // Plassering av kuben (midten av nettsiden)
scene.add(cube);

let isDragging = false; // Variabel for å sjekke om kuben blir dratt
let dragOffset = { x: 0, y: 0 }; // For å holde styr på avstanden mellom musepeker og kubeposisjon

// Legg til dra-funksjonalitet for kuben
window.addEventListener('mousedown', (event) => {
    // Bruk raycasting for å sjekke om kuben blir klikket
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, // Normaliser musekoordinater (X)
        -(event.clientY / window.innerHeight) * 2 + 1 // Normaliser musekoordinater (Y)
    );

    raycaster.setFromCamera(mouse, camera); // Sett opp raycaster fra kameraet
    const intersects = raycaster.intersectObject(cube); // Sjekk om raycaster treffer kuben

    if (intersects.length > 0) { // Hvis kuben blir truffet
        isDragging = true; // Start dra-operasjonen
        dragOffset.x = intersects[0].point.x - cube.position.x; // Beregn forskyvning i X
        dragOffset.y = intersects[0].point.y - cube.position.y; // Beregn forskyvning i Y
    }
});

window.addEventListener('mousemove', (event) => {
    if (isDragging) { // Hvis kuben dras
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1, // Oppdater musekoordinater (X)
            -(event.clientY / window.innerHeight) * 2 + 1 // Oppdater musekoordinater (Y)
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera); // Oppdater raycaster

        const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Plan for dra-operasjonen
        const dragIntersect = new THREE.Vector3();

        raycaster.ray.intersectPlane(dragPlane, dragIntersect); // Finn skjæringspunkt på planet
        cube.position.set(dragIntersect.x - dragOffset.x, dragIntersect.y - dragOffset.y, cube.position.z); // Oppdater kubens posisjon
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false; // Stopp dra-operasjonen når museknappen slippes
});

// Animasjonsløkke
function animate() {
    requestAnimationFrame(animate); // Be om neste animasjonsramme

    // Roter kuben kontinuerlig
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Flytt hver regndråpe nedover
    rainDrops.forEach(drop => {
        drop.position.y -= 0.1; // Hastighet på nedoverbevegelsen
        if (drop.position.y < -10) { // Hvis regndråpen faller under visningsområdet
            drop.position.y = 20; // Reset Y-posisjon til toppen
            drop.position.x = (Math.random() - 0.5) * 50; // Tilfeldig X-posisjon
            drop.position.z = (Math.random() - 0.5) * 50; // Tilfeldig Z-posisjon
        }
    });

    renderer.render(scene, camera); // Render scenen og kameraet
}

animate(); // Start animasjonen

// Håndter endring av vindusstørrelse
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; // Oppdater kameraets aspektforhold
    camera.updateProjectionMatrix(); // Oppdater projeksjonsmatrisen
    renderer.setSize(window.innerWidth, window.innerHeight); // Oppdater renderer-størrelse
});
