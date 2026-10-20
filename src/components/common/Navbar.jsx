/* ============================================================
 * [COMPONENTE] Navbar
 * Descrição: Navegação principal: links com destaque ativo, busca (Ctrl+K), contatos e menu hambúrguer no mobile (≤ 900px).
 * Rota/Uso: Global (App.jsx).
 * Dados: react-router-dom (rotas)
 * CSS correlato: Navbar.css
 * ============================================================ */
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Menu, X, Users } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import './Navbar.css';

/** [FUNÇÃO] Navbar — renderiza a barra de navegação; recebe callbacks para abrir busca e contatos. */
export function Navbar({ onOpenSearch, onOpenContact }) {
  // [ESTADO] isMobileMenuOpen — gaveta do menu mobile aberta/fechada
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shortcutLabel = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl+K';

  /** [FUNÇÃO] toggleMobileMenu — alterna a gaveta do menu mobile. */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  /** [FUNÇÃO] closeMobileMenu — fecha a gaveta do menu mobile (ex.: ao navegar). */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /** [HOOK] useEffect — fecha o menu mobile com Esc e trava o scroll enquanto aberto. */
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
    /* [SEÇÃO 1] .navbar-header — <header> */
    <header className="navbar-header" role="banner">
      {/* [SEÇÃO 1.1] .navbar-container — <div> */}
      <div className="navbar-container">

        {/* 1. BOTÃO HAMBÚRGUER (Apenas mobile e tablet) */}
        {/* [SEÇÃO 1.1.1] .hamburger-btn — <button> */}
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
        {/* [SEÇÃO 1.1.2] .navbar-brand — <Link> */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu} aria-label="Página inicial do LABETA">
          {/* [SEÇÃO 1.1.2.1] .brand-logo-frame — <div> */}
          <div className="brand-logo-frame">
            {/* [SEÇÃO 1.1.2.1.1] .brand-logo-img — <img> */}
            <img
              src="/logo-labeta.png"
              alt="Logotipo Oficial LABETA"
              className="brand-logo-img"
              width="40"
              height="40"
            />
          </div>
          {/* [SEÇÃO 1.1.2.2] .brand-titles — <div> */}
          <div className="brand-titles">
            {/* [SEÇÃO 1.1.2.2.1] .brand-name — <span> */}
            <span className="brand-name">LABETA</span>
            {/* [SEÇÃO 1.1.2.2.2] .brand-tagline — <span> */}
            <span className="brand-tagline">Algas da Amazônia</span>
          </div>
        </Link>

        {/* 3. LINKS NO DESKTOP */}
        {/* [SEÇÃO 1.1.3] .navbar-nav .desktop-nav — <nav> */}
        <nav className="navbar-nav desktop-nav" aria-label="Navegação Principal Desktop">
          {/* [SEÇÃO 1.1.3.1] .nav-list — <ul> */}
          <ul className="nav-list">
            <li>
              {/* [SEÇÃO 1.1.3.1.1.1] .nav-link .active .nav-link — <NavLink> */}
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Início
              </NavLink>
            </li>
            <li>
              {/* [SEÇÃO 1.1.3.1.2.1] .nav-link .active .nav-link — <NavLink> */}
              <NavLink to="/trabalhos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Trabalhos
              </NavLink>
            </li>
            <li>
              {/* [SEÇÃO 1.1.3.1.3.1] .nav-link .active .nav-link — <NavLink> */}
              <NavLink to="/pessoas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Pessoas
              </NavLink>
            </li>
            <li>
              {/* [SEÇÃO 1.1.3.1.4.1] .nav-link .active .nav-link — <NavLink> */}
              <NavLink to="/laboratorio" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Laboratório
              </NavLink>
            </li>
            <li>
              {/* [SEÇÃO 1.1.3.1.5.1] .nav-link .active .nav-link — <NavLink> */}
              <NavLink to="/noticias" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Notícias
              </NavLink>
            </li>
            <li>
              {/* [SEÇÃO 1.1.3.1.6.1] .nav-link .nav-link-highlight .active .nav-link .nav-link-highlight — <NavLink> */}
              <NavLink to="/agendamento" className={({ isActive }) => isActive ? 'nav-link nav-link-highlight active' : 'nav-link nav-link-highlight'}>
                Agendamento
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* 4. AÇÕES RÁPIDAS (Alternância de Tema, Pesquisa e Contatos) */}
        {/* [SEÇÃO 1.1.4] .navbar-actions — <div> */}
        <div className="navbar-actions">
          {/* Alternância de Modo Claro / Escuro */}
          <ThemeToggle />

          {/* [SEÇÃO 1.1.4.1] .action-btn .search-trigger — <button> */}
          <button
            type="button"
            className="action-btn search-trigger"
            onClick={onOpenSearch}
            aria-label={`Abrir pesquisa rápida (${shortcutLabel})`}
            title={`Pesquisar (${shortcutLabel})`}
          >
            <Search size={16} aria-hidden="true" />
            {/* [SEÇÃO 1.1.4.1.2] .search-shortcut — <span> */}
            <span className="search-shortcut">{shortcutLabel}</span>
          </button>

          {/* [SEÇÃO 1.1.4.2] .action-btn .contact-trigger — <button> */}
          <button
            type="button"
            className="action-btn contact-trigger"
            onClick={onOpenContact}
            aria-label="Ver contatos rápidos da equipe"
            title="Contatos"
          >
            {/* [SEÇÃO 1.1.4.2.1] .contact-icon — <Users> */}
            <Users size={16} className="contact-icon" aria-hidden="true" />
            {/* [SEÇÃO 1.1.4.2.2] .contact-text — <span> */}
            <span className="contact-text">Contatos</span>
          </button>
        </div>

      </div>

      {/* 5. BACKDROP DO MENU MOBILE */}
      {isMobileMenuOpen && (
        /* [SEÇÃO 1.1.5] .mobile-nav-backdrop — <div> */
        <div
          className="mobile-nav-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* 6. GAVETA / MENU SUSPENSO MOBILE */}
      {/* [SEÇÃO 1.2] .mobile-nav-drawer — <nav> */}
      <nav
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Menu de Navegação Mobile"
      >
        {/* [SEÇÃO 1.2.1] .mobile-nav-list — <ul> */}
        <ul className="mobile-nav-list">
          <li>
            {/* [SEÇÃO 1.2.1.1.1] .mobile-nav-link — <NavLink> */}
            <NavLink to="/" end className="mobile-nav-link" onClick={closeMobileMenu}>
              Início
            </NavLink>
          </li>
          <li>
            {/* [SEÇÃO 1.2.1.2.1] .mobile-nav-link — <NavLink> */}
            <NavLink to="/trabalhos" className="mobile-nav-link" onClick={closeMobileMenu}>
              Trabalhos
            </NavLink>
          </li>
          <li>
            {/* [SEÇÃO 1.2.1.3.1] .mobile-nav-link — <NavLink> */}
            <NavLink to="/pessoas" className="mobile-nav-link" onClick={closeMobileMenu}>
              Pessoas
            </NavLink>
          </li>
          <li>
            {/* [SEÇÃO 1.2.1.4.1] .mobile-nav-link — <NavLink> */}
            <NavLink to="/laboratorio" className="mobile-nav-link" onClick={closeMobileMenu}>
              Laboratório
            </NavLink>
          </li>
          <li>
            {/* [SEÇÃO 1.2.1.5.1] .mobile-nav-link — <NavLink> */}
            <NavLink to="/noticias" className="mobile-nav-link" onClick={closeMobileMenu}>
              Notícias
            </NavLink>
          </li>
          <li>
            {/* [SEÇÃO 1.2.1.6.1] .mobile-nav-link .mobile-highlight — <NavLink> */}
            <NavLink to="/agendamento" className="mobile-nav-link mobile-highlight" onClick={closeMobileMenu}>
              Agendamento
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}