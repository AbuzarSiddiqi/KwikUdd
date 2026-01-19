/**
 * Chidiya Udd - Bird Fly Game
 * PeerJS Multiplayer Implementation
 */

// ==========================================
// MULTIPLAYER STATE
// ==========================================

const MultiplayerState = {
    peer: null,
    isHost: false,
    hostPeerId: null,
    roomCode: null,
    connections: {},
    hostConnection: null,

    // Online game state (host manages this)
    gameState: null,

    // Player info
    myPlayerId: null,
    playerName: null,

    // Connection status
    isConnected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 3
};

// ==========================================
// PEERJS INITIALIZATION
// ==========================================

function initPeer(callback, customId = null) {
    // Create a new Peer with optional custom ID (for host)
    // If no customId, let PeerJS generate one (for client)
    MultiplayerState.peer = customId ? new Peer(customId) : new Peer();

    MultiplayerState.peer.on('open', (id) => {
        console.log('[Peer] Connected with ID:', id);
        MultiplayerState.myPlayerId = id;
        MultiplayerState.isConnected = true;
        if (callback) callback(id);
    });

    MultiplayerState.peer.on('error', (err) => {
        console.error('[Peer] Error:', err.type, err);
        handlePeerError(err);
    });

    MultiplayerState.peer.on('disconnected', () => {
        console.log('[Peer] Disconnected from signaling server');
        handleDisconnect();
    });

    MultiplayerState.peer.on('close', () => {
        console.log('[Peer] Connection closed');
        MultiplayerState.isConnected = false;
    });
}

function handlePeerError(err) {
    let message = 'Connection error. Please try again.';

    switch (err.type) {
        case 'browser-incompatible':
            message = 'Your browser does not support the required features.';
            break;
        case 'unavailable-id':
            // ID taken, try again if we're creating a room
            if (MultiplayerState.isHost && !MultiplayerState.isConnected) {
                console.log('Room code taken, generating new one...');
                // Recursive retry with new code
                createRoom();
                return;
            }
            message = 'ID unavailable. Please try again.';
            break;
        case 'disconnected':
            message = 'Connection lost. Attempting to reconnect...';
            attemptReconnect();
            return;
        case 'network':
            message = 'Network error. Check your internet connection.';
            break;
        case 'peer-unavailable':
            message = 'Room not found. Please check the code.';
            break;
        case 'server-error':
            message = 'Server error. Please try again later.';
            break;
        case 'socket-error':
            message = 'Connection error. Please try again.';
            break;
        case 'ssl-unavailable':
            message = 'Secure connection unavailable.';
            break;
    }

    showError(message);
}

function handleDisconnect() {
    if (MultiplayerState.isHost) {
        // Host lost connection - try to reconnect
        attemptReconnect();
    } else {
        showError('Connection to host lost.');
    }
}

function attemptReconnect() {
    if (MultiplayerState.reconnectAttempts >= MultiplayerState.maxReconnectAttempts) {
        showError('Could not reconnect. Please try again.');
        return;
    }

    MultiplayerState.reconnectAttempts++;
    showMessage(`Reconnecting... (${MultiplayerState.reconnectAttempts}/${MultiplayerState.maxReconnectAttempts})`);

    setTimeout(() => {
        if (MultiplayerState.peer) {
            MultiplayerState.peer.reconnect();
        }
    }, 2000);
}

// ==========================================
// HOST (CREATE ROOM) FUNCTIONS
// ==========================================

function createRoom() {
    // Validate name first
    const nameInput = document.getElementById('player-name-input');
    const name = nameInput?.value.trim();

    if (!name || name.length < 2) {
        showError('Please enter your name (at least 2 characters)');
        nameInput?.focus();
        return;
    }

    MultiplayerState.isHost = true;
    MultiplayerState.playerName = name;

    // Save name to localStorage for next time
    try {
        localStorage.setItem('chidiya-udd-player-name', name);
    } catch (e) { }

    showMessage('Creating room...');

    // Generate 6-character room code first (letters only for easier typing)
    const code = generateRoomCode();

    // Use this code as our Peer ID
    initPeer((id) => {
        MultiplayerState.roomCode = id;
        MultiplayerState.hostPeerId = id;

        displayRoomCode(MultiplayerState.roomCode);
        showMessage('Waiting for players to join...');

        // Initialize game state
        MultiplayerState.gameState = {
            players: {},
            currentRound: 0,
            currentItem: null,
            roundStartTime: null,
            responses: {},
            usedItems: []
        };

        // Add host as first player
        const hostPlayer = {
            id: id,
            name: MultiplayerState.playerName,
            color: ChidiyaUdd.PLAYER_COLORS[0],
            score: 0,
            connected: true,
            isHost: true
        };
        MultiplayerState.gameState.players[id] = hostPlayer;
        updateLobbyPlayers();

        // Listen for incoming connections
        MultiplayerState.peer.on('connection', handleIncomingConnection);
    }, code); // Pass code as custom ID
}

