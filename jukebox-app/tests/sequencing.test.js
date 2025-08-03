import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Player } from '../scripts/player.js';

// Mock Audio constructor with enhanced sequencing simulation
class MockAudio {
  constructor(src) {
    this.src = src;
    this.volume = 1;
    this.currentTime = 0;
    this.duration = 180; // 3 minutes default
    this.paused = true;
    this.ended = false;
    this.error = null;
    this.eventListeners = {};
    this.playCount = 0;
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
    this.playCount++;
    await new Promise(resolve => setTimeout(resolve, 0));
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  load() {
    this.currentTime = 0;
    this.ended = false;
  }

  triggerEnded() {
    this.ended = true;
    this.paused = true;
    this.dispatchEvent({ type: 'ended' });
  }

  triggerError() {
    this.error = new Error('Playback failed');
    this.dispatchEvent({ type: 'error', error: this.error });
  }

  simulateProgress(time) {
    this.currentTime = time;
    this.dispatchEvent({ type: 'timeupdate' });
  }
}

// Mock document for DOM operations
global.document = {
  getElementById: vi.fn(() => ({ textContent: '' })),
  dispatchEvent: vi.fn()
};

// Global Audio mock
global.Audio = MockAudio;

describe('Advanced Sequencing Logic', () => {
  let player;
  const mockSongs = [
    { title: 'First Song', artist: 'Artist A', file: 'song1.mp3' },
    { title: 'Second Song', artist: 'Artist B', file: 'song2.mp3' },
    { title: 'Third Song', artist: 'Artist C', file: 'song3.mp3' },
    { title: 'Fourth Song', artist: 'Artist D', file: 'song4.mp3' },
    { title: 'Fifth Song', artist: 'Artist E', file: 'song5.mp3' }
  ];

  beforeEach(() => {
    player = new Player(mockSongs);
    vi.clearAllMocks();
  });

  describe('Sequential Playback Initialization', () => {
    it('should initialize sequence state correctly', async () => {
      expect(player.isSequence).toBe(false);
      expect(player.currentIndex).toBe(null);
      
      await player.playAll();
      
      expect(player.isSequence).toBe(true);
      expect(player.currentIndex).toBe(0);
    });

    it('should start from beginning even if a song was previously playing', async () => {
      // Play a song manually first
      await player.play(2);
      expect(player.currentIndex).toBe(2);
      
      // Start playAll sequence
      await player.playAll();
      
      expect(player.currentIndex).toBe(0);
      expect(player.isSequence).toBe(true);
    });

    it('should handle playAll called multiple times', async () => {
      await player.playAll();
      const firstAudio = player.audio;
      
      await player.playAll(); // Call again
      
      expect(player.currentIndex).toBe(0);
      expect(player.isSequence).toBe(true);
      expect(player.audio).not.toBe(firstAudio); // New audio instance
    });

    it('should handle empty playlist gracefully', () => {
      const emptyPlayer = new Player([]);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      emptyPlayer.playAll();
      
      expect(emptyPlayer.isSequence).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('No songs to play');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Sequential Progression Logic', () => {
    it('should progress to next song when current song ends', async () => {
      await player.playAll();
      expect(player.currentIndex).toBe(0);
      
      // Simulate first song ending
      player.audio.triggerEnded();
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(player.currentIndex).toBe(1);
      expect(player.audio.src).toBe('song2.mp3');
      expect(player.isSequence).toBe(true);
    });

    it('should stop sequence at the last song', async () => {
      await player.playAll();
      
      // Jump to last song by simulating ended events
      for (let i = 0; i < mockSongs.length - 1; i++) {
        player.audio.triggerEnded();
        await new Promise(resolve => setTimeout(resolve, 5));
      }
      
      expect(player.currentIndex).toBe(mockSongs.length - 1);
      expect(player.isSequence).toBe(true);
      
      // Last song ends
      player.audio.triggerEnded();
      await new Promise(resolve => setTimeout(resolve, 5));
      
      expect(player.isSequence).toBe(false);
    });

    it('should handle rapid sequence progression', async () => {
      await player.playAll();
      
      // Rapidly trigger ended events
      for (let i = 0; i < mockSongs.length; i++) {
        if (player.audio && player.isSequence) {
          player.audio.triggerEnded();
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }
      
      expect(player.isSequence).toBe(false);
    });

    it('should maintain consistent state during sequence', async () => {
      await player.playAll();
      let previousIndex = -1;
      
      // Track progression through sequence
      for (let i = 0; i < 3; i++) {
        expect(player.currentIndex).toBeGreaterThan(previousIndex);
        expect(player.isSequence).toBe(true);
        previousIndex = player.currentIndex;
        
        player.audio.triggerEnded();
        await new Promise(resolve => setTimeout(resolve, 5));
      }
    });
  });

  describe('Sequence Interruption Logic', () => {
    it('should cancel sequence when manual play is called', async () => {
      await player.playAll();
      expect(player.isSequence).toBe(true);
      
      // Manually play a different song
      await player.play(3);
      
      expect(player.isSequence).toBe(false);
      expect(player.currentIndex).toBe(3);
    });

    it('should cancel sequence when same song is played manually', async () => {
      await player.playAll();
      expect(player.currentIndex).toBe(0);
      expect(player.isSequence).toBe(true);
      
      // Manually play the same song
      await player.play(0);
      
      expect(player.isSequence).toBe(false);
      expect(player.currentIndex).toBe(0);
    });

    it('should cancel sequence on stop', async () => {
      await player.playAll();
      expect(player.isSequence).toBe(true);
      
      player.stop();
      
      expect(player.isSequence).toBe(false);
      expect(player.currentIndex).toBe(null);
    });

    it('should handle stop during mid-sequence', async () => {
      await player.playAll();
      
      // Progress partway through
      player.audio.triggerEnded();
      await new Promise(resolve => setTimeout(resolve, 5));
      
      expect(player.currentIndex).toBe(1);
      
      player.stop();
      
      expect(player.isSequence).toBe(false);
      expect(player.currentIndex).toBe(null);
      expect(player.audio).toBe(null);
    });
  });

  describe('Sequence Error Handling', () => {
    it('should skip to next song on error during sequence', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await player.playAll();
      expect(player.currentIndex).toBe(0);
      
      // Trigger error on first song
      player.audio.triggerError();
      await new Promise(resolve => setTimeout(resolve, 600)); // Increased delay for async handling
      
      expect(player.currentIndex).toBe(1);
      expect(player.isSequence).toBe(true);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should end sequence if error occurs on last song', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await player.playAll();
      
      // Jump to last song
      for (let i = 0; i < mockSongs.length - 1; i++) {
        player.audio.triggerEnded();
        await new Promise(resolve => setTimeout(resolve, 5));
      }
      
      expect(player.currentIndex).toBe(mockSongs.length - 1);
      
      // Trigger error on last song
      player.audio.triggerError();
      await new Promise(resolve => setTimeout(resolve, 15));
      
      expect(player.isSequence).toBe(false);
      
      consoleSpy.mockRestore();
    });

    it('should handle multiple consecutive errors in sequence', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await player.playAll();
      
      // Trigger errors on first 3 songs with proper timing
      for (let i = 0; i < 3; i++) {
        if (player.audio && player.isSequence) {
          player.audio.triggerError();
          await new Promise(resolve => setTimeout(resolve, 600)); // Wait for async error handling
        }
      }
      
      expect(player.currentIndex).toBe(3);
      expect(player.isSequence).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Sequence State Management', () => {
    it('should maintain sequence state across audio instance changes', async () => {
      await player.playAll();
      const firstAudio = player.audio;
      
      player.audio.triggerEnded();
      await new Promise(resolve => setTimeout(resolve, 5));
      
      expect(player.audio).not.toBe(firstAudio);
      expect(player.isSequence).toBe(true);
    });

    it('should properly clean up audio instances during sequence', async () => {
      await player.playAll();
      const audioInstances = [];
      
      // Collect audio instances as we progress
      audioInstances.push(player.audio);
      
      for (let i = 0; i < 2; i++) {
        player.audio.triggerEnded();
        await new Promise(resolve => setTimeout(resolve, 5));
        if (player.audio) {
          audioInstances.push(player.audio);
        }
      }
      
      // Each should be a unique instance
      expect(audioInstances[0]).not.toBe(audioInstances[1]);
      expect(audioInstances[1]).not.toBe(audioInstances[2]);
    });

    it('should dispatch DOM events during sequence progression', async () => {
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');
      
      await player.playAll();
      
      // Progress through a couple songs
      for (let i = 0; i < 2; i++) {
        player.audio.triggerEnded();
        await new Promise(resolve => setTimeout(resolve, 5));
      }
      
      // Should have dispatched songchange events
      expect(dispatchSpy).toHaveBeenCalled();
      const calls = dispatchSpy.mock.calls.filter(call => 
        call[0].type === 'songchange'
      );
      expect(calls.length).toBeGreaterThanOrEqual(3); // Initial + 2 progressions
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle single song playlist', async () => {
      const singleSongPlayer = new Player([mockSongs[0]]);
      
      await singleSongPlayer.playAll();
      expect(singleSongPlayer.isSequence).toBe(true);
      expect(singleSongPlayer.currentIndex).toBe(0);
      
      singleSongPlayer.audio.triggerEnded();
      await new Promise(resolve => setTimeout(resolve, 5));
      
      expect(singleSongPlayer.isSequence).toBe(false);
    });

    it('should handle sequence with invalid song indices safely', async () => {
      await player.playAll();
      
      // Manually corrupt the state
      const originalLength = player.songs.length;
      player.currentIndex = originalLength + 5; // Way out of bounds
      
      // Should not crash when trying to progress
      expect(() => {
        player.audio.triggerEnded();
      }).not.toThrow();
    });

    it('should maintain volume during sequence progression', async () => {
      player.setVolume(0.5);
      await player.playAll();
      
      expect(player.audio.volume).toBe(0.5);
      
      player.audio.triggerEnded();
      await new Promise(resolve => setTimeout(resolve, 5));
      
      expect(player.audio.volume).toBe(0.5);
    });

    it('should maintain mute state during sequence progression', async () => {
      player.mute();
      await player.playAll();
      
      expect(player.audio.volume).toBe(0);
      expect(player.isMuted).toBe(true);
      
      player.audio.triggerEnded();
      await new Promise(resolve => setTimeout(resolve, 5));
      
      expect(player.audio.volume).toBe(0);
      expect(player.isMuted).toBe(true);
    });

    it('should handle pause during sequence', async () => {
      await player.playAll();
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait for play to complete
      expect(player.isSequence).toBe(true);
      
      player.pause();
      
      // Sequence should continue to be active, just paused
      expect(player.isSequence).toBe(true);
      if (player.audio) {
        expect(player.audio.paused).toBe(true);
      }
    });

    it('should handle resume during sequence', async () => {
      await player.playAll();
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait for play to complete
      player.pause();
      
      expect(player.isSequence).toBe(true);
      if (player.audio) {
        expect(player.audio.paused).toBe(true);
      }
      
      player.resume();
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait for resume to complete
      
      expect(player.isSequence).toBe(true);
      expect(player.isPlaying).toBe(true);
    });
  });

  describe('Performance and Stress Testing', () => {
    it('should handle rapid play/stop cycles', async () => {
      for (let i = 0; i < 10; i++) {
        await player.playAll();
        player.stop();
      }
      
      expect(player.isSequence).toBe(false);
      expect(player.currentIndex).toBe(null);
    });

    it('should handle sequence with many songs efficiently', async () => {
      // Create a large playlist
      const largeSongList = Array.from({ length: 50 }, (_, i) => ({
        title: `Song ${i + 1}`,
        artist: `Artist ${i + 1}`,
        file: `song${i + 1}.mp3`
      }));
      
      const largePlayer = new Player(largeSongList);
      
      await largePlayer.playAll();
      
      expect(largePlayer.isSequence).toBe(true);
      expect(largePlayer.currentIndex).toBe(0);
    });
  });
});
