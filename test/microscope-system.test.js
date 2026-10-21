import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ParticleSystem } from '../src/components/background/engine/ParticleSystem';

describe('ParticleSystem', () => {
  let mockCanvas;
  let mockCtx;
  let system;

  beforeEach(() => {
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      closePath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      drawImage: vi.fn(),
      globalAlpha: 1,
    };

    mockCanvas = {
      getContext: vi.fn().mockReturnValue(mockCtx),
      width: 1000,
      height: 800,
      style: {},
    };
  });

  afterEach(() => {
    if (system) {
      system.destroy();
    }
    vi.restoreAllMocks();
  });

  it('allocates particle budget adaptively based on viewport width', () => {
    // Mobile (< 768px)
    const mobileSystem = new ParticleSystem(mockCanvas, { width: 400, height: 800 });
    expect(mobileSystem.particles.length).toBeGreaterThanOrEqual(18);
    expect(mobileSystem.particles.length).toBeLessThanOrEqual(28);
    mobileSystem.destroy();

    // Desktop (> 1024px)
    const desktopSystem = new ParticleSystem(mockCanvas, { width: 1440, height: 900 });
    expect(desktopSystem.particles.length).toBeGreaterThanOrEqual(50);
    expect(desktopSystem.particles.length).toBeLessThanOrEqual(70);
    desktopSystem.destroy();
  });

  it('sorts particles along Z axis for depth-of-field realism', () => {
    system = new ParticleSystem(mockCanvas, { width: 1000, height: 800 });

    for (let i = 0; i < system.particles.length - 1; i++) {
      expect(system.particles[i].z).toBeLessThanOrEqual(system.particles[i + 1].z);
    }
  });

  it('resizes canvas buffer clamping devicePixelRatio to 2.0', () => {
    window.devicePixelRatio = 3.0; // Tela Retina 3x
    system = new ParticleSystem(mockCanvas, { width: 1000, height: 800 });

    system.resize(1200, 900);

    // DPR deve ter sido clampado em 2.0 -> largura = 1200 * 2 = 2400
    expect(mockCanvas.width).toBe(2400);
    expect(mockCanvas.height).toBe(1800);
    expect(mockCtx.scale).toHaveBeenCalledWith(2, 2);
  });

  it('executes a simulation tick without throwing, clearing canvas and updating particles', () => {
    system = new ParticleSystem(mockCanvas, { width: 1000, height: 800 });

    system.tick(100);

    expect(mockCtx.clearRect).toHaveBeenCalled();
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('honors reduced motion by drawing a single frame without scheduling continuous loops', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    system = new ParticleSystem(mockCanvas, {
      width: 1000,
      height: 800,
      reducedMotion: true,
    });

    system.start();

    // No modo reduzido, desenha o quadro estático mas não agenda o próximo rAF
    expect(mockCtx.clearRect).toHaveBeenCalled();
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it('supports pause and resume lifecycle without memory leaks', () => {
    system = new ParticleSystem(mockCanvas, { width: 1000, height: 800 });
    system.start();

    system.pause();
    expect(system.isPaused).toBe(true);

    mockCtx.clearRect.mockClear();
    system.tick(200);
    // Em pausa, tick não desenha nada
    expect(mockCtx.clearRect).not.toHaveBeenCalled();

    system.resume();
    expect(system.isPaused).toBe(false);
  });
});
