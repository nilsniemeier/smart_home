/* Dolphin sounds for the farewell slide ([data-dolphin]).
   Synthesised with the Web Audio API, so there is no audio file and no
   licence to credit: rising chirps, two whistles with vibrato and a click
   train that speeds up into a buzz. Plays once when the slide is entered
   and is cut off as soon as another slide is shown.

   Browsers only allow audio after a user gesture. Arriving by key press or
   click is fine; if the context stays suspended (e.g. the slide was reached
   from the presenter window), the slide simply stays silent. */
(() => {
  let ctx = null;
  let master = null;

  function stop() {
    if (!ctx) return;
    const c = ctx;
    ctx = null;
    try { master.gain.setTargetAtTime(0, c.currentTime, 0.03); } catch (e) { /* already closed */ }
    setTimeout(() => c.close().catch(() => {}), 300);
  }

  /* One whistle: a sine gliding through the given frequencies, with a fast
     vibrato and a quiet octave on top. */
  function whistle(t, dur, freqs, vol) {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.05);
    gain.gain.setValueAtTime(vol, t + dur - 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    gain.connect(master);

    [[1, 1], [2, 0.22]].forEach(([mult, level]) => {
      const osc = ctx.createOscillator();
      const part = ctx.createGain();
      part.gain.value = level;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[0] * mult, t);
      freqs.slice(1).forEach((f, i) => {
        osc.frequency.exponentialRampToValueAtTime(f * mult, t + dur * (i + 1) / (freqs.length - 1));
      });
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = 26;
      depth.gain.value = 70 * mult;
      lfo.connect(depth);
      depth.connect(osc.frequency);
      osc.connect(part);
      part.connect(gain);
      osc.start(t); lfo.start(t);
      osc.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
    });
  }

  /* Click train: n short filtered noise bursts whose gap shrinks from
     gap0 to gap1 seconds, ending in a creaky buzz. */
  function clicks(t, n, gap0, gap1, vol) {
    const len = Math.floor(ctx.sampleRate * 0.012);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.18));

    let at = t;
    for (let i = 0; i < n; i++) {
      const src = ctx.createBufferSource();
      const band = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      src.buffer = buf;
      band.type = 'bandpass';
      band.frequency.value = 4200 + Math.random() * 1200;
      band.Q.value = 1.6;
      gain.gain.value = vol;
      src.connect(band); band.connect(gain); gain.connect(master);
      src.start(at);
      at += gap0 * Math.pow(gap1 / gap0, i / (n - 1));
    }
  }

  function play() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    stop();
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.28;
    master.connect(ctx.destination);
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const t = ctx.currentTime + 0.15;
    [0, 0.22, 0.44].forEach(d => whistle(t + d, 0.15, [2800, 6400], 0.5));
    whistle(t + 0.95, 0.95, [3200, 6800, 3800], 0.6);
    clicks(t + 2.1, 38, 0.07, 0.007, 0.9);
    whistle(t + 3.1, 0.9, [5400, 2700, 6200], 0.6);
    [4.2, 4.42].forEach(d => whistle(t + d, 0.15, [2800, 6400], 0.5));
  }

  document.addEventListener('deck:enter', () => {
    if (document.querySelector('.slide.is-active[data-dolphin]')) play();
    else stop();
  });
})();
