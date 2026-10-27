/* Smart-home OS demo (after the Home Assistant slides).
   A full-slide "operating system": a house in its garden (sky, sun and moon,
   clouds, rain, snow, lightning, lit windows, garden light), a clickable
   dashboard (devices, routines, environment) and a drawn living room whose
   actors react: HVAC, four lights, two smart plugs and a blind. Runs fully
   offline. Clock, weather and room temperature are small simulations that only
   tick while the slide is on screen; wattages and temperatures are example
   values.

   A routine is a saved set of actions plus a trigger: a time on the simulated
   clock, sunrise/sunset, a room temperature, a weather change, or a button.

   Clicks must not reach the engine, hence stopPropagation(); buttons also take
   no focus, so Space and the arrow keys keep driving the deck. */
(() => {
  const BLIND_TRAVEL = 260;    // window height in the living-room drawing
  const W = { ceiling: 12, floor: 9, bedroom: 9, outdoor: 20, coffee: 1000, tv: 80, hvacRun: 900, hvacIdle: 15 };
  const SUNRISE = 6 * 60 + 30, SUNSET = 20 * 60 + 30;   // minutes since midnight
  const MAX_ROUTINES = 8;
  const FF_LEAD = 5;           // "Vorspulen" stops this many minutes before the next routine
  const SPEED_MS = { normal: 200, fast: 50, warp: 12 };  // real ms per simulated minute
  const IDLE = 'Lokal · läuft ohne Internet';
  const NS = 'http://www.w3.org/2000/svg';

  const ICON = (d) => '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>';
  const CLOUD = 'M6.5 18.5h11a4.2 4.2 0 0 0 .6-8.36A6 6 0 0 0 6.7 9.6 4.5 4.5 0 0 0 6.5 18.5z';
  const CLOUD_UP = 'M6.5 14h11a4 4 0 0 0 .5-7.96A6 6 0 0 0 6.7 5.1 4.4 4.4 0 0 0 6.5 14z';
  const ICONS = {
    house:  '<path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5h4v5"/>',
    bolt:   '<path d="M13 2.5L5.5 13.5H11L10 21.5l7.5-11H12z"/>',
    sun:    '<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
    moon:   '<path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z"/>',
    cloud:  '<path d="' + CLOUD + '"/>',
    rain:   '<path d="' + CLOUD_UP + '"/><path d="M8 17.5l-1 3M12 17.5l-1 3M16 17.5l-1 3"/>',
    storm:  '<path d="' + CLOUD_UP + '"/><path d="M12.5 14.5l-2.5 4h3.5l-2 3.5"/>',
    snow:   '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M12 6l-2-1.5M12 6l2-1.5M12 18l-2 1.5M12 18l2 1.5"/>',
    therm:  '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
    bulb:   '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    lamp:   '<path d="M8 3h8l3 9H5z"/><path d="M12 12v8M8 21h8"/>',
    bed:    '<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-8v6"/><circle cx="6.5" cy="11" r="1.8"/>',
    tree:   '<path d="M12 21v-6"/><path d="M12 15c-4 0-6-2.6-5.2-5.6C6.8 6.5 9 4 12 4s5.2 2.5 5.2 5.4C18 12.4 16 15 12 15z"/>',
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

  /* ---------- colours: sky, ground, weather ---------- */

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = (c) => 'rgb(' + c.join(',') + ')';

  const NIGHT = { top: hex('#070b1e'), bot: hex('#1a2345'), n: 1 };
  const DAWN  = { top: hex('#3d4b8a'), bot: hex('#f4a67e'), n: 0.5 };
  const DAY   = { top: hex('#4a95e6'), bot: hex('#c4e6ff'), n: 0 };
  const DUSK  = { top: hex('#2c3070'), bot: hex('#f28b5e'), n: 0.5 };
  const SKY = [[0, NIGHT], [330, NIGHT], [SUNRISE, DAWN], [480, DAY], [1110, DAY], [SUNSET, DUSK], [1320, NIGHT], [1440, NIGHT]];

  /* Sky colours and how dark it is (n: 0 day … 1 night) at a minute of the day. */
  function skyAt(m) {
    for (let i = 1; i < SKY.length; i++) {
      if (m <= SKY[i][0]) {
        const a = SKY[i - 1], b = SKY[i], t = (m - a[0]) / (b[0] - a[0]);
        return { top: mix(a[1].top, b[1].top, t), bot: mix(a[1].bot, b[1].bot, t), n: a[1].n + (b[1].n - a[1].n) * t };
      }
    }
    return NIGHT;
  }

  const GREY_TOP = hex('#7a8695'), GREY_BOT = hex('#b3bcc6');
  const GRASS_DAY = hex('#5aa86a'), GRASS_NIGHT = hex('#12302b');
  const LEAF_DAY = hex('#3f8f55'), LEAF_NIGHT = hex('#0d2a25');
  const TRUNK_DAY = hex('#7a5638'), TRUNK_NIGHT = hex('#1d1511');
  const SNOW_DAY = hex('#eef3f9'), SNOW_NIGHT = hex('#7b88a6');
  const CLOUD_NIGHT = hex('#2a3358');
  const SUN_LOW = hex('#ff8a3d'), SUN_HIGH = hex('#ffd95c');

  /* grey: how much the sky turns overcast; light: daylight reaching the
     room; body: how visible sun and moon stay; dT: outside temperature offset. */
  const WX = {
    sunny:  { label: 'Sonnig',   icon: 'sun',   dT: 2,   grey: 0,    light: 1,    body: 1,    cloud: '#ffffff' },
    cloudy: { label: 'Bewölkt',  icon: 'cloud', dT: 0,   grey: 0.45, light: 0.55, body: 0.5,  cloud: '#e4e9ef' },
    rain:   { label: 'Regen',    icon: 'rain',  dT: -3,  grey: 0.7,  light: 0.3,  body: 0.12, cloud: '#9aa5b3' },
    storm:  { label: 'Gewitter', icon: 'storm', dT: -4,  grey: 0.88, light: 0.18, body: 0,    cloud: '#667080' },
    snow:   { label: 'Schnee',   icon: 'snow',  dT: -14, grey: 0.6,  light: 0.45, body: 0.15, cloud: '#d6dde6' }
  };

  function partOfDay(m) {
    if (m < 330) return 'Nacht';
    if (m < SUNRISE) return 'Morgendämmerung';
    if (m < 660) return 'Vormittag';
    if (m < 840) return 'Mittag';
    if (m < 1110) return 'Nachmittag';
    if (m < SUNSET) return 'Abend';
    if (m < 1320) return 'Abenddämmerung';
    return 'Nacht';
  }

  /* What a scene or routine does to the house. blind is the target position. */
  const PATCH = {
    morning: { blind: 0, ceiling: true, bri: 100, floor: false, coffee: true, tv: false, mode: 'heat', target: 21 },
    cinema:  { blind: 100, ceiling: false, floor: true, coffee: false, tv: true },
    night:   { blind: 100, ceiling: false, floor: false, coffee: false, tv: false, mode: 'off' },
    heat:    { blind: 70, mode: 'cool', target: 22 },
    storm:   { blind: 100, coffee: false, tv: false },
    dusk:    { outdoor: true },
    dawn:    { outdoor: false },
    off:     { ceiling: false, floor: false, bedroom: false, outdoor: false, coffee: false, tv: false, mode: 'off' }
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
    if (p.bedroom) out.push('Schlafzimmer');
    if (p.outdoor) out.push('Außenlicht');
    if (p.coffee) out.push('Kaffee');
    if (p.tv) out.push('Fernseher');
    if (p.mode !== 'off') out.push((p.mode === 'heat' ? 'Heizen ' : 'Kühlen ') + fmt(p.target) + ' °C');
    if (out.length === 1) out.push('sonst alles aus');
    return out.join(' · ');
  }

  const rng = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  function make(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k]));
    parent.appendChild(e);
    return e;
  }

  function init(root) {
    if (root.dataset.ready === '1') return;
    root.dataset.ready = '1';

    const el = (name) => root.querySelector('[data-el="' + name + '"]');
    const all = (sel) => root.querySelectorAll(sel);
    all('[data-icon]').forEach((n) => { n.innerHTML = ICON(ICONS[n.dataset.icon]); });

    const S = {
      target: 21, current: 19.2, mode: 'off',
      ceiling: false, bri: 70, floor: false, bedroom: false, outdoor: false,
      coffee: false, tv: false,
      blind: 0, blindTarget: 0,
      min: 19 * 60 + 50, playing: false, speed: 'normal', weather: 'sunny', tab: 'devices'
    };

    const routines = [
      { id: 'morning', name: 'Guten Morgen', icon: 'sun', trigger: { type: 'time', at: '07:00' }, patch: PATCH.morning,
        desc: 'Jalousie auf · Licht 100 % · Kaffee · Heizen 21 °C' },
      { id: 'sun', name: 'Außenlicht-Automatik', icon: 'tree', trigger: { type: 'sun' }, patch: PATCH.dusk, patchAlt: PATCH.dawn,
        desc: 'Außenlicht an bei Dämmerung, aus bei Sonnenaufgang' },
      { id: 'cinema', name: 'Kino-Abend', icon: 'film', trigger: { type: 'time', at: '20:00' }, patch: PATCH.cinema,
        desc: 'Jalousie zu · Stehlampe · Fernseher' },
      { id: 'night', name: 'Gute Nacht', icon: 'moon', trigger: { type: 'time', at: '22:30' }, patch: PATCH.night,
        desc: 'Alles aus · Jalousie zu' },
      { id: 'heat', name: 'Hitzeschutz', icon: 'therm', trigger: { type: 'temp', above: 24 }, patch: PATCH.heat,
        desc: 'Jalousie 70 % · Klima kühlt auf 22 °C' },
      { id: 'storm', name: 'Gewitterschutz', icon: 'storm', trigger: { type: 'weather', is: 'storm' }, patch: PATCH.storm,
        desc: 'Jalousie zu · Steckdosen aus' }
    ].map((r) => Object.assign({ active: true, last: null }, r));

    let customN = 0, firedId = null, shownWx = null;
    let tick = 0, clk = 0, move = 0, bannerT = 0, active = false;

    /* ---------- one-time scenery: stars, rain, snow ---------- */

    const sc = root.querySelector('.sh-hscene');
    const rnd = rng(7);
    for (let i = 0; i < 34; i++) {
      const c = make('circle', { class: 'sh-star', cx: (10 + rnd() * 880).toFixed(0), cy: (8 + rnd() * 190).toFixed(0), r: (0.8 + rnd() * 1.6).toFixed(1) }, el('stars'));
      c.style.animationDelay = (-rnd() * 4).toFixed(2) + 's';
    }
    for (let i = 0; i < 70; i++) {
      const x = (rnd() * 1000 - 40).toFixed(0);
      const d = make('line', { class: 'sh-drop', x1: x, y1: 0, x2: x - 4, y2: 16 }, el('rain'));
      d.style.animationDuration = (0.55 + rnd() * 0.5).toFixed(2) + 's';
      d.style.animationDelay = (-rnd() * 1.2).toFixed(2) + 's';
    }
    for (let i = 0; i < 48; i++) {
      const f = make('circle', { class: 'sh-flake', cx: (rnd() * 900).toFixed(0), cy: 0, r: (1.8 + rnd() * 2.4).toFixed(1) }, el('snow'));
      f.style.animationDuration = (6 + rnd() * 6).toFixed(1) + 's';
      f.style.animationDelay = (-rnd() * 10).toFixed(1) + 's';
    }
    for (let i = 0; i < 18; i++) {
      const x = (50 + rnd() * 250).toFixed(0);
      const d = make('line', { class: 'sh-wdrop', x1: x, y1: 70, x2: x - 3, y2: 84 }, el('win-rain'));
      d.style.animationDuration = (0.7 + rnd() * 0.6).toFixed(2) + 's';
      d.style.animationDelay = (-rnd() * 1.4).toFixed(2) + 's';
    }

    /* ---------- helpers ---------- */

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

    /* Outside temperature: a daily curve (coldest at 3, warmest at 15 o'clock) plus the weather. */
    const outTemp = () => Math.round(15 + 6 * Math.cos(2 * Math.PI * (S.min - 900) / 1440) + WX[S.weather].dT);
    const ambient = () => 16 + 0.2 * outTemp();   // where the room drifts with the HVAC off

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

    /* A label pill in the living room; it is sized to its text and anchored
       left / middle / right of data-x. Nothing to measure while the slide is
       hidden, so it retries on the next render. */
    function tag(name, text, on) {
      const g = el('tag-' + name), t = g.querySelector('text'), r = g.querySelector('rect');
      g.classList.toggle('is-on', on);
      if (g._txt === text) return;
      g._txt = text;
      t.textContent = text;
      const w = Math.ceil(t.getComputedTextLength() + 42);
      if (w < 60) { g._txt = null; return; }
      r.setAttribute('width', w);
      const x = +g.dataset.x;
      const left = g.dataset.a === 'end' ? x - w : g.dataset.a === 'middle' ? x - w / 2 : x;
      g.setAttribute('transform', 'translate(' + left.toFixed(1) + ',' + g.dataset.y + ')');
    }

    const tile = (name, on) => root.querySelector('[data-tile="' + name + '"]').classList.toggle('is-active', on);
    const setOp = (name, v) => el(name).setAttribute('opacity', Math.max(0, Math.min(1, v)).toFixed(2));

    /* ---------- rendering ---------- */

    /* Everything driven by time and weather: sky, sun and moon, clouds, ground,
       lit windows, daylight in the living room. Cheap enough to run per simulated minute. */
    function renderWorld() {
      const wx = WX[S.weather];
      const sky = skyAt(S.min), n = sky.n, g = wx.grey;
      const top = rgb(mix(sky.top, mix(GREY_TOP, NIGHT.top, n), g));
      const bot = rgb(mix(sky.bot, mix(GREY_BOT, NIGHT.bot, n), g));
      const day = S.min >= SUNRISE && S.min < SUNSET;
      root.dataset.night = day ? '0' : '1';
      root.dataset.weather = S.weather;
      root.dataset.playing = S.playing ? '1' : '0';

      if (shownWx !== S.weather) {
        shownWx = S.weather;
        el('wx-icon').innerHTML = ICON(ICONS[wx.icon]);
        all('[data-act="weather"]').forEach((b) => b.classList.toggle('is-on', b.dataset.v === S.weather));
      }
      const out = outTemp();
      const label = S.weather === 'sunny' && !day ? 'Klar' : wx.label;   // no sun at night
      el('wx-label').textContent = label;
      el('wx-temp').textContent = out + ' °C';
      el('wx-state').textContent = label + ' · ' + out + ' °C';
      el('clock').textContent = hhmm(S.min);
      el('daypart').textContent = partOfDay(S.min);
      el('part-state').textContent = partOfDay(S.min) + ' · ' + hhmm(S.min);

      el('sky0').setAttribute('stop-color', top);
      el('sky1').setAttribute('stop-color', bot);
      el('isky0').setAttribute('stop-color', top);
      el('isky1').setAttribute('stop-color', bot);

      /* Garden */
      const grass = mix(GRASS_DAY, GRASS_NIGHT, n);
      el('hills-far').setAttribute('fill', rgb(mix(grass, mix(sky.bot, NIGHT.bot, 0.3 * n), 0.35)));
      el('hills-near').setAttribute('fill', rgb(grass));
      el('snow-ground').setAttribute('fill', rgb(mix(SNOW_DAY, SNOW_NIGHT, n)));
      el('leaves').setAttribute('fill', rgb(mix(LEAF_DAY, LEAF_NIGHT, n)));
      el('trunks').setAttribute('fill', rgb(mix(TRUNK_DAY, TRUNK_NIGHT, n)));
      sc.style.setProperty('--cloud', rgb(mix(hex(wx.cloud), CLOUD_NIGHT, n * 0.85)));
      el('house').style.filter = 'brightness(' + (1 - 0.52 * n - 0.1 * g * (1 - n)).toFixed(2) + ')';

      /* Sun and moon follow arcs across the sky; the living-room window shows them too. */
      const sun = el('sun'), moon = el('moon'), isun = el('i-sun'), imoon = el('i-moon');
      if (day) {
        const t = (S.min - SUNRISE) / (SUNSET - SUNRISE), k = Math.sin(Math.PI * t);
        sun.setAttribute('display', 'inline');
        sun.setAttribute('transform', 'translate(' + (60 + t * 780).toFixed(1) + ',' + (262 - 215 * k).toFixed(1) + ')');
        sun.setAttribute('opacity', wx.body);
        el('sun-disc').setAttribute('fill', rgb(mix(SUN_LOW, SUN_HIGH, Math.pow(k, 0.4))));
        isun.setAttribute('display', 'inline');
        isun.setAttribute('transform', 'translate(' + (70 + t * 200).toFixed(1) + ',' + (340 - 230 * k).toFixed(1) + ')');
        isun.setAttribute('opacity', wx.body);
        moon.setAttribute('display', 'none');
        imoon.setAttribute('display', 'none');
      } else {
        const t = ((S.min - SUNSET + 1440) % 1440) / (1440 - (SUNSET - SUNRISE)), k = Math.sin(Math.PI * t);
        moon.setAttribute('display', 'inline');
        moon.setAttribute('transform', 'translate(' + (60 + t * 780).toFixed(1) + ',' + (262 - 200 * k).toFixed(1) + ')');
        moon.setAttribute('opacity', wx.body);
        imoon.setAttribute('display', 'inline');
        imoon.setAttribute('transform', 'translate(' + (70 + t * 200).toFixed(1) + ',' + (340 - 220 * k).toFixed(1) + ')');
        imoon.setAttribute('opacity', wx.body);
        sun.setAttribute('display', 'none');
        isun.setAttribute('display', 'none');
      }
      const stars = Math.max(0, (n - 0.35) / 0.65) * (1 - 0.92 * g);
      setOp('stars', stars);
      setOp('i-stars', stars);

      /* Daylight in the living room */
      const lit = 1 - S.blind / 100, dayL = (1 - n) * wx.light;
      el('blind').setAttribute('transform', 'translate(0,' + (-(1 - S.blind / 100) * BLIND_TRAVEL) + ')');
      el('beam').setAttribute('opacity', (0.3 * lit * dayL).toFixed(3));
      setOp('i-dim', 0.42 * Math.max(n, 0.4 * g * (1 - n)));

      /* Lit windows of the house: stronger in the dark, dimmed by a closed blind */
      const dark = 0.25 + 0.75 * n, closed = 1 - 0.7 * S.blind / 100;
      const living = Math.max(S.ceiling ? 0.35 + 0.65 * S.bri / 100 : 0, S.floor ? 0.7 : 0);
      setOp('lit-living', living * dark * closed);
      setOp('halo-living', living * n * closed);
      setOp('tv-flicker', S.tv ? 0.5 * closed : 0);
      setOp('lit-kitchen', S.coffee ? 0.9 * dark : 0);
      setOp('halo-kitchen', S.coffee ? 0.8 * n : 0);
      setOp('lit-bedroom', S.bedroom ? 0.95 * dark : 0);
      setOp('halo-bedroom', S.bedroom ? 0.85 * n : 0);
      setOp('halo-garden', S.outdoor ? 0.35 + 0.65 * n : 0);
      setOp('halo-porch', S.outdoor ? 0.3 + 0.7 * n : 0);
      el('h-blind').setAttribute('height', (48 * S.blind / 100).toFixed(1));
    }

    function render() {
      /* Dashboard */
      all('[data-act="tab"]').forEach((b) => b.classList.toggle('is-on', b.dataset.v === S.tab));
      all('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== S.tab; });
      el('save').hidden = S.tab !== 'routines';
      all('[data-act="speed"]').forEach((b) => b.classList.toggle('is-on', b.dataset.v === S.speed));

      el('target').textContent = fmt(S.target) + ' °C';
      el('current').textContent = fmt(S.current) + ' °C';
      el('hvac-state').textContent = hvacText();
      el('hvac-state').classList.toggle('is-on', S.mode !== 'off');
      all('[data-act="mode"]').forEach((b) => b.classList.toggle('is-on', b.dataset.v === S.mode));

      ['ceiling', 'floor', 'bedroom', 'outdoor', 'coffee', 'tv'].forEach((k) =>
        root.querySelector('[data-act="toggle"][data-v="' + k + '"]').classList.toggle('is-on', S[k]));
      el('bri').textContent = S.bri + ' %';
      el('bri-bar').style.width = S.bri + '%';
      const lights = (S.ceiling ? 1 : 0) + (S.floor ? 1 : 0) + (S.bedroom ? 1 : 0) + (S.outdoor ? 1 : 0);
      el('light-state').textContent = lights ? lights + ' von 4 an' : 'aus';
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
        (S.bedroom ? W.bedroom : 0) + (S.outdoor ? W.outdoor : 0) +
        (S.coffee ? W.coffee : 0) + (S.tv ? W.tv : 0) +
        (S.mode === 'off' ? 0 : hvacRunning() ? W.hvacRun : W.hvacIdle);
      el('power').textContent = watts.toLocaleString('de-DE') + ' W';

      /* Living room */
      el('cone-ceiling').setAttribute('opacity', S.ceiling ? (0.35 + 0.65 * S.bri / 100).toFixed(2) : 0);
      el('halo-ceiling').setAttribute('opacity', S.ceiling ? (0.35 + 0.65 * S.bri / 100).toFixed(2) : 0);
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

      /* House: heat pump fan, chimney smoke, porch and garden light, TV glow */
      el('fan').classList.toggle('is-run', run);
      all('[data-el="smoke"]').forEach((p) => p.classList.toggle('is-on', run && S.mode === 'heat'));
      el('bulb-porch').classList.toggle('is-on', S.outdoor);
      el('bulb-garden').classList.toggle('is-on', S.outdoor);
      el('tv-flicker').classList.toggle('is-on', S.tv);

      renderWorld();
    }

    function renderRoutines() {
      el('routines').innerHTML = routines.map((r) => {
        const t = r.trigger;
        const trig = t.type === 'time' ? ICON(ICONS.clock) + t.at
          : t.type === 'temp' ? ICON(ICONS.therm) + '&gt; ' + t.above + ' °C'
          : t.type === 'sun' ? ICON(ICONS.sun) + 'Dämmerung'
          : t.type === 'weather' ? ICON(ICONS[WX[t.is].icon]) + WX[t.is].label
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

    /* ---------- behaviour ---------- */

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

    function runRoutine(r, why, patch) {
      apply(patch || r.patch);
      r.last = hhmm(S.min);
      firedId = r.id;
      log('Routine „' + r.name + '“ · ' + why);
      banner('Routine „' + r.name + '“ gestartet');
      renderRoutines();
      render();
    }

    function saveRoutine() {
      if (routines.length >= MAX_ROUTINES) return;
      customN++;
      const patch = {
        blind: Math.round(S.blindTarget), ceiling: S.ceiling, bri: S.bri, floor: S.floor,
        bedroom: S.bedroom, outdoor: S.outdoor, coffee: S.coffee, tv: S.tv, mode: S.mode, target: S.target
      };
      const r = { id: 'c' + customN, name: 'Eigene Routine ' + customN, icon: 'star', custom: true,
        trigger: { type: 'manual' }, patch: patch, desc: describe(patch), active: true, last: null };
      routines.push(r);
      log('Routine „' + r.name + '“ gespeichert');
      banner('Routine „' + r.name + '“ gespeichert');
      renderRoutines();
    }

    const NAMES = { ceiling: 'Deckenlicht', floor: 'Stehlampe', bedroom: 'Schlafzimmer', outdoor: 'Außenlicht', coffee: 'Kaffeemaschine', tv: 'Fernseher' };
    const MODES = { heat: 'Heizen', cool: 'Kühlen', off: 'Aus' };

    function syncClock() {
      clearInterval(clk);
      clk = S.playing && active ? setInterval(advance, SPEED_MS[S.speed]) : 0;
    }

    function setPlaying(on) {
      S.playing = on;
      syncClock();
    }

    /* One simulated minute: time and sun routines fire on their exact minute. */
    function advance() {
      S.min = (S.min + 1) % 1440;
      routines.forEach((r) => {
        if (!r.active) return;
        if (r.trigger.type === 'time' && toMin(r.trigger.at) === S.min) runRoutine(r, 'um ' + r.trigger.at);
        else if (r.trigger.type === 'sun') {
          if (S.min === SUNSET) runRoutine(r, 'bei Sonnenuntergang');
          else if (S.min === SUNRISE) runRoutine(r, 'bei Sonnenaufgang', r.patchAlt);
        }
      });
      renderWorld();
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

    function setWeather(w) {
      if (S.weather === w) return;
      S.weather = w;
      log('Wetter → ' + WX[w].label);
      routines.forEach((r) => {
        if (r.active && r.trigger.type === 'weather' && r.trigger.is === w) runRoutine(r, 'bei ' + WX[w].label);
      });
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
        case 'speed':
          S.speed = v;
          syncClock();
          break;
        case 'timeset':
          S.min = (Number(v) - 2 + 1440) % 1440;
          log('Uhr → ' + hhmm(Number(v)));
          setPlaying(true);
          break;
        case 'weather':
          setWeather(v);
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
      const amb = ambient();
      if (S.mode === 'heat' && S.current < S.target - 0.05) S.current = Math.min(S.target, S.current + 0.15);
      else if (S.mode === 'cool' && S.current > S.target + 0.05) S.current = Math.max(S.target, S.current - 0.15);
      else if (S.mode === 'off' && Math.abs(S.current - amb) > 0.05) S.current += S.current > amb ? -0.03 : 0.03;
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
