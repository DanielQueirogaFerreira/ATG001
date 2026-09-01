/**
 * QUANTUM NEXUS - MAIN APPLICATION ORCHESTRATOR
 * Lifecycle manager, 60 FPS animation loop coordinator, and multimodal event dispatcher
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Visual Simulation Layer
  const particleField = new window.QuantumParticles('simulation-viewport');
  window.activeParticleField = particleField;

  const singularityLens = new window.QuantumSingularityLens();
  const neuralGraph = new window.CognitiveNeuralGraph();
  const audioVisualizer = new window.QuantumAudioVisualizer('fft-spectrum-canvas', window.QuantumSynth);

  // 2. Initialize Cognitive & Audio Components
  const soundMatrix = new window.QuantumSoundMatrix('sequencer-matrix-root', window.QuantumSynth);
  const thereminPad = new window.QuantumThereminPad('theremin-pad-root', window.QuantumSynth);
  const agentMatrix = new window.QuantumAgentMatrix('agent-swarm-root');
  const generativeSandbox = new window.QuantumGenerativeSandbox('code-weaver-output');
  const modalController = new window.QuantumModalController();

  // 3. UI Controls & Event Listeners
  // Sensory Mode Tabs
  const modeTabs = document.querySelectorAll('.mode-tab-btn');
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.getAttribute('data-mode');
      modalController.switchMode(mode);
    });
  });

  // Scale Selector
  const scaleSelect = document.getElementById('scale-select');
  if (scaleSelect) {
    scaleSelect.addEventListener('change', (e) => {
      window.QuantumSynth.setScale(e.target.value);
      if (window.QuantumSonification) window.QuantumSonification.playClick();
    });
  }

  // Particle Density Slider
  const particleSlider = document.getElementById('particle-count-slider');
  if (particleSlider) {
    particleSlider.addEventListener('input', (e) => {
      const count = parseInt(e.target.value, 10);
      particleField.setParticleCount(count);
    });
  }

  // BPM Slider
  const bpmSlider = document.getElementById('bpm-slider');
  const bpmDisplay = document.getElementById('bpm-val');
  if (bpmSlider && bpmDisplay) {
    bpmSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      bpmDisplay.textContent = `${val} BPM`;
      soundMatrix.setBpm(val);
    });
  }

  // Code Weaver Cycle Button
  const cycleCodeBtn = document.getElementById('cycle-code-btn');
  if (cycleCodeBtn) {
    cycleCodeBtn.addEventListener('click', () => {
      generativeSandbox.cycleNext();
    });
  }

  // Clear Matrix Button
  const clearMatrixBtn = document.getElementById('clear-matrix-btn');
  if (clearMatrixBtn) {
    clearMatrixBtn.addEventListener('click', () => {
      soundMatrix.clear();
      if (window.QuantumSonification) window.QuantumSonification.playClick();
    });
  }

  // Add Hover Sonification to interactive buttons
  const interactiveBtns = document.querySelectorAll('button, .seq-cell, .mode-tab-btn, .tot-branch');
  interactiveBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (window.QuantumSonification) window.QuantumSonification.playHover();
    });
  });

  // 4. Master 60 FPS Render Loop
  function animationLoop() {
    // Get Audio Data
    const freqData = window.QuantumSynth.getFrequencyData();
    let audioEnergy = 0;
    if (freqData.length > 0) {
      let sum = 0;
      for (let i = 0; i < freqData.length; i++) sum += freqData[i];
      audioEnergy = (sum / freqData.length) / 255;
    }

    // Update Particle Physics
    particleField.update(freqData);

    // Render Particle Canvas
    particleField.render();

    // Render Mode-specific visual artifacts onto particle canvas
    if (particleField.mode === 'singularity') {
      singularityLens.render(
        particleField.ctx,
        particleField.width / 2,
        particleField.height / 2,
        audioEnergy
      );
    } else if (particleField.mode === 'neural') {
      neuralGraph.render(
        particleField.ctx,
        particleField.width * 0.5 - 150,
        particleField.height * 0.45 - 90
      );
    }

    // Render Audio Frequency Spectrum Canvas
    audioVisualizer.render();

    // Update Telemetry Metrics
    window.QuantumTelemetry.update(particleField.particles.length, audioEnergy);

    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);
});
