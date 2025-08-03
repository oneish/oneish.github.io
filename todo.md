
# TODO Checklist – Music Jukebox Project

Check off each item as you complete it.  
After each **code task** run `npm run lint` and `npm test` to ensure code quality.

---

## 0. Prerequisites
- [ ] Install Node .js (v18 + recommended)
- [ ] Create `/jukebox-app` workspace folder

---

## A. Project Scaffolding & Tooling
- [ ] **A1** Create directory tree & empty files  
  `/index.html`, `styles/main.css`, `scripts/main.js`, `scripts/data.js`, `scripts/player.js`, `scripts/controls.js`, `tests/player.test.js`
- [ ] **A2** Initialise npm: `npm init -y`
- [ ] **A2** Install dev deps: `npm i -D eslint vitest vite-node`
- [ ] **A3** Add `.eslintrc.json` with rules (semi & single quotes)
- [ ] **A4** Add `vitest.config.js`
- [ ] **A5** Add npm scripts `"lint"` and `"test"`  
  Verify both commands run successfully

---

## B. Data Module
- [ ] **B1** Create `scripts/data.js` exporting empty `songs` array
- [ ] **B1** Add `tests/data.test.js` sanity test
- [ ] **B2** Populate array with **11** `{ title, artist, file }` objects
- [ ] **B3** Update test to validate length = 11 and keys exist

---

## C. Basic Audio Player
- [ ] **C1** Create `Player` class skeleton in `scripts/player.js`
- [ ] **C1** Write test confirming constructor properties
- [ ] **C2** Implement `play(index)` and `pause()` logic using `HTMLAudioElement`
- [ ] **C3** Mock Audio in tests to verify play/pause state

---

## D. Song List UI
- [ ] **D1** Add basic markup in `index.html` (`#song-list`, controls shell)
- [ ] **D2** Implement `renderSongList()` in `scripts/controls.js`
- [ ] **D3** Wire list clicks in `scripts/main.js` → `player.play(idx)`
- [ ] **D4** Add `.active` highlight styles & update on `songchange` event

---

## E. “Play All” Sequencing
- [ ] **E1** Add `playAll()` method to `Player`
- [ ] **E2** Handle `audio.ended` to advance queue
- [ ] **E3** Stop sequence at list end (no loop)
- [ ] **E3** Cancel sequence when user manually selects song
- [ ] **E4** Unit tests for sequential playback logic

---

## F. Volume Control & Mute
- [ ] **F1** Add rotary knob element & CSS placeholder
- [ ] **F2** Implement drag/rotation → volume mapping (0–1)
- [ ] **F3** Add mute button with toggle logic
- [ ] **F4** Tests for `setVolume` clamping & mute state

---

## G. Error Handling
- [ ] **G1** Add `#error-msg` area in HTML/CSS
- [ ] **G2** Display friendly error on `audio.onerror`
- [ ] **G3** Skip to next song during Play All on error
- [ ] **G4** Tests to simulate error & skip behavior

---

## H. Accessibility Enhancements
- [ ] **H1** Ensure all controls are semantic `<button>` / `<div role="slider">`
- [ ] **H2** Add ARIA labels/roles and tabindex order
- [ ] **H3** Implement keyboard shortcuts (Space/Enter, Arrow keys)

---

## I. Styling & Responsiveness
- [ ] **I1** Apply retro jukebox CSS (gradients, curved top, glow)
- [ ] **I2** Add media queries for mobile layout
- [ ] **I3** Animation or highlight polish for active song

---

## J. Final Polish & Release
- [ ] **J1** Resolve any remaining ESLint warnings
- [ ] **J2** Update `README.md` with setup/start instructions
- [ ] **J3** Run full test suite & manual browser QA
- [ ] **J4** Tag release v1.0 (git)

---

### Ongoing
- [ ] Keep audio files (`assets/audio/`) organised and commit‑ready
- [ ] Maintain test coverage for new utility functions
- [ ] Document any deviations from spec in `CHANGELOG.md`