function generateRoomCode() {
    // Generate 6 random uppercase letters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function handleIncomingConnection(conn) {
    console.log('[Host] Incoming connection from:', conn.peer);

    const playerId = conn.peer;
    MultiplayerState.connections[playerId] = conn;

    conn.on('open', () => {
        console.log('[Host] Connection opened with:', playerId);
    });

    conn.on('data', (data) => {
        handlePlayerMessage(data, playerId);
    });

    conn.on('close', () => {
        console.log('[Host] Player disconnected:', playerId);
        handlePlayerDisconnect(playerId);
    });

    conn.on('error', (err) => {
        console.error('[Host] Connection error with', playerId, err);
    });
}

function handlePlayerMessage(data, playerId) {
    console.log('[Host] Received from', playerId, ':', data.type);

    switch (data.type) {
        case 'join':
            addPlayer(playerId, data.name);
            break;

        case 'playerAction':
            recordPlayerAction(playerId, data.action, data.timestamp);
            break;

        case 'ready':
            // Player is ready for next round
            break;

        case 'leave':
            handlePlayerDisconnect(playerId);
            break;

        case 'scoreUpdate':
            // Update player's score and broadcast leaderboard
            if (MultiplayerState.gameState?.players[playerId]) {
                MultiplayerState.gameState.players[playerId].score = data.score;
                broadcastLeaderboard();
            }
            break;

        case 'touchStatus':
            // Track if player is currently touching their circle
            if (!MultiplayerState.gameState.playerTouchStates) {
                MultiplayerState.gameState.playerTouchStates = {};
            }
            MultiplayerState.gameState.playerTouchStates[playerId] = {
                isTouched: data.isTouched,
                timestamp: data.timestamp
            };
            break;
    }
}

function addPlayer(playerId, name) {
    if (Object.keys(MultiplayerState.gameState.players).length >= 8) {
        // Room is full
        sendToPlayer(playerId, { type: 'roomFull' });
        return;
    }

    const playerCount = Object.keys(MultiplayerState.gameState.players).length;

    MultiplayerState.gameState.players[playerId] = {
        id: playerId,
        name: name || `Player ${playerCount + 1}`,
        color: ChidiyaUdd.PLAYER_COLORS[playerCount],
        score: 0,
        connected: true,
        isHost: false
    };

    ChidiyaUdd.playSound('click');
    ChidiyaUdd.vibrate(50);

    // Broadcast updated player list to all
    broadcastToAll({
        type: 'playerList',
        players: MultiplayerState.gameState.players,
        hostId: MultiplayerState.hostPeerId
    });

    updateLobbyPlayers();
}

function handlePlayerDisconnect(playerId) {
    if (MultiplayerState.gameState.players[playerId]) {
        MultiplayerState.gameState.players[playerId].connected = false;

        // Remove disconnected player after a delay
        setTimeout(() => {
            if (!MultiplayerState.gameState.players[playerId]?.connected) {
                delete MultiplayerState.gameState.players[playerId];
                delete MultiplayerState.connections[playerId];

                broadcastToAll({
                    type: 'playerList',
                    players: MultiplayerState.gameState.players
                });

                updateLobbyPlayers();
            }
        }, 5000);

        broadcastToAll({
            type: 'playerDisconnected',
            playerId: playerId
        });

        updateLobbyPlayers();
    }
}

function recordPlayerAction(playerId, action, timestamp) {
    console.log('[Host] Recording action for player:', playerId, 'action:', action);

    if (MultiplayerState.gameState) {
        MultiplayerState.gameState.responses[playerId] = {
            action: action,
            timestamp: timestamp
        };

        console.log('[Host] Current responses:', MultiplayerState.gameState.responses);

        // Broadcast action to all players for visual feedback
        broadcastToAll({
            type: 'playerActionUpdate',
            playerId: playerId,
            action: action
        });
    }
}

// ==========================================
// HOST GAME CONTROL
// ==========================================

function hostStartGame() {
    if (!MultiplayerState.isHost) return;

    const playerCount = Object.keys(MultiplayerState.gameState.players).length;
    if (playerCount < 2) {
        showError('Need at least 2 players to start');
        return;
    }

    MultiplayerState.gameState.currentRound = 0;
    MultiplayerState.gameState.usedItems = [];

    // Reset all scores
    for (let id in MultiplayerState.gameState.players) {
        MultiplayerState.gameState.players[id].score = 0;
    }

    // Broadcast game start
    broadcastToAll({
        type: 'gameStart',
        players: MultiplayerState.gameState.players
    });

    // Switch to game screen for host
    setupOnlineGame();

    // Start countdown
    setTimeout(() => {
        hostStartRound();
    }, 4000); // After countdown
}

