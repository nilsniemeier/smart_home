/* ============================================================
   Presentation engine.

   Responsibilities:
     - scale the fixed 1920x1080 deck to fit any screen
     - slide + fragment navigation (keyboard, click, wheel, touch)
     - deep links (#/3 or #/3/2 for slide/fragment)
     - overview grid, theme switching, blackout, timer, help
     - state broadcast for the presenter window

   Everything is exposed on window.Deck so themes, slides or the
   console can drive it.
   ============================================================ */

(function () {
  'use strict';

  // Bump when CSS changes and a cached copy must not be reused.
  const DECK_VERSION = '62';

  const THEMES = [
    { id: 'aurora', label: 'Aurora' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'brutal', label: 'Brutal' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'glass', label: 'Glass' }
  ];

  const deck = document.querySelector('.deck');
  if (!deck) return;

  const slides = Array.from(deck.querySelectorAll('.slide'));
  const stage = document.querySelector('.deck-stage');
  const elProgress = document.querySelector('.deck-progress');
  const elCounter = document.querySelector('.deck-counter');
  const elToast = document.querySelector('.deck-toast');
  const elTimer = document.querySelector('.deck-timer');
  const elHelp = document.querySelector('.deck-help');
  const elThemes = document.querySelector('.deck-themes');
  const themeLink = document.getElementById('theme-css');

  const state = {
    index: 0,
    fragment: 0,       // how many fragments on the current slide are shown
    overview: false,
    blacked: false,
    timerStart: null,
    theme: localStorage.getItem('deck.theme') || THEMES[0].id
  };

  const channel = 'BroadcastChannel' in window ? new BroadcastChannel('deck') : null;

  /* ---------- scaling ---------- */

  function fit() {
    if (state.overview) return;
    const w = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--deck-w'));
    const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--deck-h'));
    const scale = Math.min(window.innerWidth / w, window.innerHeight / h);
    deck.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
    document.documentElement.style.setProperty('--deck-scale', scale);
  }

  /* ---------- fragments ---------- */

  function fragmentsOf(slide) {
    return Array.from(slide.querySelectorAll('[data-fragment]')).sort(
      (a, b) => (+a.dataset.fragment || 0) - (+b.dataset.fragment || 0)
    );
  }

  /* The distinct step numbers used on a slide, in order. Elements that share
     a number form one step and appear together — data-fragment="n" means
     "on the n-th click", as the README promises, not "the n-th element". */
  function fragmentSteps(slide) {
    const seen = [];
    fragmentsOf(slide).forEach((el) => {
      const n = +el.dataset.fragment || 0;
      if (seen.indexOf(n) === -1) seen.push(n);
    });
    return seen;
  }

  function fragmentCount(slide) {
    return fragmentSteps(slide).length;
  }

  function paintFragments() {
    const slide = slides[state.index];
    const steps = fragmentSteps(slide);
    const dimPrior = slide.dataset.fragmentMode === 'dim-prior';
    fragmentsOf(slide).forEach((el) => {
      const rank = steps.indexOf(+el.dataset.fragment || 0);
      const shown = rank < state.fragment;
      el.classList.toggle('is-shown', shown);
      el.classList.toggle('is-dimmed', dimPrior && shown && rank < state.fragment - 1);
    });
  }

  /* ---------- slide switching ---------- */

  function show(next, opts) {
    opts = opts || {};
    next = Math.max(0, Math.min(slides.length - 1, next));
    const prevIndex = state.index;
    const prev = slides[prevIndex];
    const slide = slides[next];
    const back = next < prevIndex;

    if (next !== prevIndex && !state.overview) {
      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      prev.classList.toggle('is-back', back);
      const cleanup = () => prev.classList.remove('is-leaving', 'is-back');
      prev.addEventListener('animationend', cleanup, { once: true });
      setTimeout(cleanup, 1200); // safety net if no animation runs
    }

    slides.forEach((s) => s.classList.remove('is-active'));
    slide.classList.toggle('is-back', back);
    slide.classList.add('is-active');

    state.index = next;
    // Entering a slide backwards reveals all of its fragments at once,
    // so stepping back feels like undo rather than a replay.
    const count = fragmentCount(slide);
    if (opts.fragment === 'all') state.fragment = count;
    else if (typeof opts.fragment === 'number') state.fragment = Math.min(count, opts.fragment);
    else state.fragment = 0;

    paintFragments();
    paintChrome();
    syncHash();
    broadcast();
    slide.dispatchEvent(new CustomEvent('deck:enter', { bubbles: true, detail: { index: next } }));
  }

  function paintChrome() {
    const pct = slides.length < 2 ? 100 : (state.index / (slides.length - 1)) * 100;
    if (elProgress) elProgress.style.width = pct + '%';
    if (elCounter) elCounter.textContent = (state.index + 1) + ' / ' + slides.length;
  }

  function next() {
    const steps = fragmentCount(slides[state.index]);
    if (state.fragment < steps) {
      state.fragment++;
      paintFragments();
      broadcast();
      return;
    }
    if (state.index < slides.length - 1) show(state.index + 1);
  }

  function prev() {
    if (state.fragment > 0) {
      state.fragment--;
      paintFragments();
      broadcast();
      return;
    }
    if (state.index > 0) show(state.index - 1, { fragment: 'all' });
  }

  /* ---------- deep links ---------- */

  function syncHash() {
    const h = '#/' + (state.index + 1) + (state.fragment ? '/' + state.fragment : '');
    if (location.hash !== h) history.replaceState(null, '', h);
  }

  function readHash() {
    const m = /^#\/(\d+)(?:\/(\d+))?/.exec(location.hash);
    if (!m) return null;
    return { index: (+m[1] || 1) - 1, fragment: +m[2] || 0 };
  }

  /* ---------- toast ---------- */

  let toastTimer;
  function toast(msg) {
    if (!elToast) return;
    elToast.textContent = msg;
    elToast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elToast.classList.remove('is-on'), 1400);
  }

  /* ---------- overview ---------- */

  function toggleOverview(force) {
    state.overview = force === undefined ? !state.overview : force;
    document.body.classList.toggle('overview', state.overview);
    if (state.overview) {
      deck.style.transform = 'none';
      slides[state.index].scrollIntoView({ block: 'center', behavior: 'smooth' });
    } else {
      fit();
    }
    broadcast();
  }

  deck.addEventListener('click', (e) => {
    if (!state.overview) return;
    const slide = e.target.closest('.slide');
    if (!slide) return;
    toggleOverview(false);
    show(slides.indexOf(slide));
  });

  /* ---------- themes ---------- */

  function setTheme(id) {
    if (!THEMES.some((t) => t.id === id)) return;
    state.theme = id;
    // Cache buster: without it a browser that already saw the deck keeps
    // serving an older theme file after an edit.
    themeLink.href = 'css/themes/' + id + '.css?v=' + DECK_VERSION;
    localStorage.setItem('deck.theme', id);
    document.body.dataset.theme = id;
    if (elThemes) {
      elThemes.querySelectorAll('button').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.theme === id));
      });
    }
    requestAnimationFrame(fit);
    broadcast();
  }

  function cycleTheme(dir) {
    const i = THEMES.findIndex((t) => t.id === state.theme);
    const t = THEMES[(i + (dir || 1) + THEMES.length) % THEMES.length];
    setTheme(t.id);
    toast('Theme: ' + t.label);
  }

  if (elThemes) {
    THEMES.forEach((t) => {
      const b = document.createElement('button');
      b.textContent = t.label;
      b.dataset.theme = t.id;
      b.addEventListener('click', () => setTheme(t.id));
      elThemes.appendChild(b);
    });
  }

  /* ---------- timer ---------- */

  function toggleTimer() {
    if (state.timerStart) {
      state.timerStart = null;
      elTimer.classList.remove('is-on');
      toast('Timer aus');
    } else {
      state.timerStart = Date.now();
      elTimer.classList.add('is-on');
      toast('Timer läuft');
    }
  }

  setInterval(() => {
    if (!state.timerStart || !elTimer) return;
    const s = Math.floor((Date.now() - state.timerStart) / 1000);
    elTimer.textContent =
      String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    broadcast();
  }, 500);

  /* ---------- fullscreen / blackout ---------- */

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => toast('Fullscreen blockiert'));
  }

  function toggleBlack() {
    state.blacked = !state.blacked;
    document.body.classList.toggle('is-blacked', state.blacked);
  }

  /* ---------- presenter window ---------- */

  function broadcast() {
    if (!channel) return;
    const slide = slides[state.index];
    const notes = slide.querySelector('.notes');
    channel.postMessage({
      type: 'state',
      index: state.index,
      total: slides.length,
      fragment: state.fragment,
      fragments: fragmentCount(slide),
      theme: state.theme,
      title: (slide.querySelector('h1, h2, h3') || {}).textContent || '',
      nextTitle: slides[state.index + 1]
        ? (slides[state.index + 1].querySelector('h1, h2, h3') || {}).textContent || ''
        : '',
      notes: notes ? notes.innerHTML : '',
      elapsed: state.timerStart ? Date.now() - state.timerStart : 0
    });
  }

  if (channel) {
    channel.onmessage = (e) => {
      const m = e.data || {};
      if (m.type === 'cmd') {
        if (m.cmd === 'next') next();
        if (m.cmd === 'prev') prev();
        if (m.cmd === 'goto') show(m.index);
        if (m.cmd === 'timer') toggleTimer();
        if (m.cmd === 'hello') broadcast();
      }
    };
  }

  function openPresenter() {
    window.open('presenter.html', 'deck-presenter', 'width=900,height=700');
  }

  /* ---------- input ---------- */

  const NEXT_KEYS = ['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter', 'n'];
  const PREV_KEYS = ['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace', 'p'];

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;

    if (k === 'Escape') {
      if (elHelp && elHelp.classList.contains('is-on')) return void elHelp.classList.remove('is-on');
      if (state.overview) return void toggleOverview(false);
      if (state.blacked) return void toggleBlack();
      return;
    }

    if (NEXT_KEYS.includes(k)) { e.preventDefault(); return void next(); }
    if (PREV_KEYS.includes(k)) { e.preventDefault(); return void prev(); }

    switch (k) {
      case 'Home': return void show(0);
      case 'End': return void show(slides.length - 1);
      case 'f': case 'F': return void toggleFullscreen();
      case 'o': case 'O': case 'Tab': e.preventDefault(); return void toggleOverview();
      case 'b': case 'B': case '.': return void toggleBlack();
      case 't': case 'T': return void toggleTimer();
      case 'c': case 'C': return void (elThemes && elThemes.classList.toggle('is-on'));
      case 'v': case 'V': return void cycleTheme(1);
      case 's': case 'S': return void openPresenter();
      case '?': case 'h': case 'H':
        return void (elHelp && elHelp.classList.toggle('is-on'));
    }

    // Number keys jump to a slide.
    if (/^[0-9]$/.test(k)) {
      const n = k === '0' ? 10 : +k;
      if (n <= slides.length) show(n - 1);
    }
  });

  if (elHelp) elHelp.addEventListener('click', () => elHelp.classList.remove('is-on'));

  // Click to advance — but never while drawing, and not on links.
  stage.addEventListener('click', (e) => {
    if (state.overview) return;
    if (document.body.classList.contains('ink-on')) return;
    if (e.target.closest('a, button, input, .deck-themes')) return;
    next();
  });

  // Wheel / trackpad, throttled so one gesture is one step.
  let wheelLock = 0;
  window.addEventListener('wheel', (e) => {
    if (state.overview) return;
    const now = Date.now();
    if (now - wheelLock < 420) return;
    if (Math.abs(e.deltaY) < 14 && Math.abs(e.deltaX) < 14) return;
    wheelLock = now;
    (e.deltaY > 0 || e.deltaX > 0) ? next() : prev();
  }, { passive: true });

  // Touch swipe.
  let tx = 0, ty = 0;
  window.addEventListener('touchstart', (e) => {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (state.overview || document.body.classList.contains('ink-on')) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    dx < 0 ? next() : prev();
  }, { passive: true });

  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', () => {
    const h = readHash();
    if (h && h.index !== state.index) show(h.index, { fragment: h.fragment });
  });

  /* ---------- boot ---------- */

  setTheme(state.theme);
  fit();
  const start = readHash();
  show(start ? start.index : 0, { fragment: start ? start.fragment : 0 });

  window.Deck = {
    next, prev, show, toast, fit,
    get index() { return state.index; },
    get slides() { return slides; },
    setTheme, cycleTheme, themes: THEMES,
    toggleOverview, toggleFullscreen, toggleBlack, toggleTimer, openPresenter
  };

  /* ---------- live reload (serve.py only) ---------- */

  // serve.py answers /__livereload with the newest file mtime; reload when
  // it changes; the hash keeps slide and fragment. Plain http.server and
  // GitHub Pages answer 404, which ends polling.
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    let stamp = null;
    const poll = () => fetch('__livereload', { cache: 'no-store' })
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => {
        if (stamp !== null && t !== stamp) return location.reload();
        stamp = t;
        setTimeout(poll, 1000);
      })
      .catch(() => { if (stamp !== null) setTimeout(poll, 3000); });
    poll();
  }
})();
