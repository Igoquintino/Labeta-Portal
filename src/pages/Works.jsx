/* ============================================================
 * [COMPONENTE] Works
 * Descrição: Produção científica separada em "Em Andamento" e "Concluídos", com busca e links de DOI.
 * Rota/Uso: Rota /trabalhos.
 * Dados: src/data/works.json
 * CSS correlato: Works.css
 * ============================================================ */
import { useState, useMemo } from 'react';
import { BookOpen, Clock, CheckCircle2, ExternalLink, Tag, Search, X, Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import worksData from '../data/works.json';
import './Works.css';

/** [FUNÇÃO] Works — renderiza filtros, busca e cards de trabalhos. */
export function Works() {
    const { isAdmin } = useAuth();
    // [ESTADO] filter — 'todos' | 'em_andamento' | 'concluidos'
    const [filter, setFilter] = useState('todos'); // 'todos' | 'em_andamento' | 'concluidos'
    // [ESTADO] searchQuery — texto de busca
    const [searchQuery, setSearchQuery] = useState('');
    // [ESTADO] modalConfig — { isOpen, title, type, data } controla o AdminModal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });

    /** [FUNÇÃO] openCreateModal — abre o AdminModal em modo "criar" (somente admin). */
    const openCreateModal = () => {
        setModalConfig({
            isOpen: true,
            title: 'Cadastrar Novo Trabalho / Projeto',
            type: 'create',
            data: null
        });
    };

    /** [FUNÇÃO] openEditModal — abre o AdminModal em modo "editar" com os dados do item. */
    const openEditModal = (work) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${work.title}`,
            type: 'edit',
            data: work
        });
    };

    /** [FUNÇÃO] openDeleteModal — abre o AdminModal de confirmação de exclusão. */
    const openDeleteModal = (work) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Remoção de Trabalho',
            type: 'delete',
            data: work
        });
    };

    /** [FUNÇÃO] closeModal — fecha o AdminModal e reseta modalConfig. */
    const closeModal = () => {
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    /** [FUNÇÃO] handleFormSubmit — trata o envio do formulário do modal (por ora apenas simula e fecha). */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        closeModal();
    };

    // Contadores para as abas
    // [ESTADO] contadores de trabalhos por status
    const countAndamento = useMemo(() => worksData.filter((w) => w.status === 'em_andamento').length, []);
    const countConcluidos = useMemo(() => worksData.filter((w) => w.status === 'concluido').length, []);

    // Filtro combinado de busca e status
    /** [HOOK] useMemo filteredWorks — aplica filtro de status e busca. */
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
        /* [SEÇÃO 1] .works-page — <main> */
        <main className="works-page" id="main-content">
            {/* [SEÇÃO 1.1] .works-container — <div> */}
            <div className="works-container">

                {/* Cabeçalho da Página */}
                {/* [SEÇÃO 1.1.1] .works-header — <header> */}
                <header className="works-header">
                    {/* [SEÇÃO 1.1.1.1] .works-badge — <div> */}
                    <div className="works-badge">
                        <BookOpen size={16} aria-hidden="true" />
                        <span>Produção Científica</span>
                    </div>
                    {/* [SEÇÃO 1.1.1.2] .works-title — <h1> */}
                    <h1 className="works-title">Trabalhos &amp; Pesquisas</h1>
                    {/* [SEÇÃO 1.1.1.3] .works-subtitle — <p> */}
                    <p className="works-subtitle">
                        Explore as investigações taxonômicas, ecológicas e florísticas desenvolvidas pelo corpo de pesquisadores do LABETA na Amazônia.
                    </p>

                    {/* Barra de Pesquisa Rápida */}
                    {/* [SEÇÃO 1.1.1.4] .works-search-bar — <div> */}
                    <div className="works-search-bar" role="search">
                        {/* [SEÇÃO 1.1.1.4.1] .search-icon — <Search> */}
                        <Search size={18} className="search-icon" aria-hidden="true" />
                        {/* [SEÇÃO 1.1.1.4.2] .search-input — <input> */}
                        <input
                            type="search"
                            className="search-input"
                            placeholder="Buscar por gênero, autor, metodologia (ex: Diatomáceas, Perifíton)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Filtrar trabalhos científicos por palavra-chave"
                        />
                        {searchQuery && (
                            /* [SEÇÃO 1.1.1.4.2.1] .clear-search-btn — <button> */
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
                    {/* [SEÇÃO 1.1.1.5] .filter-tabs — <nav> */}
                    <nav className="filter-tabs" aria-label="Filtrar trabalhos por status">
                        {/* [SEÇÃO 1.1.1.5.1] .filter-tab-btn — <button> */}
                        <button
                            type="button"
                            className={`filter-tab-btn ${filter === 'todos' ? 'active' : ''}`}
                            onClick={() => setFilter('todos')}
                        >
                            Todos ({worksData.length})
                        </button>
                        {/* [SEÇÃO 1.1.1.5.2] .filter-tab-btn — <button> */}
                        <button
                            type="button"
                            className={`filter-tab-btn ${filter === 'em_andamento' ? 'active' : ''}`}
                            onClick={() => setFilter('em_andamento')}
                        >
                            <Clock size={15} aria-hidden="true" />
                            Em Andamento ({countAndamento})
                        </button>
                        {/* [SEÇÃO 1.1.1.5.3] .filter-tab-btn — <button> */}
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
                    /* [SEÇÃO 1.1.1.6] .admin-toolbar — <div> */
                    <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        {/* [SEÇÃO 1.1.1.6.1] .admin-btn-primary — <button> */}
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
                {/* [SEÇÃO 1.1.2] .works-list — <section> */}
                <section className="works-list" aria-label="Lista de trabalhos científicos">
                    {filteredWorks.length > 0 ? (
                        filteredWorks.map((work) => {
                            const isOngoing = work.status === 'em_andamento';
                            return (
                                /* [SEÇÃO 1.1.2.1] .work-card — <article> */
                                <article key={work.id} className="work-card">

                                    {/* Barra de Ações Administrativas do Card */}
                                    {isAdmin && (
                                        /* [SEÇÃO 1.1.2.1.1] .card-admin-actions — <div> */
                                        <div className="card-admin-actions">
                                            {/* [SEÇÃO 1.1.2.1.1.1] .card-admin-badge — <span> */}
                                            <span className="card-admin-badge">
                                                <ShieldCheck size={12} aria-hidden="true" />
                                                <span>Gestão</span>
                                            </span>
                                            {/* [SEÇÃO 1.1.2.1.1.2] .card-admin-btns-group — <div> */}
                                            <div className="card-admin-btns-group">
                                                {/* [SEÇÃO 1.1.2.1.1.2.1] .admin-action-btn .edit — <button> */}
                                                <button
                                                    type="button"
                                                    className="admin-action-btn edit"
                                                    title={`Editar: ${work.title}`}
                                                    onClick={() => openEditModal(work)}
                                                >
                                                    <Edit2 size={13} />
                                                    <span>Editar</span>
                                                </button>
                                                {/* [SEÇÃO 1.1.2.1.1.2.2] .admin-action-btn .delete — <button> */}
                                                <button
                                                    type="button"
                                                    className="admin-action-btn delete"
                                                    title={`Excluir: ${work.title}`}
                                                    onClick={() => openDeleteModal(work)}
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Excluir</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* [SEÇÃO 1.1.2.1.2] .work-card-top — <div> */}
                                    <div className="work-card-top">
                                        {/* [SEÇÃO 1.1.2.1.2.1] .status-pill — <span> */}
                                        <span className={`status-pill ${isOngoing ? 'status-ongoing' : 'status-completed'}`}>
                                            {isOngoing ? <Clock size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}
                                            <span>{isOngoing ? 'Em Andamento' : 'Concluído'}</span>
                                        </span>
                                        {/* [SEÇÃO 1.1.2.1.2.2] .work-category — <span> */}
                                        <span className="work-category">{work.category}</span>
                                        {/* [SEÇÃO 1.1.2.1.2.3] .work-year — <span> */}
                                        <span className="work-year">{work.year}</span>
                                    </div>

                                    {/* [SEÇÃO 1.1.2.1.3] .work-title — <h2> */}
                                    <h2 className="work-title">{work.title}</h2>
                                    {/* [SEÇÃO 1.1.2.1.4] .work-authors — <p> */}
                                    <p className="work-authors"><strong>Autores:</strong> {work.authors}</p>
                                    {/* [SEÇÃO 1.1.2.1.5] .work-summary — <p> */}
                                    <p className="work-summary">{work.summary}</p>

                                    {/* Tags de Metodologia e Área */}
                                    {/* [SEÇÃO 1.1.2.1.6] .work-tags-row — <div> */}
                                    <div className="work-tags-row">
                                        {work.tags.map((tag, idx) => (
                                            /* [SEÇÃO 1.1.2.1.6.1] .work-tag-item — <span> */
                                            <span key={idx} className="work-tag-item">
                                                <Tag size={11} aria-hidden="true" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Rodapé do Card com Ação / DOI */}
                                    {/* [SEÇÃO 1.1.2.1.7] .work-card-footer — <div> */}
                                    <div className="work-card-footer">
                                        {work.externalUrl ? (
                                            /* [SEÇÃO 1.1.2.1.7.1] .work-doi-link — <a> */
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
                                            /* [SEÇÃO 1.1.2.1.7.2] .work-ongoing-notice — <span> */
                                            <span className="work-ongoing-notice">
                                                Projeto em execução — Resultados e pranchas em catalogação
                                            </span>
                                        )}
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        /* [SEÇÃO 1.1.2.2] .no-works-box — <div> */
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
                        /* [SEÇÃO 1.1.3.1] .admin-delete-box — <div> */
                        <div className="admin-delete-box">
                            {/* [SEÇÃO 1.1.3.1.1] .admin-delete-notice — <p> */}
                            <p className="admin-delete-notice">
                                Tem certeza de que deseja remover <strong className="admin-delete-highlight">"{modalConfig.data?.title}"</strong>? Esta pesquisa será excluída do catálogo público.
                            </p>
                            {/* [SEÇÃO 1.1.3.1.2] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.3.1.2.1] .admin-btn-cancel — <button> */}
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                {/* [SEÇÃO 1.1.3.1.2.2] .admin-btn-submit — <button> */}
                                <button type="button" className="admin-btn-submit" style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={closeModal}>
                                    Confirmar Exclusão
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            {/* [SEÇÃO 1.1.3.2.1] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.1.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Título da Pesquisa / Trabalho</label>
                                {/* [SEÇÃO 1.1.3.2.1.2] .admin-form-input — <input> */}
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.title || ''}
                                    placeholder="Nome completo do projeto ou artigo..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.2] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.2.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Status do Trabalho</label>
                                {/* [SEÇÃO 1.1.3.2.2.2] .admin-form-select — <select> */}
                                <select className="admin-form-select" defaultValue={modalConfig.data?.status || 'em_andamento'}>
                                    <option value="em_andamento">Em Andamento</option>
                                    <option value="concluido">Concluído</option>
                                </select>
                            </div>

                            {/* [SEÇÃO 1.1.3.2.3] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.3.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Autores</label>
                                {/* [SEÇÃO 1.1.3.2.3.2] .admin-form-input — <input> */}
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.authors || ''}
                                    placeholder="Pesquisadores e colaboradores..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.4] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.4.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Resumo Técnico</label>
                                {/* [SEÇÃO 1.1.3.2.4.2] .admin-form-textarea — <textarea> */}
                                <textarea
                                    rows="4"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.summary || ''}
                                    placeholder="Breve descrição dos objetivos e resultados..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.5] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.5.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Link Externo / DOI (Opcional)</label>
                                {/* [SEÇÃO 1.1.3.2.5.2] .admin-form-input — <input> */}
                                <input
                                    type="url"
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.externalUrl || ''}
                                    placeholder="https://doi.org/..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.6] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.3.2.6.1] .admin-btn-cancel — <button> */}
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                {/* [SEÇÃO 1.1.3.2.6.2] .admin-btn-submit — <button> */}
                                <button type="submit" className="admin-btn-submit">Salvar Trabalho</button>
                            </div>
                        </form>
                    )}
                </AdminModal>

            </div>
        </main>
    );
}
