/**
 * QUANTUM NEXUS - COGNITIVE SYNAPTIC NETWORK GRAPH
 * Dynamic interactive synaptic nodes representing live multi-layered neural pathways
 */

class NeuralGraphVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.nodes = [];
    this.synapses = [];
    this.activePulses = [];
    this.concepts = [
      { id: 'perception', label: 'PERCEPTION', type: 'sensory', color: '#00f3ff' },
      { id: 'auditory', label: 'AUDITORY SYNTH', type: 'sensory', color: '#00f3ff' },
      { id: 'spatial', label: 'SPATIAL REASONING', type: 'cognitive', color: '#a855f7' },
      { id: 'synthesis', label: 'NEURAL SYNTHESIS', type: 'cognitive', color: '#a855f7' },
      { id: 'agentic', label: 'AGENT ORCHESTRATION', type: 'executive', color: '#00ff88' },
      { id: 'code_gen', label: 'CODE WEAVER', type: 'generative', color: '#ff007f' },
      { id: 'creativity', label: 'DEEP CREATIVITY', type: 'generative', color: '#ffb703' }
    ];

    this.init();
  }

  init() {
    this.buildGraph();
    this.startSynapticFiring();
  }

  buildGraph() {
    // Generate graph positions
    const width = 300;
    const height = 180;
    const count = this.concepts.length;

    this.nodes = this.concepts.map((c, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 60 + (i % 2) * 20;
      return {
        ...c,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        activity: 0.2,
        targetActivity: 0.2
      };
    });

    // Connect nodes
    this.synapses = [];
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        if (Math.random() > 0.4) {
          this.synapses.push({
            from: this.nodes[i],
            to: this.nodes[j],
            weight: Math.random() * 0.8 + 0.2
          });
        }
      }
    }
  }

  startSynapticFiring() {
    setInterval(() => {
      if (this.nodes.length === 0) return;
      const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      randomNode.activity = 1.0;

      // Spawn pulse traveling across an outgoing synapse
      const relatedSynapses = this.synapses.filter(s => s.from === randomNode || s.to === randomNode);
      if (relatedSynapses.length > 0) {
        const syn = relatedSynapses[Math.floor(Math.random() * relatedSynapses.length)];
        this.activePulses.push({
          synapse: syn,
          progress: 0,
          speed: 0.04
        });
      }
    }, 800);
  }

  triggerThoughtPulse(conceptId) {
    const node = this.nodes.find(n => n.id === conceptId);
    if (node) {
      node.activity = 1.0;
      if (window.QuantumSynth && window.QuantumSynth.isInitialized) {
        window.QuantumSynth.playNote(Math.floor(Math.random() * 6), 0.3, 0, 'triangle');
      }
    }
  }

  render(ctx, offsetX = 0, offsetY = 0) {
    // Update node activities
    this.nodes.forEach(n => {
      n.activity += (n.targetActivity - n.activity) * 0.05;
    });

    // Draw Synapses
    this.synapses.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(s.from.x + offsetX, s.from.y + offsetY);
      ctx.lineTo(s.to.x + offsetX, s.to.y + offsetY);
      ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 + s.weight * 0.2})`;
      ctx.lineWidth = s.weight * 1.5;
      ctx.stroke();
    });

    // Draw Pulses
    for (let p = this.activePulses.length - 1; p >= 0; p--) {
      const pulse = this.activePulses[p];
      pulse.progress += pulse.speed;
      if (pulse.progress >= 1.0) {
        pulse.synapse.to.activity = 0.9;
        this.activePulses.splice(p, 1);
        continue;
      }

      const px = pulse.synapse.from.x + (pulse.synapse.to.x - pulse.synapse.from.x) * pulse.progress + offsetX;
      const py = pulse.synapse.from.y + (pulse.synapse.to.y - pulse.synapse.from.y) * pulse.progress + offsetY;

      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00f3ff';
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 10;
      ctx.fill();
    }

    // Draw Nodes
    this.nodes.forEach(n => {
      const r = 6 + n.activity * 6;
      ctx.beginPath();
      ctx.arc(n.x + offsetX, n.y + offsetY, r, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = n.activity * 15;
      ctx.fill();

      // Node label
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x + offsetX, n.y + offsetY + r + 10);
    });
  }
}

window.CognitiveNeuralGraph = NeuralGraphVisualizer;
