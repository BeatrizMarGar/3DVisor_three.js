import { PositionalAudio } from "three/src/Three.Core.js"

const STORAGE_KEY = "visor-edificios:zones"

export function saveZones(zones){
    const data = zones.map((zone) => ({
        position: {x: zone.position.x, y: zone.position.y, z: zone.position.z},
        scale: {x: zone.scale.x, y: zone.scale.y, z: zone.scale.z}
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function loadZones(){
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    try {
        return JSON.parse(raw)
    } catch (error) {
        console.error('No se han podido leer las zonas guardadas:', error)
        return[]
    }
}