import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MicroalgaeCanvas } from '../src/components/background/MicroalgaeCanvas';
import { ThemeContext } from '../src/context/themeContext';

describe('MicroalgaeCanvas Component', () => {
  beforeEach(() => {
    // Mock do getContext do HTMLCanvasElement
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
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
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithTheme = (ui, theme = 'dark') => {
    return render(
      <ThemeContext.Provider value={{ theme, toggleTheme: vi.fn() }}>
        {ui}
      </ThemeContext.Provider>
    );
  };

  it('renders fixed canvas container with aria-hidden="true" for screen reader accessibility', () => {
    const { container } = renderWithTheme(<MicroalgaeCanvas />);
    const canvasContainer = container.querySelector('.microscope-container');
    const canvas = container.querySelector('canvas.microscope-canvas');
    const vignette = container.querySelector('.microscope-vignette');

    expect(canvasContainer).toBeDefined();
    expect(canvasContainer).not.toBeNull();
    expect(canvasContainer.getAttribute('aria-hidden')).toBe('true');
    expect(canvas).toBeDefined();
    expect(canvas).not.toBeNull();
    expect(vignette).toBeDefined();
    expect(vignette).not.toBeNull();
  });

  it('applies mode classes (cinematic, ambient, minimal)', () => {
    const { container } = renderWithTheme(<MicroalgaeCanvas mode="ambient" />);
    const canvasContainer = container.querySelector('.microscope-container');

    expect(canvasContainer.className).toContain('microscope-ambient');
  });

  it('cleans up ParticleSystem and event listeners when unmounted', () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderWithTheme(<MicroalgaeCanvas />);

    unmount();

    expect(removeListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });
});
