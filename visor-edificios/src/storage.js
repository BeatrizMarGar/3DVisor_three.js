function storageKey(buildingId){
  return `visor-edificios:zones:${buildingId}`
}

export function saveZones(buildingId, zones){
  const data = zones.map((zone) => ({
    id: zone.userData.id,
    position: { x: zone.position.x, y: zone.position.y, z: zone.position.z },
    scale: { x: zone.scale.x, y: zone.scale.y, z: zone.scale.z },
    comment: zone.userData.comment
  }))
  localStorage.setItem(storageKey(buildingId), JSON.stringify(data))
}

export function loadZones(buildingId){
  const raw = localStorage.getItem(storageKey(buildingId))
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch (error) {
    console.error('No se han podido leer las zonas guardadas:', error)
    return []
  }
}

function seededKey(buildingId){
  return `visor-edificios:seeded:${buildingId}`
}

export function hasSeeded(buildingId){
  return localStorage.getItem(seededKey(buildingId)) === 'true'
}

export function markSeeded(buildingId){
  localStorage.setItem(seededKey(buildingId), 'true')
}