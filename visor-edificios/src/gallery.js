import { listAllBuildings, saveBuilding } from './buildings.js'

export function initGallery(onSelectBuilding){
  const galleryScreen = document.getElementById('gallery-screen')
  const buildingList = document.getElementById('building-list')
  const uploadInput = document.getElementById('building-upload-input')
    const featuredContainer = document.getElementById('featured-building')
    document.getElementById('gallery-cv-link').href = `${import.meta.env.BASE_URL}documents/CV_Beatriz_Martin.pdf`
async function renderBuildingList(){
  const buildings = await listAllBuildings()

  const featured = buildings.find((b) => b.id === 'demo')
  const rest = buildings.filter((b) => b.id !== 'demo')

  featuredContainer.innerHTML = ''
  if (featured) featuredContainer.appendChild(createFeaturedCard(featured))

  buildingList.innerHTML = ''
  for (const building of rest) {
    buildingList.appendChild(createBuildingCard(building))
  }
}

function createBuildingCard(building){
  const card = document.createElement('div')
  card.className = 'building-card'

  card.appendChild(createThumbnail(building))

  const name = document.createElement('div')
  name.className = 'building-card-name'
  name.textContent = building.name
  card.appendChild(name)

  card.addEventListener('click', () => selectBuilding(building))
  return card
}

function createFeaturedCard(building){
  const card = document.createElement('div')
  card.className = 'building-card featured'

  card.appendChild(createThumbnail(building))

  const badge = document.createElement('span')
  badge.className = 'featured-badge'
  badge.textContent = 'Ejemplo recomendado'
  card.appendChild(badge)

  const name = document.createElement('div')
  name.className = 'building-card-name'
  name.textContent = building.name
  card.appendChild(name)

  const description = document.createElement('p')
  description.className = 'featured-description'
  description.textContent = 'Explora un caso real: zonas señaladas, comentarios, imágenes 360º y documentación adjunta.'
  card.appendChild(description)

  const cta = document.createElement('span')
  cta.className = 'featured-cta'
  cta.textContent = 'Ver ejemplo →'
  card.appendChild(cta)

  card.addEventListener('click', () => selectBuilding(building))
  return card
}

function selectBuilding(building){
  galleryScreen.classList.add('hidden')
  onSelectBuilding(building)
}

  uploadInput.addEventListener('change', async () => {
    const file = uploadInput.files[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.glb')) {
        alert('De momento solo se admiten modelos en formato .glb')
        uploadInput.value = ''
        return
    }

    const name = file.name.replace(/\.glb$/i, '')

    await saveBuilding({
        id: crypto.randomUUID(),
        name,
        blob: file
    })

    uploadInput.value = ''
    renderBuildingList()
    })

  renderBuildingList()
}

function createThumbnail(building){
  if (building.thumbnail) {
    const img = document.createElement('img')
    img.src = building.thumbnail
    img.className = 'building-thumbnail'
    img.alt = building.name
    return img
  }

  const placeholder = document.createElement('div')
  placeholder.className = 'building-thumbnail building-thumbnail-placeholder'
  placeholder.textContent = building.name.charAt(0).toUpperCase()
  return placeholder
}