# 🏋️ Agoitz Gym — Biblioteca de ejercicios

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
Netlify o Vercel (arrastrar la carpeta). **Importante si usas "Add file → Upload files"
en GitHub:** este proyecto tiene 2.658 archivos (imágenes + gifs) y esa vía solo admite
100 por subida. Usa GitHub Desktop o `git push` para que suban todos.

## Guardado de datos
"Mi rutina" se guarda con `localStorage`, es decir: solo en ese navegador y ese
dispositivo. No hay cuenta ni servidor, así que no sincroniza entre dispositivos por sí
sola. Desde el panel de rutina puedes **Exportar** (descarga un `.json`) e **Importar**
(vuelve a cargar ese archivo) para hacer copia de seguridad o pasarla a otro dispositivo
— por ejemplo, subiendo ese `.json` a tu propio repo de GitHub a mano.

## Datos y créditos
Ver [`NOTICE.md`](NOTICE.md) — datos de [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
(MIT), imágenes y animaciones © [Gym visual](https://gymvisual.com/).
