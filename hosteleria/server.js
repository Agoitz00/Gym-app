
const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');
const multer   = require('multer');
const { DatabaseSync } = require('node:sqlite');
const os       = require('os');

const app  = express();
const PORT = process.env.PORT || 3000;

// ╔══════════════════════════════════════════════════════════════╗
// ║  SEGURIDAD — configuración global                          ║
// ╚══════════════════════════════════════════════════════════════╝

// [FIX #6] Cabeceras de seguridad en TODAS las respuestas
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src https://fonts.gstatic.com; " +
    "img-src 'self' data: blob:; " +
    "connect-src 'self';"
  );
  next();
});

// [FIX #7] CORS — solo permitir origen local / LAN
app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  const host   = req.headers.host  || '';
  // Allow same-origin, localhost, and private IP ranges
  const isLocal = !origin ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    /^https?:\/\/192\.168\.\d+\.\d+/.test(origin) ||
    /^https?:\/\/10\.\d+\.\d+\.\d+/.test(origin)  ||
    /^https?:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/.test(origin);
  if (origin && !isLocal) {
    return res.status(403).json({ error: 'Origen no permitido' });
  }
  if (origin && isLocal) res.setHeader('Access-Control-Allow-Origin', origin);
  next();
});

// [FIX #2] Rate limiting en memoria — simple pero efectivo
const rateLimitStore = new Map();
function rateLimit(maxReq, windowMs) {
  return (req, res, next) => {
    const key = req.ip + ':' + req.path;
    const now = Date.now();
    const entry = rateLimitStore.get(key) || { count: 0, start: now };
    if (now - entry.start > windowMs) { entry.count = 0; entry.start = now; }
    entry.count++;
    rateLimitStore.set(key, entry);
    if (entry.count > maxReq) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      return res.status(429).json({ error: 'Demasiadas peticiones. Espera un momento.' });
    }
    next();
  };
}
// Limpiar store cada 5 min para no acumular memoria
setInterval(() => {
  const cutoff = Date.now() - 300000;
  for (const [k, v] of rateLimitStore) { if (v.start < cutoff) rateLimitStore.delete(k); }
}, 300000);

// [FIX #1] Sesiones en memoria — tokens seguros con expiración
const sessions = new Map();
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 horas

function createSession() {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { created: Date.now(), expires: Date.now() + SESSION_TTL });
  return token;
}
function isValidSession(token) {
  if (!token) return false;
  const s = sessions.get(token);
  if (!s) return false;
  if (Date.now() > s.expires) { sessions.delete(token); return false; }
  return true;
}
function destroySession(token) { sessions.delete(token); }
// Limpiar sesiones expiradas cada hora
setInterval(() => {
  for (const [t, s] of sessions) { if (Date.now() > s.expires) sessions.delete(t); }
}, 3600000);

// [FIX #1] Middleware de autenticación para rutas admin
function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query._t;
  if (isValidSession(token)) return next();
  // Para rutas HTML, redirigir al login
  if (!req.path.startsWith('/api/')) return res.redirect('/login');
  return res.status(401).json({ error: 'No autorizado. Inicia sesión en /login' });
}

// ── DB ────────────────────────────────────────────────────────────────────────
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const db = new DatabaseSync(path.join(dbDir, 'hosteleria.db'));

const run = (sql, ...p) => db.prepare(sql).run(...p);
const get = (sql, ...p) => db.prepare(sql).get(...p);
const all = (sql, ...p) => db.prepare(sql).all(...p);

// [FIX #9] Helper para validar IDs enteros
function validId(id) { const n = parseInt(id); return !isNaN(n) && n > 0 && String(n) === String(id); }
function sendBadId(res) { return res.status(400).json({ error: 'ID inválido' }); }

// [FIX #8] Helper de sanitización de strings
function sanitize(str, maxLen = 255) {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLen);
}
function sanitizeNum(v, def = 0) {
  const n = parseFloat(v); return isNaN(n) ? def : Math.round(n * 100) / 100;
}
function sanitizeInt(v, def = 0) {
  const n = parseInt(v); return isNaN(n) ? def : n;
}

// ── SCHEMA ────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS config (clave TEXT PRIMARY KEY, valor TEXT);
  INSERT OR IGNORE INTO config VALUES
    ('nombre_local','Mi Restaurante'),('subtitulo','TPV'),
    ('color_primario','#c8a96e'),('moneda','€'),
    ('iva_incluido','1'),('iva_porcentaje','10'),
    ('logo',''),('camareros','Paco,Ana,Carlos,Lucia'),
    ('admin_pin_hash','');

  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL, icono TEXT DEFAULT '🍽️',
    orden INTEGER DEFAULT 0, activa INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria_id INTEGER NOT NULL,
    nombre TEXT NOT NULL, descripcion TEXT DEFAULT '',
    precio REAL NOT NULL, precio_especial REAL,
    foto TEXT DEFAULT '', disponible INTEGER DEFAULT 1,
    destacado INTEGER DEFAULT 0, orden INTEGER DEFAULT 0,
    alergenos TEXT DEFAULT '',
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
  );
  CREATE TABLE IF NOT EXISTS mesas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER NOT NULL, nombre TEXT,
    capacidad INTEGER DEFAULT 4, zona TEXT DEFAULT 'Interior',
    pos_x REAL DEFAULT 0, pos_y REAL DEFAULT 0,
    activa INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS comandas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mesa_id INTEGER, mesa_nombre TEXT,
    estado TEXT DEFAULT 'abierta',
    personas INTEGER DEFAULT 1, camarero TEXT DEFAULT '',
    notas TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime')),
    cobrada_at TEXT, total REAL DEFAULT 0,
    tipo_pago TEXT, efectivo_entregado REAL,
    descuento REAL DEFAULT 0,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id)
  );
  CREATE TABLE IF NOT EXISTS comanda_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comanda_id INTEGER NOT NULL,
    producto_id INTEGER, nombre TEXT NOT NULL,
    precio REAL NOT NULL, cantidad INTEGER DEFAULT 1,
    notas TEXT DEFAULT '', estado TEXT DEFAULT 'nuevo',
    enviado_cocina INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (comanda_id) REFERENCES comandas(id)
  );
  CREATE TABLE IF NOT EXISTS caja_sesiones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    apertura TEXT DEFAULT (datetime('now','localtime')),
    cierre TEXT, fondo_inicial REAL DEFAULT 0,
    total_efectivo REAL DEFAULT 0, total_tarjeta REAL DEFAULT 0,
    notas_cierre TEXT, activa INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT DEFAULT (datetime('now','localtime')),
    ip TEXT, action TEXT, detail TEXT
  );
