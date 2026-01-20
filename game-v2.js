/**
 * Chidiya Udd - Bird Fly Game
 * Complete Game Logic for Offline Mode
 */

// ==========================================
// ITEMS DATABASE (60+ items)
// ==========================================

const ITEMS = [
    // ===== FLYING THINGS (32 items) =====

    // Birds
    { name: "PARROT", canFly: true, emoji: "🦜" },
    { name: "EAGLE", canFly: true, emoji: "🦅" },
    { name: "SPARROW", canFly: true, emoji: "🐦" },
    { name: "CROW", canFly: true, emoji: "🐦‍⬛" },
    { name: "PIGEON", canFly: true, emoji: "🕊️" },
    { name: "PEACOCK", canFly: true, emoji: "🦚" },
    { name: "SWAN", canFly: true, emoji: "🦢" },
    { name: "DUCK", canFly: true, emoji: "🦆" },
    { name: "OWL", canFly: true, emoji: "🦉" },
    { name: "FLAMINGO", canFly: true, emoji: "🦩" },
    { name: "VULTURE", canFly: true, emoji: "🦅" },
    { name: "HAWK", canFly: true, emoji: "🦅" },
    { name: "HUMMINGBIRD", canFly: true, emoji: "🐦" },
    { name: "SEAGULL", canFly: true, emoji: "🐦" },
    { name: "WOODPECKER", canFly: true, emoji: "🐦" },
    { name: "KINGFISHER", canFly: true, emoji: "🐦" },
    { name: "CUCKOO", canFly: true, emoji: "🐦" },
    { name: "STORK", canFly: true, emoji: "🦩" },
    { name: "PELICAN", canFly: true, emoji: "🦆" },
    { name: "TOUCAN", canFly: true, emoji: "🦜" },

    // Insects
    { name: "BUTTERFLY", canFly: true, emoji: "🦋" },
    { name: "BEE", canFly: true, emoji: "🐝" },
    { name: "MOSQUITO", canFly: true, emoji: "🦟" },
    { name: "DRAGONFLY", canFly: true, emoji: "🪰" },
    { name: "HOUSEFLY", canFly: true, emoji: "🪰" },
    { name: "WASP", canFly: true, emoji: "🐝" },
    { name: "MOTH", canFly: true, emoji: "🦋" },
    { name: "LADYBUG", canFly: true, emoji: "🐞" },

    // Flying vehicles/objects
    { name: "AIRPLANE", canFly: true, emoji: "✈️" },
    { name: "HELICOPTER", canFly: true, emoji: "🚁" },
    { name: "ROCKET", canFly: true, emoji: "🚀" },
    { name: "KITE", canFly: true, emoji: "🪁" },
    { name: "DRONE", canFly: true, emoji: "🛸" },
    { name: "HOT AIR BALLOON", canFly: true, emoji: "🎈" },

    // Flying mammal
    { name: "BAT", canFly: true, emoji: "🦇" },

    // ===== TRICK ITEMS (birds that can't fly) =====
    { name: "PENGUIN", canFly: false, emoji: "🐧" },
    { name: "OSTRICH", canFly: false, emoji: "🪶" },  // Flightless bird
    { name: "EMU", canFly: false, emoji: "🪶" },       // Flightless bird
    { name: "KIWI BIRD", canFly: false, emoji: "🐦" }, // NZ flightless bird (not the fruit!)

    // ===== NON-FLYING THINGS (32 items) =====

    // Land animals
    { name: "COW", canFly: false, emoji: "🐄" },
    { name: "DOG", canFly: false, emoji: "🐕" },
    { name: "CAT", canFly: false, emoji: "🐈" },
    { name: "ELEPHANT", canFly: false, emoji: "🐘" },
    { name: "LION", canFly: false, emoji: "🦁" },
    { name: "TIGER", canFly: false, emoji: "🐅" },
    { name: "HORSE", canFly: false, emoji: "🐎" },
    { name: "RABBIT", canFly: false, emoji: "🐇" },
    { name: "SNAKE", canFly: false, emoji: "🐍" },
    { name: "FISH", canFly: false, emoji: "🐟" },
    { name: "MONKEY", canFly: false, emoji: "🐒" },
    { name: "BEAR", canFly: false, emoji: "🐻" },
    { name: "DEER", canFly: false, emoji: "🦌" },
    { name: "GOAT", canFly: false, emoji: "🐐" },
    { name: "SHEEP", canFly: false, emoji: "🐑" },
    { name: "CAMEL", canFly: false, emoji: "🐫" },
    { name: "ZEBRA", canFly: false, emoji: "🦓" },
    { name: "KANGAROO", canFly: false, emoji: "🦘" },
    { name: "PANDA", canFly: false, emoji: "🐼" },
    { name: "FROG", canFly: false, emoji: "🐸" },
    { name: "TURTLE", canFly: false, emoji: "🐢" },
    { name: "CROCODILE", canFly: false, emoji: "🐊" },

    // Vehicles
    { name: "CAR", canFly: false, emoji: "🚗" },
    { name: "BUS", canFly: false, emoji: "🚌" },
    { name: "TRAIN", canFly: false, emoji: "🚂" },
    { name: "BICYCLE", canFly: false, emoji: "🚲" },
    { name: "MOTORCYCLE", canFly: false, emoji: "🏍️" },
    { name: "BOAT", canFly: false, emoji: "⛵" },
    { name: "SHIP", canFly: false, emoji: "🚢" },
    { name: "TRUCK", canFly: false, emoji: "🚛" },

    // Objects
    { name: "TREE", canFly: false, emoji: "🌳" },
    { name: "FLOWER", canFly: false, emoji: "🌸" },
    { name: "TABLE", canFly: false, emoji: "🪑" },
    { name: "BOOK", canFly: false, emoji: "📚" },
    { name: "PHONE", canFly: false, emoji: "📱" },
    { name: "BALL", canFly: false, emoji: "⚽" },
    { name: "HOUSE", canFly: false, emoji: "🏠" },
    { name: "MOUNTAIN", canFly: false, emoji: "🏔️" }
];

