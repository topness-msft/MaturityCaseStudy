// =====================================================================
// sync.js — Session state + cross-window sync.
// Single canonical state is persisted to localStorage under
// `sarahchen.state.<sessionId>`. Cross-window messaging uses
// BroadcastChannel with a localStorage `storage`-event fallback.
// Every event carries senderId + updatedAt to break echo loops; the
// most recent updatedAt wins on conflict.
// =====================================================================

(function(){

  const STATE_KEY  = (id) => `sarahchen.state.${id}`;
  const EVENT_KEY  = (id) => `sarahchen.event.${id}`;
  const CHAN_NAME  = (id) => `sarahchen-session-${id}`;

  // Per-window-lifetime sender id. MUST NOT use sessionStorage: when the
  // presenter window is opened via window.open() from index.html, the popup
  // inherits the opener's sessionStorage and ends up with the same senderId
  // as the deck window. With matching senderIds, every broadcast looks like
  // a self-echo and gets dropped by _receive — so Next/Prev/reveal/choice
  // events never cross between the two windows.
  const SENDER_ID = 'w-' + Math.random().toString(36).slice(2, 10);

  function getSenderId() { return SENDER_ID; }

  function getQuery() {
    const p = new URLSearchParams(window.location.search);
    return Object.fromEntries(p.entries());
  }

  function ensureSessionId() {
    const q = getQuery();
    if (q.session) return q.session;
    const id = 'sc-' + Math.random().toString(36).slice(2, 8);
    const params = new URLSearchParams(window.location.search);
    params.set('session', id);
    window.history.replaceState({}, '', window.location.pathname + '?' + params.toString());
    return id;
  }

  function emptyState(sessionId) {
    return {
      sessionId,
      slideIndex: 0,
      reveals: {},
      choices: {},
      timers: {},
      updatedAt: 0
    };
  }

  function loadState(sessionId) {
    try {
      const raw = localStorage.getItem(STATE_KEY(sessionId));
      if (!raw) return emptyState(sessionId);
      const parsed = JSON.parse(raw);
      // Merge with empty to guard against missing keys.
      return Object.assign(emptyState(sessionId), parsed);
    } catch (e) {
      console.warn('Failed to parse state, resetting', e);
      return emptyState(sessionId);
    }
  }

  function persist(state) {
    state.updatedAt = Date.now();
    try {
      localStorage.setItem(STATE_KEY(state.sessionId), JSON.stringify(state));
    } catch (e) {
      console.warn('persist failed', e);
    }
  }

  class Sync {
    constructor({ role, onEvent }) {
      this.role = role;       // 'deck' | 'presenter'
      this.onEvent = onEvent || (() => {});
      this.senderId = getSenderId();
      this.sessionId = ensureSessionId();
      this.state = loadState(this.sessionId);
      this.state.sessionId = this.state.sessionId || this.sessionId;
      this.peerSeenAt = 0;
      this.statusListeners = [];
      this.status = 'restored';   // restored | waiting | connected
      this._initChannel();
      this._initStorage();
      this._sayHello();
      this._statusTick();
    }

    onStatus(cb) { this.statusListeners.push(cb); cb(this.status); }
    _setStatus(s) {
      if (this.status === s) return;
      this.status = s;
      this.statusListeners.forEach(cb => cb(s));
    }

    _initChannel() {
      try {
        this.bc = new BroadcastChannel(CHAN_NAME(this.sessionId));
        this.bc.onmessage = (e) => this._receive(e.data);
      } catch (e) {
        this.bc = null;
      }
    }

    _initStorage() {
      window.addEventListener('storage', (e) => {
        if (e.key !== EVENT_KEY(this.sessionId) || !e.newValue) return;
        try {
          const data = JSON.parse(e.newValue);
          this._receive(data);
        } catch (err) {}
      });
    }

    _sayHello() {
      this._broadcast({ type: 'presenter.hello', from: this.role });
      // Also broadcast the snapshot we have, so the other window can
      // reconcile if it joins later.
      this._broadcastSnapshot();
    }

    _statusTick() {
      // If we don't hear from a peer within 1.5s of init, we're "waiting".
      // After that, every received message bumps lastPeerSeen.
      setTimeout(() => {
        if (this.peerSeenAt === 0) this._setStatus('local');
      }, 1500);
      setInterval(() => {
        if (this.peerSeenAt && Date.now() - this.peerSeenAt < 4000) {
          this._setStatus('connected');
        } else if (this.peerSeenAt) {
          this._setStatus('waiting');
        }
      }, 2000);
    }

    _send(payload) {
      const enriched = Object.assign({}, payload, {
        senderId: this.senderId,
        sentAt: Date.now()
      });
      if (this.bc) {
        try { this.bc.postMessage(enriched); } catch (e) {}
      }
      try {
        localStorage.setItem(EVENT_KEY(this.sessionId), JSON.stringify(enriched));
      } catch (e) {}
    }

    _broadcast(payload) { this._send(payload); }

    _broadcastSnapshot() {
      this._broadcast({ type: 'state.snapshot', state: this.state });
    }

    _receive(data) {
      if (!data || !data.type) return;
      if (data.senderId === this.senderId) return;
      this.peerSeenAt = Date.now();
      this._setStatus('connected');

      switch (data.type) {
        case 'presenter.hello':
          this._broadcastSnapshot();
          break;
        case 'state.snapshot':
          if (data.state && data.state.updatedAt >= (this.state.updatedAt || 0)) {
            this.state = data.state;
            this.onEvent({ type: 'state.replaced', state: this.state });
          }
          break;
        case 'slide.change':
          this.state.slideIndex = data.index;
          persist(this.state);
          this.onEvent({ type: 'slide.change', index: data.index });
          break;
        case 'choice.select':
          this.state.choices[data.slideId] = data.choiceId;
          persist(this.state);
          this.onEvent({ type: 'choice.select', slideId: data.slideId, choiceId: data.choiceId });
          break;
        case 'reveal.toggle':
          if (!this.state.reveals[data.slideId]) this.state.reveals[data.slideId] = {};
          if (data.state === false) delete this.state.reveals[data.slideId][data.revealId];
          else this.state.reveals[data.slideId][data.revealId] = true;
          persist(this.state);
          this.onEvent({ type: 'reveal.toggle', slideId: data.slideId, revealId: data.revealId, state: data.state !== false });
          break;
        case 'reveal.reset':
          this.state.reveals[data.slideId] = {};
          persist(this.state);
          this.onEvent({ type: 'reveal.reset', slideId: data.slideId });
          break;
        case 'session.reset':
          this.state = emptyState(this.sessionId);
          persist(this.state);
          this.onEvent({ type: 'state.replaced', state: this.state });
          break;
      }
    }

    // ----- public actions (local-first; broadcast; persist) -----

    setSlideIndex(index) {
      if (this.state.slideIndex === index) return;
      this.state.slideIndex = index;
      persist(this.state);
      this._broadcast({ type: 'slide.change', index });
    }

    selectChoice(slideId, choiceId) {
      this.state.choices[slideId] = choiceId;
      persist(this.state);
      this._broadcast({ type: 'choice.select', slideId, choiceId });
    }

    setReveal(slideId, revealId, state = true) {
      if (!this.state.reveals[slideId]) this.state.reveals[slideId] = {};
      if (state === false) delete this.state.reveals[slideId][revealId];
      else this.state.reveals[slideId][revealId] = true;
      persist(this.state);
      this._broadcast({ type: 'reveal.toggle', slideId, revealId, state });
    }

    resetSlideReveals(slideId) {
      this.state.reveals[slideId] = {};
      persist(this.state);
      this._broadcast({ type: 'reveal.reset', slideId });
    }

    resetSession() {
      this.state = emptyState(this.sessionId);
      persist(this.state);
      this._broadcast({ type: 'session.reset' });
    }

    // ----- queries -----

    isRevealed(slideId, revealId) {
      return !!(this.state.reveals[slideId] && this.state.reveals[slideId][revealId]);
    }
    getChoice(slideId) { return this.state.choices[slideId] || null; }
    getSlideIndex() { return this.state.slideIndex || 0; }
  }

  window.Sync = Sync;

})();
