# 🍽️ TPV Hostelería LAN v4.1

Sistema TPV completo para hostelería. 100% local, sin internet, sin suscripciones.
Funciona como app nativa en iPhone, iPad y Android (PWA).

## ✨ Módulos

| URL | Descripción |
|-----|-------------|
| `/tpv` | Mesas, comandas, cobro, transferir, dividir, calculadora |
| `/cocina` | KDS en tiempo real — pantalla siempre encendida |
| `/admin` | Carta, estadísticas, historial, exportar CSV, seguridad |
| `/login` | Acceso con PIN numérico táctil |

## 🚀 Instalación (5 minutos)

Requisito: Node.js 22+ → https://nodejs.org

```bash
npm install
npm start
```

```
╔══════════════════════════════════════════╗
║  TPV:    http://localhost:3000/tpv        ║
║  Cocina: http://localhost:3000/cocina     ║
║  Admin:  http://localhost:3000/admin      ║
║  LAN:    http://192.168.1.XX:3000        ║
║  🔐 PIN admin: 1234                       ║
╚══════════════════════════════════════════╝
```

## 📱 Instalar en iPhone / iPad

1. Abre Safari → `http://192.168.1.XX:3000/tpv`
2. Toca ⬆ Compartir → "Añadir a pantalla de inicio"
3. Se instala como app nativa — icono propio, sin barra de navegador

## 📱 Instalar en Android

1. Abre Chrome → misma URL
2. Toca el banner "Instalar TPV" o menú ⋮ → "Instalar app"

## 🔄 Flujo de trabajo

```
① Abrir caja → fondo inicial
② Mesa → camarero + personas
③ Añadir platos → ④ Enviar a cocina
⑤ Cocina marca listo (tiempo real)
⑥ Cobrar: efectivo (con cambio) o tarjeta
⑦ Admin → dashboard, stats, exportar CSV
```

## 🛠️ Funciones

- ⇄ Transferir mesa — mover comanda entera a otra mesa
- ✂ Dividir cuenta — separar ítems en dos comandas (protegido: no puede vaciar la original)
- 💰 Descuentos por comanda — visible en ticket y pantalla de cobro
- 📊 Dashboard — ventas 7 días, horas punta, top productos
- ⬇ Exportar CSV — historial para Excel/contabilidad
- 💾 Backup — descargar la BD completa con un clic
- 🔐 PIN admin — acceso protegido con rate limiting
- 📡 Tiempo real — SSE: mesas y cocina se actualizan al instante

## 🔒 Seguridad

- Autenticación PIN con hash SHA-256, comparación en tiempo constante
- Rate limiting: 5 intentos de login / 2 min → bloqueo temporal
- Cabeceras HTTP: CSP, X-Frame-Options, X-Content-Type-Options
- Validación de imágenes por magic bytes (no solo extensión)
- Todas las rutas de escritura protegidas con token de sesión (8h)
- Auditoría: cada acción admin queda registrada con IP y fecha

## 💾 Backup

```bash
cp db/hosteleria.db db/backup_$(date +%Y%m%d).db
# O: Admin → Seguridad → Descargar backup
```

## ⚙️ Arranque automático

- Windows: doble clic en `iniciar-windows.bat`
- Linux/Mac: `./iniciar-mac-linux.sh`
- Servicio: `npm install -g pm2 && pm2 start "node --experimental-sqlite server.js" --name tpv`
