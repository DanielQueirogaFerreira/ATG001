/**
 * QUANTUM NEXUS - MAIN APPLICATION ORCHESTRATOR
 * Lifecycle manager, 60 FPS animation loop coordinator, Global Power Manager & Multimodal event dispatcher
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

  // 3. Global Power State System
  let isSystemPoweredOn = true;
  const appContainer = document.getElementById('app-container');
  const powerBtn = document.getElementById('power-toggle-btn');
  const powerStatusBadge = document.getElementById('system-status-badge');
  const powerPulseDot = document.getElementById('system-pulse-dot');
  const powerStatusText = document.getElementById('system-status-text');

  function toggleGlobalPower() {
    isSystemPoweredOn = !isSystemPoweredOn;
    particleField.setPowerState(isSystemPoweredOn);

    if (isSystemPoweredOn) {
      // Power UP
      if (appContainer) appContainer.classList.remove('power-offline');
      if (powerBtn) {
        powerBtn.classList.remove('offline');
        powerBtn.innerHTML = '<span>⚡</span> REACTOR ONLINE';
      }
      if (powerStatusBadge) powerStatusBadge.classList.remove('offline');
      if (powerPulseDot) powerPulseDot.classList.remove('offline');
      if (powerStatusText) powerStatusText.textContent = 'SYNCHRONIZED';

      if (window.QuantumSonification) window.QuantumSonification.playPowerUp();
      soundMatrix.isPlaying = true;
      if (window.QuantumSoundscape && !window.QuantumSynth.isMuted) {
        window.QuantumSoundscape.start();
      }

      // Center power surge shockwave
      particleField.addShockwave(window.innerWidth / 2, window.innerHeight / 2, 2.2);

    } else {
      // Power DOWN
      if (appContainer) appContainer.classList.add('power-offline');
      if (powerBtn) {
        powerBtn.classList.add('offline');
        powerBtn.innerHTML = '<span>⏻</span> REACTOR OFFLINE';
      }
      if (powerStatusBadge) powerStatusBadge.classList.add('offline');
      if (powerPulseDot) powerPulseDot.classList.add('offline');
      if (powerStatusText) powerStatusText.textContent = 'OFFLINE_STANDBY';

      if (window.QuantumSonification) window.QuantumSonification.playPowerDown();
      soundMatrix.isPlaying = false;
      if (window.QuantumSoundscape) {
        window.QuantumSoundscape.stop();
      }
    }
  }

  if (powerBtn) {
    powerBtn.addEventListener('click', toggleGlobalPower);
  }

  // 4. Force Switcher (Repel vs Attract vs Dual)
  const forceBtns = document.querySelectorAll('.force-btn');
  function setForceMode(forceType) {
    particleField.setForceType(forceType);
    forceBtns.forEach(btn => {
      if (btn.getAttribute('data-force') === forceType) {
        btn.classList.add('active', forceType);
      } else {
        btn.classList.remove('active', 'repel', 'attract', 'dual');
      }
    });
    if (window.QuantumSonification) window.QuantumSonification.playClick();
  }

  forceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-force');
      setForceMode(type);
    });
  });

  // 5. Beacon Management Buttons
  const addAttractorBtn = document.getElementById('add-attractor-btn');
  if (addAttractorBtn) {
    addAttractorBtn.addEventListener('click', () => {
      const x = window.innerWidth * (0.35 + Math.random() * 0.3);
      const y = window.innerHeight * (0.35 + Math.random() * 0.3);
      particleField.addBeacon(x, y, 'attractor');
    });
  }

  const addRepulsorBtn = document.getElementById('add-repulsor-btn');
  if (addRepulsorBtn) {
    addRepulsorBtn.addEventListener('click', () => {
      const x = window.innerWidth * (0.35 + Math.random() * 0.3);
      const y = window.innerHeight * (0.35 + Math.random() * 0.3);
      particleField.addBeacon(x, y, 'repulsor');
    });
  }

  const clearBeaconsBtn = document.getElementById('clear-beacons-btn');
  if (clearBeaconsBtn) {
    clearBeaconsBtn.addEventListener('click', () => {
      particleField.clearBeacons();
    });
  }

  // 6. UI Controls & Event Listeners
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

  // Keyboard Shortcuts (P: Power, A: Attract, R: Repel, B: Beacon, C: Clear Beacons)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
      toggleGlobalPower();
    } else if (e.key === 'a' || e.key === 'A') {
      setForceMode('attract');
    } else if (e.key === 'r' || e.key === 'R') {
      setForceMode('repel');
    } else if (e.key === 'b' || e.key === 'B') {
      particleField.addBeacon(particleField.mouse.x, particleField.mouse.y, 'attractor');
    } else if (e.key === 'c' || e.key === 'C') {
      particleField.clearBeacons();
    }
  });

  // Add Hover Sonification to interactive buttons
  const interactiveBtns = document.querySelectorAll('button, .seq-cell, .mode-tab-btn, .tot-branch, .force-btn');
  interactiveBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (window.QuantumSonification) window.QuantumSonification.playHover();
    });
  });

  // 7. Master 60 FPS Render Loop
  function animationLoop() {
    // Get Audio Data
    const freqData = window.QuantumSynth.getFrequencyData();
    let audioEnergy = 0;
    if (isSystemPoweredOn && freqData.length > 0) {
      let sum = 0;
      for (let i = 0; i < freqData.length; i++) sum += freqData[i];
      audioEnergy = (sum / freqData.length) / 255;
    }

    // Update Particle Physics
    particleField.update(freqData);

    // Render Particle Canvas
    particleField.render();

    // Render Mode-specific visual artifacts onto particle canvas
    if (isSystemPoweredOn) {
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
    }

    // Render Audio Frequency Spectrum Canvas
    if (isSystemPoweredOn) {
      audioVisualizer.render();
    }

    // Update Telemetry Metrics
    const teleState = isSystemPoweredOn ? null : 'STANDBY_SUSPENDED';
    window.QuantumTelemetry.update(particleField.particles.length, audioEnergy);
    if (!isSystemPoweredOn && document.getElementById('state-metric-val')) {
      document.getElementById('state-metric-val').textContent = 'STANDBY_SUSPENDED';
    }

    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);
});
