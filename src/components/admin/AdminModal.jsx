/* ============================================================
 * [COMPONENTE] AdminModal
 * Descrição: Diálogo modal genérico da área de gestão (Admin Invisível). Recebe o conteúdo via children.
 * Rota/Uso: Aberto por FloatingAdminBar e pelas páginas com edição inline.
 * Props: isOpen, onClose, title, children.
 * Dados: nenhum.
 * CSS correlato: AdminModal.css
 * ============================================================ */
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './AdminModal.css';

/** [FUNÇÃO] AdminModal — renderiza o diálogo com foco preso (focus trap), fechamento por Esc e bloqueio de scroll. */
export function AdminModal({ isOpen, onClose, title, children }) {
    // [ESTADO] Referência ao contêiner do diálogo (usada para foco e focus trap)
    const modalRef = useRef(null);

    /** [HOOK] useEffect — foca o 1º elemento, trata Esc/Tab e trava o scroll enquanto aberto. */
    useEffect(() => {
        if (!isOpen) return;

        // Focus primeiro elemento focável
        const timer = setTimeout(() => {
            const firstFocusable = modalRef.current?.querySelector('button, [href], input, select, textarea');
            firstFocusable?.focus();
        }, 50);

        /** [FUNÇÃO] handleKeyDown — Esc fecha; Tab/Shift+Tab circula o foco dentro do modal. */
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }

            if (event.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
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

    if (!isOpen) return null;

    return (
        /* [SEÇÃO 1] .admin-modal-overlay — fundo escurecido (clique fecha) */
        <div className="admin-modal-overlay" onClick={onClose} role="presentation">
            {/* [SEÇÃO 1.1] .admin-modal-container — caixa do diálogo */}
            <aside
                ref={modalRef}
                className="admin-modal-container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-modal-title"
            >
                {/* [SEÇÃO 1.1.1] .admin-modal-header — cabeçalho */}
                <header className="admin-modal-header">
                    <div>
                        {/* [SEÇÃO 1.1.1.1] .admin-modal-badge — selo */}
                        <span className="admin-modal-badge">Gestão LABETA</span>
                        {/* [SEÇÃO 1.1.1.2] .admin-modal-title — título */}
                        <h2 id="admin-modal-title" className="admin-modal-title">{title}</h2>
                    </div>
                    {/* [SEÇÃO 1.1.1.3] .admin-modal-close-btn — fechar */}
                    <button
                        type="button"
                        className="admin-modal-close-btn"
                        onClick={onClose}
                        aria-label="Fechar diálogo de administração"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </header>

                {/* [SEÇÃO 1.1.2] .admin-modal-body — conteúdo (children) */}
                <div className="admin-modal-body">
                    {children}
                </div>
            </aside>
        </div>
    );
}
