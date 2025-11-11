import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- Escena y cámara ---
const container = document.getElementById('renderer-container');
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x3c4854); // El color que desees

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

// --- Renderizador ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- Luces ---
// Ambiental
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// Foco

const pointLight = new THREE.PointLight(0xffffff, 10, 20); // color, intensidad, distancia
pointLight.position.set(0, 3, 0); // arriba del modelo
scene.add(pointLight);

// --- Variables globales ---
let modelo;
let rotar = false;
let modeloActual = 'vista3d';
const loader = new GLTFLoader();

// --- Función para cargar modelos ---
function cargarModelo(ruta) {
  // Eliminar modelo anterior
  if (modelo) {
    scene.remove(modelo);
    modelo.traverse((child) => {
      if (child.isMesh) child.geometry.dispose();
    });
    modelo = null;
  }

  loader.load(ruta, (gltf) => {
    modelo = gltf.scene;
    scene.add(modelo);
  }, undefined, (error) => {
    console.error('Error al cargar el modelo:', error);
  });
}

// --- Función para cambiar de modelo según selección ---
function cambiarModelo(tipo) {
  modeloActual = tipo;
  rotar = false;

  switch (tipo) {
    case 'vista3d':
      cargarModelo('terreno.glb');
      rotar = true;
      camera.position.set(0, 2, 3);
      camera.lookAt(0, 0, 0);
      break;

    case 'terreno':
      cargarModelo('dark.glb');
      camera.position.set(0, 7, 0);
      camera.lookAt(0, 0, 0);
      break;

    case 'agua':
      cargarModelo('agua.glb');
      camera.position.set(0, 7, 0);
      camera.lookAt(0, 0, 0);
      break;

    case 'vegetacion':
      cargarModelo('vegetacion.glb');
      camera.position.set(0, 7, 0);
      camera.lookAt(0, 0, 0);
      break;

    case 'caminos':
      cargarModelo('caminos.glb');
      camera.position.set(0, 7, 0);
      camera.lookAt(0, 0, 0);
      break;

        case 'caminos':
      cargarModelo('caminos.glb');
      camera.position.set(0, 7, 0);
      camera.lookAt(0, 0, 0);
      break;
  }
}

// --- Iniciar con modelo principal ---
cambiarModelo('vista3d');

// --- Animación ---
function animate() {
  requestAnimationFrame(animate);
  if (modelo && rotar) modelo.rotation.y += 0.004;
  renderer.render(scene, camera);
}
animate();

// --- Ajustar en redimensionar ---
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// --- Selector de modelo ---
document.getElementById('modeloSelect').addEventListener('change', (e) => {
  cambiarModelo(e.target.value);
});