`);

// Inicializar PIN por defecto = 1234 si no hay hash
const pinRow = get("SELECT valor FROM config WHERE clave='admin_pin_hash'");
if (!pinRow?.valor) {
  const hash = crypto.createHash('sha256').update('1234').digest('hex');
  run("INSERT OR REPLACE INTO config(clave,valor) VALUES('admin_pin_hash',?)", hash);
  console.log('🔐 PIN admin por defecto: 1234  (cámbialo en Admin → Configuración)');
}

// Seed data
if (!get('SELECT id FROM categorias LIMIT 1')) {
  const cats = [['Entrantes','🥗'],['Carnes','🥩'],['Pescados','🐟'],['Postres','🍮'],['Bebidas','🍷'],['Cócteles','🍸']];
  const ids = cats.map(([n,i],o) => run('INSERT INTO categorias(nombre,icono,orden) VALUES(?,?,?)',n,i,o).lastInsertRowid);
  const prods = [
    [ids[0],'Croquetas caseras','Jamón ibérico, bechamel artesanal',8.50,1],
    [ids[0],'Tabla ibéricos','Jamón, salchichón, chorizo',14.00,0],
    [ids[0],'Gazpacho','Tomate fresco, pepino, pimiento',6.50,0],
    [ids[0],'Patatas bravas','Con salsa brava y aioli',5.50,0],
    [ids[1],'Entrecot 300g','Con patatas fritas y pimientos',22.00,1],
    [ids[1],'Secreto ibérico','A la brasa con verduras',18.50,0],
    [ids[1],'Carrillada al vino','Vino tinto, verduras, patata',16.00,0],
    [ids[1],'Hamburguesa gourmet','Ternera, cheddar, bacon',14.00,0],
    [ids[2],'Lubina a la sal','Entera 400g, limón y aceite',24.00,1],
    [ids[2],'Pulpo a la gallega','Cachelos, pimentón, aceite',19.00,0],
    [ids[2],'Gambas al ajillo','Gambas, ajo, guindilla',13.50,0],
    [ids[3],'Tarta de queso','Al horno estilo La Viña',6.00,1],
    [ids[3],'Coulant chocolate','Con helado vainilla',6.50,0],
    [ids[3],'Flan casero','Con nata montada',4.50,0],
    [ids[4],'Vino tinto (copa)','D.O. Rioja, crianza',3.50,0],
    [ids[4],'Vino blanco (copa)','D.O. Rías Baixas',3.80,0],
    [ids[4],'Cerveza artesana','50cl, local',2.80,0],
    [ids[4],'Agua 50cl','Con o sin gas',1.80,0],
    [ids[4],'Refresco','Cola, naranja, limón',2.50,0],
    [ids[4],'Café solo','Espresso doble',1.60,0],
    [ids[4],'Café con leche','',1.90,0],
    [ids[5],'Mojito','Ron, lima, menta, soda',8.00,1],
    [ids[5],'Gin Tonic','Ginebra premium, tónica artesana',9.00,0],
  ];
  prods.forEach(([cid,n,d,p,dest]) => run('INSERT INTO productos(categoria_id,nombre,descripcion,precio,disponible,destacado) VALUES(?,?,?,?,1,?)',cid,n,d,p,dest));
}
if (!get('SELECT id FROM mesas LIMIT 1')) {
  [[1,'Mesa 1',4,'Interior'],[2,'Mesa 2',4,'Interior'],[3,'Mesa 3',4,'Interior'],[4,'Mesa 4',4,'Interior'],
   [5,'Mesa 5',2,'Interior'],[6,'Mesa 6',6,'Interior'],[7,'Mesa 7',4,'Terraza'],[8,'Mesa 8',4,'Terraza'],
   [9,'Mesa 9',4,'Terraza'],[10,'Mesa 10',6,'Terraza'],[11,'Barra 1',0,'Barra'],[12,'Barra 2',0,'Barra'],[13,'Privado',8,'Privado']
  ].forEach(([n,nm,c,z]) => run('INSERT INTO mesas(numero,nombre,capacidad,zona) VALUES(?,?,?,?)',n,nm,c,z));
}


// ── SERVER-SENT EVENTS ────────────────────────────────────────────────────────
const sseClients = new Set();

function broadcast(event, data = {}) {
  if (sseClients.size === 0) return;
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of [...sseClients]) {
    try { res.write(msg); }
    catch { sseClients.delete(res); }
  }
}

// [FIX #4] Upload con verificación de magic bytes
function checkMagicBytes(buffer) {
  if (!buffer || buffer.length < 4) return false;
  const b = buffer;
  // JPEG: FF D8 FF
  if (b[0]===0xFF && b[1]===0xD8 && b[2]===0xFF) return true;
  // PNG: 89 50 4E 47
  if (b[0]===0x89 && b[1]===0x50 && b[2]===0x4E && b[3]===0x47) return true;
  // GIF: 47 49 46
  if (b[0]===0x47 && b[1]===0x49 && b[2]===0x46) return true;
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (b[0]===0x52 && b[1]===0x49 && b[2]===0x46 && b[3]===0x46) return true;
  return false;
}

const uploadStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    const d = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    cb(null, d);
  },
  // [FIX #4] Solo extensiones seguras, sin ejecutables
  filename: (_, f, cb) => {
    const safe = ['jpg','jpeg','png','gif','webp'];
    const ext  = path.extname(f.originalname).toLowerCase().replace('.','');
    if (!safe.includes(ext)) return cb(new Error('Extensión no permitida'));
    cb(null, `img_${crypto.randomBytes(8).toString('hex')}.${ext}`);
  }
});
const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter: (_, f, cb) => {
    if (!f.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) return cb(new Error('Solo imágenes JPEG/PNG/GIF/WebP'));
    cb(null, true);
  }
});

// Verificar magic bytes DESPUÉS de guardar
async function verifyUploadedImage(filepath) {
  try {
    const fd = fs.openSync(filepath, 'r');
    const buf = Buffer.alloc(12);
    fs.readSync(fd, buf, 0, 12, 0);
    fs.closeSync(fd);
    if (!checkMagicBytes(buf)) { fs.unlinkSync(filepath); return false; }
    return true;
  } catch { return false; }
}

// [FIX #5] Helper seguro para borrar fotos — previene path traversal
function safeDeleteFoto(fotoPath) {
  if (!fotoPath) return;
  const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
  const fullPath   = path.resolve(__dirname, 'public', fotoPath);
  // Solo borrar si está dentro de uploads/
  if (!fullPath.startsWith(uploadsDir + path.sep)) return;
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '100kb' }));  // limitar tamaño de body
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, p) => {
    if (p.endsWith('.html'))           res.setHeader('Cache-Control', 'no-store, no-cache');
    else if (p.endsWith('sw.js'))     { res.setHeader('Cache-Control','no-store,no-cache,must-revalidate'); res.setHeader('Service-Worker-Allowed','/'); }
    else if (p.endsWith('.json'))      res.setHeader('Cache-Control', 'public, max-age=3600');
    else if (p.includes('/uploads/')) { res.setHeader('Content-Disposition','inline'); res.setHeader('Cache-Control','public,max-age=604800'); }
    else if (p.includes('/icons/'))    res.setHeader('Cache-Control', 'public, max-age=2592000');
    else if (p.match(/\.(css|js|woff2?)$/)) res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// ── SSE ENDPOINT (público — tablets sin auth lo usan) ─────────────────────────
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  res.write('retry: 3000\n\n');
  res.write(`event: connected\ndata: {"ts":${Date.now()}}\n\n`);

  const hb = setInterval(() => {
    try { res.write(':hb\n\n'); }
    catch { clearInterval(hb); sseClients.delete(res); }
  }, 25000);

  sseClients.add(res);
  req.on('close', () => { clearInterval(hb); sseClients.delete(res); });
});

// PWA version endpoint
app.get('/api/version', (_, res) => {
  res.json({ version: '3.0', name: 'TPV Hostelería', ts: Date.now() });
});


// Audit log helper
function audit(req, action, detail = '') {
  try { run("INSERT INTO audit_log(ip,action,detail) VALUES(?,?,?)", req.ip||'?', action, sanitize(detail, 500)); } catch {}
}

// ── RUTAS PÚBLICAS ────────────────────────────────────────────────────────────
app.get('/tpv',    (_, res) => res.sendFile(path.join(__dirname, 'public', 'tpv.html')));
app.get('/cocina', (_, res) => res.sendFile(path.join(__dirname, 'public', 'cocina.html')));
app.get('/login',  (_, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/',       (_, res) => res.redirect('/tpv'));

// ── AUTENTICACIÓN ─────────────────────────────────────────────────────────────
// [FIX #2] Rate limit estricto en login: 5 intentos / 2 minutos por IP
app.post('/api/auth/login', rateLimit(5, 120000), (req, res) => {
  const { pin } = req.body;
  if (!pin || typeof pin !== 'string' || pin.length > 20) {
    return res.status(400).json({ error: 'PIN inválido' });
  }
  const stored = get("SELECT valor FROM config WHERE clave='admin_pin_hash'")?.valor || '';
  const hash   = crypto.createHash('sha256').update(pin).digest('hex');
  // [FIX] Comparación en tiempo constante para prevenir timing attacks
  const match  = stored.length > 0 && crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(stored));
  if (!match) {
    audit(req, 'LOGIN_FAIL', `pin attempt`);
    return res.status(401).json({ error: 'PIN incorrecto' });
  }
  const token = createSession();
  audit(req, 'LOGIN_OK', '');
  res.json({ token, expires: Date.now() + SESSION_TTL });
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) destroySession(token);
  res.json({ ok: true });
});

app.get('/api/auth/check', (req, res) => {
  const token = req.headers['x-admin-token'];
  res.json({ valid: isValidSession(token) });
});

// ── ADMIN HTML — protegido ────────────────────────────────────────────────────
app.get('/admin', requireAuth, (_, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ── APIs PÚBLICAS (carta, mesas, cocina) ─────────────────────────────────────
app.get('/api/config', (_, res) => {
  const r = {}; all('SELECT clave,valor FROM config').forEach(x => r[x.clave] = x.valor);
  // No exponer el hash del PIN
  delete r.admin_pin_hash;
  res.json(r);
});

app.get('/api/categorias', (_, res) => res.json(all('SELECT * FROM categorias ORDER BY orden,id')));
app.get('/api/productos',  (req, res) => {
  let sql = `SELECT p.*,c.nombre as cat_nombre,c.icono as cat_icono FROM productos p JOIN categorias c ON p.categoria_id=c.id`;
  const w = [], p = [];
  if (req.query.cat)        { w.push('p.categoria_id=?'); p.push(sanitizeInt(req.query.cat)); }
  if (req.query.disponible !== undefined) { w.push('p.disponible=?'); p.push(req.query.disponible === '1' ? 1 : 0); }
  if (w.length) sql += ' WHERE ' + w.join(' AND ');
  sql += ' ORDER BY p.orden,p.id';
  res.json(all(sql, ...p));
});
app.get('/api/mesas', (_, res) => {
  const mesas = all('SELECT * FROM mesas WHERE activa=1 ORDER BY zona,numero');
  const cols  = all(`SELECT c.mesa_id,c.id as comanda_id,c.personas,c.camarero,c.created_at,COALESCE(SUM(ci.cantidad*ci.precio),0) as total
    FROM comandas c LEFT JOIN comanda_items ci ON ci.comanda_id=c.id
    WHERE c.estado='abierta' GROUP BY c.id`);
  const m = {}; cols.forEach(c => { m[c.mesa_id] = c; });
  res.json(mesas.map(ms => ({ ...ms, comanda: m[ms.id] || null })));
});
app.get('/api/cocina', (_, res) => res.json(all(`
  SELECT ci.*,c.mesa_id,m.nombre as mesa_nombre,c.camarero,c.created_at as comanda_at
  FROM comanda_items ci JOIN comandas c ON c.id=ci.comanda_id JOIN mesas m ON m.id=c.mesa_id
  WHERE ci.enviado_cocina=1 AND ci.estado NOT IN ('entregado','cancelado') AND c.estado='abierta'
  ORDER BY ci.created_at ASC`)));
app.put('/api/cocina/item/:id', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const estados = ['pendiente','preparando','listo','entregado'];
  const estado  = req.body.estado;
  if (!estados.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
  run('UPDATE comanda_items SET estado=? WHERE id=?', estado, req.params.id);
  res.json({ ok: true });
});

// TPV — comandas (acceso desde tablets de camareros, no requiere auth)
app.get('/api/comandas',    (_, res) => res.json(all(`SELECT c.*,COALESCE(SUM(ci.cantidad*ci.precio),0) as total FROM comandas c LEFT JOIN comanda_items ci ON ci.comanda_id=c.id WHERE c.estado='abierta' GROUP BY c.id ORDER BY c.created_at`)));
app.post('/api/comandas',   rateLimit(60, 60000), (req, res) => {
  const { mesa_id, personas, camarero } = req.body;
  if (!validId(mesa_id)) return sendBadId(res);
  const mesa = get('SELECT * FROM mesas WHERE id=? AND activa=1', mesa_id);
  if (!mesa)   return res.status(404).json({ error: 'Mesa no existe' });
  const ex = get("SELECT id FROM comandas WHERE mesa_id=? AND estado='abierta'", mesa_id);
  if (ex) return res.json({ id: ex.id, existing: true });
  const r = run('INSERT INTO comandas(mesa_id,mesa_nombre,personas,camarero) VALUES(?,?,?,?)',
    mesa_id, sanitize(mesa.nombre,100), sanitizeInt(personas,1), sanitize(camarero,80));
  broadcast('mesas', { type: 'comanda_created' });
  res.json({ id: r.lastInsertRowid });
});
app.get('/api/comandas/:id', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const c = get(`SELECT c.*,COALESCE(SUM(ci.cantidad*ci.precio),0) as total FROM comandas c LEFT JOIN comanda_items ci ON ci.comanda_id=c.id WHERE c.id=? GROUP BY c.id`, req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  c.items = all('SELECT * FROM comanda_items WHERE comanda_id=? ORDER BY id', req.params.id);
  res.json(c);
});
app.put('/api/comandas/:id', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const { personas, camarero, notas, descuento } = req.body;
  run('UPDATE comandas SET personas=?,camarero=?,notas=?,descuento=? WHERE id=? AND estado=\'abierta\'',
    sanitizeInt(personas,1), sanitize(camarero,80), sanitize(notas,500), sanitizeNum(descuento,0), req.params.id);
  res.json({ ok: true });
});
app.post('/api/comandas/:id/cobrar', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const { tipo_pago, efectivo_entregado } = req.body;
  if (!['efectivo','tarjeta'].includes(tipo_pago)) return res.status(400).json({ error: 'Tipo de pago inválido' });
  const cmd = get('SELECT * FROM comandas WHERE id=? AND estado=\'abierta\'', req.params.id);
  if (!cmd) return res.status(404).json({ error: 'Comanda no encontrada o ya cobrada' });
  const t = get('SELECT COALESCE(SUM(cantidad*precio),0) as t FROM comanda_items WHERE comanda_id=?', req.params.id)?.t || 0;
  if (t === 0) return res.status(400).json({ error: 'La comanda está vacía' });
  const desc = parseFloat(cmd.descuento)||0;
  const total = Math.max(0, t - desc);
  run(`UPDATE comandas SET estado='cobrada',cobrada_at=datetime('now','localtime'),total=?,tipo_pago=?,efectivo_entregado=? WHERE id=?`,
    total, tipo_pago, sanitizeNum(efectivo_entregado), req.params.id);
  audit(req, 'COBRO', `comanda=${req.params.id} total=${total} pago=${tipo_pago}`);
  broadcast('mesas', { type: 'comanda_closed', mesa_id: cmd.mesa_id });
  broadcast('stats', {});
  res.json({ ok: true, total, descuento: desc, bruto: t });
});
app.post('/api/comandas/:id/cancelar', requireAuth, (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  run("UPDATE comandas SET estado='cancelada' WHERE id=?", req.params.id);
  broadcast('mesas', { type: 'comanda_cancelled' });
  audit(req, 'CANCEL_COMANDA', `id=${req.params.id}`);
  res.json({ ok: true });
});
app.post('/api/comandas/:id/items', rateLimit(120, 60000), (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const { producto_id, cantidad, notas } = req.body;
  if (!validId(producto_id)) return sendBadId(res);
  const prod = get('SELECT nombre,precio FROM productos WHERE id=? AND disponible=1', producto_id);
  if (!prod) return res.status(404).json({ error: 'Producto no disponible' });
  const qty = Math.min(Math.max(1, sanitizeInt(cantidad, 1)), 99);
  const r = run('INSERT INTO comanda_items(comanda_id,producto_id,nombre,precio,cantidad,notas) VALUES(?,?,?,?,?,?)',
    req.params.id, producto_id, prod.nombre, prod.precio, qty, sanitize(notas, 200));
  broadcast('comanda', { id: parseInt(req.params.id) });
  res.json({ id: r.lastInsertRowid, nombre: prod.nombre, precio: prod.precio, cantidad: qty });
});
app.put('/api/comanda-items/:id', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const item = get('SELECT * FROM comanda_items WHERE id=?', req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const qty  = Math.min(Math.max(1, sanitizeInt(req.body.cantidad, item.cantidad)), 99);
  const nota = sanitize(req.body.notas ?? item.notas, 200);
  const est  = ['nuevo','pendiente','preparando','listo','entregado'].includes(req.body.estado) ? req.body.estado : item.estado;
  const it2 = get('SELECT comanda_id FROM comanda_items WHERE id=?', req.params.id);
  run('UPDATE comanda_items SET cantidad=?,notas=?,estado=? WHERE id=?', qty, nota, est, req.params.id);
  if (it2) broadcast('comanda', { id: it2.comanda_id });
  res.json({ ok: true });
});
app.delete('/api/comanda-items/:id', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const it3 = get('SELECT comanda_id FROM comanda_items WHERE id=?', req.params.id);
  run('DELETE FROM comanda_items WHERE id=?', req.params.id);
  if (it3) broadcast('comanda', { id: it3.comanda_id });
  res.json({ ok: true });
});
app.post('/api/comandas/:id/enviar-cocina', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  run("UPDATE comanda_items SET enviado_cocina=1,estado='pendiente' WHERE comanda_id=? AND enviado_cocina=0", req.params.id);
  broadcast('cocina', { type: 'new_items' });
  broadcast('comanda', { id: parseInt(req.params.id) });
  res.json({ ok: true });
});

// Caja
app.get('/api/caja',  (_, res) => {
  const s = get(`SELECT cs.*,(SELECT COALESCE(SUM(total),0) FROM comandas WHERE tipo_pago='efectivo' AND estado='cobrada' AND date(cobrada_at)=date('now','localtime')) as hoy_efectivo,(SELECT COALESCE(SUM(total),0) FROM comandas WHERE tipo_pago='tarjeta' AND estado='cobrada' AND date(cobrada_at)=date('now','localtime')) as hoy_tarjeta,(SELECT COUNT(*) FROM comandas WHERE estado='cobrada' AND date(cobrada_at)=date('now','localtime')) as hoy_comandas FROM caja_sesiones cs WHERE cs.activa=1 LIMIT 1`);
  res.json(s || null);
});
app.post('/api/caja/abrir', (req, res) => {
  const ex = get("SELECT id FROM caja_sesiones WHERE activa=1");
  if (ex) return res.json({ id: ex.id, existing: true });
  const r = run('INSERT INTO caja_sesiones(fondo_inicial) VALUES(?)', sanitizeNum(req.body.fondo_inicial));
  audit(req, 'CAJA_ABRIR', `fondo=${req.body.fondo_inicial}`);
  res.json({ id: r.lastInsertRowid });
});
app.post('/api/caja/cerrar', requireAuth, (req, res) => {
  run("UPDATE caja_sesiones SET activa=0,cierre=datetime('now','localtime'),notas_cierre=? WHERE activa=1", sanitize(req.body.notas, 500));
  audit(req, 'CAJA_CERRAR', '');
  res.json({ ok: true });
});

// Stats & historial
app.get('/api/historial', requireAuth, (req, res) => {
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(req.query.fecha) ? req.query.fecha : new Date().toISOString().split('T')[0];
  res.json(all(`SELECT c.*,m.nombre as mesa_nombre_real FROM comandas c LEFT JOIN mesas m ON m.id=c.mesa_id WHERE c.estado IN ('cobrada','cancelada') AND date(c.cobrada_at)=? ORDER BY c.cobrada_at DESC`, fecha));
});
app.get('/api/stats', (req, res) => {
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(req.query.fecha) ? req.query.fecha : new Date().toISOString().split('T')[0];
  res.json(get(`SELECT COUNT(CASE WHEN estado='cobrada' THEN 1 END) as comandas,COALESCE(SUM(CASE WHEN estado='cobrada' THEN total END),0) as total,COALESCE(SUM(CASE WHEN estado='cobrada' AND tipo_pago='efectivo' THEN total END),0) as efectivo,COALESCE(SUM(CASE WHEN estado='cobrada' AND tipo_pago='tarjeta' THEN total END),0) as tarjeta FROM comandas WHERE date(cobrada_at)=?`, fecha));
});
app.get('/api/audit', requireAuth, (req, res) => {
  res.json(all('SELECT * FROM audit_log ORDER BY id DESC LIMIT 200'));
});

// ── APIs DE ADMIN (requieren auth) ────────────────────────────────────────────
app.post('/api/config', requireAuth, (req, res) => {
  // [FIX #10] Lista blanca de claves modificables
  const ALLOWED = ['nombre_local','subtitulo','color_primario','moneda','iva_incluido','iva_porcentaje','logo','camareros'];
  const s = db.prepare('INSERT OR REPLACE INTO config VALUES(?,?)');
  for (const [k, v] of Object.entries(req.body)) {
    if (!ALLOWED.includes(k)) continue;  // ignorar claves no permitidas
    s.run(k, sanitize(String(v), 500));
  }
  audit(req, 'CONFIG_UPDATE', Object.keys(req.body).filter(k=>ALLOWED.includes(k)).join(','));
  res.json({ ok: true });
});

// Cambiar PIN (admin)
app.post('/api/auth/change-pin', requireAuth, rateLimit(5, 60000), (req, res) => {
  const { pin_actual, pin_nuevo } = req.body;
  if (!pin_actual || !pin_nuevo || pin_nuevo.length < 4 || pin_nuevo.length > 20) {
    return res.status(400).json({ error: 'PIN inválido (mín 4 caracteres)' });
  }
  const stored = get("SELECT valor FROM config WHERE clave='admin_pin_hash'")?.valor || '';
  const hashAct = crypto.createHash('sha256').update(pin_actual).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(hashAct), Buffer.from(stored))) {
    return res.status(401).json({ error: 'PIN actual incorrecto' });
  }
  const newHash = crypto.createHash('sha256').update(pin_nuevo).digest('hex');
  run("INSERT OR REPLACE INTO config(clave,valor) VALUES('admin_pin_hash',?)", newHash);
  audit(req, 'PIN_CHANGE', '');
  res.json({ ok: true });
});

app.post('/api/categorias', requireAuth, (req, res) => {
  const nombre = sanitize(req.body.nombre, 100);
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
  const r = run('INSERT INTO categorias(nombre,icono,orden) VALUES(?,?,?)', nombre, sanitize(req.body.icono||'🍽️',10), sanitizeInt(req.body.orden));
  audit(req, 'CAT_CREATE', nombre);
  res.json({ id: r.lastInsertRowid });
});
app.put('/api/categorias/reorder', requireAuth, (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be array' });
  const s = db.prepare('UPDATE categorias SET orden=? WHERE id=?');
  order.forEach(({ id, orden }) => { if (validId(id)) s.run(sanitizeInt(orden), id); });
  res.json({ ok: true });
});

app.put('/api/categorias/:id', requireAuth, (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  run('UPDATE categorias SET nombre=?,icono=?,orden=?,activa=? WHERE id=?',
    sanitize(req.body.nombre,100), sanitize(req.body.icono||'🍽️',10), sanitizeInt(req.body.orden), req.body.activa==1?1:0, req.params.id);
  res.json({ ok: true });
});
app.delete('/api/categorias/:id', requireAuth, (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  // Borrar fotos de productos de la categoría
  const prods = all('SELECT foto FROM productos WHERE categoria_id=?', req.params.id);
  prods.forEach(p => safeDeleteFoto(p.foto));
  run('DELETE FROM productos WHERE categoria_id=?', req.params.id);
  run('DELETE FROM categorias WHERE id=?', req.params.id);
  audit(req, 'CAT_DELETE', `id=${req.params.id}`);
  res.json({ ok: true });
});


app.post('/api/productos', requireAuth, upload.single('foto'), async (req, res) => {
  const nombre = sanitize(req.body.nombre, 200);
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
  if (!validId(req.body.categoria_id)) return res.status(400).json({ error: 'Categoría inválida' });
  let foto = '';
  if (req.file) {
    const ok = await verifyUploadedImage(req.file.path);
    if (!ok) return res.status(400).json({ error: 'Archivo de imagen inválido' });
    foto = `/uploads/${req.file.filename}`;
  }
  const precio = sanitizeNum(req.body.precio);
  if (precio <= 0) return res.status(400).json({ error: 'Precio inválido' });
  const r = run(
    'INSERT INTO productos(categoria_id,nombre,descripcion,precio,precio_especial,foto,disponible,destacado,orden,alergenos) VALUES(?,?,?,?,?,?,?,?,?,?)',
    req.body.categoria_id, nombre, sanitize(req.body.descripcion,500), precio,
    req.body.precio_especial ? sanitizeNum(req.body.precio_especial) : null,
    foto, req.body.disponible==1?1:0, req.body.destacado==1?1:0,
    sanitizeInt(req.body.orden), sanitize(req.body.alergenos,300)
  );
  audit(req, 'PROD_CREATE', nombre);
  res.json({ id: r.lastInsertRowid });
});
app.put('/api/productos/reorder', requireAuth, (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be array' });
  const s = db.prepare('UPDATE productos SET orden=? WHERE id=?');
  order.forEach(({ id, orden }) => { if (validId(id)) s.run(sanitizeInt(orden), id); });
  res.json({ ok: true });
});

app.put('/api/productos/:id', requireAuth, upload.single('foto'), async (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const nombre = sanitize(req.body.nombre, 200);
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
  const ex = get('SELECT foto FROM productos WHERE id=?', req.params.id);
  let foto = ex?.foto || '';
  if (req.file) {
    const ok = await verifyUploadedImage(req.file.path);
    if (!ok) return res.status(400).json({ error: 'Archivo de imagen inválido' });
    safeDeleteFoto(ex?.foto);
    foto = `/uploads/${req.file.filename}`;
  }
  const precio = sanitizeNum(req.body.precio);
  if (precio <= 0) return res.status(400).json({ error: 'Precio inválido' });
  run('UPDATE productos SET nombre=?,descripcion=?,precio=?,precio_especial=?,foto=?,disponible=?,destacado=?,orden=?,alergenos=?,categoria_id=? WHERE id=?',
    nombre, sanitize(req.body.descripcion,500), precio,
    req.body.precio_especial ? sanitizeNum(req.body.precio_especial) : null,
    foto, req.body.disponible==1?1:0, req.body.destacado==1?1:0,
    sanitizeInt(req.body.orden), sanitize(req.body.alergenos,300),
    req.body.categoria_id, req.params.id);
  audit(req, 'PROD_UPDATE', nombre);
  res.json({ ok: true });
});
app.delete('/api/productos/:id', requireAuth, (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const p = get('SELECT foto,nombre FROM productos WHERE id=?', req.params.id);
  safeDeleteFoto(p?.foto);
  run('DELETE FROM productos WHERE id=?', req.params.id);
  audit(req, 'PROD_DELETE', p?.nombre||'');
  res.json({ ok: true });
});
app.post('/api/productos/:id/toggle', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  run('UPDATE productos SET disponible=NOT disponible WHERE id=?', req.params.id);
  res.json({ ok: true });
});

app.post('/api/mesas', requireAuth, (req, res) => {
  const numero = sanitizeInt(req.body.numero);
  if (!numero || numero < 1) return res.status(400).json({ error: 'Número de mesa inválido' });
  const r = run('INSERT INTO mesas(numero,nombre,capacidad,zona) VALUES(?,?,?,?)',
    numero, sanitize(req.body.nombre||`Mesa ${numero}`,100), sanitizeInt(req.body.capacidad,4), sanitize(req.body.zona||'Interior',50));
  audit(req, 'MESA_CREATE', `num=${numero}`);
  res.json({ id: r.lastInsertRowid });
});
app.put('/api/mesas/:id', requireAuth, (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  run('UPDATE mesas SET numero=?,nombre=?,capacidad=?,zona=?,activa=? WHERE id=?',
    sanitizeInt(req.body.numero), sanitize(req.body.nombre,100), sanitizeInt(req.body.capacidad,4),
    sanitize(req.body.zona||'Interior',50), req.body.activa==1?1:0, req.params.id);
  res.json({ ok: true });
});
app.delete('/api/mesas/:id', requireAuth, (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  run('UPDATE mesas SET activa=0 WHERE id=?', req.params.id);
  audit(req, 'MESA_DELETE', `id=${req.params.id}`);
  res.json({ ok: true });
});

// ── ARRANQUE ──────────────────────────────────────────────────────────────────

// ── ESTADÍSTICAS AVANZADAS ────────────────────────────────────────────────────
app.get('/api/stats/7d', (req, res) => {
  const rows = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const fecha = d.toISOString().split('T')[0];
    const s = get(`SELECT
      COALESCE(SUM(CASE WHEN estado='cobrada' THEN total END),0) as total,
      COALESCE(SUM(CASE WHEN estado='cobrada' AND tipo_pago='efectivo' THEN total END),0) as efectivo,
      COALESCE(SUM(CASE WHEN estado='cobrada' AND tipo_pago='tarjeta' THEN total END),0) as tarjeta,
      COUNT(CASE WHEN estado='cobrada' THEN 1 END) as comandas
      FROM comandas WHERE date(cobrada_at)=?`, fecha);
    rows.push({ fecha, ...s });
  }
  res.json(rows);
});

app.get('/api/stats/horas', (req, res) => {
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(req.query.fecha)
    ? req.query.fecha : new Date().toISOString().split('T')[0];
  const rows = all(`
    SELECT strftime('%H',cobrada_at) as hora,
      COUNT(*) as comandas,
      COALESCE(SUM(total),0) as total
    FROM comandas
    WHERE estado='cobrada' AND date(cobrada_at)=?
    GROUP BY hora ORDER BY hora`, fecha);
  res.json(rows);
});

app.get('/api/productos/top', requireAuth, (req, res) => {
  const dias = sanitizeInt(req.query.dias, 7);
  const limit = Math.min(sanitizeInt(req.query.limit, 10), 50);
  const rows = all(`
    SELECT ci.nombre, ci.producto_id,
      SUM(ci.cantidad) as total_unidades,
      SUM(ci.cantidad * ci.precio) as total_euros,
      COUNT(DISTINCT ci.comanda_id) as aparece_en
    FROM comanda_items ci
    JOIN comandas c ON c.id = ci.comanda_id
    WHERE c.estado='cobrada'
      AND c.cobrada_at >= datetime('now','-'||?||' days','localtime')
    GROUP BY ci.nombre
    ORDER BY total_unidades DESC
    LIMIT ?`, dias, limit);
  res.json(rows);
});

// ── EXPORTAR CSV ──────────────────────────────────────────────────────────────
app.get('/api/historial/export', requireAuth, (req, res) => {
  const desde = /^\d{4}-\d{2}-\d{2}$/.test(req.query.desde) ? req.query.desde : new Date().toISOString().split('T')[0];
  const hasta = /^\d{4}-\d{2}-\d{2}$/.test(req.query.hasta) ? req.query.hasta : desde;
  const rows = all(`
    SELECT c.id, m.nombre as mesa, c.camarero, c.personas,
      c.estado, c.tipo_pago, c.total, c.descuento,
      c.created_at, c.cobrada_at, c.notas
    FROM comandas c LEFT JOIN mesas m ON m.id=c.mesa_id
    WHERE c.estado IN ('cobrada','cancelada')
      AND date(c.cobrada_at) BETWEEN ? AND ?
    ORDER BY c.cobrada_at`, desde, hasta);

  let csv = 'ID,Mesa,Camarero,Personas,Estado,Pago,Total,Descuento,Apertura,Cierre,Notas\n';
  rows.forEach(r => {
    csv += [r.id, r.mesa||'', r.camarero||'', r.personas||1, r.estado,
      r.tipo_pago||'', parseFloat(r.total||0).toFixed(2),
      parseFloat(r.descuento||0).toFixed(2),
      r.created_at||'', r.cobrada_at||'',
      (r.notas||'').replace(/,/g,';').replace(/\n/g,' ')
    ].map(v => `"${v}"`).join(',') + '\n';
  });

  audit(req, 'EXPORT_CSV', `${desde} al ${hasta}`);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="comandas_${desde}_${hasta}.csv"`);
  res.send('\uFEFF' + csv); // BOM para Excel
});

