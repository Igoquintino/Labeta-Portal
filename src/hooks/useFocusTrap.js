/* ============================================================
 * [HOOK] useFocusTrap
 * Descrição: Prende navegação por Tab/Shift+Tab dentro do diálogo,
 *            trata fechamento por tecla Escape e trava scroll do body.
 * Rota/Uso: Utilizado por AdminModal, ContactModal e SpotlightSearch.
 * ============================================================ */
import { useEffect, useRef } from 'react';

/**
 * [HOOK] useFocusTrap — gerencia contenção de foco e bloqueio de rolagem.
 * @param {boolean} isOpen - Indica se o diálogo modal está visível.
 * @param {Function} onClose - Função de retorno invocada ao pressionar Escape.
 * @returns {React.RefObject} containerRef para anexar ao elemento modal raiz.
 */
export function useFocusTrap(isOpen, onClose) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Foca o primeiro elemento focável do modal
    const timer = setTimeout(() => {
      const firstFocusable = containerRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }, 50);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }

      if (event.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return containerRef;
}