// ==========================================
// PLAYER COLORS
// ==========================================

const PLAYER_COLORS = [
    { name: 'Red', hex: '#FF5252' },
    { name: 'Blue', hex: '#2196F3' },
    { name: 'Green', hex: '#4CAF50' },
    { name: 'Yellow', hex: '#FFEB3B' },
    { name: 'Purple', hex: '#9C27B0' },
    { name: 'Orange', hex: '#FF9800' },
    { name: 'Pink', hex: '#E91E63' },
    { name: 'Teal', hex: '#00BCD4' }
];

// ==========================================
// GAME STATE
// ==========================================

const GameState = {
    // Current screen
    currentScreen: 'home',

    // Game mode
    mode: 'offline', // 'offline' or 'online'

    // Players
    playerCount: 0,
    players: [], // { id, color, score, isTouched, touchId }

    // Game settings
    totalRounds: 15,
    roundDuration: 1000, // 1 second for response
    currentRound: 0,

    // Current round data
    currentItem: null,
    roundStartTime: null,
    roundTimer: null,

    // Waiting for all fingers
    allFingersPlaced: false,
    waitingForFingers: false,

    // Pause state
    isPaused: false,
    pauseStartTime: null,

    // Used items (to avoid repeats)
    usedItems: [],

    // Settings
    soundEnabled: true,
    vibrationEnabled: true
};

// ==========================================
// DOM ELEMENTS
// ==========================================

let elements = {};

function initElements() {
    elements = {
        // Screens
        screens: document.querySelectorAll('.screen'),
        homeScreen: document.getElementById('home-screen'),
        playerSelectScreen: document.getElementById('player-select-screen'),
        gameSetupScreen: document.getElementById('game-setup-screen'),
        gameScreen: document.getElementById('game-screen'),
        resultsScreen: document.getElementById('results-screen'),

        // Online screens
        onlineMenuScreen: document.getElementById('online-menu-screen'),
        createRoomScreen: document.getElementById('create-room-screen'),
        joinRoomScreen: document.getElementById('join-room-screen'),
        lobbyScreen: document.getElementById('lobby-screen'),

        // Game elements
        setupCirclesContainer: document.getElementById('setup-circles-container'),
        gameCirclesContainer: document.getElementById('game-circles-container'),
        objectDisplay: document.getElementById('object-display'),
        objectEmoji: document.getElementById('object-emoji'),
        objectName: document.getElementById('object-name'),
        roundIndicator: document.getElementById('round-indicator'),
        timerProgress: document.getElementById('timer-progress'),
        timerRing: document.getElementById('timer-ring'),

        // Results
        leaderboard: document.getElementById('leaderboard'),

        // Modals
        settingsModal: document.getElementById('settings-modal'),
        howToPlayModal: document.getElementById('how-to-play-modal'),

        // Countdown
        countdownOverlay: document.getElementById('countdown-overlay'),
        countdownNumber: document.getElementById('countdown-number'),

        // Confetti container
        confettiContainer: document.getElementById('confetti-container')
    };
}

// ==========================================
// AUDIO (Web Audio API)
// ==========================================

let audioContext = null;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function playSound(type) {
    if (!GameState.soundEnabled || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
        case 'countdown':
            oscillator.frequency.value = 440;
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'start':
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'correct':
            oscillator.frequency.value = 523.25; // C5
            gainNode.gain.value = 0.2;
            oscillator.start();
            setTimeout(() => oscillator.frequency.value = 659.25, 100); // E5
            setTimeout(() => oscillator.frequency.value = 783.99, 200); // G5
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'wrong':
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 200;
            gainNode.gain.value = 0.2;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
        case 'click':
            oscillator.frequency.value = 600;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.05);
            break;
    }
}

// ==========================================
// HAPTIC FEEDBACK
// ==========================================

function vibrate(pattern) {
    if (!GameState.vibrationEnabled) return;
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// ==========================================
// SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {
    elements.screens.forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        GameState.currentScreen = screenId;

        // Toggle body class for game mode
        if (screenId === 'game-screen') {
            document.body.classList.add('game-active');
        } else {
            document.body.classList.remove('game-active');

            // Hide online leaderboard when leaving game screen
            const onlineLeaderboard = document.getElementById('online-leaderboard');
            if (onlineLeaderboard) {
                onlineLeaderboard.style.display = 'none';
            }
        }
    }
}

// ==========================================
// HOME SCREEN
// ==========================================

function initHomeScreen() {
    document.getElementById('btn-play-offline')?.addEventListener('click', () => {
        playSound('click');
        vibrate(50);
        GameState.mode = 'offline';
        showScreen('player-select-screen');
    });

    document.getElementById('btn-play-online')?.addEventListener('click', () => {
        playSound('click');
        vibrate(50);
        GameState.mode = 'online';
        showScreen('online-menu-screen');
    });

    document.getElementById('btn-how-to-play')?.addEventListener('click', () => {
        playSound('click');
        openModal('how-to-play-modal');
    });

    document.getElementById('btn-settings')?.addEventListener('click', () => {
        playSound('click');
        openModal('settings-modal');
    });
}

