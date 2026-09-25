# Portafolio — Terminal retro

Portafolio personal con estética de consola CRT (verde fósforo). HTML, CSS y JavaScript puro: sin dependencias ni build.

## Personalizar
Edita **`data.js`**: perfil, proyectos, experiencia, habilidades (nivel 0–100) y cursos. Todo lo marcado con `TODO` es texto de ejemplo.

## Ver en local
Abre `index.html` en el navegador, o sirve la carpeta:
```
python -m http.server 8000
```

## Comandos
`help`, `about`, `projects`, `experience`, `skills`, `courses`, `contact`, `ls`, `cat <archivo>`, `history`, `banner`, `date`, `echo`, `clear`, `reboot` (+ alias en español: `sobremi`, `proyectos`, `experiencia`, `habilidades`, `cursos`, `contacto`).

Atajos: ↑/↓ historial · Tab autocompletar · Ctrl+L limpiar. Se puede enlazar a una sección con `#projects`, `#skills`, etc.

## Publicar en GitHub Pages
1. Sube la carpeta a un repositorio.
2. *Settings → Pages →* rama `main`, carpeta `/ (root)`.
