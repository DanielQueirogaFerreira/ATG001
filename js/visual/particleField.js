/**
 * QUANTUM NEXUS - QUANTUM PARTICLE PHYSICS FIELD
 * High-performance 2D/WebGL particle simulation with anti-gravity forces,
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

    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      isDown: false,
      downStartTime: 0,
      radius: 200,
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
      this.mouse.isDown = true;
      this.mouse.downStartTime = performance.now();
    });

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
    // Average audio energy for audio reactivity
    let audioEnergy = 0;
    if (audioData && audioData.length > 0) {
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

    // Particle Physics Loop
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Audio reactive size boost
      p.radius = p.baseRadius * (1 + audioEnergy * 2.2);

      // Distance to Mouse
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Distance to Center
      const cdx = centerX - p.x;
      const cdy = centerY - p.y;
      const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

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

      // Physics Modes
      if (this.mode === 'singularity') {
        // Gravitational Attraction towards center / mouse
        const targetX = this.mouse.isDown ? this.mouse.x : centerX;
        const targetY = this.mouse.isDown ? this.mouse.y : centerY;
        const tdx = targetX - p.x;
        const tdy = targetY - p.y;
        const tdist = Math.sqrt(tdx * tdx + tdy * tdy);

        const gravity = Math.min(600 / (tdist * tdist + 200), 2.5);
        p.vx += (tdx / (tdist || 1)) * gravity;
        p.vy += (tdy / (tdist || 1)) * gravity;

        // Tangential swirl
        p.vx += (-tdy / (tdist || 1)) * 1.4;
        p.vy += (tdx / (tdist || 1)) * 1.4;

      } else if (this.mode === 'vortex') {
        // Continuous Swirling Vortex
        p.angle += p.angularSpeed * (1 + audioEnergy * 2);
        const targetX = centerX + Math.cos(p.angle) * p.orbitRadius;
        const targetY = centerY + Math.sin(p.angle) * p.orbitRadius;
        p.vx += (targetX - p.x) * 0.03;
        p.vy += (targetY - p.y) * 0.03;

      } else if (this.mode === 'neural') {
        // Lattice spring physics
        p.x += p.vx;
        p.y += p.vy;

      } else {
        // Default 'quantum' / 'audio' anti-gravity mode
        // Anti-Gravity Repulsion from cursor
        if (dist < this.mouse.radius) {
          const repelForce = (1 - dist / this.mouse.radius) * (this.mouse.isDown ? 8.0 : 3.5);
          p.vx -= (dx / dist) * repelForce;
          p.vy -= (dy / dist) * repelForce;
        }

        // Ambient gentle drift
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
    if (this.mode === 'neural' || this.mode === 'quantum') {
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
            const alpha = (1 - dist / maxConnectDist) * 0.35;
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
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = p.radius * 3.5;
      this.ctx.fill();
    }
  }
}

window.QuantumParticles = ParticleField;
