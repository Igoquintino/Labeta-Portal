/* ============================================================
 * [COMPONENTE] News
 * Descrição: Radar ficológico: comunicados do LABETA e Radar Científico (artigos) em 2 colunas.
 *            Possui integração reativa com Supabase e contingência automática (fallback) via news.json.
 * Rota/Uso: Rota /noticias.
 * Dados: Supabase ('news') com fallback em src/data/news.json via newsService.
 * CSS correlato: News.css
 * ============================================================ */
import { useState, useEffect } from 'react';
import { Newspaper, Bell, FileText, ExternalLink, Calendar, Tag, Sparkles, Plus, Edit2, Trash2, Search, Eye, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { fetchNews, createNewsItem, updateNewsItem, deleteNewsItem } from '../services/newsService';
import './News.css';

/** [FUNÇÃO] News — renderiza comunicados, radar científico, busca e leitura. */
export function News() {
    const { isAdmin } = useAuth();

    // [ESTADO] announcements — lista reativa de comunicados do LABETA
    const [announcements, setAnnouncements] = useState([]);
    // [ESTADO] scientificRadar — lista reativa de artigos científicos
    const [scientificRadar, setScientificRadar] = useState([]);
    // [ESTADO] loadingNews — indicador de carregamento inicial
    const [loadingNews, setLoadingNews] = useState(true);

    // [ESTADO] modalConfig — { isOpen, title, type, data } controla o AdminModal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });
    // [ESTADO] formSubmitting — estado de salvamento em andamento
    const [formSubmitting, setFormSubmitting] = useState(false);
    // [ESTADO] readingAnnouncement — comunicado aberto no leitor
    const [readingAnnouncement, setReadingAnnouncement] = useState(null);
    // [ESTADO] searchQuery — texto de filtro das notícias
    const [searchQuery, setSearchQuery] = useState('');
    // [ESTADO] toast — { message, type } para notificações temporárias
    const [toast, setToast] = useState(null);

    /** [HOOK] useEffect — Carrega as notícias no ciclo de vida inicial */
    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            setLoadingNews(true);
            const { announcements: ann, scientificRadar: radar } = await fetchNews();
            if (isMounted) {
                setAnnouncements(ann);
                setScientificRadar(radar);
                setLoadingNews(false);
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, []);

    /** [FUNÇÃO] openCreateModal — abre o AdminModal em modo "criar" (somente admin). */
    const openCreateModal = (type) => {
        setModalConfig({
            isOpen: true,
            title: type === 'announcement' ? 'Novo Comunicado Institucional' : 'Novo Artigo no Radar Científico',
            type,
            data: null
        });
    };

    /** [FUNÇÃO] openEditModal — abre o AdminModal em modo "editar" com os dados do item. */
    const openEditModal = (type, item) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${item.title}`,
            type: `edit_${type}`,
            data: item
        });
    };

    /** [FUNÇÃO] openDeleteModal — abre o AdminModal de confirmação de exclusão. */
    const openDeleteModal = (item) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Remoção',
            type: 'delete',
            data: item
        });
    };

    /** [FUNÇÃO] closeModal — fecha o AdminModal e reseta modalConfig. */
    const closeModal = () => {
        if (formSubmitting) return;
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    /** [FUNÇÃO] handleConfirmDelete — processa a exclusão no backend e atualiza o estado local */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setFormSubmitting(true);
        const item = modalConfig.data;
        const { error } = await deleteNewsItem(item.id);

        if (error) {
            setToast({ type: 'error', message: `Erro ao excluir: ${error.message}` });
        } else {
            // Atualização otimista imediata na interface
            setAnnouncements((prev) => prev.filter((a) => a.id !== item.id));
            setScientificRadar((prev) => prev.filter((r) => r.id !== item.id));
            setToast({ type: 'success', message: 'Registro removido com sucesso!' });
            closeModal();
        }
        setFormSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — trata o envio do formulário (criação e edição) */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const isEdit = modalConfig.type.startsWith('edit_');
        const isAnnouncement = modalConfig.type.includes('announcement');
        const targetType = isAnnouncement ? 'announcement' : 'radar';

        const payload = isAnnouncement ? {
            title: formData.get('title'),
            tag: formData.get('tag'),
            content: formData.get('content'),
            date: modalConfig.data?.date || new Date().toISOString().split('T')[0]
        } : {
            title: formData.get('title'),
            journal: formData.get('journal'),
            authors: formData.get('authors'),
            summary: formData.get('summary'),
            content: formData.get('summary'),
            url: formData.get('url'),
            year: formData.get('year') || (modalConfig.data?.year ? String(modalConfig.data.year) : String(new Date().getFullYear())),
            doi: formData.get('doi') || modalConfig.data?.doi || '',
            date: modalConfig.data?.date || new Date().toISOString().split('T')[0]
        };

        if (isEdit) {
            const currentId = modalConfig.data.id;
            const { data, error } = await updateNewsItem(currentId, targetType, payload);
            if (error) {
                setToast({ type: 'error', message: `Falha ao atualizar: ${error.message}` });
            } else {
                const updated = data || { id: currentId, ...payload };
                if (isAnnouncement) {
                    setAnnouncements((prev) => prev.map((a) => (a.id === currentId ? updated : a)));
                } else {
                    setScientificRadar((prev) => prev.map((r) => (r.id === currentId ? updated : r)));
                }
                setToast({ type: 'success', message: 'Registro atualizado com sucesso!' });
                closeModal();
            }
        } else {
            const { data, error } = await createNewsItem(targetType, payload);
            if (error) {
                setToast({ type: 'error', message: `Falha ao salvar: ${error.message}` });
            } else {
                const created = data || { id: `local-${Date.now()}`, ...payload };
                if (isAnnouncement) {
                    setAnnouncements((prev) => [created, ...prev]);
                } else {
                    setScientificRadar((prev) => [created, ...prev]);
                }
                setToast({ type: 'success', message: 'Registro cadastrado com sucesso!' });
                closeModal();
            }
        }

        setFormSubmitting(false);
    };

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredAnnouncements = announcements.filter((item) => {
        if (!normalizedQuery) return true;
        return (
            item.title?.toLowerCase().includes(normalizedQuery) ||
            item.content?.toLowerCase().includes(normalizedQuery) ||
            item.tag?.toLowerCase().includes(normalizedQuery)
        );
    });

    const filteredRadar = scientificRadar.filter((article) => {
        if (!normalizedQuery) return true;
        return (
            article.title?.toLowerCase().includes(normalizedQuery) ||
            article.summary?.toLowerCase().includes(normalizedQuery) ||
            article.journal?.toLowerCase().includes(normalizedQuery) ||
            article.authors?.toLowerCase().includes(normalizedQuery)
        );
    });

    return (
        /* [SEÇÃO 1] .news-page — <main> */
        <main className="news-page" id="main-content">
            {/* [SEÇÃO 1.1] .news-container — <div> */}
            <div className="news-container">

                {/* Cabeçalho da Página */}
                {/* [SEÇÃO 1.1.1] .news-header — <header> */}
                <header className="news-header">
                    {/* [SEÇÃO 1.1.1.1] .news-badge — <div> */}
                    <div className="news-badge">
                        <Newspaper size={16} />
                        <span>Divulgação &amp; Informação</span>
                    </div>
                    {/* [SEÇÃO 1.1.1.2] .news-title — <h1> */}
                    <h1 className="news-title">Notícias &amp; Radar Científico</h1>
                    {/* [SEÇÃO 1.1.1.3] .news-subtitle — <p> */}
                    <p className="news-subtitle">
                        Acompanhe comunicados operacionais do laboratório e os principais artigos científicos publicados sobre algas e ecossistemas aquáticos amazônicos.
                    </p>

                    {/* Barra de Busca e Filtragem Rápida */}
                    {/* [SEÇÃO 1.1.1.4] .news-search-wrapper — <div> */}
                    <div className="news-search-wrapper" role="search">
                        {/* [SEÇÃO 1.1.1.4.1] .news-search-icon — <Search> */}
                        <Search size={18} className="news-search-icon" aria-hidden="true" />
                        {/* [SEÇÃO 1.1.1.4.2] .news-search-input — <input> */}
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar comunicados ou artigos por palavras-chave, tag, autores..."
                            className="news-search-input"
                            aria-label="Filtrar comunicados e artigos científicos"
                        />
                        {searchQuery && (
                            /* [SEÇÃO 1.1.1.4.2.1] .news-search-clear — <button> */
                            <button
                                type="button"
                                className="news-search-clear"
                                onClick={() => setSearchQuery('')}
                                aria-label="Limpar pesquisa"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </header>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    /* [SEÇÃO 1.1.1.5] .admin-toolbar — <div> */
                    <div className="admin-toolbar" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        {/* [SEÇÃO 1.1.1.5.1] .admin-btn-primary — <button> */}
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreateModal('announcement')}
                        >
                            <Plus size={16} /> Novo Comunicado
                        </button>
                        {/* [SEÇÃO 1.1.1.5.2] .admin-btn-primary — <button> */}
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreateModal('radar')}
                        >
                            <Plus size={16} /> Novo Artigo Radar
                        </button>
                    </div>
                )}

                {/* Layout em Duas Colunas */}
                {/* [SEÇÃO 1.1.2] .news-grid-columns — <div> */}
                <div className="news-grid-columns">

                    {/* Coluna 1: Comunicados do LABETA */}
                    {/* [SEÇÃO 1.1.2.1] .news-col .announcements-col — <section> */}
                    <section className="news-col announcements-col" aria-label="Comunicados Oficiais do LABETA">
                        {/* [SEÇÃO 1.1.2.1.1] .news-col-header — <div> */}
                        <div className="news-col-header">
                            {/* [SEÇÃO 1.1.2.1.1.1] .header-icon-box .announcement-icon — <div> */}
                            <div className="header-icon-box announcement-icon">
                                <Bell size={20} />
                            </div>
                            <div>
                                {/* [SEÇÃO 1.1.2.1.1.2.1] .news-col-title — <h2> */}
                                <h2 className="news-col-title">Comunicados do LABETA</h2>
                                {/* [SEÇÃO 1.1.2.1.1.2.2] .news-col-desc — <p> */}
                                <p className="news-col-desc">Avisos e comunicados operacionais para pesquisadores e alunos.</p>
                            </div>
                        </div>

                        {/* [SEÇÃO 1.1.2.1.2] .cards-stack — <div> */}
                        <div className="cards-stack">
                            {loadingNews ? (
                                <div className="news-empty-state"><p>Carregando comunicados...</p></div>
                            ) : filteredAnnouncements.length === 0 ? (
                                /* [SEÇÃO 1.1.2.1.2.1] .news-empty-state — <div> */
                                <div className="news-empty-state">
                                    <p>Nenhum comunicado encontrado{searchQuery ? ` para "${searchQuery}"` : ''}.</p>
                                </div>
                            ) : (
                                filteredAnnouncements.map((item) => (
                                    /* [SEÇÃO 1.1.2.1.2.1.2] .news-card .announcement-card — <article> */
                                    <article key={item.id} className="news-card announcement-card">
                                        {/* Barra de Ações Administrativas do Card */}
                                        {isAdmin && (
                                            /* [SEÇÃO 1.1.2.1.2.1.2.1] .card-admin-actions — <div> */
                                            <div className="card-admin-actions">
                                                {/* [SEÇÃO 1.1.2.1.2.1.2.1.1] .card-admin-badge — <span> */}
                                                <span className="card-admin-badge">
                                                    <ShieldCheck size={12} aria-hidden="true" />
                                                    <span>Gestão</span>
                                                </span>
                                                {/* [SEÇÃO 1.1.2.1.2.1.2.1.2] .card-admin-btns-group — <div> */}
                                                <div className="card-admin-btns-group">
                                                    {/* [SEÇÃO 1.1.2.1.2.1.2.1.2.1] .admin-action-btn .edit — <button> */}
                                                    <button
                                                        type="button"
                                                        className="admin-action-btn edit"
                                                        title="Editar comunicado"
                                                        onClick={() => openEditModal('announcement', item)}
                                                    >
                                                        <Edit2 size={13} />
                                                        <span>Editar</span>
                                                    </button>
                                                    {/* [SEÇÃO 1.1.2.1.2.1.2.1.2.2] .admin-action-btn .delete — <button> */}
                                                    <button
                                                        type="button"
                                                        className="admin-action-btn delete"
                                                        title="Excluir comunicado"
                                                        onClick={() => openDeleteModal(item)}
                                                    >
                                                        <Trash2 size={13} />
                                                        <span>Excluir</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* [SEÇÃO 1.1.2.1.2.1.2.2] .news-card-meta — <div> */}
                                        <div className="news-card-meta">
                                            {/* [SEÇÃO 1.1.2.1.2.1.2.2.1] .news-tag .announcement-tag — <span> */}
                                            <span className="news-tag announcement-tag">
                                                <Tag size={12} />
                                                {item.tag}
                                            </span>
                                            {/* [SEÇÃO 1.1.2.1.2.1.2.2.2] .news-date — <span> */}
                                            <span className="news-date">
                                                <Calendar size={13} />
                                                {item.date}
                                            </span>
                                        </div>

                                        {/* [SEÇÃO 1.1.2.1.2.1.2.3] .news-item-title — <h3> */}
                                        <h3 className="news-item-title">{item.title}</h3>
                                        {/* [SEÇÃO 1.1.2.1.2.1.2.4] .news-item-content — <p> */}
                                        <p className="news-item-content">{item.content}</p>

                                        {/* [SEÇÃO 1.1.2.1.2.1.2.5] .news-card-footer — <div> */}
                                        <div className="news-card-footer">
                                            {/* [SEÇÃO 1.1.2.1.2.1.2.5.1] .read-announcement-btn — <button> */}
                                            <button
                                                type="button"
                                                className="read-announcement-btn"
                                                onClick={() => setReadingAnnouncement(item)}
                                                aria-label={`Ler comunicado completo: ${item.title}`}
                                            >
                                                <Eye size={13} />
                                                <span>Ler na íntegra</span>
                                            </button>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Coluna 2: Radar Científico (Artigos em Periódicos) */}
                    {/* [SEÇÃO 1.1.2.2] .news-col .radar-col — <section> */}
                    <section className="news-col radar-col" aria-label="Radar Científico e Artigos">
                        {/* [SEÇÃO 1.1.2.2.1] .news-col-header — <div> */}
                        <div className="news-col-header">
                            {/* [SEÇÃO 1.1.2.2.1.1] .header-icon-box .radar-icon — <div> */}
                            <div className="header-icon-box radar-icon">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                {/* [SEÇÃO 1.1.2.2.1.2.1] .news-col-title — <h2> */}
                                <h2 className="news-col-title">Radar Científico</h2>
                                {/* [SEÇÃO 1.1.2.2.1.2.2] .news-col-desc — <p> */}
                                <p className="news-col-desc">Destaques de artigos publicados em revistas internacionais.</p>
                            </div>
                        </div>

                        {/* [SEÇÃO 1.1.2.2.2] .cards-stack — <div> */}
                        <div className="cards-stack">
                            {loadingNews ? (
                                <div className="news-empty-state"><p>Carregando artigos...</p></div>
                            ) : filteredRadar.length === 0 ? (
                                /* [SEÇÃO 1.1.2.2.2.1] .news-empty-state — <div> */
                                <div className="news-empty-state">
                                    <p>Nenhum artigo encontrado{searchQuery ? ` para "${searchQuery}"` : ''}.</p>
                                </div>
                            ) : (
                                filteredRadar.map((article) => (
                                    /* [SEÇÃO 1.1.2.2.2.1.2] .news-card .radar-card — <article> */
                                    <article key={article.id} className="news-card radar-card">
                                        {/* Barra de Ações Administrativas do Card */}
                                        {isAdmin && (
                                            /* [SEÇÃO 1.1.2.2.2.1.2.1] .card-admin-actions — <div> */
                                            <div className="card-admin-actions">
                                                {/* [SEÇÃO 1.1.2.2.2.1.2.1.1] .card-admin-badge — <span> */}
                                                <span className="card-admin-badge">
                                                    <ShieldCheck size={12} aria-hidden="true" />
                                                    <span>Gestão</span>
                                                </span>
                                                {/* [SEÇÃO 1.1.2.2.2.1.2.1.2] .card-admin-btns-group — <div> */}
                                                <div className="card-admin-btns-group">
                                                    {/* [SEÇÃO 1.1.2.2.2.1.2.1.2.1] .admin-action-btn .edit — <button> */}
                                                    <button
                                                        type="button"
                                                        className="admin-action-btn edit"
                                                        title="Editar artigo do radar"
                                                        onClick={() => openEditModal('radar', article)}
                                                    >
                                                        <Edit2 size={13} />
                                                        <span>Editar</span>
                                                    </button>
                                                    {/* [SEÇÃO 1.1.2.2.2.1.2.1.2.2] .admin-action-btn .delete — <button> */}
                                                    <button
                                                        type="button"
                                                        className="admin-action-btn delete"
                                                        title="Excluir artigo"
                                                        onClick={() => openDeleteModal(article)}
                                                    >
                                                        <Trash2 size={13} />
                                                        <span>Excluir</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* [SEÇÃO 1.1.2.2.2.1.2.2] .news-card-meta — <div> */}
                                        <div className="news-card-meta">
                                            {/* [SEÇÃO 1.1.2.2.2.1.2.2.1] .news-tag .radar-tag — <span> */}
                                            <span className="news-tag radar-tag">
                                                <FileText size={12} />
                                                {article.journal} ({article.year})
                                            </span>
                                            {/* [SEÇÃO 1.1.2.2.2.1.2.2.2] .news-date — <span> */}
                                            <span className="news-date">
                                                <Calendar size={13} />
                                                {article.date}
                                            </span>
                                        </div>

                                        {/* [SEÇÃO 1.1.2.2.2.1.2.3] .news-item-title .radar-title — <h3> */}
                                        <h3 className="news-item-title radar-title">{article.title}</h3>
                                        {/* [SEÇÃO 1.1.2.2.2.1.2.4] .radar-authors — <p> */}
                                        <p className="radar-authors"><strong>Autores:</strong> {article.authors}</p>
                                        {/* [SEÇÃO 1.1.2.2.2.1.2.5] .news-item-content — <p> */}
                                        <p className="news-item-content">{article.summary}</p>

                                        {/* [SEÇÃO 1.1.2.2.2.1.2.6] .news-card-footer — <div> */}
                                        <div className="news-card-footer">
                                            {/* [SEÇÃO 1.1.2.2.2.1.2.6.1] .doi-badge-link — <a> */}
                                            {article.url ? (
                                                <a
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="doi-badge-link"
                                                    title="Acessar publicação no periódico (abre em nova aba)"
                                                    aria-label={`Acessar artigo ${article.title} com DOI ${article.doi || ''} (abre em nova aba)`}
                                                >
                                                    <span>Acessar Artigo {article.doi ? `(DOI: ${article.doi})` : ''}</span>
                                                    <ExternalLink size={13} />
                                                </a>
                                            ) : (
                                                <span className="doi-badge-link" style={{ opacity: 0.65 }}>
                                                    Publicação Registrada
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>

                </div>

                {/* Modal de Leitura na Íntegra */}
                <AdminModal
                    isOpen={Boolean(readingAnnouncement)}
                    onClose={() => setReadingAnnouncement(null)}
                    title={readingAnnouncement?.title || 'Comunicado'}
                >
                    {readingAnnouncement && (
                        /* [SEÇÃO 1.1.3.1] .announcement-read-wrapper — <div> */
                        <div className="announcement-read-wrapper">
                            {/* [SEÇÃO 1.1.3.1.1] .announcement-read-meta — <div> */}
                            <div className="announcement-read-meta">
                                {/* [SEÇÃO 1.1.3.1.1.1] .news-tag .announcement-tag — <span> */}
                                <span className="news-tag announcement-tag">
                                    <Tag size={12} />
                                    {readingAnnouncement.tag}
                                </span>
                                {/* [SEÇÃO 1.1.3.1.1.2] .news-date — <span> */}
                                <span className="news-date">
                                    <Calendar size={13} />
                                    {readingAnnouncement.date}
                                </span>
                            </div>
                            {/* [SEÇÃO 1.1.3.1.2] .announcement-read-body — <div> */}
                            <div className="announcement-read-body">
                                <p>{readingAnnouncement.content}</p>
                            </div>
                            {/* [SEÇÃO 1.1.3.1.3] .admin-form-actions — <div> */}
                            <div className="admin-form-actions" style={{ marginTop: '1.75rem', justifyContent: 'flex-end' }}>
                                {/* [SEÇÃO 1.1.3.1.3.1] .admin-btn-primary — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-primary"
                                    onClick={() => setReadingAnnouncement(null)}
                                >
                                    Fechar Leitura
                                </button>
                            </div>
                        </div>
                    )}
                </AdminModal>

                {/* Modal Administrativo Unificado (Criação, Edição e Exclusão) */}
                <AdminModal
                    isOpen={modalConfig.isOpen}
                    onClose={closeModal}
                    title={modalConfig.title}
                >
                    {modalConfig.type === 'delete' ? (
                        /* [SEÇÃO 1.1.4.1] .admin-delete-box — <div> */
                        <div className="admin-delete-box">
                            {/* [SEÇÃO 1.1.4.1.1] .admin-delete-notice — <p> */}
                            <p className="admin-delete-notice">
                                Tem certeza de que deseja remover <strong className="admin-delete-highlight">"{modalConfig.data?.title}"</strong>? Esta ação não poderá ser desfeita.
                            </p>
                            {/* [SEÇÃO 1.1.4.1.2] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.4.1.2.1] .admin-btn-cancel — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancelar
                                </button>
                                {/* [SEÇÃO 1.1.4.1.2.2] .admin-btn-submit — <button> */}
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
                            {/* [SEÇÃO 1.1.4.2.1] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.4.2.1.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Título</label>
                                {/* [SEÇÃO 1.1.4.2.1.2] .admin-form-input — <input> */}
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.title || ''}
                                    placeholder="Informe o título principal..."
                                />
                            </div>

                            {modalConfig.type.includes('announcement') ? (
                                <>
                                    {/* [SEÇÃO 1.1.4.2.1.2.1] .admin-form-group — <div> */}
                                    <div className="admin-form-group">
                                        {/* [SEÇÃO 1.1.4.2.1.2.1.1] .admin-form-label — <label> */}
                                        <label className="admin-form-label">Categoria / Tag</label>
                                        {/* [SEÇÃO 1.1.4.2.1.2.1.2] .admin-form-input — <input> */}
                                        <input
                                            name="tag"
                                            type="text"
                                            required
                                            className="admin-form-input"
                                            defaultValue={modalConfig.data?.tag || 'Aviso Operacional'}
                                        />
                                    </div>
                                    {/* [SEÇÃO 1.1.4.2.1.2.2] .admin-form-group — <div> */}
                                    <div className="admin-form-group">
                                        {/* [SEÇÃO 1.1.4.2.1.2.2.1] .admin-form-label — <label> */}
                                        <label className="admin-form-label">Conteúdo do Comunicado</label>
                                        {/* [SEÇÃO 1.1.4.2.1.2.2.2] .admin-form-textarea — <textarea> */}
                                        <textarea
                                            name="content"
                                            rows="4"
                                            required
                                            className="admin-form-textarea"
                                            defaultValue={modalConfig.data?.content || ''}
                                            placeholder="Detalhes completos do comunicado..."
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* [SEÇÃO 1.1.4.2.1.2.3] .admin-form-group — <div> */}
                                    <div className="admin-form-group">
                                        {/* [SEÇÃO 1.1.4.2.1.2.3.1] .admin-form-label — <label> */}
                                        <label className="admin-form-label">Periódico / Revista</label>
                                        {/* [SEÇÃO 1.1.4.2.1.2.3.2] .admin-form-input — <input> */}
                                        <input
                                            name="journal"
                                            type="text"
                                            required
                                            className="admin-form-input"
                                            defaultValue={modalConfig.data?.journal || ''}
                                            placeholder="Ex.: Phytotaxa, Hydrobiologia..."
                                        />
                                    </div>
                                    {/* [SEÇÃO 1.1.4.2.1.2.4] .admin-form-group — <div> */}
                                    <div className="admin-form-group">
                                        {/* [SEÇÃO 1.1.4.2.1.2.4.1] .admin-form-label — <label> */}
                                        <label className="admin-form-label">Autores</label>
                                        {/* [SEÇÃO 1.1.4.2.1.2.4.2] .admin-form-input — <input> */}
                                        <input
                                            name="authors"
                                            type="text"
                                            required
                                            className="admin-form-input"
                                            defaultValue={modalConfig.data?.authors || ''}
                                            placeholder="Sobrenome, N. et al."
                                        />
                                    </div>
                                    {/* [SEÇÃO 1.1.4.2.1.2.5] .admin-form-group — <div> */}
                                    <div className="admin-form-group">
                                        {/* [SEÇÃO 1.1.4.2.1.2.5.1] .admin-form-label — <label> */}
                                        <label className="admin-form-label">Resumo Técnico</label>
                                        {/* [SEÇÃO 1.1.4.2.1.2.5.2] .admin-form-textarea — <textarea> */}
                                        <textarea
                                            name="summary"
                                            rows="3"
                                            required
                                            className="admin-form-textarea"
                                            defaultValue={modalConfig.data?.summary || ''}
                                            placeholder="Resumo do artigo..."
                                        />
                                    </div>
                                    {/* [SEÇÃO 1.1.4.2.1.2.6] .admin-form-group — <div> */}
                                    <div className="admin-form-group">
                                        {/* [SEÇÃO 1.1.4.2.1.2.6.1] .admin-form-label — <label> */}
                                        <label className="admin-form-label">Link DOI / URL</label>
                                        {/* [SEÇÃO 1.1.4.2.1.2.6.2] .admin-form-input — <input> */}
                                        <input
                                            name="url"
                                            type="url"
                                            required
                                            className="admin-form-input"
                                            defaultValue={modalConfig.data?.url || ''}
                                            placeholder="https://doi.org/..."
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Código DOI (opcional)</label>
                                        <input
                                            name="doi"
                                            type="text"
                                            className="admin-form-input"
                                            defaultValue={modalConfig.data?.doi || ''}
                                            placeholder="Ex.: 10.1016/j.algal.2026.103980"
                                        />
                                    </div>
                                </>
                            )}

                            {/* [SEÇÃO 1.1.4.2.2] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.4.2.2.1] .admin-btn-cancel — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancelar
                                </button>
                                {/* [SEÇÃO 1.1.4.2.2.2] .admin-btn-submit — <button> */}
                                <button
                                    type="submit"
                                    className="admin-btn-submit"
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Salvando...' : 'Salvar Registro'}
                                </button>
                            </div>
                        </form>
                    )}
                </AdminModal>

                {/* Notificação Toast de Feedback */}
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
