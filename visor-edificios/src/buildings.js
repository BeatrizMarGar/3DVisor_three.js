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
    modelUrl: `${import.meta.env.BASE_URL}models/low_poly_building.glb`,
    demoZones: [
      {
        position: { x: -0.35041746673751906, y: 1.2014778964784707, z: 2.1439832535485737 },
        scale: { x: -4.226000759425636, y: 2.50147226349803, z: 2.243340529485509 },
        comment: 'Ejemplo de reforma: renovación de la zona común — nuevo suelo, iluminación y mobiliario de recepción. Para más información, consultar el CV de Beatriz Martín adjunto en este comentario.',
        files: [
          { url: `${import.meta.env.BASE_URL}panoramas/zona_comun.jpg`, name: 'zona_comun.jpg', kind: 'image360' },
          { url: `${import.meta.env.BASE_URL}documents/CV_Beatriz_Martin.pdf`, name: 'CV_Beatriz_Martin.pdf', kind: 'file' }
        ]
      },
      {
        position: { x: 1.5703562227217946, y: 4.880616403081851, z: -2.223072303564498 },
        scale: { x: 1.747846054163014, y: 2.3019363970677493, z: 1.747846054163014 },
        comment: 'Ejemplo de reforma: habitación tipo tras la renovación — baño actualizado, tarima nueva e iluminación cálida. Para más información, consultar el CV de Beatriz Martín adjunto en este comentario.',
        files: [
          { url: `${import.meta.env.BASE_URL}panoramas/habitacion.jpg`, name: 'habitacion.jpg', kind: 'image360' },
          { url: `${import.meta.env.BASE_URL}documents/CV_Beatriz_Martin.pdf`, name: 'CV_Beatriz_Martin.pdf', kind: 'file' }
        ]
      }
    ]
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