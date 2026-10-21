/**
 * [CLASSE] SpeciesRenderer
 * Descrição: Renderizador híbrido de espécies de microalgas amazônicas para o Canvas 2D da Lâmina Viva.
 * Suporta tanto o desenho com sprites fotomicroscópicos reais em WebP (public/diatom_img)
 * quanto a geração vetorial procedural com Path2D para desmídias, cianobactérias e detritos de seston.
 * Adapta coloração e iluminação dinamicamente entre os modos Dark (Amazônia Noturna) e Light (Amazônia Diurna).
 */

const SPRITE_MAP = {
  'diatom-1': '/diatom_img/Diatom_1.webp',
  'diatom-2': '/diatom_img/Diatom_2.webp',
  'diatom-3': '/diatom_img/Diatom_3.webp',
  'diatom-generic': '/diatom_img/Diatom_.webp',
};

const THEME_COLORS = {
  dark: {
    diatom: '#D6C28F', // Dourado Aluvial
    diatomGlow: 'rgba(214, 194, 143, 0.35)',
    chlorophyll: '#4EA86E', // Verde Clorofila
    chlorophyllGlow: 'rgba(78, 168, 110, 0.35)',
    cyan: '#5BB3FF', // Ciano Noturno
    debris: '#A0B0A4', // Sílica / matéria orgânica
  },
  light: {
    diatom: '#9E6700', // Âmbar Fluvial (contraste de fase)
    diatomGlow: 'rgba(158, 103, 0, 0.20)',
    chlorophyll: '#165B33', // Verde Floresta Institucional
    chlorophyllGlow: 'rgba(22, 91, 51, 0.20)',
    cyan: '#0284C7', // Azul Fluvial
    debris: '#43574C', // Verde Ardósia
  },
};

export class SpeciesRenderer {
  constructor() {
    this.isReady = true;
    this.colors = THEME_COLORS;
    this.sprites = {};

    this.preloadSprites();
  }

