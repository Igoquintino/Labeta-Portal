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

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Escuta global para Ctrl + K e Cmd + K
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
        <Route path="/" element={<Home />} />
        <Route path="/trabalhos" element={<Works />} />
        <Route path="/pessoas" element={<People />} />
        <Route path="/laboratorio" element={<Lab />} />
        <Route path="/agendamento" element={<Booking />} />
        <Route path="/noticias" element={<News />} />
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
    </div>
  );
}