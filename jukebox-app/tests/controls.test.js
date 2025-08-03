import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderSongList, initVolumeControl, initMuteButton } from '../scripts/controls.js';

// Mock DOM environment
const mockDocument = {
  createElement: vi.fn(),
  getElementById: vi.fn(),
  addEventListener: vi.fn(),
  dispatchEvent: vi.fn()
};

global.document = mockDocument;

describe('Controls Module', () => {
  let mockSongs;
  let mockContainer;
  let mockPlayer;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    mockSongs = [
      { title: 'Test Song 1', artist: 'Test Artist 1', file: 'test1.mp3' },
      { title: 'Test Song 2', artist: 'Test Artist 2', file: 'test2.mp3' }
    ];

    mockContainer = {
      innerHTML: '',
      appendChild: vi.fn()
    };

    mockPlayer = {
      volume: 0.5,
      isMuted: false,
      setVolume: vi.fn(),
      toggleMute: vi.fn(),
      getPlaybackState: vi.fn(() => ({
        isSequence: false,
        isPlaying: false
      })),
      playAll: vi.fn(),
      stop: vi.fn()
    };

    // Setup DOM element mocks
    const mockElement = {
      appendChild: vi.fn(),
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
      getBoundingClientRect: vi.fn(() => ({
        left: 0, top: 0, width: 60, height: 60
      })),
      classList: {
        add: vi.fn(),
        remove: vi.fn()
      },
      style: {}
    };

    mockDocument.createElement.mockReturnValue({
      ...mockElement,
      dataset: {},
      textContent: '',
      className: ''
    });

    mockDocument.getElementById.mockReturnValue(mockElement);
  });

  describe('renderSongList', () => {
    it('should render song list with correct buttons', () => {
      const mockLi = { 
        appendChild: vi.fn(),
        setAttribute: vi.fn()
      };
      const mockButton = {
        dataset: {},
        textContent: '',
        setAttribute: vi.fn(),
        className: '',
        addEventListener: vi.fn()
      };

      mockDocument.createElement
        .mockReturnValueOnce(mockLi)
        .mockReturnValueOnce(mockButton)
        .mockReturnValueOnce(mockLi)
        .mockReturnValueOnce(mockButton);

      renderSongList(mockContainer, mockSongs);

      expect(mockContainer.innerHTML).toBe('');
      expect(mockDocument.createElement).toHaveBeenCalledWith('li');
      expect(mockDocument.createElement).toHaveBeenCalledWith('button');
      expect(mockContainer.appendChild).toHaveBeenCalledTimes(2);
      expect(mockLi.setAttribute).toHaveBeenCalledWith('role', 'option');
      expect(mockButton.setAttribute).toHaveBeenCalledWith('aria-label', 'Play Test Song 1 by Test Artist 1');
    });

    it('should clear existing content before rendering', () => {
      mockContainer.innerHTML = 'existing content';
      
      const mockLi = { 
        appendChild: vi.fn(),
        setAttribute: vi.fn()
      };
      const mockButton = {
        dataset: {},
        textContent: '',
        setAttribute: vi.fn(),
        className: '',
        addEventListener: vi.fn()
      };

      mockDocument.createElement
        .mockReturnValueOnce(mockLi)
        .mockReturnValueOnce(mockButton);
      
      renderSongList(mockContainer, [mockSongs[0]]);
      
      expect(mockContainer.innerHTML).toBe('');
    });
  });

  describe('initVolumeControl', () => {
    it('should initialize volume control when element exists', () => {
      const mockVolumeKnob = {
        addEventListener: vi.fn(),
        setAttribute: vi.fn(),
        style: {}
      };
      
      mockDocument.getElementById.mockReturnValue(mockVolumeKnob);
      
      initVolumeControl(mockPlayer);
      
      expect(mockDocument.getElementById).toHaveBeenCalledWith('volume-knob');
      expect(mockVolumeKnob.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(mockVolumeKnob.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should handle missing volume knob element gracefully', () => {
      mockDocument.getElementById.mockReturnValue(null);
      
      expect(() => initVolumeControl(mockPlayer)).not.toThrow();
    });
  });

  describe('initMuteButton', () => {
    it('should initialize mute button when element exists', () => {
      const mockMuteButton = {
        addEventListener: vi.fn(),
        setAttribute: vi.fn(),
        textContent: '',
        classList: {
          add: vi.fn(),
          remove: vi.fn()
        }
      };
      
      mockDocument.getElementById.mockReturnValue(mockMuteButton);
      
      initMuteButton(mockPlayer);
      
      expect(mockDocument.getElementById).toHaveBeenCalledWith('mute-btn');
      expect(mockMuteButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      expect(mockMuteButton.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should handle missing mute button element gracefully', () => {
      mockDocument.getElementById.mockReturnValue(null);
      
      expect(() => initMuteButton(mockPlayer)).not.toThrow();
    });
  });
});
