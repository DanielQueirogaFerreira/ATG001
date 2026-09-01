/**
 * QUANTUM NEXUS - PROCEDURAL SYNTHESIZER ENGINE
 * Web Audio API Polyphonic Synthesizer, Harmonic Scaler & Filter Chain
 */

class SynthEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.delayNode = null;
    this.delayGain = null;
    this.isInitialized = false;
    this.isMuted = false;

    // Musical Scales (in MIDI / Frequency relations)
    this.scales = {
      lydian: [261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25], // C Lydian (Cyber-Ethereal)
      neotokyo: [261.63, 277.18, 349.23, 392.00, 415.30, 523.25],             // Insen / Neo-Tokyo
      pentatonic: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33],    // Major Pentatonic
      deepvoid: [130.81, 155.56, 174.61, 196.00, 233.08, 261.63],              // Dark Ambient Minor
      celestial: [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99]       // High Celestial
    };

    this.currentScale = 'lydian';
  }

  init() {
    if (this.isInitialized) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Output Chain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    // Spectrum Analyser Node for Visualizers
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.85;

    // Spatial Delay & Reverb Convolver Simulation
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.28, this.ctx.currentTime);
    this.delayGain = this.ctx.createGain();
    this.delayGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    // Feedback Loop
    this.delayNode.connect(this.delayGain);
    this.delayGain.connect(this.delayNode);
    this.delayGain.connect(this.masterGain);

    // Master Routing
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.isInitialized = true;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setScale(scaleName) {
    if (this.scales[scaleName]) {
      this.currentScale = scaleName;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.7;
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
    }
    return this.isMuted;
  }

  /**
   * Triggers a polyphonic synthesized note with harmonic timbre
   * @param {number} pitchIndex - Index in active scale or frequency in Hz
   * @param {number} duration - Note length in seconds
   * @param {number} pan - Stereo panning (-1 to 1)
   * @param {string} timbre - 'sine' | 'triangle' | 'sawtooth' | 'cyber'
   */
  playNote(pitchIndex, duration = 0.4, pan = 0, timbre = 'cyber') {
    if (!this.isInitialized || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const scale = this.scales[this.currentScale];
    const freq = typeof pitchIndex === 'number' && pitchIndex < scale.length 
      ? scale[pitchIndex] 
      : (typeof pitchIndex === 'number' ? pitchIndex : 440);

    const now = this.ctx.currentTime;

    // Voice Oscillator 1 (Primary Wave)
    const osc1 = this.ctx.createOscillator();
    osc1.type = timbre === 'cyber' ? 'sawtooth' : timbre;
    osc1.frequency.setValueAtTime(freq, now);

    // Voice Oscillator 2 (Harmonic Detune / FM)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.502, now); // Perfect fifth slight detune

    // Sub-Oscillator (Deep resonance)
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, now);

    // Dynamic Resonant Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 4, 8000), now);
    filter.frequency.exponentialRampToValueAtTime(200, now + duration);
    filter.Q.setValueAtTime(6.0, now);

    // Voice Amplitude Envelope (ADSR)
    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0.001, now);
    voiceGain.gain.linearRampToValueAtTime(0.35, now + 0.03); // Fast Attack
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Smooth Decay

    // Stereo Panner
    let panner;
    if (this.ctx.createStereoPanner) {
      panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
    }

    // Connect voice chain
    osc1.connect(filter);
    osc2.connect(filter);
    subOsc.connect(voiceGain);
    filter.connect(voiceGain);

    if (panner) {
      voiceGain.connect(panner);
      panner.connect(this.masterGain);
      panner.connect(this.delayNode);
    } else {
      voiceGain.connect(this.masterGain);
      voiceGain.connect(this.delayNode);
    }

    // Start & Stop Oscillators
    osc1.start(now);
    osc2.start(now);
    subOsc.start(now);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    subOsc.stop(now + duration + 0.1);
  }

  /**
   * Continuous Theremin Tone Generator
   */
  startContinuousTone() {
    if (!this.isInitialized || this.isMuted) return null;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);

    return {
      osc,
      filter,
      gain,
      update: (freq, filterCutoff, vol = 0.25) => {
        const t = this.ctx.currentTime;
        osc.frequency.setTargetAtTime(freq, t, 0.02);
        filter.frequency.setTargetAtTime(filterCutoff, t, 0.03);
        gain.gain.setTargetAtTime(vol, t, 0.02);
      },
      stop: () => {
        const t = this.ctx.currentTime;
        gain.gain.linearRampToValueAtTime(0.0001, t + 0.1);
        setTimeout(() => {
          try { osc.stop(); } catch(e) {}
        }, 120);
      }
    };
  }

  /**
   * Extracts real-time frequency data for visualizers
   */
  getFrequencyData() {
    if (!this.analyser) return new Uint8Array(32);
    const buffer = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(buffer);
    return buffer;
  }
}

window.QuantumSynth = new SynthEngine();
