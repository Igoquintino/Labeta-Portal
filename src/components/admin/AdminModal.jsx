import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './AdminModal.css';

export function AdminModal({ isOpen, onClose, title, children }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        // Focus primeiro elemento focável
        const timer = setTimeout(() => {
            const firstFocusable = modalRef.current?.querySelector('button, [href], input, select, textarea');
            firstFocusable?.focus();
        }, 50);

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
        <div className="admin-modal-overlay" onClick={onClose} role="presentation">
            <aside
                ref={modalRef}
                className="admin-modal-container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-modal-title"
            >
                <header className="admin-modal-header">
                    <div>
                        <span className="admin-modal-badge">Gestão LABETA</span>
                        <h2 id="admin-modal-title" className="admin-modal-title">{title}</h2>
                    </div>
                    <button
                        type="button"
                        className="admin-modal-close-btn"
                        onClick={onClose}
                        aria-label="Fechar diálogo de administração"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </header>

                <div className="admin-modal-body">
                    {children}
                </div>
            </aside>
        </div>
    );
}
