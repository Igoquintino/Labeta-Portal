/* ============================================================
 * [COMPONENTE] App
 * Descrição: Layout raiz: Navbar, rotas, Footer, modais globais e barra admin flutuante.
 * Rota/Uso: Montado em main.jsx.
 * Dados: estado local de busca/contatos; AuthContext nos filhos
 * CSS correlato: index.css / styles/theme.css
 * ============================================================ */
import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { RouteLoadingSkeleton } from './components/common/RouteLoadingSkeleton';
import { ContactModal } from './components/modals/ContactModal';
import { SpotlightSearch } from './components/modals/SpotlightSearch';
import { FloatingAdminBar } from './components/admin/FloatingAdminBar';
import { MicroscopeProvider } from './context/MicroscopeContext';
import { MicroalgaeCanvas } from './components/background/MicroalgaeCanvas';

// Rotas carregadas sob demanda (code-splitting com React.lazy)
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Works = lazy(() => import('./pages/Works').then((m) => ({ default: m.Works })));
const People = lazy(() => import('./pages/People').then((m) => ({ default: m.People })));
const Lab = lazy(() => import('./pages/Lab').then((m) => ({ default: m.Lab })));
const Booking = lazy(() => import('./pages/Booking').then((m) => ({ default: m.Booking })));
const News = lazy(() => import('./pages/News').then((m) => ({ default: m.News })));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

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
    <MicroscopeProvider>
      <div className="app-layout">
        {/* Camada Interativa de Fundo: Lâmina Viva (Microscopia Amazônica) */}
        <MicroalgaeCanvas />

        {/* Acessibilidade: Pular para o Conteúdo Principal */}
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>

        {/* Barra de Navegação */}
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
        />

        {/* Roteamento com Lazy Loading e Suspense */}
        <Suspense fallback={<RouteLoadingSkeleton />}>
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
        </Suspense>

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
    </MicroscopeProvider>
  );
}