// ── TRANSFERIR MESA ───────────────────────────────────────────────────────────
app.put('/api/comandas/:id/transferir', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const { mesa_id_destino } = req.body;
  if (!validId(mesa_id_destino)) return res.status(400).json({ error: 'Mesa destino inválida' });

  const comanda = get("SELECT * FROM comandas WHERE id=? AND estado='abierta'", req.params.id);
  if (!comanda) return res.status(404).json({ error: 'Comanda no encontrada o ya cerrada' });

  const mesaDest = get('SELECT * FROM mesas WHERE id=? AND activa=1', mesa_id_destino);
  if (!mesaDest) return res.status(404).json({ error: 'Mesa destino no existe' });

  // Verificar que la mesa destino esté libre
  const ocupada = get("SELECT id FROM comandas WHERE mesa_id=? AND estado='abierta'", mesa_id_destino);
  if (ocupada) return res.status(409).json({ error: 'La mesa destino ya tiene una comanda abierta' });

  run('UPDATE comandas SET mesa_id=?, mesa_nombre=? WHERE id=?',
    mesa_id_destino, mesaDest.nombre, req.params.id);
  broadcast('mesas', { type: 'transferencia' });
  broadcast('comanda', { id: parseInt(req.params.id) });
  audit(req, 'TRANSFERIR_MESA', `comanda=${req.params.id} → mesa=${mesaDest.nombre}`);
  res.json({ ok: true, mesa: mesaDest.nombre });
});

