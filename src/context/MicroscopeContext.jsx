/* ============================================================
 * [CONTEXTO] MicroscopeContext
 * Descrição: Provedor global do estado da Lâmina Viva (ocular, foco e intensidade).
 * Permite que páginas individuais ajustem o modo ('cinematic', 'ambient', 'minimal')
 * e a escala de zoom óptico sem re-renderizar o canvas desnecessariamente.
 * ============================================================ */
import { useState, useCallback } from 'react';
import { MicroscopeContext } from './microscopeContext';

const DEFAULT_CONFIG = {
  mode: 'cinematic',
  zoom: 1.0,
  intensity: 1.0,
  isPaused: false,
};

export function MicroscopeProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const setMicroscopeConfig = useCallback((newConfig) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const resetMicroscopeConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  const setMode = useCallback((mode) => {
    setConfig((prev) => ({ ...prev, mode }));
  }, []);

  const setZoom = useCallback((zoom) => {
    setConfig((prev) => ({ ...prev, zoom }));
  }, []);

  const setIsPaused = useCallback((isPaused) => {
    setConfig((prev) => ({ ...prev, isPaused }));
  }, []);

  return (
    <MicroscopeContext.Provider
      value={{
        ...config,
        setMicroscopeConfig,
        resetMicroscopeConfig,
        setMode,
        setZoom,
        setIsPaused,
      }}
    >
      {children}
    </MicroscopeContext.Provider>
  );
}

export default MicroscopeProvider;
