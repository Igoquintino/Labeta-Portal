import { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import membersData from '../../data/members.json';
import './ContactModal.css';

export function ContactModal({ isOpen, onClose }) {
    const [copiedId, setCopiedId] = useState(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            const firstFocusable = modalRef.current?.querySelector('button, [href]');
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

    const handleCopyEmail = (id, email) => {
        navigator.clipboard.writeText(email);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="presentation">
            <aside
                ref={modalRef}
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-modal-title"
            >
                {/* Região viva para leitor de tela anunciar cópia */}
                <div className="sr-only" aria-live="polite">
                    {copiedId ? "E-mail copiado com sucesso para a área de transferência." : ""}
                </div>

                <header className="modal-header">
                    <div>
                        <span className="modal-badge">Equipe &amp; Pesquisa</span>
                        <h2 id="contact-modal-title" className="modal-title">Contatos Rápidos do LABETA</h2>
                    </div>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Fechar janela de contatos"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </header>

                <div className="members-contact-grid">
                    {membersData.map((member) => (
                        <article key={member.id} className="member-card">
                            <div className="member-avatar-wrapper">
                                {member.avatar ? (
                                    <img
                                        src={member.avatar.startsWith('/') ? member.avatar : `/${member.avatar}`}
                                        alt={`Foto de ${member.name}`}
                                        className="member-avatar-img"
                                        width="50"
                                        height="50"
                                    />
                                ) : (
                                    <div className="member-avatar-placeholder">
                                        {member.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="member-details">
                                <h3 className="member-name">{member.name}</h3>
                                <span className="member-role">{member.role}</span>

                                <div className="member-actions">
                                    <button
                                        type="button"
                                        className={`copy-email-btn ${copiedId === member.id ? 'copied' : ''}`}
                                        onClick={() => handleCopyEmail(member.id, member.email)}
                                        title={`Copiar ${member.email}`}
                                        aria-label={`Copiar e-mail de ${member.name}: ${member.email}`}
                                    >
                                        {copiedId === member.id ? (
                                            <>
                                                <Check size={14} aria-hidden="true" />
                                                <span>Copiado!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} aria-hidden="true" />
                                                <span className="email-text">{member.email}</span>
                                            </>
                                        )}
                                    </button>

                                    {member.lattes && !member.lattes.includes('0000000000000000') ? (
                                        <a
                                            href={member.lattes}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="lattes-btn"
                                            title={`Currículo Lattes de ${member.name} (abre em nova aba)`}
                                            aria-label={`Currículo Lattes de ${member.name} (abre em nova aba)`}
                                        >
                                            <span>Lattes</span>
                                            <ExternalLink size={12} aria-hidden="true" />
                                        </a>
                                    ) : (
                                        <span className="lattes-btn disabled" title="Currículo Lattes em atualização">
                                            <span>Lattes em atualização</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </aside>
        </div>
    );
}