// ── DIVIDIR CUENTA ────────────────────────────────────────────────────────────
app.post('/api/comandas/:id/dividir', (req, res) => {
  if (!validId(req.params.id)) return sendBadId(res);
  const { item_ids, mesa_id_nueva } = req.body;

  if (!Array.isArray(item_ids) || !item_ids.length)
    return res.status(400).json({ error: 'item_ids requerido' });

  const comanda = get("SELECT * FROM comandas WHERE id=? AND estado='abierta'", req.params.id);
  if (!comanda) return res.status(404).json({ error: 'Comanda no encontrada' });

  // Validar que los items pertenecen a esta comanda
  const validItems = item_ids.filter(id => {
    if (!validId(id)) return false;
    const it = get('SELECT id FROM comanda_items WHERE id=? AND comanda_id=?', id, req.params.id);
    return !!it;
  });
  if (!validItems.length) return res.status(400).json({ error: 'Ningún ítem válido para dividir' });
  const totalItemsEnComanda = get('SELECT COUNT(*) as n FROM comanda_items WHERE comanda_id=?', req.params.id)?.n || 0;
  if (validItems.length >= totalItemsEnComanda)
    return res.status(400).json({ error: 'Debes dejar al menos un artículo en la comanda original' });

  // Crear nueva comanda (misma mesa o mesa especificada)
  const mesaId = validId(mesa_id_nueva) ? mesa_id_nueva : comanda.mesa_id;
  const mesa   = get('SELECT nombre FROM mesas WHERE id=?', mesaId);
  const nueva  = run('INSERT INTO comandas(mesa_id,mesa_nombre,personas,camarero,notas) VALUES(?,?,?,?,?)',
    mesaId, mesa?.nombre||comanda.mesa_nombre, comanda.personas, comanda.camarero, comanda.notas||'');
  const nuevaCmdId = nueva.lastInsertRowid;

  // Mover los ítems seleccionados
  const s = db.prepare('UPDATE comanda_items SET comanda_id=? WHERE id=?');
  validItems.forEach(id => s.run(nuevaCmdId, id));

  broadcast('mesas', { type: 'division' });
  audit(req, 'DIVIDIR_CUENTA', `${req.params.id} → #${nuevaCmdId} (${validItems.length} ítems)`);
  res.json({ ok: true, nueva_comanda_id: nuevaCmdId });
});

