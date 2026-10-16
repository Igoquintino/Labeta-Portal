/* ============================================================
 * [COMPONENTE] SpotlightSearch
 * Descrição: Busca global (Ctrl/Cmd+K) com filtro por categoria e navegação por teclado.
 * Rota/Uso: Aberto pela Navbar ou atalho (App.jsx).
 * Dados: members.json, works.json, news.json, equipment.json
 * CSS correlato: SpotlightSearch.css
 * ============================================================ */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Users, ShieldAlert, Newspaper, ArrowRight, Microscope, ShieldCheck } from 'lucide-react';
import membersData from '../../data/members.json';
import worksData from '../../data/works.json';
import newsData from '../../data/news.json';
import equipmentData from '../../data/equipment.json';
import './SpotlightSearch.css';

const categories = ['Todos', 'Membros', 'Trabalhos', 'Equipamentos', 'Biossegurança', 'Notícias'];

/** [FUNÇÃO] SpotlightSearch — renderiza o modal de busca global. */
export function SpotlightSearch({ isOpen, onClose }) {
  // [ESTADO] query — texto digitado na busca
  const [query, setQuery] = useState('');
  // [ESTADO] activeCategory — pílula de filtro ativa (Todos, Membros, Trabalhos, Biossegurança, Notícias)
  const [activeCategory, setActiveCategory] = useState('Todos');
  // [ESTADO] selectedIndex — resultado destacado (setas ↑/↓)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsListRef = useRef(null);
  const navigate = useNavigate();

  // Consolidação dinâmica do acervo completo do LABETA
  /** [HOOK] useMemo searchableBase — unifica todos os dados pesquisáveis numa lista única. */
  const searchableBase = useMemo(() => {
    const list = [];

    // 1. Membros
    membersData.forEach((m) => {
      list.push({
        id: `member-${m.id}`,
        category: 'Membros',
        title: m.name,
        subtitle: `${m.role} • ${m.researchArea}`,
        link: '/pessoas'
      });
    });

    // 2. Trabalhos Científicos
    worksData.forEach((w) => {
      list.push({
        id: `work-${w.id}`,
        category: 'Trabalhos',
        title: w.title,
        subtitle: `${w.authors} (${w.year}) • ${w.category}`,
        link: '/trabalhos'
      });
    });

    // 3. Equipamentos Analíticos
    equipmentData.forEach((eq) => {
      list.push({
        id: `eq-${eq.id}`,
        category: 'Equipamentos',
        title: eq.name,
        subtitle: `${eq.code} • ${eq.capacity}`,
        link: '/agendamento'
      });
    });

    // 4. Notícias e Radar
    newsData.announcements.forEach((a) => {
      list.push({
        id: `news-${a.id}`,
        category: 'Notícias',
        title: a.title,
        subtitle: `${a.date} • ${a.content}`,
        link: '/noticias'
      });
    });
    newsData.scientificRadar.forEach((r) => {
      list.push({
        id: `radar-${r.id}`,
        category: 'Notícias',
        title: r.title,
        subtitle: `${r.journal} (${r.year}) • ${r.summary}`,
        link: '/noticias'
      });
    });

    // 5. Biossegurança
    list.push({
      id: 'rule-1',
      category: 'Biossegurança',
      title: 'EPIs Mandatórios em Processos de Oxidação',
      subtitle: 'Jaleco longo, calça, máscara, luvas nitrílicas e calçado 100% fechado.',
      link: '/#rules-title'
    });
    list.push({
      id: 'rule-2',
      category: 'Biossegurança',
      title: 'Higienização Mandatória de Vidrarias e Lâminas',
      subtitle: 'Descontaminação imediata pós-uso para evitar contaminação cruzada.',
      link: '/#rules-title'
    });

    return list;
  }, []);

  // Foco no input ao abrir
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  /** [FUNÇÃO] handleClose — limpa a busca e fecha o modal. */
  const handleClose = useCallback(() => {
    setQuery('');
    setActiveCategory('Todos');
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  const modalRef = useRef(null);

  // Fechamento com a tecla Esc e contenção de foco (Focus Trap)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Filtro reativo em tempo real
  /** [HOOK] useMemo filteredResults — aplica categoria + texto sobre searchableBase. */
  const filteredResults = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    const results = searchableBase.filter((item) => {
      const matchCategory = activeCategory === 'Todos' || item.category === activeCategory;
      const matchText = normalizedQuery === '' ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.subtitle.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchText;
    });

    if (normalizedQuery === ':admin' || normalizedQuery === 'admin') {
      results.unshift({
        id: 'admin-entry',
        category: 'Gestão',
        title: 'Painel Administrativo do LABETA',
        subtitle: 'Acesso restrito para coordenação e equipe autorizada',
        link: '/admin'
      });
    }

    return results;
  }, [searchableBase, query, activeCategory]);

  /** [FUNÇÃO] handleSelect — navega para o link do resultado e fecha o modal. */
  const handleSelect = (link) => {
    handleClose();
    navigate(link);
  };

  // Navegação por teclado (ArrowUp, ArrowDown, Enter)
  /** [FUNÇÃO] handleInputKeyDown — setas, Enter e Esc dentro do campo de busca. */
  const handleInputKeyDown = (e) => {
    if (filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex].link);
      }
    }
  };

  if (!isOpen) return null;

  /** [FUNÇÃO] getCategoryIcon — devolve o ícone lucide da categoria do resultado. */
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Membros': return <Users size={14} aria-hidden="true" />;
      case 'Trabalhos': return <BookOpen size={14} aria-hidden="true" />;
      case 'Equipamentos': return <Microscope size={14} aria-hidden="true" />;
      case 'Biossegurança': return <ShieldAlert size={14} aria-hidden="true" />;
      case 'Notícias': return <Newspaper size={14} aria-hidden="true" />;
      case 'Gestão': return <ShieldCheck size={14} aria-hidden="true" />;
      default: return <Search size={14} aria-hidden="true" />;
    }
  };

  return (
    /* [SEÇÃO 1] .spotlight-overlay — <div> */
    <div className="spotlight-overlay" onClick={handleClose} role="presentation">
      {/* [SEÇÃO 1.1] .spotlight-modal — <aside> */}
      <aside
        ref={modalRef}
        className="spotlight-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Busca Global no Portal LABETA"
      >
        {/* Barra Superior */}
        {/* [SEÇÃO 1.1.1] .spotlight-search-header — <div> */}
        <div className="spotlight-search-header">
          {/* [SEÇÃO 1.1.1.1] .search-icon — <Search> */}
          <Search size={20} className="search-icon" aria-hidden="true" />

          {/* [SEÇÃO 1.1.1.2] .spotlight-input — <input> */}
          <input
            ref={inputRef}
            type="search"
            className="spotlight-input"
            placeholder="Pesquisar por diatomáceas, membros, artigos ou equipamentos..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            aria-autocomplete="list"
            aria-controls="spotlight-results-list"
          />

          {query && (
            /* [SEÇÃO 1.1.1.2.1] .clear-search-btn — <button> */
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setQuery('')}
              aria-label="Limpar texto da pesquisa"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}

          {/* [SEÇÃO 1.1.1.3] .esc-close-btn — <button> */}
          <button
            type="button"
            className="esc-close-btn"
            onClick={handleClose}
            title="Fechar busca (Esc)"
            aria-label="Fechar busca rápida"
          >
            {/* [SEÇÃO 1.1.1.3.1] .esc-text — <span> */}
            <span className="esc-text">ESC</span>
            {/* [SEÇÃO 1.1.1.3.2] .esc-icon — <X> */}
            <X size={16} className="esc-icon" aria-hidden="true" />
          </button>
        </div>

        {/* Linha de Filtro por Pílulas */}
        {/* [SEÇÃO 1.1.2] .pills-nav — <nav> */}
        <nav className="pills-nav" aria-label="Filtrar por categoria">
          {categories.map((cat) => (
            /* [SEÇÃO 1.1.2.1] .filter-pill — <button> */
            <button
              key={cat}
              type="button"
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(0);
              }}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Lista de Resultados */}
        {/* [SEÇÃO 1.1.3] .spotlight-results — <div> */}
        <div className="spotlight-results" role="region" aria-live="polite">
          {filteredResults.length > 0 ? (
            /* [SEÇÃO 1.1.3.1] .results-list — <ul> */
            <ul
              id="spotlight-results-list"
              className="results-list"
              ref={resultsListRef}
              role="listbox"
            >
              {filteredResults.map((item, index) => (
                /* [SEÇÃO 1.1.3.1.1] .result-item — <li> */
                <li
                  key={item.id}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={`result-item ${selectedIndex === index ? 'active-keyboard' : ''}`}
                  onClick={() => handleSelect(item.link)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {/* [SEÇÃO 1.1.3.1.1.1] .result-info — <div> */}
                  <div className="result-info">
                    {/* [SEÇÃO 1.1.3.1.1.1.1] .result-header — <div> */}
                    <div className="result-header">
                      {/* [SEÇÃO 1.1.3.1.1.1.1.1] .category-badge — <span> */}
                      <span className={`category-badge badge-${item.category.toLowerCase()}`}>
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                      {/* [SEÇÃO 1.1.3.1.1.1.1.2] .result-title — <h4> */}
                      <h4 className="result-title">{item.title}</h4>
                    </div>
                    {/* [SEÇÃO 1.1.3.1.1.1.2] .result-subtitle — <p> */}
                    <p className="result-subtitle">{item.subtitle}</p>
                  </div>
                  {/* [SEÇÃO 1.1.3.1.1.2] .result-arrow — <ArrowRight> */}
                  <ArrowRight size={16} className="result-arrow" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ) : (
            /* [SEÇÃO 1.1.3.2] .no-results-box — <div> */
            <div className="no-results-box">
              <p>Nenhum resultado encontrado para <strong>"{query}"</strong></p>
              {/* [SEÇÃO 1.1.3.2.2] .no-results-hint — <span> */}
              <span className="no-results-hint">Tente buscar por termos como "diatomáceas", "microscópio", "EPIs" ou pelo nome de um pesquisador.</span>
            </div>
          )}
        </div>

        {/* Rodapé com Dicas de Atalho */}
        {/* [SEÇÃO 1.1.4] .spotlight-footer — <footer> */}
        <footer className="spotlight-footer">
          <span>Navegar: <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Selecionar: <kbd>Enter</kbd></span>
          <span>Fechar: <kbd>Esc</kbd></span>
        </footer>
      </aside>
    </div>
  );
}