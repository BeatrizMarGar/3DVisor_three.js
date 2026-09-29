# Visor 3D de Edificios

![Three.js](https://img.shields.io/badge/Three.js-black?style=flat&logo=three.js)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

Visor 3D interactivo para explorar modelos arquitectónicos en el navegador, señalar zonas de interés y documentarlas con comentarios, imágenes 360º y archivos adjuntos — sin backend, con persistencia 100% local en el propio navegador.

## Demo

🔗 [beatrizmargar.github.io/3DVisor_three.js](https://beatrizmargar.github.io/3DVisor_three.js/)

## Características

- Carga y visualización de modelos 3D en formato glTF binario (`.glb`) mediante **Three.js** y **WebGL**.
- Controles de cámara orbital (zoom, rotación, desplazamiento) con soporte táctil nativo en dispositivos móviles.
- Creación, selección, movimiento y escalado de "zonas" (regiones cúbicas) sobre el modelo mediante gizmos interactivos (`TransformControls`).
- Comentarios por zona, mostrables/ocultables, renderizados como etiquetas HTML ancladas a la escena 3D (`CSS2DRenderer`).
- Archivos adjuntos por zona (documentos e imágenes), con vista previa y descarga.
- Visor de imágenes en pantalla completa (lightbox).
- Visor de imágenes panorámicas 360º, con navegación por arrastre y zoom.
- Persistencia local completa: zonas y comentarios en `localStorage`, archivos y modelos subidos por el usuario en `IndexedDB` — sin servidor ni base de datos externa.
- Galería de edificios con tarjeta destacada, miniaturas, y subida de modelos `.glb` propios.
- Contenido de ejemplo precargado (zonas, comentarios, imágenes 360º y documentación) para una demostración inmediata.
- Diseño responsive, adaptado a dispositivos móviles.

## Tecnologías

- **JavaScript** (ES Modules)
- **Three.js** — WebGL, `GLTFLoader`, `OrbitControls`, `TransformControls`, `CSS2DRenderer`
- **Vite** — entorno de desarrollo y bundler
- **IndexedDB** — almacenamiento local de archivos y modelos subidos
- **localStorage** — persistencia de zonas y comentarios
- **HTML5 / CSS3** — diseño responsive, sin frameworks de CSS
- **GitHub Actions** — integración y despliegue continuo (CI/CD)

## Instalación y uso local

El proyecto Vite vive dentro de la carpeta `visor-edificios/`, no en la raíz del repositorio:

```bash
git clone https://github.com/BeatrizMarGar/3DVisor_three.js.git
cd 3DVisor_three.js/visor-edificios
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite en la terminal).

## Controles

**Cámara**
- Clic izquierdo + arrastrar: rotar
- Rueda del ratón: zoom
- Clic derecho + arrastrar: desplazar

**Zonas** *(escritorio)*
- `N`: colocar una nueva zona sobre el edificio
- `G`: mover la zona seleccionada
- `S`: escalar la zona seleccionada
- `C`: mostrar/ocultar comentarios
- `Esc`: deseleccionar zona
- `Supr`: eliminar la zona seleccionada

## Estructura del proyecto

Three/ # raíz del repositorio
├── .github/
│ └── workflows/
│ └── deploy.yml # despliegue automático a GitHub Pages
└── visor-edificios/ # proyecto Vite (raíz de la aplicación)
├── public/
│ ├── models/ # Modelos 3D (.glb) precargados
│ ├── panoramas/ # Imágenes 360º de ejemplo
│ └── documents/ # Documentos de ejemplo
├── src/
│ ├── main.js # Lógica del visor 3D (escena, cámara, zonas, panorama...)
│ ├── gallery.js # Pantalla de inicio y galería de edificios
│ ├── buildings.js # Definición de edificios y gestión de modelos subidos (IndexedDB)
│ ├── storage.js # Persistencia de zonas y comentarios (localStorage)
│ ├── fileStorage.js # Persistencia de archivos adjuntos (IndexedDB)
│ └── style.css # Estilos de la aplicación
├── index.html
├── vite.config.js
└── package.json


## Despliegue

La aplicación se despliega automáticamente en **GitHub Pages** mediante un workflow de **GitHub Actions** (`.github/workflows/deploy.yml`): cada `push` a la rama `main` dispara la instalación de dependencias, el build de producción con Vite, y la publicación del resultado — sin pasos manuales.

## Roadmap

- [ ] Vista de **Realidad Aumentada** mediante [`<model-viewer>`](https://modelviewer.dev/), para visualizar los edificios en el espacio real desde dispositivos móviles compatibles.
- [ ] Soporte para subir modelos en formato `.gltf` (multi-archivo, con `.bin` y texturas asociadas).
- [ ] Cambio de texturas y materiales del modelo desde la propia interfaz.

## Sobre la autora

¡Hola! Soy Beatriz Martín, desarrolladora Full Stack especialista en proyectos creativos e interactivos. Trabajo transformando ideas en experiencias web reales, combinando tecnologías como JavaScript, Node.js y React con entornos 3D e inmersivos en Three.js y WebGL.

- LinkedIn: [linkedin.com/in/beatrizmartingarrido](https://www.linkedin.com/in/beatrizmartingarrido)
- Contacto: [martin_beatriz94@hotmail.com](mailto:martin_beatriz94@hotmail.com)
