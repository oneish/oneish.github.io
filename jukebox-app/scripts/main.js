// Main JavaScript entry point
import { songs } from './data.js';
import { Player } from './player.js';
import { 
  renderSongList, 
  initVolumeControl, 
  initMuteButton, 
  initPlayAllButton,
  initSongHighlighting 
} from './controls.js';

// Initialize the jukebox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize player with songs
  const player = new Player(songs);
  
  // Get UI elements
  const songListContainer = document.getElementById('song-list');
  const errorMessage = document.getElementById('error-msg');
  
  if (!songListContainer) {
    console.error('Song list container not found');
    return;
  }
  
  // Render song list
  renderSongList(songListContainer, songs);
  
  // Initialize all UI controls
  initVolumeControl(player);
  initMuteButton(player);
  initPlayAllButton(player);
  initSongHighlighting();
  
  // Handle song button clicks
  songListContainer.addEventListener('click', (event) => {
    if (event.target.matches('button[data-index]')) {
      const index = Number(event.target.dataset.index);
      player.play(index);
    }
  });
  
  // Handle keyboard navigation for song buttons (now handled in renderSongList)
  // This is kept for backward compatibility but the actual handling is in controls.js
  songListContainer.addEventListener('keydown', (event) => {
    if (event.target.matches('button[data-index]')) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        event.target.click();
      }
    }
  });
  
  // Global keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    // Skip if user is typing in an input field
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Global shortcuts
    switch (event.key) {
      case 'p':
      case 'P': {
        if (event.ctrlKey || event.metaKey) {
          return; // Don't interfere with browser print
        }
        event.preventDefault();
        // Toggle play/pause or trigger Play All
        const playAllBtn = document.getElementById('play-all');
        if (playAllBtn) {
          playAllBtn.click();
        }
        break;
      }
        
      case 'm':
      case 'M': {
        if (event.ctrlKey || event.metaKey) {
          return; // Don't interfere with browser shortcuts
        }
        event.preventDefault();
        // Toggle mute
        const muteBtn = document.getElementById('mute-btn');
        if (muteBtn) {
          muteBtn.click();
        }
        break;
      }
        
      case 'Escape':
        // Stop playback
        event.preventDefault();
        player.stop();
        // Announce to screen readers
        announceToScreenReader('Playback stopped');
        break;
        
      case '?':
        // Show keyboard shortcuts help
        event.preventDefault();
        showKeyboardHelp();
        break;
    }
  });
  
  // Function to announce messages to screen readers
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  // Function to show keyboard shortcuts
  function showKeyboardHelp() {
    const helpText = `
Keyboard Shortcuts:
- Arrow keys: Navigate song list
- Enter/Space: Play selected song or activate controls
- P: Toggle Play All
- M: Toggle Mute
- Escape: Stop playback
- Home/End: Jump to first/last song (in song list)
- Arrow keys on volume: Adjust volume
- ?: Show this help
    `.trim();
    
    announceToScreenReader(helpText);
    console.log('🎹 ' + helpText.replace(/\n/g, '\n🎹 '));
  }
  
  // Global error handling
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (errorMessage) {
      errorMessage.textContent = 'An unexpected error occurred. Please refresh the page.';
    }
  });
  
  // Clear error messages after a delay
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        const errorEl = document.getElementById('error-msg');
        if (errorEl && errorEl.textContent.trim()) {
          setTimeout(() => {
            if (errorEl.textContent.trim()) {
              errorEl.textContent = '';
            }
          }, 5000); // Clear after 5 seconds
        }
      }
    });
  });
  
  if (errorMessage) {
    observer.observe(errorMessage, { 
      childList: true, 
      characterData: true, 
      subtree: true 
    });
  }
  
  // Expose player to global scope for debugging
  if (typeof window !== 'undefined') {
    window.jukeboxPlayer = player;
  }
  
  console.log('🎵 Jukebox initialized successfully!');
  console.log(`📀 Loaded ${songs.length} songs`);
});