function setupOnlineGame() {
    // Initialize local game with online players
    const players = Object.values(MultiplayerState.gameState.players);
    ChidiyaUdd.GameState.playerCount = players.length;
    ChidiyaUdd.GameState.mode = 'online';

    ChidiyaUdd.initPlayers(players.length);

    // Map online players to local players
    players.forEach((player, index) => {
        ChidiyaUdd.GameState.players[index] = {
            ...ChidiyaUdd.GameState.players[index],
            onlineId: player.id,
            color: player.color, // Keep original assigned color
            score: player.score,
            name: player.name,
            isLocal: player.id === MultiplayerState.myPlayerId
        };
    });

    ChidiyaUdd.showScreen('game-screen');
    ChidiyaUdd.startGameSetup();

    // Hide old opponents container (center-based) if it exists
    const oldOpponentsContainer = document.getElementById('opponents-container');
    if (oldOpponentsContainer) oldOpponentsContainer.classList.add('hidden');

    // Show the new top leaderboard
    if (MultiplayerState.isHost) {
        broadcastLeaderboard();
    } else {
        // Client creates initial leaderboard with current player data
        const players = Object.values(MultiplayerState.gameState.players);
        updateLeaderboardDisplay(players.sort((a, b) => b.score - a.score));
    }

    // Show countdown
    showOnlineCountdown();
}

function showOnlineCountdown() {
    const overlay = document.getElementById('countdown-overlay');
    const numberEl = document.getElementById('countdown-number');

    if (!overlay || !numberEl) return;

    overlay.classList.add('active');

    let count = 3;

    function showNumber() {
        if (count > 0) {
            numberEl.textContent = count;
            numberEl.className = 'countdown-number';
            void numberEl.offsetWidth;
            numberEl.style.animation = 'none';
            void numberEl.offsetWidth;
            numberEl.style.animation = 'countdownPop 1s ease-out forwards';

            ChidiyaUdd.playSound('countdown');
            ChidiyaUdd.vibrate(100);

            count--;
            setTimeout(showNumber, 1000);
        } else {
            numberEl.textContent = 'GO!';
            numberEl.className = 'countdown-text';
            ChidiyaUdd.playSound('start');
            ChidiyaUdd.vibrate([100, 50, 100]);

            setTimeout(() => {
                overlay.classList.remove('active');
            }, 500);
        }
    }

    showNumber();
}

function hostStartRound() {
    if (!MultiplayerState.isHost) return;

    MultiplayerState.gameState.currentRound++;

    if (MultiplayerState.gameState.currentRound > ChidiyaUdd.GameState.totalRounds) {
        hostEndGame();
        return;
    }

    // Select random item
    const availableItems = ChidiyaUdd.ITEMS.filter(
        item => !MultiplayerState.gameState.usedItems.includes(item.name)
    );

    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    MultiplayerState.gameState.currentItem = randomItem;
    MultiplayerState.gameState.usedItems.push(randomItem.name);
    MultiplayerState.gameState.roundStartTime = Date.now();
    MultiplayerState.gameState.responses = {};

    // Track who was touching at round start
    // For host's local player - check if they're currently touching
    MultiplayerState.gameState.wasTouchingAtStart = {};
    for (let playerId in MultiplayerState.gameState.players) {
        // For local player (host), check local touch state
        if (playerId === MultiplayerState.myPlayerId) {
            const localPlayer = ChidiyaUdd.GameState.players.find(p => p.isLocal);
            MultiplayerState.gameState.wasTouchingAtStart[playerId] = localPlayer?.isTouched || false;
        } else {
            // For remote players, use their last known touch state (from touchStatus messages)
            const playerState = MultiplayerState.gameState.playerTouchStates?.[playerId];
            MultiplayerState.gameState.wasTouchingAtStart[playerId] = playerState?.isTouched || false;
        }
    }

    // Broadcast round start
    broadcastToAll({
        type: 'roundStart',
        round: MultiplayerState.gameState.currentRound,
        totalRounds: ChidiyaUdd.GameState.totalRounds,
        item: randomItem,
        duration: ChidiyaUdd.GameState.roundDuration
    });

    // Display locally
    displayRound(randomItem, MultiplayerState.gameState.currentRound);

    // Wait for round duration then calculate scores
    setTimeout(() => {
        hostEndRound();
    }, ChidiyaUdd.GameState.roundDuration);
}

function displayRound(item, round) {
    // Update round indicator
    const roundIndicator = document.getElementById('round-indicator');
    if (roundIndicator) {
        roundIndicator.textContent = `Round ${round}/${ChidiyaUdd.GameState.totalRounds}`;
    }

    ChidiyaUdd.displayItem(item);

    // Start timer
    startOnlineRoundTimer(ChidiyaUdd.GameState.roundDuration);
}

