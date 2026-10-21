/**
 * [CLASSE] MicroalgaParticle
 * Descrição: Representa um espécime microscópico individual na Lâmina Viva.
 * Governa as forças de oscilação browniana, momento hidrodinâmico do scroll,
 * repulsão elástica perante o feixe do mouse e profundidade de campo no eixo Z.
 */

const SPECIES_TYPES = [
  'diatom-1',
  'diatom-2',
  'diatom-3',
  'diatom-generic',
  'desmid-micrasterias',
  'cyanobacteria-filament',
  'organic-debris',
];

export class MicroalgaParticle {
  constructor(options = {}) {
    const {
      viewportWidth = 1000,
      viewportHeight = 800,
      x,
      y,
      z,
      species,
    } = options;

    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    // Posição inicial (estocástica ou fixada)
    this.x = x !== undefined ? x : Math.random() * viewportWidth;
    this.y = y !== undefined ? y : Math.random() * viewportHeight;

    // Profundidade óptica z ∈ [0.15, 1.0] (0.15 = fundo desfocado, 1.0 = plano focal nítido)
    this.z = z !== undefined ? z : 0.15 + Math.random() * 0.85;

    // Seleção de espécie biológica
    this.species = species || SPECIES_TYPES[Math.floor(Math.random() * SPECIES_TYPES.length)];

    // Velocidade linear acumulada
    this.vx = 0;
    this.vy = 0;

    // Rotação axial e velocidade angular lenta
    this.rotation = Math.random() * Math.PI * 2;
    this.angularVelocity = (Math.random() - 0.5) * 0.006;

    // Parâmetros da oscilação browniana harmônica
    this.driftAmpX = 0.2 + Math.random() * 0.6;
    this.driftAmpY = 0.2 + Math.random() * 0.6;
    this.driftFreqX = 0.001 + Math.random() * 0.002;
    this.driftFreqY = 0.001 + Math.random() * 0.002;
    this.phase = Math.random() * Math.PI * 2;

    // Turbulência estocástica lateral única por partícula
    this.turbulenceFactor = (Math.random() - 0.5) * 0.4;

    // Raio de influência do feixe do cursor
    this.mouseRadius = 150;

    // Margem de transição suave fora da viewport (wrap-around toroidal)
    this.margin = 120;
  }

  /**
   * Atualiza as equações físicas de movimento para o quadro atual.
   * @param {Object} tracker - Instância do PhysicsTracker com velocidades e cursor.
   * @param {number} viewportWidth - Largura atual da viewport.
   * @param {number} viewportHeight - Altura atual da viewport.
   * @param {number} time - Timestamp contínuo em ms (performance.now()).
   */
  update(tracker, viewportWidth = this.viewportWidth, viewportHeight = this.viewportHeight, time = 0) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    // 1. Deriva Browniana Harmônica (Oscilação aquosa natural)
    const driftX = this.driftAmpX * Math.sin(this.driftFreqX * time + this.phase) * this.z;
    const driftY = this.driftAmpY * Math.cos(this.driftFreqY * time + this.phase) * this.z;

    // 2. Rotação Axial Contínua
    this.rotation += this.angularVelocity;

    // 3. Momento Hidrodinâmico do Scroll
    if (tracker && tracker.scrollVelocity !== 0) {
      // O scroll transfere momento vertical proporcional à profundidade Z
      this.vy += tracker.scrollVelocity * 0.32 * this.z;
      // Dispersão estocástica lateral (turbulência fluida de igarapé)
      this.vx += tracker.scrollVelocity * this.turbulenceFactor * this.z;
    }

    // 4. Campo de Repulsão do Cursor / Sonda Óptica
    if (tracker && tracker.isMouseActive) {
      const dx = this.x - tracker.mouseX;
      const dy = this.y - tracker.mouseY;
      const distance = Math.hypot(dx, dy);

      if (distance < this.mouseRadius && distance > 0.001) {
        // Força não-linear inversamente proporcional à distância
        const normalizedDist = distance / this.mouseRadius;
        const force = Math.pow(1 - normalizedDist, 2) * 16 * this.z;

        // Projeção vetorial de repulsão
        const nx = dx / distance;
        const ny = dy / distance;

        this.vx += nx * force;
        this.vy += ny * force;
      }
    }

    // 5. Decaimento por Fricção de Stokes (Amortecimento)
    this.vx *= 0.92;
    this.vy *= 0.92;

    // 6. Integração da Posição
    this.x += this.vx + driftX;
    this.y += this.vy + driftY;

    // 7. Limites Toroidais Suaves (Wrap-around nas 4 bordas)
    if (this.x < -this.margin) {
      this.x = viewportWidth + this.margin;
    } else if (this.x > viewportWidth + this.margin) {
      this.x = -this.margin;
    }

    if (this.y < -this.margin) {
      this.y = viewportHeight + this.margin;
    } else if (this.y > viewportHeight + this.margin) {
      this.y = -this.margin;
    }
  }

  /**
   * Calcula o fator de escala final combinando profundidade óptica Z e zoom da ocular.
   * @param {number} zoomFactor - Fator de zoom da página.
   * @returns {number} Escala multiplicadora para o desenho.
   */
  getRenderScale(zoomFactor = 1.0) {
    // Camadas profundas (z ~ 0.2) aparecem menores (0.35x); plano focal (z ~ 1.0) aparece a 1.0x
    const depthScale = 0.35 + 0.65 * this.z;
    return depthScale * zoomFactor;
  }

  /**
   * Calcula a opacidade final da partícula baseada na profundidade de foco.
   * @param {number} baseOpacity - Opacidade de referência do meio aquoso.
   * @returns {number} Opacidade entre 0 e 1.
   */
  getRenderOpacity(baseOpacity = 0.4) {
    return Math.max(0.08, (0.2 + 0.8 * this.z) * baseOpacity);
  }
}
