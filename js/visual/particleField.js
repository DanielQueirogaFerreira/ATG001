/**
 * QUANTUM NEXUS - QUANTUM PARTICLE PHYSICS FIELD
 * High-performance 2D particle simulation with Global Power State,
 * Attraction & Repulsion mechanics, persistent gravitational beacons,
 * fluid vortices, singularity attractors & real-time audio FFT reactivity.
 */

class ParticleField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 1200;
    this.mode = 'quantum'; // 'quantum' | 'singularity' | 'neural' | 'vortex' | 'audio'
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Global Power State
    this.isPoweredOn = true;
    this.powerTransitionAlpha = 1.0;

    // Force Physics State ('repel' | 'attract' | 'dual')
    this.forceType = 'repel';

    // Persistent Gravitational / Anti-Gravity Beacons
    this.beacons = [];

    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      isDown: false,
      downStartTime: 0,
      radius: 220,
      forceMultiplier: 1.0
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
      radius: 18,
      pulse: 0,
      strength: type === 'attractor' ? 4.5 : 5.5,
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

  addShockwave(x, y, power = 1.0) {
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: 350 * power,
      speed: 16 * power,
      alpha: 1.0,
      power
    });

    if (window.QuantumSonification) {
      window.QuantumSonification.playGravitationalShockwave(power);
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Left click
        this.mouse.isDown = true;
        this.mouse.downStartTime = performance.now();
      } else if (e.button === 2) { // Right click = place beacon
        e.preventDefault();
        const type = this.forceType === 'attract' ? 'attractor' : 'repulsor';
        this.addBeacon(e.clientX, e.clientY, type);
      }
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('mouseup', (e) => {
      if (this.mouse.isDown) {
        const holdDuration = (performance.now() - this.mouse.downStartTime) / 1000;
        const power = Math.min(Math.max(holdDuration * 1.5, 0.6), 2.5);
        this.addShockwave(this.mouse.x, this.mouse.y, power);
        this.mouse.isDown = false;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
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

    // Update Shockwaves
    for (let s = this.shockwaves.length - 1; s >= 0; s--) {
      const sw = this.shockwaves[s];
      sw.radius += sw.speed;
      sw.alpha = 1.0 - (sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
        this.shockwaves.splice(s, 1);
      }
    }

    // Update Beacons pulse animation
    for (let b = 0; b < this.beacons.length; b++) {
      this.beacons[b].pulse = (this.beacons[b].pulse + 0.05) % (Math.PI * 2);
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
          // Gravitational Attraction & Orbit
          if (bdist > 10) {
            const pull = Math.min((beacon.strength * 120) / (bdist * bdist + 150), 3.0);
            p.vx += (bdx / bdist) * pull;
            p.vy += (bdy / bdist) * pull;
            // Orbital tangential velocity
            p.vx += (-bdy / bdist) * 0.8;
            p.vy += (bdx / bdist) * 0.8;
          }
        } else {
          // Anti-Gravity Repulsor
          if (bdist < 260) {
            const push = (1 - bdist / 260) * beacon.strength * 1.8;
            p.vx -= (bdx / (bdist || 1)) * push;
            p.vy -= (bdy / (bdist || 1)) * push;
          }
        }
      }

      // Shockwave Repulsion
      for (let s = 0; s < this.shockwaves.length; s++) {
        const sw = this.shockwaves[s];
        const swDx = p.x - sw.x;
        const swDy = p.y - sw.y;
        const swDist = Math.sqrt(swDx * swDx + swDy * swDy);
        const waveDiff = Math.abs(swDist - sw.radius);

        if (waveDiff < 40) {
          const force = (1 - waveDiff / 40) * 18 * sw.power;
          p.vx += (swDx / (swDist || 1)) * force;
          p.vy += (swDy / (swDist || 1)) * force;
        }
      }

      // Cursor Physics: Attraction vs Repulsion Mechanics
      if (dist < this.mouse.radius) {
        const forceFactor = (1 - dist / this.mouse.radius);

        if (this.forceType === 'attract') {
          // Inward Attraction Swirl
          const attractPull = forceFactor * (this.mouse.isDown ? 7.0 : 3.5);
          p.vx += (dx / dist) * attractPull;
          p.vy += (dy / dist) * attractPull;
          // Orbital rotation
          p.vx += (-dy / dist) * 1.6;
          p.vy += (dx / dist) * 1.6;

        } else if (this.forceType === 'dual') {
          // Left side attracts, right side repels (Dual Pole)
          const isLeft = p.x < this.mouse.x;
          const dualForce = forceFactor * 4.0;
          if (isLeft) {
            p.vx += (dx / dist) * dualForce;
            p.vy += (dy / dist) * dualForce;
          } else {
            p.vx -= (dx / dist) * dualForce;
            p.vy -= (dy / dist) * dualForce;
          }

        } else {
          // Default Repulsion
          const repelForce = forceFactor * (this.mouse.isDown ? 8.0 : 3.5);
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

        const gravity = Math.min(600 / (tdist * tdist + 200), 2.5);
        p.vx += (tdx / (tdist || 1)) * gravity;
        p.vy += (tdy / (tdist || 1)) * gravity;
        p.vx += (-tdy / (tdist || 1)) * 1.4;
        p.vy += (tdx / (tdist || 1)) * 1.4;

      } else if (this.mode === 'vortex') {
        p.angle += p.angularSpeed * (1 + audioEnergy * 2);
        const targetX = centerX + Math.cos(p.angle) * p.orbitRadius;
        const targetY = centerY + Math.sin(p.angle) * p.orbitRadius;
        p.vx += (targetX - p.x) * 0.03;
        p.vy += (targetY - p.y) * 0.03;

      } else if (this.mode === 'neural') {
        p.x += p.vx;
        p.y += p.vy;

      } else {
        // Ambient drift
        p.vx += (Math.random() - 0.5) * 0.2;
        p.vy += (Math.random() - 0.5) * 0.2;
      }

      // Apply drag / friction
      p.vx *= 0.94;
      p.vy *= 0.94;

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
      this.ctx.arc(beacon.x, beacon.y, beacon.radius + pulseSize + 12, 0, Math.PI * 2);
      this.ctx.fillStyle = beacon.type === 'attractor' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(0, 243, 255, 0.15)';
      this.ctx.fill();

      // Orbital boundary ring
      this.ctx.beginPath();
      this.ctx.arc(beacon.x, beacon.y, beacon.radius + pulseSize, 0, Math.PI * 2);
      this.ctx.strokeStyle = beacon.color;
      this.ctx.lineWidth = 2;
      this.ctx.shadowColor = beacon.color;
      this.ctx.shadowBlur = 18;
      this.ctx.stroke();

      // Core singularity/repulsor dot
      this.ctx.beginPath();
      this.ctx.arc(beacon.x, beacon.y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();

      // Label tag
      this.ctx.font = '8px "JetBrains Mono", monospace';
      this.ctx.fillStyle = beacon.color;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(beacon.type.toUpperCase(), beacon.x, beacon.y + beacon.radius + 20);
      this.ctx.restore();
    }

    // Draw Shockwaves
    for (let s = 0; s < this.shockwaves.length; s++) {
      const sw = this.shockwaves[s];
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(0, 243, 255, ${sw.alpha * 0.8})`;
      this.ctx.lineWidth = 4 * sw.power;
      this.ctx.shadowColor = '#00f3ff';
      this.ctx.shadowBlur = 15;
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
