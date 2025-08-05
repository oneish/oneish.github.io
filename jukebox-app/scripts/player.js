// Audio player module
export class Player {
  constructor(songList) {
    this.songs = songList;
    this.audio = null;
    this.currentIndex = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 1.0;
    this.isSequence = false;
  }

  play(index, fromSequence = false) {
    // Validate index
    if (index < 0 || index >= this.songs.length) {
      console.error('Invalid song index:', index);
      return;
    }

    // Stop current audio if playing (but preserve sequence state if transitioning)
    if (this.audio) {
      const wasSequence = this.isSequence && fromSequence;
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
      this.isPlaying = false;
      // Only reset sequence state if this is a manual stop
      if (!wasSequence) {
        this.isSequence = false;
      }
    }

    // Don't cancel sequence mode if manually selecting a song (not from sequence)
    if (!fromSequence) {
      this.isSequence = true;
    }

    // Create new audio element
    const song = this.songs[index];
    this.audio = new Audio(song.file);
    this.currentIndex = index;

    // Set volume and mute state
    this.audio.volume = this.isMuted ? 0 : this.volume;

    // Handle audio events
    this.audio.addEventListener('error', (event) => {
      console.error('Audio error:', event);
      this.handlePlaybackError(song);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      if (this.isSequence && this.currentIndex < this.songs.length - 1) {
        // Play next song in sequence
        this.play(this.currentIndex + 1, true);
      } else {
        this.isSequence = false;
      }
    });

    // Start playback
    this.audio.play().then(() => {
      this.isPlaying = true;
      // Dispatch custom event for UI updates
      document.dispatchEvent(new CustomEvent('songchange', { 
        detail: { index, song } 
      }));
    }).catch((error) => {
      console.error('Playback failed:', error);
      this.isPlaying = false;
    });
  }

  pause() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  resume() {
    if (this.audio && !this.isPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch((error) => {
        console.error('Resume failed:', error);
      });
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
      this.isPlaying = false;
      this.currentIndex = null;
      this.isSequence = false;
      
      // Dispatch event for UI updates
      document.dispatchEvent(new CustomEvent('playbackstopped'));
    }
  }

  setVolume(volume) {
    // Clamp volume between 0 and 1
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.audio && !this.isMuted) {
      this.audio.volume = this.volume;
    }
  }

  mute() {
    this.isMuted = true;
    if (this.audio) {
      this.audio.volume = 0;
    }
  }

  unmute() {
    this.isMuted = false;
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  playAll() {
    if (this.songs.length === 0) {
      console.warn('No songs to play');
      return;
    }
    
    this.isSequence = true;
    this.play(0, true);
  }

  handlePlaybackError(song) {
    // Display user-friendly error message
    const errorMsg = document.getElementById('error-msg');
    if (errorMsg) {
      errorMsg.textContent = `Error: Unable to play "${song.title}" by ${song.artist}`;
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        if (errorMsg.textContent.includes(song.title)) {
          errorMsg.textContent = '';
        }
      }, 5000);
    }

    // During sequential playback, skip to next song
    if (this.isSequence && this.currentIndex < this.songs.length - 1) {
      console.log(`Skipping to next song due to playback error with "${song.title}"`);
      // Use a shorter delay for better user experience and testing
      setTimeout(() => {
        this.play(this.currentIndex + 1, true);
      }, 500);
    } else if (this.isSequence) {
      // End of playlist reached during error
      console.log('End of playlist reached due to error on last song');
      this.isSequence = false;
      this.stop();
    }
  }

  getCurrentSong() {
    if (this.currentIndex !== null && this.currentIndex < this.songs.length) {
      return this.songs[this.currentIndex];
    }
    return null;
  }

  getPlaybackState() {
    return {
      isPlaying: this.isPlaying,
      currentIndex: this.currentIndex,
      volume: this.volume,
      isMuted: this.isMuted,
      isSequence: this.isSequence,
      currentSong: this.getCurrentSong()
    };
  }
}
