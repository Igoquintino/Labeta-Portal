import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SpeciesRenderer } from '../src/components/background/engine/SpeciesRenderer';

describe('SpeciesRenderer', () => {
  let renderer;
  let mockCtx;

  beforeEach(() => {
    renderer = new SpeciesRenderer();

    // Mock do CanvasRenderingContext2D
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      closePath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      drawImage: vi.fn(),
      filter: 'none',
      fillStyle: '#000',
      strokeStyle: '#000',
      lineWidth: 1,
      globalAlpha: 1,
    };
  });

  it('initializes with procedural Path2D caches and theme colors', () => {
    expect(renderer.isReady).toBe(true);
    expect(renderer.colors.dark).toBeDefined();
    expect(renderer.colors.light).toBeDefined();
    expect(renderer.colors.dark.diatom).toBe('#D6C28F');
    expect(renderer.colors.light.diatom).toBe('#9E6700');
  });

  it('renders a procedural desmid particle with bilateral green chloroplasts', () => {
    const particle = {
      x: 100,
      y: 150,
      rotation: 0.5,
      species: 'desmid-micrasterias',
      getRenderScale: () => 1.2,
      getRenderOpacity: () => 0.4,
    };

    renderer.render(mockCtx, particle, { theme: 'dark', zoom: 1.0 });

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.translate).toHaveBeenCalledWith(100, 150);
    expect(mockCtx.rotate).toHaveBeenCalledWith(0.5);
    expect(mockCtx.scale).toHaveBeenCalledWith(1.2, 1.2);
    expect(mockCtx.globalAlpha).toBe(0.4);
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('renders procedural cyanobacteria filament chain', () => {
    const particle = {
      x: 200,
      y: 200,
      rotation: 1.0,
      species: 'cyanobacteria-filament',
      getRenderScale: () => 0.8,
      getRenderOpacity: () => 0.3,
    };

    renderer.render(mockCtx, particle, { theme: 'light', zoom: 1.0 });

    expect(mockCtx.translate).toHaveBeenCalledWith(200, 200);
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('draws image sprite when loaded or falls back to procedural drawing', () => {
    const particle = {
      x: 300,
      y: 300,
      rotation: 0.2,
      species: 'diatom-1',
      getRenderScale: () => 1.0,
      getRenderOpacity: () => 0.5,
    };

    // Imagem ainda não carregada -> executa fallback procedural sem lançar erro
    expect(() => {
      renderer.render(mockCtx, particle, { theme: 'dark', zoom: 1.0 });
    }).not.toThrow();
    expect(mockCtx.restore).toHaveBeenCalled();

    // Simula imagem carregada no cache
    const mockImg = { complete: true, naturalWidth: 240, naturalHeight: 872 };
    renderer.sprites['diatom-1'] = mockImg;

    renderer.render(mockCtx, particle, { theme: 'dark', zoom: 1.0 });
    expect(mockCtx.drawImage).toHaveBeenCalled();
  });

  it('adapts stroke and fill colors dynamically when theme switches', () => {
    const darkColors = renderer.getThemePalette('dark');
    const lightColors = renderer.getThemePalette('light');

    expect(darkColors.chlorophyll).toBe('#4EA86E');
    expect(lightColors.chlorophyll).toBe('#165B33');
    expect(darkColors.diatom).toBe('#D6C28F');
    expect(lightColors.diatom).toBe('#9E6700');
  });
});
