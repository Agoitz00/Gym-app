(() => {
  'use strict';

  /* ---------- i18n ---------- */
  const UI = {
    es: {
      tagline: 'Biblioteca de ejercicios', myRoutine: 'Mi rutina',
      searchPlaceholder: 'Buscar ejercicio, músculo…', allEquipment: 'Todo el equipo',
      emptyTitle: 'No hay ejercicios con esos filtros.', emptyReset: 'Quitar filtros',
      labelTarget: 'Músculo objetivo', labelEquipment: 'Equipo', labelSecondary: 'Músculos secundarios',
      labelSteps: 'Cómo se hace', addToRoutine: 'Añadir a mi rutina', addedToRoutine: 'Añadido ✓',
      routineEmpty: 'Aún no has añadido ejercicios.', footerData: 'Datos de ejercicios',
      footerMedia: 'Imágenes y animaciones', results: (n) => `${n} ejercicios`,
    },
    en: {
      tagline: 'Exercise library', myRoutine: 'My routine',
      searchPlaceholder: 'Search exercise, muscle…', allEquipment: 'All equipment',
      emptyTitle: 'No exercises match those filters.', emptyReset: 'Clear filters',
      labelTarget: 'Target muscle', labelEquipment: 'Equipment', labelSecondary: 'Secondary muscles',
      labelSteps: 'How to do it', addToRoutine: 'Add to my routine', addedToRoutine: 'Added ✓',
      routineEmpty: 'No exercises added yet.', footerData: 'Exercise data',
      footerMedia: 'Images & animations', results: (n) => `${n} exercises`,
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
    kettlebell: { es: 'Pesa rusa', en: 'Kettlebell' }, 'leverage machine': { es: 'Máquina de palanca', en: 'Leverage machine' },
    'medicine ball': { es: 'Balón medicinal', en: 'Medicine ball' }, 'olympic barbell': { es: 'Barra olímpica', en: 'Olympic barbell' },
    'resistance band': { es: 'Banda de resistencia', en: 'Resistance band' }, roller: { es: 'Rodillo', en: 'Roller' },
    rope: { es: 'Cuerda', en: 'Rope' }, 'skierg machine': { es: 'Máquina SkiErg', en: 'SkiErg machine' },
    'sled machine': { es: 'Trineo', en: 'Sled machine' }, 'smith machine': { es: 'Máquina Smith', en: 'Smith machine' },
    'stability ball': { es: 'Fitball', en: 'Stability ball' }, 'stationary bike': { es: 'Bici estática', en: 'Stationary bike' },
    'stepmill machine': { es: 'Escaladora', en: 'Stepmill machine' }, tire: { es: 'Neumático', en: 'Tire' },
    'trap bar': { es: 'Barra hexagonal', en: 'Trap bar' }, 'upper body ergometer': { es: 'Ergómetro de brazos', en: 'Upper body ergometer' },
    weighted: { es: 'Con peso añadido', en: 'Weighted' }, 'wheel roller': { es: 'Rueda abdominal', en: 'Wheel roller' },
  };
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

  /* ---------- State ---------- */
  const state = {
    lang: 'es',
    all: [], filtered: [],
    activeParts: new Set(), activeEquipment: '', query: '',
    shown: 0, pageSize: 30,
    routine: JSON.parse(localStorage.getItem('cargadero_routine') || '[]'),
  };

  const $ = (sel) => document.querySelector(sel);
  const grid = $('#grid'), sentinel = $('#sentinel');

  /* ---------- Load data ---------- */
  fetch('data.json').then(r => r.json()).then(data => {
    state.all = data;
    buildEquipmentOptions();
    buildPlateRack();
    applyFilters();
    updateRoutineBadge();
  }).catch(err => {
    grid.innerHTML = `<p style="color:var(--muted)">No se pudo cargar el catálogo de ejercicios.</p>`;
    console.error(err);
  });

  function buildEquipmentOptions() {
    const values = [...new Set(state.all.map(e => e.equipment))].sort();
    const sel = $('#equipmentSelect');
    values.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v; opt.textContent = label(EQUIPMENT_LABEL, v);
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
    if (state.filtered.length) renderMore();
  }

  function renderMore() {
    const next = state.filtered.slice(state.shown, state.shown + state.pageSize);
    next.forEach(e => grid.appendChild(cardFor(e)));
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
        <img class="gif" data-src="${e.gif}" alt="" loading="lazy">
      </div>
      <div class="card-info">
        <span class="card-name">${e.name}</span>
        <span class="card-sub">${label(BODY_PART_LABEL, e.body_part)} · ${label(EQUIPMENT_LABEL, e.equipment)}</span>
      </div>`;
    const gifImg = card.querySelector('.gif');
    let loaded = false;
    const loadGif = () => { if (!loaded) { gifImg.src = gifImg.dataset.src; loaded = true; } };
    card.addEventListener('mouseenter', loadGif);
    card.addEventListener('focus', loadGif);
    card.addEventListener('click', () => openModal(e));
    return card;
  }

  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && state.shown < state.filtered.length) renderMore();
  }, { rootMargin: '400px' }).observe(sentinel);

  $('#searchInput').addEventListener('input', (e) => { state.query = e.target.value; applyFilters(); });
  $('#resetFilters').addEventListener('click', () => {
    state.activeParts.clear(); state.activeEquipment = ''; state.query = '';
    $('#searchInput').value = ''; $('#equipmentSelect').value = '';
    document.querySelectorAll('.plate-chip.active').forEach(b => b.classList.remove('active'));
    applyFilters();
  });

  /* ---------- Modal ---------- */
  const backdrop = $('#modalBackdrop');
  let currentExercise = null;

  function openModal(e) {
    currentExercise = e;
    $('#modalGif').src = e.gif;
    $('#modalChip').textContent = label(BODY_PART_LABEL, e.body_part);
    $('#modalChip').style.background = PLATE_COLOR[e.body_part];
    $('#modalTitle').textContent = e.name;
    $('#modalTarget').textContent = label(TARGET_LABEL, e.target);
    $('#modalEquipment').textContent = label(EQUIPMENT_LABEL, e.equipment);
    $('#modalSecondary').textContent = e.secondary_muscles.map(m => label(TARGET_LABEL, m)).join(', ') || '—';
    const steps = e.steps[state.lang] || e.steps.en || [];
    $('#modalSteps').innerHTML = steps.map(s => `<li>${s}</li>`).join('');
    refreshAddButton();
    backdrop.hidden = false;
  }
  function closeModal() { backdrop.hidden = true; currentExercise = null; }
  $('#modalClose').addEventListener('click', closeModal);
  backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) closeModal(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { closeModal(); closeRoutine(); } });

  function refreshAddButton() {
    const btn = $('#modalAddBtn');
    const added = state.routine.includes(currentExercise.id);
    btn.querySelector('span').textContent = added ? UI[state.lang].addedToRoutine : UI[state.lang].addToRoutine;
    btn.dataset.added = added;
  }
  $('#modalAddBtn').addEventListener('click', () => {
    if (!currentExercise) return;
    toggleRoutine(currentExercise.id);
    refreshAddButton();
  });

  /* ---------- Routine ---------- */
  function toggleRoutine(id) {
    const i = state.routine.indexOf(id);
    if (i === -1) state.routine.push(id); else state.routine.splice(i, 1);
    localStorage.setItem('cargadero_routine', JSON.stringify(state.routine));
    updateRoutineBadge();
    if (!$('#routineBackdrop').hidden) renderRoutinePanel();
  }
  function updateRoutineBadge() { $('#routineCount').textContent = state.routine.length; }

  function renderRoutinePanel() {
    const list = $('#routineList');
    const items = state.routine.map(id => state.all.find(e => e.id === id)).filter(Boolean);
    $('#routineEmpty').hidden = items.length > 0;
    list.innerHTML = items.map(e => `
      <li class="routine-item" data-id="${e.id}">
        <img src="${e.image}" alt="" loading="lazy">
        <span class="ri-name">${e.name}</span>
        <button type="button" aria-label="Quitar">✕</button>
      </li>`).join('');
    list.querySelectorAll('.routine-item button').forEach(btn => {
      btn.addEventListener('click', () => toggleRoutine(btn.closest('.routine-item').dataset.id));
    });
  }
  function openRoutine() { renderRoutinePanel(); $('#routineBackdrop').hidden = false; }
  function closeRoutine() { $('#routineBackdrop').hidden = true; }
  $('#routineBtn').addEventListener('click', openRoutine);
  $('#routineClose').addEventListener('click', closeRoutine);
  $('#routineBackdrop').addEventListener('click', (ev) => { if (ev.target.id === 'routineBackdrop') closeRoutine(); });

  /* ---------- Language ---------- */
  function setLanguage(lang) {
    state.lang = lang;
    document.documentElement.lang = lang;
    $('#langBtn').textContent = lang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = UI[lang][el.dataset.i18n];
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
    if (currentExercise) openModal(currentExercise);
  }
  $('#langBtn').addEventListener('click', () => setLanguage(state.lang === 'es' ? 'en' : 'es'));

})();
