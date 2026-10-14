import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Menu, X, Users } from 'lucide-react';
import './Navbar.css';

export function Navbar({ onOpenSearch, onOpenContact }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shortcutLabel = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl+K';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeMobileMenu();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="navbar-header" role="banner">
      <div className="navbar-container">

        {/* 1. BOTÃO HAMBÚRGUER (Apenas mobile e tablet) */}
        <button
          type="button"
          className="hamburger-btn"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>

        {/* 2. LOGO E MARCA */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu} aria-label="Página inicial do LABETA">
          <div className="brand-logo-frame">
            <img
              src="/logo-labeta.png"
              alt="Logotipo Oficial LABETA"
              className="brand-logo-img"
              width="40"
              height="40"
            />
          </div>
          <div className="brand-titles">
            <span className="brand-name">LABETA</span>
            <span className="brand-tagline">Algas da Amazônia</span>
          </div>
        </Link>

        {/* 3. LINKS NO DESKTOP */}
        <nav className="navbar-nav desktop-nav" aria-label="Navegação Principal Desktop">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Início
              </NavLink>
            </li>
            <li>
              <NavLink to="/trabalhos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Trabalhos
              </NavLink>
            </li>
            <li>
              <NavLink to="/pessoas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Pessoas
              </NavLink>
            </li>
            <li>
              <NavLink to="/laboratorio" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Laboratório
              </NavLink>
            </li>
            <li>
              <NavLink to="/noticias" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Notícias
              </NavLink>
            </li>
            <li>
              <NavLink to="/agendamento" className={({ isActive }) => isActive ? 'nav-link nav-link-highlight active' : 'nav-link nav-link-highlight'}>
                Agendamento
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* 4. AÇÕES RÁPIDAS (Pesquisa e Contatos) */}
        <div className="navbar-actions">
          <button
            type="button"
            className="action-btn search-trigger"
            onClick={onOpenSearch}
            aria-label={`Abrir pesquisa rápida (${shortcutLabel})`}
            title={`Pesquisar (${shortcutLabel})`}
          >
            <Search size={16} aria-hidden="true" />
            <span className="search-shortcut">{shortcutLabel}</span>
          </button>

          <button
            type="button"
            className="action-btn contact-trigger"
            onClick={onOpenContact}
            aria-label="Ver contatos rápidos da equipe"
            title="Contatos"
          >
            <Users size={16} className="contact-icon" aria-hidden="true" />
            <span className="contact-text">Contatos</span>
          </button>
        </div>

      </div>

      {/* 5. BACKDROP DO MENU MOBILE */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* 6. GAVETA / MENU SUSPENSO MOBILE */}
      <nav
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Menu de Navegação Mobile"
      >
        <ul className="mobile-nav-list">
          <li>
            <NavLink to="/" end className="mobile-nav-link" onClick={closeMobileMenu}>
              Início
            </NavLink>
          </li>
          <li>
            <NavLink to="/trabalhos" className="mobile-nav-link" onClick={closeMobileMenu}>
              Trabalhos
            </NavLink>
          </li>
          <li>
            <NavLink to="/pessoas" className="mobile-nav-link" onClick={closeMobileMenu}>
              Pessoas
            </NavLink>
          </li>
          <li>
            <NavLink to="/laboratorio" className="mobile-nav-link" onClick={closeMobileMenu}>
              Laboratório
            </NavLink>
          </li>
          <li>
            <NavLink to="/noticias" className="mobile-nav-link" onClick={closeMobileMenu}>
              Notícias
            </NavLink>
          </li>
          <li>
            <NavLink to="/agendamento" className="mobile-nav-link mobile-highlight" onClick={closeMobileMenu}>
              Agendamento
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}