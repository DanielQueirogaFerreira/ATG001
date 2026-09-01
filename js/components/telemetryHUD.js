/**
 * QUANTUM NEXUS - REAL-TIME TELEMETRY & SYSTEM HUD METRICS
 * High-precision performance monitors, FPS counters & system state telemetry
 */

class TelemetryHUD {
  constructor() {
    this.fpsEl = document.getElementById('fps-metric-val');
    this.particlesEl = document.getElementById('particles-metric-val');
    this.energyEl = document.getElementById('energy-metric-val');
    this.stateEl = document.getElementById('state-metric-val');

    this.frameCount = 0;
    this.lastTime = performance.now();
    this.currentFps = 60;

    this.init();
  }

  init() {
    // Dynamic cognitive state cycle
    const states = ['NEURAL_OVERCLOCK', 'GRAVITATIONAL_EQUILIBRIUM', 'HARMONIC_RESONANCE', 'PARALLEL_EXECUTION'];
    let stateIdx = 0;

    setInterval(() => {
      stateIdx = (stateIdx + 1) % states.length;
      if (this.stateEl) {
        this.stateEl.textContent = states[stateIdx];
      }
    }, 4500);
  }

  update(particleCount = 1200, audioEnergy = 0) {
    this.frameCount++;
    const now = performance.now();
    const delta = now - this.lastTime;

    if (delta >= 500) {
      this.currentFps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = now;

      if (this.fpsEl) {
        this.fpsEl.textContent = `${this.currentFps} FPS`;
        this.fpsEl.style.color = this.currentFps >= 55 ? 'var(--neon-emerald)' : 'var(--neon-amber)';
      }
    }

    if (this.particlesEl) {
      this.particlesEl.textContent = particleCount;
    }

    if (this.energyEl) {
      const pct = Math.round(audioEnergy * 100);
      this.energyEl.textContent = `${pct}%`;
    }
  }
}

window.QuantumTelemetry = new TelemetryHUD();