// ==========================================
// PLAYER SELECTION
// ==========================================

function initPlayerSelection() {
    const playerGrid = document.getElementById('player-grid');
    if (!playerGrid) return;

    // Detect max simultaneous touches supported by device
    // Most phones support 5-10, but we'll cap at 6 for usability
    const maxTouchPoints = navigator.maxTouchPoints || 5;
    const maxPlayers = Math.min(6, Math.max(2, maxTouchPoints));

    console.log('Max touch points:', maxTouchPoints, 'Max players:', maxPlayers);

    // Create player count buttons based on device capability
    for (let i = 1; i <= maxPlayers; i++) {
        const btn = document.createElement('button');
        btn.className = 'player-count-btn';
        btn.innerHTML = `
      <span>${i}</span>
      <div class="dots">${createPlayerDots(i)}</div>
    `;
        btn.addEventListener('click', () => selectPlayerCount(i));
        playerGrid.appendChild(btn);
    }

    document.getElementById('btn-back-home')?.addEventListener('click', () => {
        playSound('click');
        showScreen('home-screen');
    });

    // Back button from game screen
    document.getElementById('btn-back-game')?.addEventListener('click', () => {
        playSound('click');

        // Fully reset game state
        GameState.waitingForFingers = false;
        GameState.allFingersPlaced = false;
        GameState.currentRound = 0;
        GameState.roundStartTime = null;
        GameState.currentItem = null;
        GameState.usedItems = [];
        GameState.isPaused = false;

        // Cancel any running timers
        if (GameState.roundTimer) {
            cancelAnimationFrame(GameState.roundTimer);
            GameState.roundTimer = null;
        }

        // Reset players array completely
        GameState.players = [];
        GameState.playerCount = 0;

        // Navigate based on game mode
        if (GameState.mode === 'online') {
            // For online mode, go back to lobby
            showScreen('lobby-screen');
            // Clean up online leaderboard
            const leaderboard = document.getElementById('online-leaderboard');
            if (leaderboard) {
                leaderboard.remove();
            }
        } else {
            // For offline mode, go to player selection
            showScreen('player-select-screen');
        }

        // Reset game mode
        GameState.mode = null;
    });

    // Pause button
    document.getElementById('btn-pause')?.addEventListener('click', () => {
        playSound('click');
        pauseGame();
    });

    // Resume button
    document.getElementById('btn-resume')?.addEventListener('click', () => {
        playSound('click');
        resumeGame();
    });

    // Quit from pause modal
    document.getElementById('btn-quit-game')?.addEventListener('click', () => {
        playSound('click');
        closePauseModal();

        // Fully reset game state
        GameState.waitingForFingers = false;
        GameState.allFingersPlaced = false;
        GameState.currentRound = 0;
        GameState.roundStartTime = null;
        GameState.currentItem = null;
        GameState.usedItems = [];
        GameState.isPaused = false;

        // Cancel any running timers
        if (GameState.roundTimer) {
            cancelAnimationFrame(GameState.roundTimer);
            GameState.roundTimer = null;
        }

        // Reset players array completely
        GameState.players = [];
        GameState.playerCount = 0;

        // Clean up online leaderboard if in online mode
        if (GameState.mode === 'online') {
            const leaderboard = document.getElementById('online-leaderboard');
            if (leaderboard) {
                leaderboard.remove();
            }
        }

        // Reset game mode
        GameState.mode = null;

        showScreen('home-screen');
    });
}

function createPlayerDots(count) {
    let dots = '';
    for (let i = 0; i < count; i++) {
        dots += `<span class="dot" style="background: ${PLAYER_COLORS[i].hex}"></span>`;
    }
    return dots;
}

function selectPlayerCount(count) {
    playSound('click');
    vibrate(50);
    GameState.playerCount = count;
    initPlayers(count);

    // Go directly to game screen
    showScreen('game-screen');
    startGameSetup();
}

// ==========================================
// PLAYER INITIALIZATION
// ==========================================

function initPlayers(count) {
    GameState.players = [];
    for (let i = 0; i < count; i++) {
        GameState.players.push({
            id: i,
            color: PLAYER_COLORS[i],
            score: 0,
            isTouched: false,
            touchId: null,
            action: null // 'lifted' or 'kept'
        });
    }
}

// ==========================================
// GAME SETUP / CIRCLES
// ==========================================

function startGameSetup() {
    console.log('Starting game setup for', GameState.playerCount, 'players');

    // Reset game state
    GameState.waitingForFingers = true;
    GameState.allFingersPlaced = false;
    GameState.currentRound = 0;
    GameState.usedItems = [];

    // Reset player touch states
    GameState.players.forEach(player => {
        player.isTouched = false;
        player.touchId = null;
        player.action = null;
        player.score = 0;
    });

    // Create circles directly in the game screen container
    createCirclesInContainer(elements.gameCirclesContainer);

    // Hide the object display initially, show instruction
    if (elements.objectDisplay) {
        elements.objectDisplay.innerHTML = `
            <div style="font-size: 1.2rem; color: #666; padding: 20px; text-align: center;">
                👆 All players put your finger on your circle
            </div>
        `;
    }

    // Update round indicator
    if (elements.roundIndicator) {
        elements.roundIndicator.textContent = 'Ready?';
    }

    // ONLINE MODE: Hide old opponents container (leaderboard is shown at top by peer-multiplayer.js)
    if (GameState.mode === 'online') {
        const opponentsContainer = document.getElementById('opponents-container');
        if (opponentsContainer) opponentsContainer.classList.add('hidden');

        // Add specific class for single circle logic
        elements.gameCirclesContainer.classList.add('online-mode');
    } else {
        const opponentsContainer = document.getElementById('opponents-container');
        if (opponentsContainer) opponentsContainer.classList.add('hidden');
        elements.gameCirclesContainer.classList.remove('online-mode');
    }

    // Add tap handler to toggle header visibility
    const gameArea = document.querySelector('#game-screen .game-area');
    const header = document.querySelector('.game-header');
    if (gameArea && header) {
        gameArea.addEventListener('click', (e) => {
            // Only toggle if not clicking on a circle
            if (!e.target.closest('.player-circle')) {
                header.classList.toggle('hidden');
            }
        });
    }

    console.log('Game setup complete. Waiting for all fingers...');
}

