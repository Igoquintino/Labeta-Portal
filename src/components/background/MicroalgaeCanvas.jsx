/* ============================================================
 * [COMPONENTE] MicroalgaeCanvas
 * Descrição: Camada interativa de fundo do Portal LABETA.
 * Monta o canvas de microscopia óptica e gerencia o ciclo de vida do ParticleSystem
 * sincronizado ao ThemeContext, redimensionamentos e prefers-reduced-motion.
 * CSS correlato: MicroalgaeCanvas.css
 * ============================================================ */
import { useEffect, useRef } from 'react';
import { ParticleSystem } from './engine/ParticleSystem';
import { useTheme } from '../../context/useTheme';
import { useMicroscope } from '../../context/useMicroscope';
import './MicroalgaeCanvas.css';

export function MicroalgaeCanvas({
  mode = 'cinematic',
  zoom = 1.0,
  intensity = 1.0,
  isPaused = false,
  className = '',
}) {
  const canvasRef = useRef(null);
  const systemRef = useRef(null);

  // Consome configurações da ocular via MicroscopeContext com fallback seguro
  let activeMode = mode;
  let activeZoom = zoom;
  let activeIntensity = intensity;
  let activePaused = isPaused;

  try {
    const microscope = useMicroscope();
    if (microscope) {
      activeMode = microscope.mode ?? mode;
      activeZoom = microscope.zoom ?? zoom;
      activeIntensity = microscope.intensity ?? intensity;
      activePaused = microscope.isPaused ?? isPaused;
    }
  } catch {
    // Utiliza props padrão caso renderizado fora de MicroscopeProvider
  }

  // Consome tema com fallback seguro se testado isoladamente
  let currentTheme = 'dark';
  try {
    const themeContext = useTheme();
    if (themeContext && themeContext.theme) {
      currentTheme = themeContext.theme;
    }
  } catch {
    currentTheme = 'dark';
  }

  // Montagem e ciclo de vida do ParticleSystem
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detecta preferência de movimento reduzido
    const mediaQuery = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const initialReducedMotion = mediaQuery ? mediaQuery.matches : false;

    // Inicializa a engine
    const system = new ParticleSystem(canvas, {
      theme: currentTheme,
      zoom: activeZoom,
      intensity: activeIntensity,
      reducedMotion: initialReducedMotion,
    });
    systemRef.current = system;
    system.start();

    // Redimensionamento responsivo
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        system.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Pausa do rAF quando a aba estiver em segundo plano (economia de GPU e bateria)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        system.pause();
      } else if (!activePaused) {
        system.resume();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Reação dinâmica a alterações na preferência do sistema operacional
    const handleMotionChange = (e) => {
      system.setReducedMotion(e.matches);
    };
    if (mediaQuery && mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    }

    // Desmontagem e destruição completa
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (mediaQuery && mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      }
      system.destroy();
      systemRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronização de tema (Dark / Light)
  useEffect(() => {
    if (systemRef.current) {
      systemRef.current.setTheme(currentTheme);
    }
  }, [currentTheme]);

  // Sincronização de zoom da ocular
  useEffect(() => {
    if (systemRef.current) {
      systemRef.current.setZoom(activeZoom);
    }
  }, [activeZoom]);

  // Sincronização de pausa manual
  useEffect(() => {
    if (systemRef.current) {
      if (activePaused) {
        systemRef.current.pause();
      } else {
        systemRef.current.resume();
      }
    }
  }, [activePaused]);

  return (
    <div
      className={`microscope-container microscope-${activeMode} ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="microscope-canvas" />
      <div className="microscope-vignette" />
    </div>
  );
}

export default MicroalgaeCanvas;