function startOnlineRoundTimer(duration) {
    const timerProgress = document.getElementById('timer-progress');
    const timerRing = document.getElementById('timer-ring');
    const circumference = 565.48;
    const startTime = Date.now();

    if (timerRing) {
        timerRing.classList.remove('warning', 'danger');
    }

    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const progress = remaining / duration;

        if (timerProgress) {
            const offset = circumference * (1 - progress);
            timerProgress.style.strokeDashoffset = offset;
        }

        if (timerRing) {
            if (progress < 0.25) {
                timerRing.classList.add('danger');
                timerRing.classList.remove('warning');
            } else if (progress < 0.5) {
                timerRing.classList.add('warning');
                timerRing.classList.remove('danger');
            }
        }

        if (remaining > 0) {
            requestAnimationFrame(updateTimer);
        }
    }

    updateTimer();
}

function hostEndRound() {
    if (!MultiplayerState.isHost) return;

    console.log('[Host] hostEndRound called');
    console.log('[Host] Current responses at round end:', MultiplayerState.gameState.responses);

    const canFly = MultiplayerState.gameState.currentItem.canFly;
    console.log('[Host] Item:', MultiplayerState.gameState.currentItem.name, 'canFly:', canFly);

    const results = {};

    for (let playerId in MultiplayerState.gameState.players) {
        const response = MultiplayerState.gameState.responses[playerId] || { action: 'kept' };
        const wasTouchingAtStart = MultiplayerState.gameState.wasTouchingAtStart?.[playerId] ?? false;
        console.log('[Host] Player:', playerId, 'response:', response, 'wasTouchingAtStart:', wasTouchingAtStart);
        let points = 0;
        let correct = false;

        // If player wasn't touching at the start, skip them (no points, no feedback)
        if (!wasTouchingAtStart) {
            console.log('[Host] Player:', playerId, 'skipped (not touching at start)');
            results[playerId] = {
                action: 'inactive',
                points: 0,
                correct: null, // null indicates inactive
                newScore: MultiplayerState.gameState.players[playerId].score
            };
            continue; // Skip to next player
        }

        if (canFly && response.action === 'lifted') {
            points = 10;
            correct = true;
        } else if (!canFly && response.action === 'kept') {
            points = 10;
            correct = true;
        } else {
            points = -5;
            correct = false;
        }

        MultiplayerState.gameState.players[playerId].score += points;
        if (MultiplayerState.gameState.players[playerId].score < 0) {
            MultiplayerState.gameState.players[playerId].score = 0;
        }

        results[playerId] = {
            action: response.action,
            points: points,
            correct: correct,
            newScore: MultiplayerState.gameState.players[playerId].score
        };
    }

    // Broadcast results
    broadcastToAll({
        type: 'roundEnd',
        results: results,
        correctAnswer: canFly ? 'lift' : 'keep'
    });

    // Show results locally
    showRoundResults(results);

    // Check if game is over
    if (MultiplayerState.gameState.currentRound >= ChidiyaUdd.GameState.totalRounds) {
        setTimeout(() => hostEndGame(), 2000);
    } else {
        setTimeout(() => hostStartRound(), 2000);
    }
}

function showRoundResults(results) {
    // Update local player circles with results
    ChidiyaUdd.GameState.players.forEach((player, index) => {
        const onlineId = player.onlineId || MultiplayerState.myPlayerId;
        const result = results[onlineId];

        if (result) {
            player.score = result.newScore;

            // Skip feedback for inactive players (correct === null means they weren't touching)
            if (result.correct === null) {
                ChidiyaUdd.updateScoreDisplay(player.id);
                return;
            }

            if (player.isLocal) {
                // Show standard feedback for local player
                ChidiyaUdd.showPlayerFeedback(player.id, result.correct, result.points);
                ChidiyaUdd.updateScoreDisplay(player.id); // Update local score display
            } else {
                // Update opponent card feedback
                const card = document.getElementById(`opponent-card-${player.onlineId}`);
                const scoreEl = document.getElementById(`opp-score-${player.onlineId}`);

                if (scoreEl) scoreEl.textContent = player.score;

                if (card) {
                    card.classList.remove('lifted', 'kept');
                    if (result.correct) card.classList.add('correct');
                    else card.classList.add('wrong');

                    // Reset after delay
                    setTimeout(() => {
                        card.classList.remove('correct', 'wrong');
                    }, 2000);
                }
            }
        }
    });
}

function hostEndGame() {
    if (!MultiplayerState.isHost) return;

    // Calculate rankings
    const rankings = Object.values(MultiplayerState.gameState.players)
        .sort((a, b) => b.score - a.score);

    broadcastToAll({
        type: 'gameEnd',
        rankings: rankings
    });

    // Show results locally
    showOnlineResults(rankings);
}