function createCirclesInContainer(container) {
    if (!container) {
        console.error('Container not found!');
        return;
    }

    container.innerHTML = '';
    container.className = `circles-container players-${GameState.playerCount}`;

    // Calculate circle positions based on player count
    // In online mode, we only show 1 circle (ours)
    const countToRender = GameState.mode === 'online' ? 1 : GameState.playerCount;
    const positions = getCirclePositions(countToRender);

    GameState.players.forEach((player, index) => {
        // ONLINE MODE: Only create circle for local player (index 0 effectively in this context if mapped correctly, 
        // OR we need to identify which one is US.
        // Actually, peer-multiplayer maps online players to local players.
        // Let's rely on a flag or just render the one that matches our ID.

        // Simpler approach: In online mode, the peer script sets up GameState.players.
        // We need to know which one is ME.
        // But for now, let's assume if it's online, we only render the player object that corresponds to 'me'.

        // BETTER FIX: The peer script maps all players to GameState.players.
        // We should only render the one that is ME.
        let shouldRender = true;

        if (GameState.mode === 'online') {
            // In online mode, we need to know my local index.
            // PeerJS script should tag the local player.
            if (!player.isLocal) shouldRender = false;
        }

        if (shouldRender) {
            // Create wrapper to hold circle and external score
            const wrapper = document.createElement('div');
            wrapper.className = 'player-circle-wrapper';
            wrapper.style.position = 'absolute';
            const pos = GameState.mode === 'online' ? positions[0] : positions[index];
            wrapper.style.left = pos.x;
            wrapper.style.top = pos.y;
            wrapper.style.transform = 'translate(-50%, -50%)';

            const circle = document.createElement('div');
            circle.className = 'player-circle waiting';
            circle.id = `player-circle-${player.id}`;
            circle.style.color = player.color.hex;
            circle.style.borderColor = player.color.hex;

            // Only player label inside circle (no score)
            circle.innerHTML = `
                <span class="player-label">${player.name || 'P' + (player.id + 1)}</span>
            `;

            // Score badge - positioned above or below based on circle position
            const scoreBadge = document.createElement('div');
            scoreBadge.className = 'player-score-badge';
            scoreBadge.id = `score-${player.id}`;
            scoreBadge.style.backgroundColor = player.color.hex;
            scoreBadge.textContent = player.score;

            // If circle is in bottom half of screen, put score ABOVE
            const posYValue = parseInt(pos.y);
            if (posYValue > 50) {
                scoreBadge.classList.add('score-above');
            }

            circle.appendChild(scoreBadge);
            wrapper.appendChild(circle);

            // Touch events on the circle
            circle.addEventListener('touchstart', (e) => handleTouchStart(e, player.id), { passive: false });
            circle.addEventListener('touchend', (e) => handleTouchEnd(e, player.id), { passive: false });
            circle.addEventListener('touchcancel', (e) => handleTouchEnd(e, player.id), { passive: false });

            // Mouse events for desktop testing
            circle.addEventListener('mousedown', (e) => handleMouseDown(e, player.id));
            circle.addEventListener('mouseup', (e) => handleMouseUp(e, player.id));
            circle.addEventListener('mouseleave', (e) => handleMouseUp(e, player.id));

            container.appendChild(wrapper);
        }
    });

    console.log(`Created ${GameState.playerCount} circles in container`);
}

function getCirclePositions(count) {
    const positions = [];

    // Position circles around the edges of the screen
    // to leave center clear for the object name display
    switch (count) {
        case 1:
            // Single player at bottom center
            positions.push({ x: '50%', y: '85%' });
            break;
        case 2:
            // Two players: one at top, one at bottom
            positions.push({ x: '50%', y: '12%' });  // Top
            positions.push({ x: '50%', y: '88%' });  // Bottom
            break;
        case 3:
            // Three players: top, bottom-left, bottom-right
            positions.push({ x: '50%', y: '10%' });  // Top center
            positions.push({ x: '15%', y: '85%' });  // Bottom left
            positions.push({ x: '85%', y: '85%' });  // Bottom right
            break;
        case 4:
            // Four players: corners
            positions.push({ x: '15%', y: '12%' });  // Top left
            positions.push({ x: '85%', y: '12%' });  // Top right
            positions.push({ x: '15%', y: '88%' });  // Bottom left
            positions.push({ x: '85%', y: '88%' });  // Bottom right
            break;
        case 5:
            // Five players: two at top, three at bottom
            positions.push({ x: '25%', y: '10%' });  // Top left
            positions.push({ x: '75%', y: '10%' });  // Top right
            positions.push({ x: '10%', y: '85%' });  // Bottom left
            positions.push({ x: '50%', y: '88%' });  // Bottom center
            positions.push({ x: '90%', y: '85%' });  // Bottom right
            break;
        case 6:
            // Six players: three at top, three at bottom
            positions.push({ x: '15%', y: '10%' });  // Top left
            positions.push({ x: '50%', y: '8%' });   // Top center
            positions.push({ x: '85%', y: '10%' });  // Top right
            positions.push({ x: '15%', y: '88%' });  // Bottom left
            positions.push({ x: '50%', y: '92%' });  // Bottom center
            positions.push({ x: '85%', y: '88%' });  // Bottom right
            break;
        default:
            // Fallback: spread evenly around edges
            for (let i = 0; i < count; i++) {
                const angle = (i * (360 / count) - 90) * (Math.PI / 180);
                const radius = 40;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                positions.push({ x: `${x}%`, y: `${y}%` });
            }
    }

    return positions;
}