  /**
   * Pré-carrega os sprites WebP reais de diatomáceas em cache de imagem.
   */
  preloadSprites() {
    if (typeof window === 'undefined' || typeof Image === 'undefined') return;

    Object.entries(SPRITE_MAP).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.sprites[key] = img;
      };
      // Fallback em caso de erro na rede
      img.onerror = () => {
        delete this.sprites[key];
      };
    });
  }

  /**
   * Retorna a paleta de cores correspondente ao tema ativo.
   * @param {string} theme - 'dark' ou 'light'
   */
  getThemePalette(theme = 'dark') {
    return this.colors[theme] || this.colors.dark;
  }

  /**
   * Renderiza uma partícula no contexto do Canvas.
   * @param {CanvasRenderingContext2D} ctx - Contexto 2D do Canvas.
   * @param {Object} particle - Instância de MicroalgaParticle.
   * @param {Object} options - { theme, zoom, baseOpacity }.
   */
  render(ctx, particle, options = {}) {
    const { theme = 'dark', zoom = 1.0, baseOpacity = 0.4 } = options;
    const colors = this.getThemePalette(theme);

    const scale = particle.getRenderScale ? particle.getRenderScale(zoom) : 1.0;
    const opacity = particle.getRenderOpacity ? particle.getRenderOpacity(baseOpacity) : 0.4;

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation || 0);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    // Se houver sprite correspondente e carregado, desenha a fotomicrografia real
    const spriteImg = this.sprites[particle.species];
    if (spriteImg && spriteImg.complete && spriteImg.naturalWidth > 0) {
      this.renderSprite(ctx, spriteImg, theme);
    } else {
      // Caso contrário, executa desenho vetorial procedural de acordo com a espécie
      this.renderProcedural(ctx, particle.species, colors, theme);
    }

    ctx.restore();
  }

  /**
   * Desenha o sprite WebP real centralizado.
   */
  renderSprite(ctx, img, theme) {
    const targetHeight = 85;
    const aspect = img.naturalWidth / img.naturalHeight;
    const targetWidth = targetHeight * aspect;

    if (theme === 'dark') {
      ctx.filter = 'brightness(1.08) drop-shadow(0 0 6px rgba(214, 194, 143, 0.3))';
    } else {
      ctx.filter = 'brightness(0.88) contrast(1.15)';
    }

    ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
    ctx.filter = 'none';
  }

  /**
   * Desenho procedural de espécimes caso o sprite não exista ou seja espécie procedural.
   */
  renderProcedural(ctx, species, colors, theme) {
    switch (species) {
      case 'desmid-micrasterias':
        this.renderDesmid(ctx, colors);
        break;
      case 'cyanobacteria-filament':
        this.renderCyanobacteria(ctx, colors);
        break;
      case 'organic-debris':
        this.renderDebris(ctx, colors);
        break;
      case 'diatom-1':
      case 'diatom-2':
      case 'diatom-3':
      case 'diatom-generic':
      default:
        this.renderDiatomNavicula(ctx, colors, theme);
        break;
    }
  }

  /**
   * Desenha proceduralmente uma Desmídia bilateral (Micrasterias / Cosmarium).
   */
  renderDesmid(ctx, colors) {
    ctx.fillStyle = colors.chlorophyll;
    ctx.strokeStyle = colors.chlorophyllGlow;
    ctx.lineWidth = 1.5;

    // Duas semicélulas espelhadas com istmo central
    const lobeWidth = 14;
    const lobeHeight = 18;

    // Semicélula esquerda
    ctx.beginPath();
    ctx.arc(-lobeWidth / 2 - 2, 0, lobeHeight / 2, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(-2, 0, 3, Math.PI * 1.5, Math.PI * 0.5, true);
    ctx.fill();
    ctx.stroke();

    // Semicélula direita
    ctx.beginPath();
    ctx.arc(lobeWidth / 2 + 2, 0, lobeHeight / 2, Math.PI * 1.5, Math.PI * 0.5);
    ctx.arc(2, 0, 3, Math.PI * 0.5, Math.PI * 1.5, true);
    ctx.fill();
    ctx.stroke();

    // Plastídio central (cloroplasto verde intenso)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(-lobeWidth / 2, 0, 2.5, 0, Math.PI * 2);
    ctx.arc(lobeWidth / 2, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Desenha proceduralmente uma cianobactéria filamentosa (Anabaena / Nostoc).
   */
  renderCyanobacteria(ctx, colors) {
    ctx.fillStyle = colors.chlorophyll;
    ctx.strokeStyle = colors.cyan;
    ctx.lineWidth = 1;

    const beadCount = 7;
    const beadRadius = 3.5;
    const amplitude = 5;

    ctx.beginPath();
    for (let i = 0; i < beadCount; i++) {
      const x = (i - beadCount / 2) * (beadRadius * 2 + 1);
      const y = Math.sin(i * 0.8) * amplitude;

      // Heterocisto maior no meio da cadeia
      const r = i === 3 ? beadRadius * 1.35 : beadRadius;

      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Desenha proceduralmente uma Diatomácea Naviculoide com frústula e rafe central.
   */
  renderDiatomNavicula(ctx, colors, theme) {
    ctx.strokeStyle = colors.diatom;
    ctx.fillStyle = theme === 'dark' ? 'rgba(214, 194, 143, 0.08)' : 'rgba(158, 103, 0, 0.06)';
    ctx.lineWidth = 1.8;

    const length = 46;
    const width = 14;

    // Frústula em formato navicular fusiforme
    ctx.beginPath();
    ctx.moveTo(0, -length / 2);
    ctx.bezierCurveTo(width, -length / 4, width, length / 4, 0, length / 2);
    ctx.bezierCurveTo(-width, length / 4, -width, -length / 4, 0, -length / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Linha axial da Rafe
    ctx.beginPath();
    ctx.moveTo(0, -length / 2 + 5);
    ctx.lineTo(0, length / 2 - 5);
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Nódulos polares
    ctx.beginPath();
    ctx.arc(0, -length / 2 + 6, 1.5, 0, Math.PI * 2);
    ctx.arc(0, length / 2 - 6, 1.5, 0, Math.PI * 2);
    ctx.arc(0, 0, 2, 0, Math.PI * 2); // Nódulo central
    ctx.fillStyle = colors.diatom;
    ctx.fill();
  }

  /**
   * Desenha microdetritos e seston fluvial em suspensão.
   */
  renderDebris(ctx, colors) {
    ctx.fillStyle = colors.debris;
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
