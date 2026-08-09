/* 3x Multiplier Parachute Drop & Touch/Drag Manager for Garage War */

class MultiplierManager {
  constructor(canvasWidth, canvasHeight, onActivateCallback) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.onActivate = onActivateCallback;

    this.activeCrate = null; // Current floating multiplier crate
    this.spawnTimer = 0;
    this.spawnInterval = 12 + Math.random() * 6; // Spawns every 12-18s

    this.isDragging = false;
    this.dragPointerId = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    // Player multiplier bonus timers (seconds)
    this.momBonusTimer = 0;
    this.ernestBonusTimer = 0;

    this.bindEvents();
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
  }

  bindEvents() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    // Pointer events for multi-touch & mouse drag support
    canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
  }

  update(dt) {
    // 1. TIMERS FOR ACTIVE PLAYER BONUSES
    if (this.momBonusTimer > 0) {
      this.momBonusTimer = Math.max(0, this.momBonusTimer - dt);
    }
    if (this.ernestBonusTimer > 0) {
      this.ernestBonusTimer = Math.max(0, this.ernestBonusTimer - dt);
    }

    // 2. SPAWN NEW CRATE IF NONE FLOATING
    if (!this.activeCrate) {
      this.spawnTimer += dt;
      if (this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        this.spawnInterval = 12 + Math.random() * 6;
        this.spawnCrate();
      }
    } else if (!this.isDragging) {
      // Float down on parachute
      this.activeCrate.y += this.activeCrate.vy;
      this.activeCrate.x += Math.sin(Date.now() * 0.003) * 0.8; // Swaying motion

      // Ground hit - despawn if reaches bottom floor
      if (this.activeCrate.y > this.height - 110) {
        this.activeCrate = null;
      }
    }
  }

  spawnCrate() {
    this.activeCrate = {
      x: this.width * 0.25 + Math.random() * (this.width * 0.5),
      y: 90,
      radius: 28,
      vy: 1.2,
      scale: 1.0
    };
    window.soundEngine.playPowerupSpawn();

    // Show visual drop zone indicators
    document.getElementById('drop-zone-mom')?.classList.add('active');
    document.getElementById('drop-zone-ernest')?.classList.add('active');
  }

  handlePointerDown(e) {
    if (!this.activeCrate) return;

    const rect = e.target.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const dist = Math.hypot(px - this.activeCrate.x, py - this.activeCrate.y);

    if (dist < this.activeCrate.radius * 2.2) {
      this.isDragging = true;
      this.dragPointerId = e.pointerId;
      this.dragOffsetX = px - this.activeCrate.x;
      this.dragOffsetY = py - this.activeCrate.y;
    }
  }

  handlePointerMove(e) {
    if (!this.isDragging || !this.activeCrate) return;
    if (this.dragPointerId !== null && e.pointerId !== this.dragPointerId) return; // IGNORE OTHER POINTER MOVES

    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    this.activeCrate.x = px - this.dragOffsetX;
    this.activeCrate.y = py - this.dragOffsetY;
  }

  handlePointerUp(e) {
    if (!this.isDragging || !this.activeCrate) return;
    if (this.dragPointerId !== null && e.pointerId !== this.dragPointerId) return; // STRICTLY IGNORE OTHER PLAYER'S TOUCH RELEASES!

    this.isDragging = false;
    this.dragPointerId = null;

    // Check Drop Target Side (Mom vs Ernest)
    const px = this.activeCrate.x;

    if (px < this.width * 0.45) {
      // Dropped in Mom's side!
      this.activateMultiplier('mom');
    } else if (px > this.width * 0.55) {
      // Dropped in Ernest's side!
      this.activateMultiplier('ernest');
    }

    // Hide drop zones
    document.getElementById('drop-zone-mom')?.classList.remove('active');
    document.getElementById('drop-zone-ernest')?.classList.remove('active');
  }

  activateMultiplier(player) {
    if (player === 'mom') {
      this.momBonusTimer = 5.0; // 5 Seconds of 3X Throws
    } else {
      this.ernestBonusTimer = 5.0; // 5 Seconds of 3X Throws
    }

    window.soundEngine.playPowerupActivate();
    this.activeCrate = null;

    if (this.onActivate) {
      this.onActivate(player);
    }
  }

  draw(ctx) {
    if (!this.activeCrate) return;

    const { x, y, radius } = this.activeCrate;

    ctx.save();
    ctx.translate(x, y);

    // Parachute Canopy
    ctx.beginPath();
    ctx.arc(0, -32, 28, Math.PI, 0);
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 15;
    ctx.fill();

    // Parachute Strings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-26, -32); ctx.lineTo(-10, -5);
    ctx.moveTo(0, -32);   ctx.lineTo(0, -5);
    ctx.moveTo(26, -32);  ctx.lineTo(10, -5);
    ctx.stroke();

    // Glowing Crate Body
    ctx.beginPath();
    ctx.roundRect(-radius, -radius + 6, radius * 2, radius * 2, 8);
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // "3X" Text Badge
    ctx.shadowBlur = 0;
    ctx.font = 'bold 22px "Teko", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3X', 0, 8);

    ctx.restore();
  }
}

window.MultiplierManager = MultiplierManager;
