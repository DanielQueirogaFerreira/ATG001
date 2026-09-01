/**
 * QUANTUM NEXUS - 16-STEP POLYPHONIC SOUND MATRIX & SEQUENCER
 * Interactive musical matrix with tempo synchronization, scale mapping & step highlights
 */

class SoundMatrixSequencer {
  constructor(containerId, synthEngine) {
    this.container = document.getElementById(containerId);
    this.synth = synthEngine;
    this.rows = 6; // 6 pitch registers
    this.cols = 16; // 16 steps
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
    this.currentStep = 0;
    this.bpm = 120;
    this.isPlaying = true;
    this.timer = null;

    // Load initial default melodic pattern
    this.loadDefaultPattern();
    this.init();
  }

  loadDefaultPattern() {
    // Ethereal cyber progression preset
    const pattern = [
      [0, 0], [2, 2], [4, 4], [3, 6],
      [1, 8], [3, 10], [5, 12], [2, 14],
      [0, 8], [4, 12]
    ];
    pattern.forEach(([r, c]) => {
      if (r < this.rows && c < this.cols) {
        this.grid[r][c] = true;
      }
    });
  }

  init() {
    this.render();
    this.start();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = document.createElement('div');
        cell.className = `seq-cell pitch-${r} ${this.grid[r][c] ? 'active' : ''}`;
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.id = `seq-cell-${r}-${c}`;

        cell.addEventListener('click', () => {
          this.toggleCell(r, c);
        });

        this.container.appendChild(cell);
      }
    }
  }

  toggleCell(r, c) {
    this.grid[r][c] = !this.grid[r][c];
    const cell = document.getElementById(`seq-cell-${r}-${c}`);
    if (cell) {
      if (this.grid[r][c]) {
        cell.classList.add('active');
        // Preview note
        if (this.synth.isInitialized) {
          const pitchIndex = (this.rows - 1 - r);
          this.synth.playNote(pitchIndex, 0.3, (c / 16) * 2 - 1, 'cyber');
        }
      } else {
        cell.classList.remove('active');
      }
    }
  }

  start() {
    if (this.timer) clearInterval(this.timer);
    const intervalMs = (60 / this.bpm / 4) * 1000; // 16th notes

    this.timer = setInterval(() => {
      if (!this.isPlaying) return;
      this.step();
    }, intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  step() {
    // Clear previous step highlight
    const prevCol = (this.currentStep - 1 + this.cols) % this.cols;
    for (let r = 0; r < this.rows; r++) {
      const prevCell = document.getElementById(`seq-cell-${r}-${prevCol}`);
      if (prevCell) prevCell.classList.remove('playing');
    }

    // Trigger active notes in current step
    for (let r = 0; r < this.rows; r++) {
      const cell = document.getElementById(`seq-cell-${r}-${this.currentStep}`);
      if (cell) {
        cell.classList.add('playing');
      }

      if (this.grid[r][this.currentStep] && this.synth.isInitialized) {
        const pitchIndex = (this.rows - 1 - r);
        const pan = (this.currentStep / this.cols) * 1.8 - 0.9;
        this.synth.playNote(pitchIndex, 0.35, pan, 'cyber');

        // Add subtle visual shockwave if high register note triggers
        if (r === 0 && window.activeParticleField) {
          window.activeParticleField.addShockwave(
            window.innerWidth * (this.currentStep / 16),
            window.innerHeight * 0.5,
            0.5
          );
        }
      }
    }

    this.currentStep = (this.currentStep + 1) % this.cols;
  }

  clear() {
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
    this.render();
  }

  setBpm(newBpm) {
    this.bpm = parseInt(newBpm, 10) || 120;
    this.start();
  }
}

window.QuantumSoundMatrix = SoundMatrixSequencer;
