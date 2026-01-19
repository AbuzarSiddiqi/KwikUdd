/**
 * Finger Shoot Game - Enhanced Version
 * Beautiful sky background, animated birds, smooth hand gun gesture
 */

const FingerShootGame = {
    isActive: false,
    score: 0,
    videoElement: null,
    canvasElement: null,
    canvasCtx: null,
    hands: null,
    camera: null,
    animationFrameId: null,
    lastTime: 0,

    // Game Objects
    birds: [],
    clouds: [],
    particles: [],
    scorePopups: [],
    crosshair: { x: 0, y: 0, targetX: 0, targetY: 0, active: false, smoothX: 0, smoothY: 0, historyX: [], historyY: [] },

    // Gesture State
    isAiming: false,
    thumbTrigger: 'up', // 'up' or 'down'
    lastShotTime: 0,
    muzzleFlash: { active: false, time: 0 },

    // Configuration
    spawnRate: 2000, // ms
    lastSpawnTime: 0,
    cloudSpawnRate: 4000,
    lastCloudSpawnTime: 0,

    // Sky colors for beautiful gradient
    skyColors: {
        top: { r: 135, g: 206, b: 250 },      // Light sky blue
        middle: { r: 255, g: 183, b: 77 },    // Sunset orange
        bottom: { r: 255, g: 102, b: 102 }    // Warm coral
    },

    init: function () {
        this.videoElement = document.getElementById('input-video');
        this.canvasElement = document.getElementById('output-canvas');
        if (this.canvasElement) {
            this.canvasCtx = this.canvasElement.getContext('2d');
        }

        // Buttons
        const startBtn = document.getElementById('btn-finger-shoot');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.setupGame();
            });
        }

        document.getElementById('btn-fs-back')?.addEventListener('click', () => {
            this.stopGame();
            showScreen('home-screen');
        });

        document.getElementById('btn-fs-start')?.addEventListener('click', () => {
            document.getElementById('fs-instructions').classList.add('hidden');
            this.startGameLoop();
        });

        document.getElementById('btn-fs-restart')?.addEventListener('click', () => {
            document.getElementById('fs-game-over').classList.add('hidden');
            this.score = 0;
            this.spawnRate = 2000;
            this.updateScoreDisplay();
            this.startGameLoop();
        });

        document.getElementById('btn-fs-menu')?.addEventListener('click', () => {
            this.stopGame();
            showScreen('home-screen');
        });
    },

    setupGame: function () {
        showScreen('finger-shoot-screen');

        document.getElementById('fs-game-over').classList.add('hidden');
        document.getElementById('fs-instructions').classList.add('hidden');
        document.getElementById('fs-loading').classList.remove('hidden');

        this.score = 0;
        this.spawnRate = 2000;
        this.updateScoreDisplay();

        // Initialize MediaPipe Hands
        if (!this.hands) {
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.6,
                minTrackingConfidence: 0.6
            });

            this.hands.onResults(this.onResults.bind(this));
        }

        // Initialize Camera
        if (this.videoElement) {
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    if (this.hands && this.videoElement) {
                        await this.hands.send({ image: this.videoElement });
                    }
                },
                width: 1280,
                height: 720
            });

            this.camera.start()
                .then(() => {
                    console.log("Camera started");
                    document.getElementById('fs-loading').classList.add('hidden');
                    document.getElementById('fs-instructions').classList.remove('hidden');
                    this.resizeCanvas();
                    window.addEventListener('resize', this.resizeCanvas.bind(this));
                })
                .catch(err => {
                    console.error("Camera error:", err);
                    alert("Camera access denied or error. Please allow camera access.");
                    document.getElementById('fs-loading').innerHTML = `<p style="color:red">Camera Error: ${err.message}</p>`;
                });
        }
    },

    resizeCanvas: function () {
        if (this.videoElement && this.canvasElement) {
            this.canvasElement.width = window.innerWidth;
            this.canvasElement.height = window.innerHeight;
        }
    },

    stopGame: function () {
        this.isActive = false;

        if (this.videoElement && this.videoElement.srcObject) {
            const tracks = this.videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }

        if (this.camera) {
            try { this.camera.stop(); } catch (e) { }
            this.camera = null;
        }

        this.hands = null;

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        window.removeEventListener('resize', this.resizeCanvas.bind(this));
    },

    startGameLoop: function () {
        this.isActive = true;
        this.birds = [];
        this.clouds = [];
        this.particles = [];
        this.scorePopups = [];
        this.lastTime = performance.now();
        this.lastSpawnTime = 0;
        this.lastCloudSpawnTime = 0;

        // Pre-spawn some clouds
        for (let i = 0; i < 5; i++) {
            this.spawnCloud(true);
        }

        this.resizeCanvas();
        this.loop();
    },

    loop: function () {
        if (!this.isActive) return;

        const now = performance.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        this.update(now, deltaTime);

        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    },

    update: function (now, deltaTime) {
        // Spawn Clouds
        if (now - this.lastCloudSpawnTime > this.cloudSpawnRate) {
            this.spawnCloud();
            this.lastCloudSpawnTime = now;
        }

        // Spawn Birds
        if (now - this.lastSpawnTime > this.spawnRate) {
            this.spawnBird();
            this.lastSpawnTime = now;

            // Increase difficulty gradually
            if (this.spawnRate > 800) this.spawnRate -= 20;
        }

        // Update Clouds
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            const cloud = this.clouds[i];
            cloud.x += cloud.speed * (deltaTime / 16);
            if (cloud.x > this.canvasElement.width + 200) {
                this.clouds.splice(i, 1);
            }
        }

        // Update Birds with natural flapping
        for (let i = this.birds.length - 1; i >= 0; i--) {
            const bird = this.birds[i];
            bird.x += bird.vx * (deltaTime / 16);
            bird.y += Math.sin(bird.flapPhase) * 0.5;
            bird.flapPhase += 0.15;
            bird.wingAngle = Math.sin(bird.flapPhase) * 0.4;

            // Remove if out of screen
            if ((bird.vx > 0 && bird.x > this.canvasElement.width + 60) ||
                (bird.vx < 0 && bird.x < -60)) {
                this.birds.splice(i, 1);
            }
        }

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.life -= 0.03;
            p.rotation += p.rotationSpeed;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // Update Score Popups
        for (let i = this.scorePopups.length - 1; i >= 0; i--) {
            const popup = this.scorePopups[i];
            popup.y -= 2;
            popup.life -= 0.02;
            if (popup.life <= 0) this.scorePopups.splice(i, 1);
        }

        // Update Muzzle Flash
        if (this.muzzleFlash.active && now - this.muzzleFlash.time > 100) {
            this.muzzleFlash.active = false;
        }

        // Ultra-smooth crosshair with moving average
        if (this.crosshair.active) {
            // Add to history for moving average
            this.crosshair.historyX.push(this.crosshair.targetX);
            this.crosshair.historyY.push(this.crosshair.targetY);

            // Keep last 5 frames for responsiveness
            if (this.crosshair.historyX.length > 5) this.crosshair.historyX.shift();
            if (this.crosshair.historyY.length > 5) this.crosshair.historyY.shift();

            // Calculate moving average
            const avgX = this.crosshair.historyX.reduce((a, b) => a + b, 0) / this.crosshair.historyX.length;
            const avgY = this.crosshair.historyY.reduce((a, b) => a + b, 0) / this.crosshair.historyY.length;

            // Lerp to smoothed position (higher = more responsive)
            const lerpFactor = 0.25;
            this.crosshair.x += (avgX - this.crosshair.x) * lerpFactor;
            this.crosshair.y += (avgY - this.crosshair.y) * lerpFactor;
        }
    },

    spawnCloud: function (initial = false) {
        if (!this.canvasElement) return;

        const cloud = {
            x: initial ? Math.random() * this.canvasElement.width : -150,
            y: Math.random() * (this.canvasElement.height * 0.4) + 30,
            width: 100 + Math.random() * 100,
            height: 40 + Math.random() * 30,
            speed: 0.3 + Math.random() * 0.4,
            opacity: 0.4 + Math.random() * 0.3
        };

        this.clouds.push(cloud);
    },

    spawnBird: function () {
        if (!this.canvasElement) return;

        const side = Math.random() > 0.5 ? 'left' : 'right';
        const y = Math.random() * (this.canvasElement.height * 0.65) + 80;
        const size = 25 + Math.random() * 20;

        const bird = {
            x: side === 'left' ? -50 : this.canvasElement.width + 50,
            y: y,
            vx: side === 'left' ? (1.5 + Math.random() * 2) : -(1.5 + Math.random() * 2),
            size: size,
            flapPhase: Math.random() * Math.PI * 2,
            wingAngle: 0,
            color: this.getRandomBirdColor(),
            id: Date.now() + Math.random()
        };

        this.birds.push(bird);
    },

    getRandomBirdColor: function () {
        const colors = [
            { body: '#2D3436', wing: '#636E72' },    // Dark gray
            { body: '#D63031', wing: '#FF7675' },    // Red
            { body: '#0984E3', wing: '#74B9FF' },    // Blue
            { body: '#00B894', wing: '#55EFC4' },    // Green
            { body: '#6C5CE7', wing: '#A29BFE' },    // Purple
            { body: '#F39C12', wing: '#FDCB6E' },    // Orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    onResults: function (results) {
        if (!this.canvasCtx || !this.isActive) return;

        const ctx = this.canvasCtx;
        const width = this.canvasElement.width;
        const height = this.canvasElement.height;

        ctx.save();

        // Draw Beautiful Sky Background
        this.drawSkyBackground(ctx, width, height);

        // Draw Clouds
        this.drawClouds(ctx);

        // Draw Birds
        this.drawBirds(ctx);

        // Draw Particles
        this.drawParticles(ctx);

        // Draw Score Popups
        this.drawScorePopups(ctx);

        // Process Hand Tracking (no skeleton - only crosshair)
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            this.detectGesture(landmarks);
        } else {
            this.isAiming = false;
            this.crosshair.active = false;
        }

        // Draw Crosshair
        if (this.isAiming && this.crosshair.active) {
            this.drawCrosshair(ctx);
        }

        // Draw Muzzle Flash
        if (this.muzzleFlash.active) {
            this.drawMuzzleFlash(ctx);
        }

        ctx.restore();
    },

    drawSkyBackground: function (ctx, width, height) {
        // Create gradient sky
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#87CEEB');    // Light sky blue at top
        gradient.addColorStop(0.4, '#87CEEB');
        gradient.addColorStop(0.6, '#FFB74D');  // Sunset orange
        gradient.addColorStop(0.85, '#FF8A65'); // Warm coral
        gradient.addColorStop(1, '#EF5350');    // Deep sunset red

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw sun
        const sunX = width * 0.8;
        const sunY = height * 0.35;
        const sunRadius = 50;

        // Sun glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3);
        sunGlow.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
        sunGlow.addColorStop(0.3, 'rgba(255, 200, 100, 0.3)');
        sunGlow.addColorStop(1, 'rgba(255, 150, 50, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Sun core
        ctx.fillStyle = '#FFF9C4';
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
    },

    drawClouds: function (ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';

        this.clouds.forEach(cloud => {
            ctx.globalAlpha = cloud.opacity;

            // Draw fluffy cloud using circles
            const cx = cloud.x;
            const cy = cloud.y;
            const w = cloud.width;
            const h = cloud.height;

            ctx.beginPath();
            ctx.arc(cx, cy, h * 0.6, 0, Math.PI * 2);
            ctx.arc(cx + w * 0.25, cy - h * 0.2, h * 0.5, 0, Math.PI * 2);
            ctx.arc(cx + w * 0.5, cy, h * 0.55, 0, Math.PI * 2);
            ctx.arc(cx + w * 0.35, cy + h * 0.15, h * 0.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = 1;
        });
    },

    drawBirds: function (ctx) {
        this.birds.forEach(bird => {
            ctx.save();
            ctx.translate(bird.x, bird.y);

            // Flip bird based on direction
            if (bird.vx < 0) {
                ctx.scale(-1, 1);
            }

            const size = bird.size;

            // Body
            ctx.fillStyle = bird.color.body;
            ctx.beginPath();
            ctx.ellipse(0, 0, size * 0.8, size * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Head
            ctx.beginPath();
            ctx.arc(size * 0.5, -size * 0.1, size * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Beak
            ctx.fillStyle = '#F39C12';
            ctx.beginPath();
            ctx.moveTo(size * 0.75, -size * 0.1);
            ctx.lineTo(size * 1.1, 0);
            ctx.lineTo(size * 0.75, size * 0.05);
            ctx.closePath();
            ctx.fill();

            // Eye
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(size * 0.55, -size * 0.15, size * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(size * 0.57, -size * 0.15, size * 0.05, 0, Math.PI * 2);
            ctx.fill();

            // Wing (animated)
            ctx.save();
            ctx.translate(-size * 0.1, -size * 0.15);
            ctx.rotate(bird.wingAngle);
            ctx.fillStyle = bird.color.wing;
            ctx.beginPath();
            ctx.ellipse(0, 0, size * 0.5, size * 0.25, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Tail
            ctx.fillStyle = bird.color.body;
            ctx.beginPath();
            ctx.moveTo(-size * 0.6, 0);
            ctx.lineTo(-size * 1.1, -size * 0.15);
            ctx.lineTo(-size * 1.1, size * 0.15);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });
    },

    drawParticles: function (ctx) {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            if (p.type === 'feather') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size * 2, p.size * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });
    },

    drawScorePopups: function (ctx) {
        ctx.font = 'bold 28px Fredoka, sans-serif';
        ctx.textAlign = 'center';

        this.scorePopups.forEach(popup => {
            ctx.globalAlpha = popup.life;
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeText(popup.text, popup.x, popup.y);
            ctx.fillText(popup.text, popup.x, popup.y);
            ctx.globalAlpha = 1;
        });
    },

    drawHandGun: function (ctx, landmarks, width, height) {
        // Draw simplified hand skeleton
        const indexTip = landmarks[8];
        const indexDIP = landmarks[7];
        const indexPIP = landmarks[6];
        const indexMCP = landmarks[5];
        const thumbTip = landmarks[4];
        const thumbIP = landmarks[3];
        const wrist = landmarks[0];

        const toScreen = (lm) => ({
            x: (1 - lm.x) * width,  // Mirror
            y: lm.y * height
        });

        const pts = {
            indexTip: toScreen(indexTip),
            indexDIP: toScreen(indexDIP),
            indexPIP: toScreen(indexPIP),
            indexMCP: toScreen(indexMCP),
            thumbTip: toScreen(thumbTip),
            thumbIP: toScreen(thumbIP),
            wrist: toScreen(wrist)
        };

        // Draw gun-like hand
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Index finger (barrel)
        ctx.beginPath();
        ctx.moveTo(pts.indexMCP.x, pts.indexMCP.y);
        ctx.lineTo(pts.indexPIP.x, pts.indexPIP.y);
        ctx.lineTo(pts.indexDIP.x, pts.indexDIP.y);
        ctx.lineTo(pts.indexTip.x, pts.indexTip.y);
        ctx.stroke();

        // Thumb (hammer)
        ctx.strokeStyle = this.thumbTrigger === 'down' ? '#FF0000' : '#FFFF00';
        ctx.beginPath();
        ctx.moveTo(pts.indexMCP.x, pts.indexMCP.y);
        ctx.lineTo(pts.thumbIP.x, pts.thumbIP.y);
        ctx.lineTo(pts.thumbTip.x, pts.thumbTip.y);
        ctx.stroke();

        // Wrist to index base (handle)
        ctx.strokeStyle = '#00FF00';
        ctx.beginPath();
        ctx.moveTo(pts.wrist.x, pts.wrist.y);
        ctx.lineTo(pts.indexMCP.x, pts.indexMCP.y);
        ctx.stroke();

        // Highlight fingertip
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(pts.indexTip.x, pts.indexTip.y, 8, 0, Math.PI * 2);
        ctx.fill();
    },

    drawCrosshair: function (ctx) {
        const x = this.crosshair.x;
        const y = this.crosshair.y;
        const isFiring = this.thumbTrigger === 'down';

        // Outer glow
        ctx.strokeStyle = isFiring ? 'rgba(255, 50, 50, 0.5)' : 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.stroke();

        // Inner ring
        ctx.strokeStyle = isFiring ? '#FF3333' : '#00FF00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair lines
        const lineLength = 40;
        const gap = 12;

        ctx.beginPath();
        // Top
        ctx.moveTo(x, y - gap);
        ctx.lineTo(x, y - lineLength);
        // Bottom
        ctx.moveTo(x, y + gap);
        ctx.lineTo(x, y + lineLength);
        // Left
        ctx.moveTo(x - gap, y);
        ctx.lineTo(x - lineLength, y);
        // Right
        ctx.moveTo(x + gap, y);
        ctx.lineTo(x + lineLength, y);
        ctx.stroke();

        // Center dot
        ctx.fillStyle = isFiring ? '#FF3333' : '#00FF00';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    },

    drawMuzzleFlash: function (ctx) {
        const x = this.crosshair.x;
        const y = this.crosshair.y - 50;

        // Flash effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
        gradient.addColorStop(0.3, 'rgba(255, 200, 50, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
    },

    detectGesture: function (landmarks) {
        const indexTip = landmarks[8];
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexMCP = landmarks[5];

        const width = this.canvasElement.width;
        const height = this.canvasElement.height;

        // Simple direct mapping: index fingertip position maps to screen
        // No inversion - finger right = crosshair right
        const rawAimX = indexTip.x * width;
        const rawAimY = indexTip.y * height;

        // Clamp to screen bounds with padding
        this.crosshair.targetX = Math.max(30, Math.min(width - 30, rawAimX));
        this.crosshair.targetY = Math.max(30, Math.min(height - 30, rawAimY));

        if (!this.crosshair.active) {
            this.crosshair.x = this.crosshair.targetX;
            this.crosshair.y = this.crosshair.targetY;
            this.crosshair.historyX = [this.crosshair.targetX];
            this.crosshair.historyY = [this.crosshair.targetY];
            this.crosshair.active = true;
        }

        this.isAiming = true;

        // Trigger detection (thumb distance to index base)
        const thumbIndexDist = Math.sqrt(
            Math.pow(thumbTip.x - indexMCP.x, 2) +
            Math.pow(thumbTip.y - indexMCP.y, 2)
        );

        const FIRE_THRESHOLD = 0.08;
        const RESET_THRESHOLD = 0.14;

        if (this.thumbTrigger === 'up' && thumbIndexDist < FIRE_THRESHOLD) {
            this.thumbTrigger = 'down';

            if (performance.now() - this.lastShotTime > 300) {
                this.shoot();
                this.lastShotTime = performance.now();
            }
        } else if (this.thumbTrigger === 'down' && thumbIndexDist > RESET_THRESHOLD) {
            this.thumbTrigger = 'up';
        }
    },

    shoot: function () {
        // Muzzle flash
        this.muzzleFlash.active = true;
        this.muzzleFlash.time = performance.now();

        // Play sound
        if (typeof playSound === 'function') playSound('click');

        let hit = false;

        // Check for bird hits
        for (let i = this.birds.length - 1; i >= 0; i--) {
            const bird = this.birds[i];
            const dx = bird.x - this.crosshair.x;
            const dy = bird.y - this.crosshair.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Hit detection with generous hitbox
            if (dist < bird.size * 2.5) {
                // Create explosion particles
                this.createExplosion(bird.x, bird.y, bird.color);

                // Score popup
                this.scorePopups.push({
                    x: bird.x,
                    y: bird.y,
                    text: '+10',
                    life: 1.0
                });

                // Remove bird
                this.birds.splice(i, 1);

                // Update score
                this.score += 10;
                this.updateScoreDisplay();

                if (typeof playSound === 'function') playSound('correct');
                hit = true;
                break;
            }
        }

    },

    createExplosion: function (x, y, birdColor) {
        // Feathers
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 10 - 3,
                size: 4 + Math.random() * 4,
                color: birdColor.wing,
                life: 1.0,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                type: 'feather'
            });
        }

        // Spark particles
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: 3 + Math.random() * 3,
                color: '#FFD700',
                life: 1.0,
                rotation: 0,
                rotationSpeed: 0,
                type: 'spark'
            });
        }
    },

    updateScoreDisplay: function () {
        const el = document.getElementById('fs-score-value');
        if (el) el.textContent = this.score;
        const finalEl = document.getElementById('fs-final-score');
        if (finalEl) finalEl.textContent = this.score;
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    FingerShootGame.init();
});
