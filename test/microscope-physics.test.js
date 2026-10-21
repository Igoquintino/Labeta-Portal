import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PhysicsTracker } from '../src/components/background/engine/PhysicsTracker';
import { MicroalgaParticle } from '../src/components/background/engine/MicroalgaParticle';

describe('PhysicsTracker', () => {
  let tracker;

  beforeEach(() => {
    // Reset window mock values
    window.scrollY = 0;
    tracker = new PhysicsTracker();
  });

  afterEach(() => {
    if (tracker) {
      tracker.destroy();
    }
    vi.restoreAllMocks();
  });

  it('initializes with default physical state', () => {
    expect(tracker.scrollY).toBe(0);
    expect(tracker.scrollVelocity).toBe(0);
    expect(tracker.mouseX).toBe(0);
    expect(tracker.mouseY).toBe(0);
    expect(tracker.isMouseActive).toBe(false);
  });

  it('tracks scroll velocity on window scroll event', () => {
    // Simula scroll para baixo
    window.scrollY = 150;
    window.dispatchEvent(new Event('scroll'));

    expect(tracker.scrollY).toBe(150);
    expect(tracker.scrollVelocity).toBeGreaterThan(0);
    expect(tracker.scrollVelocity).toBeLessThanOrEqual(60); // Clamped
  });

  it('clamps excessive scroll velocities', () => {
    // Simula salto enorme (ex: clique em skip link ou âncora)
    window.scrollY = 5000;
    window.dispatchEvent(new Event('scroll'));

    expect(tracker.scrollVelocity).toBeLessThanOrEqual(60);
    expect(tracker.scrollVelocity).toBeGreaterThan(0);
  });

  it('decays scroll velocity exponentially over time via update()', () => {
    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));

    const initialVelocity = tracker.scrollVelocity;
    expect(initialVelocity).toBeGreaterThan(0);

    // Avança 5 passos de física
    for (let i = 0; i < 5; i++) {
      tracker.update(16);
    }

    expect(tracker.scrollVelocity).toBeLessThan(initialVelocity);

    // Após decaimento suficiente (~100 frames), decai para zero
    for (let i = 0; i < 120; i++) {
      tracker.update(16);
    }
    expect(tracker.scrollVelocity).toBe(0);
  });

  it('tracks mouse coordinates and activates mouse influence', () => {
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: 320,
      clientY: 240,
    });
    window.dispatchEvent(mouseEvent);

    expect(tracker.isMouseActive).toBe(true);
    expect(tracker.targetMouseX).toBe(320);
    expect(tracker.targetMouseY).toBe(240);

    // Suaviza via Lerp
    tracker.update(16);
    expect(tracker.mouseX).toBeGreaterThan(0);
    expect(tracker.mouseY).toBeGreaterThan(0);
  });

  it('handles mouseleave by setting isMouseActive to false', () => {
    const mouseEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
    window.dispatchEvent(mouseEvent);
    expect(tracker.isMouseActive).toBe(true);

    window.dispatchEvent(new Event('mouseleave'));
    expect(tracker.isMouseActive).toBe(false);
  });

  it('handles touchmove on mobile devices', () => {
    const touchEvent = new Event('touchmove');
    touchEvent.touches = [{ clientX: 200, clientY: 400 }];
    window.dispatchEvent(touchEvent);

    expect(tracker.isMouseActive).toBe(true);
    expect(tracker.targetMouseX).toBe(200);
    expect(tracker.targetMouseY).toBe(400);
  });

  it('removes all event listeners on destroy()', () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');
    tracker.destroy();

    expect(removeListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
  });
});

