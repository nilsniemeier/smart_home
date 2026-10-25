/* ============================================================
   Presenter tools: laser pointer, spotlight, drawing on slides.

   Drawing lives on one full-viewport canvas. Strokes are stored
   per slide index, so switching slides hides your annotations and
   coming back restores them. Strokes are kept in normalized
   coordinates (0..1) so a resize or a theme change does not
   misplace them.
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.querySelector('.deck-ink');
  const laser = document.querySelector('.deck-laser');
  const spot = document.querySelector('.deck-spot');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const body = document.body;

  const PENS = {
    1: { color: '#ff3b3b', width: 5, mode: 'pen', label: 'Rot' },
    2: { color: '#ffd23b', width: 5, mode: 'pen', label: 'Gelb' },
    3: { color: '#3bff9a', width: 5, mode: 'pen', label: 'Grün' },
    4: { color: '#4d9bff', width: 5, mode: 'pen', label: 'Blau' },
    5: { color: '#ffffff', width: 5, mode: 'pen', label: 'Weiß' },
    6: { color: 'rgba(255,214,0,0.38)', width: 34, mode: 'marker', label: 'Marker' }
  };

  const state = {
    inkOn: false,
    laserOn: false,
    spotOn: false,
    pen: PENS[1],
    drawing: false,
    strokes: {},   // slideIndex -> [ {color,width,mode,points:[[x,y],...]} ]
    pointer: { x: 0.5, y: 0.5 }
  };

  const toast = (m) => window.Deck && window.Deck.toast(m);
  const slideIndex = () => (window.Deck ? window.Deck.index : 0);

  /* ---------- canvas sizing & repaint ---------- */

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    repaint();
  }

  function repaint() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const list = state.strokes[slideIndex()] || [];
    list.forEach(drawStroke);
  }

  function drawStroke(s) {
    if (s.points.length < 2) {
      // A single tap still deserves a visible dot.
      const [x, y] = toPx(s.points[0]);
      ctx.beginPath();
      ctx.fillStyle = s.color;
      ctx.arc(x, y, s.width / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.save();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (s.mode === 'marker') ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    const pts = s.points.map(toPx);
    ctx.moveTo(pts[0][0], pts[0][1]);
    // Quadratic smoothing through midpoints — removes the polyline look.
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2;
      const my = (pts[i][1] + pts[i + 1][1]) / 2;
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last[0], last[1]);
    ctx.stroke();
    ctx.restore();
  }

  const toPx = (p) => [p[0] * window.innerWidth, p[1] * window.innerHeight];
  const toNorm = (x, y) => [x / window.innerWidth, y / window.innerHeight];

  /* ---------- drawing input ---------- */

  function startStroke(e) {
    if (!state.inkOn) return;
    state.drawing = true;
    canvas.setPointerCapture(e.pointerId);
    const list = (state.strokes[slideIndex()] = state.strokes[slideIndex()] || []);
    list.push({
      color: state.pen.color,
      width: state.pen.width,
      mode: state.pen.mode,
      points: [toNorm(e.clientX, e.clientY)]
    });
    repaint();
  }

  function extendStroke(e) {
    if (!state.drawing) return;
    const list = state.strokes[slideIndex()];
    const s = list[list.length - 1];
    const p = toNorm(e.clientX, e.clientY);
    const prev = s.points[s.points.length - 1];
    // Skip sub-pixel jitter to keep stroke arrays small.
    if (Math.abs(p[0] - prev[0]) < 0.0015 && Math.abs(p[1] - prev[1]) < 0.0015) return;
    s.points.push(p);
    repaint();
  }

  function endStroke() { state.drawing = false; }

  canvas.addEventListener('pointerdown', startStroke);
  canvas.addEventListener('pointermove', extendStroke);
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointercancel', endStroke);

  /* ---------- ink controls ---------- */

  function setInk(on) {
    state.inkOn = on === undefined ? !state.inkOn : on;
    body.classList.toggle('ink-on', state.inkOn);
    toast(state.inkOn ? 'Zeichnen an — ' + state.pen.label : 'Zeichnen aus');
  }

  function setPen(n) {
    if (!PENS[n]) return;
    state.pen = PENS[n];
    if (!state.inkOn) setInk(true);
    else toast('Stift: ' + state.pen.label);
  }

  function undo() {
    const list = state.strokes[slideIndex()];
    if (!list || !list.length) return;
    list.pop();
    repaint();
  }

  function clearSlide() {
    state.strokes[slideIndex()] = [];
    repaint();
    toast('Slide geleert');
  }

  function clearAll() {
    state.strokes = {};
    repaint();
    toast('Alle Notizen gelöscht');
  }

  /* ---------- laser & spotlight ---------- */

  function setLaser(on) {
    state.laserOn = on === undefined ? !state.laserOn : on;
    laser.classList.toggle('is-on', state.laserOn);
    body.classList.toggle('laser-on', state.laserOn);
    toast(state.laserOn ? 'Laser an' : 'Laser aus');
  }

  function setSpot(on) {
    state.spotOn = on === undefined ? !state.spotOn : on;
    spot.classList.toggle('is-on', state.spotOn);
    paintSpot();
    toast(state.spotOn ? 'Spotlight an' : 'Spotlight aus');
  }

  let spotRadius = 180;

  function paintSpot() {
    if (!state.spotOn) return;
    const x = state.pointer.x * window.innerWidth;
    const y = state.pointer.y * window.innerHeight;
    spot.style.background =
      'radial-gradient(circle ' + spotRadius + 'px at ' + x + 'px ' + y + 'px,' +
      ' rgba(0,0,0,0) 0%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.82) 100%)';
  }

  window.addEventListener('pointermove', (e) => {
    state.pointer = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    if (state.laserOn) {
      laser.style.left = e.clientX + 'px';
      laser.style.top = e.clientY + 'px';
    }
    paintSpot();
  });

  window.addEventListener('wheel', (e) => {
    if (!state.spotOn) return;
    spotRadius = Math.max(70, Math.min(620, spotRadius - e.deltaY * 0.4));
    paintSpot();
  }, { passive: true });

  /* ---------- keys ----------
     Captured before the engine so number keys pick a pen while ink
     is active instead of jumping to a slide. */

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;

    if (state.inkOn && /^[1-6]$/.test(k)) {
      e.stopPropagation();
      e.preventDefault();
      return setPen(+k);
    }

    switch (k) {
      case 'd': case 'D': e.stopPropagation(); return setInk();
      case 'l': case 'L': e.stopPropagation(); return setLaser();
      case 'm': case 'M': e.stopPropagation(); return setSpot();
      case 'z': case 'Z': e.stopPropagation(); return undo();
      case 'x': e.stopPropagation(); return clearSlide();
      case 'X': e.stopPropagation(); return clearAll();
      case 'Escape':
        if (state.inkOn) { e.stopPropagation(); return setInk(false); }
        if (state.laserOn) { e.stopPropagation(); return setLaser(false); }
        if (state.spotOn) { e.stopPropagation(); return setSpot(false); }
        return;
    }
  }, true);

  document.addEventListener('deck:enter', repaint);
  window.addEventListener('resize', resize);
  resize();

  window.DeckTools = { setInk, setPen, setLaser, setSpot, undo, clearSlide, clearAll, PENS };
})();
