/**
 * QUANTUM NEXUS - TREE-OF-THOUGHT REASONING VISUALIZER
 * Interactive cognitive decision tree showing multi-hypothesis evaluation and pruning
 */

class TreeOfThoughtVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.branches = [
      {
        id: 'branch-1',
        title: 'Branch α: Pure Waveform Synthesis',
        score: '0.982',
        state: 'Optimal',
        details: 'Generates lossless harmonic overtones with Zero-latency Web Audio API'
      },
      {
        id: 'branch-2',
        title: 'Branch β: Dynamic Spatial Soundscape',
        score: '0.965',
        state: 'Active',
        details: 'Binaural panning synced with multi-attractor particle coordinates'
      },
      {
        id: 'branch-3',
        title: 'Branch γ: Kinetic Anti-Gravity Field',
        score: '0.994',
        state: 'Optimal',
        details: 'Fluid dynamics + shockwave collision mechanics operating at 60 FPS'
      },
      {
        id: 'branch-4',
        title: 'Branch δ: Autonomous Swarm Consensus',
        score: '0.978',
        state: 'Active',
        details: 'Hierarchical multi-agent verification loop with self-healing states'
      }
    ];

    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="tot-node-tree">
        ${this.branches.map((b, idx) => `
          <div class="tot-branch ${idx === 0 ? 'active' : ''}" data-id="${b.id}" onclick="window.QuantumTreeOfThought.selectBranch('${b.id}')">
            <span>${b.title}</span>
            <span class="tot-score">Score: ${b.score}</span>
          </div>
        `).join('')}
      </div>
      <div id="tot-detail-box" style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary); background: rgba(3,7,18,0.5); padding: 6px 10px; border-radius: 4px; border: 1px dashed var(--border-subtle);">
        ${this.branches[0].details}
      </div>
    `;
  }

  selectBranch(branchId) {
    const branch = this.branches.find(b => b.id === branchId);
    if (!branch) return;

    // Update active class in DOM
    const branchEls = this.container.querySelectorAll('.tot-branch');
    branchEls.forEach(el => {
      if (el.getAttribute('data-id') === branchId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const detailEl = document.getElementById('tot-detail-box');
    if (detailEl) {
      detailEl.textContent = branch.details;
      detailEl.style.color = 'var(--neon-cyan)';
    }

    if (window.QuantumSonification) {
      window.QuantumSonification.playClick();
    }
  }
}

window.QuantumTreeOfThought = new TreeOfThoughtVisualizer('tot-container-root');
