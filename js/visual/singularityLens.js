/**
 * QUANTUM NEXUS - GRAVITATIONAL SINGULARITY & EVENT HORIZON LENS
 * Physics-grounded chromatic light-bending & accretion disk rendering
 */

class SingularityLens {
  constructor() {
    this.rotation = 0;
    this.pulse = 0;
  }

  render(ctx, centerX, centerY, audioEnergy = 0) {
    this.rotation += 0.015 + audioEnergy * 0.03;
    this.pulse = Math.sin(performance.now() * 0.002) * 5;

    const baseRadius = 45 + this.pulse + audioEnergy * 25;

    ctx.save();
    ctx.translate(centerX, centerY);

    // 1. Outer Accretion Plasma Ring
    ctx.rotate(this.rotation);
    const gradAccretion = ctx.createLinearGradient(-baseRadius * 2, 0, baseRadius * 2, 0);
    gradAccretion.addColorStop(0, 'rgba(255, 0, 127, 0.6)');
    gradAccretion.addColorStop(0.5, 'rgba(0, 243, 255, 0.9)');
    gradAccretion.addColorStop(1, 'rgba(168, 85, 247, 0.6)');

    ctx.beginPath();
    ctx.ellipse(0, 0, baseRadius * 2.2, baseRadius * 0.7, 0, 0, Math.PI * 2);
    ctx.strokeStyle = gradAccretion;
    ctx.lineWidth = 4 + audioEnergy * 6;
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 25;
    ctx.stroke();

    // 2. Gravitational Lensing Halo (Photon Sphere)
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 1.35, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.stroke();

    // 3. Event Horizon Black Void Core
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#030712';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 30;
    ctx.fill();

    // Inner Singularity Glow Rim
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
}

window.QuantumSingularityLens = SingularityLens;
