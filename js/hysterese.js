/* Animated hysteresis illustration (Exkurs, Teil 2).
   Draws a temperature curve that heats and cools between the two switch
   points, plus the heater state underneath. A second strip shows the
   rattling that happens when the same controller runs without hysteresis.

   Clicks on the replay button must not reach the engine, hence
   stopPropagation() — see README, "Interaktive Folien". */
(() => {
  const SOLL = 22.0;
  const HYST = 0.5;
  const ON_AT  = SOLL - HYST;   // 21.5
  const OFF_AT = SOLL + HYST;   // 22.5

  const T_MIN = 21.0, T_MAX = 23.0;
  const PLOT = { x0: 190, x1: 1470, y0: 70, y1: 410 };
  const STEPS = 560;
  /* Playback is deliberately calm: one simulation step every FRAMES_PER_STEP
     animation frames, then a pause before the loop starts over. */
  const FRAMES_PER_STEP = 2;
  const LOOP_PAUSE_MS = 2600;
  /* A real radiator does not change the room temperature the moment the
     relay clicks: the water has to get warm and the heat has to reach the
     sensor. That dead time plus the thermal inertia of the room is why the
     curve overshoots — it keeps rising briefly after the burner stops at
     22,5 °C and keeps falling after it starts at 21,5 °C. */
  const LOSS_RATE  = 0.012;     // °C per step the room loses on its own
  const HEAT_RATE  = 0.024;     // °C per step at full burner output
  const DEAD_STEPS = 10;        // delay between switching and any effect
  const POWER_TAU  = 0.09;      // how fast the radiator warms up and cools
  const INERTIA    = 0.11;      // how fast the rate of change itself may change
  /* The raw simulation turns fairly sharply at its peaks. What is drawn gets
     a Gaussian smoothing of this width (in steps), which rounds the peaks off
     while the controller itself keeps switching on the raw values. */
  const SMOOTH_SIGMA = 14;

  const xAt = i => PLOT.x0 + (PLOT.x1 - PLOT.x0) * (i / STEPS);
  const yAt = t => PLOT.y1 - (PLOT.y1 - PLOT.y0) * ((t - T_MIN) / (T_MAX - T_MIN));

  /* Gaussian smoothing, mirrored at both ends so the start and end values stay put. */
  function smooth(values, sigma) {
    const h = Math.ceil(sigma * 3), kernel = [], last = values.length - 1;
    let sum = 0;
    for (let j = -h; j <= h; j++) {
      const w = Math.exp(-0.5 * (j / sigma) * (j / sigma));
      kernel.push(w);
      sum += w;
    }
    return values.map((_, i) => {
      let acc = 0;
      for (let j = -h; j <= h; j++) {
        let k = i + j;
        if (k < 0) k = -k;
        if (k > last) k = 2 * last - k;
        acc += kernel[j + h] * values[k];
      }
      return acc / sum;
    });
  }

  /* Pre-compute the whole run once: temperature and heater state per step. */
  function simulate() {
    const out = [];
    let temp = 22.35, vel = 0, power = 0, on = false;
    const queue = new Array(DEAD_STEPS).fill(false);
    for (let i = 0; i <= STEPS; i++) {
      if (!on && temp <= ON_AT)  on = true;
      if ( on && temp >= OFF_AT) on = false;
      out.push({ i, temp, on });
      queue.push(on);
      const delayed = queue.shift();
      power += ((delayed ? 1 : 0) - power) * POWER_TAU;
      vel += ((-LOSS_RATE + HEAT_RATE * power) - vel) * INERTIA;
      temp += vel;
    }
    const soft = smooth(out.map(r => r.temp), SMOOTH_SIGMA);
    out.forEach((r, i) => { r.temp = soft[i]; });
    return out;
  }

  /* Without hysteresis the controller switches on every crossing of the
     setpoint, so sensor noise alone makes it toggle constantly. */
  function simulateNoHyst() {
    const out = [];
    let seed = 7;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    let on = false;
    for (let i = 0; i <= STEPS; i++) {
      const temp = SOLL + (rnd() - 0.5) * 0.09;
      on = temp < SOLL;
      out.push({ i, temp, on });
    }
    return out;
  }

  function segments(rows) {
    const segs = [];
    let start = 0;
    for (let i = 1; i <= rows.length; i++) {
      if (i === rows.length || rows[i].on !== rows[start].on) {
        segs.push({ from: start, to: i - 1, on: rows[start].on });
        start = i;
      }
    }
    return segs;
  }

  function init(root) {
    if (root.dataset.ready === '1') return;
    root.dataset.ready = '1';

    const rows   = simulate();
    const noHyst = simulateNoHyst();

    const curve   = root.querySelector('[data-el="curve"]');
    const dot     = root.querySelector('[data-el="dot"]');
    const stateG  = root.querySelector('[data-el="state"]');
    const rattleG = root.querySelector('[data-el="rattle"]');
    const readT   = root.querySelector('[data-el="read-temp"]');
    const readS   = root.querySelector('[data-el="read-state"]');
    const badge   = root.querySelector('[data-el="badge"]');
    const countA  = root.querySelector('[data-el="count-hyst"]');
    const countB  = root.querySelector('[data-el="count-nohyst"]');
    const replay  = root.querySelector('[data-el="replay"]');

    /* The rattle strip is static — it is the "before" picture. */
    const sy = 505, sh = 34;
    segments(noHyst).forEach(seg => {
      const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('x', xAt(seg.from));
      r.setAttribute('width', Math.max(1, xAt(seg.to + 1) - xAt(seg.from)));
      r.setAttribute('y', sy);
      r.setAttribute('height', sh);
      r.setAttribute('class', seg.on ? 'hy-seg hy-seg--on' : 'hy-seg hy-seg--off');
      rattleG.appendChild(r);
    });
    countB.textContent = segments(noHyst).filter(s => s.on).length + '×';

    let raf = 0, loopTimer = 0;

    function stop() {
      cancelAnimationFrame(raf);
      clearTimeout(loopTimer);
      root.dataset.running = '0';
    }

    function reset() {
      cancelAnimationFrame(raf);
      clearTimeout(loopTimer);
      curve.setAttribute('points', '');
      stateG.replaceChildren();
      dot.setAttribute('opacity', '0');
      badge.setAttribute('opacity', '0');
      readT.textContent = '–,– °C';
      readS.textContent = '—';
      readS.setAttribute('class', 'hy-read__val');
      countA.textContent = '0×';
      root.dataset.running = '0';
    }

    function run() {
      reset();
      root.dataset.running = '1';
      const pts = [];
      let i = 0, onCount = 0, prevOn = rows[0].on, segStart = 0, tick = 0;

      /* The bar is drawn as one growing rectangle per heater state: the
         current segment is widened on every frame and only sealed off when
         the state flips. Appending a finished block per switch made the bar
         jump forward in steps instead of running with the curve. */
      let segEl = null;

      const openSeg = (from, on) => {
        segEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        segEl.setAttribute('x', xAt(from));
        segEl.setAttribute('width', 0);
        segEl.setAttribute('y', 445);
        segEl.setAttribute('height', sh);
        segEl.setAttribute('class', on ? 'hy-seg hy-seg--on' : 'hy-seg hy-seg--off');
        stateG.appendChild(segEl);
      };

      const growSeg = (from, to) => {
        if (segEl) segEl.setAttribute('width', Math.max(0, xAt(to) - xAt(from)));
      };

      openSeg(0, prevOn);

      function frame() {
        /* The curve advances in discrete steps, but the bar is widened on
           every single frame so it runs smoothly between them. */
        const prog = Math.min(1, (tick % FRAMES_PER_STEP) / FRAMES_PER_STEP);
        growSeg(segStart, i - 1 + prog);
        if (tick++ % FRAMES_PER_STEP !== 0) {
          raf = requestAnimationFrame(frame);
          return;
        }
        const row = rows[i];
        pts.push(xAt(row.i).toFixed(1) + ',' + yAt(row.temp).toFixed(1));
        curve.setAttribute('points', pts.join(' '));

        dot.setAttribute('cx', xAt(row.i));
        dot.setAttribute('cy', yAt(row.temp));
        dot.setAttribute('opacity', '1');
        dot.setAttribute('class', row.on ? 'hy-dot hy-dot--on' : 'hy-dot hy-dot--off');

        readT.textContent = row.temp.toFixed(2).replace('.', ',') + ' °C';
        readS.textContent = row.on ? 'HEIZUNG EIN' : 'HEIZUNG AUS';
        readS.setAttribute('class', 'hy-read__val ' + (row.on ? 'is-on' : 'is-off'));

        if (row.on !== prevOn) {
          growSeg(segStart, i);
          segStart = i;
          prevOn = row.on;
          openSeg(segStart, row.on);
          if (row.on) countA.textContent = (++onCount) + '×';
          /* Near the right edge the badge would run off the chart, so move
             the whole group to the left of the switching point. The shift has
             to be on the transform: a CSS `x` does not move an SVG <text>. */
          const bx = xAt(row.i);
          const shift = bx > 1150 ? -254 : 0;
          badge.setAttribute('transform', 'translate(' + (bx + shift) + ',' + yAt(row.temp) + ')');
          badge.setAttribute('opacity', '1');
          badge.querySelector('[data-el="badge-text"]').textContent =
            row.on ? 'EIN bei 21,5 °C' : 'AUS bei 22,5 °C';
        }

        if (i++ < STEPS) {
          raf = requestAnimationFrame(frame);
        } else {
          growSeg(segStart, STEPS);
          root.dataset.running = '0';
          /* Run continuously: pause on the finished picture, then start over. */
          loopTimer = setTimeout(run, LOOP_PAUSE_MS);
        }
      }
      frame();
    }

    replay.addEventListener('click', e => { e.stopPropagation(); run(); });
    replay.addEventListener('pointerdown', e => e.stopPropagation());

    root._hyRun = run;
    root._hyReset = reset;
    root._hyStop = stop;
    reset();
  }

  /* Start when the slide holding the figure is opened — index-independent,
     so the animation survives any later renumbering of the deck. */
  document.addEventListener('deck:enter', () => {
    /* Stop the loop on slides that are no longer shown, so it does not keep
       running in the background for the rest of the talk. */
    document.querySelectorAll('[data-hysterese]').forEach(root => {
      if (root._hyStop && !root.closest('.slide.is-active')) root._hyStop();
    });
    document.querySelectorAll('.slide.is-active [data-hysterese]').forEach(root => {
      init(root);
      root._hyRun();
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-hysterese]').forEach(init);
    document.querySelectorAll('.slide.is-active [data-hysterese]').forEach(r => r._hyRun());
  });
})();
