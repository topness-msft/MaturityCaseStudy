// =====================================================================
// presenter.js — Companion presenter window.
// Renders talk track, probes, expected responses, common mistakes, and
// choice-contextual probes for the current slide. Mirrors navigation
// to the main display via Sync.
// =====================================================================

(function(){

  const SLIDES = window.SLIDES;
  const FACILITATION = window.FACILITATION;

  const sync = new window.Sync({
    role: 'presenter',
    onEvent: (e) => {
      if (e.type === 'state.replaced' || e.type === 'slide.change') {
        render();
      } else if (e.type === 'choice.select' || e.type === 'reveal.toggle' || e.type === 'reveal.reset') {
        render();
      }
    }
  });

  const main      = document.getElementById('presenter-main');
  const syncPill  = document.getElementById('sync-pill');
  const btnPrev   = document.getElementById('nav-prev');
  const btnNext   = document.getElementById('nav-next');
  const btnReset  = document.getElementById('reset-session');
  const previewEl = document.getElementById('preview-next');
  const timerEl   = document.getElementById('presenter-timer');
  const timerElapsed = timerEl.querySelector('.elapsed');
  const timerTarget  = document.getElementById('timer-target');

  sync.onStatus((s) => {
    syncPill.classList.remove('connected','waiting','local');
    syncPill.classList.add(s);
    const label = s === 'connected' ? 'Connected' : s === 'waiting' ? 'Reconnecting…' : 'Display not open';
    syncPill.querySelector('.label').textContent = label;
  });

  // ----- Timer --------------------------------------------------------
  let slideEnteredAt = Date.now();
  let lastSlideId = null;

  function fmt(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.max(0, Math.floor(secs % 60));
    return `${m}:${s.toString().padStart(2,'0')}`;
  }

  function updateTimer() {
    const slide = SLIDES[sync.getSlideIndex()];
    if (!slide) return;
    if (slide.id !== lastSlideId) {
      slideEnteredAt = Date.now();
      lastSlideId = slide.id;
    }
    const elapsed = (Date.now() - slideEnteredAt) / 1000;
    timerElapsed.textContent = fmt(elapsed);
    const t = slide.timing || {};
    const total = (t.presentSeconds || 0) + (t.discussSeconds || 0);
    timerEl.classList.remove('warning','over');
    if (total > 0) {
      if (elapsed >= total) timerEl.classList.add('over');
      else if (elapsed >= total * 0.8) timerEl.classList.add('warning');
      const parts = [];
      if (t.presentSeconds) parts.push('Present ' + fmt(t.presentSeconds));
      if (t.discussSeconds) parts.push('Discuss ' + fmt(t.discussSeconds));
      timerTarget.textContent = '· ' + parts.join(' · ');
    } else {
      timerTarget.textContent = '';
    }
  }
  setInterval(updateTimer, 500);

  // ----- Element helpers ----------------------------------------------
  function el(tag, opts = {}, ...children) {
    const n = document.createElement(tag);
    if (opts.cls) n.className = opts.cls;
    if (opts.text != null) n.textContent = opts.text;
    if (opts.html != null) n.innerHTML = opts.html;
    if (opts.attrs) for (const [k,v] of Object.entries(opts.attrs)) n.setAttribute(k, v);
    children.flat().forEach(c => { if (c != null) n.append(c); });
    return n;
  }

  // ----- Render -------------------------------------------------------
  function render() {
    const idx = sync.getSlideIndex();
    const slide = SLIDES[idx];
    const fac = FACILITATION[slide.id] || {};

    main.innerHTML = '';

    // Header / slide title block
    const head = el('div', { cls: 'presenter-section' });
    head.appendChild(el('div', { cls: 'slide-eyebrow', text: slide.actLabel || '' }));
    head.appendChild(el('h2', { text: slide.title, attrs: { style: 'font-size:1.4rem;font-weight:600;line-height:1.3;margin-bottom:6px;letter-spacing:-0.01em' } }));
    if (slide.subtitle) head.appendChild(el('div', { text: slide.subtitle, attrs: { style: 'color:var(--text-sec);font-size:0.92rem;line-height:1.5' } }));
    main.appendChild(head);

    // Choice-contextual probe (top — most actionable)
    const choice = sync.getChoice(slide.id);
    if (choice && fac.choiceProbes && fac.choiceProbes[choice]) {
      const block = el('div', { cls: 'choice-probe' });
      block.appendChild(el('div', { cls: 'choice-probe-title', text: 'Room picked ' + choice + ' · contextual probe' }));
      block.appendChild(el('div', { cls: 'choice-probe-body', text: fac.choiceProbes[choice] }));
      main.appendChild(block);
    }

    // Talk track
    if (fac.talk) {
      const sec = el('div', { cls: 'presenter-section talk' });
      sec.appendChild(el('h4', { text: '· Talk Track' }));
      sec.appendChild(el('div', { cls: 'talk-body', text: fac.talk }));
      main.appendChild(sec);
    }

    // Probes
    if (fac.probes && fac.probes.length) {
      const sec = el('div', { cls: 'presenter-section probes' });
      sec.appendChild(el('h4', { text: '· Probing Questions' }));
      const ul = el('ul', { cls: 'probes-list' });
      fac.probes.forEach(p => ul.appendChild(el('li', { text: p })));
      sec.appendChild(ul);
      main.appendChild(sec);
    }

    // Expected responses (collapsible)
    if (fac.expected && fac.expected.length) {
      const sec = el('div', { cls: 'presenter-section expected' });
      sec.appendChild(el('h4', { text: '· Expected Responses' }));
      fac.expected.forEach((e, i) => {
        const det = el('details', { cls: 'expected-item' });
        if (i === 0) det.setAttribute('open', '');
        det.appendChild(el('summary', { text: e.response }));
        det.appendChild(el('div', { cls: 'reply', text: e.reply }));
        sec.appendChild(det);
      });
      main.appendChild(sec);
    }

    // Common mistakes
    if (fac.mistakes && fac.mistakes.length) {
      const sec = el('div', { cls: 'presenter-section mistakes' });
      sec.appendChild(el('h4', { text: '· Common Mistakes' }));
      const box = el('div', { cls: 'mistakes-list' });
      const ul = el('ul');
      fac.mistakes.forEach(m => ul.appendChild(el('li', { text: m })));
      box.appendChild(ul);
      sec.appendChild(box);
      main.appendChild(sec);
    }

    // Closing line
    if (fac.closingLine) {
      const sec = el('div', { cls: 'presenter-section talk' });
      sec.appendChild(el('h4', { text: '· Close with' }));
      sec.appendChild(el('div', { cls: 'talk-body', text: '"' + fac.closingLine + '"', attrs: { style: 'font-style:italic' } }));
      main.appendChild(sec);
    }

    // Preview next slide in footer
    const next = SLIDES[idx + 1];
    previewEl.innerHTML = '';
    if (next) {
      previewEl.appendChild(el('span', { text: 'Next:' }));
      previewEl.appendChild(el('strong', { text: ' ' + next.title }));
    } else {
      previewEl.appendChild(el('strong', { text: 'End of deck' }));
    }

    btnPrev.disabled = idx === 0;
    const isLast = idx === SLIDES.length - 1;
    btnNext.disabled = isLast;
    btnNext.style.visibility = isLast ? 'hidden' : '';

    updateTimer();
  }

  // ----- Wire nav -----------------------------------------------------
  btnPrev.addEventListener('click', () => {
    const i = sync.getSlideIndex();
    if (i > 0) { sync.setSlideIndex(i - 1); render(); }
  });
  btnNext.addEventListener('click', () => {
    const i = sync.getSlideIndex();
    if (i < SLIDES.length - 1) { sync.setSlideIndex(i + 1); render(); }
  });
  btnReset.addEventListener('click', () => {
    if (confirm('Reset all choices, reveals, and slide position?')) {
      sync.resetSession();
      slideEnteredAt = Date.now();
      render();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      const i = sync.getSlideIndex();
      if (i < SLIDES.length - 1) { sync.setSlideIndex(i + 1); render(); }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      const i = sync.getSlideIndex();
      if (i > 0) { sync.setSlideIndex(i - 1); render(); }
    }
  });

  // Initial render
  render();

})();
