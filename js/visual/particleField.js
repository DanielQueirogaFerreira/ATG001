/**
 * QUANTUM NEXUS - QUANTUM PARTICLE PHYSICS FIELD
 * High-performance 2D particle simulation with Global Power State,
 * Pure Gravitational Attraction & Repulsion mechanics, Hold-to-Charge Mega Attraction Wells,
 * Cursor Force Auras, Persistent gravitational beacons, and full touch support.
 */

class ParticleField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 1000;
    this.mode = 'quantum'; // 'quantum' | 'singularity' | 'neural' | 'vortex' | 'audio'
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Global Power State
    this.isPoweredOn = true;
    this.powerTransitionAlpha = 1.0;

    // Force Physics State ('repel' | 'attract' | 'dual')
    this.forceType = 'attract'; // Default to attract so user immediately sees it!

    // Persistent Gravitational / Anti-Gravity Beacons
    this.beacons = [];

    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      isHovering: false,
      isDown: false,
      downStartTime: 0,
      baseRadius: 280,
      radius: 280
    };

    this.shockwaves = [];
    this.colorPalettes = {
      quantum: ['#00f3ff', '#38bdf8', '#a855f7', '#ff007f'],
      singularity: ['#ff007f', '#a855f7', '#ffb703', '#ffffff'],
      neural: ['#00ff88', '#00f3ff', '#38bdf8', '#ffffff'],
      vortex: ['#a855f7', '#00f3ff', '#ff007f', '#ffb703'],
      audio: ['#00f3ff', '#00ff88', '#ffb703', '#ff007f']
    };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.spawnParticles();
    this.bindEvents();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  spawnParticles() {
    this.particles = [];
    const colors = this.colorPalettes[this.mode];

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        originX: Math.random() * this.width,
        originY: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2.2 + 0.8,
        baseRadius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        orbitRadius: Math.random() * Math.min(this.width, this.height) * 0.45
      });
    }
  }

  setPowerState(isOn) {
    this.isPoweredOn = isOn;
  }

  setForceType(type) {
    if (['repel', 'attract', 'dual'].includes(type)) {
      this.forceType = type;
    }
  }

  setMode(newMode) {
    if (this.colorPalettes[newMode]) {
      this.mode = newMode;
      const colors = this.colorPalettes[newMode];
      this.particles.forEach(p => {
        p.color = colors[Math.floor(Math.random() * colors.length)];
      });
    }
  }

  setParticleCount(count) {
    this.particleCount = count;
    this.spawnParticles();
  }

  addBeacon(x, y, type = 'attractor') {
    this.beacons.push({
      x,
      y,
      type, // 'attractor' (pulls) or 'repulsor' (pushes)
      radius: 20,
      pulse: 0,
      strength: type === 'attractor' ? 8.0 : 8.0,
      color: type === 'attractor' ? '#a855f7' : '#00f3ff'
    });

    if (window.QuantumSonification) {
      window.QuantumSonification.playBeaconDrop(type);
    }
  }

  clearBeacons() {
    this.beacons = [];
    if (window.QuantumSonification) {
      window.QuantumSonification.playClick();
    }
  }

  addWave(x, y, type = 'implosion', power = 1.0) {
    this.shockwaves.push({
      x,
      y,
      type, // 'implosion' (pulls) or 'explosion' (pushes)
      radius: type === 'implosion' ? 300 * power : 5,
      targetRadius: type === 'implosion' ? 5 : 380 * power,
      speed: 16 * power,
      alpha: 1.0,
      power
    });

    if (window.QuantumSonification) {
      window.QuantumSonification.playGravitationalShockwave(power);
    }
  }

  bindEvents() {
    // Mouse tracking across window
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isHovering = true;
    });

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, input, select, a, .seq-cell, .theremin-pad-wrapper, .card-header')) {
        return;
      }

      if (e.button === 0) { // Left click = hold to charge force field
        this.mouse.isDown = true;
        this.mouse.downStartTime = performance.now();
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      } else if (e.button === 2) { // Right click = place beacon
        e.preventDefault();
        const type = this.forceType === 'attract' ? 'attractor' : 'repulsor';
        this.addBeacon(e.clientX, e.clientY, type);
      }
    });

    window.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('input, textarea')) {
        e.preventDefault();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.mouse.isDown) {
        const holdDuration = (performance.now() - this.mouse.downStartTime) / 1000;
        if (holdDuration > 0.4) {
          const power = Math.min(Math.max(holdDuration * 1.5, 0.8), 2.8);
          // In attraction mode, release an inward gravitational implosion; in repel mode release explosion
          const waveType = this.forceType === 'attract' ? 'implosion' : 'explosion';
          this.addWave(this.mouse.x, this.mouse.y, waveType, power);
        }
        this.mouse.isDown = false;
      }
    });

    // Mobile / Smartphone Touch Support
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (e.target.closest('button, input, select, a, .seq-cell, .theremin-pad-wrapper, .card-header')) {
          return;
        }
        this.mouse.x = touch.clientX;
        this.mouse.y = touch.clientY;
        this.mouse.isDown = true;
        this.mouse.isHovering = true;
        this.mouse.downStartTime = performance.now();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.mouse.x = touch.clientX;
        this.mouse.y = touch.clientY;
        this.mouse.isHovering = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (this.mouse.isDown) {
        const holdDuration = (performance.now() - this.mouse.downStartTime) / 1000;
        if (holdDuration > 0.4) {
          const power = Math.min(Math.max(holdDuration * 1.5, 0.8), 2.8);
          const waveType = this.forceType === 'attract' ? 'implosion' : 'explosion';
          this.addWave(this.mouse.x, this.mouse.y, waveType, power);
        }
        this.mouse.isDown = false;
      }
    }, { passive: true });
  }

  update(audioData) {
    // Smooth power state transition
    const targetAlpha = this.isPoweredOn ? 1.0 : 0.08;
    this.powerTransitionAlpha += (targetAlpha - this.powerTransitionAlpha) * 0.08;

    // Average audio energy for audio reactivity
    let audioEnergy = 0;
    if (this.isPoweredOn && audioData && audioData.length > 0) {
      let sum = 0;
      for (let i = 0; i < audioData.length; i++) {
        sum += audioData[i];
      }
      audioEnergy = (sum / audioData.length) / 255;
    }

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Calculate Hold Power Multiplier
    let holdDuration = 0;
    let holdMultiplier = 1.0;
    if (this.mouse.isDown) {
      holdDuration = (performance.now() - this.mouse.downStartTime) / 1000;
      holdMultiplier = 1.0 + Math.min(holdDuration * 3.5, 6.0); // Up to 7x power when holding!
      this.mouse.radius = this.mouse.baseRadius * (1.0 + Math.min(holdDuration * 1.2, 2.2)); // Expands up to 600px+
    } else {
      this.mouse.radius += (this.mouse.baseRadius - this.mouse.radius) * 0.1;
    }

    // Update Shockwaves / Implosions
    for (let s = this.shockwaves.length - 1; s >= 0; s--) {
      const sw = this.shockwaves[s];
      if (sw.type === 'implosion') {
        sw.radius -= sw.speed;
        sw.alpha = sw.radius / (300 * sw.power);
        if (sw.radius <= 10 || sw.alpha <= 0) {
          this.shockwaves.splice(s, 1);
        }
      } else {
        sw.radius += sw.speed;
        sw.alpha = 1.0 - (sw.radius / sw.targetRadius);
        if (sw.radius >= sw.targetRadius || sw.alpha <= 0) {
          this.shockwaves.splice(s, 1);
        }
      }
    }

    // Update Beacons pulse animation
    for (let b = 0; b < this.beacons.length; b++) {
      this.beacons[b].pulse = (this.beacons[b].pulse + 0.06) % (Math.PI * 2);
    }

    // Particle Physics Loop
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // If powered off: slow to cryogenic drift
      if (!this.isPoweredOn) {
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx + (Math.random() - 0.5) * 0.1;
        p.y += p.vy + (Math.random() - 0.5) * 0.1;
        continue;
      }

      // Audio reactive size boost
      p.radius = p.baseRadius * (1 + audioEnergy * 2.2);

      // Distance to Mouse
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Apply Persistent Beacons Forces
      for (let b = 0; b < this.beacons.length; b++) {
        const beacon = this.beacons[b];
        const bdx = beacon.x - p.x;
        const bdy = beacon.y - p.y;
        const bdist = Math.sqrt(bdx * bdx + bdy * bdy);

        if (beacon.type === 'attractor') {
          // Pure Attraction & Swirl
          if (bdist > 8) {
            const pull = Math.min((beacon.strength * 220) / (bdist * bdist + 100), 5.5);
            p.vx += (bdx / bdist) * pull;
            p.vy += (bdy / bdist) * pull;
            p.vx += (-bdy / bdist) * 1.5;
            p.vy += (bdx / bdist) * 1.5;
          }
        } else {
          // Repulsor
          if (bdist < 280) {
            const push = (1 - bdist / 280) * beacon.strength * 2.8;
            p.vx -= (bdx / (bdist || 1)) * push;
            p.vy -= (bdy / (bdist || 1)) * push;
          }
        }
      }

      // Shockwave / Implosion Forces
      for (let s = 0; s < this.shockwaves.length; s++) {
        const sw = this.shockwaves[s];
        const swDx = p.x - sw.x;
        const swDy = p.y - sw.y;
        const swDist = Math.sqrt(swDx * swDx + swDy * swDy);
        const waveDiff = Math.abs(swDist - sw.radius);

        if (waveDiff < 50) {
          const force = (1 - waveDiff / 50) * 25 * sw.power;
          if (sw.type === 'implosion') {
            // Sucks particles inward toward center!
            p.vx -= (swDx / (swDist || 1)) * force;
            p.vy -= (swDy / (swDist || 1)) * force;
          } else {
            // Pushes particles outward
            p.vx += (swDx / (swDist || 1)) * force;
            p.vy += (swDy / (swDist || 1)) * force;
          }
        }
      }

      // =========================================================================
      // CURSOR FORCE FIELD: PURE ATTRACTION VS REPULSION VS DUAL POLE
      // =========================================================================
      if (dist < this.mouse.radius && dist > 1) {
        const forceFactor = (1 - dist / this.mouse.radius);

        if (this.forceType === 'attract') {
          // PURE STRONG INWARD GRAVITATIONAL SUCTION
          // Gravitational pull is directed STRAIGHT TO CURSOR (dx, dy)
          const basePull = forceFactor * 14.0 * holdMultiplier;
          p.vx += (dx / dist) * basePull;
          p.vy += (dy / dist) * basePull;

          // Add orbital vortex spin so particles create a beautiful galaxy disc around cursor
          const spinSpeed = 4.0 * holdMultiplier;
          p.vx += (-dy / dist) * spinSpeed;
          p.vy += (dx / dist) * spinSpeed;

          // When particle gets very close to cursor (<50px), dampen outward speed so it orbits tightly
          if (dist < 50) {
            p.vx *= 0.85;
            p.vy *= 0.85;
          }

        } else if (this.forceType === 'dual') {
          // Dual Pole: Left attracts, Right repels
          const isLeft = p.x < this.mouse.x;
          if (isLeft) {
            const pull = forceFactor * 12.0 * holdMultiplier;
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;
            p.vx += (-dy / dist) * 3.0;
            p.vy += (dx / dist) * 3.0;
          } else {
            const push = forceFactor * 14.0 * holdMultiplier;
            p.vx -= (dx / dist) * push;
            p.vy -= (dy / dist) * push;
          }

        } else {
          // Pure Repulsion Shield: pushes AWAY from cursor (-dx, -dy)
          const repelForce = forceFactor * 16.0 * holdMultiplier;
          p.vx -= (dx / dist) * repelForce;
          p.vy -= (dy / dist) * repelForce;
        }
      }

      // Physics Modes
      if (this.mode === 'singularity') {
        const targetX = this.mouse.isDown ? this.mouse.x : centerX;
        const targetY = this.mouse.isDown ? this.mouse.y : centerY;
        const tdx = targetX - p.x;
        const tdy = targetY - p.y;
        const tdist = Math.sqrt(tdx * tdx + tdy * tdy);

        const gravity = Math.min(800 / (tdist * tdist + 120), 4.0);
        p.vx += (tdx / (tdist || 1)) * gravity;
        p.vy += (tdy / (tdist || 1)) * gravity;
        p.vx += (-tdy / (tdist || 1)) * 2.0;
        p.vy += (tdx / (tdist || 1)) * 2.0;

      } else if (this.mode === 'vortex') {
        p.angle += p.angularSpeed * (1 + audioEnergy * 2);
        const targetX = centerX + Math.cos(p.angle) * p.orbitRadius;
        const targetY = centerY + Math.sin(p.angle) * p.orbitRadius;
        p.vx += (targetX - p.x) * 0.04;
        p.vy += (targetY - p.y) * 0.04;

      } else if (this.mode === 'neural') {
        p.x += p.vx;
        p.y += p.vy;

      } else {
        // Ambient drift
        p.vx += (Math.random() - 0.5) * 0.15;
        p.vy += (Math.random() - 0.5) * 0.15;
      }

      // Apply drag / friction (smooth orbital dampening)
      p.vx *= 0.92;
      p.vy *= 0.92;

      // Integrate position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap-around screen boundaries
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // If powered off: render dormant standby matrix
    if (this.powerTransitionAlpha < 0.3) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(255, 183, 3, 0.04)';
      this.ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < this.width; x += step) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }
      for (let y = 0; y < this.height; y += step) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    // Render Persistent Beacons
    for (let b = 0; b < this.beacons.length; b++) {
      const beacon = this.beacons[b];
      const pulseSize = Math.sin(beacon.pulse) * 6;

      this.ctx.save();
      // Outer glow field
      this.ctx.beginPath();
      this.ctx.arc(beacon.x, beacon.y, beacon.radius + pulseSize + 14, 0, Math.PI * 2);
      this.ctx.fillStyle = beacon.type === 'attractor' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0, 243, 255, 0.2)';
      this.ctx.fill();

      // Orbital boundary ring
      this.ctx.beginPath();
      this.ctx.arc(beacon.x, beacon.y, beacon.radius + pulseSize, 0, Math.PI * 2);
      this.ctx.strokeStyle = beacon.color;
      this.ctx.lineWidth = 2.5;
      this.ctx.shadowColor = beacon.color;
      this.ctx.shadowBlur = 20;
      this.ctx.stroke();

      // Core singularity/repulsor dot
      this.ctx.beginPath();
      this.ctx.arc(beacon.x, beacon.y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();

      // Label tag
      this.ctx.font = '9px "JetBrains Mono", monospace';
      this.ctx.fillStyle = beacon.color;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(beacon.type.toUpperCase(), beacon.x, beacon.y + beacon.radius + 22);
      this.ctx.restore();
    }

    // Render Active Cursor Force Field Aura & Mega Gravity Well
    if (this.isPoweredOn && this.mouse.isHovering) {
      this.ctx.save();
      const auraColor = this.forceType === 'attract' ? '#a855f7' : (this.forceType === 'dual' ? '#00ff88' : '#00f3ff');
      const pulse = Math.sin(performance.now() * 0.006) * 10;
      const holdCharge = this.mouse.isDown ? Math.min((performance.now() - this.mouse.downStartTime) / 1000, 3.0) : 0;

      // Outer Gravitational Field Radius Ring
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius + pulse, 0, Math.PI * 2);
      this.ctx.strokeStyle = auraColor;
      this.ctx.lineWidth = this.mouse.isDown ? 2.5 : 1;
      this.ctx.globalAlpha = this.mouse.isDown ? 0.6 : 0.25;
      this.ctx.shadowColor = auraColor;
      this.ctx.shadowBlur = 20;
      this.ctx.stroke();
      this.ctx.globalAlpha = 1.0;

      // Inner Core Aura Ring
      this.ctx.beginPath();
      const coreRadius = 24 + holdCharge * 25 + pulse * 0.5;
      this.ctx.arc(this.mouse.x, this.mouse.y, coreRadius, 0, Math.PI * 2);
      this.ctx.strokeStyle = auraColor;
      this.ctx.lineWidth = this.mouse.isDown ? 4 : 2;
      this.ctx.shadowColor = auraColor;
      this.ctx.shadowBlur = 25;
      this.ctx.stroke();

      // If Attracting & Holding: Draw swirling gravitational vortex spokes
      if (this.forceType === 'attract' && this.mouse.isDown) {
        const time = performance.now() * 0.004;
        for (let k = 0; k < 4; k++) {
          const angle = time + (k * Math.PI / 2);
          const startR = coreRadius + 10;
          const endR = this.mouse.radius * 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(this.mouse.x + Math.cos(angle) * startR, this.mouse.y + Math.sin(angle) * startR);
          this.ctx.lineTo(this.mouse.x + Math.cos(angle + 0.8) * endR, this.mouse.y + Math.sin(angle + 0.8) * endR);
          this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
        }
      }

      // Center Core Dot / Singularity Eye
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.isDown ? 8 : 4, 0, Math.PI * 2);
      this.ctx.fillStyle = this.mouse.isDown ? '#ffffff' : auraColor;
      this.ctx.shadowColor = '#ffffff';
      this.ctx.shadowBlur = 15;
      this.ctx.fill();

      // Force Mode Label Indicator
      this.ctx.font = 'bold 11px "Orbitron", sans-serif';
      this.ctx.fillStyle = auraColor;
      this.ctx.textAlign = 'center';
      const labelText = this.forceType === 'attract' 
        ? (this.mouse.isDown ? '⚡ MEGA ATTRACTION WELL' : '▼ ATTRACT') 
        : (this.forceType === 'dual' ? '☯ DUAL POLE' : (this.mouse.isDown ? '⚡ MEGA REPULSION' : '▲ REPEL'));
      this.ctx.fillText(labelText, this.mouse.x, this.mouse.y - (this.mouse.radius + 16));
      this.ctx.restore();
    }

    // Draw Shockwaves & Implosions
    for (let s = 0; s < this.shockwaves.length; s++) {
      const sw = this.shockwaves[s];
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      const waveColor = sw.type === 'implosion' ? 'rgba(168, 85, 247,' : 'rgba(0, 243, 255,';
      this.ctx.strokeStyle = `${waveColor} ${sw.alpha * 0.9})`;
      this.ctx.lineWidth = 4 * sw.power;
      this.ctx.shadowColor = sw.type === 'implosion' ? '#a855f7' : '#00f3ff';
      this.ctx.shadowBlur = 20;
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Connect Neural Lines if in 'neural' or 'quantum' mode
    if ((this.mode === 'neural' || this.mode === 'quantum') && this.isPoweredOn) {
      const maxConnectDist = this.mode === 'neural' ? 95 : 65;
      const maxLines = 180;
      let lineCount = 0;

      for (let i = 0; i < this.particles.length; i += 2) {
        if (lineCount > maxLines) break;
        for (let j = i + 1; j < this.particles.length; j += 3) {
          const p1 = this.particles[i];
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.35 * this.powerTransitionAlpha;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
            this.ctx.lineWidth = 0.7;
            this.ctx.stroke();
            lineCount++;
          }
        }
      }
    }

    // Render Particles
    this.ctx.globalAlpha = this.powerTransitionAlpha;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = this.isPoweredOn ? p.radius * 3.5 : 0;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;
  }
}

window.QuantumParticles = ParticleField;
