/**
 * QUANTUM NEXUS - MAIN APPLICATION ORCHESTRATOR
 * Lifecycle manager, 60 FPS animation loop coordinator, Global Power Manager,
 * Mobile 7-Tool Bottom Sheet Drawer Manager, Panel Show/Hide Toggle & Multimodal event dispatcher
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

  const appContainer = document.getElementById('app-container');

  // 3. Global Power State System (Icon-Driven)
  let isSystemPoweredOn = true;
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
        powerBtn.innerHTML = '<span class="power-icon">⏻</span>';
      }
      if (powerStatusBadge) powerStatusBadge.classList.remove('offline');
      if (powerPulseDot) powerPulseDot.classList.remove('offline');

      if (window.QuantumSonification) window.QuantumSonification.playPowerUp();
      soundMatrix.isPlaying = true;
      if (window.QuantumSoundscape && !window.QuantumSynth.isMuted) {
        window.QuantumSoundscape.start();
      }

      particleField.addWave(window.innerWidth / 2, window.innerHeight / 2, 'implosion', 2.0);

    } else {
      // Power DOWN
      if (appContainer) appContainer.classList.add('power-offline');
      if (powerBtn) {
        powerBtn.classList.add('offline');
        powerBtn.innerHTML = '<span class="power-icon">⏻</span>';
      }
      if (powerStatusBadge) powerStatusBadge.classList.add('offline');
      if (powerPulseDot) powerPulseDot.classList.add('offline');

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

  // 4. Desktop Panel Show/Hide Master Toggle (Pure Icon-Driven)
  let arePanelsVisible = true;
  const panelsToggleBtn = document.getElementById('panels-toggle-btn');
  const floatingShowPanelsBtn = document.getElementById('floating-show-panels-btn');

  function togglePanels(forceState = null) {
    arePanelsVisible = forceState !== null ? forceState : !arePanelsVisible;
    if (arePanelsVisible) {
      appContainer.classList.remove('panels-hidden');
      if (panelsToggleBtn) {
        panelsToggleBtn.classList.remove('hidden-mode');
        panelsToggleBtn.innerHTML = '<span class="panels-icon">👁️</span>';
      }
    } else {
      appContainer.classList.add('panels-hidden');
      if (panelsToggleBtn) {
        panelsToggleBtn.classList.add('hidden-mode');
        panelsToggleBtn.innerHTML = '<span class="panels-icon">🚫</span>';
      }
    }
    if (window.QuantumSonification) window.QuantumSonification.playClick();
  }

  if (panelsToggleBtn) {
    panelsToggleBtn.addEventListener('click', () => togglePanels());
  }
  if (floatingShowPanelsBtn) {
    floatingShowPanelsBtn.addEventListener('click', () => togglePanels(true));
  }

  // Collapsible Individual Cards
  const cardHeaders = document.querySelectorAll('.card-header');
  cardHeaders.forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('button, select, input')) return;
      const panel = header.closest('.glass-panel');
      if (panel) {
        panel.classList.toggle('collapsed');
        const collapseBtn = header.querySelector('.card-collapse-btn');
        if (collapseBtn) {
          collapseBtn.textContent = panel.classList.contains('collapsed') ? '▼' : '▲';
        }
        if (window.QuantumSonification) window.QuantumSonification.playClick();
      }
    });
  });

  // 5. Force Switcher (Repel vs Attract vs Dual)
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
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.getAttribute('data-force');
      setForceMode(type);
    });
  });

  // 6. Beacon Management Buttons
  const addAttractorBtn = document.getElementById('add-attractor-btn');
  if (addAttractorBtn) {
    addAttractorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const x = window.innerWidth * (0.35 + Math.random() * 0.3);
      const y = window.innerHeight * (0.35 + Math.random() * 0.3);
      particleField.addBeacon(x, y, 'attractor');
    });
  }

  const addRepulsorBtn = document.getElementById('add-repulsor-btn');
  if (addRepulsorBtn) {
    addRepulsorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const x = window.innerWidth * (0.35 + Math.random() * 0.3);
      const y = window.innerHeight * (0.35 + Math.random() * 0.3);
      particleField.addBeacon(x, y, 'repulsor');
    });
  }

  const clearBeaconsBtn = document.getElementById('clear-beacons-btn');
  if (clearBeaconsBtn) {
    clearBeaconsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      particleField.clearBeacons();
    });
  }

  // 7. Mobile Smartphone 7-Tool Bottom Sheet Drawer Manager
  const mobileDrawer = document.getElementById('mobile-drawer-sheet');
  const mobileDrawerTitle = document.getElementById('mobile-drawer-title');
  const mobileDrawerContent = document.getElementById('mobile-drawer-content');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileTabs = document.querySelectorAll('.mobile-tab-btn');

  let activeMobileOriginalParent = null;
  let activeMobileCard = null;

  function closeMobileDrawer() {
    if (activeMobileCard && activeMobileOriginalParent) {
      activeMobileOriginalParent.appendChild(activeMobileCard);
      activeMobileCard = null;
      activeMobileOriginalParent = null;
    }
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    mobileTabs.forEach(t => t.classList.remove('active'));
    if (window.QuantumSonification) window.QuantumSonification.playClick();
  }

  function openMobileDrawer(targetCardId, tabTitle) {
    if (activeMobileCard && activeMobileOriginalParent) {
      activeMobileOriginalParent.appendChild(activeMobileCard);
    }

    const card = document.getElementById(targetCardId);
    if (!card) return;

    activeMobileOriginalParent = card.parentElement;
    activeMobileCard = card;

    if (mobileDrawerTitle) mobileDrawerTitle.textContent = tabTitle.toUpperCase();
    if (mobileDrawerContent) {
      mobileDrawerContent.innerHTML = '';
      mobileDrawerContent.appendChild(card);
    }

    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('open');
    if (window.QuantumSonification) window.QuantumSonification.playClick();
  }

  mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      const title = tab.querySelector('.mobile-tab-label') ? tab.querySelector('.mobile-tab-label').textContent.trim() : tab.textContent.trim();

      if (tab.classList.contains('active') && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      } else {
        mobileTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        openMobileDrawer(targetId, title);
      }
    });
  });

  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileDrawer);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileDrawer);

  // 8. General UI Controls & Event Listeners
  // Sensory Mode Tabs (Icon-Driven)
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
    cycleCodeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      generativeSandbox.cycleNext();
    });
  }

  // Clear Matrix Button
  const clearMatrixBtn = document.getElementById('clear-matrix-btn');
  if (clearMatrixBtn) {
    clearMatrixBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundMatrix.clear();
      if (window.QuantumSonification) window.QuantumSonification.playClick();
    });
  }

  // Keyboard Shortcuts (P: Power, H/Tab: Panels, A: Attract, R: Repel, D: Dual, B: Beacon, C: Clear)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
      toggleGlobalPower();
    } else if (e.key === 'h' || e.key === 'H' || e.code === 'Tab') {
      if (e.code === 'Tab') e.preventDefault();
      togglePanels();
    } else if (e.key === 'a' || e.key === 'A') {
      setForceMode('attract');
    } else if (e.key === 'r' || e.key === 'R') {
      setForceMode('repel');
    } else if (e.key === 'd' || e.key === 'D') {
      setForceMode('dual');
    } else if (e.key === 'b' || e.key === 'B') {
      particleField.addBeacon(particleField.mouse.x, particleField.mouse.y, 'attractor');
    } else if (e.key === 'c' || e.key === 'C') {
      particleField.clearBeacons();
    }
  });

  // Add Hover Sonification to interactive buttons
  const interactiveBtns = document.querySelectorAll('button, .seq-cell, .mode-tab-btn, .tot-branch, .force-btn, .card-header, .mobile-tab-btn');
  interactiveBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (window.QuantumSonification) window.QuantumSonification.playHover();
    });
  });

  // 9. Master 60 FPS Render Loop
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
    window.QuantumTelemetry.update(particleField.particles.length, audioEnergy);
    if (!isSystemPoweredOn && document.getElementById('state-metric-val')) {
      document.getElementById('state-metric-val').textContent = 'STANDBY_SUSPENDED';
    }

    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);
});
