/* ============================================================
 * [COMPONENTE] Footer
 * Descrição: Rodapé institucional com marca, endereço, e-mail e copyright.
 * Rota/Uso: Renderizado globalmente em todas as páginas (App.jsx).
 * Dados: nenhum (ano atual gerado via Date).
 * CSS correlato: Footer.css
 * ============================================================ */
import { MapPin, Mail } from 'lucide-react';
import './Footer.css';

/** [FUNÇÃO] Footer — renderiza o rodapé semântico (<footer>) do portal. */
export function Footer() {
    return (
        /* [SEÇÃO 1] .portal-footer — rodapé raiz */
        <footer className="portal-footer" role="contentinfo">
            {/* [SEÇÃO 1.1] .footer-container — wrapper das colunas */}
            <div className="footer-container">

                {/* [SEÇÃO 1.1.1] .footer-brand — marca LABETA */}
                <div className="footer-brand">
                    {/* [SEÇÃO 1.1.1.1] .brand-logo-img — logotipo */}
                    <img
                        src="/logo-labeta.png"
                        alt="Logotipo Oficial LABETA"
                        className="brand-logo-img"
                        width="36"
                        height="36"
                    />
                    {/* [SEÇÃO 1.1.1.2] .footer-title — nome */}
                    <h3 className="footer-title">LABETA</h3>
                    {/* [SEÇÃO 1.1.1.3] .footer-desc — descrição */}
                    <p className="footer-desc">Laboratório de Ecologia e Taxonomia de Algas</p>
                    {/* [SEÇÃO 1.1.1.4] .footer-tagline — slogan */}
                    <span className="footer-tagline">Algas da Amazônia</span>
                </div>

                {/* [SEÇÃO 1.1.2] .footer-info — endereço e e-mail */}
                <div className="footer-info">
                    {/* [SEÇÃO 1.1.2.1] .footer-item — endereço */}
                    <div className="footer-item">
                        {/* [SEÇÃO 1.1.2.1.1] .footer-icon — ícone de localização */}
                        <MapPin size={18} className="footer-icon" aria-hidden="true" />
                        <span>UFOPA – Unidade Tapajós, Bloco 09, sala 06 — Santarém, Pará</span>
                    </div>
                    {/* [SEÇÃO 1.1.2.2] .footer-item — e-mail */}
                    <div className="footer-item">
                        <Mail size={18} className="footer-icon" aria-hidden="true" />
                        {/* [SEÇÃO 1.1.2.2.1] .footer-email-link — link mailto */}
                        <a href="mailto:labeta.icta@ufopa.edu.br" className="footer-email-link">
                            labeta.icta@ufopa.edu.br
                        </a>
                    </div>
                </div>

            </div>

            {/* [SEÇÃO 1.2] .footer-bottom — copyright */}
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} LABETA - UFOPA. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}
