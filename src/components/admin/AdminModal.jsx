/* ============================================================
 * [COMPONENTE] AdminModal
 * Descrição: Diálogo modal genérico da área de gestão (Admin Invisível).
 *            Utiliza o hook useFocusTrap para contenção acessível do foco.
 * Rota/Uso: Aberto por FloatingAdminBar e pelas páginas com edição inline.
 * Props: isOpen, onClose, title, children.
 * Dados: nenhum.
 * CSS correlato: AdminModal.css
 * ============================================================ */
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './AdminModal.css';

/** [FUNÇÃO] AdminModal — renderiza o diálogo com foco contido via useFocusTrap. */
export function AdminModal({ isOpen, onClose, title, children }) {
    // Hook compartilhado de contenção de foco, tecla Esc e trava de rolagem
    const modalRef = useFocusTrap(isOpen, onClose);

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
