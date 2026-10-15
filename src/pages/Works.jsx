import { useState, useMemo } from 'react';
import { BookOpen, Clock, CheckCircle2, ExternalLink, Tag, Search, X, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import worksData from '../data/works.json';
import './Works.css';

export function Works() {
    const { isAdmin } = useAuth();
    const [filter, setFilter] = useState('todos'); // 'todos' | 'em_andamento' | 'concluidos'
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWorks = useMemo(() => {
        return worksData.filter((item) => {
            const matchesStatus = filter === 'todos' || item.status === filter;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = q === '' ||
                item.title.toLowerCase().includes(q) ||
                item.authors.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q) ||
                item.tags.some((t) => t.toLowerCase().includes(q));
            return matchesStatus && matchesSearch;
        });
    }, [filter, searchQuery]);

    const countAndamento = worksData.filter((w) => w.status === 'em_andamento').length;
    const countConcluidos = worksData.filter((w) => w.status === 'concluidos').length;

    return (
        <main className="works-page" id="main-content">
            <div className="works-container">

                {/* Cabeçalho da Página */}
                <header className="works-header">
                    <div className="works-badge">
                        <BookOpen size={16} aria-hidden="true" />
                        <span>Produção Científica</span>
                    </div>
                    <h1 className="works-title">Trabalhos e Pesquisas</h1>
                    <p className="works-subtitle">
                        Conheça as linhas de investigação, artigos publicados e projetos taxonômicos desenvolvidos pelo corpo científico do LABETA.
                    </p>

                    {/* Barra de Busca Rápida na Página */}
                    <div className="works-search-bar" role="search">
                        <Search size={18} className="works-search-icon" aria-hidden="true" />
                        <input
                            type="search"
                            className="works-search-input"
                            placeholder="Buscar por título, autor, diatomáceas ou taxonomia..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Filtrar trabalhos científicos por palavra-chave"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="works-clear-btn"
                                onClick={() => setSearchQuery('')}
                                aria-label="Limpar pesquisa de trabalhos"
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                        )}
                    </div>

                    {/* Abas de Navegação / Filtro */}
                    <nav className="works-filter-nav" aria-label="Filtrar por estágio de pesquisa">
                        <button
                            type="button"
                            className={`filter-tab-btn ${filter === 'todos' ? 'active' : ''}`}
                            onClick={() => setFilter('todos')}
                        >
                            Todos ({worksData.length})
                        </button>
                        <button
                            type="button"
                            className={`filter-tab-btn ${filter === 'em_andamento' ? 'active' : ''}`}
                            onClick={() => setFilter('em_andamento')}
                        >
                            <Clock size={15} aria-hidden="true" />
                            Em Andamento ({countAndamento})
                        </button>
                        <button
                            type="button"
                            className={`filter-tab-btn ${filter === 'concluidos' ? 'active' : ''}`}
                            onClick={() => setFilter('concluidos')}
                        >
                            <CheckCircle2 size={15} aria-hidden="true" />
                            Concluídos ({countConcluidos})
                        </button>
                    </nav>
                </header>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button 
                            type="button" 
                            className="admin-btn-primary"
                            onClick={() => alert("Abrir modal: Cadastrar Novo Trabalho / Projeto")}
                        >
                            <Plus size={16} /> Novo Trabalho / Projeto
                        </button>
                    </div>
                )}

                {/* Listagem de Artigos e Trabalhos */}
                <section className="works-list" aria-label="Lista de trabalhos científicos">
                    {filteredWorks.length > 0 ? (
                        filteredWorks.map((work) => {
                            const isOngoing = work.status === 'em_andamento';
                            return (
                                <article key={work.id} className="work-card" style={{ position: 'relative' }}>
                                    
                                    {/* Botões de Ação do Card (Admin) */}
                                    {isAdmin && (
                                        <div className="card-admin-actions">
                                            <button 
                                                type="button" 
                                                className="admin-action-btn edit" 
                                                title={`Editar: ${work.title}`}
                                                onClick={() => alert(`Editar trabalho: ${work.title}`)}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                type="button" 
                                                className="admin-action-btn delete" 
                                                title={`Excluir: ${work.title}`}
                                                onClick={() => alert(`Excluir trabalho ID: ${work.id}`)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="work-card-top">
                                        <span className={`status-pill ${isOngoing ? 'status-ongoing' : 'status-completed'}`}>
                                            {isOngoing ? <Clock size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}
                                            <span>{isOngoing ? 'Em Andamento' : 'Concluído'}</span>
                                        </span>
                                        <span className="work-category">{work.category}</span>
                                        <span className="work-year">{work.year}</span>
                                    </div>

                                    <h2 className="work-item-title">{work.title}</h2>
                                    <p className="work-authors"><strong>Autoria:</strong> {work.authors}</p>
                                    <p className="work-summary">{work.summary}</p>

                                    {/* Tags de Metodologia e Área */}
                                    <div className="work-tags-row">
                                        {work.tags.map((tag, idx) => (
                                            <span key={idx} className="work-tag-item">
                                                <Tag size={11} aria-hidden="true" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Rodapé do Card com Ação / DOI */}
                                    <div className="work-card-footer">
                                        {work.externalUrl ? (
                                            <a
                                                href={work.externalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="work-doi-link"
                                                aria-label={`Acessar Publicação DOI: ${work.doi} (abre em nova aba)`}
                                            >
                                                <span>Acessar Publicação (DOI: {work.doi})</span>
                                                <ExternalLink size={14} aria-hidden="true" />
                                            </a>
                                        ) : (
                                            <span className="work-ongoing-notice">
                                                Projeto em execução — Resultados e pranchas em catalogação
                                            </span>
                                        )}
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <div className="no-works-box">
                            <p>Nenhum trabalho encontrado para <strong>"{searchQuery}"</strong></p>
                            <span>Tente buscar por termos mais genéricos ou limpe o filtro de busca.</span>
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}
