// =====================================================================
// deck.js — Main deck rendering and interaction.
// Renders one slide at a time based on its `render` key, wires reveal
// beats, poll choices, and navigation. Both self-paced and presenter
// modes share this; mode-specific behavior is gated on `MODE`.
// =====================================================================

(function(){

  const SLIDES = window.SLIDES;
  const params = new URLSearchParams(window.location.search);
  const MODE = (params.get('mode') === 'present') ? 'present' : 'self';

  // ----- Sync ---------------------------------------------------------
  const sync = new window.Sync({
    role: 'deck',
    onEvent: (e) => {
      if (e.type === 'state.replaced') {
        renderSlide(sync.getSlideIndex(), { skipAnim: true });
        return;
      }
      if (e.type === 'slide.change') {
        if (currentIndex !== e.index) renderSlide(e.index);
        return;
      }
      if (e.type === 'reveal.toggle' || e.type === 'reveal.reset' || e.type === 'choice.select') {
        // Re-render current slide so the UI reflects the new state.
        if (SLIDES[currentIndex].id === e.slideId) {
          renderSlide(currentIndex, { skipAnim: true, fromSync: true });
        }
      }
    }
  });

  // ----- DOM refs -----------------------------------------------------
  const stage      = document.getElementById('slide-stage');
  const actBadge   = document.getElementById('act-badge');
  const modePill   = document.getElementById('mode-pill');
  const syncPill   = document.getElementById('sync-pill');
  const counter    = document.getElementById('slide-counter');
  const progress   = document.getElementById('progress-fill');
  const btnPrev    = document.getElementById('nav-prev');
  const btnNext    = document.getElementById('nav-next');
  const btnReset   = document.getElementById('nav-reset');
  const btnOutline = document.getElementById('outline-toggle');
  const drawer     = document.getElementById('outline-drawer');
  const overlay    = document.getElementById('outline-overlay');
  const drawerClose= document.getElementById('outline-close');
  const outlineList= document.getElementById('outline-list');

  modePill.textContent = MODE === 'present' ? 'Presenter-led' : 'Self-paced';

  sync.onStatus((s) => {
    syncPill.classList.remove('connected','waiting','local');
    syncPill.classList.add(s);
    const label = s === 'connected' ? 'Connected' : s === 'waiting' ? 'Waiting…' : 'Local';
    syncPill.querySelector('.label').textContent = label;
  });
  if (MODE === 'self') {
    // Self-paced doesn't need a sync pill — hide it.
    syncPill.style.display = 'none';
  }

  // ----- Renderers ----------------------------------------------------
  const RENDERERS = {
    title:      renderTitle,
    stages:     renderStages,
    video:      renderVideo,
    setup:      renderSetup,
    poll:       renderPoll,
    maturity:   renderMaturity,
    bridge:     renderBridge,
    patterns:   renderPatterns,
    bet:        renderBet,
    gaps:       renderGaps,
    opmodel:    renderOpModel,
    mirror:     renderMirror,
    three:      renderThree,
    resources:  renderResources
  };

  // ----- State --------------------------------------------------------
  let currentIndex = sync.getSlideIndex() || 0;
  let mirrorPauseAt = 0;     // timestamp when slide 12 entered (for forced pause)

  // ----- Slide chrome -------------------------------------------------
  function setChrome(slide) {
    actBadge.innerHTML = slide.act > 0
      ? `<span class="num">${slide.act}</span>${slide.actLabel || ''}`
      : `<span>${slide.actLabel || ''}</span>`;
    counter.textContent = `${currentIndex+1} / ${SLIDES.length}`;
    progress.style.width = (((currentIndex+1) / SLIDES.length) * 100).toFixed(1) + '%';
    btnPrev.disabled = currentIndex === 0;
    btnNext.textContent = currentIndex === SLIDES.length - 1 ? 'Finish' : 'Next →';
  }

  // ----- Render driver ------------------------------------------------
  function renderSlide(index, opts = {}) {
    if (index < 0 || index >= SLIDES.length) return;
    currentIndex = index;
    const slide = SLIDES[index];
    setChrome(slide);
    document.title = slide.title + ' · Woodgrove Bank Maturity Discussion';
    if (!opts.fromSync) sync.setSlideIndex(index);
    const fade = !opts.skipAnim;
    if (fade) stage.classList.add('fading');
    setTimeout(() => {
      stage.innerHTML = '';
      const renderer = RENDERERS[slide.render];
      const node = renderer ? renderer(slide) : renderFallback(slide);
      stage.appendChild(node);
      stage.classList.remove('fading');
      if (slide.id === 'mirror') mirrorPauseAt = Date.now();
    }, fade ? 200 : 0);
    updateOutline();
  }

  function el(tag, opts = {}, ...children) {
    const n = document.createElement(tag);
    if (opts.cls) n.className = opts.cls;
    if (opts.html != null) n.innerHTML = opts.html;
    if (opts.text != null) n.textContent = opts.text;
    if (opts.attrs) for (const [k,v] of Object.entries(opts.attrs)) n.setAttribute(k, v);
    if (opts.on) for (const [ev, fn] of Object.entries(opts.on)) n.addEventListener(ev, fn);
    children.flat().forEach(c => { if (c != null) n.append(c); });
    return n;
  }

  function header(slide) {
    const wrap = el('div');
    wrap.appendChild(el('div', { cls: 'slide-eyebrow', text: slide.actLabel || '' }));
    wrap.appendChild(el('h1', { cls: 'slide-title', html: slide.title }));
    const sub = (slide.subtitles && slide.subtitles[MODE]) || slide.subtitle;
    if (sub) wrap.appendChild(el('p', { cls: 'slide-subtitle', html: sub }));
    return wrap;
  }

  function reflectionCard(promptText) {
    // Always return a node so callers can `appendChild` without a null check.
    // In presenter mode (or when no prompt is configured) we return an empty
    // document fragment, which appendChild accepts and renders nothing.
    if (MODE !== 'self' || !promptText) return document.createDocumentFragment();
    const c = el('div', { cls: 'reflection' });
    c.appendChild(el('div', { cls: 'reflection-title', text: 'Before you continue' }));
    c.appendChild(el('div', { cls: 'reflection-prompt', text: promptText }));
    return c;
  }

  function insightCard(slide, body) {
    // Always render visible; the staged-reveal animation was only a nicety
    // and was unreliable in same-window flows (sync echoes are suppressed).
    const c = el('div', { cls: 'insight in', attrs: { 'data-reveal': 'insight' } });
    c.appendChild(el('div', { cls: 'insight-eyebrow', text: 'Key insight' }));
    c.appendChild(el('div', { cls: 'insight-body', text: body }));
    return c;
  }

  function renderFallback(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    wrap.appendChild(el('p', { text: 'Slide renderer not implemented: ' + slide.render }));
    return wrap;
  }

  // ----- Slide 1: title ----------------------------------------------
  function renderTitle(slide) {
    const wrap = el('div', { cls: 'mirror' });
    if (slide.config.heroImage) {
      const pic = document.createElement('picture');
      if (slide.config.heroImageWebp) {
        const src = document.createElement('source');
        src.type = 'image/webp';
        src.srcset = slide.config.heroImageWebp;
        pic.appendChild(src);
      }
      const img = document.createElement('img');
      img.src = slide.config.heroImage;
      img.alt = slide.config.heroAlt || '';
      img.className = 'hero-still';
      pic.appendChild(img);
      wrap.appendChild(pic);
    }
    if (slide.config.eyebrow) {
      wrap.appendChild(el('div', { cls: 'slide-eyebrow', text: slide.config.eyebrow }));
    }
    wrap.appendChild(el('h1', { cls: 'mirror-line1', text: slide.title, attrs: { style: 'font-size:3.2rem' } }));
    wrap.appendChild(el('div', { cls: 'slide-subtitle', text: slide.subtitle, attrs: { style: 'text-align:center;font-size:1.3rem' } }));
    if (slide.config.tagline) {
      wrap.appendChild(el('div', {
        text: slide.config.tagline,
        attrs: { style: 'text-align:center;margin-top:32px;font-size:1.05rem;color:var(--text-muted);max-width:560px;margin-left:auto;margin-right:auto' }
      }));
    }
    return wrap;
  }

  // ----- Slide 2: stages ---------------------------------------------
  function renderStages(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    wrap.appendChild(reflectionCard(slide.config.selfPrompt));

    const list = el('div', { cls: 'stages' });
    if (MODE === 'self') {
      // Mutually exclusive radio behavior — clicking selects this stage as the highest level achieved
      const selected = sync.getChoice(slide.id);
      const selectedStage = slide.config.stages.find(s => s.id === selected) || null;
      slide.config.stages.forEach(s => {
        const row = el('button', { cls: 'stage' + (selected === s.id ? ' revealed ' + s.accent : ''), attrs: { type: 'button' } });
        row.appendChild(el('span', { cls: 'stage-num', text: s.label[0] }));
        const body = el('div');
        body.appendChild(el('div', { cls: 'stage-label', text: s.label }));
        body.appendChild(el('div', { cls: 'stage-detail', text: s.detail }));
        row.appendChild(body);
        row.appendChild(el('span', { cls: 'stage-count', text: '' }));
        row.addEventListener('click', () => {
          sync.selectChoice(slide.id, s.id);
          renderSlide(currentIndex, { skipAnim: true });
        });
        list.appendChild(row);
      });

      // Side-by-side layout: stages on the left, insight on the right
      const grid = el('div', { cls: 'stages-grid' });
      grid.appendChild(list);
      const aside = el('div', { cls: 'stages-aside' });
      if (selectedStage) {
        const i = el('div', { cls: 'insight in stage-insight ' + (selectedStage.accent || '') });
        i.appendChild(el('div', { cls: 'insight-eyebrow', text: 'If you\'re at ' + selectedStage.label }));
        i.appendChild(el('div', { cls: 'insight-body', text: selectedStage.insight || slide.config.selfInsight }));
        aside.appendChild(i);
      } else {
        const ph = el('div', { cls: 'stage-insight-placeholder' });
        ph.appendChild(el('div', { cls: 'stage-insight-placeholder-icon', text: '←' }));
        ph.appendChild(el('div', { text: 'Pick the highest level that\'s true to see what rooms at that stage typically face next.' }));
        aside.appendChild(ph);
      }
      grid.appendChild(aside);
      wrap.appendChild(grid);
    } else {
      // Presenter mode — progressive reveal, click each stage to show it
      slide.config.stages.forEach((s, idx) => {
        const revealed = sync.isRevealed(slide.id, s.id);
        const row = el('button', { cls: 'stage ' + (revealed ? 'revealed ' + s.accent : ''), attrs: { type: 'button' } });
        row.appendChild(el('span', { cls: 'stage-num', text: idx + 1 }));
        const body = el('div');
        body.appendChild(el('div', { cls: 'stage-label', text: s.label }));
        body.appendChild(el('div', { cls: 'stage-detail', text: s.detail }));
        row.appendChild(body);
        const count = el('span', { cls: 'stage-count', text: revealed ? '~' + s.expectedPct + '%' : '—' });
        row.appendChild(count);
        row.addEventListener('click', () => {
          sync.setReveal(slide.id, s.id, !revealed);
          renderSlide(currentIndex, { skipAnim: true });
        });
        list.appendChild(row);
      });
      wrap.appendChild(list);
      // Show insight after all four revealed
      const allRevealed = slide.config.stages.every(s => sync.isRevealed(slide.id, s.id));
      if (allRevealed) wrap.appendChild(insightCard(slide, slide.config.selfInsight));
      if (allRevealed && !sync.isRevealed(slide.id, 'insight')) sync.setReveal(slide.id, 'insight', true);
    }
    return wrap;
  }

  // ----- Slide 3: video ----------------------------------------------
  function renderVideo(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    const shell = el('div', { cls: 'video-shell' });
    const frame = el('div', { cls: 'video-frame' });
    const iframe = el('iframe', { attrs: {
      src: `https://www.youtube-nocookie.com/embed/${slide.config.youtubeId}?rel=0&modestbranding=1`,
      title: 'Sarah Chen introduces Woodgrove Bank',
      allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      allowfullscreen: ''
    }});
    frame.appendChild(iframe);
    shell.appendChild(frame);
    const fb = el('details', { cls: 'video-fallback' });
    fb.appendChild(el('summary', { text: slide.config.fallbackTitle }));
    fb.appendChild(el('div', { cls: 'video-fallback-body', text: slide.config.fallbackBody }));
    shell.appendChild(fb);
    wrap.appendChild(shell);
    return wrap;
  }

  // ----- Slide 4: setup ----------------------------------------------
  function renderSetup(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    const row = el('div', { cls: 'stat-row' });
    slide.config.stats.forEach(s => {
      const card = el('div', { cls: 'stat ' + (s.accent === 'amber' ? 'amber' : s.accent === 'pink' ? 'pink' : '') });
      card.appendChild(el('div', { cls: 'stat-num', text: s.num }));
      card.appendChild(el('div', { cls: 'stat-label', text: s.label }));
      row.appendChild(card);
    });
    wrap.appendChild(row);

    const grid = el('div', { cls: 'scenario-grid' });
    [slide.config.company, slide.config.mandate].forEach(card => {
      const c = el('div', { cls: 'scenario-card' });
      c.appendChild(el('h3', { text: card.title }));
      const ul = el('ul');
      card.bullets.forEach(b => ul.appendChild(el('li', { text: b })));
      c.appendChild(ul);
      grid.appendChild(c);
    });
    wrap.appendChild(grid);

    const q = el('div', { cls: 'quote-card', html: '"' + slide.config.quote.text + '"' });
    q.appendChild(el('span', { cls: 'attrib', text: slide.config.quote.attrib }));
    wrap.appendChild(q);
    return wrap;
  }

  // ----- Slide 5: poll (A/B/C/D) -------------------------------------
  function renderPoll(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    wrap.appendChild(reflectionCard(slide.config.selfPrompt));
    const list = el('div', { cls: 'choice-list' });
    const picked = sync.getChoice(slide.id);
    slide.config.choices.forEach(c => {
      const isSel = picked === c.id;
      const btn = el('button', { cls: 'choice' + (isSel ? ' selected' : ''), attrs: { type: 'button', 'data-choice': c.id } });
      btn.appendChild(el('span', { cls: 'choice-marker', text: c.id }));
      const body = el('div', { cls: 'choice-body' });
      body.appendChild(el('div', { cls: 'choice-headline', text: c.headline }));
      body.appendChild(el('div', { cls: 'choice-meta', text: c.meta }));
      btn.appendChild(body);
      btn.addEventListener('click', () => {
        sync.selectChoice(slide.id, c.id);
        renderSlide(currentIndex, { skipAnim: true });
      });
      list.appendChild(btn);
    });

    if (MODE === 'self') {
      // Side-by-side: choices on the left, per-choice probe on the right
      const grid = el('div', { cls: 'choices-grid' });
      grid.appendChild(list);
      const aside = el('div', { cls: 'choices-aside' });
      const chosen = picked ? slide.config.choices.find(c => c.id === picked) : null;
      if (chosen && chosen.selfProbe) {
        const probe = el('div', { cls: 'choice-probe' });
        probe.appendChild(el('div', { cls: 'choice-probe-eyebrow', text: 'Question to sit with' }));
        probe.appendChild(el('div', { cls: 'choice-probe-body', text: chosen.selfProbe }));
        aside.appendChild(probe);
      } else {
        const ph = el('div', { cls: 'stage-insight-placeholder' });
        ph.appendChild(el('div', { cls: 'stage-insight-placeholder-icon', text: '←' }));
        ph.appendChild(el('div', { text: 'Commit to a choice on the left. You\'ll get a question to sit with — every option is defensible, but each tells you something different about yourself.' }));
        aside.appendChild(ph);
      }
      grid.appendChild(aside);
      wrap.appendChild(grid);
      if (picked && !sync.isRevealed(slide.id, 'insight')) sync.setReveal(slide.id, 'insight', true);
    } else {
      wrap.appendChild(list);
      if (picked) {
        wrap.appendChild(insightCard(slide, slide.config.afterChoiceInsight));
        if (!sync.isRevealed(slide.id, 'insight')) sync.setReveal(slide.id, 'insight', true);
      }
    }
    return wrap;
  }

  // ----- Slide 6: maturity -------------------------------------------
  function renderMaturity(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    const showAll = sync.isRevealed(slide.id, 'reveal-rest');

    function buildMaturityBars() {
      const m = el('div', { cls: 'maturity' });
      slide.config.pillars.forEach(p => {
        const isHidden = p.hidden && (!showAll);
        const row = el('div', { cls: 'maturity-row' + (isHidden ? ' hidden' : '') });
        row.appendChild(el('div', { cls: 'maturity-label', text: p.label }));
        const track = el('div', { cls: 'maturity-track' });
        const fill = el('div', { cls: 'maturity-fill ' + p.level });
        fill.style.width = isHidden ? '0%' : ((p.value / slide.config.scaleMax) * 100) + '%';
        track.appendChild(fill);
        row.appendChild(track);
        const v = el('div', { cls: 'maturity-value' });
        v.appendChild(el('span', { text: p.value }));
        row.appendChild(v);
        m.appendChild(row);
      });
      return m;
    }

    if (MODE === 'self' && !showAll) {
      // Side-by-side: bars on the left, guess panel on the right
      const grid = el('div', { cls: 'maturity-grid' });
      grid.appendChild(buildMaturityBars());

      const aside = el('div', { cls: 'maturity-aside' });
      const panel = el('div', { cls: 'guess-panel' });
      panel.appendChild(el('div', { cls: 'choice-probe-eyebrow', text: 'Your turn' }));
      panel.appendChild(el('div', { cls: 'guess-panel-body', text: 'Tech is at 400. Governance at 300. Where do you think the other three pillars land? Commit to a number for each.' }));

      const predictGrid = el('div', { cls: 'predict-grid' });
      ['ais','bp','culture'].forEach(pid => {
        const pillar = slide.config.pillars.find(x => x.id === pid);
        const row = el('div', { cls: 'predict-row' });
        row.appendChild(el('div', { cls: 'predict-label', text: pillar.label }));
        const btns = el('div', { cls: 'predict-btns' });
        [200, 300, 400].forEach(v => {
          const guess = sync.state.choices['predict-' + pid];
          const btn = el('button', { cls: 'predict-btn' + (guess === String(v) ? ' selected' : ''), attrs: { type: 'button' }, text: v });
          btn.addEventListener('click', () => {
            sync.selectChoice('predict-' + pid, String(v));
            renderSlide(currentIndex, { skipAnim: true });
          });
          btns.appendChild(btn);
        });
        row.appendChild(btns);
        predictGrid.appendChild(row);
      });
      panel.appendChild(predictGrid);

      const allGuessed = ['ais','bp','culture'].every(pid => sync.state.choices['predict-' + pid]);
      const revealBtn = el('button', {
        cls: 'btn btn-primary' + (allGuessed ? '' : ' disabled'),
        text: allGuessed ? 'Reveal the answers' : 'Pick a guess for each pillar first',
        attrs: { type: 'button', style: 'margin-top:16px;width:100%' }
      });
      revealBtn.disabled = !allGuessed;
      revealBtn.addEventListener('click', () => {
        sync.setReveal(slide.id, 'reveal-rest', true);
        renderSlide(currentIndex, { skipAnim: true });
      });
      panel.appendChild(revealBtn);
      aside.appendChild(panel);
      grid.appendChild(aside);
      wrap.appendChild(grid);
    } else {
      wrap.appendChild(buildMaturityBars());

      if (MODE !== 'self' && !showAll) {
        // Presenter: keep the simple reveal CTA
        const btnRow = el('div', { attrs: { style: 'margin-top:18px;text-align:center' } });
        const revealBtn = el('button', { cls: 'btn btn-primary', text: 'Reveal AI Strategy · Business Process · Culture', attrs: { type: 'button' } });
        revealBtn.addEventListener('click', () => {
          sync.setReveal(slide.id, 'reveal-rest', true);
          renderSlide(currentIndex, { skipAnim: true });
        });
        btnRow.appendChild(revealBtn);
        wrap.appendChild(btnRow);
      }

      if (showAll) {
        wrap.appendChild(insightCard(slide, slide.config.insight));
        if (!sync.isRevealed(slide.id, 'insight')) sync.setReveal(slide.id, 'insight', true);
      }
    }
    return wrap;
  }

  // ----- Slide 7: bridge (options → pillars) -------------------------
  function renderBridge(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    wrap.appendChild(reflectionCard(slide.config.selfPrompt));
    const list = el('div', { cls: 'map-list' });

    function isMappingRevealed(m) {
      if (!m.hidden) return true;
      return sync.isRevealed(slide.id, 'map-' + m.id);
    }

    slide.config.mappings.forEach(m => {
      const revealed = isMappingRevealed(m);
      const isClickable = m.hidden && !revealed;
      const row = el(isClickable ? 'button' : 'div', {
        cls: 'map-row' + (revealed ? ' revealed' : ' hidden'),
        attrs: isClickable ? { type: 'button', 'aria-label': 'Reveal pillar mapping for option ' + m.id } : undefined
      });
      row.appendChild(el('span', { cls: 'map-letter', text: m.id }));
      const op = el('div', { cls: 'map-option' });
      op.appendChild(el('div', { cls: 'map-option-headline', text: m.option }));
      op.appendChild(el('div', { cls: 'map-option-detail', text: m.detail }));
      row.appendChild(op);
      const pill = el('div', {
        cls: 'map-pillar',
        html: revealed ? `${m.pillar}<span class="lvl">· ${m.value}</span>` : 'Click to reveal'
      });
      row.appendChild(pill);
      if (isClickable) {
        row.addEventListener('click', () => {
          sync.setReveal(slide.id, 'map-' + m.id, true);
          renderSlide(currentIndex, { skipAnim: true });
        });
      }
      list.appendChild(row);
    });
    wrap.appendChild(list);

    const allRevealed = slide.config.mappings.every(isMappingRevealed);
    if (allRevealed) {
      wrap.appendChild(insightCard(slide, slide.config.insight));
      if (!sync.isRevealed(slide.id, 'insight')) sync.setReveal(slide.id, 'insight', true);
    }
    return wrap;
  }

  // ----- Slide 8: patterns -------------------------------------------
  function renderPatterns(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    wrap.appendChild(reflectionCard(slide.config.selfPrompt));
    const grid = el('div', { cls: 'pattern-modes' });
    const picked = sync.getChoice(slide.id);
    slide.config.modes.forEach(m => {
      const col = el('div', { cls: 'pattern-mode ' + m.id });
      col.appendChild(el('div', { cls: 'pattern-mode-title', text: m.title }));
      col.appendChild(el('div', { cls: 'pattern-mode-sub', text: m.sub }));
      const list = el('div', { cls: 'pattern-list' });
      m.patterns.forEach(p => {
        const btn = el('button', { cls: 'pattern' + (picked === p.id ? ' selected' : ''), attrs: { type: 'button' } });
        btn.appendChild(el('div', { cls: 'pattern-name', text: p.name }));
        btn.appendChild(el('div', { cls: 'pattern-tag', text: p.tag }));
        btn.addEventListener('click', () => {
          sync.selectChoice(slide.id, p.id);
          renderSlide(currentIndex, { skipAnim: true });
        });
        list.appendChild(btn);
      });
      col.appendChild(list);
      grid.appendChild(col);
    });
    wrap.appendChild(grid);
    if (MODE === 'self' && picked) {
      // Find the selected pattern across modes
      let chosen = null;
      slide.config.modes.forEach(m => {
        const found = m.patterns.find(p => p.id === picked);
        if (found) chosen = found;
      });
      if (chosen && chosen.selfProbe) {
        const probe = el('div', { cls: 'choice-probe' });
        probe.appendChild(el('div', { cls: 'choice-probe-eyebrow', text: 'Question to sit with' }));
        probe.appendChild(el('div', { cls: 'choice-probe-body', text: chosen.selfProbe }));
        wrap.appendChild(probe);
      }
    }
    return wrap;
  }

  // ----- Slide 9: bet reveal -----------------------------------------
  function renderBet(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));

    // Comparison strip
    const userPick = sync.getChoice('patterns');
    const userPickPattern = userPick ? lookupPatternName(userPick) : null;
    if (userPickPattern) {
      const strip = el('div', { cls: 'contrast-strip' + (userPick === slide.config.sarahChoice.primary ? ' match' : '') });
      const you = el('div', { cls: 'you' });
      you.appendChild(el('div', { cls: 'label', text: 'You picked' }));
      you.appendChild(el('div', { cls: 'value', text: userPickPattern }));
      strip.appendChild(you);
      strip.appendChild(el('div', { cls: 'vs', text: userPick === slide.config.sarahChoice.primary ? 'SAME INSTINCT' : 'VS' }));
      const sarah = el('div', { cls: 'sarah' });
      sarah.appendChild(el('div', { cls: 'label', text: 'Sarah picked' }));
      sarah.appendChild(el('div', { cls: 'value', text: slide.config.sarahChoiceLabel + ' + ' + slide.config.sarahParallelLabel }));
      strip.appendChild(sarah);
      wrap.appendChild(strip);
    }

    const grid = el('div', { cls: 'quadrants' });
    const revealedAll = sync.isRevealed(slide.id, 'reveal-all');
    slide.config.quadrants.forEach((q, idx) => {
      const isRev = revealedAll || sync.isRevealed(slide.id, q.id);
      const card = el('div', { cls: 'quad ' + q.accent + (isRev ? ' revealed' : '') });
      card.appendChild(el('div', { cls: 'quad-eyebrow', text: q.eyebrow }));
      card.appendChild(el('div', { cls: 'quad-title', text: q.title }));
      const ul = el('ul');
      q.items.forEach(item => ul.appendChild(el('li', { text: item })));
      card.appendChild(ul);
      card.addEventListener('click', () => sync.setReveal(slide.id, q.id, !isRev));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);

    if (!revealedAll) {
      const ctrl = el('div', { attrs: { style: 'margin-top:18px' } });
      const btn = el('button', { cls: 'btn btn-ghost', text: 'Reveal all four', attrs: { type: 'button' } });
      btn.addEventListener('click', () => sync.setReveal(slide.id, 'reveal-all', true));
      ctrl.appendChild(btn);
      wrap.appendChild(ctrl);
    }
    return wrap;
  }

  function lookupPatternName(id) {
    const ps = SLIDES.find(s => s.id === 'patterns');
    if (!ps) return null;
    for (const m of ps.config.modes) {
      const found = m.patterns.find(p => p.id === id);
      if (found) return found.name;
    }
    return null;
  }

  // ----- Slide 10: gaps ----------------------------------------------
  function renderGaps(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    wrap.appendChild(reflectionCard(slide.config.selfPrompt));
    const list = el('div', { cls: 'gaps' });
    slide.config.gaps.forEach(g => {
      const exp = sync.isRevealed(slide.id, g.id);
      const row = el('div', { cls: 'gap-row' + (exp ? ' expanded' : ''), attrs: { tabindex: '0', role: 'button', 'aria-expanded': exp ? 'true' : 'false' } });
      const head = el('div', { cls: 'gap-head' });
      head.appendChild(el('div', { cls: 'gap-pillar', text: g.pillar }));
      const bar = el('div', { cls: 'gap-bar' });
      const fill = el('div', { cls: 'gap-fill' });
      fill.style.width = ((g.current / slide.config.scaleMax) * 100) + '%';
      bar.appendChild(fill);
      const target = el('div', { cls: 'gap-target' });
      target.style.left = ((g.target / slide.config.scaleMax) * 100) + '%';
      bar.appendChild(target);
      head.appendChild(bar);
      const deltaClass = g.delta === 0 ? 'zero' : g.delta <= 100 ? 'small' : 'large';
      head.appendChild(el('div', { cls: 'gap-delta ' + deltaClass, text: g.delta === 0 ? 'Δ0 (already there)' : 'Δ' + g.delta + ' · ' + g.current + '→' + g.target }));
      row.appendChild(head);
      row.appendChild(el('div', { cls: 'gap-action', text: g.action }));
      const toggle = () => sync.setReveal(slide.id, g.id, !exp);
      row.addEventListener('click', toggle);
      row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      list.appendChild(row);
    });
    wrap.appendChild(list);
    // Insight when all expanded
    const allExp = slide.config.gaps.every(g => sync.isRevealed(slide.id, g.id));
    if (allExp) {
      wrap.appendChild(insightCard(slide, slide.config.insight));
      if (!sync.isRevealed(slide.id, 'insight')) sync.setReveal(slide.id, 'insight', true);
    }
    return wrap;
  }

  // ----- Slide 11: operating model -----------------------------------
  function renderOpModel(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    if (MODE === 'self') {
      const r = el('div', { cls: 'reflection' });
      r.appendChild(el('div', { cls: 'reflection-title', text: 'Challenge yourself' }));
      r.appendChild(el('div', { cls: 'reflection-prompt', text: slide.config.challenge }));
      wrap.appendChild(r);
    }
    const grid = el('div', { cls: 'horizons' });
    slide.config.horizons.forEach(h => {
      const card = el('div', { cls: 'horizon' });
      card.appendChild(el('span', { cls: 'horizon-num', text: h.num }));
      card.appendChild(el('div', { cls: 'horizon-title', text: h.title }));
      card.appendChild(el('div', { cls: 'horizon-window', text: h.window }));
      h.sections.forEach(s => {
        const sec = el('div', { cls: 'horizon-section' });
        sec.appendChild(el('div', { cls: 'horizon-section-title', text: s.title }));
        sec.appendChild(el('div', { cls: 'horizon-section-body', text: s.body }));
        card.appendChild(sec);
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    wrap.appendChild(insightCard(slide, slide.config.insight));
    if (!sync.isRevealed(slide.id, 'insight')) sync.setReveal(slide.id, 'insight', true);
    return wrap;
  }

  // ----- Slide 12: mirror (forced pause) -----------------------------
  function renderMirror(slide) {
    const wrap = el('div');
    const m = el('div', { cls: 'mirror' });
    m.appendChild(el('div', { cls: 'slide-eyebrow', text: slide.actLabel, attrs: { style: 'justify-content:center' } }));
    m.appendChild(el('div', { cls: 'mirror-line1', text: slide.title }));

    let stage = sync.state.reveals[slide.id] || {};
    const r2 = !!stage.r2, r3 = !!stage.r3, r4 = !!stage.r4, r5 = !!stage.r5, r6 = !!stage.r6;
    if (r2) m.classList.add('r2');
    if (r3) m.classList.add('r3');
    if (r4) m.classList.add('r4');
    if (r5) m.classList.add('r5');
    if (r6) m.classList.add('r6');

    m.appendChild(el('div', { cls: 'mirror-line2', text: slide.config.line2 }));
    const stats = el('div', { cls: 'mirror-stats' });
    slide.config.stats.forEach(s => {
      const c = el('div', { cls: 'mirror-stat stat ' + (s.accent === 'amber' ? 'amber' : s.accent === 'pink' ? 'pink' : '') });
      c.appendChild(el('div', { cls: 'stat-num', text: s.num }));
      c.appendChild(el('div', { cls: 'stat-label', text: s.label }));
      stats.appendChild(c);
    });
    m.appendChild(stats);
    const q = el('div', { cls: 'mirror-quote' });
    q.appendChild(el('span', { text: slide.config.quote }));
    q.appendChild(el('div', { cls: 'mirror-quote-attrib', text: slide.config.quoteAttrib }));
    m.appendChild(q);

    const ctrl = el('div', { attrs: { style: 'margin-top:36px' } });
    let next, label;
    if (!r2)       { next = 'r2'; label = 'But these numbers are not.'; }
    else if (!r3)  { next = 'r3'; label = 'Reveal 66%'; }
    else if (!r4)  { next = 'r4'; label = 'Reveal 45%'; }
    else if (!r5)  { next = 'r5'; label = 'Reveal 13%'; }
    else if (!r6)  { next = 'r6'; label = 'Reveal the Lakhani quote'; }
    if (next) {
      const btn = el('button', { cls: 'btn btn-primary', text: label, attrs: { type: 'button' } });
      const sinceEnter = Date.now() - mirrorPauseAt;
      const needWait = !r2 && sinceEnter < slide.config.forcedPauseMs;
      if (needWait) {
        btn.disabled = true;
        const remaining = slide.config.forcedPauseMs - sinceEnter;
        setTimeout(() => { btn.disabled = false; btn.textContent = label; }, remaining);
        btn.textContent = '… pause …';
      }
      btn.addEventListener('click', () => sync.setReveal(slide.id, next, true));
      ctrl.appendChild(btn);
    }
    m.appendChild(ctrl);
    wrap.appendChild(m);
    return wrap;
  }

  // ----- Slide 13: three decisions -----------------------------------
  function renderThree(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    if (MODE === 'self') wrap.appendChild(reflectionCard(slide.config.selfPrompt));
    const grid = el('div', { cls: 'horizons' });
    slide.config.decisions.forEach(d => {
      const card = el('div', { cls: 'horizon' });
      card.appendChild(el('span', { cls: 'horizon-num', text: d.num }));
      card.appendChild(el('div', { cls: 'horizon-title', text: d.title }));
      card.appendChild(el('div', { cls: 'horizon-section-body', text: d.prompt, attrs: { style: 'margin-top:12px' } }));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  // ----- Slide 14: resources -----------------------------------------
  function renderResources(slide) {
    const wrap = el('div');
    wrap.appendChild(header(slide));
    const top = el('div', { cls: 'scenario-grid' });
    [slide.config.primary, slide.config.secondary].forEach(r => {
      const c = el('a', { cls: 'mode-card', attrs: { href: r.href, target: '_blank', rel: 'noopener' } });
      c.appendChild(el('div', { cls: 'mode-eyebrow', text: r.eyebrow }));
      c.appendChild(el('h2', { text: r.title }));
      c.appendChild(el('p', { text: r.body }));
      c.appendChild(el('div', { cls: 'mode-arrow', text: r.href.replace(/^https?:\/\//, '') + ' ↗' }));
      top.appendChild(c);
    });
    wrap.appendChild(top);

    const more = el('div', { cls: 'scenario-grid', attrs: { style: 'grid-template-columns:repeat(2,1fr)' } });
    slide.config.additional.forEach(r => {
      const c = el('a', { cls: 'scenario-card', attrs: { href: r.href, target: '_blank', rel: 'noopener', style: 'text-decoration:none;color:inherit;display:block' } });
      c.appendChild(el('h3', { text: r.title }));
      c.appendChild(el('div', { text: r.body, attrs: { style: 'font-size:0.92rem;color:var(--text-sec);margin-top:6px;line-height:1.5' } }));
      c.appendChild(el('div', { text: r.href + ' ↗', attrs: { style: 'font-size:0.8rem;color:var(--blue);margin-top:10px' } }));
      more.appendChild(c);
    });
    wrap.appendChild(more);

    const close = el('div', { cls: 'quote-card', text: slide.config.closingLine, attrs: { style: 'margin-top:24px;font-size:1.2rem;text-align:center' } });
    wrap.appendChild(close);
    return wrap;
  }

  // ----- Outline drawer ----------------------------------------------
  function buildOutline() {
    outlineList.innerHTML = '';
    let lastAct = null;
    SLIDES.forEach((s, i) => {
      if (s.act !== lastAct) {
        const lbl = el('div', { cls: 'outline-act', text: s.act === 0 ? (i === 0 ? 'OPENING' : 'OPENING — POLL') : `ACT ${s.act}` });
        outlineList.appendChild(lbl);
        lastAct = s.act;
      }
      const li = el('li', { cls: 'outline-item' + (i === currentIndex ? ' current' : '') });
      li.appendChild(el('span', { cls: 'outline-num', text: i + 1 }));
      li.appendChild(el('span', { cls: 'outline-text', text: s.title }));
      li.addEventListener('click', () => { closeDrawer(); renderSlide(i); });
      outlineList.appendChild(li);
    });
  }
  function updateOutline() {
    if (!drawer.classList.contains('open')) return;
    buildOutline();
  }
  function openDrawer() {
    buildOutline();
    drawer.classList.add('open');
    overlay.classList.add('open');
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
  }
  btnOutline.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // ----- Navigation ---------------------------------------------------
  function next() {
    if (currentIndex < SLIDES.length - 1) renderSlide(currentIndex + 1);
  }
  function prev() {
    if (currentIndex > 0) renderSlide(currentIndex - 1);
  }
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  btnReset.addEventListener('click', () => {
    sync.resetSlideReveals(SLIDES[currentIndex].id);
    // Also clear choice for the current slide
    if (sync.state.choices[SLIDES[currentIndex].id]) {
      delete sync.state.choices[SLIDES[currentIndex].id];
      sync.selectChoice(SLIDES[currentIndex].id, null);
    }
    renderSlide(currentIndex, { skipAnim: true });
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'Escape') closeDrawer();
    else if (e.key === 'o' || e.key === 'O') { e.preventDefault(); drawer.classList.contains('open') ? closeDrawer() : openDrawer(); }
  });

  // Initial render
  renderSlide(currentIndex, { skipAnim: true });

})();
