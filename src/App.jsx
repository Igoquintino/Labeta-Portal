/* ============================================================
 * [COMPONENTE] App
 * Descrição: Layout raiz: Navbar, rotas, Footer, modais globais e barra admin flutuante.
 * Rota/Uso: Montado em main.jsx.
 * Dados: estado local de busca/contatos; AuthContext nos filhos
 * CSS correlato: index.css / styles/theme.css
 * ============================================================ */
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { ContactModal } from './components/modals/ContactModal';
import { SpotlightSearch } from './components/modals/SpotlightSearch';
import { Works } from './pages/Works';
import { People } from './pages/People';
import { Lab } from './pages/Lab';
import { Booking } from './pages/Booking';
import { News } from './pages/News';
import AdminLogin from './pages/AdminLogin';
import { FloatingAdminBar } from './components/admin/FloatingAdminBar';

/** [FUNÇÃO] App — define o layout global e o roteamento. */
export default function App() {
  // [ESTADO] isSearchOpen — modal de busca global (Spotlight)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // [ESTADO] isContactOpen — modal de contatos rápidos
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Escuta global para Ctrl + K e Cmd + K
  /** [HOOK] useEffect — registra o atalho global Ctrl/Cmd + K para abrir/fechar a busca. */
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="app-layout">
      {/* Acessibilidade: Pular para o Conteúdo Principal */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Barra de Navegação */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Roteamento */}
      <Routes>
        {/* [ROTA 1] / — Home */}
        <Route path="/" element={<Home />} />
        {/* [ROTA 2] /trabalhos — Works */}
        <Route path="/trabalhos" element={<Works />} />
        {/* [ROTA 3] /pessoas — People */}
        <Route path="/pessoas" element={<People />} />
        {/* [ROTA 4] /laboratorio — Lab */}
        <Route path="/laboratorio" element={<Lab />} />
        {/* [ROTA 5] /agendamento — Booking */}
        <Route path="/agendamento" element={<Booking />} />
        {/* [ROTA 6] /noticias — News */}
        <Route path="/noticias" element={<News />} />
        {/* [ROTA 7] /admin — AdminLogin (acesso discreto à gestão) */}
        <Route path="/admin" element={<AdminLogin />} />
        {/* [ROTA 8] * — fallback para Home */}
        <Route path="*" element={<Home />} />
      </Routes>

      {/* Rodapé Institucional */}
      <Footer />

      {/* Modais Globais */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <SpotlightSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Barra de Status e Ações do Administrador (Visível apenas se autenticado) */}
      <FloatingAdminBar />
    </div>
  );
}