// ==========================================
// TOUCH HANDLING
// ==========================================

function handleTouchStart(e, playerId) {
    e.preventDefault();

    const player = GameState.players[playerId];
    if (!player) return;

    const touch = e.changedTouches[0];
    player.touchId = touch.identifier;
    player.isTouched = true;

    updateCircleVisual(playerId, true);
    vibrate(30);

    // ONLINE INPUT SYNC - notify host of touch status
    if (GameState.mode === 'online' && typeof sendTouchStatus === 'function') {
        sendTouchStatus(true);
    }

    // Check if all fingers are placed
    checkAllFingersPlaced();
}

function handleTouchEnd(e, playerId) {
    e.preventDefault();

    const player = GameState.players[playerId];
    if (!player) return;

    // Check if this is the correct touch
    const touchIds = Array.from(e.changedTouches).map(t => t.identifier);
    if (!touchIds.includes(player.touchId)) return;

    player.isTouched = false;
    player.touchId = null;

    // Record action during active round
    if (GameState.currentRound > 0 && GameState.roundStartTime) {
        player.action = 'lifted';
    }

    // Reset all fingers placed flag
    GameState.allFingersPlaced = false;

    updateCircleVisual(playerId, false);

    // ONLINE INPUT SYNC
    if (GameState.mode === 'online') {
        if (typeof sendTouchStatus === 'function') {
            sendTouchStatus(false);
        }
        if (typeof sendPlayerAction === 'function') {
            sendPlayerAction('lifted');
        }
    }
}

function handleMouseDown(e, playerId) {
    const player = GameState.players[playerId];
    if (!player) return;

    player.isTouched = true;
    updateCircleVisual(playerId, true);
    vibrate(30);

    // ONLINE INPUT SYNC - notify host of touch status
    if (GameState.mode === 'online' && typeof sendTouchStatus === 'function') {
        sendTouchStatus(true);
    }

    // Check if all fingers are placed
    checkAllFingersPlaced();
}

function handleMouseUp(e, playerId) {
    const player = GameState.players[playerId];
    if (!player) return;

    if (player.isTouched) {
        player.isTouched = false;

        if (GameState.currentRound > 0 && GameState.roundStartTime) {
            player.action = 'lifted';
        }

        // Reset all fingers placed flag
        GameState.allFingersPlaced = false;

        updateCircleVisual(playerId, false);

        // ONLINE INPUT SYNC
        if (GameState.mode === 'online') {
            if (typeof sendTouchStatus === 'function') {
                sendTouchStatus(false);
            }
            if (typeof sendPlayerAction === 'function') {
                sendPlayerAction('lifted');
            }
        }
    }
}

function checkAllFingersPlaced() {
    // Check if all players have their fingers on circles
    const allTouched = GameState.players.every(player => player.isTouched);
    const touchedCount = GameState.players.filter(p => p.isTouched).length;

    console.log(`Fingers placed: ${touchedCount}/${GameState.playerCount}, waiting: ${GameState.waitingForFingers}, allPlaced: ${GameState.allFingersPlaced}`);

    if (allTouched && !GameState.allFingersPlaced && GameState.waitingForFingers) {
        GameState.allFingersPlaced = true;
        console.log('All fingers placed! Starting countdown in 500ms...');

        // All fingers placed! Start the countdown after a brief moment
        setTimeout(() => {
            if (GameState.allFingersPlaced && GameState.waitingForFingers) {
                console.log('Starting countdown now!');
                startCountdown();
            }
        }, 500);
    }
}

function updateCircleVisual(playerId, isTouched) {
    // Update in both containers
    const circles = document.querySelectorAll(`#player-circle-${playerId}`);
    circles.forEach(circle => {
        if (!circle) return;

        circle.classList.remove('waiting');

        if (isTouched) {
            circle.classList.add('touched');
            circle.classList.remove('not-touched');
        } else {
            circle.classList.remove('touched');
            circle.classList.add('not-touched');
        }
    });
}

// ==========================================
// COUNTDOWN
// ==========================================

function startCountdown() {
    // Stop waiting for fingers now that we're into countdown
    GameState.waitingForFingers = false;

    playSound('click');

    // Update instruction to show countdown starting
    if (elements.roundIndicator) {
        elements.roundIndicator.textContent = 'Get ready!';
    }

    const overlay = elements.countdownOverlay;
    const numberEl = elements.countdownNumber;

    if (!overlay || !numberEl) return;

    overlay.classList.add('active');

    let count = 3;

    function showNumber() {
        if (count > 0) {
            numberEl.textContent = count;
            numberEl.className = 'countdown-number';
            // Force reflow for animation
            void numberEl.offsetWidth;
            numberEl.style.animation = 'none';
            void numberEl.offsetWidth;
            numberEl.style.animation = 'countdownPop 1s ease-out forwards';

            playSound('countdown');
            vibrate(100);

            count--;
            setTimeout(showNumber, 1000);
        } else {
            numberEl.textContent = 'GO!';
            numberEl.className = 'countdown-text';
            playSound('start');
            vibrate([100, 50, 100]);

            setTimeout(() => {
                overlay.classList.remove('active');
                startGame();
            }, 500);
        }
    }

    showNumber();
}

