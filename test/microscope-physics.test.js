import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PhysicsTracker } from '../src/components/background/engine/PhysicsTracker';

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
