import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js';
function hideSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return;
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 1000);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
document.getElementById('container3D').appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(2));
const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(10, 10, 10);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
fillLight.position.set(-10, 5, 5);
scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
rimLight.position.set(-15, 10, -10);
scene.add(rimLight);

let car, mixer;
const positions = [
  { id: 'home', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
  { id: 'about', position: { x: -2, y: 0, z: 0 }, rotation: { x: 0, y: 0.3, z: 0 } },
  { id: 'features', position: { x: 4, y: -1, z: -2 }, rotation: { x: 0, y: 0, z: 0 } },
  { id: 'gallery', position: { x: 0, y: -1, z: -2 }, rotation: { x: 0, y: -0.3, z: 0 } },
  { id: 'contact', position: { x: 2, y: -2, z: -1 }, rotation: { x: 0, y: .3, z: 0 } }
];

const loader = new GLTFLoader();
loader.load(
  './models/bmw_m4_modified_widebody_knitro_builds.glb',
  (gltf) => {
    car = gltf.scene;
    scene.add(car);

    // توسيط الموديل
    const box = new THREE.Box3().setFromObject(car);
    const center = box.getCenter(new THREE.Vector3());
    car.position.sub(center);

    // Scale واضح
    const scaleFactor = 0.17;
    car.scale.setScalar(scaleFactor);

    // وضعية الموديل
    car.rotation.y = Math.PI / 1.4;

    // ضبط الكاميرا بعد Scale
    camera.position.set(0, 1, 5);
    camera.lookAt(0, 0, 0);

    // تشغيل أي animations موجودة
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(car);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }

    hideSplash();
  },
  (xhr) => console.log(Math.round((xhr.loaded / xhr.total) * 100) + '% loaded'),
  (err) => console.error('GLTF ERROR ❌', err)
);

function moveModelOnScroll() {
  if (!car) return;
  const sections = document.querySelectorAll('.section');
  let current = null;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionMiddle = rect.top + rect.height / 2;
    if (sectionMiddle <= window.innerHeight / 2) current = section.id;
  });
  const target = positions.find((p) => p.id === current);
  if (!target) return;
  gsap.to(car.position, { ...target.position, duration: 2.5, ease: 'power2.out' });
  gsap.to(car.rotation, { ...target.rotation, duration: 2.5, ease: 'power2.out' });
}
window.addEventListener('scroll', moveModelOnScroll);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
