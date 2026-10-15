import { useState, useMemo } from 'react';
import { BookOpen, Clock, CheckCircle2, ExternalLink, Tag, Search, X, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import worksData from '../data/works.json';
import './Works.css';

export function Works() {
    const { isAdmin } = useAuth();
    const [filter, setFilter] = useState('todos'); // 'todos' | 'em_andamento' | 'concluidos'
    const [searchQuery, setSearchQuery] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });

    const openCreateModal = () => {
        setModalConfig({
            isOpen: true,
            title: 'Cadastrar Novo Trabalho / Projeto',
            type: 'create',
            data: null
        });
    };

    const openEditModal = (work) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${work.title}`,
            type: 'edit',
            data: work
        });
    };

    const openDeleteModal = (work) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Remoção de Trabalho',
            type: 'delete',
            data: work
        });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        closeModal();
    };

    // Contadores para as abas
    const countAndamento = useMemo(() => worksData.filter((w) => w.status === 'em_andamento').length, []);
    const countConcluidos = useMemo(() => worksData.filter((w) => w.status === 'concluido').length, []);

    // Filtro combinado de busca e status
    const filteredWorks = useMemo(() => {
        return worksData.filter((work) => {
            const matchesFilter =
                filter === 'todos' ||
                (filter === 'em_andamento' && work.status === 'em_andamento') ||
                (filter === 'concluidos' && work.status === 'concluido');

            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                query === '' ||
                work.title.toLowerCase().includes(query) ||
                work.summary.toLowerCase().includes(query) ||
                work.authors.toLowerCase().includes(query) ||
                work.tags.some((t) => t.toLowerCase().includes(query));

            return matchesFilter && matchesSearch;
        });
    }, [filter, searchQuery]);

    return (
        <main className="works-page" id="main-content">
            <div className="works-container">

                {/* Cabeçalho da Página */}
                <header className="works-header">
                    <div className="works-badge">
                        <BookOpen size={16} aria-hidden="true" />
                        <span>Produção Científica</span>
                    </div>
                    <h1 className="works-title">Trabalhos &amp; Pesquisas</h1>
                    <p className="works-subtitle">
                        Explore as investigações taxonômicas, ecológicas e florísticas desenvolvidas pelo corpo de pesquisadores do LABETA na Amazônia.
                    </p>

                    {/* Barra de Pesquisa Rápida */}
                    <div className="works-search-bar" role="search">
                        <Search size={18} className="search-icon" aria-hidden="true" />
                        <input
                            type="search"
                            className="search-input"
                            placeholder="Buscar por gênero, autor, metodologia (ex: Diatomáceas, Perifíton)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Filtrar trabalhos científicos por palavra-chave"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="clear-search-btn"
                                onClick={() => setSearchQuery('')}
                                aria-label="Limpar campo de busca"
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                        )}
                    </div>

                    {/* Abas de Filtragem por Status */}
                    <nav className="filter-tabs" aria-label="Filtrar trabalhos por status">
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
                            onClick={openCreateModal}
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
                                                onClick={() => openEditModal(work)}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-action-btn delete"
                                                title={`Excluir: ${work.title}`}
                                                onClick={() => openDeleteModal(work)}
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

                                    <h2 className="work-title">{work.title}</h2>
                                    <p className="work-authors"><strong>Autores:</strong> {work.authors}</p>
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

                {/* Modal Administrativo Unificado */}
                <AdminModal
                    isOpen={modalConfig.isOpen}
                    onClose={closeModal}
                    title={modalConfig.title}
                >
                    {modalConfig.type === 'delete' ? (
                        <div className="admin-delete-box">
                            <p className="admin-delete-notice">
                                Tem certeza de que deseja remover <strong className="admin-delete-highlight">"{modalConfig.data?.title}"</strong>? Esta pesquisa será excluída do catálogo público.
                            </p>
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                <button type="button" className="admin-btn-submit" style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={closeModal}>
                                    Confirmar Exclusão
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Título da Pesquisa / Trabalho</label>
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.title || ''}
                                    placeholder="Nome completo do projeto ou artigo..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Status do Trabalho</label>
                                <select className="admin-form-select" defaultValue={modalConfig.data?.status || 'em_andamento'}>
                                    <option value="em_andamento">Em Andamento</option>
                                    <option value="concluido">Concluído</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Autores</label>
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.authors || ''}
                                    placeholder="Pesquisadores e colaboradores..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Resumo Técnico</label>
                                <textarea
                                    rows="4"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.summary || ''}
                                    placeholder="Breve descrição dos objetivos e resultados..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Link Externo / DOI (Opcional)</label>
                                <input
                                    type="url"
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.externalUrl || ''}
                                    placeholder="https://doi.org/..."
                                />
                            </div>

                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="admin-btn-submit">Salvar Trabalho</button>
                            </div>
                        </form>
                    )}
                </AdminModal>

            </div>
        </main>
    );
}
