/* Custom Top-Down 2D Physics, Spatial Hash Grid & Fast Vacuum Engine for Garage War */

class SpatialHashGrid {
  constructor(cellSize = 90) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  clear() {
    this.grid.clear();
  }

  getKey(cx, cy) {
    return `${cx}_${cy}`;
  }

  insert(item) {
    const minCx = Math.floor((item.x - item.radius) / this.cellSize);
    const maxCx = Math.floor((item.x + item.radius) / this.cellSize);
    const minCy = Math.floor((item.y - item.radius) / this.cellSize);
    const maxCy = Math.floor((item.y + item.radius) / this.cellSize);

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const key = this.getKey(cx, cy);
        let cell = this.grid.get(key);
        if (!cell) {
          cell = [];
          this.grid.set(key, cell);
        }
        cell.push(item);
      }
    }
  }
}

class PhysicsWorld {
  constructor(canvasWidth, canvasHeight, car) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.car = car;
    
    // Top-down wall boundaries
    this.wallTop = 85;
    this.wallBottom = canvasHeight - 140;
    this.wallLeft = 20;
    this.wallRight = canvasWidth - 20;

    this.defaultRestitution = 0.82;
    this.defaultFriction = 0.985;

    // Spatial Hash Grid for O(N) Collision Performance
    this.spatialGrid = new SpatialHashGrid(90);

    // Interactive Drag-and-Point Shop Vacuum State
    this.isVacuumActive = false;
    this.vacuumX = canvasWidth * 0.75;
    this.vacuumY = canvasHeight * 0.6;
    this.vacuumParticles = [];

