import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- Escena y cámara ---
const container = document.getElementById('renderer-container');
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x3c4854);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

// --- Renderizador ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- Luces ---
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

const pointLight = new THREE.PointLight(0xffffff, 10, 20);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

// --- Variables globales ---
let modelo;
let rotar = false;
let modeloActual = 'vista3d';
const loader = new GLTFLoader();

// --- Función para cargar modelos ---
function cargarModelo(ruta) {
  // Mostrar mensaje de carga
  console.log('Cargando modelo:', ruta);
  
  // Eliminar modelo anterior
  if (modelo) {
    scene.remove(modelo);
    modelo.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
    modelo = null;
  }

  loader.load(ruta, (gltf) => {
    console.log('Modelo cargado exitosamente:', ruta);
    modelo = gltf.scene;
    scene.add(modelo);
  }, 
  // Progreso de carga
  (progress) => {
    const percent = (progress.loaded / progress.total * 100).toFixed(2);
    console.log(`Cargando: ${percent}%`);
  },
  // Error
  (error) => {
    console.error('Error al cargar el modelo:', error);
    alert(`Error al cargar el modelo: ${ruta}. Verifica la consola para más detalles.`);
  });
}

// --- Función para cambiar de modelo según selección ---
function cambiarModelo(tipo) {
  modeloActual = tipo;
  rotar = false;

  // Usar rutas desde la carpeta public/
  switch (tipo) {
    case 'vista3d':
      cargarModelo('./terreno.glb');  // o '/terreno.glb'
      rotar = true;
      camera.position.set(0, 2, 3);
      camera.lookAt(0, 0, 0);
      break;

    case 'terreno':
      cargarModelo('./dark.glb');
      camera.position.set(0, 7, 0);
      camera.lookAt(0, 0, 0);
      break;

    case 'agua':
      cargarModelo('./agua.glb');
      camera.position.set(0, 7, 0);
      camera.lookAt(0, 0, 0);
      break;

    case 'vegetacion':
      cargarModelo('./vegetacion.glb');
      camera.position.set(0, 7, 0);
      camera.lookAt(0, 0, 0);
      break;

    case 'caminos':
      cargarModelo('./caminos.glb');
      camera.position.set(0, 7, 0);
      camera.lookAt(0, 0, 0);
      break;

    // Eliminé el caso duplicado de 'caminos'
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