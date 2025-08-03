import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Player } from '../scripts/player.js';

// Mock Audio constructor
class MockAudio {
  constructor(src) {
    this.src = src;
    this.volume = 1;
    this.currentTime = 0;
    this.paused = true;
    this.ended = false;
    this.error = null;
    this.eventListeners = {};
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

  dispatchEvent(event) {
    const listeners = this.eventListeners[event.type];
    if (listeners) {
      listeners.forEach(listener => listener(event));
    }
  }

  async play() {
    this.paused = false;
    // Simulate small delay and resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  triggerEnded() {
    this.ended = true;
    this.dispatchEvent(new Event('ended'));
  }

  triggerError() {
    this.dispatchEvent(new Event('error'));
  }
}

// Global mock setup
global.Audio = MockAudio;

describe('Player Class', () => {
  let player;
  let mockSongs;

  beforeEach(() => {
    mockSongs = [
      { title: 'Song 1', artist: 'Artist 1', file: 'song1.mp3' },
      { title: 'Song 2', artist: 'Artist 2', file: 'song2.mp3' },
      { title: 'Song 3', artist: 'Artist 3', file: 'song3.mp3' }
    ];
    player = new Player(mockSongs);
    
    // Mock document.getElementById and document.dispatchEvent
    global.document = {
      getElementById: vi.fn(() => ({ textContent: '' })),
      dispatchEvent: vi.fn()
    };
  });

  describe('Constructor', () => {
    it('should initialize with correct properties', () => {
      expect(player.songs).toBe(mockSongs);
      expect(player.audio).toBeNull();
      expect(player.currentIndex).toBeNull();
      expect(player.isPlaying).toBe(false);
      expect(player.isMuted).toBe(false);
      expect(player.volume).toBe(1.0);
      expect(player.isSequence).toBe(false);
    });
  });

  describe('play() method', () => {
    it('should play a song at valid index', async () => {
      await player.play(0);
      // Wait a tick for the promise to resolve
      await new Promise(resolve => setTimeout(resolve, 1));
      
      expect(player.currentIndex).toBe(0);
      expect(player.audio).toBeInstanceOf(MockAudio);
      expect(player.audio.src).toBe('song1.mp3');
      expect(player.isPlaying).toBe(true);
    });

    it('should handle invalid index', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      player.play(-1);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid song index:', -1);
      
      player.play(999);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid song index:', 999);
      
      consoleSpy.mockRestore();
    });

    it('should stop current audio before playing new song', async () => {
      await player.play(0);
      const firstAudio = player.audio;
      
      await player.play(1);
      
      expect(player.currentIndex).toBe(1);
      expect(player.audio).not.toBe(firstAudio);
      expect(player.audio.src).toBe('song2.mp3');
    });

    it('should cancel sequence mode when manually selecting song', async () => {
      player.isSequence = true;
      await player.play(1);
      
      expect(player.isSequence).toBe(false);
    });

    it('should dispatch songchange event', async () => {
      await player.play(0);
      await new Promise(resolve => setTimeout(resolve, 1));
      
      expect(document.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'songchange',
          detail: expect.objectContaining({
            index: 0,
            song: mockSongs[0]
          })
        })
      );
    });
  });

  describe('pause() method', () => {
    it('should pause playing audio', async () => {
      await player.play(0);
      await new Promise(resolve => setTimeout(resolve, 1));
      player.pause();
      
      expect(player.isPlaying).toBe(false);
      expect(player.audio.paused).toBe(true);
    });

    it('should do nothing if no audio is playing', () => {
      player.pause();
      expect(player.audio).toBeNull();
    });
  });

  describe('resume() method', () => {
    it('should resume paused audio', async () => {
      await player.play(0);
      await new Promise(resolve => setTimeout(resolve, 1));
      player.pause();
      
      await player.resume();
      await new Promise(resolve => setTimeout(resolve, 1));
      
      expect(player.isPlaying).toBe(true);
    });
  });

  describe('stop() method', () => {
    it('should stop audio and reset state', async () => {
      await player.play(0);
      player.stop();
      
      expect(player.audio).toBeNull();
      expect(player.currentIndex).toBeNull();
      expect(player.isPlaying).toBe(false);
      expect(player.isSequence).toBe(false);
    });
  });

  describe('setVolume() method', () => {
    it('should set volume within valid range', () => {
      player.setVolume(0.5);
      expect(player.volume).toBe(0.5);
      
      player.setVolume(-0.1);
      expect(player.volume).toBe(0);
      
      player.setVolume(1.5);
      expect(player.volume).toBe(1);
    });

    it('should update audio volume when not muted', async () => {
      await player.play(0);
      player.setVolume(0.7);
      
      expect(player.audio.volume).toBe(0.7);
    });
  });

  describe('mute/unmute functionality', () => {
    it('should mute and unmute audio', async () => {
      await player.play(0);
      
      player.mute();
      expect(player.isMuted).toBe(true);
      expect(player.audio.volume).toBe(0);
      
      player.unmute();
      expect(player.isMuted).toBe(false);
      expect(player.audio.volume).toBe(1);
    });

    it('should toggle mute state', () => {
      player.toggleMute();
      expect(player.isMuted).toBe(true);
      
      player.toggleMute();
      expect(player.isMuted).toBe(false);
    });
  });

  describe('playAll() method', () => {
    it('should start sequential playback', async () => {
      await player.playAll();
      await new Promise(resolve => setTimeout(resolve, 1));
      
      expect(player.isSequence).toBe(true);
      expect(player.currentIndex).toBe(0);
    });

    it('should handle empty song list', () => {
      const emptyPlayer = new Player([]);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      emptyPlayer.playAll();
      expect(consoleSpy).toHaveBeenCalledWith('No songs to play');
      
      consoleSpy.mockRestore();
    });
  });

  describe('sequential playback', () => {
    it('should advance to next song when current song ends', async () => {
      await player.playAll();
      await new Promise(resolve => setTimeout(resolve, 1));
      
      // Simulate first song ending
      player.audio.triggerEnded();
      await new Promise(resolve => setTimeout(resolve, 1));
      
      expect(player.currentIndex).toBe(1);
      expect(player.audio.src).toBe('song2.mp3');
    });

    it('should stop sequence at last song', async () => {
      await player.play(2); // Last song
      player.isSequence = true;
      
      player.audio.triggerEnded();
      
      expect(player.isSequence).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle audio errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await player.play(0);
      player.audio.triggerError();
      
      expect(document.getElementById).toHaveBeenCalledWith('error-msg');
      expect(consoleSpy).toHaveBeenCalledWith('Audio error:', expect.any(Event));
      
      consoleSpy.mockRestore();
    });

    it('should display user-friendly error message with song details', async () => {
      const mockErrorElement = { textContent: '' };
      vi.mocked(document.getElementById).mockReturnValue(mockErrorElement);
      
      await player.play(0);
      player.audio.triggerError();
      
      expect(mockErrorElement.textContent).toBe('Error: Unable to play "Song 1" by Artist 1');
    });

    it('should clear error message after 5 seconds', async () => {
      const mockErrorElement = { textContent: '' };
      vi.mocked(document.getElementById).mockReturnValue(mockErrorElement);
      vi.useFakeTimers();
      
      await player.play(0);
      player.audio.triggerError();
      
      expect(mockErrorElement.textContent).toBe('Error: Unable to play "Song 1" by Artist 1');
      
      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000);
      
      expect(mockErrorElement.textContent).toBe('');
      
      vi.useRealTimers();
    });

    it('should skip to next song during sequential playback on error', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      await player.playAll();
      await new Promise(resolve => setTimeout(resolve, 1));
      
      // Trigger error on first song
      player.audio.triggerError();
      
      // Wait for the skip delay (500ms) plus a bit more
      await new Promise(resolve => setTimeout(resolve, 600));
      
      expect(consoleSpy).toHaveBeenCalledWith('Skipping to next song due to playback error with "Song 1"');
      expect(player.currentIndex).toBe(1);
      expect(player.isSequence).toBe(true);
      
      consoleSpy.mockRestore();
    }, 10000); // 10 second timeout

    it('should end sequence when error occurs on last song', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      await player.play(2); // Last song
      player.isSequence = true;
      
      player.audio.triggerError();
      
      expect(consoleSpy).toHaveBeenCalledWith('End of playlist reached due to error on last song');
      expect(player.isSequence).toBe(false);
      expect(player.currentIndex).toBe(null);
      
      consoleSpy.mockRestore();
    });

    it('should not skip when error occurs during manual playback', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      await player.play(1); // Manual play, not sequence
      player.audio.triggerError();
      
      // Should not trigger skip logic
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Skipping to next song'));
      expect(player.currentIndex).toBe(1); // Should remain on same song
      
      consoleSpy.mockRestore();
    });
  });

  describe('utility methods', () => {
    it('should return current song', async () => {
      await player.play(1);
      await new Promise(resolve => setTimeout(resolve, 1));
      
      expect(player.getCurrentSong()).toBe(mockSongs[1]);
    });

    it('should return null when no song is playing', () => {
      expect(player.getCurrentSong()).toBeNull();
    });

    it('should return playback state', async () => {
      await player.play(1);
      await new Promise(resolve => setTimeout(resolve, 1));
      player.setVolume(0.8);
      
      const state = player.getPlaybackState();
      
      expect(state).toEqual({
        isPlaying: true,
        currentIndex: 1,
        volume: 0.8,
        isMuted: false,
        isSequence: false,
        currentSong: mockSongs[1]
      });
    });
  });
});

describe('baseline', () => {
  it('sanity check', () => { 
    expect(true).toBe(true); 
  });
});
