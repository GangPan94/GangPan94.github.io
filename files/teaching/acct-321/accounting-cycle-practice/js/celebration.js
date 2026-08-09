/* ============================================================ */
/*  ACCT 321 — Accounting Cycle Practice Tool                   */
/*  celebration.js — Trial balance success celebration         */
/*  Plays a Solitaire-style victory fanfare and launches        */
/*  a fireworks particle effect when the trial balance is      */
/*  balanced.                                                   */
/* ============================================================ */

var Celebration = Celebration || {};

/* --- Win sound: synthesized Solitaire-style fanfare --- */
Celebration.playWinSound = function () {
  try {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }
    var ctx = new AudioContext();

    /* Note frequencies (Hz) for a triumphant ascending arpeggio + fanfare */
    var notes = [
      { freq: 523.25, time: 0.00, dur: 0.12 }, /* C5  */
      { freq: 659.25, time: 0.12, dur: 0.12 }, /* E5  */
      { freq: 783.99, time: 0.24, dur: 0.12 }, /* G5  */
      { freq: 1046.50, time: 0.36, dur: 0.18 }, /* C6  */
      { freq: 783.99, time: 0.56, dur: 0.08 }, /* G5  */
      { freq: 1046.50, time: 0.66, dur: 0.08 }, /* C6  */
      { freq: 1318.51, time: 0.76, dur: 0.30 }  /* E6  (high, sustained) */
    ];

    var masterGain = ctx.createGain();
    masterGain.gain.value = 0.22;
    masterGain.connect(ctx.destination);

    notes.forEach(function (n) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.value = n.freq;

      /* Envelope: quick attack, gentle decay */
      var startTime = ctx.currentTime + n.time;
      var endTime = startTime + n.dur;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.5, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, endTime);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(endTime + 0.05);
    });

    /* Add a second voice (sine) one octave down for warmth */
    notes.forEach(function (n) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = n.freq / 2;

      var startTime = ctx.currentTime + n.time;
      var endTime = startTime + n.dur;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, endTime);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(endTime + 0.05);
    });
  } catch (e) {
    /* Audio context may be blocked by autoplay policy — silently ignore */
  }
};

