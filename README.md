# Sarah Chen — Interactive Case Discussion

A web-based, interactive recreation of the **Driving Agent Adoption at
Scale** session (FOCUS103) built around Woodgrove Bank's fictional CIO
**Sarah Chen**. Two modes:

- **Self-paced** — a solo learner walks through the deck with adapted
  reflection prompts at each act ("Before you continue: what would YOU
  pick?").
- **Presenter-led** — a presenter window pairs with the main display.
  Probing questions, expected responses, common mistakes, and timing
  appear alongside the room-facing slides. Hand-raises stay physical; the
  presenter taps the room's dominant choice to drive the next probe.

Source materials: the FOCUS103 deck and the **Frontier Firm Challenge
Facilitator Guide**. Visual aesthetic is consistent with
[aka.ms/adoptionpulse](https://aka.ms/adoptionpulse).

## Run it locally

```bash
# from the project root
python -m http.server 8080
# then open http://localhost:8080/
```

Or any static file server. There's no build step.

## Modes

### Self-paced
1. Open `/` (the landing page).
2. Click **Walk through it yourself**.
3. Use **← / → / Space** to navigate, or click **Next**.
4. Click **Outline** (top-left) to jump to any slide.
5. Click **Reset slide** in the footer to clear reveals on the current
   slide.

### Presenter-led
1. Open `/`.
2. Click **Run the live session**. A companion window opens automatically
   (allow popups for this site).
3. Cast / mirror the main tab to the projector.
4. Drive the session from the presenter window. Click slide choices on the
   main display to fire choice-specific probes.

The two windows sync via `BroadcastChannel` (with a `localStorage`
fallback). No network is required — it all runs locally in your browser.

#### Sync status pill
- **Connected** — the other window is alive and receiving updates.
- **Waiting…** — the peer hasn't responded recently. Refresh the missing
  window; state is restored from localStorage.
- **Display not open** — only the presenter window is open. Open the main
  display via the URL the presenter window shows.

#### Reset
The presenter footer has a **↺ Reset** button that wipes choices,
reveals, and slide position for the current session id.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` / `PgDn` | Next slide |
| `←` / `PgUp` | Previous slide |
| `O` | Toggle outline drawer |
| `Esc` | Close outline drawer |

## Run-of-show (presenter cheat sheet)

| # | Slide | Beat | Time |
|---|-------|------|------|
| 1 | Title | Quick intro, no bios | 2:00 |
| 2 | Where are you in agents? | 4-stage hand-raise — pause before reveal 4 | ~2:00 |
| 3 | Sarah Chen video | Play 90s video. "Read instead" fallback if it doesn't play | ~2:00 |
| 4 | Woodgrove setup | Land 66 / 45 / 13 and Sarah's quote | ~5:00 |
| 5 | What should Sarah do? | A/B/C/D vote. Cold-call 2–3 people | ~2:00 |
| 6 | Maturity reveal | Tech → Gov → **PAUSE → predict** → reveal the three 200s | ~4:00 |
| 7 | Options → pillars | Reveal A only → predict B/C/D | ~3:00 |
| 8 | Patterns | Eliminate. Vote between two finalists | ~5:00 |
| 9 | The bet | Sarah picked Workplace & IT Services + Business Expert Empowerment | ~4:00 |
| 10 | Gaps | Let them spot Δ0 on Tech themselves | ~3:00 |
| 11 | Operating model | Pose challenge first — first three moves? | ~5:00 |
| 12 | The mirror | **PAUSE** before "These numbers are not." 5s silence after the quote | ~2:00 |
| 13 | Three decisions | Open one to the room (usually #1) | ~4:00 |
| 14 | Resources | Point to aka.ms/adoptionpulse as the primary CTA | ~1:00 |

Total target: **~35 minutes**.

## Troubleshooting

**The video won't play.** Click "Read instead — scenario script" under
the player. The script is the same content the video covers.

**The presenter window opened but the main display didn't.** Look at the
session id in the presenter URL (`?session=sc-xxxxxx`), then open
`deck.html?mode=present&session=sc-xxxxxx` in another window.

**Sync says "Display not open."** The two windows must share the same
`?session=` id. Close one and re-launch from the landing page.

**State got into a weird place.** Click **↺ Reset** in the presenter
footer, or open DevTools and clear `sarahchen.*` keys from localStorage.

## File map

```
sarahchen/
├── index.html               # Landing — mode chooser
├── deck.html                # Main interactive deck
├── presenter.html           # Companion presenter window
├── css/styles.css           # Adoption Pulse design tokens + slide styles
├── js/
│   ├── theme.js             # Light/dark toggle
│   ├── slides.js            # All 14 slides as structured content
│   ├── facilitation.js      # Presenter notes + probes
│   ├── sync.js              # BroadcastChannel + localStorage sync
│   ├── deck.js              # Slide rendering, navigation, interactions
│   └── presenter.js         # Presenter window rendering
├── assets/cat-logo.svg
├── .github/workflows/pages.yml  # GitHub Pages deploy
└── README.md
```

## Deployment

Push to GitHub and enable Pages → "GitHub Actions" as the source. The
included workflow at `.github/workflows/pages.yml` publishes the repo
root.

## Adapted from

- *Driving Agent Adoption at Scale — From Pilot to Business Impact*
  (FOCUS103). Microsoft Copilot Acceleration Team.
- *Frontier Firm Challenge — Facilitator Guide.*
- 2026 Work Trend Index (Microsoft & LinkedIn).
