/* Web Audio API Sound Synthesizer for Garage War */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.vacuumNode = null;
    this.vacuumGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playThrow(owner) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const freq = owner === 'mom' ? 320 : 260;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playImpact(intensity = 1, isCar = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Noise buffer for impact crunch
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = isCar ? 'bandpass' : 'lowpass';
    filter.frequency.value = isCar ? 1200 : 450;

    const gain = this.ctx.createGain();
    const vol = Math.min(0.5, 0.1 + intensity * 0.08);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  startVacuum() {
    if (this.muted || this.vacuumNode) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.vacuumNode = this.ctx.createBufferSource();
    this.vacuumNode.buffer = buffer;
    this.vacuumNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);

    // LFO for swirling vacuum effect
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 8;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(filter.frequency);
    lfo.start();

    this.vacuumGain = this.ctx.createGain();
    this.vacuumGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.vacuumGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.1);

    this.vacuumNode.connect(filter);
    filter.connect(this.vacuumGain);
    this.vacuumGain.connect(this.ctx.destination);

    this.vacuumNode.start();
  }

  stopVacuum() {
    if (this.vacuumGain && this.ctx) {
      this.vacuumGain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      setTimeout(() => {
        if (this.vacuumNode) {
          try { this.vacuumNode.stop(); } catch(e){}
          this.vacuumNode = null;
          this.vacuumGain = null;
        }
      }, 90);
    }
  }

  playPowerupSpawn() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playPowerupActivate() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.2, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.15);
    });
  }

  playCarWreck() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Heavy crash explosion
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.vacuumNode) {
      this.stopVacuum();
    }
    return this.muted;
  }
}

window.soundEngine = new SoundEngine();
