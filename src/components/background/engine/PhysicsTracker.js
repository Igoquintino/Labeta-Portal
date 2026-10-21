/**
 * [CLASSE] PhysicsTracker
 * Descrição: Rastreador de momento e física de entrada para a Lâmina Viva.
 * Captura rolagem (scroll) e movimento do cursor (mouse/touch) com ouvintes passivos,
 * aplicando amortecimento por atrito de Stokes (decaimento exponencial) e interpolação linear (Lerp).
 */
export class PhysicsTracker {
  constructor(options = {}) {
    this.friction = options.friction ?? 0.92;
    this.maxVelocity = options.maxVelocity ?? 60;
    this.lerpFactor = options.lerpFactor ?? 0.15;

    // Estado do scroll
    this.scrollY = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
    this.lastScrollY = this.scrollY;
    this.scrollVelocity = 0;

    // Estado do mouse / touch
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.isMouseActive = false;

    // Handlers vinculados para desregistro seguro
    this.handleScroll = this.onScroll.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleTouchMove = this.onTouchMove.bind(this);
    this.handleMouseLeave = this.onMouseLeave.bind(this);

    this.bindEvents();
  }

  /**
   * Registra os ouvintes globais passivos na janela.
   */
  bindEvents() {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', this.handleMouseLeave, { passive: true });
  }

  /**
   * Trata o evento de scroll, calculando o delta com clamp de segurança.
   */
  onScroll() {
    if (typeof window === 'undefined') return;

    const currentScrollY = window.scrollY || 0;
    const deltaY = currentScrollY - this.lastScrollY;

    // Clamp de velocidade máxima para evitar ejeção de partículas em scrolls gigantes
    const clampedDelta = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, deltaY));

    // Injeção de momento no vetor de velocidade
    this.scrollVelocity = clampedDelta;
    this.lastScrollY = currentScrollY;
    this.scrollY = currentScrollY;
  }

  /**
   * Trata movimento do cursor do mouse.
   */
  onMouseMove(e) {
    this.targetMouseX = e.clientX;
    this.targetMouseY = e.clientY;
    this.isMouseActive = true;
  }

  /**
   * Trata toques em telas móveis.
   */
  onTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      this.targetMouseX = e.touches[0].clientX;
      this.targetMouseY = e.touches[0].clientY;
      this.isMouseActive = true;
    }
  }

  /**
   * Desativa o feixe de repulsão quando o cursor deixa a janela.
   */
  onMouseLeave() {
    this.isMouseActive = false;
  }

  /**
   * Passo de atualização física executado a cada quadro de animação (requestAnimationFrame).
   */
  update() {
    // 1. Decaimento exponencial da velocidade de scroll (fricção)
    this.scrollVelocity *= this.friction;
    if (Math.abs(this.scrollVelocity) < 0.01) {
      this.scrollVelocity = 0;
    }

    // 2. Interpolação suave (Lerp) das coordenadas do cursor
    if (this.isMouseActive) {
      this.mouseX += (this.targetMouseX - this.mouseX) * this.lerpFactor;
      this.mouseY += (this.targetMouseY - this.mouseY) * this.lerpFactor;
    }
  }

  /**
   * Remove todos os listeners e limpa referências para evitar vazamentos de memória.
   */
  destroy() {
    if (typeof window === 'undefined') return;

    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}