// ==========================================
// GAME LOGIC
// ==========================================

function startGame() {
    try {
        console.log('=== GAME STARTED ===');
        console.log('elements.timerProgress:', elements.timerProgress);
        console.log('elements.objectDisplay:', elements.objectDisplay);

        GameState.currentRound = 0;
        GameState.usedItems = [];

        // Reset all player scores
        GameState.players.forEach(player => {
            player.score = 0;
            player.action = null;
            updateScoreDisplay(player.id);
        });

        console.log('Calling startNextRound...');
        startNextRound();
    } catch (error) {
        console.error('ERROR in startGame:', error);
        alert('Game error: ' + error.message);
    }
}

function startNextRound() {
    try {
        GameState.currentRound++;
        console.log('=== STARTING ROUND', GameState.currentRound, 'of', GameState.totalRounds, '===');

        if (GameState.currentRound > GameState.totalRounds) {
            endGame();
            return;
        }

        // Update round indicator
        console.log('Updating round indicator...');
        if (elements.roundIndicator) {
            elements.roundIndicator.textContent = `${GameState.currentRound}/${GameState.totalRounds}`;
        }

        // Select random item
        console.log('Selecting random item...');
        const availableItems = ITEMS.filter(item => !GameState.usedItems.includes(item));
        console.log('Available items:', availableItems.length);

        // Ensure a good mix of flying/non-flying
        let itemPool = availableItems;
        if (availableItems.length > 10) {
            const flyingItems = availableItems.filter(i => i.canFly);
            const nonFlyingItems = availableItems.filter(i => !i.canFly);

            // Alternate roughly
            if (GameState.currentRound % 2 === 0 && flyingItems.length > 0) {
                itemPool = flyingItems;
            } else if (nonFlyingItems.length > 0) {
                itemPool = nonFlyingItems;
            }
        }

        const randomItem = itemPool[Math.floor(Math.random() * itemPool.length)];
        console.log('Selected item:', randomItem);
        GameState.currentItem = randomItem;
        GameState.usedItems.push(randomItem);

        // Reset player actions and record who is touching at start
        GameState.players.forEach(player => {
            player.action = null;
            player.wasTouchingAtStart = player.isTouched; // Track if finger was on circle at round start
        });

        // Display the item
        console.log('Calling displayItem...');
        displayItem(randomItem);

        // Start timer
        console.log('Calling startRoundTimer...');
        GameState.roundStartTime = Date.now();
        startRoundTimer();
        console.log('startRoundTimer called successfully');
    } catch (error) {
        console.error('ERROR in startNextRound:', error);
        alert('Round error: ' + error.message);
    }
}

function displayItem(item) {
    console.log('Displaying item:', item.name, item.emoji, 'canFly:', item.canFly);

    // Recreate the object display content (since we replaced it earlier)
    if (elements.objectDisplay) {
        elements.objectDisplay.innerHTML = `
            <div id="object-emoji" class="object-emoji">${item.emoji}</div>
            <div id="object-name" class="object-display">${item.name}</div>
        `;

        // Animate in
        elements.objectDisplay.style.opacity = '0';
        elements.objectDisplay.style.transform = 'scale(0.8)';

        requestAnimationFrame(() => {
            elements.objectDisplay.style.transition = 'all 0.3s ease-out';
            elements.objectDisplay.style.opacity = '1';
            elements.objectDisplay.style.transform = 'scale(1)';
        });
    }
}

function startRoundTimer() {
    console.log('>>> startRoundTimer() called, duration:', GameState.roundDuration, 'ms');

    const duration = GameState.roundDuration;
    const startTime = Date.now();
    const circumference = 565.48; // 2 * PI * 90
    let frameCount = 0;

    if (elements.timerRing) {
        elements.timerRing.classList.remove('warning', 'danger');
    }

    // Reset timer progress
    if (elements.timerProgress) {
        elements.timerProgress.style.strokeDashoffset = '0';
    }

    function updateTimer() {
        try {
            frameCount++;
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);
            const progress = remaining / duration;

            // Log every 30 frames (about twice per second)
            if (frameCount % 30 === 0) {
                console.log('Timer update: elapsed=' + elapsed + 'ms, remaining=' + remaining + 'ms');
            }

            // Update timer ring
            if (elements.timerProgress) {
                const offset = circumference * (1 - progress);
                elements.timerProgress.style.strokeDashoffset = offset;
            }

            // Color changes
            if (elements.timerRing) {
                if (progress < 0.25) {
                    elements.timerRing.classList.add('danger');
                    elements.timerRing.classList.remove('warning');
                } else if (progress < 0.5) {
                    elements.timerRing.classList.add('warning');
                    elements.timerRing.classList.remove('danger');
                }
            }

            if (remaining > 0) {
                GameState.roundTimer = requestAnimationFrame(updateTimer);
            } else {
                console.log('>>> TIMER COMPLETE! Calling endRound()');
                endRound();
            }
        } catch (error) {
            console.error('ERROR in updateTimer:', error);
        }
    }

    console.log('>>> Calling first updateTimer frame');
    updateTimer();
}

