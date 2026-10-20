/* ============================================================
 * [COMPONENTE] ContactModal
 * Descrição: Modal de contatos rápidos: lista membros dinamicamente, copia e-mail institucional e abre Lattes.
 *            Integrado com useFocusTrap e camada de serviços reativa do Supabase.
 * Rota/Uso: Aberto pela Navbar (App.jsx).
 * Dados: membersService.fetchMembers() com fallback automático em members.json.
 * CSS correlato: ContactModal.css
 * ============================================================ */
import { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { fetchMembers } from '../../services/membersService';
import initialMembersData from '../../data/members.json';
import './ContactModal.css';

/** [FUNÇÃO] ContactModal — renderiza o modal de contatos rápidos. */
export function ContactModal({ isOpen, onClose }) {
    // [ESTADO] members — lista reativa de membros
    const [members, setMembers] = useState(initialMembersData);
    // [ESTADO] copiedId — id do membro cujo e-mail acabou de ser copiado
    const [copiedId, setCopiedId] = useState(null);

    // Contenção de foco, tecla Esc e bloqueio de rolagem via hook
    const modalRef = useFocusTrap(isOpen, onClose);

    /** [HOOK] useEffect — Carrega membros dinamicamente da camada de serviço ao abrir */
    useEffect(() => {
        let isMounted = true;
        async function loadContacts() {
            if (!isOpen) return;
            const { members: data } = await fetchMembers();
            if (isMounted && data && data.length > 0) {
                setMembers(data);
            }
        }
        loadContacts();
        return () => { isMounted = false; };
    }, [isOpen]);

    if (!isOpen) return null;

    /** [FUNÇÃO] handleCopyEmail — copia o e-mail para a área de transferência com feedback. */
    const handleCopyEmail = (id, email) => {
        if (!email) return;
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
                <div className="sr-only" aria-live="polite">
                    {copiedId ? "E-mail copiado com sucesso para a área de transferência." : ""}
                </div>

                {/* [SEÇÃO 1.1.2] .modal-header — <header> */}
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

                {/* [SEÇÃO 1.1.3] .members-contact-grid — <div> */}
                <div className="members-contact-grid">
                    {members.map((member) => (
                        <article key={member.id} className="member-card">
                            <div className="member-avatar-wrapper">
                                {member.avatar ? (
                                    <picture>
                                        {member.avatar.match(/\.(jpg|jpeg|png)$/i) && (
                                            <source
                                                srcSet={(member.avatar.startsWith('/') ? member.avatar : `/${member.avatar}`).replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                                                type="image/webp"
                                            />
                                        )}
                                        <img
                                            src={member.avatar.startsWith('/') ? member.avatar : `/${member.avatar}`}
                                            alt={`Foto de ${member.name}`}
                                            className="member-avatar-img"
                                            width="50"
                                            height="50"
                                        />
                                    </picture>
                                ) : (
                                    <div className="member-avatar-placeholder">
                                        {member.name ? member.name.charAt(0) : 'L'}
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
