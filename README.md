# 🏋️ Agoitz Gym — Biblioteca de ejercicios

App web estática (HTML/CSS/JS, sin frameworks ni backend) para explorar 1.324 ejercicios
de gimnasio: filtra por parte del cuerpo o equipo, busca por nombre o músculo, mira la
animación de cada ejercicio, arma tus rutinas por día con series/reps/peso, síguelas en
Modo entrenamiento con temporizador de descanso, y mira tu progreso en un gráfico simple
por ejercicio. Instalable como app (PWA) y usable sin conexión. ~31&nbsp;MB en total.

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
en GitHub:** este proyecto tiene más de 2.600 archivos (imágenes + animaciones) y esa vía
solo admite 100 por subida. Usa GitHub Desktop o `git push` para que suban todos.

## Guardado de datos
Rutinas, programas, pesos y progreso se guardan solos con `localStorage`, sin cuenta ni
servidor — pero solo en ese navegador y ese dispositivo, no sincroniza entre varios por
sí sola. Desde el panel de rutina puedes **Exportar** (descarga un `.json`) e **Importar**
para hacer copia de seguridad o pasarla a otro dispositivo.

## Uso sin conexión
Es instalable (PWA): "Añadir a pantalla de inicio" desde el navegador del móvil. El propio
código de la app se cachea solo. Las imágenes y animaciones se cachean bajo demanda según
las vas viendo — o desde el panel de rutina, "Descargar para usar sin conexión" te deja
elegir de antemano qué tipo de equipo quieres disponible offline, para no descargar los
31&nbsp;MB completos si no quieres.

## Datos y créditos
Ver [`NOTICE.md`](NOTICE.md) — datos de [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
(MIT), imágenes y animaciones © [Gym visual](https://gymvisual.com/) (las animaciones se
recodificaron de GIF a WebM para reducir el tamaño; mismo contenido visual).

