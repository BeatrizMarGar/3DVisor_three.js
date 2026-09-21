import './style.css'
import * as THREE from 'three'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1e1e24)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)

camera.position.set(3, 2, 4)
camera.lookAt(0,0,0)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({color: 0x4f9dff})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

scene.add(new THREE.AmbientLight(0xffffff, 0.5))
const sun = new THREE.DirectionalLight(0xffffff, 2)
sun.position.set(5, 5, 5)
scene.add(sun)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

renderer.setAnimationLoop(() =>{
  cube.rotation.y +=0.01;
  renderer.render(scene, camera)
})