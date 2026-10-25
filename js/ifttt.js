/* Animated IF-THIS-THEN-THAT illustration (Exkurs, Teil 2).
   A humidity value walks through a scripted curve; the two rules light up
   when their condition fires, a pulse travels down the wire and the switch
   flips. The run deliberately includes a rise to 79 % that triggers nothing
   — that is the dead band between 77 % and 80 % made visible.

   Clicks on the replay button must not reach the engine, hence
   stopPropagation() — see README, "Interaktive Folien". */
(() => {
  const ON_AT  = 80;   // humidity above this switches Switch 1 on
  const OFF_AT = 77;   // humidity below this switches it off
  const H_MIN  = 72, H_MAX = 86;

  /* The room is a real control loop, not a scripted curve. Moisture is added
     continuously (the shower); the fan removes it, but only after a dead time
     (the air in the duct has to move) and a ramp-up. On top of that the
     humidity itself has inertia, so it keeps going for a while in the
     direction it was already heading. That is what produces the overshoot:
     the fan starts at 80 % but the value still climbs past 82 %, and it stops
     at 77 % while the value keeps sinking to roughly 74 %. */
  const SOURCE     = 0.055;   // %/step added by the shower
  const EXTRACTION = 0.115;   // %/step removed at full fan power
  const DEAD_STEPS = 22;      // delay between switching and any effect
  const POWER_TAU  = 0.035;   // how fast the fan ramps up and down
  const INERTIA    = 0.045;   // how fast the rate of change itself may change
  const SETTLE     = 220;     // steps run before the visible loop starts
  const CYCLE      = 776;     // two full cycles, measured from the simulation

  const BAR = { y0: 60, y1: 430 };
  /* Calm playback: one simulation step every FRAMES_PER_STEP frames. */
  const FRAMES_PER_STEP = 2;

  /* Run the loop once up front so the visible animation starts in the steady
     state and can repeat seamlessly. */
  function buildCurve() {
    const out = [];
    let h = 76, vel = 0, power = 0, on = false;
    const queue = new Array(DEAD_STEPS).fill(false);
    for (let i = 0; i < SETTLE + CYCLE; i++) {
      if (!on && h > ON_AT)  on = true;
      if ( on && h < OFF_AT) on = false;
      queue.push(on);
      const delayed = queue.shift();
      power += ((delayed ? 1 : 0) - power) * POWER_TAU;
      const target = SOURCE - EXTRACTION * power;
      vel += (target - vel) * INERTIA;
      h += vel;
      if (i >= SETTLE) out.push({ h: h, on: on });
    }
    return out;
  }

  const yAt = h => BAR.y1 - (BAR.y1 - BAR.y0) * ((h - H_MIN) / (H_MAX - H_MIN));

  function init(root) {
    if (root.dataset.ready === '1') return;
    root.dataset.ready = '1';

    const curve = buildCurve();
    const fill   = root.querySelector('[data-el="fill"]');
    const marker = root.querySelector('[data-el="marker"]');
    const value  = root.querySelector('[data-el="value"]');
    const ruleOn  = root.querySelector('[data-el="rule-on"]');
    const ruleOff = root.querySelector('[data-el="rule-off"]');
    const device  = root.querySelector('[data-el="device"]');
    const devState= root.querySelector('[data-el="device-state"]');
    const pulse   = root.querySelector('[data-el="pulse"]');
    const log     = root.querySelector('[data-el="log"]');
    const replay  = root.querySelector('[data-el="replay"]');

    let raf = 0, pulseTimer = 0, flashTimer = 0;

    function stop() {
      cancelAnimationFrame(raf);
      clearTimeout(pulseTimer);
      clearTimeout(flashTimer);
      root.dataset.running = '0';
    }

    function reset() {
      cancelAnimationFrame(raf);
      clearTimeout(pulseTimer);
      clearTimeout(flashTimer);
      root.dataset.state = 'off';
      ruleOn.classList.remove('is-firing');
      ruleOff.classList.remove('is-firing');
      device.classList.remove('is-on');
      pulse.classList.remove('is-live', 'is-live--off');
      devState.textContent = 'AUS';
      devState.className = 'ift-device__state is-off';
      value.textContent = '—';
      log.replaceChildren();
      fill.setAttribute('y', BAR.y1);
      fill.setAttribute('height', 0);
      marker.setAttribute('transform', 'translate(0,' + BAR.y1 + ')');
    }

    function fire(on) {
      const rule = on ? ruleOn : ruleOff;
      rule.classList.add('is-firing');
      pulse.classList.add('is-live');
      pulse.classList.toggle('is-live--off', !on);
      clearTimeout(pulseTimer);
      pulseTimer = setTimeout(() => {
        device.classList.toggle('is-on', on);
        devState.textContent = on ? 'EIN' : 'AUS';
        devState.className = 'ift-device__state ' + (on ? 'is-on' : 'is-off');
        pulse.classList.remove('is-live', 'is-live--off');
      }, 1400);
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => rule.classList.remove('is-firing'), 1100);

      const row = document.createElement('li');
      row.textContent = on
        ? 'Feuchtigkeit über 80 % → Switch 1 EIN'
        : 'Feuchtigkeit unter 77 % → Switch 1 AUS';
      row.className = on ? 'is-on' : 'is-off';
      log.prepend(row);
      while (log.children.length > 3) log.lastElementChild.remove();
    }

    function run() {
      reset();
      root.dataset.running = '1';
      let i = 0, on = false, tick = 0;

      function frame() {
        /* Hold each step for a couple of frames to slow the whole run down. */
        if (tick++ % FRAMES_PER_STEP !== 0) {
          raf = requestAnimationFrame(frame);
          return;
        }
        const h = curve[i].h;
        const y = yAt(h);
        fill.setAttribute('y', y);
        fill.setAttribute('height', Math.max(0, BAR.y1 - y));
        marker.setAttribute('transform', 'translate(0,' + y + ')');
        value.textContent = h.toFixed(1).replace('.', ',') + ' %';

        /* The rule fires on the threshold; the room reacts later. */
        if (curve[i].on !== on) { on = curve[i].on; fire(on); }
        root.dataset.state = on ? 'on' : 'off';

        /* Wrap instead of stopping: the figure runs for as long as the
           slide is on screen. */
        if (++i >= curve.length) i = 0;
        raf = requestAnimationFrame(frame);
      }
      frame();
    }

    replay.addEventListener('click', e => { e.stopPropagation(); run(); });
    replay.addEventListener('pointerdown', e => e.stopPropagation());

    root._iftRun = run;
    root._iftStop = stop;
    reset();
  }

  /* Index-independent start, so the slide can be renumbered freely. */
  document.addEventListener('deck:enter', () => {
    /* Stop the loop once the slide is no longer shown. */
    document.querySelectorAll('[data-ifttt]').forEach(root => {
      if (root._iftStop && !root.closest('.slide.is-active')) root._iftStop();
    });
    document.querySelectorAll('.slide.is-active [data-ifttt]').forEach(root => {
      init(root);
      root._iftRun();
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-ifttt]').forEach(init);
    document.querySelectorAll('.slide.is-active [data-ifttt]').forEach(r => r._iftRun());
  });
})();
