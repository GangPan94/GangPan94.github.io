/* Main Game Coordinator & Garage Interior Art Router for Garage War */

class GarageWarGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Load Designated Inside-of-the-Garage Interior Background Art Asset
    this.bgImage = new Image();
    this.bgImage.src = 'garage_interior.jpg';
    this.bgLoaded = false;
    this.bgImage.onload = () => {
      this.bgLoaded = true;
    };

    this.level = 1; // 1 = Clean, 2 = Cluttered
    this.isGameActive = false;
    this.isEndGame = false;

    this.junkList = [];
    this.lastTime = 0;

    this.initCanvas();

    this.car = new GarageCar(this.width, this.height);
    this.physics = new PhysicsWorld(this.width, this.height, this.car);
    this.multiplierMgr = new MultiplierManager(this.width, this.height, (player) => {
      this.onMultiplierActivated(player);
    });

    this.isSweeping = false;
    this.sweepPointerId = null;

    this.bindEvents();
    this.bindTouchControls();

    // Start Animation Loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  initCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      if (this.car) this.car.resize(this.width, this.height);
      if (this.physics) this.physics.resize(this.width, this.height);
      if (this.multiplierMgr) this.multiplierMgr.resize(this.width, this.height);
    });
  }

  bindEvents() {
    const lvl1Btn = document.getElementById('select-level-1');
    const lvl2Btn = document.getElementById('select-level-2');
    
    lvl1Btn?.addEventListener('click', () => {
      this.level = 1;
      lvl1Btn.classList.add('active');
      lvl2Btn?.classList.remove('active');
      document.getElementById('level-badge').innerText = '🛣️ ROUTE 66: Clean';
    });

    lvl2Btn?.addEventListener('click', () => {
      this.level = 2;
      lvl2Btn.classList.add('active');
      lvl1Btn?.classList.remove('active');
      document.getElementById('level-badge').innerText = '🛣️ ROUTE 66: Cluttered';
    });

    document.getElementById('start-game-btn')?.addEventListener('click', () => {
      this.startWar();
    });

    document.getElementById('finish-btn')?.addEventListener('click', () => {
      this.finishWar();
    });

    document.getElementById('restart-game-btn')?.addEventListener('click', () => {
      this.startWar();
    });

    document.getElementById('switch-level-btn')?.addEventListener('click', () => {
      document.getElementById('victory-modal').classList.add('hidden');
      document.getElementById('start-modal').classList.remove('hidden');
    });

    document.getElementById('audio-toggle')?.addEventListener('click', (e) => {
      const isMuted = window.soundEngine.toggleMute();
      e.target.innerText = isMuted ? '🔇' : '🔊';
    });
  }

  bindTouchControls() {
    // MOM THROW BUTTON
    const momThrowBtn = document.getElementById('mom-throw-btn');
    const handleMomThrow = (e) => {
      e.preventDefault();
      if (!this.isGameActive || this.isEndGame) return;
      this.throwJunk('mom');
    };
    momThrowBtn?.addEventListener('pointerdown', handleMomThrow);

    // ERNEST THROW BUTTON
    const ernestThrowBtn = document.getElementById('ernest-throw-btn');
    const handleErnestThrow = (e) => {
      e.preventDefault();
      if (!this.isGameActive || this.isEndGame || ernestThrowBtn.disabled) return;
      this.throwJunk('ernest');
    };
    ernestThrowBtn?.addEventListener('pointerdown', handleErnestThrow);

    // ERNEST DRAG-AND-POINT SHOP VACUUM BUTTON & NOZZLE CONTROLS
    const ernestSweepBtn = document.getElementById('ernest-sweep-btn');

    const startSweep = (e) => {
      e.preventDefault();
      if (!this.isGameActive || this.isEndGame) return;

      this.isSweeping = true;
      this.sweepPointerId = e.pointerId;

      try {
        if (ernestSweepBtn && ernestSweepBtn.setPointerCapture) {
          ernestSweepBtn.setPointerCapture(e.pointerId);
        }
      } catch (err) {}

      ernestSweepBtn.classList.add('holding');
      ernestThrowBtn.disabled = true; // LOCK OUT THROW BUTTON WHILE SWEEPING!
      ernestThrowBtn.classList.add('disabled');

      const rect = this.canvas.getBoundingClientRect();
      const px = e.clientX ? e.clientX - rect.left : this.width * 0.75;
      const py = e.clientY ? e.clientY - rect.top : this.height * 0.5;

      this.physics.setVacuumPosition(px, py);
      this.physics.setVacuumActive(true);
      window.soundEngine.startVacuum();
    };

    const updateSweepPos = (e) => {
      if (!this.isSweeping || (this.sweepPointerId !== null && e.pointerId !== this.sweepPointerId)) return;

      const rect = this.canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      this.physics.setVacuumPosition(px, py);
    };

    const stopSweep = (e) => {
      if (!this.isSweeping) return;
      if (this.sweepPointerId !== null && e.pointerId !== this.sweepPointerId) return; // STRICTLY IGNORE OTHER PLAYER'S TOUCH EVENTS!

      e.preventDefault();

      try {
        if (ernestSweepBtn && ernestSweepBtn.releasePointerCapture) {
          ernestSweepBtn.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}

      this.isSweeping = false;
      this.sweepPointerId = null;

      ernestSweepBtn.classList.remove('holding');
      ernestThrowBtn.disabled = false;
      ernestThrowBtn.classList.remove('disabled');

      this.physics.setVacuumActive(false);
      window.soundEngine.stopVacuum();
    };

    ernestSweepBtn?.addEventListener('pointerdown', startSweep);
    window.addEventListener('pointermove', updateSweepPos);
    window.addEventListener('pointerup', stopSweep);
    window.addEventListener('pointercancel', stopSweep);
  }

  startWar() {
    this.isGameActive = true;
    this.isEndGame = false;
    this.junkList = [];
    this.car.reset();

    document.getElementById('start-modal')?.classList.add('hidden');
    document.getElementById('victory-modal')?.classList.add('hidden');

    if (this.level === 2) {
      for (let i = 0; i < 18; i++) {
        let x = 60 + Math.random() * (this.width - 120);
        let y = 100 + Math.random() * (this.height - 240);

        if (Math.abs(x - this.width / 2) < this.car.width / 2 && Math.abs(y - this.height / 2) < this.car.height / 2) {
          x += (x > this.width / 2 ? 150 : -150);
        }

        const startingOwner = Math.random() > 0.5 ? 'mom' : 'ernest';
        const item = new JunkItem(x, y, startingOwner);
        item.vx = (Math.random() - 0.5) * 5;
        item.vy = (Math.random() - 0.5) * 5;
        this.junkList.push(item);
      }
    }

    this.updateHUD();
  }

  throwJunk(owner) {
    const isMom = owner === 'mom';
    const has3x = isMom ? this.multiplierMgr.momBonusTimer > 0 : this.multiplierMgr.ernestBonusTimer > 0;
    const throwCount = has3x ? 3 : 1;

    const startX = isMom ? 100 : this.width - 100;
    const startY = this.height - 140;

    for (let i = 0; i < throwCount; i++) {
      const item = new JunkItem(startX, startY, owner);
      
      let randomAngle;
      if (isMom) {
        randomAngle = -Math.PI * 0.48 + (Math.random() - 0.5) * Math.PI * 0.65;
      } else {
        randomAngle = -Math.PI * 0.52 - (Math.random() - 0.5) * Math.PI * 0.65;
      }

      const speed = 18 + Math.random() * 12;
      item.vx = Math.cos(randomAngle) * speed;
      item.vy = Math.sin(randomAngle) * speed;

      item.flightZ = 12;
      item.vz = 12 + Math.random() * 8;
      item.vAngle = (Math.random() - 0.5) * 0.8;

      this.junkList.push(item);
    }

    window.soundEngine.playThrow(owner);
    this.updateHUD();
  }

  onMultiplierActivated(player) {
    const badgeId = player === 'mom' ? 'mom-multiplier-badge' : 'ernest-multiplier-badge';
    const badge = document.getElementById(badgeId);
    if (badge) badge.classList.remove('hidden');
  }

  finishWar() {
    this.isGameActive = false;
    this.isEndGame = true;
    this.physics.setVacuumActive(false);
    window.soundEngine.stopVacuum();

    const momCount = this.junkList.filter(j => j.owner === 'mom').length;
    const ernestCount = this.junkList.filter(j => j.owner === 'ernest').length;
    const totalCount = this.junkList.length;
    const carDamage = Math.round(((this.car.maxHealth - this.car.health) / this.car.maxHealth) * 100);

    let winnerText = "IT'S A TIE ON ROUTE 66!";
    if (momCount > ernestCount) {
      winnerText = "LUCIAN IS THE ROUTE 66 CHAMPION! 🏆👑";
    } else if (ernestCount > momCount) {
      winnerText = "ERNEST DOMINATES ROUTE 66! ⚡🏆";
    }

    document.getElementById('winner-badge').innerText = winnerText;
    document.getElementById('res-mom-count').innerText = momCount;
    document.getElementById('res-ernest-count').innerText = ernestCount;
    document.getElementById('res-total-count').innerText = totalCount;
    document.getElementById('res-car-damage').innerText = `${carDamage}% (${this.car.maxHealth - this.car.health} / 660 Hits)`;

    document.getElementById('res-mom-bar-count').innerText = momCount;
    document.getElementById('res-ernest-bar-count').innerText = ernestCount;

    const momRatio = totalCount > 0 ? (momCount / totalCount) * 100 : 50;
    const ernestRatio = totalCount > 0 ? (ernestCount / totalCount) * 100 : 50;

    const vMomBar = document.getElementById('victory-bar-mom');
    const vErnestBar = document.getElementById('victory-bar-ernest');
    if (vMomBar) vMomBar.style.width = `${momRatio}%`;
    if (vErnestBar) vErnestBar.style.width = `${ernestRatio}%`;

    document.getElementById('victory-modal')?.classList.remove('hidden');
    window.soundEngine.playPowerupActivate();
  }

  updateHUD() {
    const momCount = this.junkList.filter(j => j.owner === 'mom').length;
    const ernestCount = this.junkList.filter(j => j.owner === 'ernest').length;
    const totalCount = this.junkList.length;

    document.getElementById('total-junk-count').innerText = totalCount;
    document.getElementById('mom-junk-count').innerText = momCount;
    document.getElementById('ernest-junk-count').innerText = ernestCount;

    const momRatio = totalCount > 0 ? (momCount / totalCount) * 100 : 50;
    const ernestRatio = totalCount > 0 ? (ernestCount / totalCount) * 100 : 50;

    const momBar = document.getElementById('stacked-bar-mom');
    const ernestBar = document.getElementById('stacked-bar-ernest');

    if (momBar) momBar.style.width = `${momRatio}%`;
    if (ernestBar) ernestBar.style.width = `${ernestRatio}%`;

    const ratioText = document.getElementById('split-ratio');
    if (ratioText) ratioText.innerText = `${Math.round(momRatio)}% / ${Math.round(ernestRatio)}%`;

    const carHpPct = Math.round((this.car.health / this.car.maxHealth) * 100);
    const carFill = document.getElementById('car-health-fill');
    const carText = document.getElementById('car-health-text');
    if (carFill) carFill.style.width = `${carHpPct}%`;
    if (carText) carText.innerText = `${carHpPct}% (${this.car.health} HP)`;

    const momBadge = document.getElementById('mom-multiplier-badge');
    const ernestBadge = document.getElementById('ernest-multiplier-badge');

    if (this.multiplierMgr.momBonusTimer > 0) {
      if (momBadge) {
        momBadge.innerText = `⚡ 3X MULTIPLIER (${Math.ceil(this.multiplierMgr.momBonusTimer)}s)`;
        momBadge.classList.remove('hidden');
      }
    } else if (momBadge) {
      momBadge.classList.add('hidden');
    }

    if (this.multiplierMgr.ernestBonusTimer > 0) {
      if (ernestBadge) {
        ernestBadge.innerText = `⚡ 3X MULTIPLIER (${Math.ceil(this.multiplierMgr.ernestBonusTimer)}s)`;
        ernestBadge.classList.remove('hidden');
      }
    } else if (ernestBadge) {
      ernestBadge.classList.add('hidden');
    }

    if (this.isGameActive && this.car.health <= 0) {
      setTimeout(() => this.finishWar(), 800);
    }
  }

  gameLoop(timestamp) {
    const dt = Math.min(0.05, (timestamp - (this.lastTime || timestamp)) / 1000);
    this.lastTime = timestamp;

    if (this.isGameActive) {
      this.physics.update(this.junkList, dt);
      this.car.update();
      this.multiplierMgr.update(dt);

      this.updateHUD();
    }

    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // DRAW ROUTE 66 INSIDE-THE-GARAGE INTERIOR BACKDROP ARTWORK
    this.drawGarageBackground();

    // DRAW CENTRAL CAR
    this.car.draw(this.ctx);

    // DRAW ALL JUNK ITEMS
    this.junkList.forEach(junk => junk.draw(this.ctx, this.isEndGame));

    // DRAW VACUUM EFFECT IF ACTIVE
    this.physics.drawVacuumEffect(this.ctx);

    // DRAW MULTIPLIER CRATE
    if (this.isGameActive) {
      this.multiplierMgr.draw(this.ctx);
    }
  }

  drawGarageBackground() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. INSIDE-THE-GARAGE INTERIOR BACKDROP ARTWORK
    if (this.bgLoaded) {
      ctx.drawImage(this.bgImage, 0, 0, w, h);

      // Translucent overlay for game floor playability contrast
      ctx.fillStyle = 'rgba(10, 12, 18, 0.65)';
      ctx.fillRect(0, 80, w, h - 210);
    } else {
      ctx.fillStyle = '#11131a';
      ctx.fillRect(0, 80, w, h - 210);
    }

    // 2. NEON PARKING SPOT BOX AROUND CAR
    if (this.car) {
      const pad = 26;
      ctx.strokeStyle = '#ec4899';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 16;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(this.car.x - pad, this.car.y - pad, this.car.width + pad * 2, this.car.height + pad * 2);
      ctx.shadowBlur = 0;
    }

    // 3. VINTAGE SUNSET BORDER ACCENTS
    const sunsetGrad = ctx.createLinearGradient(0, 80, w, 80);
    sunsetGrad.addColorStop(0, '#f59e0b');
    sunsetGrad.addColorStop(0.5, '#ec4899');
    sunsetGrad.addColorStop(1, '#06b6d4');

    ctx.fillStyle = sunsetGrad;
    ctx.fillRect(0, 80, w, 8);
    ctx.fillRect(0, h - 138, w, 8);
  }
}

window.addEventListener('load', () => {
  window.game = new GarageWarGame();
});
