(() => {
  'use strict';

  /* ---------- i18n ---------- */
  const UI = {
    es: {
      tagline: 'Biblioteca de ejercicios', myRoutine: 'Mi rutina',
      searchPlaceholder: 'Buscar ejercicio, músculo…', allEquipment: 'Todo el equipo',
      emptyTitle: 'No hay ejercicios con esos filtros.', emptyReset: 'Quitar filtros',
      labelTarget: 'Músculo objetivo', labelEquipment: 'Equipo', labelSecondary: 'Músculos secundarios',
      labelSteps: 'Cómo se hace', addToRoutine: 'Añadir a mi rutina', chooseDay: 'Elige un día:',
      routineEmpty: 'Aún no has añadido ejercicios.', footerData: 'Datos de ejercicios',
      footerMedia: 'Imágenes y animaciones', results: (n) => `${n} ejercicios`,
      altToggle: '¿Ocupado? Ver alternativas', altTitle: 'Mismo músculo, otro equipo:',
      altEmpty: 'No hay alternativas con otro equipo para este ejercicio.',
      dayEmpty: 'Sin ejercicios.', swap: 'Cambiar', swapTitle: 'Elige un sustituto para', addedFlash: '¡Añadido!',
      exportBtn: '⬇ Exportar', importBtn: '⬆ Importar', addDayBtn: '+ Añadir', addDayPlaceholder: 'Nuevo día (ej. Piernas)',
      importOk: 'Rutina importada.', importErr: 'Ese archivo no es una rutina válida.',
      removeDayConfirm: '¿Quitar este día y sus ejercicios?',
      offlineToggle: '⬇ Descargar para usar sin conexión',
      offlineHint: 'Elige qué equipo quieres tener disponible offline (así no descargas los 138\u00a0MB completos):',
      offlineGoBtn: 'Descargar seleccionado', offlineGoing: 'Descargando…', offlineDone: '✓ Listo, disponible sin conexión',
      offlineNone: 'Elige al menos un tipo de equipo.',
      series: 'Series', reps: 'Reps', peso: 'Peso',
      progressTitle: 'Tu progreso', progressEmpty: 'Aún no hay historial — regístralo desde Modo entrenamiento.',
      train: '▶ Entrenar', exit: 'Salir', prevExercise: '← Anterior', nextExercise: 'Siguiente →',
      markDone: 'Hecho, descansar', skip: 'Saltar', workoutFinished: '¡Entrenamiento completado!', finishBtn: '✓ Finalizar',
      newProgram: 'Nuevo programa', programName: 'Nombre del programa:', renameProgram: 'Nuevo nombre:',
      deleteProgramConfirm: '¿Borrar este programa entero?', cantDeleteLast: 'Necesitas al menos un programa.',
      set: 'Serie', noDaysYet: 'Este programa aún no tiene días — añade uno desde "Mi rutina".',
    },
    en: {
      tagline: 'Exercise library', myRoutine: 'My routine',
      searchPlaceholder: 'Search exercise, muscle…', allEquipment: 'All equipment',
      emptyTitle: 'No exercises match those filters.', emptyReset: 'Clear filters',
      labelTarget: 'Target muscle', labelEquipment: 'Equipment', labelSecondary: 'Secondary muscles',
      labelSteps: 'How to do it', addToRoutine: 'Add to my routine', chooseDay: 'Pick a day:',
      routineEmpty: 'No exercises added yet.', footerData: 'Exercise data',
      footerMedia: 'Images & animations', results: (n) => `${n} exercises`,
      altToggle: 'Occupied? See alternatives', altTitle: 'Same muscle, different equipment:',
      altEmpty: 'No alternatives with different equipment for this exercise.',
      dayEmpty: 'No exercises.', swap: 'Swap', swapTitle: 'Pick a substitute for', addedFlash: 'Added!',
      exportBtn: '⬇ Export', importBtn: '⬆ Import', addDayBtn: '+ Add', addDayPlaceholder: 'New day (e.g. Legs)',
      importOk: 'Routine imported.', importErr: 'That file is not a valid routine.',
      removeDayConfirm: 'Remove this day and its exercises?',
      offlineToggle: '⬇ Download for offline use',
      offlineHint: 'Pick which equipment you want available offline (so you don\u2019t download the full 138\u00a0MB):',
      offlineGoBtn: 'Download selected', offlineGoing: 'Downloading…', offlineDone: '✓ Done, available offline',
      offlineNone: 'Pick at least one equipment type.',
      series: 'Sets', reps: 'Reps', peso: 'Weight',
      progressTitle: 'Your progress', progressEmpty: 'No history yet — log it from Workout mode.',
      train: '▶ Train', exit: 'Exit', prevExercise: '← Previous', nextExercise: 'Next →',
      markDone: 'Done, rest', skip: 'Skip', workoutFinished: 'Workout complete!', finishBtn: '✓ Finish',
      newProgram: 'New program', programName: 'Program name:', renameProgram: 'New name:',
      deleteProgramConfirm: 'Delete this whole program?', cantDeleteLast: 'You need at least one program.',
      set: 'Set', noDaysYet: 'This program has no days yet — add one from "My routine".',
    },
  };

  const BODY_PART_LABEL = {
    back: { es: 'Espalda', en: 'Back' }, cardio: { es: 'Cardio', en: 'Cardio' },
    chest: { es: 'Pecho', en: 'Chest' }, 'lower arms': { es: 'Antebrazos', en: 'Lower arms' },
    'lower legs': { es: 'Pantorrillas', en: 'Lower legs' }, neck: { es: 'Cuello', en: 'Neck' },
    shoulders: { es: 'Hombros', en: 'Shoulders' }, 'upper arms': { es: 'Brazos', en: 'Upper arms' },
    'upper legs': { es: 'Piernas', en: 'Upper legs' }, waist: { es: 'Abdomen', en: 'Waist' },
  };
  const PLATE_COLOR = {
    back: 'var(--plate-back)', cardio: 'var(--plate-cardio)', chest: 'var(--plate-chest)',
    'lower arms': 'var(--plate-lower-arms)', 'lower legs': 'var(--plate-lower-legs)',
    neck: 'var(--plate-neck)', shoulders: 'var(--plate-shoulders)',
    'upper arms': 'var(--plate-upper-arms)', 'upper legs': 'var(--plate-upper-legs)',
    waist: 'var(--plate-waist)',
  };
  const EQUIPMENT_LABEL = {
    assisted: { es: 'Asistido', en: 'Assisted' }, band: { es: 'Banda elástica', en: 'Band' },
    barbell: { es: 'Barra', en: 'Barbell' }, 'body weight': { es: 'Peso corporal', en: 'Body weight' },
    'bosu ball': { es: 'Bosu', en: 'Bosu ball' }, cable: { es: 'Polea', en: 'Cable' },
    dumbbell: { es: 'Mancuerna', en: 'Dumbbell' }, 'elliptical machine': { es: 'Elíptica', en: 'Elliptical machine' },
    'ez barbell': { es: 'Barra Z', en: 'EZ barbell' }, hammer: { es: 'Máquina Hammer', en: 'Hammer' },
    kettlebell: { es: 'Pesa rusa', en: 'Kettlebell' }, 'leverage machine': { es: 'Máquina', en: 'Machine' },
    'medicine ball': { es: 'Balón medicinal', en: 'Medicine ball' }, 'olympic barbell': { es: 'Barra olímpica', en: 'Olympic barbell' },
    'resistance band': { es: 'Banda de resistencia', en: 'Resistance band' }, roller: { es: 'Rodillo', en: 'Roller' },
    rope: { es: 'Cuerda', en: 'Rope' }, 'skierg machine': { es: 'Máquina SkiErg', en: 'SkiErg machine' },
    'sled machine': { es: 'Trineo', en: 'Sled machine' }, 'smith machine': { es: 'Máquina Smith', en: 'Smith machine' },
    'stability ball': { es: 'Fitball', en: 'Stability ball' }, 'stationary bike': { es: 'Bici estática', en: 'Stationary bike' },
    'stepmill machine': { es: 'Escaladora', en: 'Stepmill machine' }, tire: { es: 'Neumático', en: 'Tire' },
    'trap bar': { es: 'Barra hexagonal', en: 'Trap bar' }, 'upper body ergometer': { es: 'Ergómetro de brazos', en: 'Upper body ergometer' },
    weighted: { es: 'Con peso añadido', en: 'Weighted' }, 'wheel roller': { es: 'Rueda abdominal', en: 'Wheel roller' },
  };
  const EQUIPMENT_PRIORITY = ['leverage machine', 'cable', 'barbell', 'dumbbell'];
  const TARGET_LABEL = {
    abductors: { es: 'Abductores', en: 'Abductors' }, abs: { es: 'Abdominales', en: 'Abs' },
    adductors: { es: 'Aductores', en: 'Adductors' }, biceps: { es: 'Bíceps', en: 'Biceps' },
    calves: { es: 'Gemelos', en: 'Calves' }, 'cardiovascular system': { es: 'Sistema cardiovascular', en: 'Cardiovascular system' },
    delts: { es: 'Deltoides', en: 'Delts' }, forearms: { es: 'Antebrazos', en: 'Forearms' },
    glutes: { es: 'Glúteos', en: 'Glutes' }, hamstrings: { es: 'Isquiotibiales', en: 'Hamstrings' },
    lats: { es: 'Dorsales', en: 'Lats' }, 'levator scapulae': { es: 'Elevador de la escápula', en: 'Levator scapulae' },
    pectorals: { es: 'Pectorales', en: 'Pectorals' }, quads: { es: 'Cuádriceps', en: 'Quads' },
    'serratus anterior': { es: 'Serrato anterior', en: 'Serratus anterior' }, spine: { es: 'Columna', en: 'Spine' },
    traps: { es: 'Trapecios', en: 'Traps' }, triceps: { es: 'Tríceps', en: 'Triceps' },
    'upper back': { es: 'Espalda alta', en: 'Upper back' },
  };
  const label = (map, key) => (map[key] ? map[key][state.lang] : key);
  const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  let saveWarned = false;
  function safeSave(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('No se pudo guardar en localStorage:', err);
      if (!saveWarned) {
        saveWarned = true;
        showToast(UI[state.lang].saveError);
      }
      return false;
    }
  }
  function showToast(msg) {
    let t = $('#toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast'; t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._tid);
    showToast._tid = setTimeout(() => t.classList.remove('show'), 4000);
  }

  /* ---------- Data model ----------
     state.programs = [{ id, name: {es,en}|string, days: [{id,name,exercises:[{id,series,reps,peso}]}] }]
     state.activeProgramId
     state.history = { [exerciseId]: [{date:'YYYY-MM-DD', peso, reps}] }               */
  function dayName(day) { return typeof day.name === 'string' ? day.name : day.name[state.lang]; }
  function isValidDays(days) {
    return Array.isArray(days) && days.every(d => d && typeof d.id !== 'undefined' && d.name && Array.isArray(d.exercises)
      && d.exercises.every(x => x && typeof x.id !== 'undefined'));
  }
  function isValidPrograms(data) {
    return Array.isArray(data) && data.every(p => p && typeof p.id !== 'undefined' && p.name && isValidDays(p.days));
  }
  function loadStoredPrograms() {
    try {
      const raw = JSON.parse(localStorage.getItem('agoitzgym_programs') || 'null');
      if (isValidPrograms(raw)) return raw;
    } catch {}
    try {
      // migracion desde el formato antiguo de una sola rutina (sin programas)
      const old = JSON.parse(localStorage.getItem('agoitzgym_routine') || 'null');
      if (isValidDays(old)) return [{ id: 'default', name: { es: 'Mi rutina', en: 'My routine' }, days: old }];
    } catch {}
    return null;
  }
  function loadHistory() {
    try {
      const raw = JSON.parse(localStorage.getItem('agoitzgym_history') || 'null');
      if (raw && typeof raw === 'object') return raw;
    } catch {}
    return {};
  }

  /* ---------- State ---------- */
  const state = {
    lang: 'es',
    all: [], filtered: [],
    activeParts: new Set(), activeEquipment: '', query: '',
    shown: 0, pageSize: 30,
    programs: [], activeProgramId: null,
    history: loadHistory(),
  };

  const $ = (sel) => document.querySelector(sel);
  const grid = $('#grid'), sentinel = $('#sentinel');

  grid.innerHTML = Array.from({ length: 12 }).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-media"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>`).join('');

  /* ---------- Load data ---------- */
  const storedPrograms = loadStoredPrograms();
  Promise.all([
    fetch('data.json').then(r => r.json()),
    storedPrograms ? Promise.resolve(null) : fetch('default-routine.json').then(r => r.ok ? r.json() : null).catch(() => null),
  ]).then(([data, defaultDays]) => {
    state.all = data;
    if (storedPrograms) {
      state.programs = storedPrograms;
    } else if (isValidDays(defaultDays)) {
      state.programs = [{ id: 'default', name: { es: 'Mi rutina', en: 'My routine' }, days: defaultDays }];
    } else {
      state.programs = [{ id: 'default', name: { es: 'Mi rutina', en: 'My routine' }, days: [] }];
    }
    state.activeProgramId = state.programs[0].id;
    buildEquipmentOptions();
    buildPlateRack();
    buildOfflineChecks();
    applyFilters();
    updateRoutineBadge();
  }).catch(err => {
    grid.innerHTML = `<p style="color:var(--muted)">No se pudo cargar el catálogo de ejercicios.</p>`;
    console.error(err);
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  function buildEquipmentOptions() {
    const found = [...new Set(state.all.map(e => e.equipment))];
    const priority = EQUIPMENT_PRIORITY.filter(v => found.includes(v));
    const rest = found.filter(v => !EQUIPMENT_PRIORITY.includes(v)).sort();
    const sel = $('#equipmentSelect');
    [...priority, null, ...rest].forEach(v => {
      if (v === null) { sel.appendChild(document.createElement('hr')); return; }
      const opt = document.createElement('option');
      opt.value = v; opt.textContent = label(EQUIPMENT_LABEL, v);
      if (priority.includes(v)) opt.className = 'opt-priority';
      sel.appendChild(opt);
    });
    sel.addEventListener('change', () => { state.activeEquipment = sel.value; applyFilters(); });
  }

  function buildPlateRack() {
    const parts = [...new Set(state.all.map(e => e.body_part))];
    const order = ['back','cardio','chest','lower arms','lower legs','neck','shoulders','upper arms','upper legs','waist'];
    parts.sort((a,b) => order.indexOf(a) - order.indexOf(b));
    const rack = $('#plateRack');
    rack.innerHTML = '';
    parts.forEach(p => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'plate-chip'; btn.dataset.part = p;
      btn.innerHTML = `<span class="dot" style="background:${PLATE_COLOR[p]}"></span><span class="chip-label">${label(BODY_PART_LABEL, p)}</span>`;
      btn.addEventListener('click', () => {
        state.activeParts.has(p) ? state.activeParts.delete(p) : state.activeParts.add(p);
        btn.classList.toggle('active');
        applyFilters();
      });
      rack.appendChild(btn);
    });
  }

  /* ---------- Filtering & rendering ---------- */
  function applyFilters() {
    const q = state.query.trim().toLowerCase();
    state.filtered = state.all.filter(e => {
      if (state.activeParts.size && !state.activeParts.has(e.body_part)) return false;
      if (state.activeEquipment && e.equipment !== state.activeEquipment) return false;
      if (q && !(e.name.toLowerCase().includes(q) || e.target.toLowerCase().includes(q) || e.muscle_group.toLowerCase().includes(q))) return false;
      return true;
    });
    state.shown = 0;
    grid.innerHTML = '';
    $('#emptyState').hidden = state.filtered.length > 0;
    $('#resultCount').textContent = UI[state.lang].results(state.filtered.length);
    $('#clearAllChip').hidden = !(state.activeParts.size || state.activeEquipment || state.query);
    if (state.filtered.length) renderMore();
  }

  function renderMore() {
    const next = state.filtered.slice(state.shown, state.shown + state.pageSize);
    next.forEach((e, i) => {
      const card = cardFor(e);
      if (state.shown === 0) card.style.animationDelay = Math.min(i, 12) * 25 + 'ms';
      else card.style.animation = 'none';
      grid.appendChild(card);
    });
    state.shown += next.length;
  }

  function cardFor(e) {
    const card = document.createElement('button');
    card.type = 'button'; card.className = 'card';
    card.style.borderBottomColor = PLATE_COLOR[e.body_part];
    card.innerHTML = `
      <div class="card-media">
        <span class="card-chip" style="background:${PLATE_COLOR[e.body_part]}"></span>
        <img src="${e.image}" alt="" loading="lazy">
        <video class="gif" data-src="${e.gif}" muted loop playsinline preload="none"></video>
        <span class="play-hint" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M6 4l14 8-14 8V4z" fill="#edeae3"/></svg>
        </span>
      </div>
      <div class="card-info">
        <span class="card-name">${e.name}</span>
        <span class="card-sub">${label(BODY_PART_LABEL, e.body_part)} · ${label(EQUIPMENT_LABEL, e.equipment)}</span>
      </div>`;
    const gifImg = card.querySelector('.gif');
    let loaded = false;
    const loadGif = () => { if (!loaded) { gifImg.src = gifImg.dataset.src; gifImg.play().catch(() => {}); loaded = true; } };
    card.addEventListener('mouseenter', loadGif);
    card.addEventListener('focus', loadGif);
    card.addEventListener('click', () => openModal(e));
    return card;
  }

  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && state.shown < state.filtered.length) renderMore();
  }, { rootMargin: '400px' }).observe(sentinel);

  $('#searchInput').addEventListener('input', (e) => { state.query = e.target.value; applyFilters(); });
  function clearAllFilters() {
    state.activeParts.clear(); state.activeEquipment = ''; state.query = '';
    $('#searchInput').value = ''; $('#equipmentSelect').value = '';
    document.querySelectorAll('.plate-chip.active').forEach(b => b.classList.remove('active'));
    applyFilters();
  }
  $('#resetFilters').addEventListener('click', clearAllFilters);
  $('#clearAllChip').addEventListener('click', clearAllFilters);

  /* ---------- Alternatives ---------- */
  function getAlternatives(exercise, limit = 4) {
    return state.all
      .filter(e => e.id !== exercise.id && e.target === exercise.target && e.equipment !== exercise.equipment)
      .slice(0, limit);
  }
  function miniCard(e, onClick) {
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'mini-card';
    el.innerHTML = `
      <img src="${e.image}" alt="" loading="lazy">
      <span class="mini-name">${e.name}</span>
      <span class="mini-eq">${label(EQUIPMENT_LABEL, e.equipment)}</span>`;
    el.addEventListener('click', () => onClick(e));
    return el;
  }

  /* ---------- Progress history ---------- */
  function parseNum(str) {
    if (!str) return null;
    const m = String(str).replace(',', '.').match(/[\d.]+/);
    return m ? parseFloat(m[0]) : null;
  }
  function logHistory(exerciseId, entry) {
    if (!state.history[exerciseId]) state.history[exerciseId] = [];
    const today = new Date().toISOString().slice(0, 10);
    const list = state.history[exerciseId].filter(h => h.date !== today);
    list.push({ date: today, peso: entry.peso, reps: entry.reps });
    list.sort((a, b) => a.date.localeCompare(b.date));
    state.history[exerciseId] = list;
    localStorage.setItem('agoitzgym_history', JSON.stringify(state.history));
  }

  function renderProgressChart(exerciseId) {
    const section = $('#progressSection');
    const entries = (state.history[exerciseId] || []).filter(h => parseNum(h.peso) !== null);
    if (!entries.length) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    const pts = entries.map(h => ({ date: h.date, v: parseNum(h.peso) }));
    const W = 320, H = 100, pad = 18;
    const min = Math.min(...pts.map(p => p.v)), max = Math.max(...pts.map(p => p.v));
    const span = max - min || 1;
    const x = (i) => pad + (i / Math.max(pts.length - 1, 1)) * (W - pad * 2);
    const y = (v) => H - pad - ((v - min) / span) * (H - pad * 2);
    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
    const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="3.2" fill="var(--accent)"/>`).join('');
    $('#progressChart').innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" class="progress-svg">
        <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        ${dots}
      </svg>
      <div class="progress-labels"><span>${pts[0].date}</span><span>${esc(entries[entries.length-1].peso)}</span><span>${pts[pts.length-1].date}</span></div>`;
  }

  /* ---------- Modal ---------- */
  const backdrop = $('#modalBackdrop');
  let currentExercise = null;

  function openModal(e) {
    currentExercise = e;
    $('#modalGif').src = e.gif;
    $('#modalGif').play().catch(() => {});
    $('#modalChip').textContent = label(BODY_PART_LABEL, e.body_part);
    $('#modalChip').style.background = PLATE_COLOR[e.body_part];
    $('#modalTitle').textContent = e.name;
    $('#modalTarget').textContent = label(TARGET_LABEL, e.target);
    $('#modalEquipment').textContent = label(EQUIPMENT_LABEL, e.equipment);
    $('#modalSecondary').textContent = e.secondary_muscles.map(m => label(TARGET_LABEL, m)).join(', ') || '—';
    const steps = e.steps[state.lang] || e.steps.en || [];
    $('#modalSteps').innerHTML = steps.map(s => `<li>${s}</li>`).join('');

    $('#modalDayPicker').hidden = true;
    $('#modalAddBtn').textContent = UI[state.lang].addToRoutine;
    $('#altList').hidden = true;
    $('#altToggle').textContent = UI[state.lang].altToggle;
    renderProgressChart(e.id);
    backdrop.hidden = false;
  }
  function closeModal() { backdrop.hidden = true; currentExercise = null; }
  $('#modalClose').addEventListener('click', closeModal);
  backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) closeModal(); });
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    closeModal(); closeRoutine();
    document.querySelectorAll('.swap-pop').forEach(p => p.remove());
    if (!$('#workoutScreen').hidden) exitWorkout();
  });

  function renderDayPicker(container, onPick) {
    const days = activeProgram().days;
    if (!days.length) {
      container.innerHTML = `<p class="day-picker-label">${UI[state.lang].noDaysYet}</p>`;
      return;
    }
    container.innerHTML = `<p class="day-picker-label">${UI[state.lang].chooseDay}</p>` +
      days.map(d => `<button type="button" class="day-chip" data-day="${d.id}">${esc(dayName(d))}</button>`).join('');
    container.querySelectorAll('.day-chip').forEach(btn => {
      btn.addEventListener('click', () => onPick(btn.dataset.day));
    });
  }

  $('#modalAddBtn').addEventListener('click', () => {
    const picker = $('#modalDayPicker');
    if (picker.hidden) {
      renderDayPicker(picker, (dayId) => {
        addToRoutine(dayId, currentExercise.id);
        $('#modalAddBtn').textContent = UI[state.lang].addedFlash;
        picker.hidden = true;
        setTimeout(() => { if (currentExercise) $('#modalAddBtn').textContent = UI[state.lang].addToRoutine; }, 1200);
      });
      picker.hidden = false;
    } else {
      picker.hidden = true;
    }
  });

  $('#altToggle').addEventListener('click', () => {
    const list = $('#altList');
    if (!list.hidden) { list.hidden = true; return; }
    const alts = getAlternatives(currentExercise);
    list.innerHTML = '';
    if (!alts.length) {
      list.innerHTML = `<p class="alt-empty">${UI[state.lang].altEmpty}</p>`;
    } else {
      const title = document.createElement('p');
      title.className = 'alt-list-title'; title.textContent = UI[state.lang].altTitle;
      list.appendChild(title);
      const row = document.createElement('div'); row.className = 'mini-row';
      alts.forEach(a => row.appendChild(miniCard(a, openModal)));
      list.appendChild(row);
    }
    list.hidden = false;
  });

  /* ---------- Programs ---------- */
  function activeProgram() { return state.programs.find(p => p.id === state.activeProgramId) || state.programs[0]; }
  function saveProgramsState() { localStorage.setItem('agoitzgym_programs', JSON.stringify(state.programs)); }

  function renderProgramSelect() {
    const sel = $('#programSelect');
    sel.innerHTML = state.programs.map(p => `<option value="${p.id}">${esc(dayName(p))}</option>`).join('');
    sel.value = state.activeProgramId;
  }
  $('#programSelect').addEventListener('change', (ev) => {
    state.activeProgramId = ev.target.value;
    renderRoutineDays();
  });
  $('#programNewBtn').addEventListener('click', () => {
    const name = prompt(UI[state.lang].programName);
    if (!name || !name.trim()) return;
    const p = { id: 'prog_' + Date.now(), name: name.trim(), days: [] };
    state.programs.push(p);
    state.activeProgramId = p.id;
    saveProgramsState();
    renderProgramSelect(); renderRoutineDays(); updateRoutineBadge();
  });
  $('#programRenameBtn').addEventListener('click', () => {
    const p = activeProgram();
    const name = prompt(UI[state.lang].renameProgram, dayName(p));
    if (!name || !name.trim()) return;
    p.name = name.trim();
    saveProgramsState(); renderProgramSelect();
  });
  $('#programDeleteBtn').addEventListener('click', () => {
    if (state.programs.length <= 1) { alert(UI[state.lang].cantDeleteLast); return; }
    if (!confirm(UI[state.lang].deleteProgramConfirm)) return;
    state.programs = state.programs.filter(p => p.id !== state.activeProgramId);
    state.activeProgramId = state.programs[0].id;
    saveProgramsState();
    renderProgramSelect(); renderRoutineDays(); updateRoutineBadge();
  });

  /* ---------- Routine (days within active program) ---------- */
  function saveRoutine() { saveProgramsState(); }
  function findDay(dayId) { return activeProgram().days.find(d => d.id === dayId); }

  function addToRoutine(dayId, id) {
    const day = findDay(dayId); if (!day) return;
    if (!day.exercises.some(x => x.id === id)) day.exercises.push({ id, series: '4', reps: '8-12', peso: '' });
    saveRoutine();
    updateRoutineBadge();
    if (!$('#routineBackdrop').hidden) renderRoutineDays();
  }
  function removeFromRoutine(dayId, id) {
    const day = findDay(dayId); if (!day) return;
    day.exercises = day.exercises.filter(x => x.id !== id);
    saveRoutine();
    updateRoutineBadge();
    renderRoutineDays();
  }
  function swapInRoutine(dayId, oldId, newId) {
    const day = findDay(dayId); if (!day) return;
    const i = day.exercises.findIndex(x => x.id === oldId);
    if (i !== -1) day.exercises[i] = { ...day.exercises[i], id: newId };
    saveRoutine();
    renderRoutineDays();
  }
  function updateExerciseField(dayId, id, field, value) {
    const day = findDay(dayId); if (!day) return;
    const item = day.exercises.find(x => x.id === id); if (!item) return;
    item[field] = value;
    saveRoutine();
  }
  function removeDay(dayId) {
    if (!confirm(UI[state.lang].removeDayConfirm)) return;
    const p = activeProgram();
    p.days = p.days.filter(d => d.id !== dayId);
    saveRoutine(); updateRoutineBadge(); renderRoutineDays();
  }
  function updateRoutineBadge() {
    const total = activeProgram().days.reduce((n, d) => n + d.exercises.length, 0);
    $('#routineCount').textContent = total;
  }

  function statField(dayId, exId, field, value) {
    return `<label class="stat-field"><span>${UI[state.lang][field]}</span>
      <input type="text" class="stat-input" data-day="${dayId}" data-ex="${exId}" data-field="${field}" value="${esc(value)}"></label>`;
  }

  function renderRoutineDays() {
    renderProgramSelect();
    const container = $('#routineDays');
    const days = activeProgram().days;
    $('#routineEmpty').hidden = days.length > 0;
    container.innerHTML = '';
    days.forEach(d => {
      const section = document.createElement('div');
      section.className = 'day-section';
      section.innerHTML = `<h3 class="day-heading">${esc(dayName(d))} <span class="day-count">${d.exercises.length}</span>
          ${d.exercises.length ? `<button type="button" class="train-btn">${UI[state.lang].train}</button>` : ''}
          <button type="button" class="day-remove" aria-label="Quitar día">✕</button></h3>`;
      section.querySelector('.day-remove').addEventListener('click', () => removeDay(d.id));
      const trainBtn = section.querySelector('.train-btn');
      if (trainBtn) trainBtn.addEventListener('click', () => startWorkout(d.id));
      if (!d.exercises.length) {
        const p = document.createElement('p');
        p.className = 'day-empty'; p.textContent = UI[state.lang].dayEmpty;
        section.appendChild(p);
      } else {
        const list = document.createElement('ul');
        list.className = 'routine-list';
        d.exercises.forEach(item => {
          const ex = state.all.find(e => e.id === item.id);
          if (!ex) return;
          const li = document.createElement('li');
          li.className = 'routine-item';
          li.innerHTML = `
            <div class="ri-top">
              <img src="${ex.image}" alt="" loading="lazy">
              <span class="ri-name">${ex.name}</span>
              <button type="button" class="ri-swap" title="${UI[state.lang].swap}">⇄</button>
              <button type="button" class="ri-remove" aria-label="Quitar">✕</button>
            </div>
            <div class="ri-stats">
              ${statField(d.id, item.id, 'series', item.series || '')}
              ${statField(d.id, item.id, 'reps', item.reps || '')}
              ${statField(d.id, item.id, 'peso', item.peso || '')}
            </div>`;
          li.querySelector('.ri-remove').addEventListener('click', () => removeFromRoutine(d.id, item.id));
          li.querySelector('.ri-swap').addEventListener('click', (ev) => openSwapPicker(ev.currentTarget, d.id, ex));
          li.querySelectorAll('.stat-input').forEach(inp => {
            inp.addEventListener('change', () => updateExerciseField(d.id, item.id, inp.dataset.field, inp.value));
          });
          list.appendChild(li);
        });
        section.appendChild(list);
      }
      container.appendChild(section);
    });
  }

  function openSwapPicker(anchorBtn, dayId, exercise) {
    document.querySelectorAll('.swap-pop').forEach(p => p.remove());
    const alts = getAlternatives(exercise);
    const pop = document.createElement('div');
    pop.className = 'swap-pop';
    if (!alts.length) {
      pop.innerHTML = `<p class="alt-empty">${UI[state.lang].altEmpty}</p>`;
    } else {
      pop.innerHTML = `<p class="swap-pop-title">${UI[state.lang].swapTitle} ${esc(exercise.name)}</p>`;
      const row = document.createElement('div'); row.className = 'mini-row';
      alts.forEach(a => row.appendChild(miniCard(a, (picked) => {
        swapInRoutine(dayId, exercise.id, picked.id);
        pop.remove();
      })));
      pop.appendChild(row);
    }
    anchorBtn.closest('.routine-item').appendChild(pop);
    setTimeout(() => document.addEventListener('click', function onDoc(ev) {
      if (!pop.contains(ev.target) && ev.target !== anchorBtn) { pop.remove(); document.removeEventListener('click', onDoc); }
    }), 0);
  }

  function openRoutine() { renderRoutineDays(); $('#routineBackdrop').hidden = false; }
  function closeRoutine() { $('#routineBackdrop').hidden = true; }
  $('#routineBtn').addEventListener('click', openRoutine);
  $('#routineClose').addEventListener('click', closeRoutine);
  $('#routineBackdrop').addEventListener('click', (ev) => { if (ev.target.id === 'routineBackdrop') closeRoutine(); });

  $('#addDayForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const input = $('#addDayInput');
    const name = input.value.trim();
    if (!name) return;
    activeProgram().days.push({ id: 'custom_' + Date.now(), name, exercises: [] });
    input.value = '';
    saveRoutine();
    renderRoutineDays();
  });

  /* ---------- Export / Import ---------- */
  $('#exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.programs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mis-programas-agoitz-gym.json'; a.click();
    URL.revokeObjectURL(url);
  });
  $('#importBtn').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', async (ev) => {
    const file = ev.target.files[0]; ev.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const programs = isValidPrograms(data) ? data : (isValidDays(data) ? [{ id: 'default', name: { es: 'Mi rutina', en: 'My routine' }, days: data }] : null);
      if (!programs) throw new Error('bad shape');
      state.programs = programs;
      state.activeProgramId = programs[0].id;
      saveProgramsState(); updateRoutineBadge(); renderRoutineDays();
      alert(UI[state.lang].importOk);
    } catch {
      alert(UI[state.lang].importErr);
    }
  });

  /* ---------- Offline selective download ---------- */
  function buildOfflineChecks() {
    const found = [...new Set(state.all.map(e => e.equipment))];
    const priority = EQUIPMENT_PRIORITY.filter(v => found.includes(v));
    const rest = found.filter(v => !EQUIPMENT_PRIORITY.includes(v)).sort();
    const box = $('#offlineChecks');
    box.innerHTML = [...priority, ...rest].map(v => `
      <label class="offline-check">
        <input type="checkbox" value="${v}" ${priority.includes(v) ? 'checked' : ''}>
        ${label(EQUIPMENT_LABEL, v)}
      </label>`).join('');
  }

  $('#offlineToggle').addEventListener('click', () => {
    $('#offlinePanel').hidden = !$('#offlinePanel').hidden;
  });

  $('#offlineGoBtn').addEventListener('click', async () => {
    const chosen = [...document.querySelectorAll('#offlineChecks input:checked')].map(c => c.value);
    if (!chosen.length) { alert(UI[state.lang].offlineNone); return; }
    const matched = state.all.filter(e => chosen.includes(e.equipment));
    const urls = [];
    matched.forEach(e => { urls.push(e.image); urls.push(e.gif); });

    const btn = $('#offlineGoBtn');
    btn.disabled = true; btn.textContent = UI[state.lang].offlineGoing;
    $('#offlineProgress').hidden = false;
    const fill = $('#offlineBarFill'), lbl = $('#offlineProgressLabel');
    fill.style.width = '0%'; lbl.textContent = `0 / ${urls.length}`;

    let done = 0;
    const worker = (url) => fetch(url).then(() => {
      done++;
      const pct = Math.round((done / urls.length) * 100);
      fill.style.width = pct + '%';
      lbl.textContent = `${done} / ${urls.length}`;
    });
    const limit = 6;
    let i = 0;
    async function pump() {
      while (i < urls.length) { const u = urls[i++]; await worker(u).catch(() => {}); }
    }
    await Promise.all(Array.from({ length: limit }, pump));

    btn.disabled = false; btn.textContent = UI[state.lang].offlineDone;
    setTimeout(() => { btn.textContent = UI[state.lang].offlineGoBtn; }, 2500);
  });

  /* ---------- Workout mode ---------- */
  const workout = { dayId: null, index: 0, setsDone: [], restInterval: null };

  function startWorkout(dayId) {
    workout.dayId = dayId; workout.index = 0;
    closeRoutine();
    $('#workoutScreen').hidden = false;
    document.body.style.overflow = 'hidden';
    renderWorkoutExercise();
    $('#workoutExit').focus();
  }
  function exitWorkout() {
    stopRestTimer();
    $('#workoutScreen').hidden = true;
    document.body.style.overflow = '';
    updateRoutineBadge();
    $('#routineBtn').focus();
  }
  $('#workoutExit').addEventListener('click', exitWorkout);

  $('#workoutScreen').addEventListener('keydown', (ev) => {
    if (ev.key !== 'Tab') return;
    const focusable = [...$('#workoutScreen').querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])')]
      .filter(el => el.offsetParent !== null && !el.disabled);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  });

  function currentWorkoutItem() {
    const day = findDay(workout.dayId);
    if (!day) return null;
    return { day, item: day.exercises[workout.index] };
  }

  function renderWorkoutExercise() {
    const ctx = currentWorkoutItem();
    if (!ctx || !ctx.item) { finishWorkout(); return; }
    const { day, item } = ctx;
    const ex = state.all.find(e => e.id === item.id);
    if (!ex) { workout.index++; renderWorkoutExercise(); return; }

    $('#workoutProgress').textContent = `${workout.index + 1} / ${day.exercises.length}`;
    $('#workoutDayName').textContent = dayName(day);
    $('#workoutGif').src = ex.gif;
    $('#workoutGif').play().catch(() => {});
    $('#workoutExName').textContent = ex.name;
    $('#workoutTarget').textContent = `${label(BODY_PART_LABEL, ex.body_part)} · ${label(TARGET_LABEL, ex.target)}`;
    $('#workoutReps').value = item.reps || '';
    $('#workoutPeso').value = item.peso || '';

    const setCount = Math.max(1, Math.min(12, parseInt(parseNum(item.series)) || 1));
    $('#workoutSets').innerHTML = Array.from({ length: setCount }).map((_, i) =>
      `<button type="button" class="set-dot" data-set="${i}">${i + 1}</button>`).join('');
    $('#workoutSets').querySelectorAll('.set-dot').forEach(btn => {
      btn.addEventListener('click', () => btn.classList.toggle('done'));
    });
    stopRestTimer();
    $('#workoutPrev').disabled = workout.index === 0;
    const isLast = workout.index === day.exercises.length - 1;
    $('#workoutNext').textContent = isLast ? UI[state.lang].finishBtn : UI[state.lang].nextExercise;
    $('#workoutNext').dataset.last = isLast ? '1' : '';
  }

  function saveWorkoutInputs() {
    const ctx = currentWorkoutItem();
    if (!ctx || !ctx.item) return;
    ctx.item.reps = $('#workoutReps').value;
    ctx.item.peso = $('#workoutPeso').value;
    saveRoutine();
  }

  $('#workoutNext').addEventListener('click', (ev) => {
    saveWorkoutInputs();
    if (ev.currentTarget.dataset.last === '1') { finishWorkout(); return; }
    const ctx = currentWorkoutItem();
    if (ctx && ctx.day) { workout.index = Math.min(workout.index + 1, ctx.day.exercises.length - 1); }
    renderWorkoutExercise();
  });
  $('#workoutPrev').addEventListener('click', () => {
    saveWorkoutInputs();
    workout.index = Math.max(workout.index - 1, 0);
    renderWorkoutExercise();
  });
  $('#workoutDone').addEventListener('click', () => {
    saveWorkoutInputs();
    const ctx = currentWorkoutItem();
    if (ctx && ctx.item) logHistory(ctx.item.id, { peso: ctx.item.peso, reps: ctx.item.reps });
    startRestTimer(90);
  });

  function startRestTimer(seconds) {
    let remaining = seconds;
    const ring = $('#restRingProgress');
    const circumference = 2 * Math.PI * 45;
    ring.style.strokeDasharray = circumference;
    $('#restTimer').hidden = false;
    const tick = () => {
      $('#restTimerLabel').textContent = remaining;
      ring.style.strokeDashoffset = circumference * (1 - remaining / seconds);
      if (remaining <= 0) { stopRestTimer(); return; }
      remaining--;
    };
    tick();
    workout.restInterval = setInterval(tick, 1000);
  }
  function stopRestTimer() {
    if (workout.restInterval) clearInterval(workout.restInterval);
    workout.restInterval = null;
    $('#restTimer').hidden = true;
  }
  $('#restSkip').addEventListener('click', stopRestTimer);
  document.querySelectorAll('.rest-timer-btns [data-adjust]').forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = parseInt(btn.dataset.adjust, 10);
      const lbl = $('#restTimerLabel');
      const next = Math.max(0, parseInt(lbl.textContent, 10) + delta);
      stopRestTimer();
      startRestTimer(next || 1);
    });
  });

  function finishWorkout() {
    alert(UI[state.lang].workoutFinished);
    exitWorkout();
  }

  /* ---------- Language ---------- */
  function setLanguage(lang) {
    state.lang = lang;
    document.documentElement.lang = lang;
    $('#langBtn').textContent = lang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (UI[lang][el.dataset.i18n] !== undefined) el.textContent = UI[lang][el.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = UI[lang][el.dataset.i18nPlaceholder];
    });
    $('#equipmentSelect').firstElementChild.textContent = UI[lang].allEquipment;
    document.querySelectorAll('#equipmentSelect option:not(:first-child)').forEach(opt => {
      opt.textContent = label(EQUIPMENT_LABEL, opt.value);
    });
    document.querySelectorAll('.plate-chip .chip-label').forEach(el => {
      const part = el.closest('.plate-chip').dataset.part;
      el.textContent = label(BODY_PART_LABEL, part);
    });
    $('#resultCount').textContent = UI[lang].results(state.filtered.length);
    document.querySelectorAll('.card').forEach((card, i) => {
      const e = state.filtered[i]; if (!e) return;
      card.querySelector('.card-sub').textContent = `${label(BODY_PART_LABEL, e.body_part)} · ${label(EQUIPMENT_LABEL, e.equipment)}`;
    });
    if (currentExercise && !backdrop.hidden) openModal(currentExercise);
    if (!$('#routineBackdrop').hidden) renderRoutineDays();
  }
  $('#langBtn').addEventListener('click', () => setLanguage(state.lang === 'es' ? 'en' : 'es'));

})();
