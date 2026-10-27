/* Smart-home OS demo (after the Home Assistant slides).
   Left a clickable dashboard (devices and routines), right a drawn room whose
   actors react: HVAC, two lights, two smart plugs and a blind. Runs fully
   offline. The room temperature and the clock are small simulations that only
   tick while the slide is on screen; all wattages are example values.

   A routine is a saved set of actions plus a trigger: a time on the simulated
   clock, a room temperature, or just a button. The window follows the
   simulated time of day.

   Clicks must not reach the engine, hence stopPropagation(); buttons also take
   no focus, so Space and the arrow keys keep driving the deck. */
(() => {
  const AMBIENT = 19;          // the room drifts here when the HVAC is off
  const BLIND_TRAVEL = 260;    // window height in the drawing
  const W = { ceiling: 12, floor: 9, coffee: 1000, tv: 80, hvacRun: 900, hvacIdle: 15 };
  const DAY_FROM = 6 * 60 + 30, DAY_TO = 20 * 60 + 30;   // sunrise / sunset in minutes
  const MAX_ROUTINES = 6;
  const FF_LEAD = 5;           // "Vorspulen" stops this many minutes before the next routine
  const IDLE = 'Lokal · läuft ohne Internet';

  const ICON = (d) => '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>';
  const ICONS = {
    house:  '<path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5h4v5"/>',
    bolt:   '<path d="M13 2.5L5.5 13.5H11L10 21.5l7.5-11H12z"/>',
    sun:    '<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
    moon:   '<path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z"/>',
    therm:  '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
    bulb:   '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    plug:   '<path d="M9 2.5V7M15 2.5V7"/><path d="M6 7h12v3.5a6 6 0 0 1-12 0z"/><path d="M12 16.5v5"/>',
    blinds: '<rect x="4" y="3.5" width="16" height="17" rx="1.5"/><path d="M4 8h16M4 12.5h16M4 17h16"/>',
    film:   '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    star:   '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    play:   '<path d="M8 5l11 7-11 7z" fill="currentColor"/>',
    pause:  '<path d="M8 5v14M16 5v14"/>',
    ff:     '<path d="M4 5l8 7-8 7zM13 5l8 7-8 7z" fill="currentColor"/>',
    power:  '<path d="M12 3v8"/><path d="M6.8 6.5a8 8 0 1 0 10.4 0"/>',
    plus:   '<path d="M12 5v14M5 12h14"/>',
    x:      '<path d="M6 6l12 12M18 6L6 18"/>',
    gear:   '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>'
  };

  const pad = (n) => String(n).padStart(2, '0');
  const hhmm = (m) => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const toMin = (s) => { const p = s.split(':'); return +p[0] * 60 + +p[1]; };
  const fmt = (n, d = 1) => n.toFixed(d).replace('.', ',');

  /* What a scene or routine does to the room. blind is the target position. */
  const PATCH = {
    morning: { blind: 0, ceiling: true, bri: 100, floor: false, coffee: true, tv: false, mode: 'heat', target: 21 },
    cinema:  { blind: 100, ceiling: false, floor: true, coffee: false, tv: true },
    night:   { blind: 100, ceiling: false, floor: false, coffee: false, tv: false, mode: 'off' },
    heat:    { blind: 70, mode: 'cool', target: 22 },
    off:     { ceiling: false, floor: false, coffee: false, tv: false, mode: 'off' }
  };
  const SCENE = { morning: 'Morgen', cinema: 'Kino', off: 'Alles aus' };
  const SCENE_TEXT = {
    morning: 'Jalousie auf, Licht 100 %, Kaffee, Heizen 21 °C',
    cinema: 'Jalousie zu, Stehlampe, TV an',
    off: 'Licht, Steckdosen, Klima aus'
  };

  /* Short text for a snapshot routine: blind position plus whatever is on. */
  function describe(p) {
    const out = [p.blind === 0 ? 'Jalousie auf' : p.blind === 100 ? 'Jalousie zu' : 'Jalousie ' + p.blind + ' %'];
    if (p.ceiling) out.push('Licht ' + p.bri + ' %');
    if (p.floor) out.push('Stehlampe');
    if (p.coffee) out.push('Kaffee');
    if (p.tv) out.push('Fernseher');
    if (p.mode !== 'off') out.push((p.mode === 'heat' ? 'Heizen ' : 'Kühlen ') + fmt(p.target) + ' °C');
    if (out.length === 1) out.push('sonst alles aus');
    return out.join(' · ');
  }

  function init(root) {
    if (root.dataset.ready === '1') return;
    root.dataset.ready = '1';

    const el = (name) => root.querySelector('[data-el="' + name + '"]');
    const all = (sel) => root.querySelectorAll(sel);
    all('[data-icon]').forEach((n) => { n.innerHTML = ICON(ICONS[n.dataset.icon]); });

    const S = {
      target: 21, current: 19.2, mode: 'off',
      ceiling: false, bri: 70, floor: false,
      coffee: false, tv: false,
      blind: 0, blindTarget: 0,
      min: 19 * 60 + 50, playing: false, tab: 'devices'
    };

    const routines = [
      { id: 'morning', name: 'Guten Morgen', icon: 'sun', trigger: { type: 'time', at: '07:00' }, patch: PATCH.morning,
        desc: 'Jalousie auf · Licht 100 % · Kaffee · Heizen 21 °C' },
      { id: 'cinema', name: 'Kino-Abend', icon: 'film', trigger: { type: 'time', at: '20:00' }, patch: PATCH.cinema,
        desc: 'Jalousie zu · Stehlampe · Fernseher' },
      { id: 'night', name: 'Gute Nacht', icon: 'moon', trigger: { type: 'time', at: '22:30' }, patch: PATCH.night,
        desc: 'Alles aus · Jalousie zu' },
      { id: 'heat', name: 'Hitzeschutz', icon: 'therm', trigger: { type: 'temp', above: 24 }, patch: PATCH.heat,
        desc: 'Jalousie 70 % · Klima kühlt auf 22 °C' }
    ].map((r) => Object.assign({ active: true, last: null }, r));

    let customN = 0, firedId = null;
    let tick = 0, clk = 0, move = 0, bannerT = 0, active = false;

    function log(text) {
      const box = el('log');
      const row = document.createElement('div');
      row.textContent = hhmm(S.min) + '  ' + text;
      box.prepend(row);
      while (box.children.length > 3) box.lastElementChild.remove();
    }

    function banner(text) {
      const b = el('banner');
      b.querySelector('span:last-child').textContent = text;
      b.classList.add('is-on');
      clearTimeout(bannerT);
      bannerT = setTimeout(() => {
        b.classList.remove('is-on');
        b.querySelector('span:last-child').textContent = IDLE;
      }, 4000);
    }

    const hvacRunning = () =>
      (S.mode === 'heat' && S.current < S.target - 0.05) ||
      (S.mode === 'cool' && S.current > S.target + 0.05);

    function hvacText() {
      if (S.mode === 'off') return 'aus';
      if (hvacRunning()) return S.mode === 'heat' ? 'heizt' : 'kühlt';
      return 'hält ' + fmt(S.target) + ' °C';
    }

    function blindText() {
      if (S.blind !== S.blindTarget) return S.blindTarget > S.blind ? 'fährt ab …' : 'fährt auf …';
      if (S.blind === 0) return 'offen';
      if (S.blind === 100) return 'geschlossen';
      return Math.round(S.blind) + ' % zu';
    }

    /* A label pill in the drawing; it is sized to its text and anchored
       left / middle / right of data-x. Nothing to measure while the slide is
       hidden, so it keeps its last size then. */
    function tag(name, text, on) {
      const g = el('tag-' + name), t = g.querySelector('text'), r = g.querySelector('rect');
      t.textContent = text;
      g.classList.toggle('is-on', on);
      const w = Math.ceil(t.getComputedTextLength() + 42);
      if (w < 60) return;
      r.setAttribute('width', w);
      const x = +g.dataset.x;
      const left = g.dataset.a === 'end' ? x - w : g.dataset.a === 'middle' ? x - w / 2 : x;
      g.setAttribute('transform', 'translate(' + left.toFixed(1) + ',' + g.dataset.y + ')');
    }

    const tile = (name, on) => root.querySelector('[data-tile="' + name + '"]').classList.toggle('is-active', on);

    function render() {
      const day = S.min >= DAY_FROM && S.min < DAY_TO;
      root.dataset.night = day ? '0' : '1';
      root.dataset.playing = S.playing ? '1' : '0';

      /* Dashboard */
      el('clock').textContent = hhmm(S.min);
      all('[data-act="tab"]').forEach((b) => b.classList.toggle('is-on', b.dataset.v === S.tab));
      all('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== S.tab; });

      el('target').textContent = fmt(S.target) + ' °C';
      el('current').textContent = fmt(S.current) + ' °C';
      el('hvac-state').textContent = hvacText();
      el('hvac-state').classList.toggle('is-on', S.mode !== 'off');
      all('[data-act="mode"]').forEach((b) => b.classList.toggle('is-on', b.dataset.v === S.mode));

      ['ceiling', 'floor', 'coffee', 'tv'].forEach((k) =>
        root.querySelector('[data-act="toggle"][data-v="' + k + '"]').classList.toggle('is-on', S[k]));
      el('bri').textContent = S.bri + ' %';
      el('bri-bar').style.width = S.bri + '%';
      const lights = (S.ceiling ? 1 : 0) + (S.floor ? 1 : 0);
      el('light-state').textContent = lights ? lights + ' von 2 an' : 'aus';
      el('light-state').classList.toggle('is-on', lights > 0);
      el('coffee-w').textContent = (S.coffee ? W.coffee : 0) + ' W';
      el('tv-w').textContent = (S.tv ? W.tv : 0) + ' W';
      const plugs = (S.coffee ? 1 : 0) + (S.tv ? 1 : 0);
      el('plug-state').textContent = plugs ? plugs + ' von 2 an' : 'aus';
      el('plug-state').classList.toggle('is-on', plugs > 0);

      el('blind-state').textContent = blindText();
      el('blind-state').classList.toggle('is-on', S.blind > 0);
      el('blind-bar').style.width = S.blind + '%';
      el('blind-pct').textContent = Math.round(S.blind) + ' %';

      tile('hvac', S.mode !== 'off');
      tile('light', lights > 0);
      tile('plug', plugs > 0);
      tile('blind', S.blind > 0);

      const watts = (S.ceiling ? Math.round(W.ceiling * S.bri / 100) : 0) + (S.floor ? W.floor : 0) +
        (S.coffee ? W.coffee : 0) + (S.tv ? W.tv : 0) +
        (S.mode === 'off' ? 0 : hvacRunning() ? W.hvacRun : W.hvacIdle);
      el('power').textContent = watts.toLocaleString('de-DE') + ' W';

      /* Room */
      const lit = 1 - S.blind / 100;
      el('blind').setAttribute('transform', 'translate(0,' + (-(1 - S.blind / 100) * BLIND_TRAVEL) + ')');
      el('beam').setAttribute('opacity', day ? (0.3 * lit).toFixed(3) : 0);
      const ceil = S.ceiling ? (0.35 + 0.65 * S.bri / 100).toFixed(2) : 0;
      el('cone-ceiling').setAttribute('opacity', ceil);
      el('halo-ceiling').setAttribute('opacity', ceil);
      el('bulb-ceiling').classList.toggle('is-on', S.ceiling);
      el('halo-floor').setAttribute('opacity', S.floor ? 0.9 : 0);
      el('bulb-floor').classList.toggle('is-on', S.floor);
      el('tv').classList.toggle('is-on', S.tv);
      el('tv-ui').classList.toggle('is-on', S.tv);
      el('tv-led').classList.toggle('is-on', S.tv);
      el('coffee-led').classList.toggle('is-on', S.coffee);
      all('[data-el="steam"]').forEach((p) => p.classList.toggle('is-on', S.coffee));
      const run = hvacRunning();
      all('[data-el="air"]').forEach((p) => {
        p.classList.toggle('is-heat', run && S.mode === 'heat');
        p.classList.toggle('is-cool', run && S.mode === 'cool');
      });
      el('ac-led').classList.toggle('is-on', S.mode !== 'off');
      el('ac-temp').textContent = fmt(S.current) + '°';

      tag('hvac', 'Klima · ' + hvacText(), S.mode !== 'off');
      tag('ceiling', 'Deckenlicht · ' + (S.ceiling ? S.bri + ' %' : 'aus'), S.ceiling);
      tag('floor', 'Stehlampe · ' + (S.floor ? 'an' : 'aus'), S.floor);
      tag('coffee', 'Kaffeemaschine · ' + (S.coffee ? 'an' : 'aus'), S.coffee);
      tag('tv', 'TV · ' + (S.tv ? 'an' : 'aus'), S.tv);
      tag('blind', 'Jalousie · ' + Math.round(S.blind) + ' %', S.blind > 0);
    }

    function renderRoutines() {
      el('routines').innerHTML = routines.map((r) => {
        const trig = r.trigger.type === 'time' ? ICON(ICONS.clock) + r.trigger.at
          : r.trigger.type === 'temp' ? ICON(ICONS.therm) + '&gt; ' + r.trigger.above + ' °C'
          : ICON(ICONS.gear) + 'Manuell';
        return '<div class="shos-rt' + (r.active ? '' : ' is-off') + (r.id === firedId ? ' is-fired' : '') + '">' +
          '<span class="shos-badge">' + ICON(ICONS[r.icon]) + '</span>' +
          '<div class="shos-rt__txt"><b>' + r.name + '</b><small>' + r.desc + '</small></div>' +
          '<div class="shos-rt__trig"><span>' + trig + '</span><small>' + (r.last ? 'zuletzt ' + r.last : 'noch nie') + '</small></div>' +
          '<button class="shos-sw' + (r.active ? ' is-on' : '') + '" data-act="rt-toggle" data-v="' + r.id + '" aria-label="Routine ' + r.name + ' ein oder aus"></button>' +
          '<button class="shos-round" data-act="rt-run" data-v="' + r.id + '" aria-label="Routine ' + r.name + ' jetzt starten">' + ICON(ICONS.play) + '</button>' +
          (r.custom ? '<button class="shos-round" data-act="rt-del" data-v="' + r.id + '" aria-label="Routine ' + r.name + ' löschen">' + ICON(ICONS.x) + '</button>' : '') +
          '</div>';
      }).join('');
      firedId = null;
      el('routine-count').textContent = routines.length;
      el('save').disabled = routines.length >= MAX_ROUTINES;
    }

    function moveBlind(to) {
      S.blindTarget = to;
      clearInterval(move);
      move = setInterval(() => {
        const d = S.blindTarget - S.blind;
        if (Math.abs(d) <= 1) { S.blind = S.blindTarget; clearInterval(move); move = 0; }
        else S.blind += Math.sign(d);
        render();
      }, 40);
      render();
    }

    function apply(patch) {
      const { blind, ...rest } = patch;
      Object.assign(S, rest);
      if (blind !== undefined) moveBlind(blind);
    }

    function runRoutine(r, why) {
      apply(r.patch);
      r.last = hhmm(S.min);
      firedId = r.id;
      log('Routine „' + r.name + '“ · ' + why);
      banner('Routine „' + r.name + '“ gestartet');
      renderRoutines();
    }

    function saveRoutine() {
      if (routines.length >= MAX_ROUTINES) return;
      customN++;
      const patch = {
        blind: Math.round(S.blindTarget), ceiling: S.ceiling, bri: S.bri, floor: S.floor,
        coffee: S.coffee, tv: S.tv, mode: S.mode, target: S.target
      };
      const r = { id: 'c' + customN, name: 'Eigene Routine ' + customN, icon: 'star', custom: true,
        trigger: { type: 'manual' }, patch: patch, desc: describe(patch), active: true, last: null };
      routines.push(r);
      log('Routine „' + r.name + '“ gespeichert');
      banner('Routine „' + r.name + '“ gespeichert');
      renderRoutines();
    }

    const NAMES = { ceiling: 'Deckenlicht', floor: 'Stehlampe', coffee: 'Kaffeemaschine', tv: 'Fernseher' };
    const MODES = { heat: 'Heizen', cool: 'Kühlen', off: 'Aus' };

    function setPlaying(on) {
      S.playing = on;
      syncClock();
    }

    function syncClock() {
      clearInterval(clk);
      clk = S.playing && active ? setInterval(advance, 200) : 0;
    }

    /* One simulated minute; time routines fire on their exact minute. */
    function advance() {
      S.min = (S.min + 1) % 1440;
      routines.forEach((r) => {
        if (r.active && r.trigger.type === 'time' && toMin(r.trigger.at) === S.min) runRoutine(r, 'um ' + r.trigger.at);
      });
      render();
    }

    /* Jump to a few minutes before the next active time routine and play. */
    function fastForward() {
      const waits = routines
        .filter((r) => r.active && r.trigger.type === 'time')
        .map((r) => (toMin(r.trigger.at) - S.min + 1440) % 1440 || 1440)
        .sort((a, b) => a - b);
      if (!waits.length) { log('Keine aktive Zeit-Routine'); return; }
      if (waits[0] > FF_LEAD) S.min = (S.min + waits[0] - FF_LEAD) % 1440;
      setPlaying(true);
    }

    /* A temperature routine fires once when the value crosses its threshold
       and re-arms after the room has dropped a degree below it. */
    function checkTemp() {
      routines.forEach((r) => {
        if (r.trigger.type !== 'temp') return;
        if (S.current < r.trigger.above - 1) r.armed = true;
        else if (r.active && r.armed !== false && S.current > r.trigger.above) {
          r.armed = false;
          runRoutine(r, 'über ' + r.trigger.above + ' °C');
        }
      });
    }

    function act(a, v) {
      const r = routines.find((x) => x.id === v);
      switch (a) {
        case 'tab':
          S.tab = v;
          break;
        case 'play':
          setPlaying(!S.playing);
          break;
        case 'ff':
          fastForward();
          break;
        case 'temp':
          S.target = Math.min(28, Math.max(16, S.target + Number(v)));
          log('Klima → Soll ' + fmt(S.target) + ' °C');
          break;
        case 'mode':
          S.mode = v;
          log('Klima → ' + MODES[v]);
          break;
        case 'toggle':
          S[v] = !S[v];
          log(NAMES[v] + ' → ' + (S[v] ? 'EIN' : 'AUS') + (v === 'ceiling' && S[v] ? ' (' + S.bri + ' %)' : ''));
          break;
        case 'dim':
          S.bri = Math.min(100, Math.max(10, S.bri + Number(v)));
          S.ceiling = true;
          log('Deckenlicht → ' + S.bri + ' %');
          break;
        case 'blind':
          if (v === 'stop') {
            clearInterval(move);
            S.blindTarget = Math.round(S.blind);
            S.blind = S.blindTarget;
            log('Jalousie → Stopp bei ' + S.blind + ' %');
          } else {
            log('Jalousie → ' + (v === 'up' ? 'Auf' : 'Ab'));
            moveBlind(v === 'up' ? 0 : 100);
          }
          break;
        case 'scene':
          apply(PATCH[v]);
          log('Szene „' + SCENE[v] + '“: ' + SCENE_TEXT[v]);
          banner('Szene „' + SCENE[v] + '“');
          break;
        case 'rt-toggle':
          r.active = !r.active;
          r.armed = true;
          log('Routine „' + r.name + '“ ' + (r.active ? 'aktiv' : 'pausiert'));
          renderRoutines();
          break;
        case 'rt-run':
          runRoutine(r, 'manuell');
          break;
        case 'rt-del':
          routines.splice(routines.indexOf(r), 1);
          log('Routine „' + r.name + '“ gelöscht');
          renderRoutines();
          break;
        case 'save':
          saveRoutine();
          break;
      }
      render();
    }

    root.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (e.target.closest('button')) e.preventDefault();   // no focus
    });
    root.addEventListener('click', (e) => {
      e.stopPropagation();
      const b = e.target.closest('button[data-act]');
      if (b) act(b.dataset.act, b.dataset.v);
    });

    function step() {
      if (S.mode === 'heat' && S.current < S.target - 0.05) S.current = Math.min(S.target, S.current + 0.15);
      else if (S.mode === 'cool' && S.current > S.target + 0.05) S.current = Math.max(S.target, S.current - 0.15);
      else if (S.mode === 'off' && Math.abs(S.current - AMBIENT) > 0.05) S.current += S.current > AMBIENT ? -0.03 : 0.03;
      checkTemp();
      render();
    }

    root._shStart = () => {
      active = true;
      if (!tick) tick = setInterval(step, 500);
      syncClock();
      render();
    };
    root._shStop = () => {
      active = false;
      clearInterval(tick); tick = 0;
      syncClock();
      clearTimeout(bannerT);
      const b = el('banner');
      b.classList.remove('is-on');
      b.querySelector('span:last-child').textContent = IDLE;
    };
    renderRoutines();
    render();
  }

  /* Index-independent start, so the slide can be renumbered freely. */
  document.addEventListener('deck:enter', () => {
    document.querySelectorAll('[data-smarthome]').forEach((root) => {
      if (root._shStop && !root.closest('.slide.is-active')) root._shStop();
    });
    document.querySelectorAll('.slide.is-active [data-smarthome]').forEach((root) => {
      init(root);
      root._shStart();
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-smarthome]').forEach(init);
    document.querySelectorAll('.slide.is-active [data-smarthome]').forEach((r) => r._shStart());
  });
})();
