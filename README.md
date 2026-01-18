# Chidiya Udd - Bird Fly Game 🐦

A Progressive Web App (PWA) implementation of the classic Indian touch-based reaction game "Chidiya Udd" (Bird Fly).

![Game Screenshot](https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Chidiya+Udd+Game)

## 🎮 About the Game

Chidiya Udd is a fun, fast-paced multiplayer reaction game where players must quickly determine if an object can fly or not!

### How to Play

1. **Place Your Finger** - Each player places and holds their finger on their colored circle
2. **Watch the Object** - An object or animal name appears in the center
3. **React Quickly!**
   - If the object **CAN FLY** → Lift your finger UP ☝️
   - If it **CANNOT FLY** → Keep your finger DOWN 👇
4. **Score Points**
   - Correct action: **+10 points** ✓
   - Wrong action: **-5 points** ✗

### Trick Items 🎭

Watch out! Some birds can't fly:
- 🐧 Penguin
- 🦤 Ostrich
- 🥝 Kiwi Bird
- 🦤 Emu

## 🕹️ Game Modes

### Offline Mode (1-6 Players)
Play with friends on the same device! Perfect for:
- Family gatherings
- Parties
- Quick games on the go

### Online Mode (2-8 Players)
Play with friends on different devices using PeerJS P2P connection:
1. Create a room and share the code
2. Friends join using the 6-character code
3. Play together in real-time!

## 📱 Features

- **Progressive Web App** - Install on your home screen
- **Works Offline** - Play without internet (offline mode)
- **Multi-touch Support** - Up to 8 simultaneous players
- **60+ Items** - Birds, insects, animals, vehicles, and objects
- **Beautiful Animations** - Smooth, engaging visuals
- **Sound Effects** - Audio feedback for actions
- **Haptic Feedback** - Vibration on supported devices
- **Responsive Design** - Works on phones, tablets, and desktops

## 🚀 Getting Started

### Quick Start

1. Open `index.html` in a modern web browser
2. Click "Play Offline" or "Play Online"
3. Have fun!

### Install as PWA

**On Android (Chrome):**
1. Open the game in Chrome
2. Tap the menu (⋮) → "Add to Home screen"
3. The app will be installed

**On iOS (Safari):**
1. Open the game in Safari
2. Tap the Share button → "Add to Home Screen"
3. The app will be installed

**On Desktop (Chrome/Edge):**
1. Open the game
2. Click the install icon in the address bar
3. Click "Install"

## 🌐 Deployment

The game is a static website and can be deployed to any hosting service:

### GitHub Pages

1. Push the code to a GitHub repository
2. Go to Settings → Pages
3. Select the branch and folder (root)
4. Your game will be live at `https://username.github.io/repo-name`

### Netlify

1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your game will be live instantly

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project folder
3. Follow the prompts

### Any Static Host

Simply upload all files to your web server. No build step required!

## 📁 Project Structure

```
Kwikudd/
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── game.js             # Offline game logic
├── peer-multiplayer.js # Online multiplayer with PeerJS
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline caching
└── README.md           # This file
```

## 🛠️ Technical Details

### Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling, animations, responsive design
- **Vanilla JavaScript** - No frameworks required
- **PeerJS** - P2P WebRTC connections for multiplayer
- **Web Audio API** - Sound effects
- **Vibration API** - Haptic feedback
- **Service Workers** - Offline support

### Browser Support

- Chrome (Desktop & Mobile) ✓
- Safari (Desktop & iOS) ✓
- Firefox ✓
- Edge ✓

### Minimum Requirements

- Touch screen for multiplayer on same device
- Internet connection for online mode
- Modern browser with JavaScript enabled

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --primary: #4A90E2;       /* Main theme color */
  --secondary: #FFD93D;     /* Accent color */
  --player-1: #FF5252;      /* Player colors */
  --player-2: #2196F3;
  /* ... etc */
}
```

### Adding More Items

Edit the `ITEMS` array in `game.js`:

```javascript
const ITEMS = [
  { name: "NEW_ITEM", canFly: true, emoji: "🦋" },
  // Add more items...
];
```

### Adjusting Game Settings

In `game.js`:

```javascript
const GameState = {
  totalRounds: 15,      // Number of rounds
  roundDuration: 3500,  // Time per round (ms)
  // ...
};
```

## 📝 Credits

- Game concept: Traditional Indian children's game
- Development: Built with ❤️
- Icons: Emoji (native browser support)
- Fonts: Google Fonts (Fredoka, Quicksand)

## 📄 License

This project is open source and available for personal and educational use.

---

**Enjoy playing Chidiya Udd! 🐦✨**
