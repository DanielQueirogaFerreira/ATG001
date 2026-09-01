/**
 * QUANTUM NEXUS - ALGORITHMIC CODE WEAVER & MATHEMATICAL SANDBOX
 * Real-time algorithmic code generation and mathematical formulation renderer
 */

class GenerativeSandbox {
  constructor(outputElementId) {
    this.outputEl = document.getElementById(outputElementId);
    this.algorithms = [
      {
        title: 'Lissajous Harmonic Manifold',
        equation: 'x = A·sin(a·t + δ), y = B·sin(b·t)',
        code: `// Quantum Lissajous Manifold Generator
function generateLissajous(a=3, b=4, delta=Math.PI/2) {
  const points = [];
  for (let t = 0; t < Math.PI * 2; t += 0.05) {
    points.push({
      x: 180 * Math.sin(a * t + delta),
      y: 180 * Math.sin(b * t),
      phase: Math.cos(t)
    });
  }
  return synthesizeTopology(points);
}`
      },
      {
        title: 'Lorenz Strange Attractor (Chaos Theory)',
        equation: 'dx/dt = σ(y - x), dy/dt = x(ρ - z) - y, dz/dt = xy - βz',
        code: `// Lorenz Quantum Attractor
function evolveLorenz(sigma=10, rho=28, beta=8/3, dt=0.01) {
  let [x, y, z] = [0.1, 0, 0];
  const trajectory = [];
  for (let i = 0; i < 500; i++) {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    x += dx; y += dy; z += dz;
    trajectory.push({ x, y, z, velocity: Math.hypot(dx, dy, dz) });
  }
  return renderStrangeAttractor(trajectory);
}`
      },
      {
        title: 'Quantum Schrödinger Wavepacket',
        equation: 'Ψ(x,t) = (1/√(2π·σ²)) · exp(-(x-v·t)² / 4σ²) · exp(i(k·x - ω·t))',
        code: `// Wavepacket Probability Density
function computeWavefunction(x, t, k=2.5, sigma=1.2) {
  const envelope = Math.exp(-Math.pow(x - 0.5 * t, 2) / (4 * sigma * sigma));
  const real = envelope * Math.cos(k * x - 2 * t);
  const imag = envelope * Math.sin(k * x - 2 * t);
  return { psiReal: real, psiImag: imag, probability: real*real + imag*imag };
}`
      }
    ];

    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.renderCurrent();
  }

  renderCurrent() {
    if (!this.outputEl) return;
    const algo = this.algorithms[this.currentIndex];
    this.outputEl.innerHTML = `
      <div style="color: var(--neon-cyan); font-weight: bold; margin-bottom: 4px;">// ${algo.title}</div>
      <div style="color: var(--text-muted); font-size: 0.6rem; margin-bottom: 6px;">// ${algo.equation}</div>
      <pre style="color: var(--neon-emerald); white-space: pre-wrap; font-family: var(--font-mono); font-size: 0.62rem;">${algo.code}</pre>
    `;
  }

  cycleNext() {
    this.currentIndex = (this.currentIndex + 1) % this.algorithms.length;
    this.renderCurrent();
    if (window.QuantumSonification) {
      window.QuantumSonification.playClick();
    }
  }
}

window.QuantumGenerativeSandbox = GenerativeSandbox;
