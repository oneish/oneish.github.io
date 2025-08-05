// UI controls module

export function renderSongList(container, songs) {
  // Clear any existing content
  container.innerHTML = '';
  
  songs.forEach((song, index) => {
    const listItem = document.createElement('li');
    listItem.setAttribute('role', 'option');
    listItem.setAttribute('aria-selected', 'false');
    
    const button = document.createElement('button');
    
    button.dataset.index = index;
    button.textContent = `▶ ${song.title} — ${song.artist}`;
    button.setAttribute('aria-label', `Play ${song.title} by ${song.artist}`);
    button.className = 'song-button';
    button.setAttribute('role', 'button');
    
    // Add keyboard navigation support
    button.addEventListener('keydown', handleSongButtonKeydown);
    
    listItem.appendChild(button);
    container.appendChild(listItem);
  });
}

function handleSongButtonKeydown(event) {
  const songButtons = Array.from(document.querySelectorAll('.song-button'));
  const currentIndex = songButtons.indexOf(event.target);
  let targetIndex = currentIndex;
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      targetIndex = currentIndex < songButtons.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'ArrowUp':
      event.preventDefault();
      targetIndex = currentIndex > 0 ? currentIndex - 1 : songButtons.length - 1;
      break;
    case 'Home':
      event.preventDefault();
      targetIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      targetIndex = songButtons.length - 1;
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      event.target.click();
      return;
    default:
      return; // Don't handle other keys
  }
  
  // Focus the target button
  if (songButtons[targetIndex]) {
    songButtons[targetIndex].focus();
  }
}

export function initVolumeControl(player) {
  const volumeKnob = document.getElementById('volume-knob');
  if (!volumeKnob) return;
  
  let isDragging = false;
  
  // Set initial volume display
  updateVolumeKnob(player.volume);
  
  function updateVolumeKnob(volume) {
    // Map volume (0-1) to rotation (-135° to +135°)
    const rotation = (volume * 270) - 135;
    volumeKnob.style.transform = `rotate(${rotation}deg)`;
    volumeKnob.setAttribute('aria-valuenow', Math.round(volume * 100));
  }
  
  function getAngleFromMouse(clientX, clientY) {
    const rect = volumeKnob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Calculate angle in degrees (-180 to +180)
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Normalize to 0-360
    if (angle < 0) angle += 360;
    
    // Convert to our knob range: 45° to 315° maps to 0-1 volume
    // This gives us a 270° rotation range with 45° dead zones at top
    if (angle >= 45 && angle <= 315) {
      return Math.max(0, Math.min(1, (angle - 45) / 270));
    }
    
    // Handle edge cases in dead zones
    return angle < 180 ? 0 : 1;
  }
  
  function handleMouseMove(event) {
    if (!isDragging) return;
    
    const volume = getAngleFromMouse(event.clientX, event.clientY);
    player.setVolume(volume);
    updateVolumeKnob(volume);
  }
  
  function handleMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    volumeKnob.classList.remove('dragging');
  }
  
  // Mouse events
  volumeKnob.addEventListener('mousedown', (event) => {
    event.preventDefault();
    isDragging = true;
    
    volumeKnob.classList.add('dragging');
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Set initial volume from mouse position
    const volume = getAngleFromMouse(event.clientX, event.clientY);
    player.setVolume(volume);
    updateVolumeKnob(volume);
  });
  
  // Keyboard controls
  volumeKnob.addEventListener('keydown', (event) => {
    const currentVolume = player.volume;
    let newVolume = currentVolume;
    
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        newVolume = Math.min(1, currentVolume + 0.1);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        newVolume = Math.max(0, currentVolume - 0.1);
        break;
      case 'Home':
        newVolume = 0;
        break;
      case 'End':
        newVolume = 1;
        break;
      default:
        return; // Don't prevent default for other keys
    }
    
    event.preventDefault();
    player.setVolume(newVolume);
    updateVolumeKnob(newVolume);
  });
  
  // Update knob when volume changes from other sources
  document.addEventListener('volumechange', (event) => {
    updateVolumeKnob(event.detail.volume);
  });
}

