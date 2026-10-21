/* ============================================================
 * [HOOK] useMicroscope
 * Descrição: Atalho para consumir o MicroscopeContext (mode, zoom, intensity, setMicroscopeConfig).
 * ============================================================ */
import { useContext } from 'react';
import { MicroscopeContext } from './microscopeContext';

export function useMicroscope() {
  const context = useContext(MicroscopeContext);
  if (!context) {
    throw new Error('useMicroscope deve ser utilizado dentro de um MicroscopeProvider');
  }
  return context;
}

export default useMicroscope;
