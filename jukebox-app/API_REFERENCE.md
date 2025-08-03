# Player API Reference

This document describes the complete API interface for the Music Jukebox Player class.

## Constructor

```javascript
const player = new Player(songList);
```
- `songList`: Array of song objects with `{title, artist, file}` properties

## Core Playback Methods

### `play(index)`
Plays a song at the specified index.
```javascript
player.play(0); // Play first song
```
- Validates index bounds
- Stops any currently playing audio
- Cancels sequence mode if called manually
- Dispatches `songchange` event
- Handles audio errors gracefully

### `pause()`
Pauses the currently playing audio.
```javascript
player.pause();
```
- Only pauses if audio is currently playing
- Updates `isPlaying` state

### `resume()`
Resumes paused audio playback.
```javascript
player.resume();
```
- Only resumes if audio exists and is paused
- Updates `isPlaying` state

### `stop()`
Stops playback and resets the player state.
```javascript
player.stop();
```
- Pauses audio and resets currentTime to 0
- Clears audio reference and resets all state
- Cancels sequence mode

## Volume Control Methods

### `setVolume(volume)`
Sets the playback volume.
```javascript
player.setVolume(0.7); // 70% volume
```
- Accepts values between 0.0 and 1.0
- Automatically clamps values to valid range
- Respects mute state

### `mute()`
Mutes the audio playback.
```javascript
player.mute();
```
- Sets audio volume to 0
- Preserves original volume level

### `unmute()`
Unmutes the audio playback.
```javascript
player.unmute();
```
- Restores audio to original volume level

### `toggleMute()`
Toggles between muted and unmuted states.
```javascript
player.toggleMute();
```

## Sequential Playback Methods

### `playAll()`
Starts sequential playback from the first song.
```javascript
player.playAll();
```
- Enables sequence mode
- Plays songs in order automatically
- Stops at the end of the playlist

## Utility Methods

### `getCurrentSong()`
Returns the currently playing song object.
```javascript
const song = player.getCurrentSong();
// Returns: {title: "Song Title", artist: "Artist Name", file: "path/to/file.mp3"}
```

### `getPlaybackState()`
Returns complete player state information.
```javascript
const state = player.getPlaybackState();
// Returns: {
//   isPlaying: boolean,
//   currentIndex: number|null,
//   volume: number,
//   isMuted: boolean,
//   isSequence: boolean,
//   currentSong: object|null
// }
```

## Events

### `songchange` Event
Dispatched when a new song starts playing.
```javascript
document.addEventListener('songchange', (event) => {
  const { index, song } = event.detail;
  console.log(`Now playing: ${song.title} by ${song.artist}`);
});
```

## Error Handling

The Player class includes comprehensive error handling:

- **Invalid index validation**: Prevents crashes from out-of-bounds indices
- **Audio loading errors**: Graceful handling with user-friendly error messages
- **Playback failures**: Promise rejection handling with console logging
- **Empty playlist protection**: Warns when trying to play empty playlists

## State Management

The Player maintains internal state including:
- `isPlaying`: Boolean indicating if audio is currently playing
- `currentIndex`: Index of currently playing song (null if none)
- `volume`: Current volume level (0.0 to 1.0)
- `isMuted`: Boolean indicating mute state
- `isSequence`: Boolean indicating if sequential playback is active

## Usage Example

```javascript
import { Player } from './scripts/player.js';
import { songs } from './scripts/data.js';

// Initialize player
const player = new Player(songs);

// Play a specific song
player.play(0);

// Control volume
player.setVolume(0.8);
player.mute();
player.unmute();

// Sequential playback
player.playAll();

// Listen for song changes
document.addEventListener('songchange', (event) => {
  updateUI(event.detail.index);
});
```

The API is designed to be simple, intuitive, and robust, providing all necessary functionality for a complete music jukebox experience.
