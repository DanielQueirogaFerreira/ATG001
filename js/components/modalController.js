/**
 * QUANTUM NEXUS - MODAL & SPLASH ACTIVATION CONTROLLER
 * Unlocks browser Web Audio API context on first user gesture and handles modal dialogues
 */

class ModalController {
  constructor() {
    this.splashOverlay = document.getElementById('splash-overlay');
    this.startBtn = document.getElementById('splash-start-btn');
    this.audioToggleBtn = document.getElementById('audio-toggle-btn');
    this.soundscapeToggleBtn = document.getElementById('soundscape-toggle-btn');

    this.init();
  }

  init() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.unlockAndEnter());
    }

    if (this.audioToggleBtn) {
      this.audioToggleBtn.addEventListener('click', () => this.toggleMasterAudio());
    }

    if (this.soundscapeToggleBtn) {
      this.soundscapeToggleBtn.addEventListener('click', () => this.toggleSoundscape());
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        // Trigger center shockwave
        if (window.activeParticleField) {
          window.activeParticleField.addShockwave(window.innerWidth / 2, window.innerHeight / 2, 1.8);
        }
      } else if (e.key === 'm' || e.key === 'M') {
        this.toggleMasterAudio();
      } else if (e.key === '1') {
        this.switchMode('quantum');
      } else if (e.key === '2') {
        this.switchMode('singularity');
      } else if (e.key === '3') {
        this.switchMode('neural');
      } else if (e.key === '4') {
        this.switchMode('vortex');
      } else if (e.key === '5') {
        this.switchMode('audio');
      }
    });
  }

  unlockAndEnter() {
    // Initialize Web Audio
    if (window.QuantumSynth) {
      window.QuantumSynth.init();
    }

    if (window.QuantumSoundscape) {
      window.QuantumSoundscape.start();
    }

    if (this.splashOverlay) {
      this.splashOverlay.classList.add('hidden');
      setTimeout(() => {
        this.splashOverlay.style.display = 'none';
      }, 500);
    }

    if (window.QuantumSonification) {
      window.QuantumSonification.playModeSwitch();
    }
  }

  toggleMasterAudio() {
    if (!window.QuantumSynth.isInitialized) {
      window.QuantumSynth.init();
    }
    const isMuted = window.QuantumSynth.toggleMute();
    if (this.audioToggleBtn) {
      if (isMuted) {
        this.audioToggleBtn.classList.add('muted');
        this.audioToggleBtn.innerHTML = '<span id="audio-icon">🔇</span>';
      } else {
        this.audioToggleBtn.classList.remove('muted');
        this.audioToggleBtn.innerHTML = '<span id="audio-icon">🔊</span>';
      }
    }
  }

  toggleSoundscape() {
    if (!window.QuantumSoundscape) return;
    if (window.QuantumSoundscape.isRunning) {
      window.QuantumSoundscape.stop();
      if (this.soundscapeToggleBtn) {
        this.soundscapeToggleBtn.textContent = 'START SOUNDSCAPE';
      }
    } else {
      window.QuantumSoundscape.start();
      if (this.soundscapeToggleBtn) {
        this.soundscapeToggleBtn.textContent = 'STOP SOUNDSCAPE';
      }
    }
  }

  switchMode(modeName) {
    const tabBtns = document.querySelectorAll('.mode-tab-btn');
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-mode') === modeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (window.activeParticleField) {
      window.activeParticleField.setMode(modeName);
    }

    if (window.QuantumSoundscape) {
      window.QuantumSoundscape.setAtmosphereMode(modeName);
    }

    if (window.QuantumSonification) {
      window.QuantumSonification.playModeSwitch();
    }
  }
}

window.QuantumModalController = ModalController;
