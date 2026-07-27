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
      routineEmpty: 'Aún no has añadido ejercicios a tu semana.', footerData: 'Datos de ejercicios',
      footerMedia: 'Imágenes y animaciones', results: (n) => `${n} ejercicios`,
      altToggle: '¿Ocupado? Ver alternativas', altTitle: 'Mismo músculo, otro equipo:',
      altEmpty: 'No hay alternativas con otro equipo para este ejercicio.',
      dayEmpty: 'Sin ejercicios.', swap: 'Cambiar', swapTitle: 'Elige un sustituto para', addedFlash: '¡Añadido!',
    },
    en: {
      tagline: 'Exercise library', myRoutine: 'My routine',
      searchPlaceholder: 'Search exercise, muscle…', allEquipment: 'All equipment',
      emptyTitle: 'No exercises match those filters.', emptyReset: 'Clear filters',
      labelTarget: 'Target muscle', labelEquipment: 'Equipment', labelSecondary: 'Secondary muscles',
      labelSteps: 'How to do it', addToRoutine: 'Add to my routine', chooseDay: 'Pick a day:',
      routineEmpty: 'No exercises in your week yet.', footerData: 'Exercise data',
      footerMedia: 'Images & animations', results: (n) => `${n} exercises`,
      altToggle: 'Occupied? See alternatives', altTitle: 'Same muscle, different equipment:',
      altEmpty: 'No alternatives with different equipment for this exercise.',
      dayEmpty: 'No exercises.', swap: 'Swap', swapTitle: 'Pick a substitute for', addedFlash: 'Added!',
    },
  };

  const DAYS = [
    { key: 'lun', es: 'Lunes', en: 'Monday' }, { key: 'mar', es: 'Martes', en: 'Tuesday' },
    { key: 'mie', es: 'Miércoles', en: 'Wednesday' }, { key: 'jue', es: 'Jueves', en: 'Thursday' },
    { key: 'vie', es: 'Viernes', en: 'Friday' }, { key: 'sab', es: 'Sábado', en: 'Saturday' },
    { key: 'dom', es: 'Domingo', en: 'Sunday' },
  ];
  const dayLabel = (key, short = false) => {
    const d = DAYS.find(d => d.key === key);
    if (!d) return key;
    const full = d[state.lang];
    return short ? full.slice(0, 3) : full;
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
  const emptyRoutine = () => Object.fromEntries(DAYS.map(d => [d.key, []]));

  function loadRoutine() {
    try {
      const raw = JSON.parse(localStorage.getItem('cargadero_routine') || 'null');
      if (raw && !Array.isArray(raw) && DAYS.every(d => Array.isArray(raw[d.key]))) return raw;
    } catch {}
    return emptyRoutine();
  }

  const state = {
    lang: 'es',
    all: [], filtered: [],
    activeParts: new Set(), activeEquipment: '', query: '',
    shown: 0, pageSize: 30,
    routine: loadRoutine(),
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

  /* ---------- Alternatives (same target, different equipment) ---------- */
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

    $('#modalDayPicker').hidden = true;
    $('#modalAddBtn').textContent = UI[state.lang].addToRoutine;
    $('#altList').hidden = true;
    $('#altToggle').textContent = UI[state.lang].altToggle;
    backdrop.hidden = false;
  }
  function closeModal() { backdrop.hidden = true; currentExercise = null; }
  $('#modalClose').addEventListener('click', closeModal);
  backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) closeModal(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { closeModal(); closeRoutine(); } });

  function renderDayPicker(container, onPick) {
    container.innerHTML = `<p class="day-picker-label">${UI[state.lang].chooseDay}</p>` +
      DAYS.map(d => `<button type="button" class="day-chip" data-day="${d.key}">${dayLabel(d.key, true)}</button>`).join('');
    container.querySelectorAll('.day-chip').forEach(btn => {
      btn.addEventListener('click', () => onPick(btn.dataset.day));
    });
  }

  $('#modalAddBtn').addEventListener('click', () => {
    const picker = $('#modalDayPicker');
    if (picker.hidden) {
      renderDayPicker(picker, (day) => {
        addToRoutine(day, currentExercise.id);
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

  /* ---------- Routine (por día) ---------- */
  function saveRoutine() { localStorage.setItem('cargadero_routine', JSON.stringify(state.routine)); }

  function addToRoutine(day, id) {
    if (!state.routine[day].includes(id)) state.routine[day].push(id);
    saveRoutine();
    updateRoutineBadge();
    if (!$('#routineBackdrop').hidden) renderRoutineDays();
  }
  function removeFromRoutine(day, id) {
    state.routine[day] = state.routine[day].filter(x => x !== id);
    saveRoutine();
    updateRoutineBadge();
    renderRoutineDays();
  }
  function swapInRoutine(day, oldId, newId) {
    const i = state.routine[day].indexOf(oldId);
    if (i !== -1) state.routine[day][i] = newId;
    saveRoutine();
    renderRoutineDays();
  }
  function updateRoutineBadge() {
    const total = DAYS.reduce((n, d) => n + state.routine[d.key].length, 0);
    $('#routineCount').textContent = total;
  }

  function renderRoutineDays() {
    const container = $('#routineDays');
    const total = DAYS.reduce((n, d) => n + state.routine[d.key].length, 0);
    $('#routineEmpty').hidden = total > 0;
    container.innerHTML = '';
    DAYS.forEach(d => {
      const ids = state.routine[d.key];
      const section = document.createElement('div');
      section.className = 'day-section';
      section.innerHTML = `<h3 class="day-heading">${dayLabel(d.key)} <span class="day-count">${ids.length}</span></h3>`;
      if (!ids.length) {
        const p = document.createElement('p');
        p.className = 'day-empty'; p.textContent = UI[state.lang].dayEmpty;
        section.appendChild(p);
      } else {
        const list = document.createElement('ul');
        list.className = 'routine-list';
        ids.forEach(id => {
          const ex = state.all.find(e => e.id === id);
          if (!ex) return;
          const li = document.createElement('li');
          li.className = 'routine-item';
          li.innerHTML = `
            <img src="${ex.image}" alt="" loading="lazy">
            <span class="ri-name">${ex.name}</span>
            <button type="button" class="ri-swap" title="${UI[state.lang].swap}">⇄</button>
            <button type="button" class="ri-remove" aria-label="Quitar">✕</button>`;
          li.querySelector('.ri-remove').addEventListener('click', () => removeFromRoutine(d.key, id));
          li.querySelector('.ri-swap').addEventListener('click', (ev) => openSwapPicker(ev.currentTarget, d.key, ex));
          list.appendChild(li);
        });
        section.appendChild(list);
      }
      container.appendChild(section);
    });
  }

  function openSwapPicker(anchorBtn, day, exercise) {
    document.querySelectorAll('.swap-pop').forEach(p => p.remove());
    const alts = getAlternatives(exercise);
    const pop = document.createElement('div');
    pop.className = 'swap-pop';
    if (!alts.length) {
      pop.innerHTML = `<p class="alt-empty">${UI[state.lang].altEmpty}</p>`;
    } else {
      pop.innerHTML = `<p class="swap-pop-title">${UI[state.lang].swapTitle} ${exercise.name}</p>`;
      const row = document.createElement('div'); row.className = 'mini-row';
      alts.forEach(a => row.appendChild(miniCard(a, (picked) => {
        swapInRoutine(day, exercise.id, picked.id);
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