function endRound() {
    console.log('=== END ROUND', GameState.currentRound, '===');

    if (GameState.roundTimer) {
        cancelAnimationFrame(GameState.roundTimer);
    }

    const canFly = GameState.currentItem.canFly;
    console.log('Item:', GameState.currentItem.name, 'canFly:', canFly);

    // Calculate scores for each player
    GameState.players.forEach(player => {
        const action = player.action || 'kept'; // No action = kept finger down
        const wasTouchingAtStart = player.wasTouchingAtStart; // Was finger on circle when round started?
        let points = 0;
        let correct = false;

        console.log(`Player ${player.id + 1}: action=${action}, wasTouchingAtStart=${wasTouchingAtStart}`);

        // If player wasn't touching at the start, skip them (no points, no feedback)
        if (!wasTouchingAtStart) {
            // Player wasn't touching - no score change, no visual feedback
            console.log(`Player ${player.id + 1}: skipped (not touching at start)`);
            return; // Skip this player entirely
        }

        if (canFly) {
            // Should have lifted
            if (action === 'lifted') {
                points = 10;
                correct = true;
            } else {
                points = -5;
            }
        } else {
            // Should have kept down
            if (action === 'kept') {
                points = 10;
                correct = true;
            } else {
                points = -5;
            }
        }

        console.log(`Player ${player.id + 1}: correct=${correct}, points=${points}`);

        // Update score (minimum 0)
        player.score = Math.max(0, player.score + points);

        // Show feedback
        showPlayerFeedback(player.id, correct, points);
        updateScoreDisplay(player.id);
    });

    // Reset round state
    GameState.roundStartTime = null;

    // Reset player actions for next round
    GameState.players.forEach(player => {
        player.action = null;
    });

    // Wait before next round
    console.log('Waiting 2 seconds before next round...');
    setTimeout(() => {
        console.log('Starting next round...');
        startNextRound();
    }, 2000);
}

function showPlayerFeedback(playerId, correct, points) {
    // Find circle in the game screen container
    const container = elements.gameCirclesContainer;
    const circle = container?.querySelector(`#player-circle-${playerId}`);
    if (!circle) return;

    // Get the wrapper for positioning
    const wrapper = circle.parentElement;

    // Add animation class
    circle.classList.remove('bounce', 'shake');
    void circle.offsetWidth; // Force reflow

    if (correct) {
        circle.classList.add('bounce');
        playSound('correct');
        vibrate([50, 30, 50]);
    } else {
        circle.classList.add('shake');
        playSound('wrong');
        vibrate(150);
    }

    // Show result indicator
    const indicator = document.createElement('div');
    indicator.className = `result-indicator ${correct ? 'correct' : 'wrong'}`;
    indicator.innerHTML = correct
        ? `<span>✓</span><span>+${points}</span>`
        : `<span>✗</span><span>${points}</span>`;

    // Position from wrapper
    if (wrapper) {
        indicator.style.left = wrapper.style.left;
        indicator.style.top = wrapper.style.top;
    }

    if (container) {
        container.appendChild(indicator);
    }

    setTimeout(() => {
        indicator.remove();
        circle.classList.remove('bounce', 'shake');
    }, 1500);
}

function updateScoreDisplay(playerId) {
    // Update score in game container
    const container = elements.gameCirclesContainer;
    const scoreEl = container?.querySelector(`#score-${playerId}`);
    const player = GameState.players[playerId];

    if (scoreEl && player) {
        scoreEl.textContent = player.score;

        // Animate score change (preserve translateX from CSS)
        scoreEl.style.transform = 'translateX(-50%) scale(1.3)';
        setTimeout(() => {
            scoreEl.style.transform = 'translateX(-50%) scale(1)';
        }, 200);
    }
}

// ==========================================
// GAME END / RESULTS
// ==========================================

function endGame() {
    showScreen('results-screen');

    // Sort players by score
    const rankings = [...GameState.players].sort((a, b) => b.score - a.score);

    // Display leaderboard
    if (elements.leaderboard) {
        elements.leaderboard.innerHTML = '';

        rankings.forEach((player, index) => {
            const rank = index + 1;
            const item = document.createElement('div');
            item.className = `leaderboard-item ${rank === 1 ? 'winner' : ''}`;

            let rankDisplay;
            if (rank === 1) rankDisplay = '<span class="rank-medal">🥇</span>';
            else if (rank === 2) rankDisplay = '<span class="rank-medal">🥈</span>';
            else if (rank === 3) rankDisplay = '<span class="rank-medal">🥉</span>';
            else rankDisplay = `<span class="rank">${rank}</span>`;

            item.innerHTML = `
        ${rankDisplay}
        <div class="player-color" style="background: ${player.color.hex}"></div>
        <span class="player-name">Player ${player.id + 1}</span>
        <span class="final-score">${player.score}</span>
      `;

            elements.leaderboard.appendChild(item);
        });
    }

    // Show confetti for winner
    if (rankings[0].score > 0) {
        createConfetti();
    }

    // Setup buttons
    document.getElementById('btn-play-again')?.addEventListener('click', () => {
        playSound('click');
        vibrate(50);
        showScreen('game-screen');
        startGameSetup();
    });

    document.getElementById('btn-main-menu')?.addEventListener('click', () => {
        playSound('click');
        vibrate(50);

        // Fully reset game state
        GameState.currentRound = 0;
        GameState.roundStartTime = null;
        GameState.currentItem = null;
        GameState.usedItems = [];
        GameState.waitingForFingers = false;
        GameState.allFingersPlaced = false;
        GameState.isPaused = false;

        // Reset players array completely
        GameState.players = [];
        GameState.playerCount = 0;

        showScreen('home-screen');
    });
}

// ==========================================
// CONFETTI
// ==========================================

