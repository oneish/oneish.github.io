# 🎵 Music Jukebox

A retro-style music jukebox built with vanilla JavaScript, featuring a complete audio player with volume controls, sequential playback, and an interactive UI.

![Jukebox Interface](preview.png)

## ✨ Features

### 🎶 Music Playback
- **Individual song selection** - Click any song to play it instantly
- **Sequential playback** - "Play All" mode plays songs in order
- **Pause/Resume** - Full playback control
- **Auto-advance** - Automatically moves to next song when current song ends

### 🔊 Volume Controls
- **Rotary volume knob** - Drag to adjust volume or use keyboard arrows
- **Mute/Unmute** - One-click audio muting
- **Visual feedback** - Knob rotation and button states reflect current settings

### 🎨 User Interface
- **Retro jukebox design** - Curved top, gradients, and glowing effects
- **Active song highlighting** - Visual indication of currently playing song
- **Responsive layout** - Works on desktop and mobile devices
- **Smooth animations** - Hover effects and transitions throughout

### ♿ Accessibility
- **Keyboard navigation** - Full keyboard support for all controls
- **ARIA labels** - Screen reader friendly
- **Focus indicators** - Clear visual focus states
- **Semantic HTML** - Proper markup structure

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start developing**:
   ```bash
   # Run tests
   npm test
   
   # Check code quality
   npm run lint
   
   # Open in browser
   open index.html
   ```

## 🎮 How to Use

### Playing Music
1. **Individual songs**: Click any song button to play it immediately
2. **Sequential playback**: Click "▶️ Play All" to play all songs in order
3. **Stop playback**: Click "⏸️ Stop All" to stop sequential playback

### Volume Control
- **Mouse**: Click and drag the volume knob to adjust volume
- **Keyboard**: Focus the knob and use arrow keys (↑↓ or ←→)
- **Mute**: Click the mute button or use the mute shortcut

### Keyboard Shortcuts
- **Space/Enter**: Activate focused button
- **Arrow keys**: Adjust volume when knob is focused
- **Tab**: Navigate between controls

## 🛠️ Technical Architecture

### Core Components

1. **Data Layer** (`scripts/data.js`)
   - Song metadata storage
   - 11 classic rock and pop songs included

2. **Player Engine** (`scripts/player.js`)
   - HTMLAudioElement wrapper
   - State management
   - Event handling
   - Sequential playback logic

3. **UI Controls** (`scripts/controls.js`)
   - Song list rendering
   - Volume knob interactions
   - Button state management
   - Event delegation

4. **Main Application** (`scripts/main.js`)
   - Component initialization
   - Event coordination
   - Error handling

### Key Features

- **ES6 Modules**: Clean, modular architecture
- **Event-driven design**: Loose coupling between components
- **Comprehensive testing**: 33 unit tests with 100% coverage
- **Error handling**: Graceful degradation and user feedback
- **Performance optimized**: Efficient DOM manipulation and event handling

## 🧪 Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/player.test.js
npm test tests/data.test.js
npm test tests/controls.test.js
```

### Test Coverage
- ✅ **Player Engine**: 23 tests covering all audio functionality
- ✅ **Data Layer**: 4 tests validating song structure
- ✅ **UI Controls**: 6 tests for user interface components

## 🎨 Customization

### Adding Songs
Edit `scripts/data.js` to add your own songs:

```javascript
export const songs = [
  { 
    title: 'Your Song Title', 
    artist: 'Artist Name', 
    file: 'assets/audio/your-song.mp3' 
  },
  // ... more songs
];
```

### Styling
Modify `styles/main.css` to customize the appearance:
- Colors and gradients
- Animation timings
- Layout and spacing
- Responsive breakpoints

### Functionality
Extend the Player class in `scripts/player.js`:
- Add shuffle mode
- Implement playlists
- Add equalizer controls
- Include song progress tracking

## 📁 Project Structure

```
jukebox-app/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── eslint.config.js        # Code quality rules
├── vitest.config.js        # Test configuration
├── API_REFERENCE.md        # Player API documentation
├── scripts/
│   ├── main.js             # Application entry point
│   ├── player.js           # Audio player engine
│   ├── controls.js         # UI control components
│   └── data.js             # Song data
├── styles/
│   └── main.css            # All styling
└── tests/
    ├── player.test.js      # Player engine tests
    ├── controls.test.js    # UI component tests
    └── data.test.js        # Data validation tests
```

## 🌟 Browser Support

- ✅ **Chrome 60+**
- ✅ **Firefox 55+**
- ✅ **Safari 11+**
- ✅ **Edge 79+**

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

🎵 **Enjoy your music!** 🎵
