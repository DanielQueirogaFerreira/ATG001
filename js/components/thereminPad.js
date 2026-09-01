/**
 * QUANTUM NEXUS - CONTINUOUS XY THEREMIN CONTROLLER
 * Tactile pitch / filter continuous ribbon pad for expressive multidimensional synthesis
 */

class ThereminPad {
  constructor(padId, synthEngine) {
    this.pad = document.getElementById(padId);
    this.synth = synthEngine;
    this.crosshair = this.pad ? this.pad.querySelector('.theremin-crosshair') : null;
    this.hint = this.pad ? this.pad.querySelector('.theremin-hint') : null;
    this.activeVoice = null;
    this.isInteracting = false;

    this.init();
  }

  init() {
    if (!this.pad) return;

    this.pad.addEventListener('mousedown', (e) => this.handleStart(e));
    window.addEventListener('mousemove', (e) => this.handleMove(e));
    window.addEventListener('mouseup', () => this.handleEnd());

    this.pad.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) this.handleStart(e.touches[0]);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (this.isInteracting && e.touches.length > 0) {
        this.handleMove(e.touches[0]);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => this.handleEnd());
  }

  handleStart(e) {
    this.isInteracting = true;
    if (this.hint) this.hint.style.display = 'none';
    if (this.crosshair) this.crosshair.style.display = 'block';

    if (this.synth.isInitialized) {
      this.activeVoice = this.synth.startContinuousTone();
    }
    this.updatePosition(e);
  }

  handleMove(e) {
    if (!this.isInteracting) return;
    this.updatePosition(e);
  }

  handleEnd() {
    if (!this.isInteracting) return;
    this.isInteracting = false;
    if (this.crosshair) this.crosshair.style.display = 'none';
    if (this.hint) this.hint.style.display = 'block';

    if (this.activeVoice) {
      this.activeVoice.stop();
      this.activeVoice = null;
    }
  }

  updatePosition(e) {
    const rect = this.pad.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const normX = x / rect.width;   // Frequency factor (100Hz -> 1800Hz)
    const normY = 1 - (y / rect.height); // Filter Cutoff factor (200Hz -> 6000Hz)

    if (this.crosshair) {
      this.crosshair.style.left = `${x}px`;
      this.crosshair.style.top = `${y}px`;
    }

    const freq = 120 + Math.pow(normX, 2) * 1400;
    const filterCutoff = 250 + Math.pow(normY, 2) * 5500;

    if (this.activeVoice) {
      this.activeVoice.update(freq, filterCutoff, 0.28);
    }

    // Agitate particles
    if (window.activeParticleField) {
      window.activeParticleField.mouse.x = window.innerWidth * normX;
      window.activeParticleField.mouse.y = window.innerHeight * (1 - normY);
    }
  }
}

window.QuantumThereminPad = ThereminPad;
