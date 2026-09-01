/**
 * QUANTUM NEXUS - UI SONIFICATION & TACTILE AUDIO FEEDBACK
 * High-precision micro-audio cues for interface interactions, gravity shocks & hover states
 */

class UISonification {
  constructor(synthEngine) {
    this.synth = synthEngine;
  }

  playHover() {
    if (!this.synth.isInitialized || this.synth.isMuted) return;
    const ctx = this.synth.ctx;
    if (ctx.state === 'suspended') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.04);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.synth.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playClick() {
    if (!this.synth.isInitialized || this.synth.isMuted) return;
    const ctx = this.synth.ctx;
    if (ctx.state === 'suspended') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.synth.masterGain);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  playModeSwitch() {
    if (!this.synth.isInitialized || this.synth.isMuted) return;
    const ctx = this.synth.ctx;
    if (ctx.state === 'suspended') return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // Quick ascending arpeggio
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.synth.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    });
  }

  playGravitationalShockwave(intensity = 1.0) {
    if (!this.synth.isInitialized || this.synth.isMuted) return;
    const ctx = this.synth.ctx;
    if (ctx.state === 'suspended') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 0.5);

    gain.gain.setValueAtTime(0.2 * intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.synth.masterGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }
}

window.QuantumSonification = new UISonification(window.QuantumSynth);