describe('MicroalgaParticle', () => {
  const viewportWidth = 1000;
  const viewportHeight = 800;

  it('initializes with position inside viewport, species and depth z', () => {
    const particle = new MicroalgaParticle({
      viewportWidth,
      viewportHeight,
    });

    expect(particle.x).toBeGreaterThanOrEqual(0);
    expect(particle.x).toBeLessThanOrEqual(viewportWidth);
    expect(particle.y).toBeGreaterThanOrEqual(0);
    expect(particle.y).toBeLessThanOrEqual(viewportHeight);
    expect(particle.z).toBeGreaterThanOrEqual(0.15);
    expect(particle.z).toBeLessThanOrEqual(1.0);
    expect(particle.species).toBeDefined();
    expect(typeof particle.rotation).toBe('number');
  });

  it('applies brownian oscillation and rotation during update() without input', () => {
    const particle = new MicroalgaParticle({
      viewportWidth,
      viewportHeight,
      x: 500,
      y: 400,
      z: 0.8,
    });

    const mockTracker = {
      scrollVelocity: 0,
      isMouseActive: false,
      mouseX: 0,
      mouseY: 0,
    };

    const initialRotation = particle.rotation;
    particle.update(mockTracker, viewportWidth, viewportHeight, 1000);

    // Rotação axial contínua
    expect(particle.rotation).not.toBe(initialRotation);
  });

  it('reacts to hydrodynamic scroll impulse proportional to depth z', () => {
    const deepParticle = new MicroalgaParticle({
      viewportWidth,
      viewportHeight,
      x: 500,
      y: 400,
      z: 0.2, // Fundo desfocado
    });

    const focalParticle = new MicroalgaParticle({
      viewportWidth,
      viewportHeight,
      x: 500,
      y: 400,
      z: 0.9, // Plano focal nítido
    });

    const scrollTracker = {
      scrollVelocity: 20, // Rápido para baixo
      isMouseActive: false,
      mouseX: 0,
      mouseY: 0,
    };

    deepParticle.update(scrollTracker, viewportWidth, viewportHeight, 16);
    focalParticle.update(scrollTracker, viewportWidth, viewportHeight, 16);

    // O deslocamento no plano focal deve ser significativamente maior que no fundo
    const deepDeltaY = Math.abs(deepParticle.vy);
    const focalDeltaY = Math.abs(focalParticle.vy);
    expect(focalDeltaY).toBeGreaterThan(deepDeltaY);
  });

  it('is repelled radially by active mouse cursor within influence radius', () => {
    const particle = new MicroalgaParticle({
      viewportWidth,
      viewportHeight,
      x: 300,
      y: 300,
      z: 0.8,
    });

    const mouseTracker = {
      scrollVelocity: 0,
      isMouseActive: true,
      mouseX: 280, // Cursor a 28px de distância
      mouseY: 280,
    };

    particle.update(mouseTracker, viewportWidth, viewportHeight, 16);

    // Partícula deve ser empurrada para longe do cursor (x > 300 e y > 300)
    expect(particle.vx).toBeGreaterThan(0);
    expect(particle.vy).toBeGreaterThan(0);
  });

  it('wraps around toroidally when exceeding viewport boundaries', () => {
    const particle = new MicroalgaParticle({
      viewportWidth,
      viewportHeight,
      x: viewportWidth + 150, // Ultrapassou a borda direita
      y: 400,
      z: 0.5,
    });

    const tracker = {
      scrollVelocity: 0,
      isMouseActive: false,
      mouseX: 0,
      mouseY: 0,
    };

    particle.update(tracker, viewportWidth, viewportHeight, 16);

    // Deve ter reaparecido na margem esquerda (próximo de 0 ou ligeiramente negativo)
    expect(particle.x).toBeLessThan(viewportWidth / 2);
  });

  it('calculates render scale incorporating depth z and optical zoom', () => {
    const particle = new MicroalgaParticle({
      viewportWidth,
      viewportHeight,
      z: 0.8,
    });

    const normalScale = particle.getRenderScale(1.0);
    const zoomedScale = particle.getRenderScale(1.4);

    expect(zoomedScale).toBeGreaterThan(normalScale);
  });
});
