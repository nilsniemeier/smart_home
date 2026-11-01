/* Interaktiv-Pilot.

   Bausteine, die das Deck zum Anfassen machen:
     1. Klickbare Schaubilder   Vergleichsmatrix (Spalte/Zeile in den Fokus), Schichtenmodell (Sprung zur Detailfolie)
     2. Quiz mit Abstimmung     .quiz: Klick = +1 Stimme, Weiter (→) löst auf
     3. Mini-Demos              Hysterese-Regler, Internet-Schalter (Cloud gegen lokal)
     4. Navigation              I = Inhaltsverzeichnis, K = Notizen & Quellen

   Klicks auf Bedienelemente laufen über stopPropagation(), sonst blättert
   die Engine weiter (siehe README, „Interaktive Folien“). Alle Farben kommen
   aus den Theme-Variablen. */
(() => {
  'use strict';
  if (!window.Deck) return;

  const slides = Deck.slides;
  const SVGNS = 'http://www.w3.org/2000/svg';

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const de = (n, d = 1) => n.toFixed(d).replace('.', ',');
  const titleOf = (s) => ((s.querySelector('h1, h2, h3') || {}).textContent || '').replace(/\s+/g, ' ').trim();
  /* Folien werden nach Überschrift gefunden, nie nach Nummer. */
  const slideByTitle = (prefix) => slides.findIndex((s) => titleOf(s).startsWith(prefix));

  /* Container einer Demo soll nie die Engine weiterschalten. */
  const stopClicks = (root) => {
    root.addEventListener('click', (e) => e.stopPropagation());
    root.addEventListener('keydown', (e) => e.stopPropagation());
  };

  /* ============================================================
     Rücksprung nach einem Sprung per Schaubild
     ============================================================ */

  let backChip = null;
  let backTarget = -1;

  function clearBack() {
    if (backChip) backChip.remove();
    backChip = null;
    backTarget = -1;
  }

  function jumpWithReturn(target) {
    if (target < 0) return;
    const from = Deck.index;
    Deck.show(target);
    clearBack();
    backTarget = target;
    backChip = el('button', 'ix-back', '↩ Zurück zur Übersicht');
    backChip.type = 'button';
    backChip.addEventListener('click', (e) => {
      e.stopPropagation();
      clearBack();
      Deck.show(from, { fragment: 'all' });
    });
    document.body.appendChild(backChip);
  }

  document.addEventListener('deck:enter', (e) => {
    if (backChip && e.detail.index !== backTarget) clearBack();
  });

  /* ============================================================
     1a. Vergleichsmatrix: Spalte oder Zeile in den Fokus
     ============================================================ */

  function initMatrix(table) {
    const rows = Array.from(table.rows);
    let col = -1;
    let row = -1;

    const paint = () => {
      rows.forEach((tr, r) => {
        Array.from(tr.cells).forEach((cell, c) => {
          const header = r === 0 && c > 0;
          const rowHeader = c === 0 && r > 0;
          const isRowFocus = row === r;
          const isColFocus = col === c;
          // Kopfzeile und Zeilenköpfe bleiben lesbar, die Zellen dazwischen werden abgedunkelt.
          let dim = false;
          if (r > 0 && c > 0) dim = (col >= 0 && !isColFocus) || (row >= 0 && !isRowFocus);
          if (header) dim = col >= 0 && !isColFocus;
          if (rowHeader) dim = row >= 0 && !isRowFocus;
          cell.classList.toggle('ix-dim', dim);
          cell.classList.toggle('ix-focus', (header && isColFocus) || (rowHeader && isRowFocus));
        });
      });
      hint.textContent = col < 0 && row < 0
        ? 'Tipp: System oder Kriterium anklicken, um es hervorzuheben'
        : 'Hervorgehoben. Hier tippen: alles wieder zeigen';
      hint.classList.toggle('is-active', col >= 0 || row >= 0);
    };

    table.addEventListener('click', (e) => {
      const th = e.target.closest('th');
      if (!th) return;
      const tr = th.parentElement;
      // Eine Zeile, die noch nicht eingeblendet ist, ist nicht bedienbar: der Klick blättert weiter.
      if (tr.hasAttribute('data-fragment') && !tr.classList.contains('is-shown')) return;
      const r = rows.indexOf(tr);
      const c = Array.from(tr.cells).indexOf(th);
      if (r === 0 && c > 0) col = col === c ? -1 : c;
      else if (c === 0 && r > 0) row = row === r ? -1 : r;
      else return;
      e.stopPropagation();
      paint();
    });

    const hint = el('button', 'ix-hint');
    hint.type = 'button';
    hint.addEventListener('click', (e) => {
      e.stopPropagation();
      col = row = -1;
      paint();
    });
    table.after(hint);
    table.classList.add('ix-matrix');
    paint();

    // Beim erneuten Betreten der Folie startet sie ohne Fokus.
    table.closest('.slide').addEventListener('deck:enter', () => {
      col = row = -1;
      paint();
    });
  }

  /* ============================================================
     1b. Schichtenmodell: Klick springt zur Detailfolie
     ============================================================ */

  function initLayers(list) {
    stopClicks(list);
    list.querySelectorAll('li[data-ziel]').forEach((li) => {
      li.classList.add('ix-link');
      li.setAttribute('role', 'button');
      li.tabIndex = 0;
      const body = li.querySelector('.body');
      if (body) body.appendChild(el('span', 'ix-go', 'Zur Detailfolie →'));
      const go = () => {
        // Eine noch nicht eingeblendete Schicht ist nicht anklickbar.
        if (!li.classList.contains('is-shown')) return;
        jumpWithReturn(slideByTitle(li.dataset.ziel));
      };
      li.addEventListener('click', (e) => {
        if (!li.classList.contains('is-shown')) return;
        e.stopPropagation();
        go();
      });
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') go();
      });
    });
  }

  /* ============================================================
     2. Quiz mit Abstimmung
     ============================================================ */

  function initQuiz(root) {
    stopClicks(root);
    const richtig = +root.dataset.richtig;
    const opts = Array.from(root.querySelectorAll('.quiz__opt'));
    const explain = root.querySelector('.quiz__explain');
    const total = root.querySelector('.quiz__total');
    const votes = opts.map(() => 0);
    let revealed = false;

    const paint = () => {
      const sum = votes.reduce((a, b) => a + b, 0);
      const max = Math.max(1, ...votes);
      opts.forEach((o, i) => {
        o.querySelector('.quiz__bar i').style.width = (sum ? (votes[i] / max) * 100 : 0) + '%';
        o.querySelector('.quiz__n').textContent = votes[i];
      });
      total.textContent = sum === 0 ? 'Noch keine Stimmen' : sum + (sum === 1 ? ' Stimme' : ' Stimmen');
    };

    const reveal = (on) => {
      revealed = on;
      root.classList.toggle('is-revealed', on);
      opts.forEach((o, i) => {
        o.classList.toggle('is-richtig', on && i === richtig);
        o.classList.toggle('is-falsch', on && i !== richtig);
        o.setAttribute('aria-disabled', String(on));
      });
    };

    opts.forEach((o, i) => {
      o.addEventListener('click', (e) => {
        if (revealed) return;
        votes[i] = Math.max(0, votes[i] + (e.shiftKey || e.altKey ? -1 : 1));
        paint();
      });
    });

    root.querySelector('[data-act="reset"]').addEventListener('click', () => {
      votes.fill(0);
      paint();
    });
    root.querySelector('[data-act="aufloesen"]').addEventListener('click', () => {
      if (!revealed) Deck.next();
    });

    // Die Auflösung ist ein Fragment: Weiter (→) löst auf, Zurück (←) macht es rückgängig.
    if (explain) {
      new MutationObserver(() => reveal(explain.classList.contains('is-shown'))).observe(explain, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
    paint();
    // Die Engine kann das Fragment schon vor dem Start dieses Skripts aufgedeckt haben (Deep Link, Live-Reload).
    reveal(!!explain && explain.classList.contains('is-shown'));
  }

  /* ============================================================
     3a. Hysterese-Regler
     ============================================================ */

  function initHysterese(root) {
    stopClicks(root);
    const sliderSoll = root.querySelector('[data-i="soll"]');
    const sliderHyst = root.querySelector('[data-i="hyst"]');
    const out = (name) => root.querySelector('[data-o="' + name + '"]');
    const plot = root.querySelector('[data-el="plot"]');

    const STEPS = 560;
    const LOSS_RATE = 0.012;
    const HEAT_RATE = 0.024;
    const DEAD_STEPS = 10;
    const POWER_TAU = 0.09;
    const INERTIA = 0.11;
    const P = { x0: 150, x1: 1600, y0: 20, y1: 330 };

    /* Der Fühler rauscht ein wenig (wie im unteren Streifen der Animation, rund ±0,045 °C). Der Regler
       entscheidet auf dem gemessenen Wert: Ohne Hysterese reicht dieses Rauschen für Dauer-Takten. */
    const NOISE = 0.09;

    function simulate(soll, hyst) {
      const T = [], on = [];
      let temp = soll - 0.6, power = 0, vel = 0, cmd = false;
      let seed = 7;
      const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      const queue = new Array(DEAD_STEPS).fill(false);
      for (let i = 0; i <= STEPS; i++) {
        const measured = temp + (rnd() - 0.5) * NOISE;
        if (measured <= soll - hyst) cmd = true;
        else if (measured >= soll + hyst) cmd = false;
        queue.push(cmd);
        const effective = queue.shift();
        power += ((effective ? 1 : 0) - power) * POWER_TAU;
        const rate = HEAT_RATE * power - LOSS_RATE;
        vel += (rate - vel) * INERTIA;
        temp += vel;
        T.push(temp);
        on.push(cmd);
      }
      return { T, on };
    }

    function render() {
      const soll = +sliderSoll.value;
      const hyst = +sliderHyst.value;
      out('soll').textContent = de(soll) + ' °C';
      out('hyst').textContent = hyst === 0 ? 'keine' : '± ' + de(hyst) + ' °C';

      const { T, on } = simulate(soll, hyst);
      const lo = soll - 1.6, hi = soll + 1.6;
      const x = (i) => P.x0 + ((P.x1 - P.x0) * i) / STEPS;
      const y = (t) => P.y1 - ((P.y1 - P.y0) * (Math.max(lo, Math.min(hi, t)) - lo)) / (hi - lo);

      const pts = T.map((t, i) => x(i).toFixed(1) + ',' + y(t).toFixed(1)).join(' ');
      let strip = '';
      let start = -1;
      on.forEach((v, i) => {
        if (v && start < 0) start = i;
        if ((!v || i === on.length - 1) && start >= 0) {
          strip += '<rect class="hr-on" x="' + x(start).toFixed(1) + '" y="360" width="' + Math.max(1.5, x(i) - x(start)).toFixed(1) + '" height="34"></rect>';
          start = -1;
        }
      });
      const yOn = y(soll - hyst), yOff = y(soll + hyst), yS = y(soll);
      const ticks = [-1, 0, 1].map((k) => {
        const t = soll + k;
        return '<text class="hr-tick" x="' + (P.x0 - 14) + '" y="' + (y(t) + 8).toFixed(1) + '" text-anchor="end">' + de(t) + '</text>';
      }).join('');

      plot.innerHTML =
        '<rect class="hr-band" x="' + P.x0 + '" y="' + Math.min(yOn, yOff).toFixed(1) + '" width="' + (P.x1 - P.x0) + '" height="' + Math.max(2, Math.abs(yOn - yOff)).toFixed(1) + '"></rect>' +
        '<line class="hr-soll" x1="' + P.x0 + '" y1="' + yS.toFixed(1) + '" x2="' + P.x1 + '" y2="' + yS.toFixed(1) + '"></line>' +
        '<line class="hr-axis" x1="' + P.x0 + '" y1="' + P.y0 + '" x2="' + P.x0 + '" y2="' + P.y1 + '"></line>' +
        ticks +
        '<polyline class="hr-curve" points="' + pts + '"></polyline>' +
        '<text class="hr-label" x="' + (P.x0 - 14) + '" y="383" text-anchor="end">Heizung</text>' +
        strip;

      // Einschaltvorgänge = steigende Flanken des Schaltbefehls
      let switches = 0;
      for (let i = 1; i < on.length; i++) if (on[i] && !on[i - 1]) switches++;
      const duty = (on.filter(Boolean).length / on.length) * 100;
      const tail = T.slice(120);
      out('count').textContent = switches + '×';
      out('duty').textContent = Math.round(duty) + ' %';
      out('range').textContent = de(Math.min(...tail)) + ' – ' + de(Math.max(...tail)) + ' °C';
      root.classList.toggle('is-rattle', switches > 12);
    }

    sliderSoll.addEventListener('input', render);
    sliderHyst.addEventListener('input', render);
    root.querySelectorAll('[data-set]').forEach((b) => {
      b.addEventListener('click', () => {
        const [s, h] = b.dataset.set.split(',').map(Number);
        sliderSoll.value = s;
        sliderHyst.value = h;
        render();
      });
    });
    render();
  }

  /* ============================================================
     3b. Internet-Schalter: Cloud gegen lokal
     ============================================================ */

  function initInternet(root) {
    stopClicks(root);
    const sw = root.querySelector('[data-act="internet"]');
    const devs = Array.from(root.querySelectorAll('.net__dev'));
    let online = true;

    const paint = () => {
      root.classList.toggle('is-offline', !online);
      sw.setAttribute('aria-checked', String(online));
      sw.querySelector('.net__swtext').textContent = online ? 'Internet: an' : 'Internet: aus';
      devs.forEach((d) => {
        const cloud = d.dataset.cloud === 'ja';
        const down = !online && cloud;
        d.classList.toggle('is-down', down);
        const st = d.querySelector('.net__status');
        st.textContent = down ? st.dataset.off : st.dataset.on;
        d.querySelector('.net__hint').hidden = true;
      });
    };

    sw.addEventListener('click', () => {
      online = !online;
      paint();
    });

    devs.forEach((d) => {
      d.querySelector('.net__btn').addEventListener('click', () => {
        if (d.classList.contains('is-down')) {
          const hint = d.querySelector('.net__hint');
          hint.hidden = false;
          d.classList.remove('is-shake');
          void d.offsetWidth;
          d.classList.add('is-shake');
          return;
        }
        d.classList.toggle('is-lit');
        d.querySelector('.net__hint').hidden = true;
      });
    });

    root.closest('.slide').addEventListener('deck:enter', () => {
      online = true;
      devs.forEach((d) => d.classList.remove('is-lit', 'is-shake'));
      paint();
    });
    paint();
  }

  /* ============================================================
     3c. Ablauf zum Mitklicken: Fenster öffnen, Heizung aus
     Die Texte sind die der Folie „Beispiel für den Ablauf“.
     ============================================================ */

  function initAblauf(root) {
    stopClicks(root);
    const steps = Array.from(root.querySelectorAll('.ab__step'));
    const go = root.querySelector('.ab__go');
    const state = root.querySelector('.ab__state');
    const TEXT = [
      'Noch passiert nichts. Mit „Fenster öffnen“ geht es los.',
      'Schicht 1: Der Fenstersensor registriert, dass das Fenster geöffnet wird.',
      'Schicht 2: Die Information läuft per Zigbee-Funk zur Zentrale.',
      'Schicht 3: Die Zentrale kennt die Regel „Wenn Fenster offen, dann Heizung aus“ und sendet einen Befehl zurück.',
      'Schicht 1: Das Heizkörperthermostat empfängt den Befehl und dreht das Ventil zu. Die Heizung ist aus.'
    ];
    let n = 0;
    const paint = () => {
      steps.forEach((s, i) => {
        s.classList.toggle('is-on', i < n);
        s.classList.toggle('is-now', i === n - 1);
      });
      state.textContent = TEXT[n];
      go.textContent = n === 0 ? 'Fenster öffnen ▸' : n < steps.length ? 'Nächster Schritt ▸' : '↺ Von vorn';
    };
    go.addEventListener('click', () => {
      n = n >= steps.length ? 0 : n + 1;
      paint();
    });
    root.closest('.slide').addEventListener('deck:enter', () => {
      n = 0;
      paint();
    });
    paint();
  }

  /* ============================================================
     3d. Datenarten: lokal oder Cloud (Folie „Welche Daten verlassen das Haus?“)
     Aussage laut Folie „Die Antwort hängt allein an der Architektur“:
     lokal verlassen die Daten das Haus gar nicht, über eine Cloud bei jedem Schaltvorgang.
     ============================================================ */

  function initDaten(root) {
    stopClicks(root);
    const slide = root.closest('.slide');
    const cards = Array.from(slide.querySelectorAll('.card--data'));
    const chips = cards.map((c) => {
      const s = el('span', 'ix-chip');
      s.hidden = true;
      c.appendChild(s);
      return s;
    });
    const btns = Array.from(root.querySelectorAll('[data-modus]'));
    const TXT = { lokal: '✓ bleibt im Haus', cloud: '↗ verlässt das Haus' };
    let mode = '';
    const paint = () => {
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modus === mode)));
      chips.forEach((chip, i) => {
        chip.hidden = !mode;
        chip.textContent = mode ? TXT[mode] : '';
        cards[i].classList.toggle('ix-lokal', mode === 'lokal');
        cards[i].classList.toggle('ix-cloud', mode === 'cloud');
      });
    };
    btns.forEach((b) => b.addEventListener('click', () => {
      mode = mode === b.dataset.modus ? '' : b.dataset.modus;
      paint();
    }));
    slide.addEventListener('deck:enter', () => {
      mode = '';
      paint();
    });
    paint();
  }

  /* ============================================================
     3e. Entscheidungshelfer: drei Fragen, eine Empfehlung
     Alle Empfehlungen stammen aus den Folien „Entscheidungshilfe: Welches System
     für welchen Fall?“, „Welches System für welchen Fall?“ und „Die drei Fragen …“.
     ============================================================ */

  function initWahl(root) {
    stopClicks(root);
    const ANTW = {
      1: {
        neubau: ['Kabel (Bus)', 'KNX oder Loxone, Zentrale lokal (z. B. Home Assistant). Die Wände sind offen: eine einmalige Chance.'],
        kernsanierung: ['Kabel, wo möglich; sonst Hybrid', 'Bus für die Festinstallation, Funk für Wandtaster. Statik und Platz setzen Grenzen, Schlitzen ist der Kostentreiber.'],
        miete: ['Funk', 'Matter/Thread oder Zigbee: lokal, energiesparend, rückstandslos entfernbar.']
      },
      2: {
        ja: ['Lokal statt Cloud', 'Ohne Internet läuft nur ein lokales System: Bus, Zigbee oder Matter. Bei Tuya fallen Fernsteuerung und viele Routinen ohne Internet aus.'],
        nein: ['Cloud ist möglich', 'Für einzelne Geräte, den Einstieg oder ein knappes Budget: WLAN mit Tuya, bewusst und nur für Unkritisches. Sehr günstig, riesige Auswahl, aber Cloud-Zwang.']
      },
      3: {
        ja: ['Lokale Zentrale', 'Home Assistant oder ein deutscher Anbieter (Teil 5). Der Übertragungsweg ist beliebig, die Daten verlassen das Haus nicht.'],
        nein: ['Kein zusätzliches Kriterium', 'Dann entscheiden die Eingriffstiefe und die Frage nach dem Internet.']
      }
    };
    const chips = Array.from(root.querySelectorAll('.wahl__chip'));
    const rows = {};
    root.querySelectorAll('.wahl__row').forEach((r) => { rows[r.dataset.q] = r; });
    const choice = { 1: '', 2: '', 3: '' };

    const paint = () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(choice[c.dataset.q] === c.dataset.a)));
      Object.keys(rows).forEach((q) => {
        const a = ANTW[q][choice[q]];
        rows[q].classList.toggle('is-leer', !a);
        rows[q].querySelector('b').textContent = a ? a[0] : '—';
        rows[q].querySelector('span').textContent = a ? a[1] : 'Noch nicht gewählt.';
      });
    };
    chips.forEach((c) => c.addEventListener('click', () => {
      choice[c.dataset.q] = choice[c.dataset.q] === c.dataset.a ? '' : c.dataset.a;
      paint();
    }));
    root.querySelector('[data-act="reset"]').addEventListener('click', () => {
      choice[1] = choice[2] = choice[3] = '';
      paint();
    });
    root.closest('.slide').addEventListener('deck:enter', () => {
      choice[1] = choice[2] = choice[3] = '';
      paint();
    });
    paint();
  }

  /* ============================================================
     4a. Inhaltsverzeichnis (I)
     ============================================================ */

  const toc = el('div', 'ix-toc');
  toc.innerHTML = '<div class="ix-toc__panel" role="dialog" aria-label="Inhaltsverzeichnis"><h2>Inhalt</h2><ol></ol><p class="ix-toc__foot">Klick springt zum Kapitel · <kbd>I</kbd> oder <kbd>Esc</kbd> schließt</p></div>';
  document.body.appendChild(toc);
  const tocList = toc.querySelector('ol');

  function buildToc() {
    const items = [];
    slides.forEach((s, i) => {
      const h1 = s.querySelector('h1');
      if (!h1) return;
      const kicker = ((s.querySelector('.kicker') || {}).textContent || '').trim();
      const text = h1.textContent.replace(/\s+/g, ' ').trim();
      if (i === 0) items.push({ i, label: 'Start', title: text });
      else if (/^TEIL\s/i.test(kicker)) items.push({ i, label: 'Teil ' + (kicker.match(/\d+/) || [''])[0], title: text });
      else if (/^Fragen/.test(text)) items.push({ i, label: 'Ende', title: text });
    });
    return items;
  }

  function paintToc() {
    const items = buildToc();
    const now = Deck.index;
    let current = 0;
    items.forEach((it, k) => { if (it.i <= now) current = k; });
    tocList.replaceChildren(
      ...items.map((it, k) => {
        const next = items[k + 1];
        const li = el('li');
        const b = el('button', k === current ? 'is-current' : '');
        b.type = 'button';
        b.append(el('span', 'ix-toc__no', it.label), el('span', 'ix-toc__title', it.title));
        const from = it.i + 1;
        const to = next ? next.i : slides.length;
        b.append(el('span', 'ix-toc__range', to > from ? 'Folie ' + from + '–' + to : 'Folie ' + from));
        b.addEventListener('click', () => {
          closeToc();
          Deck.show(it.i);
        });
        li.appendChild(b);
        return li;
      })
    );
  }

  function openToc() {
    paintToc();
    toc.classList.add('is-on');
  }
  function closeToc() { toc.classList.remove('is-on'); }
  function toggleToc() { toc.classList.contains('is-on') ? closeToc() : openToc(); }
  toc.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.target === toc) closeToc();
  });

  /* ============================================================
     4b. Notizen und Quellen (K)
     ============================================================ */

  const notes = el('aside', 'ix-notes');
  notes.setAttribute('aria-label', 'Notizen und Quellen');
  notes.innerHTML = '<div class="ix-notes__head"><strong>Notizen &amp; Quellen</strong><button type="button" aria-label="Schließen">×</button></div><h3></h3><div class="ix-notes__body"></div>';
  document.body.appendChild(notes);
  const notesTitle = notes.querySelector('h3');
  const notesBody = notes.querySelector('.ix-notes__body');

  function paintNotes() {
    const s = slides[Deck.index];
    const n = s.querySelector('.notes');
    notesTitle.textContent = titleOf(s);
    notesBody.innerHTML = n && n.innerHTML.trim() ? n.innerHTML : '<p class="ix-notes__leer">Keine Notizen auf dieser Folie.</p>';
    // Adressen in den Notizen anklickbar machen
    notesBody.innerHTML = notesBody.innerHTML.replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    notesBody.scrollTop = 0;
  }
  function toggleNotes(force) {
    const on = force === undefined ? !notes.classList.contains('is-on') : force;
    notes.classList.toggle('is-on', on);
    document.body.classList.toggle('has-notes', on);
    if (on) paintNotes();
  }
  notes.querySelector('button').addEventListener('click', () => toggleNotes(false));
  // Scrollen im Panel darf die Folie nicht umblättern.
  ['wheel', 'touchstart', 'touchend', 'click'].forEach((t) => notes.addEventListener(t, (e) => e.stopPropagation(), { passive: true }));
  document.addEventListener('deck:enter', () => { if (notes.classList.contains('is-on')) paintNotes(); });

  /* ============================================================
     Schaltflächen und Tasten
     ============================================================ */

  const actions = el('div', 'ix-actions');
  [['☰', 'Inhaltsverzeichnis (I)', toggleToc], ['✎', 'Notizen & Quellen (K)', () => toggleNotes()]].forEach(([sym, label, fn]) => {
    const b = el('button', undefined, sym);
    b.type = 'button';
    b.title = label;
    b.setAttribute('aria-label', label);
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    actions.appendChild(b);
  });
  document.body.appendChild(actions);

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName || '')) return;
    if (e.key === 'i' || e.key === 'I') { e.preventDefault(); toggleToc(); }
    else if (e.key === 'k' || e.key === 'K') { e.preventDefault(); toggleNotes(); }
    else if (e.key === 'Escape') { closeToc(); toggleNotes(false); }
  });

  /* ============================================================
     Start: Bausteine an die Folien hängen
     ============================================================ */

  document.querySelectorAll('table[data-interaktiv="matrix"]').forEach(initMatrix);
  document.querySelectorAll('[data-interaktiv="layers"]').forEach(initLayers);
  document.querySelectorAll('[data-quiz]').forEach(initQuiz);
  document.querySelectorAll('[data-demo="hysterese-regler"]').forEach(initHysterese);
  document.querySelectorAll('[data-demo="internet"]').forEach(initInternet);
  document.querySelectorAll('[data-demo="ablauf"]').forEach(initAblauf);
  document.querySelectorAll('[data-demo="wahl"]').forEach(initWahl);
  document.querySelectorAll('[data-interaktiv="daten"]').forEach(initDaten);
})();
