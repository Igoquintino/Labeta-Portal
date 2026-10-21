/**
 * [CLASSE] ParticleSystem
 * Descrição: Gerenciador do pool de partículas, redimensionamento de buffer com clamp de DPR,
 * ordenação por profundidade no eixo Z e ciclo de animação a 60 FPS da Lâmina Viva.
 */
import { PhysicsTracker } from './PhysicsTracker';
import { MicroalgaParticle } from './MicroalgaParticle';
import { SpeciesRenderer } from './SpeciesRenderer';

export class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    const defaultWidth = typeof window !== 'undefined' ? window.innerWidth || 1000 : 1000;
    const defaultHeight = typeof window !== 'undefined' ? window.innerHeight || 800 : 800;

    this.width = options.width || defaultWidth;
    this.height = options.height || defaultHeight;
    this.theme = options.theme || 'dark';
    this.zoom = options.zoom || 1.0;
    this.intensity = options.intensity ?? 1.0;
    this.baseOpacity = options.baseOpacity ?? (this.theme === 'dark' ? 0.35 : 0.18);
    this.reducedMotion = Boolean(options.reducedMotion);

    this.isPaused = false;
    this.animationFrameId = null;

    // Submódulos da Engine
    this.tracker = new PhysicsTracker();
    this.renderer = new SpeciesRenderer();
    this.particles = [];

    // Inicialização da população e ajuste do buffer
    this.initParticles();
    this.resize(this.width, this.height);

    // Bind para requestAnimationFrame
    this.loop = this.animate.bind(this);
  }

  /**
   * Determina a contagem de partículas ideal respeitando o orçamento de GPU do dispositivo.
   */
  getParticleBudget(width) {
    if (width < 768) return 22; // Mobile
    if (width <= 1024) return 38; // Tablet
    return 58; // Desktop
  }

  /**
   * Instancia e ordena as partículas pelo eixo de profundidade Z.
   */
  initParticles() {
    const count = this.getParticleBudget(this.width);
    this.particles = Array.from({ length: count }, () => new MicroalgaParticle({
      viewportWidth: this.width,
      viewportHeight: this.height,
    }));
    this.sortParticles();
  }

  /**
   * Ordena partículas do fundo para a frente (Z crescente) para composição óptica correta.
   */
  sortParticles() {
    this.particles.sort((a, b) => a.z - b.z);
  }

  /**
   * Redimensiona o buffer do canvas com clamp de DPR em no máximo 2.0.
   */
  resize(width, height) {
    this.width = width;
    this.height = height;

    const dpr = typeof window !== 'undefined'
      ? Math.min(window.devicePixelRatio || 1, 2.0)
      : 1.0;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);

    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }
  }

  /**
   * Inicia o ciclo de renderização.
   */
  start() {
    if (this.reducedMotion) {
      // No modo de movimento reduzido, desenha apenas um quadro estático sem loop contínuo
      this.tick(0);
      return;
    }

    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  }

  /**
   * Pausa o loop de renderização (ex: aba em background).
   */
  pause() {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Retoma a animação.
   */
  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.start();
  }

  /**
   * Atualização contínua de quadros via rAF.
   */
  animate(time) {
    if (this.isPaused) return;

    this.tick(time);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  /**
   * Executa um único passo de simulação física e desenho.
   * @param {number} time - Timestamp contínuo em ms.
   */
  tick(time = 0) {
    if (this.isPaused || !this.ctx) return;

    // 1. Atualiza velocidades e amortecimento
    this.tracker.update();

    // 2. Limpa o viewport para o próximo quadro
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 3. Atualiza física e desenha cada espécime ficológico
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // No modo de movimento reduzido, não aplica impulso nem deslocamento
      if (!this.reducedMotion) {
        particle.update(this.tracker, this.width, this.height, time);
      }

      this.renderer.render(this.ctx, particle, {
        theme: this.theme,
        zoom: this.zoom,
        baseOpacity: this.baseOpacity,
      });
    }
  }

  /**
   * Atualiza o tema da simulação (Dark / Light).
   */
  setTheme(theme) {
    if (this.theme === theme) return;
    this.theme = theme;
    this.baseOpacity = theme === 'dark' ? 0.35 : 0.18;

    if (this.reducedMotion) {
      this.tick(0);
    }
  }

  /**
   * Atualiza o zoom da ocular microscópica.
   */
  setZoom(zoom) {
    this.zoom = zoom;
  }

  /**
   * Alterna a preferência de movimento reduzido.
   */
  setReducedMotion(reducedMotion) {
    this.reducedMotion = Boolean(reducedMotion);
    if (this.reducedMotion) {
      this.pause();
      this.tick(0);
    } else {
      this.resume();
    }
  }

  /**
   * Destrói a instância, cancela loops e remove ouvintes passivos.
   */
  destroy() {
    this.pause();
    if (this.tracker) {
      this.tracker.destroy();
    }
    this.particles = [];
  }
}
