import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './ToastNotification.css';

export function ToastNotification({ message, type = 'info', onClose, duration = 4000 }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const icons = {
        success: <CheckCircle2 size={18} className="toast-icon toast-icon-success" />,
        error: <AlertCircle size={18} className="toast-icon toast-icon-error" />,
        info: <Info size={18} className="toast-icon toast-icon-info" />
    };

    return (
        <aside className={`toast-notification toast-${type}`} role="status" aria-live="polite">
            <div className="toast-content">
                {icons[type] || icons.info}
                <span className="toast-message">{message}</span>
            </div>
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
