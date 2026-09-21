import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

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

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.minDistance = 1.5
controls.maxDistance = 20
controls.maxPolarAngle = Math.PI / 2 //fórmula para no pasar debajo del suelo
controls.target.set(0,0,0)

scene.add(new THREE.GridHelper(20,20, 0x555555, 0x333333)) //para ayudar a la localización al mover el ratón

const loader = new GLTFLoader()

loader.load(
  '/models/low_poly_building.glb',
  (gltf) => {
    const building = gltf.scene
    scene.add(building)
    frameModel(building)
  },
  (progress) => {
    if (progress.total){
      console.log(`Cargando: ${Math.round((progress.loaded / progress.total) * 100)}%`)
    }
  },
  (error) => {
    console.error('Error cargando el modelo:', error)
  }
)

function frameModel(object){
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  object.position.x -= center.x
  object.position.y -= box.min.y
  object.position.z -= center.z

  const maxDim = Math.max(size.x, size.y, size.z)
  const distance = maxDim * 1.8
  camera.position.set(distance, distance * 0.7, distance)
  camera.near = maxDim / 100
  camera.far = maxDim * 20
  camera.updateProjectionMatrix()

  controls.target.set(0, size.y / 2, 0)
  controls.minDistance = maxDim * 0.3
  controls.maxDistance = maxDim * 5
  controls.update()
}

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
  controls.update()
  renderer.render(scene, camera)
})