/* Junk Catalog, Offscreen Sprite Pre-rendering & Sleep State Engine for Garage War */

// Global Offscreen Canvas Cache for Hardware-Accelerated GPU Rendering
const JunkSpriteCache = {
  cache: new Map(),

  getSprite(typeIndex, owner, isGlow) {
    const key = `${typeIndex}_${owner}_${isGlow ? 'glow' : 'normal'}`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const type = JUNK_TYPES[typeIndex] || JUNK_TYPES[0];
    const baseR = type.radius;
    const canvas = document.createElement('canvas');
    const size = Math.ceil((baseR + 18) * 2);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const cx = size / 2;
    const cy = size / 2;

    ctx.save();
    ctx.translate(cx, cy);

    // Color Theme
    let mainColor = '#94a3b8'; // Neutral
    let glowColor = '#a855f7';
    if (owner === 'mom') {
      mainColor = '#ffd700'; // Very Gold
      glowColor = '#ffd700';
    } else if (owner === 'ernest') {
      mainColor = '#00d2ff'; // Very Blue
      glowColor = '#00d2ff';
    }

    // Glowing Aura
    if (isGlow) {
      ctx.beginPath();
      ctx.arc(0, 0, baseR + 5, 0, Math.PI * 2);
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, baseR + 8, 0, Math.PI * 2);
      ctx.fillStyle = owner === 'mom' ? 'rgba(255, 215, 0, 0.25)' : (owner === 'ernest' ? 'rgba(0, 210, 255, 0.25)' : 'rgba(168, 85, 247, 0.25)');
      ctx.fill();
    }

    // Item Body Fill
    ctx.beginPath();
    ctx.arc(0, 0, baseR, 0, Math.PI * 2);
    ctx.fillStyle = mainColor;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Emoji Icon
    ctx.font = `${Math.round(baseR * 1.25)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(type.icon, 0, 2);

    ctx.restore();

    this.cache.set(key, canvas);
    return canvas;
  }
};

const JUNK_TYPES = [
  { name: 'Wrench', icon: '🔧', radius: 14, mass: 0.8 },
  { name: 'Old Boot', icon: '🥾', radius: 16, mass: 1.0 },
  { name: 'Oil Can', icon: '🛢️', radius: 18, mass: 1.4 },
  { name: 'Spare Tire', icon: '🛞', radius: 22, mass: 2.0 },
  { name: 'Toolbox', icon: '🧰', radius: 24, mass: 2.5 },
  { name: 'Battery', icon: '🔋', radius: 20, mass: 2.2 },
  { name: 'Rusty Muffler', icon: '🛠️', radius: 21, mass: 1.8 },
  { name: 'Washing Machine', icon: '🧺', radius: 28, mass: 3.8 },
  { name: 'Engine Block', icon: '⚙️', radius: 30, mass: 4.5 },
  { name: 'Heavy Anvil', icon: '⚓', radius: 27, mass: 4.2 },
  { name: 'Cardboard Box', icon: '📦', radius: 19, mass: 1.1 },
  { name: 'Trash Can Lid', icon: '🗑️', radius: 23, mass: 1.6 }
];

class JunkItem {
  constructor(x, y, owner = 'neutral', typeIndex = null) {
    this.x = x;
    this.y = y;
    this.owner = owner; // 'mom', 'ernest', or 'neutral'

    this.typeIndex = typeIndex !== null ? typeIndex : Math.floor(Math.random() * JUNK_TYPES.length);
    const typeDef = JUNK_TYPES[this.typeIndex];

    // Wide Size Variations (0.45x to 2.1x)
    this.scale = 0.45 + Math.random() * 1.65;
    this.baseRadius = typeDef.radius;
    this.radius = Math.max(10, typeDef.radius * this.scale);
    this.mass = typeDef.mass * (this.scale * this.scale);

    this.vx = 0;
    this.vy = 0;
    this.angle = Math.random() * Math.PI * 2;
    this.vAngle = 0;

    // 3D Simulated Flight Altitude Height
    this.flightZ = 0;
    this.vz = 0;
    this.gravityZ = -0.7;

    // Physics Sleep State Engine for Zero-Lag Unlimited Items
    this.isSleeping = false;
    this.sleepTimer = 0;
  }

  wakeUp() {
    this.isSleeping = false;
    this.sleepTimer = 0;
  }

  update(dt) {
    if (this.isSleeping) return;

    // Simulate 3D Altitude Bounce
    if (this.flightZ > 0 || this.vz !== 0) {
      this.flightZ += this.vz;
      this.vz += this.gravityZ;

      if (this.flightZ <= 0) {
        this.flightZ = 0;
        this.vz = -this.vz * 0.45; // Height dampening bounce
        if (Math.abs(this.vz) < 1.0) this.vz = 0;
      }
    }

    // Ground Movement & Friction
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.vAngle;

    const friction = 0.982;
    this.vx *= friction;
    this.vy *= friction;
    this.vAngle *= 0.96;

    // Sleep Detection: Put item to sleep if velocity is near zero
    const speedSq = this.vx * this.vx + this.vy * this.vy;
    if (speedSq < 0.008 && Math.abs(this.vAngle) < 0.005 && this.flightZ === 0) {
      this.sleepTimer += dt;
      if (this.sleepTimer > 0.4) {
        this.isSleeping = true;
        this.vx = 0;
        this.vy = 0;
        this.vAngle = 0;
      }
    } else {
      this.sleepTimer = 0;
    }
  }

  draw(ctx, isEndGame = false) {
    ctx.save();
    
    // Draw Ground Drop Shadow when airborne
    if (this.flightZ > 2) {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + 6, this.radius * 0.9, this.radius * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();
    }

    const drawX = this.x;
    const drawY = this.y - this.flightZ;

    ctx.translate(drawX, drawY);
    ctx.rotate(this.angle);
    ctx.scale(this.scale, this.scale); // SCALE SPRITE CANVAS BY ITEM SCALE (0.45x - 2.1x)

    // Hardware-Accelerated Offscreen Sprite Canvas Draw Call (Instant GPU Rendering)
    const cachedCanvas = JunkSpriteCache.getSprite(this.typeIndex, this.owner, isEndGame);
    const halfSize = cachedCanvas.width / 2;
    
    ctx.drawImage(cachedCanvas, -halfSize, -halfSize);

    ctx.restore();
  }
}

window.JunkItem = JunkItem;
