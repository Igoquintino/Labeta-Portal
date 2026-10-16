/* ============================================================
 * [COMPONENTE] ToastNotification
 * Descrição: Aviso temporário (sucesso, erro ou info) que some sozinho após `duration` ms.
 * Rota/Uso: Usado por páginas/modais que recebem feedback (ex.: News, Booking, admin).
 * Props: message, type ('success' | 'error' | 'info'), onClose, duration.
 * Dados: nenhum.
 * CSS correlato: ToastNotification.css
 * ============================================================ */
import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './ToastNotification.css';

/** [FUNÇÃO] ToastNotification — exibe a mensagem e agenda o fechamento automático. */
export function ToastNotification({ message, type = 'info', onClose, duration = 4000 }) {
    /** [HOOK] useEffect — dispara onClose após `duration` ms e limpa o timer ao desmontar. */
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    // [ESTADO] Mapa tipo → ícone (classes .toast-icon-*)
    const icons = {
        success: <CheckCircle2 size={18} className="toast-icon toast-icon-success" />,
        error: <AlertCircle size={18} className="toast-icon toast-icon-error" />,
        info: <Info size={18} className="toast-icon toast-icon-info" />
    };

    return (
        /* [SEÇÃO 1] .toast-notification — contêiner (+ variante .toast-{type}) */
        <aside className={`toast-notification toast-${type}`} role="status" aria-live="polite">
            {/* [SEÇÃO 1.1] .toast-content — ícone e mensagem */}
            <div className="toast-content">
                {/* [SEÇÃO 1.1.1] .toast-icon-{type} — ícone por tipo */}
                {icons[type] || icons.info}
                {/* [SEÇÃO 1.1.2] .toast-message — texto */}
                <span className="toast-message">{message}</span>
            </div>
            {/* [SEÇÃO 1.2] .toast-close-btn — botão de fechar (só se onClose existir) */}
            {onClose && (
                <button
                    type="button"
                    className="toast-close-btn"
                    onClick={onClose}
                    aria-label="Fechar notificação"
                >
                    <X size={14} />
                </button>
            )}
        </aside>
    );
}
