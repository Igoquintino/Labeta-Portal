/* ============================================================
 * [COMPONENTE] RouteLoadingSkeleton
 * Descrição: Esqueleto e indicador visual acessível para Suspense.
 * Rota/Uso: Fallback de carregamento de rotas com React.lazy.
 * CSS correlato: RouteLoadingSkeleton.css
 * ============================================================ */
import './RouteLoadingSkeleton.css';

/**
 * [FUNÇÃO] RouteLoadingSkeleton
 * Renderiza um spinner e texto de carregamento com semântica de acessibilidade aria-live.
 */
export function RouteLoadingSkeleton({ message = 'Carregando página...' }) {
  return (
    <div className="route-loading-container" role="status" aria-live="polite">
      <div className="route-loading-spinner" aria-hidden="true" />
      <p className="route-loading-text">{message}</p>
    </div>
  );
}
