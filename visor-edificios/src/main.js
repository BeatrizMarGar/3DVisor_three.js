import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
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

let building = null
let modelSize = 1

const loader = new GLTFLoader()

loader.load(
  '/models/low_poly_building.glb',
  (gltf) => {
    building = gltf.scene
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
  modelSize = maxDim

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

const zoneGeometry = new THREE.BoxGeometry(1, 1, 1)
const zoneEdgesGeometry = new THREE.EdgesGeometry(zoneGeometry)
const zoneEdgesMaterial = new THREE.LineBasicMaterial({ color: 0x33aaff })

const zones = []
let selectedZone = null
let creatingZone = false

const transformControls = new TransformControls(camera, renderer.domElement)
scene.add(transformControls.getHelper())

transformControls.addEventListener('dragging-changed', (event) => {
  controls.enabled = !event.value
})

function createZone(point){
  const mesh = new THREE.Mesh(
    zoneGeometry,
    new THREE.MeshBasicMaterial({
      color: 0x33aaff,
      transparent: true,
      opacity: 0.15,
      depthWrite: false
    })
  )
  mesh.add(new THREE.LineSegments(zoneEdgesGeometry, zoneEdgesMaterial))

  const s = modelSize * 0.25
  mesh.scale.set(s, s, s)
  mesh.position.copy(point)

  scene.add(mesh)
  zones.push(mesh)
  return mesh
}

function selectZone(zone){
  if (selectedZone) selectedZone.material.opacity = 0.15
  selectedZone = zone

  if (zone) {
    zone.material.opacity = 0.4
    transformControls.attach(zone)
  } else {
    transformControls.detach()
  }
}

function deleteSelectedZone(){
  if (!selectedZone) return
  const zone = selectedZone
  selectZone(null)
  scene.remove(zone)
  zones.splice(zones.indexOf(zone), 1)
  zone.material.dispose()
}

function setCreatingZone(value){
  creatingZone = value
  renderer.domElement.style.cursor = value ? 'crosshair' : 'auto'
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase()
  if (key === 'n') setCreatingZone(true)
  if (key === 'g') transformControls.setMode('translate')
  if (key === 's') transformControls.setMode('scale')
  if (key === 'delete') deleteSelectedZone()
  if (key === 'escape') {
    setCreatingZone(false)
    selectZone(null)
  }
})

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

function onSceneClick(event){
  const rect = renderer.domElement.getBoundingClientRect()
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(pointer, camera)

  if (creatingZone) {
    if (!building) return
    const buildingHits = raycaster.intersectObject(building, true)
    if (buildingHits.length > 0) {
      selectZone(createZone(buildingHits[0].point))
      setCreatingZone(false)
    }
    return
  }

  const zoneHits = raycaster.intersectObjects(zones, false)
  selectZone(zoneHits.length > 0 ? zoneHits[0].object : null)
}

let downX = 0
let downY = 0

renderer.domElement.addEventListener('pointerdown', (event) => {
  downX = event.clientX
  downY = event.clientY
})

renderer.domElement.addEventListener('pointerup', (event) => {
  if (event.button !== 0) return
  if (transformControls.axis) return
  const moved = Math.hypot(event.clientX - downX, event.clientY - downY)
  if (moved > 5) return
  onSceneClick(event)
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

renderer.setAnimationLoop(() =>{
  controls.update()
  renderer.render(scene, camera)
})