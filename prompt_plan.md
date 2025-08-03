
# Prompt Plan – Music Jukebox Project

This document provides a **comprehensive blueprint** and a **series of fine‑grained, code‑generation prompts** that a developer (or an LLM acting as a developer) can follow to implement the Music Jukebox SPA incrementally.  
After each prompt is completed, the implementer should **run ESLint** (`npm run lint`) and **run Vitest** (`npm test`) to verify the changes.

---

## 1  Detailed Blueprint (High‑Level)

1. **Project Initialization**  
   • Create project directory skeleton, package.json, ESLint & Vitest setup.  
   • Add _index.html_, baseline CSS, and placeholder JS modules.

2. **Data Layer**  
   • Hard‑code 11 song objects (title, artist, file) in `scripts/data.js`.

3. **Audio Player Module**  
   • Encapsulate HTMLAudioElement logic: load, play, pause, stop, volume, mute, handle errors.  
   • Expose a simple API (e.g., `play(index)`, `pause()`, `resume()`, `stop()`, `setVolume()`, `mute()`, `unmute()`, `playAll()`).

4. **Controls & UI Rendering**  
   • Render jukebox shell with song list buttons, “Play All”, rotary volume knob, and mute button.  
   • Wire UI events to the player API.  
   • Highlight currently playing song button.

5. **Sequential Playback Logic**  
   • Implement queue logic so “Play All” plays songs in order and stops at the end, cancelled by manual song play.

6. **Error Handling & Messaging Area**  
   • Display user‑friendly errors if playback fails; skip to next song when appropriate.

7. **Accessibility Enhancements**  
   • Keyboard navigation, focus styles, ARIA roles/labels, semantic HTML.

8. **Styling & Responsiveness**  
   • Retro jukebox look (curved top, glowing accents, vintage buttons).  
   • Mobile‑first responsive CSS.

9. **Testing & Quality Gates**  
   • Unit tests for sequencing and volume logic (Vitest).  
   • ESLint passes with zero errors/warnings.

---

## 2  First‑Level Iterative Chunks

| Chunk | Goal |
|-------|------|
| **A** | Project scaffolding & tooling |
| **B** | Static data module |
| **C** | Basic audio player (single‑song play/pause) |
| **D** | Render song list & individual play buttons |
| **E** | “Play All” sequencing |
| **F** | Volume knob & mute button |
| **G** | Error display & skip logic |
| **H** | Accessibility improvements |
| **I** | Retro styling & responsiveness |
| **J** | Final polish, test coverage, lint clean‑up |

---

## 3  Second‑Level Micro‑Steps

Below, each chunk is decomposed into numbered micro‑steps that are small enough to implement safely yet meaningful enough to move the project forward.

### Chunk A  – Scaffolding & Tooling

1. **A1**  Create directory tree and empty placeholder files.  
2. **A2**  Initialize `package.json`; add `eslint`, `vitest`, and `vite-node` as dev‑deps; add `lint` and `test` npm scripts.  
3. **A3**  Add `.eslintrc.json` with recommended rules (ES2021, modules).  
4. **A4**  Add `vitest.config.js` with ES module support; add blank test file.  
5. **A5**  Commit and verify lint & tests run (should pass with no files).

### Chunk B  – Data Module

1. **B1**  Create `scripts/data.js` exporting empty `songs` array.  
2. **B2**  Populate the array with 11 placeholder objects (title, artist, file).  
3. **B3**  Add unit test to verify `songs` has length 11 and required keys.

### Chunk C  – Basic Audio Player

1. **C1**  Create `scripts/player.js` exporting `Player` class (loads list, plays index).  
2. **C2**  Implement basic `play(index)` & `pause()` using `HTMLAudioElement`.  
3. **C3**  Write tests for single‑song play state transitions (mocking Audio).

### Chunk D  – Song List UI

1. **D1**  Add minimal markup in `index.html` for jukebox shell and `<ul id="song-list">`.  
2. **D2**  Create `scripts/controls.js` that renders list items with play buttons from `songs`.  
3. **D3**  In `main.js`, bootstrap controls and hook button clicks to `player.play(idx)`.  
4. **D4**  Add CSS for basic vertical list; highlight active item with a class.

### Chunk E  – “Play All” Sequencing