function showOnlineResults(rankings) {
    ChidiyaUdd.showScreen('results-screen');

    const leaderboard = document.getElementById('leaderboard');
    if (leaderboard) {
        leaderboard.innerHTML = '';

        rankings.forEach((player, index) => {
            const rank = index + 1;
            const item = document.createElement('div');
            item.className = `leaderboard-item ${rank === 1 ? 'winner' : ''}`;

            let rankDisplay;
            if (rank === 1) rankDisplay = '<span class="rank-medal">🥇</span>';
            else if (rank === 2) rankDisplay = '<span class="rank-medal">🥈</span>';
            else if (rank === 3) rankDisplay = '<span class="rank-medal">🥉</span>';
            else rankDisplay = `<span class="rank">${rank}</span>`;

            const isMe = player.id === MultiplayerState.myPlayerId;

            item.innerHTML = `
        ${rankDisplay}
        <div class="player-color" style="background: ${player.color.hex}"></div>
        <span class="player-name">${player.name}${isMe ? ' (You)' : ''}</span>
        <span class="final-score">${player.score}</span>
      `;

            leaderboard.appendChild(item);
        });
    }

    // Confetti for winner
    if (rankings[0]?.score > 0) {
        createConfetti();
    }

    // Hide the online leaderboard bar during results
    const onlineLeaderboard = document.getElementById('online-leaderboard');
    if (onlineLeaderboard) onlineLeaderboard.style.display = 'none';

    // Setup button handlers for online mode
    const playAgainBtn = document.getElementById('btn-play-again');
    const mainMenuBtn = document.getElementById('btn-main-menu');

    // Remove old listeners by cloning
    if (playAgainBtn) {
        const newPlayAgainBtn = playAgainBtn.cloneNode(true);
        playAgainBtn.parentNode.replaceChild(newPlayAgainBtn, playAgainBtn);

        if (MultiplayerState.isHost) {
            // Host can restart
            newPlayAgainBtn.innerHTML = '<span>🔄</span><span>Play Again</span>';
            newPlayAgainBtn.classList.remove('btn-disabled');

            newPlayAgainBtn.addEventListener('click', () => {
                ChidiyaUdd.playSound('click');
                ChidiyaUdd.vibrate(50);
                restartOnlineGame();
            });
        } else {
            // Client shows waiting message
            newPlayAgainBtn.innerHTML = '<span>⏳</span><span>Waiting for Host...</span>';
            newPlayAgainBtn.classList.add('btn-disabled');
            newPlayAgainBtn.style.opacity = '0.7';
            newPlayAgainBtn.style.cursor = 'not-allowed';
        }
    }

    if (mainMenuBtn) {
        const newMainMenuBtn = mainMenuBtn.cloneNode(true);
        mainMenuBtn.parentNode.replaceChild(newMainMenuBtn, mainMenuBtn);

        newMainMenuBtn.addEventListener('click', () => {
            ChidiyaUdd.playSound('click');
            ChidiyaUdd.vibrate(50);

            // Leave room and go to home
            leaveRoom();
            ChidiyaUdd.showScreen('home-screen');
        });
    }
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    container.innerHTML = '';
    const colors = ['#FF5252', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(confetti);
    }

    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// ==========================================
// CLIENT (JOIN ROOM) FUNCTIONS
// ==========================================

function joinRoom(roomCode) {
    // Validate name first
    const nameInput = document.getElementById('player-name-input');
    const name = nameInput?.value.trim();

    if (!name || name.length < 2) {
        showError('Please enter your name (at least 2 characters)');
        nameInput?.focus();
        return;
    }

    MultiplayerState.isHost = false;
    MultiplayerState.roomCode = roomCode.toUpperCase();
    MultiplayerState.playerName = name;

    // Save name to localStorage for next time
    try {
        localStorage.setItem('chidiya-udd-player-name', name);
    } catch (e) { }

    // Show loading indicator
    const loadingEl = document.getElementById('join-loading');
    const errorEl = document.getElementById('join-error');
    if (loadingEl) loadingEl.style.display = 'flex';
    if (errorEl) errorEl.style.display = 'none';

    showMessage('Connecting to room...');

    initPeer((id) => {
        // Try to find host with various ID formats
        const possibleHostIds = [
            roomCode.toLowerCase(),
            roomCode.toUpperCase(),
            roomCode
        ];

        tryConnect(possibleHostIds, 0);
    });
}

function tryConnect(hostIds, index) {
    if (index >= hostIds.length) {
        showError('Room not found. Please check the code.');
        return;
    }

    const hostId = hostIds[index];
    console.log('[Client] Trying to connect to:', hostId);

    const conn = MultiplayerState.peer.connect(hostId, {
        reliable: true
    });

    const timeout = setTimeout(() => {
        conn.close();
        tryConnect(hostIds, index + 1);
    }, 5000);

    conn.on('open', () => {
        clearTimeout(timeout);
        console.log('[Client] Connected to host');
        MultiplayerState.hostConnection = conn;
        MultiplayerState.hostPeerId = hostId;

        // Hide loading indicator
        const loadingEl = document.getElementById('join-loading');
        if (loadingEl) loadingEl.style.display = 'none';

        // Send join request
        const playerName = MultiplayerState.playerName || `Player ${Date.now().toString().slice(-4)}`;
        conn.send({
            type: 'join',
            name: playerName
        });

        showMessage('Connected! Waiting for host...');
        ChidiyaUdd.showScreen('lobby-screen');
    });

    conn.on('data', (data) => {
        handleHostMessage(data);
    });

    conn.on('close', () => {
        console.log('[Client] Connection to host closed');
        showError('Connection to host lost.');
    });

    conn.on('error', (err) => {
        clearTimeout(timeout);
        console.error('[Client] Connection error:', err);
        tryConnect(hostIds, index + 1);
    });
}

function handleHostMessage(data) {
    console.log('[Client] Received:', data.type);

    switch (data.type) {
        case 'playerList':
            updateLobbyPlayers(data.players);
            break;

        case 'roomFull':
            showError('Room is full (max 8 players)');
            break;

        case 'gameStart':
            clientStartGame(data.players);
            break;

        case 'roundStart':
            clientStartRound(data);
            break;

        case 'playerActionUpdate':
            updatePlayerAction(data.playerId, data.action);
            break;

        case 'roundEnd':
            clientEndRound(data.results, data.correctAnswer);
            break;

        case 'gameEnd':
            showOnlineResults(data.rankings);
            break;

        case 'playerDisconnected':
            handlePlayerDisconnectNotification(data.playerId);
            break;

        case 'leaderboard':
            // Update leaderboard display with all player scores
            updateLeaderboardDisplay(data.players);
            break;
    }
}

function clientStartGame(players) {
    MultiplayerState.gameState = { players };
    setupOnlineGame();
}

function clientStartRound(data) {
    displayRound(data.item, data.round);

    // Start local timer
    startOnlineRoundTimer(data.duration);

    // Reset touch tracking for this round
    ChidiyaUdd.GameState.players.forEach(player => {
        player.action = null;
    });
}

function updatePlayerAction(playerId, action) {
    // Find local player index for this online ID
    const playerIndex = ChidiyaUdd.GameState.players.findIndex(
        p => p.onlineId === playerId
    );

    if (playerIndex !== -1) {
        // Visual update for circle (if it's local)
        // ChidiyaUdd.updateCircleVisual(playerIndex, action === 'touched'); // Not needed for opponents in new UI
    }

    // Update opponent card
    updateOpponentCardVisual(playerId, action);
}

function updateOpponentCardVisual(playerId, action) {
    if (playerId === MultiplayerState.myPlayerId) return; // Don't update self card (doesn't exist)

    const card = document.getElementById(`opponent-card-${playerId}`);
    if (card) {
        if (action === 'lifted') {
            card.classList.add('lifted');
            card.classList.remove('kept');
        } else {
            card.classList.remove('lifted');
            card.classList.add('kept'); // or just default
        }
    }
}

// Global function to update opponent list UI
window.updateOpponentDisplay = function () {
    const container = document.getElementById('opponents-container');
    if (!container) return;

    container.innerHTML = '';

    const opponents = ChidiyaUdd.GameState.players.filter(p => !p.isLocal);

    opponents.forEach(p => {
        const card = document.createElement('div');
        card.className = 'opponent-card';
        card.id = `opponent-card-${p.onlineId}`;
        card.style.borderColor = p.color.hex; // subtle border

        card.innerHTML = `
            <div class="opponent-avatar" style="background: ${p.color.hex}"></div>
            <span class="opponent-name">${p.name || 'Player'}</span>
            <span class="opponent-score" id="opp-score-${p.onlineId}">${p.score}</span>
        `;

        container.appendChild(card);
    });
};

function clientEndRound(results, correctAnswer) {
    showRoundResults(results);

    // After local scoring, send my updated score to host
    sendMyScore();
}

function handlePlayerDisconnectNotification(playerId) {
    // Show notification that player disconnected
    showMessage(`A player disconnected`);
}

// ==========================================
// LEADERBOARD SYNC
// ==========================================

// Send local player's score to host for leaderboard
function sendMyScore() {
    const localPlayer = ChidiyaUdd.GameState.players.find(p => p.isLocal);
    if (!localPlayer) return;

    const score = localPlayer.score;

    if (MultiplayerState.isHost) {
        // Host updates own score in gameState and broadcasts leaderboard
        if (MultiplayerState.gameState?.players[MultiplayerState.myPlayerId]) {
            MultiplayerState.gameState.players[MultiplayerState.myPlayerId].score = score;
        }
        broadcastLeaderboard();
    } else if (MultiplayerState.hostConnection && MultiplayerState.hostConnection.open) {
        MultiplayerState.hostConnection.send({
            type: 'scoreUpdate',
            score: score
        });
    }
}

// Host broadcasts leaderboard to all players
function broadcastLeaderboard() {
    if (!MultiplayerState.isHost || !MultiplayerState.gameState) return;

    const players = Object.values(MultiplayerState.gameState.players)
        .sort((a, b) => b.score - a.score);

    broadcastToAll({
        type: 'leaderboard',
        players: players
    });

    // Also update locally
    updateLeaderboardDisplay(players);
}

// Render leaderboard at top of screen
function updateLeaderboardDisplay(players) {
    // Get or create leaderboard container
    let container = document.getElementById('online-leaderboard');
    if (!container) {
        container = document.createElement('div');
        container.id = 'online-leaderboard';
        container.className = 'online-leaderboard';
        document.body.appendChild(container);
    }

    // Make sure it's visible (may have been hidden by showOnlineResults)
    container.style.display = 'flex';

    container.innerHTML = '';

    players.forEach((player, index) => {
        const isMe = player.id === MultiplayerState.myPlayerId;
        const item = document.createElement('div');
        item.className = `leaderboard-player ${isMe ? 'is-me' : ''}`;

        item.innerHTML = `
            <span class="rank">${index + 1}</span>
            <span class="player-dot" style="background: ${player.color?.hex || '#888'}"></span>
            <span class="player-name">${player.name || 'Player'}</span>
            <span class="player-score">${player.score}</span>
        `;

        container.appendChild(item);
    });
}

// Make sendMyScore globally accessible
window.sendMyScore = sendMyScore;

// ==========================================
// SEND PLAYER ACTION
// ==========================================

// Make sendPlayerAction globally accessible for game-v2.js
window.sendPlayerAction = function (action) {
    console.log('[Multiplayer] sendPlayerAction called with:', action);

    if (MultiplayerState.isHost) {
        // Host records their own action directly
        console.log('[Host] Recording own action:', action);
        recordPlayerAction(MultiplayerState.myPlayerId, action, Date.now());
    } else if (MultiplayerState.hostConnection && MultiplayerState.hostConnection.open) {
        console.log('[Client] Sending action to host:', action);
        MultiplayerState.hostConnection.send({
            type: 'playerAction',
            action: action,
            timestamp: Date.now()
        });
    } else {
        console.warn('[Multiplayer] Cannot send action - no host connection');
    }
};

// Override touch handlers for online mode
function setupOnlineTouchHandlers() {
    const container = document.getElementById('circles-container');
    if (!container) return;

    container.querySelectorAll('.player-circle').forEach((circle, index) => {
        const player = ChidiyaUdd.GameState.players[index];

        // Only handle touches for our own circle in online mode
        const isMyCircle = player.onlineId === MultiplayerState.myPlayerId;

        if (isMyCircle || MultiplayerState.isHost) {
            // Track touch start
            circle.addEventListener('touchstart', () => {
                sendTouchStatus(true);
            }, { passive: true });

            circle.addEventListener('mousedown', () => {
                sendTouchStatus(true);
            });

            // Track touch end
            circle.addEventListener('touchend', () => {
                sendTouchStatus(false);
                sendPlayerAction('lifted');
            }, { passive: false });

            circle.addEventListener('mouseup', () => {
                sendTouchStatus(false);
                sendPlayerAction('lifted');
            });
        }
    });
}

// Send touch status to host
function sendTouchStatus(isTouched) {
    if (MultiplayerState.isHost) {
        // Host tracks their own touch state
        if (!MultiplayerState.gameState.playerTouchStates) {
            MultiplayerState.gameState.playerTouchStates = {};
        }
        MultiplayerState.gameState.playerTouchStates[MultiplayerState.myPlayerId] = {
            isTouched: isTouched,
            timestamp: Date.now()
        };
    } else if (MultiplayerState.hostConnection && MultiplayerState.hostConnection.open) {
        MultiplayerState.hostConnection.send({
            type: 'touchStatus',
            isTouched: isTouched,
            timestamp: Date.now()
        });
    }
}

// ==========================================
// GAME RESTART / LEAVE
// ==========================================

function restartOnlineGame() {
    if (!MultiplayerState.isHost) return;

    // Reset game state
    MultiplayerState.gameState.currentRound = 0;
    MultiplayerState.gameState.usedItems = [];
    MultiplayerState.gameState.responses = {};

    // Reset all player scores
    for (let id in MultiplayerState.gameState.players) {
        MultiplayerState.gameState.players[id].score = 0;
    }

    // Broadcast game restart to all players
    broadcastToAll({
        type: 'gameStart',
        players: MultiplayerState.gameState.players
    });

    // Restart locally
    setupOnlineGame();

    // Start first round after countdown
    setTimeout(() => {
        hostStartRound();
    }, 4000);
}

function leaveRoom() {
    // Hide online leaderboard if visible
    const onlineLeaderboard = document.getElementById('online-leaderboard');
    if (onlineLeaderboard) onlineLeaderboard.remove();

    // Close all connections
    if (MultiplayerState.hostConnection) {
        MultiplayerState.hostConnection.send({ type: 'leave' });
        MultiplayerState.hostConnection.close();
    }

    for (let id in MultiplayerState.connections) {
        MultiplayerState.connections[id].close();
    }

    // Close peer
    if (MultiplayerState.peer) {
        MultiplayerState.peer.destroy();
    }

    // Reset state
    MultiplayerState.peer = null;
    MultiplayerState.isHost = false;
    MultiplayerState.hostPeerId = null;
    MultiplayerState.roomCode = null;
    MultiplayerState.connections = {};
    MultiplayerState.hostConnection = null;
    MultiplayerState.gameState = null;
    MultiplayerState.myPlayerId = null;
    MultiplayerState.isConnected = false;

    // Reset game mode
    ChidiyaUdd.GameState.mode = 'local';
}

// ==========================================
// BROADCAST HELPERS
// ==========================================

function broadcastToAll(message) {
    for (let id in MultiplayerState.connections) {
        sendToPlayer(id, message);
    }
}

function sendToPlayer(playerId, message) {
    const conn = MultiplayerState.connections[playerId];
    if (conn && conn.open) {
        try {
            conn.send(message);
        } catch (e) {
            console.error('[Host] Error sending to', playerId, e);
        }
    }
}

// ==========================================
// UI HELPERS
// ==========================================

function displayRoomCode(code) {
    const codeEl = document.getElementById('display-room-code');
    if (codeEl) {
        codeEl.textContent = code;
    }

    // Copy button
    const copyBtn = document.getElementById('btn-copy-code');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy';
                }, 2000);
            });
        });
    }
}