export function initMuteButton(player) {
  const muteButton = document.getElementById('mute-btn');
  if (!muteButton) return;
  
  function updateMuteButton() {
    if (player.isMuted) {
      muteButton.textContent = '🔇 Unmute';
      muteButton.classList.add('muted');
      muteButton.setAttribute('aria-label', 'Unmute audio');
    } else {
      muteButton.textContent = '🔊 Mute';
      muteButton.classList.remove('muted');
      muteButton.setAttribute('aria-label', 'Mute audio');
    }
  }
  
  // Set initial state
  updateMuteButton();
  
  muteButton.addEventListener('click', () => {
    player.toggleMute();
    updateMuteButton();
    
    // Dispatch volume change event for knob update
    document.dispatchEvent(new CustomEvent('volumechange', {
      detail: { volume: player.volume, isMuted: player.isMuted }
    }));
  });
  
  // Keyboard support
  muteButton.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      muteButton.click();
    }
  });
}

export function initPlayAllButton(player) {
  const playAllButton = document.getElementById('play-all');
  if (!playAllButton) return;
  
  function updatePlayAllButton() {
    const state = player.getPlaybackState();
    if (state.isSequence) {
      playAllButton.textContent = '⏸️ Stop All';
      playAllButton.classList.add('playing');
      playAllButton.setAttribute('aria-label', 'Stop sequential playback');
    } else {
      playAllButton.textContent = '▶️ Play All';
      playAllButton.classList.remove('playing');
      playAllButton.setAttribute('aria-label', 'Play all songs in sequence');
    }
  }
  
  // Set initial state
  updatePlayAllButton();
  
  playAllButton.addEventListener('click', () => {
    const state = player.getPlaybackState();
    if (state.isSequence) {
      player.stop();
    } else {
      player.playAll();
    }
    updatePlayAllButton();
  });
  
  // Update button when songs change
  document.addEventListener('songchange', () => {
    updatePlayAllButton();
  });
  
  // Keyboard support
  playAllButton.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      playAllButton.click();
    }
  });
}

export function initSongHighlighting() {
  function updateActiveSong(index, song = null) {
    // Remove active class and aria-selected from all song buttons
    const allButtons = document.querySelectorAll('.song-button');
    const allListItems = document.querySelectorAll('#song-list li');
    
    allButtons.forEach(button => button.classList.remove('active'));
    allListItems.forEach(item => item.setAttribute('aria-selected', 'false'));
    
    // Add active class to current song button
    if (index !== null && index !== undefined) {
      const activeButton = document.querySelector(`[data-index="${index}"]`);
      const activeListItem = activeButton?.parentElement;
      
      if (activeButton && activeListItem) {
        activeButton.classList.add('active');
        activeListItem.setAttribute('aria-selected', 'true');
        
        // Scroll into view if needed
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Update current song status for screen readers
        updateCurrentSongStatus(song);
      }
    } else {
      // Clear current song status
      updateCurrentSongStatus(null);
    }
  }
  
  // Listen for song changes
  document.addEventListener('songchange', (event) => {
    updateActiveSong(event.detail.index, event.detail.song);
  });
  
  // Clear highlighting when playback stops
  document.addEventListener('playbackstopped', () => {
    updateActiveSong(null);
  });
}

function updateCurrentSongStatus(song) {
  const statusElement = document.getElementById('current-song');
  if (!statusElement) return;
  
  if (song) {
    statusElement.textContent = `Now playing: ${song.title} by ${song.artist}`;
    statusElement.setAttribute('aria-label', `Currently playing ${song.title} by ${song.artist}`);
  } else {
    statusElement.textContent = ' ';
    statusElement.setAttribute('aria-label', 'No song currently playing');
  }
}
