import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Users, ShieldAlert, Newspaper, ArrowRight, Microscope, ShieldCheck } from 'lucide-react';
import membersData from '../../data/members.json';
import worksData from '../../data/works.json';
import newsData from '../../data/news.json';
import equipmentData from '../../data/equipment.json';
import './SpotlightSearch.css';

const categories = ['Todos', 'Membros', 'Trabalhos', 'Equipamentos', 'Biossegurança', 'Notícias'];

export function SpotlightSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsListRef = useRef(null);
  const navigate = useNavigate();

  // Consolidação dinâmica do acervo completo do LABETA
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

  const handleSelect = (link) => {
    handleClose();
    navigate(link);
  };

  // Navegação por teclado (ArrowUp, ArrowDown, Enter)
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
    <div className="spotlight-overlay" onClick={handleClose} role="presentation">
      <aside
        ref={modalRef}
        className="spotlight-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Busca Global no Portal LABETA"
      >
        {/* Barra Superior */}
        <div className="spotlight-search-header">
          <Search size={20} className="search-icon" aria-hidden="true" />

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
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setQuery('')}
              aria-label="Limpar texto da pesquisa"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            className="esc-close-btn"
            onClick={handleClose}
            title="Fechar busca (Esc)"
            aria-label="Fechar busca rápida"
          >
            <span className="esc-text">ESC</span>
            <X size={16} className="esc-icon" aria-hidden="true" />
          </button>
        </div>

        {/* Linha de Filtro por Pílulas */}
        <nav className="pills-nav" aria-label="Filtrar por categoria">
          {categories.map((cat) => (
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
        <div className="spotlight-results" role="region" aria-live="polite">
          {filteredResults.length > 0 ? (
            <ul
              id="spotlight-results-list"
              className="results-list"
              ref={resultsListRef}
              role="listbox"
            >
              {filteredResults.map((item, index) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={`result-item ${selectedIndex === index ? 'active-keyboard' : ''}`}
                  onClick={() => handleSelect(item.link)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="result-info">
                    <div className="result-header">
                      <span className={`category-badge badge-${item.category.toLowerCase()}`}>
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                      <h4 className="result-title">{item.title}</h4>
                    </div>
                    <p className="result-subtitle">{item.subtitle}</p>
                  </div>
                  <ArrowRight size={16} className="result-arrow" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-results-box">
              <p>Nenhum resultado encontrado para <strong>"{query}"</strong></p>
              <span className="no-results-hint">Tente buscar por termos como "diatomáceas", "microscópio", "EPIs" ou pelo nome de um pesquisador.</span>
            </div>
          )}
        </div>

        {/* Rodapé com Dicas de Atalho */}
        <footer className="spotlight-footer">
          <span>Navegar: <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Selecionar: <kbd>Enter</kbd></span>
          <span>Fechar: <kbd>Esc</kbd></span>
        </footer>
      </aside>
    </div>
  );
}