function updateLobbyPlayers(players) {
    const playersList = document.getElementById('lobby-players');
    if (!playersList) return;

    const playersData = players || MultiplayerState.gameState?.players || {};

    playersList.innerHTML = '';

    Object.values(playersData).forEach(player => {
        const item = document.createElement('div');
        item.className = 'player-item';

        const isMe = player.id === MultiplayerState.myPlayerId;
        const statusClass = player.isHost ? 'host' : '';

        item.innerHTML = `
      <div class="player-color" style="background: ${player.color.hex}"></div>
      <span class="player-name">${player.name}${isMe ? ' (You)' : ''}</span>
      <span class="status ${statusClass}">${player.isHost ? 'Host' : 'Ready'}</span>
    `;

        playersList.appendChild(item);
    });

    // Update start button state
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn && MultiplayerState.isHost) {
        const canStart = Object.keys(playersData).length >= 2;
        startBtn.classList.toggle('btn-disabled', !canStart);
    }
}

function showMessage(text) {
    const msgEl = document.getElementById('online-message') ||
        document.querySelector('.waiting-message');
    if (msgEl) {
        msgEl.textContent = text;
    }
}

function showError(text) {
    const errorEl = document.getElementById('online-error');
    if (errorEl) {
        errorEl.textContent = text;
        errorEl.style.display = 'block';

        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    } else {
        alert(text);
    }
}

