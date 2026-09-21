import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

const canvas = document.getElementById('viewer');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(4, 4, 6);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// OrbitControls da gratis el zoom (rueda), rotar (arrastrar) y desplazar (clic derecho)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // movimiento con inercia, se siente menos brusco

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 7);
scene.add(ambientLight, directionalLight);

// Cubo temporal: lo sustituiremos por el modelo real del edificio
const placeholder = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial({ color: 0x4f8ef7 }),
);
scene.add(placeholder);

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  placeholder.rotation.y += 0.005;
  controls.update(); // necesario cuando enableDamping está activo
  renderer.render(scene, camera);
}

animate();