    // Timers for absorption resistance per item
    this.itemAbsorptionTimers = new Map();
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.wallBottom = h - 140;
    this.wallRight = w - 20;
  }

  setVacuumPosition(x, y) {
    this.vacuumX = x;
    this.vacuumY = y;
  }

  setVacuumActive(active) {
    this.isVacuumActive = active;
    if (!active) {
      this.itemAbsorptionTimers.clear();
    }
  }

  update(junkList, dt) {
    // 1. MOVEMENT & WALL BOUNCES FOR ALL JUNK
    junkList.forEach(item => {
      item.update(dt);
      if (item.isSleeping) return;

      const r = item.radius;

      if (item.y - r < this.wallTop) {
        item.y = this.wallTop + r;
        item.vy = -item.vy * this.defaultRestitution;
        item.vx *= this.defaultFriction;
        if (Math.abs(item.vy) > 1.2) window.soundEngine.playImpact(Math.abs(item.vy) * 0.4, false);
      }

      if (item.y + r > this.wallBottom) {
        item.y = this.wallBottom - r;
        item.vy = -item.vy * this.defaultRestitution;
        item.vx *= this.defaultFriction;
        if (Math.abs(item.vy) > 1.2) window.soundEngine.playImpact(Math.abs(item.vy) * 0.4, false);
      }

      if (item.x - r < this.wallLeft) {
        item.x = this.wallLeft + r;
        item.vx = -item.vx * this.defaultRestitution;
        item.vy *= this.defaultFriction;
        if (Math.abs(item.vx) > 1.2) window.soundEngine.playImpact(Math.abs(item.vx) * 0.4, false);
      }

      if (item.x + r > this.wallRight) {
        item.x = this.wallRight - r;
        item.vx = -item.vx * this.defaultRestitution;
        item.vy *= this.defaultFriction;
        if (Math.abs(item.vx) > 1.2) window.soundEngine.playImpact(Math.abs(item.vx) * 0.4, false);
      }
    });

    // 2. ITEM VS CENTRAL CAR COLLISIONS
    this.checkCarCollisions(junkList);

    // 3. ITEM VS ITEM COLLISIONS WITH SPATIAL HASH GRID O(N)
    this.checkItemCollisionsGrid(junkList);

    // 4. FAST SHOP VACUUM (300PX SUCTION RANGE & HIGH SPEED ABSORPTION)
    if (this.isVacuumActive) {
      this.updateFastShopVacuum(junkList, dt);
    }
  }

  checkCarCollisions(junkList) {
    if (!this.car || this.car.health <= 0) return;

    const cb = this.car.bounds;

    junkList.forEach(item => {
      const closestX = Math.max(cb.left, Math.min(item.x, cb.right));
      const closestY = Math.max(cb.top, Math.min(item.y, cb.bottom));

      const dx = item.x - closestX;
      const dy = item.y - closestY;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq < item.radius * item.radius) {
        item.wakeUp();
        const speed = Math.hypot(item.vx, item.vy);
        const dist = Math.sqrt(distanceSq) || 1;
        const nx = dx / dist;
        const ny = dy / dist;

        const overlap = item.radius - dist;
        item.x += nx * (overlap + 4);
        item.y += ny * (overlap + 4);

        const dot = item.vx * nx + item.vy * ny;
        item.vx = (item.vx - 2.1 * dot * nx) * 0.88;
        item.vy = (item.vy - 2.1 * dot * ny) * 0.88;

        item.vAngle += (Math.random() - 0.5) * 0.5;

        if (speed > 0.3) {
          const dmg = Math.max(1, Math.min(30, Math.ceil(item.mass * Math.max(1, speed) * 0.9)));
          this.car.takeDamage(dmg, closestX, closestY);
        }
      }
    });
  }

  checkItemCollisionsGrid(junkList) {
    this.spatialGrid.clear();

    // Insert all active & sleeping items into spatial grid
    junkList.forEach(item => this.spatialGrid.insert(item));

    const checkedPairs = new Set();

    junkList.forEach(a => {
      // If a is sleeping, skip primary check (it will be checked if an active item collides with it)
      if (a.isSleeping) return;

      const minCx = Math.floor((a.x - a.radius) / this.spatialGrid.cellSize);
      const maxCx = Math.floor((a.x + a.radius) / this.spatialGrid.cellSize);
      const minCy = Math.floor((a.y - a.radius) / this.spatialGrid.cellSize);
      const maxCy = Math.floor((a.y + a.radius) / this.spatialGrid.cellSize);

      for (let cx = minCx; cx <= maxCx; cx++) {
        for (let cy = minCy; cy <= maxCy; cy++) {
          const key = this.spatialGrid.getKey(cx, cy);
          const cell = this.spatialGrid.grid.get(key);
          if (!cell) continue;

          for (let i = 0; i < cell.length; i++) {
            const b = cell[i];
            if (a === b) continue;

            // Unique pair identifier
            const pairKey = a.x < b.x ? `${a.x}_${a.y}_${b.x}_${b.y}` : `${b.x}_${b.y}_${a.x}_${a.y}`;
            if (checkedPairs.has(pairKey)) continue;
            checkedPairs.add(pairKey);

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            const minDist = a.radius + b.radius;

            if (dist < minDist && dist > 0) {
              a.wakeUp();
              b.wakeUp();

              const nx = dx / dist;
              const ny = dy / dist;

              const overlap = (minDist - dist) * 0.5;
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              b.x += nx * overlap;
              b.y += ny * overlap;

              const kx = a.vx - b.vx;
              const ky = a.vy - b.vy;
              const p = 2.0 * (nx * kx + ny * ky) / (a.mass + b.mass);

              a.vx -= p * b.mass * nx * 0.92;
              a.vy -= p * b.mass * ny * 0.92;
              b.vx += p * a.mass * nx * 0.92;
              b.vy += p * a.mass * ny * 0.92;

              a.vAngle += (Math.random() - 0.5) * 0.3;
              b.vAngle += (Math.random() - 0.5) * 0.3;
            }
          }
        }
      }
    });
  }

  updateFastShopVacuum(junkList, dt) {
    const vx = this.vacuumX;
    const vy = this.vacuumY;

    for (let i = junkList.length - 1; i >= 0; i--) {
      const item = junkList[i];
      const dx = vx - item.x;
      const dy = vy - item.y;
      const dist = Math.hypot(dx, dy) || 1;

      // 300PX SUCTION RANGE WITH HIGH PULL SPEED
      if (dist < 300) {
        item.wakeUp(); // Wake up sleeping items caught in vacuum!

        const pullForce = ((300 - dist) / 300 * 1.45) / Math.max(1, item.mass * 0.25);
        item.vx += (dx / dist) * pullForce;
        item.vy += (dy / dist) * pullForce;
        item.vAngle += 0.08 / Math.max(1, item.mass * 0.3);

        // SPEEDY ABSORPTION AT NOZZLE CENTER (dist < 38px)
        if (dist < 38 + item.radius * 0.4) {
          item.x += (Math.random() - 0.5) * 2;
          item.y += (Math.random() - 0.5) * 2;

          let timer = this.itemAbsorptionTimers.get(item) || 0;
          timer += dt;
          this.itemAbsorptionTimers.set(item, timer);

          // FASTER REQUIRED SUCTION TIME (0.08s to 0.15s)
          const requiredTime = 0.08 + Math.min(0.12, item.mass * 0.03);

          if (timer >= requiredTime) {
            for (let p = 0; p < 18; p++) {
              this.vacuumParticles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.5) * 14,
                life: 1.0,
                color: item.owner === 'mom' ? '#ffd700' : (item.owner === 'ernest' ? '#00d2ff' : '#a855f7')
              });
            }

            this.itemAbsorptionTimers.delete(item);
            junkList.splice(i, 1);
            window.soundEngine.playImpact(1.8, false);
          }
        } else {
          this.itemAbsorptionTimers.delete(item);
        }
      }
    }

    if (Math.random() < 0.95) {
      const angle = Math.random() * Math.PI * 2;
      const rad = 40 + Math.random() * 260;
      this.vacuumParticles.push({
        x: vx + Math.cos(angle) * rad,
        y: vy + Math.sin(angle) * rad,
        vx: (vx - (vx + Math.cos(angle) * rad)) * 0.15,
        vy: (vy - (vy + Math.sin(angle) * rad)) * 0.15,
        life: 0.8,
        color: Math.random() > 0.5 ? '#ec4899' : '#06b6d4'
      });
    }

    for (let i = this.vacuumParticles.length - 1; i >= 0; i--) {
      const vp = this.vacuumParticles[i];
      vp.x += vp.vx;
      vp.y += vp.vy;
      vp.life -= 0.05;
      if (vp.life <= 0) this.vacuumParticles.splice(i, 1);
    }
  }

  drawVacuumEffect(ctx) {
    if (!this.isVacuumActive) return;

    const vx = this.vacuumX;
    const vy = this.vacuumY;

    ctx.save();

    const suctionRadius = 300;

    ctx.beginPath();
    ctx.arc(vx, vy, suctionRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
    ctx.fill();

    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([16, 12]);
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(vx, vy, suctionRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    const pulse1 = (Date.now() * 0.14) % suctionRadius;
    const pulse2 = ((Date.now() * 0.14) + 100) % suctionRadius;
    [pulse1, pulse2].forEach(pr => {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = Math.max(0.1, 1.0 - pr / suctionRadius);
      ctx.beginPath();
      ctx.arc(vx, vy, pr, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.globalAlpha = 1.0;

    const startX = this.width - 100;
    const startY = this.height - 130;
    const ctrlX = (startX + vx) / 2 + 50;
    const ctrlY = (startY + vy) / 2 + 60;

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.moveTo(startX, startY + 6);
    ctx.quadraticCurveTo(ctrlX, ctrlY + 6, vx, vy + 6);
    ctx.stroke();

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, vx, vy);
    ctx.stroke();

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 14;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, vx, vy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(vx - 8, vy - 8, 16, 16);

    ctx.beginPath();
    ctx.arc(vx, vy, 36, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(236, 72, 153, 0.4)';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 24;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧹', vx, vy);

    this.vacuumParticles.forEach(vp => {
      ctx.beginPath();
      ctx.arc(vp.x, vp.y, 4.5 * vp.life, 0, Math.PI * 2);
      ctx.fillStyle = vp.color;
      ctx.globalAlpha = vp.life;
      ctx.fill();
    });

    ctx.restore();
  }
}

window.PhysicsWorld = PhysicsWorld;
