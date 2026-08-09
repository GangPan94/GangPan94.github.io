/* High-Detail Locked Aspect-Ratio Car Renderer for Garage War */

class GarageCar {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // Load High-Resolution Real Muscle Car Image Sprite
    this.carImage = new Image();
    this.carImage.src = 'car.jpg';
    this.imageLoaded = false;
    this.aspectRatio = 1.0; // naturalWidth / naturalHeight

    this.carImage.onload = () => {
      this.imageLoaded = true;
      if (this.carImage.naturalHeight > 0) {
        // Since image is oriented vertically (hood up), aspect ratio when rotated 90deg is height/width
        this.aspectRatio = this.carImage.naturalHeight / this.carImage.naturalWidth;
      }
      this.resize(this.canvasWidth, this.canvasHeight);
    };

    this.resize(canvasWidth, canvasHeight);

    // DURABILITY: 660 HITS
    this.maxHealth = 660;
    this.health = 660;

    this.particles = [];
    this.screenShake = 0;
  }

  resize(w, h) {
    this.canvasWidth = w;
    this.canvasHeight = h;

    // LOCKED ASPECT RATIO CALCULATION
    // Base car length horizontally
    const targetLength = Math.min(380, Math.max(280, w * 0.38));
    
    // Height computed strictly using locked aspect ratio to avoid distortion!
    const targetWidth = targetLength / (this.aspectRatio || 1.8);

    this.width = targetLength;
    this.height = targetWidth;

    // Center position
    this.x = w / 2 - this.width / 2;
    this.y = h / 2 - this.height / 2 - 10;

    // Hitbox bounds for collision
    this.bounds = {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  reset() {
    this.health = 660;
    this.particles = [];
    this.screenShake = 0;
  }

  takeDamage(amount, impactX, impactY) {
    if (this.health <= 0) return false;

    const actualDamage = Math.max(1, Math.min(10, Math.ceil(amount * 0.4)));
    this.health = Math.max(0, this.health - actualDamage);
    this.screenShake = Math.min(14, actualDamage * 2.2);

    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: impactX || (this.x + this.width / 2),
        y: impactY || (this.y + this.height / 2),
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color: Math.random() > 0.3 ? '#fbbf24' : '#ef4444',
        size: 3 + Math.random() * 4,
        type: 'spark'
      });
    }

    if (this.health === 0) {
      window.soundEngine.playCarWreck();
    } else {
      window.soundEngine.playImpact(0.8, true);
    }

    return true;
  }

  update() {
    if (this.screenShake > 0) {
      this.screenShake *= 0.84;
      if (this.screenShake < 0.2) this.screenShake = 0;
    }

    const healthRatio = this.health / this.maxHealth;
    if (healthRatio < 0.65 && Math.random() < (1.0 - healthRatio) * 0.4) {
      this.particles.push({
        x: this.x + this.width * 0.72 + (Math.random() - 0.5) * 35,
        y: this.y + this.height * 0.5 + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1.2,
        life: 1.0,
        color: healthRatio < 0.25 ? (Math.random() > 0.5 ? '#f97316' : '#1e293b') : '#64748b',
        size: healthRatio < 0.25 ? 8 + Math.random() * 10 : 5 + Math.random() * 6,
        type: 'smoke'
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();

    if (this.screenShake > 0) {
      const dx = (Math.random() - 0.5) * this.screenShake;
      const dy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(dx, dy);
    }

    const x = this.x;
    const y = this.y;
    const w = this.width;
    const h = this.height;
    const healthRatio = this.health / this.maxHealth;

    // 1. CAR DROP SHADOW (TOP-DOWN)
    ctx.beginPath();
    ctx.roundRect(x - 12, y + 10, w + 24, h + 16, 28);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fill();

    // 2. RENDER LOCKED ASPECT RATIO SPRITE
    const centerX = x + w / 2;
    const centerY = y + h / 2;

    if (this.imageLoaded) {
      ctx.save();
      ctx.translate(centerX, centerY);
      // Rotate 90 degrees so hood points to the right
      ctx.rotate(Math.PI / 2);

      // Draw with exact aspect ratio dimensions (swapping w & h for 90deg rotation)
      ctx.drawImage(this.carImage, -h / 2, -w / 2, h, w);

      // Damage tint overlay
      if (healthRatio < 0.5) {
        ctx.fillStyle = healthRatio < 0.25 ? 'rgba(30, 10, 10, 0.65)' : 'rgba(100, 20, 20, 0.35)';
        ctx.fillRect(-h / 2, -w / 2, h, w);
      }

      ctx.restore();
    } else {
      // Fallback
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
    }

    // 3. DAMAGE OVERLAYS
    if (healthRatio < 0.75) {
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.62, y + h * 0.3);
      ctx.lineTo(x + w * 0.68, y + h * 0.5);
      ctx.lineTo(x + w * 0.64, y + h * 0.7);
      ctx.stroke();
    }

    if (healthRatio < 0.5) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.75, y + h * 0.25);
      ctx.lineTo(x + w * 0.88, y + h * 0.55);
      ctx.stroke();
    }

    if (healthRatio < 0.25) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.arc(x + w * 0.55, y + h * 0.5, h * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    // PARTICLES
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    ctx.restore();
  }
}

window.GarageCar = GarageCar;
