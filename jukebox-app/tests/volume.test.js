import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Player } from '../scripts/player.js';

class MockAudio {
  constructor(src) {
    this.src = src;
    this._volume = 1;
    this.currentTime = 0;
    this.paused = true;
    this.ended = false;
    this.eventListeners = {};
  }

  get volume() {
    return this._volume;
  }

  set volume(value) {
    this._volume = Math.max(0, Math.min(1, value));
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (this.eventListeners[event]) {
      const index = this.eventListeners[event].indexOf(handler);
      if (index > -1) {
        this.eventListeners[event].splice(index, 1);
      }
    }
  }

  async play() {
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  load() {
    this.currentTime = 0;
    this.ended = false;
  }
}

global.document = {
  getElementById: vi.fn(() => ({ textContent: '' })),
  dispatchEvent: vi.fn()
};

global.Audio = MockAudio;

describe('Volume Control Tests', () => {
  let player;
  const mockSongs = [
    { title: 'Test Song 1', artist: 'Artist A', file: 'song1.mp3' },
    { title: 'Test Song 2', artist: 'Artist B', file: 'song2.mp3' }
  ];

  beforeEach(() => {
    player = new Player(mockSongs);
  });

  describe('Volume Control', () => {
    it('should set volume correctly', () => {
      player.setVolume(0.5);
      expect(player.volume).toBe(0.5);
    });

    it('should clamp volume to valid range', () => {
      player.setVolume(1.5);
      expect(player.volume).toBe(1);
      
      player.setVolume(-0.5);
      expect(player.volume).toBe(0);
    });

    it('should apply volume to audio instance', async () => {
      player.setVolume(0.7);
      await player.play(0);
      expect(player.audio.volume).toBe(0.7);
    });
  });

  describe('Mute Functionality', () => {
    it('should mute audio correctly', async () => {
      player.setVolume(0.6);
      await player.play(0);
      player.mute();
      
      expect(player.isMuted).toBe(true);
      expect(player.volume).toBe(0.6); // Player volume property stays the same
      expect(player.audio.volume).toBe(0); // Audio volume is set to 0
    });

    it('should unmute and restore previous volume', () => {
      player.setVolume(0.6);
      player.mute();
      player.unmute();
      
      expect(player.isMuted).toBe(false);
      expect(player.volume).toBe(0.6);
    });

    it('should handle mute toggle', async () => {
      player.setVolume(0.5);
      await player.play(0);
      
      player.toggleMute();
      expect(player.isMuted).toBe(true);
      expect(player.volume).toBe(0.5); // Player volume property stays the same
      expect(player.audio.volume).toBe(0); // Audio volume is muted
      
      player.toggleMute();
      expect(player.isMuted).toBe(false);
      expect(player.volume).toBe(0.5);
      expect(player.audio.volume).toBe(0.5); // Audio volume is restored
    });
  });
});
