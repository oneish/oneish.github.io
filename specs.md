# Music Jukebox – Developer Specification

## Overview

This project is a single-page web application (SPA) that emulates a retro-style music jukebox. It is implemented with vanilla HTML, CSS, and JavaScript using ES Modules. The app will not include a build step and will be structured for maximum clarity, accessibility, and maintainability.

---

## 1. Functional Requirements

### Core Features

- Display a list of **11 fixed songs**.
- Each song has:
  - A **title** (English only)
  - An **artist name**
- Users can:
  - Play a song by clicking its associated **"Play"** button.
  - Click **"Play All"** to auto-play all songs sequentially.
  - Pause, resume, and restart the currently playing song.
  - Adjust volume using a **rotary-style volume knob**.
  - Mute/unmute using a **dedicated mute button**.
- Highlight the **currently playing** song button.
- Errors during playback are displayed visibly to the user.

---

## 2. Non-Functional Requirements

### UI/UX

- Aesthetic inspired by an **old-fashioned physical jukebox**:
  - Curved top, glowing accents, vintage buttons.
- Fully **responsive layout** (desktop/tablet/mobile).
- Uses accessible, semantic HTML with full **keyboard navigation** and **ARIA support**.

### Accessibility

- All interactive elements are reachable via `Tab` and operable with `Enter`/`Space`.
- ARIA roles and labels applied to all buttons.
- No audio should play automatically — waits for user interaction.

---

## 3. Technology Stack

- **HTML/CSS/JavaScript (ES Modules)** – no build step.
- **ESLint** – for code linting.
- **Vitest** – for unit testing of non-DOM logic.

---

## 4. Architecture

### Directory Structure

```
/jukebox-app
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   ├── main.js
│   ├── player.js
│   ├── controls.js
│   └── data.js
├── assets/
│   └── audio/ (11 audio files in .mp3, .ogg, .wav, .flac)
├── tests/
│   └── player.test.js
└── specs.md
```

### ES Modules

- `data.js`: Exports the fixed list of song objects.
- `player.js`: Handles audio logic (play, pause, stop, volume, sequence).
- `controls.js`: Manages UI controls and event listeners.
- `main.js`: Initializes the app and ties modules together.

---

## 5. Song Data

```js
// data.js
export const songs = [
  { title: "Song One", artist: "Artist A", file: "audio/song1.mp3" },
  { title: "Song Two", artist: "Artist B", file: "audio/song2.ogg" },
  // ...total of 11 songs
];
```

---

## 6. Playback Logic

- Clicking a song’s "Play" button immediately stops any other playback and plays that song.
- Clicking “Play All” starts at song 1 and plays through the list.
  - Playback does **not loop**.
  - If a user manually plays a song, “Play All” is cancelled.

---

## 7. Error Handling

- If an audio file fails to load or play:
  - Display a message like: `"Error: Unable to play 'Song Title'."`
  - Skip to the next song in “Play All” mode, if applicable.
- Use try/catch and `Audio.onerror` for robust error detection.

---

## 8. Testing Plan

### Tool

- **Vitest** for non-DOM logic testing.

### Scope

Tests will cover:
- Playback sequencing (`playAll` logic).
- Song switching rules (manual override behavior).
- Volume value mapping logic.

DOM interaction (e.g. button clicks, event binding) is **not** tested.

---

## 9. Linting & Style

- ESLint will enforce consistent code style and help catch common issues.
- Use standard ESLint configuration with ES Module support.

---

## 10. Constraints

- All songs and assets are embedded in the project folder.
- English-only; no localization or internationalization required.
- No frameworks or external UI libraries.
- No server-side code.

---

## End of Specification