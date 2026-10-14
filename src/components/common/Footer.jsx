import { MapPin, Mail } from 'lucide-react';
import './Footer.css';

export function Footer() {
    return (
        <footer className="portal-footer" role="contentinfo">
            <div className="footer-container">

                <div className="footer-brand">
                    <img
                        src="/logo-labeta.png"
                        alt="Logotipo Oficial LABETA"
                        className="brand-logo-img"
                        width="36"
                        height="36"
                    />
                    <h3 className="footer-title">LABETA</h3>
                    <p className="footer-desc">Laboratório de Ecologia e Taxonomia de Algas</p>
                    <span className="footer-tagline">Algas da Amazônia</span>
                </div>

                <div className="footer-info">
                    <div className="footer-item">
                        <MapPin size={18} className="footer-icon" aria-hidden="true" />
                        <span>UFOPA – Unidade Tapajós, Bloco 09, sala 06 — Santarém, Pará</span>
                    </div>
                    <div className="footer-item">
                        <Mail size={18} className="footer-icon" aria-hidden="true" />
                        <a href="mailto:labeta.icta@ufopa.edu.br" className="footer-email-link">
                            labeta.icta@ufopa.edu.br
                        </a>
                    </div>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} LABETA - UFOPA. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}
