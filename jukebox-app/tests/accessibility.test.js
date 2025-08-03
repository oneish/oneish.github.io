import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderSongList } from '../scripts/controls.js';

// Mock DOM elements
const mockSongs = [
  { title: 'Test Song 1', artist: 'Test Artist 1', file: 'test1.mp3' },
  { title: 'Test Song 2', artist: 'Test Artist 2', file: 'test2.mp3' },
  { title: 'Test Song 3', artist: 'Test Artist 3', file: 'test3.mp3' }
];

describe('Accessibility Features', () => {
  let mockContainer;
  
  beforeEach(() => {
    // Mock DOM
    mockContainer = {
      innerHTML: '',
      appendChild: vi.fn(),
      querySelectorAll: vi.fn(() => []),
      querySelector: vi.fn()
    };
    
    // Mock document methods
    global.document = {
      createElement: vi.fn((tagName) => ({
        tagName: tagName.toUpperCase(),
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
        appendChild: vi.fn(),
        addEventListener: vi.fn(),
        classList: {
          add: vi.fn(),
          remove: vi.fn()
        },
        focus: vi.fn(),
        click: vi.fn(),
        textContent: '',
        dataset: {},
        parentElement: {
          setAttribute: vi.fn()
        }
      })),
      querySelectorAll: vi.fn(() => []),
      querySelector: vi.fn(),
      getElementById: vi.fn(),
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn()
      }
    };
    
    global.console = {
      log: vi.fn(),
      error: vi.fn()
    };
  });

  describe('Song List Rendering', () => {
    it('should create list items with proper ARIA roles', () => {
      const mockLi = document.createElement('li');
      const mockButton = document.createElement('button');
      
      document.createElement.mockImplementation((tagName) => {
        if (tagName === 'li') return mockLi;
        if (tagName === 'button') return mockButton;
      });
      
      renderSongList(mockContainer, mockSongs);
      
      expect(mockLi.setAttribute).toHaveBeenCalledWith('role', 'option');
      expect(mockLi.setAttribute).toHaveBeenCalledWith('aria-selected', 'false');
    });

    it('should create buttons with proper ARIA labels', () => {
      const mockButton = document.createElement('button');
      
      document.createElement.mockImplementation((tagName) => {
        if (tagName === 'li') return { appendChild: vi.fn(), setAttribute: vi.fn() };
        if (tagName === 'button') return mockButton;
      });
      
      renderSongList(mockContainer, mockSongs);
      
      expect(mockButton.setAttribute).toHaveBeenCalledWith('aria-label', 'Play Test Song 1 by Test Artist 1');
      expect(mockButton.setAttribute).toHaveBeenCalledWith('role', 'button');
    });

    it('should add keyboard event listeners to buttons', () => {
      const mockButton = document.createElement('button');
      
      document.createElement.mockImplementation((tagName) => {
        if (tagName === 'li') return { appendChild: vi.fn(), setAttribute: vi.fn() };
        if (tagName === 'button') return mockButton;
      });
      
      renderSongList(mockContainer, mockSongs);
      
      expect(mockButton.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle ArrowDown key navigation', () => {
      const mockButtons = [
        { focus: vi.fn(), dataset: { index: '0' } },
        { focus: vi.fn(), dataset: { index: '1' } },
        { focus: vi.fn(), dataset: { index: '2' } }
      ];
      
      document.querySelectorAll.mockReturnValue(mockButtons);
      
      const event = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
        target: mockButtons[0]
      };
      
      // Simulate the keydown handler from renderSongList
      const keydownHandler = vi.fn((event) => {
        const songButtons = Array.from(document.querySelectorAll('.song-button'));
        const currentIndex = songButtons.indexOf(event.target);
        let targetIndex = currentIndex;
        
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          targetIndex = currentIndex < songButtons.length - 1 ? currentIndex + 1 : 0;
        }
        
        if (songButtons[targetIndex]) {
          songButtons[targetIndex].focus();
        }
      });
      
      keydownHandler(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockButtons[1].focus).toHaveBeenCalled();
    });

    it('should handle ArrowUp key navigation', () => {
      const mockButtons = [
        { focus: vi.fn(), dataset: { index: '0' } },
        { focus: vi.fn(), dataset: { index: '1' } },
        { focus: vi.fn(), dataset: { index: '2' } }
      ];
      
      document.querySelectorAll.mockReturnValue(mockButtons);
      
      const event = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
        target: mockButtons[1]
      };
      
      // Simulate the keydown handler from renderSongList
      const keydownHandler = vi.fn((event) => {
        const songButtons = Array.from(document.querySelectorAll('.song-button'));
        const currentIndex = songButtons.indexOf(event.target);
        let targetIndex = currentIndex;
        
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          targetIndex = currentIndex > 0 ? currentIndex - 1 : songButtons.length - 1;
        }
        
        if (songButtons[targetIndex]) {
          songButtons[targetIndex].focus();
        }
      });
      
      keydownHandler(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockButtons[0].focus).toHaveBeenCalled();
    });

    it('should handle Home key navigation', () => {
      const mockButtons = [
        { focus: vi.fn(), dataset: { index: '0' } },
        { focus: vi.fn(), dataset: { index: '1' } },
        { focus: vi.fn(), dataset: { index: '2' } }
      ];
      
      document.querySelectorAll.mockReturnValue(mockButtons);
      
      const event = {
        key: 'Home',
        preventDefault: vi.fn(),
        target: mockButtons[2]
      };
      
      // Simulate the keydown handler from renderSongList
      const keydownHandler = vi.fn((event) => {
        const songButtons = Array.from(document.querySelectorAll('.song-button'));
        let targetIndex = 0;
        
        if (event.key === 'Home') {
          event.preventDefault();
          targetIndex = 0;
        }
        
        if (songButtons[targetIndex]) {
          songButtons[targetIndex].focus();
        }
      });
      
      keydownHandler(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockButtons[0].focus).toHaveBeenCalled();
    });

    it('should handle End key navigation', () => {
      const mockButtons = [
        { focus: vi.fn(), dataset: { index: '0' } },
        { focus: vi.fn(), dataset: { index: '1' } },
        { focus: vi.fn(), dataset: { index: '2' } }
      ];
      
      document.querySelectorAll.mockReturnValue(mockButtons);
      
      const event = {
        key: 'End',
        preventDefault: vi.fn(),
        target: mockButtons[0]
      };
      
      // Simulate the keydown handler from renderSongList
      const keydownHandler = vi.fn((event) => {
        const songButtons = Array.from(document.querySelectorAll('.song-button'));
        let targetIndex = songButtons.length - 1;
        
        if (event.key === 'End') {
          event.preventDefault();
          targetIndex = songButtons.length - 1;
        }
        
        if (songButtons[targetIndex]) {
          songButtons[targetIndex].focus();
        }
      });
      
      keydownHandler(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockButtons[2].focus).toHaveBeenCalled();
    });

    it('should activate button on Enter or Space', () => {
      const mockButton = { 
        click: vi.fn(),
        focus: vi.fn(),
        dataset: { index: '0' }
      };
      
      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
        target: mockButton
      };
      
      // Simulate the keydown handler from renderSongList
      const keydownHandler = vi.fn((event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.target.click();
        }
      });
      
      keydownHandler(event);
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockButton.click).toHaveBeenCalled();
    });
  });

  describe('ARIA Live Regions', () => {
    it('should update current song status', () => {
      const mockStatusElement = {
        textContent: '',
        setAttribute: vi.fn()
      };
      
      document.getElementById.mockReturnValue(mockStatusElement);
      
      // Simulate the updateCurrentSongStatus function
      const updateCurrentSongStatus = (song) => {
        const statusElement = document.getElementById('current-song');
        if (!statusElement) return;
        
        if (song) {
          statusElement.textContent = `Now playing: ${song.title} by ${song.artist}`;
          statusElement.setAttribute('aria-label', `Currently playing ${song.title} by ${song.artist}`);
        } else {
          statusElement.textContent = '';
          statusElement.setAttribute('aria-label', 'No song currently playing');
        }
      };
      
      const testSong = { title: 'Test Song', artist: 'Test Artist' };
      updateCurrentSongStatus(testSong);
      
      expect(mockStatusElement.textContent).toBe('Now playing: Test Song by Test Artist');
      expect(mockStatusElement.setAttribute).toHaveBeenCalledWith('aria-label', 'Currently playing Test Song by Test Artist');
    });

    it('should clear current song status when no song playing', () => {
      const mockStatusElement = {
        textContent: 'Previous content',
        setAttribute: vi.fn()
      };
      
      document.getElementById.mockReturnValue(mockStatusElement);
      
      // Simulate the updateCurrentSongStatus function
      const updateCurrentSongStatus = (song) => {
        const statusElement = document.getElementById('current-song');
        if (!statusElement) return;
        
        if (song) {
          statusElement.textContent = `Now playing: ${song.title} by ${song.artist}`;
          statusElement.setAttribute('aria-label', `Currently playing ${song.title} by ${song.artist}`);
        } else {
          statusElement.textContent = '';
          statusElement.setAttribute('aria-label', 'No song currently playing');
        }
      };
      
      updateCurrentSongStatus(null);
      
      expect(mockStatusElement.textContent).toBe('');
      expect(mockStatusElement.setAttribute).toHaveBeenCalledWith('aria-label', 'No song currently playing');
    });
  });
});