function createConfetti() {
    if (!elements.confettiContainer) return;

    elements.confettiContainer.innerHTML = '';

    const colors = ['#FF5252', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

        elements.confettiContainer.appendChild(confetti);
    }

    // Clean up after animation
    setTimeout(() => {
        if (elements.confettiContainer) {
            elements.confettiContainer.innerHTML = '';
        }
    }, 5000);
}

// ==========================================
// MODALS
// ==========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function initModals() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            const modal = btn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Click outside to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // Settings toggles
    initSettingsToggles();
}

function initSettingsToggles() {
    const soundToggle = document.getElementById('toggle-sound');
    const vibrationToggle = document.getElementById('toggle-vibration');

    // Load saved settings
    const savedSettings = loadSettings();
    GameState.soundEnabled = savedSettings.sound;
    GameState.vibrationEnabled = savedSettings.vibration;

    if (soundToggle) {
        soundToggle.classList.toggle('active', GameState.soundEnabled);
        soundToggle.addEventListener('click', () => {
            GameState.soundEnabled = !GameState.soundEnabled;
            soundToggle.classList.toggle('active', GameState.soundEnabled);
            saveSettings();
            if (GameState.soundEnabled) playSound('click');
        });
    }

    if (vibrationToggle) {
        vibrationToggle.classList.toggle('active', GameState.vibrationEnabled);
        vibrationToggle.addEventListener('click', () => {
            GameState.vibrationEnabled = !GameState.vibrationEnabled;
            vibrationToggle.classList.toggle('active', GameState.vibrationEnabled);
            saveSettings();
            if (GameState.vibrationEnabled) vibrate(50);
        });
    }
}

// ==========================================
// LOCAL STORAGE
// ==========================================

function saveSettings() {
    try {
        localStorage.setItem('chidiya-udd-settings', JSON.stringify({
            sound: GameState.soundEnabled,
            vibration: GameState.vibrationEnabled
        }));
    } catch (e) {
        console.log('Could not save settings');
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('chidiya-udd-settings');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.log('Could not load settings');
    }
    return { sound: true, vibration: true };
}

function saveStats(winner) {
    try {
        const stats = JSON.parse(localStorage.getItem('chidiya-udd-stats') || '{}');
        stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
        stats.highScore = Math.max(stats.highScore || 0, winner.score);
        localStorage.setItem('chidiya-udd-stats', JSON.stringify(stats));
    } catch (e) {
        console.log('Could not save stats');
    }
}

// ==========================================
// PAUSE / RESUME
// ==========================================

function pauseGame() {
    if (GameState.isPaused) return;

    GameState.isPaused = true;
    GameState.pauseStartTime = Date.now();

    if (GameState.roundTimer) {
        cancelAnimationFrame(GameState.roundTimer);
    }

    // Online mode: use synced pause if host
    if (GameState.mode === 'online' && typeof hostPauseGame === 'function') {
        hostPauseGame();
        return;
    }

    // Show pause modal
    const modal = document.getElementById('pause-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function resumeGame() {
    if (!GameState.isPaused) return;

    // Calculate how long we were paused
    const pauseDuration = Date.now() - GameState.pauseStartTime;

    // Adjust the round start time to account for pause
    if (GameState.roundStartTime) {
        GameState.roundStartTime += pauseDuration;
    }

    GameState.isPaused = false;

    // Online mode: use synced resume if host
    if (GameState.mode === 'online' && typeof hostResumeGame === 'function') {
        hostResumeGame();
    }

    // Close pause modal
    closePauseModal();

    // Resume timer if we were in a round
    if (GameState.roundStartTime && GameState.currentRound > 0) {
        startRoundTimer();
    }
}

function closePauseModal() {
    const modal = document.getElementById('pause-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}


// ==========================================
// ONLINE MODE HANDLERS
// ==========================================

function initOnlineMode() {
    // Create room button
    document.getElementById('btn-create-room')?.addEventListener('click', () => {
        playSound('click');
        showScreen('create-room-screen');
        if (typeof createRoom === 'function') {
            createRoom();
        }
    });

    // Join room button
    document.getElementById('btn-join-room')?.addEventListener('click', () => {
        playSound('click');
        showScreen('join-room-screen');
    });

    // Back button
    document.getElementById('btn-back-online-menu')?.addEventListener('click', () => {
        playSound('click');
        showScreen('online-menu-screen');
    });

    document.getElementById('btn-back-home-online')?.addEventListener('click', () => {
        playSound('click');
        showScreen('home-screen');
    });

    // Join room form
    document.getElementById('btn-join-submit')?.addEventListener('click', () => {
        const input = document.getElementById('room-code-input');
        if (input && input.value.length >= 4) {
            playSound('click');
            if (typeof joinRoom === 'function') {
                joinRoom(input.value.toUpperCase());
            }
        }
    });

    // Room code input formatting
    const roomInput = document.getElementById('room-code-input');
    if (roomInput) {
        roomInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        });
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
    initElements();
    initAudio();
    initHomeScreen();
    initPlayerSelection();
    initModals();
    initOnlineMode();

    // Show home screen
    showScreen('home-screen');

    // Prevent default touch behaviors on game container
    document.addEventListener('touchmove', (e) => {
        if (document.body.classList.contains('game-active')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => {
        if (document.body.classList.contains('game-active')) {
            e.preventDefault();
        }
    });

    console.log('Chidiya Udd game initialized!');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for online mode integration
window.ChidiyaUdd = {
    GameState,
    ITEMS,
    PLAYER_COLORS,
    showScreen,
    initPlayers,
    startGameSetup,
    startCountdown,
    displayItem,
    endRound,
    showPlayerFeedback,
    updateScoreDisplay,
    endGame,
    playSound,
    vibrate
};