// ── BACKUP DE BD ──────────────────────────────────────────────────────────────
app.get('/api/backup', requireAuth, (req, res) => {
  const dbPath = path.join(__dirname, 'db', 'hosteleria.db');
  if (!fs.existsSync(dbPath)) return res.status(404).json({ error: 'BD no encontrada' });
  const fecha = new Date().toISOString().split('T')[0];
  audit(req, 'BACKUP', fecha);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="hosteleria_backup_${fecha}.db"`);
  res.sendFile(dbPath);
});

// ── ZONAS ─────────────────────────────────────────────────────────────────────
app.get('/api/mesas/zonas', (_, res) => {
  const zonas = all('SELECT DISTINCT zona, COUNT(*) as total FROM mesas WHERE activa=1 GROUP BY zona ORDER BY zona');
  res.json(zonas);
});

// Errores no capturados — evitar crash del servidor
process.on('uncaughtException',  err => console.error('[TPV] UncaughtException:', err.message));
process.on('unhandledRejection', r   => console.error('[TPV] UnhandledRejection:', r));

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    const nets = os.networkInterfaces(); let ip = 'localhost';
    for (const ifaces of Object.values(nets)) for (const i of ifaces) if (i.family==='IPv4' && !i.internal) ip = i.address;
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   🍽️  TPV HOSTELERÍA v2 — SEGURO ✓       ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  TPV:    http://localhost:${PORT}/tpv          ║`);
    console.log(`║  Cocina: http://localhost:${PORT}/cocina       ║`);
    console.log(`║  Admin:  http://localhost:${PORT}/admin        ║`);
    console.log(`║  LAN:    http://${ip}:${PORT}           ║`);
    console.log('╠══════════════════════════════════════════╣');
    console.log('║  🔐 PIN admin por defecto: 1234           ║');
    console.log('╚══════════════════════════════════════════╝\n');
  });
}
module.exports = app;
