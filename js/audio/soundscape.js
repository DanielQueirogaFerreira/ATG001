/**
 * QUANTUM NEXUS - GENERATIVE SOUNDSCAPE & AMBIENT DRONE ENGINE
 * Procedural harmonic drone clusters, binaural brainwave frequencies & chord evolver
 */

class SoundscapeEngine {
  constructor(synthEngine) {
    this.synth = synthEngine;
    this.isRunning = false;
    this.droneNodes = [];
    this.droneGain = null;
    this.binauralOscL = null;
    this.binauralOscR = null;
    this.binauralGain = null;
    this.progressionInterval = null;
    this.ambientChords = [
      [130.81, 196.00, 246.94, 329.63], // Cmaj9 ethereal
      [146.83, 220.00, 261.63, 369.99], // D6/9 floating
      [164.81, 246.94, 311.13, 392.00], // E min11 deep
      [174.61, 261.63, 329.63, 440.00]  // F maj7#11 quantum
    ];
    this.currentChordIndex = 0;
  }

  start() {
    if (this.isRunning || !this.synth.isInitialized) return;
    const ctx = this.synth.ctx;
    if (ctx.state === 'suspended') ctx.resume();

    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3.0);
    this.droneGain.connect(this.synth.masterGain);

    this.setupBinauralBeats(144.0, 10.0); // 10Hz Alpha Waves (Cognitive Flow State)
    this.playChord(this.ambientChords[0]);

    // Slowly evolve chord harmony every 12 seconds
    this.progressionInterval = setInterval(() => {
      this.currentChordIndex = (this.currentChordIndex + 1) % this.ambientChords.length;
      this.playChord(this.ambientChords[this.currentChordIndex]);
    }, 12000);

    this.isRunning = true;
  }

  stop() {
    if (!this.isRunning) return;
    const ctx = this.synth.ctx;
    if (this.droneGain) {
      this.droneGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
    }
    if (this.progressionInterval) clearInterval(this.progressionInterval);

    setTimeout(() => {
      this.droneNodes.forEach(node => {
        try { node.osc.stop(); } catch(e) {}
      });
      this.droneNodes = [];
      if (this.binauralOscL) {
        try { this.binauralOscL.stop(); } catch(e) {}
      }
      if (this.binauralOscR) {
        try { this.binauralOscR.stop(); } catch(e) {}
      }
      this.isRunning = false;
    }, 1600);
  }

  setupBinauralBeats(baseFreq = 150.0, beatDelta = 8.0) {
    const ctx = this.synth.ctx;
    const merger = ctx.createChannelMerger(2);

    this.binauralOscL = ctx.createOscillator();
    this.binauralOscR = ctx.createOscillator();
    this.binauralGain = ctx.createGain();
    this.binauralGain.gain.setValueAtTime(0.05, ctx.currentTime);

    this.binauralOscL.type = 'sine';
    this.binauralOscR.type = 'sine';

    this.binauralOscL.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    this.binauralOscR.frequency.setValueAtTime(baseFreq + beatDelta, ctx.currentTime);

    this.binauralOscL.connect(merger, 0, 0); // Left channel
    this.binauralOscR.connect(merger, 0, 1); // Right channel

    merger.connect(this.binauralGain);
    this.binauralGain.connect(this.synth.masterGain);

    this.binauralOscL.start();
    this.binauralOscR.start();
  }

  playChord(chordFreqs) {
    const ctx = this.synth.ctx;
    const now = ctx.currentTime;

    // Fade out previous drone notes
    this.droneNodes.forEach(node => {
      node.gain.gain.linearRampToValueAtTime(0.0001, now + 2.0);
      setTimeout(() => {
        try { node.osc.stop(); } catch(e) {}
      }, 2100);
    });
    this.droneNodes = [];

    // Spawn new harmonic cluster
    chordFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400 + i * 150, now);
      filter.Q.setValueAtTime(2.0, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.droneGain);

      osc.start(now);
      this.droneNodes.push({ osc, gain });
    });
  }

  setAtmosphereMode(mode) {
    if (!this.synth.isInitialized) return;
    if (mode === 'zenith') {
      this.ambientChords = [
        [220.0, 329.63, 440.0, 554.37],
        [246.94, 369.99, 493.88, 622.25]
      ];
    } else if (mode === 'singularity') {
      this.ambientChords = [
        [65.41, 98.00, 130.81, 164.81],
        [73.42, 110.00, 146.83, 174.61]
      ];
    } else {
      this.ambientChords = [
        [130.81, 196.00, 246.94, 329.63],
        [146.83, 220.00, 261.63, 369.99],
        [164.81, 246.94, 311.13, 392.00]
      ];
    }
  }
}

window.QuantumSoundscape = new SoundscapeEngine(window.QuantumSynth);
