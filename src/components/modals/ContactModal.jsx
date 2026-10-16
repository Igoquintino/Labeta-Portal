/* ============================================================
 * [COMPONENTE] ContactModal
 * Descrição: Modal de contatos rápidos: lista membros, copia e-mail institucional e abre Lattes.
 * Rota/Uso: Aberto pela Navbar (App.jsx).
 * Dados: src/data/members.json
 * CSS correlato: ContactModal.css
 * ============================================================ */
import { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import membersData from '../../data/members.json';
import './ContactModal.css';

/** [FUNÇÃO] ContactModal — renderiza o modal; fecha por Esc ou clique no fundo. */
export function ContactModal({ isOpen, onClose }) {
    // [ESTADO] copiedId — id do membro cujo e-mail acabou de ser copiado (feedback "Copiado!")
    const [copiedId, setCopiedId] = useState(null);
    // [ESTADO] modalRef — referência ao diálogo (foco/focus trap)
    const modalRef = useRef(null);

    /** [HOOK] useEffect — foco inicial, Esc, focus trap e bloqueio de scroll enquanto aberto. */
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

    /** [FUNÇÃO] handleCopyEmail — copia o e-mail para a área de transferência e mostra feedback temporário. */
    const handleCopyEmail = (id, email) => {
        navigator.clipboard.writeText(email);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        /* [SEÇÃO 1] .modal-overlay — <div> */
        <div className="modal-overlay" onClick={onClose} role="presentation">
            {/* [SEÇÃO 1.1] .modal-container — <aside> */}
            <aside
                ref={modalRef}
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-modal-title"
            >
                {/* Região viva para leitor de tela anunciar cópia */}
                {/* [SEÇÃO 1.1.1] .sr-only — <div> */}
                <div className="sr-only" aria-live="polite">
                    {copiedId ? "E-mail copiado com sucesso para a área de transferência." : ""}
                </div>

                {/* [SEÇÃO 1.1.2] .modal-header — <header> */}
                <header className="modal-header">
                    <div>
                        {/* [SEÇÃO 1.1.2.1.1] .modal-badge — <span> */}
                        <span className="modal-badge">Equipe &amp; Pesquisa</span>
                        {/* [SEÇÃO 1.1.2.1.2] .modal-title — <h2> */}
                        <h2 id="contact-modal-title" className="modal-title">Contatos Rápidos do LABETA</h2>
                    </div>
                    {/* [SEÇÃO 1.1.2.2] .modal-close-btn — <button> */}
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Fechar janela de contatos"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </header>

                {/* [SEÇÃO 1.1.3] .members-contact-grid — <div> */}
                <div className="members-contact-grid">
                    {membersData.map((member) => (
                        /* [SEÇÃO 1.1.3.1] .member-card — <article> */
                        <article key={member.id} className="member-card">
                            {/* [SEÇÃO 1.1.3.1.1] .member-avatar-wrapper — <div> */}
                            <div className="member-avatar-wrapper">
                                {member.avatar ? (
                                    /* [SEÇÃO 1.1.3.1.1.1] .member-avatar-img — <img> */
                                    <img
                                        src={member.avatar.startsWith('/') ? member.avatar : `/${member.avatar}`}
                                        alt={`Foto de ${member.name}`}
                                        className="member-avatar-img"
                                        width="50"
                                        height="50"
                                    />
                                ) : (
                                    /* [SEÇÃO 1.1.3.1.1.2] .member-avatar-placeholder — <div> */
                                    <div className="member-avatar-placeholder">
                                        {member.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* [SEÇÃO 1.1.3.1.2] .member-details — <div> */}
                            <div className="member-details">
                                {/* [SEÇÃO 1.1.3.1.2.1] .member-name — <h3> */}
                                <h3 className="member-name">{member.name}</h3>
                                {/* [SEÇÃO 1.1.3.1.2.2] .member-role — <span> */}
                                <span className="member-role">{member.role}</span>

                                {/* [SEÇÃO 1.1.3.1.2.3] .member-actions — <div> */}
                                <div className="member-actions">
                                    {/* [SEÇÃO 1.1.3.1.2.3.1] .copy-email-btn — <button> */}
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
                                                {/* [SEÇÃO 1.1.3.1.2.3.1.4] .email-text — <span> */}
                                                <span className="email-text">{member.email}</span>
                                            </>
                                        )}
                                    </button>

                                    {member.lattes && !member.lattes.includes('0000000000000000') ? (
                                        /* [SEÇÃO 1.1.3.1.2.3.1.5] .lattes-btn — <a> */
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
                                        /* [SEÇÃO 1.1.3.1.2.3.1.6] .lattes-btn .disabled — <span> */
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