/* --- Fireworks particle effect --- */
Celebration.launchFireworks = function () {
  var canvas = document.getElementById("celebration-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "celebration-canvas";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");

  var particles = [];
  var rockets = [];

  /* Color palettes for fireworks */
  var palettes = [
    ["#ff6b6b", "#feca57", "#ff9ff3"], /* warm  */
    ["#48dbfb", "#54a0ff", "#5f27cd"], /* cool  */
    ["#1dd1a1", "#10ac84", "#feca57"], /* green */
    ["#ee5253", "#f368e0", "#ff9f43"]  /* vibrant */
  ];

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* Launch a rocket from bottom that explodes at a random height */
  function launchRocket() {
    var targetY = randInt(120, canvas.height * 0.45);
    var startX = randInt(canvas.width * 0.15, canvas.width * 0.85);
    var palette = palettes[randInt(0, palettes.length - 1)];

    rockets.push({
      x: startX,
      y: canvas.height,
      vx: (randInt(-30, 30) / 100),
      vy: -(canvas.height - targetY) / 60,
      targetY: targetY,
      palette: palette,
      trail: []
    });
  }

  /* Explode a rocket into particles */
  function explode(rocket) {
    var count = randInt(50, 80);
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      var speed = 2 + Math.random() * 4;
      particles.push({
        x: rocket.x,
        y: rocket.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.008 + Math.random() * 0.012,
        color: rocket.palette[randInt(0, rocket.palette.length - 1)],
        size: 2 + Math.random() * 2
      });
    }
  }

  var frameCount = 0;
  var maxFrames = 360; /* ~6 seconds at 60fps */
  var rocketSchedule = [5, 30, 60, 95, 140, 190, 250]; /* staggered launches */

  function animate() {
    frameCount++;
    if (frameCount > maxFrames) {
      /* Fade out and clean up */
      canvas.style.opacity = Math.max(0, 1 - (frameCount - maxFrames) / 30);
      if (frameCount > maxFrames + 30) {
        canvas.remove();
        return;
      }
    }

    /* Clear canvas each frame so the trial balance stays visible behind the fireworks */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Launch rockets on schedule */
    if (rocketSchedule.indexOf(frameCount) !== -1) {
      launchRocket();
    }

    /* Update and draw rockets */
    for (var r = rockets.length - 1; r >= 0; r--) {
      var rocket = rockets[r];
      rocket.trail.push({ x: rocket.x, y: rocket.y });
      if (rocket.trail.length > 8) {
        rocket.trail.shift();
      }

      rocket.x += rocket.vx;
      rocket.y += rocket.vy;
      rocket.vy += 0.03; /* slight gravity */

      /* Draw rocket trail */
      for (var t = 0; t < rocket.trail.length; t++) {
        var trailPoint = rocket.trail[t];
        var alpha = t / rocket.trail.length;
        ctx.beginPath();
        ctx.arc(trailPoint.x, trailPoint.y, 2 * alpha, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 220, 150, " + alpha + ")";
        ctx.fill();
      }

      /* Check if rocket reached target height */
      if (rocket.y <= rocket.targetY || rocket.vy >= 0) {
        explode(rocket);
        rockets.splice(r, 1);
      }
    }

    /* Update and draw particles */
    for (var p = particles.length - 1; p >= 0; p--) {
      var particle = particles[p];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.04; /* gravity */
      particle.vx *= 0.99; /* air resistance */
      particle.life -= particle.decay;

      if (particle.life <= 0) {
        particles.splice(p, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(animate);
  }

  animate();
};

/* --- Trigger the full celebration --- */
Celebration.celebrate = function () {
  Celebration.playWinSound();
  /* Slight delay so the sound starts before the visual */
  setTimeout(Celebration.launchFireworks, 200);
};

/* ============================================================ */
/*  Grand Finale — bigger celebration after Phase 3.5 completes  */
/*  More fireworks, confetti rain, victory banner with final time */
/* ============================================================ */

/* --- Extended fanfare: longer, more triumphant than the base win sound --- */
Celebration.playGrandFanfare = function () {
  try {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) { return; }
    var ctx = new AudioContext();

    /* Two-phrase fanfare: ascending arpeggio → triumphant sustained chord */
    var notes = [
      /* Phrase 1: rapid ascending arpeggio */
      { freq: 523.25, time: 0.00, dur: 0.10 }, /* C5  */
      { freq: 659.25, time: 0.10, dur: 0.10 }, /* E5  */
      { freq: 783.99, time: 0.20, dur: 0.10 }, /* G5  */
      { freq: 1046.50, time: 0.30, dur: 0.15 }, /* C6  */
      { freq: 1318.51, time: 0.45, dur: 0.15 }, /* E6  */
      { freq: 1567.98, time: 0.60, dur: 0.20 }, /* G6  */
      /* Phrase 2: triumphant sustained chord stack */
      { freq: 523.25, time: 0.85, dur: 1.20 }, /* C5  (sustained) */
      { freq: 659.25, time: 0.85, dur: 1.20 }, /* E5  (sustained) */
      { freq: 783.99, time: 0.85, dur: 1.20 }, /* G5  (sustained) */
      { freq: 1046.50, time: 0.85, dur: 1.20 }, /* C6  (sustained) */
      /* Phrase 3: final sparkle */
      { freq: 1318.51, time: 2.10, dur: 0.15 }, /* E6  */
      { freq: 1567.98, time: 2.25, dur: 0.15 }, /* G6  */
      { freq: 2093.00, time: 2.40, dur: 0.40 }  /* C7  (high sparkle) */
    ];

    var masterGain = ctx.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(ctx.destination);

    notes.forEach(function (n) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.value = n.freq;

      var startTime = ctx.currentTime + n.time;
      var endTime = startTime + n.dur;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.5, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, endTime);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(endTime + 0.05);

      /* Add sine octave-down for warmth on sustained notes */
      if (n.dur >= 0.80) {
        var osc2 = ctx.createOscillator();
        var gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.value = n.freq / 2;
        gain2.gain.setValueAtTime(0, startTime);
        gain2.gain.linearRampToValueAtTime(0.22, startTime + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, endTime);
        osc2.connect(gain2);
        gain2.connect(masterGain);
        osc2.start(startTime);
        osc2.stop(endTime + 0.05);
      }
    });
  } catch (e) {
    /* Audio context may be blocked — silently ignore */
  }
};

