/* ============================================================
 * [COMPONENTE] News
 * Descrição: Radar ficológico: comunicados do LABETA e Radar Científico (artigos) em 2 colunas.
 *            Possui integração reativa com Supabase e contingência automática (fallback) via news.json.
 * Rota/Uso: Rota /noticias.
 * Dados: Supabase ('news') com fallback em src/data/news.json via newsService.
 * CSS correlato: News.css
 * ============================================================ */
import { useState, useEffect } from 'react';
import { Newspaper, Bell, FileText, ExternalLink, Calendar, Tag, Sparkles, Plus, Eye } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useModalState } from '../hooks/useModalState';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { PageHeader } from '../components/common/PageHeader';
import { SearchInput } from '../components/common/SearchInput';
import { Badge } from '../components/common/Badge';
import { CardAdminActions } from '../components/common/CardAdminActions';
import { DeleteConfirmDialog } from '../components/common/DeleteConfirmDialog';
import { AnnouncementForm } from '../components/news/AnnouncementForm';
import { RadarForm } from '../components/news/RadarForm';
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

    // [ESTADO] readingAnnouncement — comunicado aberto no leitor
    const [readingAnnouncement, setReadingAnnouncement] = useState(null);
    // [ESTADO] searchQuery — texto de filtro das notícias
    const [searchQuery, setSearchQuery] = useState('');

    // [HOOK] useModalState — controle unificado de diálogos e toasts
    const {
        modalConfig,
        isSubmitting,
        toast,
        showToast,
        clearToast,
        openCreate,
        openEdit,
        openDelete,
        closeModal,
        setIsSubmitting
    } = useModalState();

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

    /** [FUNÇÃO] handleConfirmDelete — processa a exclusão no backend e atualiza o estado local */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setIsSubmitting(true);
        const item = modalConfig.data;
        const { error } = await deleteNewsItem(item.id);

        if (error) {
            showToast(`Erro ao excluir: ${error.message}`, 'error');
        } else {
            setAnnouncements((prev) => prev.filter((a) => a.id !== item.id));
            setScientificRadar((prev) => prev.filter((r) => r.id !== item.id));
            showToast('Registro removido com sucesso!', 'success');
            closeModal();
        }
        setIsSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — trata o envio do formulário (criação e edição) */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const isAnnouncement = modalConfig.type.includes('announcement');
        const isEdit = Boolean(modalConfig.data?.id);
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
                showToast(`Falha ao atualizar: ${error.message}`, 'error');
            } else {
                const updated = data || { id: currentId, ...payload };
                if (isAnnouncement) {
                    setAnnouncements((prev) => prev.map((a) => (a.id === currentId ? updated : a)));
                } else {
                    setScientificRadar((prev) => prev.map((r) => (r.id === currentId ? updated : r)));
                }
                showToast('Registro atualizado com sucesso!', 'success');
                closeModal();
            }
        } else {
            const { data, error } = await createNewsItem(targetType, payload);
            if (error) {
                showToast(`Falha ao salvar: ${error.message}`, 'error');
            } else {
                const created = data || { id: `local-${Date.now()}`, ...payload };
                if (isAnnouncement) {
                    setAnnouncements((prev) => [created, ...prev]);
                } else {
                    setScientificRadar((prev) => [created, ...prev]);
                }
                showToast('Registro cadastrado com sucesso!', 'success');
                closeModal();
            }
        }

        setIsSubmitting(false);
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

                {/* Cabeçalho da Página com Busca Integrada */}
                <PageHeader
                    badgeIcon={Newspaper}
                    badgeText="Divulgação & Informação"
                    title="Notícias & Radar Científico"
                    subtitle="Acompanhe comunicados operacionais do laboratório e os principais artigos científicos publicados sobre algas e ecossistemas aquáticos amazônicos."
                >
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Buscar comunicados ou artigos por palavras-chave, tag, autores..."
                        ariaLabel="Filtrar comunicados e artigos científicos"
                    />
                </PageHeader>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    <div className="admin-toolbar" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreate('Novo Comunicado Institucional', 'announcement')}
                        >
                            <Plus size={16} /> Novo Comunicado
                        </button>
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreate('Novo Artigo no Radar Científico', 'radar')}
                        >
                            <Plus size={16} /> Novo Artigo Radar
                        </button>
                    </div>
                )}

                {/* Layout em Duas Colunas */}
                <div className="news-grid-columns">

                    {/* Coluna 1: Comunicados do LABETA */}
                    <section className="news-col announcements-col" aria-label="Comunicados Oficiais do LABETA">
                        <div className="news-col-header">
                            <div className="header-icon-box announcement-icon">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h2 className="news-col-title">Comunicados do LABETA</h2>
                                <p className="news-col-desc">Avisos e comunicados operacionais para pesquisadores e alunos.</p>
                            </div>
                        </div>

                        <div className="cards-stack">
                            {loadingNews ? (
                                <div className="news-empty-state"><p>Carregando comunicados...</p></div>
                            ) : filteredAnnouncements.length === 0 ? (
                                <div className="news-empty-state">
                                    <p>Nenhum comunicado encontrado{searchQuery ? ` para "${searchQuery}"` : ''}.</p>
                                </div>
                            ) : (
                                filteredAnnouncements.map((item) => (
                                    <article key={item.id} className="news-card announcement-card">
                                        {/* Barra de Gestão Administrativa */}
                                        {isAdmin && (
                                            <CardAdminActions
                                                onEdit={() => openEdit(`Editar: ${item.title}`, 'announcement', item)}
                                                onDelete={() => openDelete('Confirmar Remoção', item)}
                                                editLabel="Editar comunicado"
                                                deleteLabel="Excluir comunicado"
                                            />
                                        )}

                                        <div className="news-card-meta">
                                            <Badge variant="gold" icon={Tag}>
                                                {item.tag}
                                            </Badge>
                                            <span className="news-date">
                                                <Calendar size={13} />
                                                {item.date}
                                            </span>
                                        </div>

                                        <h3 className="news-item-title">{item.title}</h3>
                                        <p className="news-item-content">{item.content}</p>

                                        <div className="news-card-footer">
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
                    <section className="news-col radar-col" aria-label="Radar Científico e Artigos">
                        <div className="news-col-header">
                            <div className="header-icon-box radar-icon">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h2 className="news-col-title">Radar Científico</h2>
                                <p className="news-col-desc">Destaques de artigos publicados em revistas internacionais.</p>
                            </div>
                        </div>

                        <div className="cards-stack">
                            {loadingNews ? (
                                <div className="news-empty-state"><p>Carregando artigos...</p></div>
                            ) : filteredRadar.length === 0 ? (
                                <div className="news-empty-state">
                                    <p>Nenhum artigo encontrado{searchQuery ? ` para "${searchQuery}"` : ''}.</p>
                                </div>
                            ) : (
                                filteredRadar.map((article) => (
                                    <article key={article.id} className="news-card radar-card">
                                        {/* Barra de Gestão Administrativa */}
                                        {isAdmin && (
                                            <CardAdminActions
                                                onEdit={() => openEdit(`Editar: ${article.title}`, 'radar', article)}
                                                onDelete={() => openDelete('Confirmar Remoção', article)}
                                                editLabel="Editar artigo do radar"
                                                deleteLabel="Excluir artigo"
                                            />
                                        )}

                                        <div className="news-card-meta">
                                            <Badge variant="emerald" icon={FileText}>
                                                {article.journal} ({article.year})
                                            </Badge>
                                            <span className="news-date">
                                                <Calendar size={13} />
                                                {article.date}
                                            </span>
                                        </div>

                                        <h3 className="news-item-title radar-title">{article.title}</h3>
                                        <p className="radar-authors"><strong>Autores:</strong> {article.authors}</p>
                                        <p className="news-item-content">{article.summary}</p>

                                        <div className="news-card-footer">
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
                        <div className="announcement-read-wrapper">
                            <div className="announcement-read-meta">
                                <Badge variant="gold" icon={Tag}>
                                    {readingAnnouncement.tag}
                                </Badge>
                                <span className="news-date">
                                    <Calendar size={13} />
                                    {readingAnnouncement.date}
                                </span>
                            </div>
                            <div className="announcement-read-body">
                                <p>{readingAnnouncement.content}</p>
                            </div>
                            <div className="admin-form-actions" style={{ marginTop: '1.75rem', justifyContent: 'flex-end' }}>
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
                        <DeleteConfirmDialog
                            itemName={modalConfig.data?.title || 'este registro'}
                            itemType="notícia / artigo"
                            onConfirm={handleConfirmDelete}
                            onCancel={closeModal}
                            isDeleting={isSubmitting}
                        />
                    ) : modalConfig.type.includes('announcement') ? (
                        <AnnouncementForm
                            initialData={modalConfig.data}
                            onSubmit={handleFormSubmit}
                            onCancel={closeModal}
                            isSubmitting={isSubmitting}
                        />
                    ) : (
                        <RadarForm
                            initialData={modalConfig.data}
                            onSubmit={handleFormSubmit}
                            onCancel={closeModal}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </AdminModal>

                {/* Notificação Toast de Feedback */}
                {toast && (
                    <ToastNotification
                        type={toast.type}
                        message={toast.message}
                        onClose={clearToast}
                    />
                )}

            </div>
        </main>
    );
}
