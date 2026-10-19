/* ============================================================
 * [COMPONENTE] Works
 * Descrição: Produção científica separada em "Em Andamento" e "Concluídos", com busca e links de DOI.
 *            Possui integração reativa com Supabase e contingência automática via works.json.
 * Rota/Uso: Rota /trabalhos.
 * Dados: Supabase ('works') com fallback em src/data/works.json via worksService.
 * CSS correlato: Works.css
 * ============================================================ */
import { useState, useMemo, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle2, ExternalLink, Tag, Search, X, Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { fetchWorks, createWork, updateWork, deleteWork } from '../services/worksService';
import './Works.css';

/** [FUNÇÃO] Works — renderiza filtros, busca e cards de trabalhos. */
export function Works() {
    const { isAdmin } = useAuth();
    // [ESTADO] works — lista reativa de produções científicas
    const [works, setWorks] = useState([]);
    // [ESTADO] loadingWorks — indicador de carregamento
    const [loadingWorks, setLoadingWorks] = useState(true);
    // [ESTADO] filter — 'todos' | 'em_andamento' | 'concluidos'
    const [filter, setFilter] = useState('todos');
    // [ESTADO] searchQuery — texto de busca
    const [searchQuery, setSearchQuery] = useState('');
    // [ESTADO] modalConfig — { isOpen, title, type, data } controla o AdminModal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });
    // [ESTADO] formSubmitting — envio do formulário em andamento
    const [formSubmitting, setFormSubmitting] = useState(false);
    // [ESTADO] toast — notificação de feedback temporário
    const [toast, setToast] = useState(null);

    /** [HOOK] useEffect — Carrega os trabalhos na montagem */
    useEffect(() => {
        let isMounted = true;
        async function load() {
            setLoadingWorks(true);
            const { works: data } = await fetchWorks();
            if (isMounted) {
                setWorks(data);
                setLoadingWorks(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, []);

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
        if (formSubmitting) return;
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    /** [FUNÇÃO] handleConfirmDelete — remove o trabalho e atualiza o estado */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setFormSubmitting(true);
        const item = modalConfig.data;
        const { error } = await deleteWork(item.id);

        if (error) {
            setToast({ type: 'error', message: `Erro ao remover trabalho: ${error.message}` });
        } else {
            setWorks((prev) => prev.filter((w) => w.id !== item.id));
            setToast({ type: 'success', message: 'Trabalho removido com sucesso!' });
            closeModal();
        }
        setFormSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — trata a submissão de cadastro e alteração */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const isEdit = modalConfig.type === 'edit';
        const payload = {
            title: formData.get('title'),
            status: formData.get('status'),
            authors: formData.get('authors'),
            category: modalConfig.data?.category || 'Taxonomia & Ecologia',
            year: modalConfig.data?.year || String(new Date().getFullYear()),
            summary: formData.get('summary'),
            tags: modalConfig.data?.tags || ['LABETA', 'Pesquisa'],
            externalUrl: formData.get('externalUrl') || null,
            doi: formData.get('externalUrl')?.includes('doi.org') ? formData.get('externalUrl') : null
        };

        if (isEdit) {
            const currentId = modalConfig.data.id;
            const { data, error } = await updateWork(currentId, payload);
            if (error) {
                setToast({ type: 'error', message: `Falha ao atualizar trabalho: ${error.message}` });
            } else {
                const updated = data || { id: currentId, ...payload };
                setWorks((prev) => prev.map((w) => (w.id === currentId ? updated : w)));
                setToast({ type: 'success', message: 'Trabalho atualizado com sucesso!' });
                closeModal();
            }
        } else {
            const { data, error } = await createWork(payload);
            if (error) {
                setToast({ type: 'error', message: `Falha ao cadastrar trabalho: ${error.message}` });
            } else {
                const created = data || { id: `local-${Date.now()}`, ...payload };
                setWorks((prev) => [created, ...prev]);
                setToast({ type: 'success', message: 'Trabalho cadastrado com sucesso!' });
                closeModal();
            }
        }

        setFormSubmitting(false);
    };

    // Contadores para as abas
    const countAndamento = useMemo(() => works.filter((w) => w.status === 'em_andamento').length, [works]);
    const countConcluidos = useMemo(() => works.filter((w) => w.status === 'concluido' || w.status === 'concluidos').length, [works]);

    // Filtro combinado de busca e status
    const filteredWorks = useMemo(() => {
        return works.filter((work) => {
            const isConcluido = work.status === 'concluido' || work.status === 'concluidos';
            const matchesFilter =
                filter === 'todos' ||
                (filter === 'em_andamento' && work.status === 'em_andamento') ||
                (filter === 'concluidos' && isConcluido);

            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                query === '' ||
                work.title?.toLowerCase().includes(query) ||
                work.summary?.toLowerCase().includes(query) ||
                work.authors?.toLowerCase().includes(query) ||
                (Array.isArray(work.tags) && work.tags.some((t) => t.toLowerCase().includes(query)));

            return matchesFilter && matchesSearch;
        });
    }, [works, filter, searchQuery]);

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
                        <BookOpen size={16} />
                        <span>Produção Científica &amp; Extensão</span>
                    </div>
                    {/* [SEÇÃO 1.1.1.2] .works-title — <h1> */}
                    <h1 className="works-title">Trabalhos do Laboratório</h1>
                    {/* [SEÇÃO 1.1.1.3] .works-subtitle — <p> */}
                    <p className="works-subtitle">
                        Catálogo de projetos de pesquisa, dissertações, artigos científicos e inventários taxonômicos desenvolvidos por discentes e pesquisadores do LABETA.
                    </p>

                    {/* Barra de Busca de Trabalhos */}
                    {/* [SEÇÃO 1.1.1.4] .works-search-wrapper — <div> */}
                    <div className="works-search-wrapper" role="search">
                        {/* [SEÇÃO 1.1.1.4.1] .works-search-icon — <Search> */}
                        <Search size={18} className="works-search-icon" aria-hidden="true" />
                        {/* [SEÇÃO 1.1.1.4.2] .works-search-input — <input> */}
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por título, autor, metodologia ou palavra-chave..."
                            className="works-search-input"
                            aria-label="Filtrar trabalhos científicos"
                        />
                        {searchQuery && (
                            /* [SEÇÃO 1.1.1.4.2.1] .works-search-clear — <button> */
                            <button
                                type="button"
                                className="works-search-clear"
                                onClick={() => setSearchQuery('')}
                                aria-label="Limpar busca"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Navegação por Abas (Filtros de Status) */}
                    {/* [SEÇÃO 1.1.1.5] .works-tabs — <nav> */}
                    <nav className="works-tabs" aria-label="Filtrar trabalhos por status">
                        {/* [SEÇÃO 1.1.1.5.1] .works-tab-btn — <button> */}
                        <button
                            type="button"
                            className={`works-tab-btn ${filter === 'todos' ? 'active' : ''}`}
                            onClick={() => setFilter('todos')}
                        >
                            <span>Todos os Trabalhos</span>
                            <span className="count-pill">{works.length}</span>
                        </button>
                        {/* [SEÇÃO 1.1.1.5.2] .works-tab-btn — <button> */}
                        <button
                            type="button"
                            className={`works-tab-btn ${filter === 'em_andamento' ? 'active' : ''}`}
                            onClick={() => setFilter('em_andamento')}
                        >
                            <Clock size={15} />
                            <span>Em Andamento</span>
                            <span className="count-pill">{countAndamento}</span>
                        </button>
                        {/* [SEÇÃO 1.1.1.5.3] .works-tab-btn — <button> */}
                        <button
                            type="button"
                            className={`works-tab-btn ${filter === 'concluidos' ? 'active' : ''}`}
                            onClick={() => setFilter('concluidos')}
                        >
                            <CheckCircle2 size={15} />
                            <span>Concluídos</span>
                            <span className="count-pill">{countConcluidos}</span>
                        </button>
                    </nav>
                </header>

                {/* Barra de Ações Administrativas */}
                {isAdmin && (
                    /* [SEÇÃO 1.1.1.6] .admin-toolbar — <div> */
                    <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
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

                {/* Grade de Trabalhos */}
                {/* [SEÇÃO 1.1.2] .works-grid — <div> */}
                <div className="works-grid">
                    {loadingWorks ? (
                        <div className="no-works-box" style={{ gridColumn: '1 / -1' }}><p>Carregando produções científicas...</p></div>
                    ) : filteredWorks.length === 0 ? (
                        /* [SEÇÃO 1.1.2.1] .no-works-box — <div> */
                        <div className="no-works-box">
                            <p>
                                Nenhum trabalho encontrado
                                {searchQuery ? ` para a busca "${searchQuery}"` : ''}
                                {filter !== 'todos' ? ` na categoria selecionada.` : '.'}
                            </p>
                        </div>
                    ) : (
                        filteredWorks.map((work) => (
                            /* [SEÇÃO 1.1.2.2] .work-card — <article> */
                            <article key={work.id} className="work-card">
                                {/* Barra de Ações Administrativas do Card */}
                                {isAdmin && (
                                    /* [SEÇÃO 1.1.2.2.1] .card-admin-actions — <div> */
                                    <div className="card-admin-actions">
                                        {/* [SEÇÃO 1.1.2.2.1.1] .card-admin-badge — <span> */}
                                        <span className="card-admin-badge">
                                            <ShieldCheck size={12} aria-hidden="true" />
                                            <span>Gestão</span>
                                        </span>
                                        {/* [SEÇÃO 1.1.2.2.1.2] .card-admin-btns-group — <div> */}
                                        <div className="card-admin-btns-group">
                                            {/* [SEÇÃO 1.1.2.2.1.2.1] .admin-action-btn .edit — <button> */}
                                            <button
                                                type="button"
                                                className="admin-action-btn edit"
                                                title="Editar trabalho"
                                                onClick={() => openEditModal(work)}
                                            >
                                                <Edit2 size={13} />
                                                <span>Editar</span>
                                            </button>
                                            {/* [SEÇÃO 1.1.2.2.1.2.2] .admin-action-btn .delete — <button> */}
                                            <button
                                                type="button"
                                                className="admin-action-btn delete"
                                                title="Excluir trabalho"
                                                onClick={() => openDeleteModal(work)}
                                            >
                                                <Trash2 size={13} />
                                                <span>Excluir</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* [SEÇÃO 1.1.2.2.2] .work-card-meta — <div> */}
                                <div className="work-card-meta">
                                    {/* [SEÇÃO 1.1.2.2.2.1] .status-pill — <span> */}
                                    <span className={`status-pill pill-${work.status === 'concluidos' ? 'concluido' : work.status}`}>
                                        {work.status === 'em_andamento' ? (
                                            <>
                                                <Clock size={12} />
                                                <span>Em Andamento</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={12} />
                                                <span>Concluído ({work.year})</span>
                                            </>
                                        )}
                                    </span>
                                    {/* [SEÇÃO 1.1.2.2.2.2] .work-category — <span className="work-category"> */}
                                    <span className="work-category">{work.category}</span>
                                </div>

                                {/* [SEÇÃO 1.1.2.2.3] .work-title — <h2> */}
                                <h2 className="work-title">{work.title}</h2>
                                {/* [SEÇÃO 1.1.2.2.4] .work-authors — <p> */}
                                <p className="work-authors">
                                    <strong>Autores:</strong> {work.authors}
                                </p>
                                {/* [SEÇÃO 1.1.2.2.5] .work-summary — <p> */}
                                <p className="work-summary">{work.summary}</p>

                                {/* Tags Metodológicas */}
                                {Array.isArray(work.tags) && work.tags.length > 0 && (
                                    /* [SEÇÃO 1.1.2.2.6] .work-tags — <div className="work-tags"> */
                                    <div className="work-tags">
                                        {work.tags.map((tag, idx) => (
                                            /* [SEÇÃO 1.1.2.2.6.1] .work-tag-item — <span> */
                                            <span key={idx} className="work-tag-item">
                                                <Tag size={11} />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Links de Acesso */}
                                {(work.doi || work.externalUrl) && (
                                    /* [SEÇÃO 1.1.2.2.7] .work-card-footer — <footer className="work-card-footer"> */
                                    <footer className="work-card-footer">
                                        {work.doi && (
                                            /* [SEÇÃO 1.1.2.2.7.1] .work-link .doi-link — <a> */
                                            <a
                                                href={`https://doi.org/${work.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="work-link doi-link"
                                                title="Acessar publicação via identificador DOI"
                                                aria-label={`Acessar artigo ${work.title} via DOI: ${work.doi} (abre em nova aba)`}
                                            >
                                                <span>DOI: {work.doi}</span>
                                                <ExternalLink size={13} />
                                            </a>
                                        )}
                                        {work.externalUrl && !work.doi && (
                                            /* [SEÇÃO 1.1.2.2.7.2] .work-link .external-link — <a> */
                                            <a
                                                href={work.externalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="work-link external-link"
                                                title="Acessar repositório ou página externa do trabalho"
                                                aria-label={`Acessar repositório externo de ${work.title} (abre em nova aba)`}
                                            >
                                                <span>Acessar Publicação</span>
                                                <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </footer>
                                )}
                            </article>
                        ))
                    )}
                </div>

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
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancelar
                                </button>
                                {/* [SEÇÃO 1.1.3.1.2.2] .admin-btn-submit — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-submit"
                                    style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                                    onClick={handleConfirmDelete}
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Excluindo...' : 'Confirmar Exclusão'}
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
                                    name="title"
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
                                <select
                                    name="status"
                                    className="admin-form-select"
                                    defaultValue={modalConfig.data?.status || 'em_andamento'}
                                >
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
                                    name="authors"
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
                                    name="summary"
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
                                    name="externalUrl"
                                    type="url"
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.externalUrl || (modalConfig.data?.doi ? `https://doi.org/${modalConfig.data.doi}` : '')}
                                    placeholder="https://doi.org/..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.6] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.3.2.6.1] .admin-btn-cancel — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancelar
                                </button>
                                {/* [SEÇÃO 1.1.3.2.6.2] .admin-btn-submit — <button> */}
                                <button
                                    type="submit"
                                    className="admin-btn-submit"
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Salvando...' : 'Salvar Trabalho'}
                                </button>
                            </div>
                        </form>
                    )}
                </AdminModal>

                {/* Toast de Feedback */}
                {toast && (
                    <ToastNotification
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                )}

            </div>
        </main>
    );
}