/* --- Grand fireworks: more rockets, longer duration, bigger explosions --- */
Celebration.launchGrandFireworks = function () {
  var canvas = document.getElementById("celebration-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "celebration-canvas";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.opacity = 1;
  var ctx = canvas.getContext("2d");

  var particles = [];
  var rockets = [];
  var confetti = [];

  /* Extended color palettes */
  var palettes = [
    ["#ff6b6b", "#feca57", "#ff9ff3"],          /* warm       */
    ["#48dbfb", "#54a0ff", "#5f27cd"],          /* cool       */
    ["#1dd1a1", "#10ac84", "#feca57"],          /* green      */
    ["#ee5253", "#f368e0", "#ff9f43"],          /* vibrant    */
    ["#00d2d3", "#54a0ff", "#5f27cd"],          /* ocean      */
    ["#feca57", "#ff9f43", "#ee5253"],          /* sunset     */
    ["#1dd1a1", "#48dbfb", "#feca57"]           /* rainbow mix */
  ];

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function launchRocket() {
    var targetY = randInt(80, canvas.height * 0.40);
    var startX = randInt(canvas.width * 0.10, canvas.width * 0.90);
    var palette = palettes[randInt(0, palettes.length - 1)];

    rockets.push({
      x: startX,
      y: canvas.height,
      vx: (randInt(-40, 40) / 100),
      vy: -(canvas.height - targetY) / 50,
      targetY: targetY,
      palette: palette,
      trail: []
    });
  }

  function explode(rocket) {
    /* Bigger explosions: 80-120 particles vs 50-80 in the base */
    var count = randInt(80, 120);
    var burstType = Math.random();
    for (var i = 0; i < count; i++) {
      var angle, speed;
      if (burstType < 0.33) {
        /* Ring burst — even circular pattern */
        angle = (Math.PI * 2 * i) / count;
        speed = 3 + Math.random() * 2;
      } else if (burstType < 0.66) {
        /* Random scatter burst */
        angle = Math.random() * Math.PI * 2;
        speed = 2 + Math.random() * 5;
      } else {
        /* Double-ring burst — inner + outer */
        angle = (Math.PI * 2 * i) / count;
        speed = (i % 2 === 0) ? 2.5 + Math.random() : 4.5 + Math.random() * 2;
      }
      particles.push({
        x: rocket.x,
        y: rocket.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.006 + Math.random() * 0.010,
        color: rocket.palette[randInt(0, rocket.palette.length - 1)],
        size: 2 + Math.random() * 3
      });
    }
  }

  /* Confetti rain — rectangular pieces falling from the top */
  function spawnConfetti() {
    var count = 8;
    for (var i = 0; i < count; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        width: 6 + Math.random() * 6,
        height: 10 + Math.random() * 8,
        color: palettes[randInt(0, palettes.length - 1)][randInt(0, 2)],
        life: 1.0
      });
    }
  }

  var frameCount = 0;
  var maxFrames = 600; /* ~10 seconds at 60fps — nearly double the base */
  /* Dense rocket schedule: 20 launches across the duration */
  var rocketSchedule = [3, 15, 28, 42, 55, 70, 85, 100, 120, 140, 160, 180, 200, 220, 240, 260, 285, 310, 340, 375];

  function animate() {
    frameCount++;
    if (frameCount > maxFrames) {
      canvas.style.opacity = Math.max(0, 1 - (frameCount - maxFrames) / 40);
      if (frameCount > maxFrames + 40) {
        canvas.remove();
        return;
      }
    }

    /* Semi-transparent trail effect for richer visuals */
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Launch rockets on schedule */
    if (rocketSchedule.indexOf(frameCount) !== -1) {
      launchRocket();
    }

    /* Spawn confetti rain every 5 frames for the first 8 seconds */
    if (frameCount < 480 && frameCount % 5 === 0) {
      spawnConfetti();
    }

    /* Update and draw rockets */
    for (var r = rockets.length - 1; r >= 0; r--) {
      var rocket = rockets[r];
      rocket.trail.push({ x: rocket.x, y: rocket.y });
      if (rocket.trail.length > 12) {
        rocket.trail.shift();
      }

      rocket.x += rocket.vx;
      rocket.y += rocket.vy;
      rocket.vy += 0.03;

      for (var t = 0; t < rocket.trail.length; t++) {
        var trailPoint = rocket.trail[t];
        var alpha = t / rocket.trail.length;
        ctx.beginPath();
        ctx.arc(trailPoint.x, trailPoint.y, 2.5 * alpha, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 220, 150, " + alpha + ")";
        ctx.fill();
      }

      if (rocket.y <= rocket.targetY || rocket.vy >= 0) {
        explode(rocket);
        rockets.splice(r, 1);
      }
    }

    /* Update and draw particles */
    for (var p = particles.length - 1; p >= 0; p--) {
      var particle = particles[p];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.04;
      particle.vx *= 0.99;
      particle.life -= particle.decay;

      if (particle.life <= 0) {
        particles.splice(p, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* Update and draw confetti */
    for (var c = confetti.length - 1; c >= 0; c--) {
      var piece = confetti[c];
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vx *= 0.995;
      piece.rotation += piece.rotationSpeed;

      if (piece.y > canvas.height + 20) {
        confetti.splice(c, 1);
        continue;
      }

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.globalAlpha = Math.min(1, (canvas.height - piece.y) / 100 + 0.3);
      ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(animate);
  }

  animate();
};

/* --- Victory banner overlay with final time --- */
Celebration.showVictoryBanner = function (finalTime) {
  var banner = document.getElementById("we-victory-banner");
  if (banner) { banner.remove(); }

  banner = document.createElement("div");
  banner.id = "we-victory-banner";
  banner.innerHTML =
    '<div class="we-victory-inner">' +
      '<div class="we-victory-icon">&#127942;</div>' +
      '<div class="we-victory-title">Accounting Cycle Complete!</div>' +
      '<div class="we-victory-time">Final Time: <strong>' + finalTime + '</strong></div>' +
      '<div class="we-victory-subtitle">You have mastered all 6 phases of the accounting cycle</div>' +
    '</div>';
  document.body.appendChild(banner);

  /* Auto-remove after 6 seconds */
  setTimeout(function () {
    if (banner.parentNode) {
      banner.classList.add("we-victory-banner-out");
      setTimeout(function () {
        if (banner.parentNode) { banner.remove(); }
      }, 500);
    }
  }, 6000);
};

/* --- Trigger the grand finale --- */
Celebration.grandFinale = function (finalTime) {
  Celebration.playGrandFanfare();
  setTimeout(function () {
    Celebration.launchGrandFireworks();
  }, 200);
  /* Show the victory banner slightly after the fireworks start */
  setTimeout(function () {
    Celebration.showVictoryBanner(finalTime || "00:00");
  }, 800);
};