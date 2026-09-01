/**
 * QUANTUM NEXUS - AUDIO FREQUENCY SPECTRUM & CIRCULAR RADAR VISUALIZER
 * Real-time dynamic FFT visualizer rendering cyber-radar and frequency waveform streams
 */

class AudioVisualizer {
  constructor(canvasId, synthEngine) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.synth = synthEngine;
    this.width = this.canvas.width = this.canvas.clientWidth || 300;
    this.height = this.canvas.height = this.canvas.clientHeight || 90;

    window.addEventListener('resize', () => {
      if (this.canvas) {
        this.width = this.canvas.width = this.canvas.clientWidth || 300;
        this.height = this.canvas.height = this.canvas.clientHeight || 90;
      }
    });
  }

  render() {
    if (!this.ctx) return;
    const freqData = this.synth.getFrequencyData();
    this.ctx.clearRect(0, 0, this.width, this.height);

    const barCount = 36;
    const barWidth = this.width / barCount;
    const step = Math.floor(freqData.length / barCount) || 1;

    // Draw Frequency Bars
    for (let i = 0; i < barCount; i++) {
      const val = freqData[i * step] || (Math.sin(performance.now() * 0.003 + i * 0.2) * 20 + 25);
      const barHeight = (val / 255) * (this.height - 10);
      const x = i * barWidth;
      const y = this.height - barHeight;

      // Gradient color mapping
      const hue = 180 + (i / barCount) * 120; // Cyan to Purple/Pink
      this.ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.85)`;
      this.ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.6)`;
      this.ctx.shadowBlur = 6;

      this.ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

      // Top Peak Dot
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(x + 1, Math.max(0, y - 2), barWidth - 2, 2);
    }

    // Oscilloscope line overlay
    this.ctx.beginPath();
    for (let i = 0; i < barCount; i++) {
      const val = freqData[i * step] || 20;
      const x = i * barWidth + barWidth / 2;
      const y = this.height - (val / 255) * this.height * 0.8;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();
  }
}

window.QuantumAudioVisualizer = AudioVisualizer;
