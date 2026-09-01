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

  playPowerDown() {
    if (!this.synth.isInitialized) return;
    const ctx = this.synth.ctx;
    if (ctx.state === 'suspended') return;

    const now = ctx.currentTime;
    // Descending reactor spin-down
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 1.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.synth.masterGain);

    osc.start(now);
    osc.stop(now + 1.35);
  }

  playPowerUp() {
    if (!this.synth.isInitialized) return;
    const ctx = this.synth.ctx;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const freqs = [130.81, 261.63, 392.00, 523.25, 659.25, 783.99]; // Power surge chord
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 0.4, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.6 + idx * 0.1);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(4000, now + 0.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.synth.masterGain);

      osc.start(now);
      osc.stop(now + 1.3);
    });
  }

  playBeaconDrop(type = 'attractor') {
    if (!this.synth.isInitialized || this.synth.isMuted) return;
    const ctx = this.synth.ctx;
    if (ctx.state === 'suspended') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type === 'attractor' ? 'sine' : 'triangle';
    const startFreq = type === 'attractor' ? 300 : 800;
    const endFreq = type === 'attractor' ? 880 : 200;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.2);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.synth.masterGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }
}

window.QuantumSonification = new UISonification(window.QuantumSynth);
