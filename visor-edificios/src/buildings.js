const DB_NAME = 'visor-edificios-buildings'
const DB_VERSION = 1
const STORE_NAME = 'buildings'

function openDatabase(){
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveBuilding(record){
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(record)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function loadUploadedBuildings(){
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteBuilding(id){
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export const BUILT_IN_BUILDINGS = [
  {
    id: 'demo',
    name: 'Edificio de ejemplo',
    isDemo: true,
    modelUrl: `${import.meta.env.BASE_URL}models/low_poly_building.glb`
  },
  {
    id: 'demo_2',
    name: 'Edificio de Chicago',
    isDemo: true,
    modelUrl: `${import.meta.env.BASE_URL}models/chicago_buildings.glb`
  }
]

export async function listAllBuildings(){
  const uploaded = await loadUploadedBuildings()
  const uploadedWithUrls = uploaded.map((b) => ({
    id: b.id,
    name: b.name,
    isDemo: false,
    modelUrl: URL.createObjectURL(b.blob)
  }))
  return [...BUILT_IN_BUILDINGS, ...uploadedWithUrls]
}