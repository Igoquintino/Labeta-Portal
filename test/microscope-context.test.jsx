import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MicroscopeProvider } from '../src/context/MicroscopeContext';
import { useMicroscope } from '../src/context/useMicroscope';

describe('MicroscopeContext & useMicroscope', () => {
  it('provides default cinematic microscope configuration', () => {
    const { result } = renderHook(() => useMicroscope(), {
      wrapper: MicroscopeProvider,
    });

    expect(result.current.mode).toBe('cinematic');
    expect(result.current.zoom).toBe(1.0);
    expect(result.current.intensity).toBe(1.0);
    expect(result.current.isPaused).toBe(false);
  });

  it('allows pages to update configuration via setMicroscopeConfig', () => {
    const { result } = renderHook(() => useMicroscope(), {
      wrapper: MicroscopeProvider,
    });

    act(() => {
      result.current.setMicroscopeConfig({
        mode: 'ambient',
        zoom: 1.2,
        intensity: 0.5,
      });
    });

    expect(result.current.mode).toBe('ambient');
    expect(result.current.zoom).toBe(1.2);
    expect(result.current.intensity).toBe(0.5);
  });

  it('resets configuration back to defaults on resetMicroscopeConfig', () => {
    const { result } = renderHook(() => useMicroscope(), {
      wrapper: MicroscopeProvider,
    });

    act(() => {
      result.current.setMicroscopeConfig({
        mode: 'minimal',
        zoom: 1.4,
      });
    });
    expect(result.current.mode).toBe('minimal');

    act(() => {
      result.current.resetMicroscopeConfig();
    });

    expect(result.current.mode).toBe('cinematic');
    expect(result.current.zoom).toBe(1.0);
  });
});
