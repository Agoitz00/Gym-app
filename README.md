# 🏋️ Cargadero — Biblioteca de ejercicios

App web estática (HTML/CSS/JS, sin frameworks ni backend) para explorar 1.324 ejercicios
de gimnasio: filtra por parte del cuerpo o equipo, busca por nombre o músculo, mira la
animación de cada ejercicio y guarda los que quieras en "Mi rutina" (se guarda en el
propio navegador, sin cuenta ni servidor).

## Cómo verla en local
Al ser 100% estática no hace falta instalar nada, pero abrir `index.html` directamente
con doble clic falla al cargar `data.json` (los navegadores bloquean `fetch` sobre
`file://`). Basta con levantar un servidor simple desde esta carpeta:

```bash
python3 -m http.server 8080
# o
npx serve .
```
y abrir `http://localhost:8080`.

## Desplegarla
Al no tener build ni backend, sirve cualquier hosting estático tal cual: GitHub Pages,
Netlify o Vercel (arrastrar la carpeta).

## Datos y créditos
Ver [`NOTICE.md`](NOTICE.md) — datos de [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
(MIT), imágenes y animaciones © [Gym visual](https://gymvisual.com/).