// ==========================================
// CLEANUP
// ==========================================

function leaveRoom() {
    if (MultiplayerState.hostConnection) {
        MultiplayerState.hostConnection.send({ type: 'leave' });
        MultiplayerState.hostConnection.close();
    }

    for (let id in MultiplayerState.connections) {
        MultiplayerState.connections[id].close();
    }

    if (MultiplayerState.peer) {
        MultiplayerState.peer.destroy();
    }

    // Reset state
    MultiplayerState.peer = null;
    MultiplayerState.isHost = false;
    MultiplayerState.hostPeerId = null;
    MultiplayerState.roomCode = null;
    MultiplayerState.connections = {};
    MultiplayerState.hostConnection = null;
    MultiplayerState.gameState = null;
    MultiplayerState.isConnected = false;
}

// ==========================================
// INITIALIZATION
// ==========================================

function initMultiplayer() {
    // Load saved player name from localStorage
    try {
        const savedName = localStorage.getItem('chidiya-udd-player-name');
        if (savedName) {
            const nameInput = document.getElementById('player-name-input');
            if (nameInput) nameInput.value = savedName;
        }
    } catch (e) { }

    // Start game button (host only)
    document.getElementById('btn-start-game')?.addEventListener('click', () => {
        if (MultiplayerState.isHost) {
            ChidiyaUdd.playSound('click');
            hostStartGame();
        }
    });

    // Leave/back buttons
    document.getElementById('btn-leave-room')?.addEventListener('click', () => {
        ChidiyaUdd.playSound('click');
        leaveRoom();
        ChidiyaUdd.showScreen('online-menu-screen');
    });

    document.getElementById('btn-cancel-room')?.addEventListener('click', () => {
        ChidiyaUdd.playSound('click');
        leaveRoom();
        ChidiyaUdd.showScreen('online-menu-screen');
    });

    // Back to join screen
    document.getElementById('btn-back-join')?.addEventListener('click', () => {
        ChidiyaUdd.playSound('click');
        ChidiyaUdd.showScreen('join-room-screen');
    });

    console.log('Multiplayer module initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMultiplayer);
} else {
    initMultiplayer();
}

// Export functions
window.createRoom = createRoom;
window.joinRoom = joinRoom;
window.leaveRoom = leaveRoom;
window.sendPlayerAction = sendPlayerAction;
window.MultiplayerState = MultiplayerState;
