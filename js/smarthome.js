/* Smart-home OS demo (after the Home Assistant slides).
   Left a clickable dashboard, right a drawn room whose actors react:
   HVAC, two lights, two smart plugs and a blind. Runs fully offline;
   the room temperature is a tiny simulation that only ticks while the
   slide is on screen. All wattages are example values.

   Clicks must not reach the engine, hence stopPropagation(); buttons
   also take no focus, so Space/arrow keys keep driving the deck. */
(() => {
  const AMBIENT = 19;        // the room drifts here when the HVAC is off
  const BLIND_TRAVEL = 260;  // window height in the drawing
  const W = { ceiling: 12, floor: 9, coffee: 1000, tv: 80, hvacRun: 900, hvacIdle: 15 };

  const fmt = (n, d = 1) => n.toFixed(d).replace('.', ',');
  const clock = (s) => new Date().toLocaleTimeString('de-DE', s ? {} : { hour: '2-digit', minute: '2-digit' });

  function init(root) {
    if (root.dataset.ready === '1') return;
    root.dataset.ready = '1';

    const S = {
      target: 21, current: 19.5, mode: 'off',
      ceiling: false, bri: 70, floor: false,
      coffee: false, tv: false,
      blind: 0, blindTarget: 0
    };
    const el = (name) => root.querySelector('[data-el="' + name + '"]');
    const all = (sel) => root.querySelectorAll(sel);
    let tick = 0, move = 0;

    function log(text) {
      const list = el('log');
      const li = document.createElement('li');
      li.textContent = clock(true) + '  ' + text;
      list.prepend(li);
      while (list.children.length > 3) list.lastElementChild.remove();
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

    function render() {
      /* Dashboard */
      el('target').textContent = fmt(S.target) + ' °C';
      el('current').textContent = fmt(S.current) + ' °C';
      el('hvac-state').textContent = hvacText();
      el('hvac-state').classList.toggle('is-on', S.mode !== 'off');
      all('[data-act="mode"]').forEach(b => b.classList.toggle('is-on', b.dataset.v === S.mode));

      ['ceiling', 'floor', 'coffee', 'tv'].forEach(k =>
        root.querySelector('[data-act="toggle"][data-v="' + k + '"]').classList.toggle('is-on', S[k]));
      el('bri').textContent = S.bri + ' %';
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

      const watts = (S.ceiling ? Math.round(W.ceiling * S.bri / 100) : 0) + (S.floor ? W.floor : 0) +
        (S.coffee ? W.coffee : 0) + (S.tv ? W.tv : 0) +
        (S.mode === 'off' ? 0 : hvacRunning() ? W.hvacRun : W.hvacIdle);
      el('power').textContent = watts.toLocaleString('de-DE') + ' W';
      el('clock').textContent = clock(false);

      /* Room */
      el('blind').setAttribute('transform', 'translate(0,' + (-(1 - S.blind / 100) * BLIND_TRAVEL) + ')');
      el('beam').setAttribute('opacity', (0.28 * (1 - S.blind / 100)).toFixed(3));
      el('glow-ceiling').setAttribute('opacity', S.ceiling ? (0.3 + 0.7 * S.bri / 100).toFixed(2) : 0);
      el('bulb-ceiling').classList.toggle('is-on', S.ceiling);
      el('glow-floor').setAttribute('opacity', S.floor ? 0.85 : 0);
      el('bulb-floor').classList.toggle('is-on', S.floor);
      el('tv').classList.toggle('is-on', S.tv);
      el('tv-led').classList.toggle('is-on', S.tv);
      el('coffee-led').classList.toggle('is-on', S.coffee);
      all('[data-el="steam"]').forEach(p => p.classList.toggle('is-on', S.coffee));
      const run = hvacRunning();
      all('[data-el="air"]').forEach(p => {
        p.classList.toggle('is-heat', run && S.mode === 'heat');
        p.classList.toggle('is-cool', run && S.mode === 'cool');
      });
      el('ac-temp').textContent = fmt(S.current) + '°';

      const lbl = (name, text, on) => { const t = el(name); t.textContent = text; t.classList.toggle('is-on', on); };
      lbl('lbl-hvac', 'Klima · ' + hvacText(), S.mode !== 'off');
      lbl('lbl-ceiling', 'Deckenlicht · ' + (S.ceiling ? S.bri + ' %' : 'aus'), S.ceiling);
      lbl('lbl-floor', 'Stehlampe · ' + (S.floor ? 'an' : 'aus'), S.floor);
      lbl('lbl-coffee', 'Kaffeemaschine · ' + (S.coffee ? 'an' : 'aus'), S.coffee);
      lbl('lbl-tv', 'TV · ' + (S.tv ? 'an' : 'aus'), S.tv);
      lbl('lbl-blind', 'Jalousie · ' + Math.round(S.blind) + ' %', S.blind > 0);
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

    const NAMES = { ceiling: 'Deckenlicht', floor: 'Stehlampe', coffee: 'Kaffeemaschine', tv: 'Fernseher' };
    const MODES = { heat: 'Heizen', cool: 'Kühlen', off: 'Aus' };

    function act(a, v) {
      switch (a) {
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
          if (v === 'stop') { clearInterval(move); S.blindTarget = Math.round(S.blind); S.blind = S.blindTarget; log('Jalousie → Stopp bei ' + S.blind + ' %'); }
          else { log('Jalousie → ' + (v === 'up' ? 'Auf' : 'Ab')); moveBlind(v === 'up' ? 0 : 100); return; }
          break;
        case 'scene':
          if (v === 'morning') {
            Object.assign(S, { ceiling: true, bri: 100, floor: false, coffee: true, tv: false, mode: 'heat', target: 21 });
            moveBlind(0);
            log('Szene „Morgen“: Jalousie auf, Licht 100 %, Kaffee, Heizen 21 °C');
          } else if (v === 'cinema') {
            Object.assign(S, { ceiling: false, floor: true, tv: true, coffee: false });
            moveBlind(100);
            log('Szene „Kino“: Jalousie zu, Stehlampe, TV an');
          } else {
            Object.assign(S, { ceiling: false, floor: false, coffee: false, tv: false, mode: 'off' });
            log('Szene „Alles aus“: Licht, Steckdosen, Klima aus');
          }
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
      if (S.mode === 'heat' && S.current < S.target - 0.05) S.current += 0.1;
      else if (S.mode === 'cool' && S.current > S.target + 0.05) S.current -= 0.1;
      else if (S.mode === 'off' && Math.abs(S.current - AMBIENT) > 0.05) S.current += S.current > AMBIENT ? -0.02 : 0.02;
      render();
    }

    root._shStart = () => { if (!tick) tick = setInterval(step, 600); render(); };
    root._shStop = () => { clearInterval(tick); tick = 0; };
    render();
  }

  /* Index-independent start, so the slide can be renumbered freely. */
  document.addEventListener('deck:enter', () => {
    document.querySelectorAll('[data-smarthome]').forEach(root => {
      if (root._shStop && !root.closest('.slide.is-active')) root._shStop();
    });
    document.querySelectorAll('.slide.is-active [data-smarthome]').forEach(root => {
      init(root);
      root._shStart();
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-smarthome]').forEach(init);
    document.querySelectorAll('.slide.is-active [data-smarthome]').forEach(r => r._shStart());
  });
})();