1. **E1**  Extend `Player` with `playAll()` that queues sequential playback.  
2. **E2**  Handle `ended` event to move to next song; stop at list end.  
3. **E3**  Cancel sequence if `play(idx)` is called manually.  
4. **E4**  Add test covering sequential playback logic.

### Chunk F  – Volume & Mute

1. **F1**  Add rotary knob element in HTML; style as circular control.  
2. **F2**  Implement knob drag/rotation logic in `controls.js`; map to volume 0‑1.  
3. **F3**  Add mute/unmute button; wire to `player.mute()`/`unmute()`.  
4. **F4**  Unit test `setVolume` and mute state toggling.

### Chunk G  – Error Handling

1. **G1**  Add `<div id="error-msg">` area.  
2. **G2**  Attach `audio.onerror` to display friendly error.  
3. **G3**  In `playAll` mode, skip to next song on error.  
4. **G4**  Write test simulating error event & skip logic.

### Chunk H  – Accessibility

1. **H1**  Ensure buttons are `button` elements with ARIA labels.  
2. **H2**  Add keyboard handlers (`Space`/`Enter`) for play controls.  
3. **H3**  Set focus outline styles and tabindex order.

### Chunk I  – Styling & Responsiveness

1. **I1**  Create retro jukebox CSS (curved top via `border-radius`, gradients, box‑shadows).  
2. **I2**  Add media queries for mobile layout (stack controls).  
3. **I3**  Polish highlight animation for active song button.

### Chunk J  – Final Polish

1. **J1**  Audit ESLint; fix remaining warnings.  
2. **J2**  Add README with usage instructions.  
3. **J3**  Run full test suite and manual browser check.  
4. **J4**  Tag v1.0 release.

---

## 4  Code‑Generation Prompts

Each prompt is wrapped in a `text` code fence so you can copy‑paste directly into an LLM that generates code.  
**After executing each prompt:** run `npm run lint` and `npm test` to ensure the codebase remains stable.

> **Tip:** Replace placeholders like `<Your Name>` or dummy song data with real values as you work.

### Prompt 1  – A1 to A2 (Project Scaffold)

```text
You are building the “Music Jukebox” SPA.
Tasks:
1. Create the following directory tree:

/jukebox-app
  ├─ index.html
  ├─ styles/main.css
  ├─ scripts/main.js
  ├─ scripts/data.js
  ├─ scripts/player.js
  ├─ scripts/controls.js
  ├─ tests/player.test.js

2. Initialise a new npm project:
   $ npm init -y

3. Install dev dependencies:
   $ npm install --save-dev eslint vitest vite-node

4. Add npm scripts to package.json:
   "lint": "eslint . --ext .js",
   "test": "vitest"

Do NOT add any implementation code yet—just empty files and config.  Save, commit, then run:
   npm run lint
   npm test
Both commands should pass (there is nothing to lint or test yet).
```

### Prompt 2  – A3  (ESLint Config)

```text
Add a `.eslintrc.json` in the project root with:
{
  "env": { "browser": true, "es2021": true },
  "extends": ["eslint:recommended"],
  "parserOptions": { "sourceType": "module", "ecmaVersion": 12 },
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
Run `npm run lint` and confirm zero errors.
```

### Prompt 3  – A4 to A5 (Vitest Config & Baseline Test)

```text
1. Create `vitest.config.js`:
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node'
  }
});

2. Add a blank test in `tests/player.test.js`:
import { describe, it, expect } from 'vitest';
describe('baseline', () => {
  it('sanity check', () => { expect(true).toBe(true); });
});

Run `npm test` – it should pass.
```

### Prompt 4  – B1 (Basic Data Module)

```text
In `scripts/data.js` export:
export const songs = [];
Add a unit test in `tests/data.test.js` that asserts songs.length === 0.
Run lint + test.
```

### Prompt 5  – B2 to B3 (Populate Song Data)

```text
Populate `scripts/data.js` with 11 song objects:
export const songs = [
  { title: 'Song One', artist: 'Artist A', file: 'assets/audio/song1.mp3' },
  // … 10 more
];
Update the test to check that every song has title, artist, file, and total length === 11.
Run lint + test.
```

### Prompt 6  – C1  (Player Class Skeleton)

```text
Create `scripts/player.js`:

export class Player {
  constructor(songList) {
    this.songs = songList;
    this.audio = null;
    this.currentIndex = null;
  }
  play(index) { /* TODO */ }
  pause() { /* TODO */ }
}

No logic yet. Add a test that instantiates Player and verifies properties exist.
Run lint + test.
```

### Prompt 7  – C2 to C3 (Basic Play/Pause Implementation)

```text
Implement `play(index)` to:
1. If another song is playing, stop it.
2. Create new `Audio` with `this.songs[index].file`.
3. Handle `error` event (console.error for now).
4. Call `audio.play()`.

Implement `pause()` to call `audio.pause()` if audio exists.

Add Vitest mocks for `Audio` to test:
- play sets currentIndex
- pause stops playback

Run lint + test.
```

### Prompt 8  – D1 (Markup Shell)

```text
Edit `index.html`:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Music Jukebox</title>
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>
  <div id="jukebox">
    <h1>Retro Jukebox</h1>
    <ul id="song-list"></ul>
    <button id="play-all">Play All</button>
    <div id="controls">
      <div id="volume-knob" tabindex="0" aria-label="Volume control"></div>
      <button id="mute-btn" aria-label="Mute">Mute</button>
    </div>
    <div id="error-msg" role="alert"></div>
  </div>
  <script type="module" src="scripts/main.js"></script>
</body>
</html>

Run lint (just checks HTML ignored) + test.
```

### Prompt 9  – D2 (Render Song List)

```text
In `scripts/controls.js` export `renderSongList(container, songs)`:
- For each song, create `<li><button data-index="i">Play — Title / Artist</button></li>`.

In `scripts/main.js`:
import { songs } from './data.js';
import { Player } from './player.js';
import { renderSongList } from './controls.js';

const player = new Player(songs);
const listEl = document.getElementById('song-list');
renderSongList(listEl, songs);
listEl.addEventListener('click', e => {
  if (e.target.matches('button[data-index]')) {
    player.play(Number(e.target.dataset.index));
  }
});

Run lint + test.
```

### Prompt 10  – D3 (Highlight Active Song)

```text
Enhance `Player.play` to dispatch `customEvent('songchange', { detail: index })`.
In `main.js`, listen for that event and:
- Remove `.active` from any list item
- Add `.active` to the clicked song

Add minimal CSS `.active { background: lightgreen; }`

Run lint + test.
```

### Prompt 11  – E1 to E4 (Play All & Sequencing Tests)

```text
Extend Player:
- add playAll() which starts at 0 and sets `this.isSequence = true`.
- on `audio.ended`, if isSequence and there is a next index, call play(next).
- if currentIndex === songs.length - 1, set isSequence = false.

Cancel sequence in play(index) by setting isSequence = false.

Add unit test:
- Simulate sequence of `ended` events and assert order.

Run lint + test.
```

### Prompt 12  – F1 to F4 (Volume & Mute)

```text
1. Style #volume-knob in CSS as a circle placeholder.
2. In controls.js add `initVolume(player)`:
   - Listen for pointerdown/move to rotate knob.
   - Map rotation (‑135° to +135°) to volume 0‑1 and call player.setVolume().
3. Add mute button logic: toggles muted state.

Update Player with setVolume(val), mute(), unmute().

Write unit test for setVolume clamping 0‑1 and for mute toggle logic.

Run lint + test.
```

### Prompt 13  – G1 to G4 (Error Handling)

```text
Add `#error-msg` display logic in Player:
- on audio.error show message:
  document.getElementById('error-msg').textContent = `Error: Unable to play "${title}"`;

During playAll(), if error occurs, automatically call play(nextIndex).

Write test using Audio mock triggering error event.

Run lint + test.
```

### Prompt 14  – H1 to H3 (Accessibility)

```text
Ensure all control elements:
- Are <button> tags with aria-labels.
- Volume knob: role="slider", aria-valuemin/max/now.
Add keyboard handlers:
- Space/Enter on song buttons -> click
- ArrowUp/Down on volume knob adjusts volume

Run lint + test.
```

### Prompt 15  – I1 to J4 (Stylish Finish & Polish)

```text
1. Add retro jukebox CSS: gradients, rounded top, shadows, glowing borders.
2. Add media queries (max-width 600px) to stack controls below list.
3. Fix remaining ESLint warnings.
4. Update README with setup and usage.
5. Run full `npm run lint` and `npm test`. All should pass.

🎉 Project complete.
```

---

## 5  Next Steps

Follow each prompt sequentially, verifying with lint & tests.  
Feel free to refine or split prompts further if any step feels too large during implementation.
