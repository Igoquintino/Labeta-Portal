import { useState } from 'react';
import { Newspaper, Bell, FileText, ExternalLink, Calendar, Tag, Sparkles, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import newsData from '../data/news.json';
import './News.css';

export function News() {
    const { isAdmin } = useAuth();
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });

    const openCreateModal = (type) => {
        setModalConfig({
            isOpen: true,
            title: type === 'announcement' ? 'Novo Comunicado Institucional' : 'Novo Artigo no Radar Científico',
            type,
            data: null
        });
    };

    const openEditModal = (type, item) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${item.title}`,
            type: `edit_${type}`,
            data: item
        });
    };

    const openDeleteModal = (item) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Remoção',
            type: 'delete',
            data: item
        });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Em fase de pré-produção, simula sucesso e fecha o modal
        closeModal();
    };

    return (
        <main className="news-page" id="main-content">
            <div className="news-container">

                {/* Cabeçalho da Página */}
                <header className="news-header">
                    <div className="news-badge">
                        <Newspaper size={16} />
                        <span>Divulgação &amp; Informação</span>
                    </div>
                    <h1 className="news-title">Notícias &amp; Radar Científico</h1>
                    <p className="news-subtitle">
                        Acompanhe comunicados operacionais do laboratório e os principais artigos científicos publicados sobre algas e ecossistemas aquáticos amazônicos.
                    </p>
                </header>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    <div className="admin-toolbar" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreateModal('announcement')}
                        >
                            <Plus size={16} /> Novo Comunicado
                        </button>
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
                            {newsData.announcements.map((item) => (
                                <article key={item.id} className="news-card announcement-card" style={{ position: 'relative' }}>
                                    {/* Botões de Ação do Card (Admin) */}
                                    {isAdmin && (
                                        <div className="card-admin-actions">
                                            <button
                                                type="button"
                                                className="admin-action-btn edit"
                                                title="Editar comunicado"
                                                onClick={() => openEditModal('announcement', item)}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-action-btn delete"
                                                title="Excluir comunicado"
                                                onClick={() => openDeleteModal(item)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="news-card-meta">
                                        <span className="news-tag announcement-tag">
                                            <Tag size={12} />
                                            {item.tag}
                                        </span>
                                        <span className="news-date">
                                            <Calendar size={13} />
                                            {item.date}
                                        </span>
                                    </div>

                                    <h3 className="news-item-title">{item.title}</h3>
                                    <p className="news-item-content">{item.content}</p>
                                </article>
                            ))}
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
                            {newsData.scientificRadar.map((article) => (
                                <article key={article.id} className="news-card radar-card" style={{ position: 'relative' }}>
                                    {/* Botões de Ação do Card (Admin) */}
                                    {isAdmin && (
                                        <div className="card-admin-actions">
                                            <button
                                                type="button"
                                                className="admin-action-btn edit"
                                                title="Editar artigo do radar"
                                                onClick={() => openEditModal('radar', article)}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-action-btn delete"
                                                title="Excluir artigo"
                                                onClick={() => openDeleteModal(article)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="news-card-meta">
                                        <span className="news-tag radar-tag">
                                            <FileText size={12} />
                                            {article.journal} ({article.year})
                                        </span>
                                        <span className="news-date">
                                            <Calendar size={13} />
                                            {article.date}
                                        </span>
                                    </div>

                                    <h3 className="news-item-title radar-title">{article.title}</h3>
                                    <p className="radar-authors"><strong>Autores:</strong> {article.authors}</p>
                                    <p className="news-item-content">{article.summary}</p>

                                    <div className="news-card-footer">
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="doi-badge-link"
                                            title="Acessar publicação no periódico (abre em nova aba)"
                                            aria-label={`Acessar artigo ${article.title} com DOI ${article.doi} (abre em nova aba)`}
                                        >
                                            <span>Acessar Artigo (DOI: {article.doi})</span>
                                            <ExternalLink size={13} />
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Modal Administrativo Unificado */}
                <AdminModal
                    isOpen={modalConfig.isOpen}
                    onClose={closeModal}
                    title={modalConfig.title}
                >
                    {modalConfig.type === 'delete' ? (
                        <div className="admin-delete-box">
                            <p className="admin-delete-notice">
                                Tem certeza de que deseja remover <strong className="admin-delete-highlight">"{modalConfig.data?.title}"</strong>? Esta ação não poderá ser desfeita.
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
                                <label className="admin-form-label">Título</label>
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.title || ''}
                                    placeholder="Informe o título principal..."
                                />
                            </div>

                            {modalConfig.type.includes('announcement') ? (
                                <>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Categoria / Tag</label>
                                        <input
                                            type="text"
                                            required
                                            className="admin-form-input"
                                            defaultValue={modalConfig.data?.tag || 'Aviso Operacional'}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Conteúdo do Comunicado</label>
                                        <textarea
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
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Periódico / Revista</label>
                                        <input
                                            type="text"
                                            required
                                            className="admin-form-input"
                                            defaultValue={modalConfig.data?.journal || ''}
                                            placeholder="Ex.: Phytotaxa, Hydrobiologia..."
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Autores</label>
                                        <input
                                            type="text"
                                            required
                                            className="admin-form-input"
                                            defaultValue={modalConfig.data?.authors || ''}
                                            placeholder="Sobrenome, N. et al."
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Resumo Técnico</label>
                                        <textarea
                                            rows="3"
                                            required
                                            className="admin-form-textarea"
                                            defaultValue={modalConfig.data?.summary || ''}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Link DOI / URL</label>
                                        <input
                                            type="url"
                                            required
                                            className="admin-form-input"
                                            defaultValue={modalConfig.data?.url || ''}
                                            placeholder="https://doi.org/..."
                                        />
                                    </div>
                                </>
                            )}

                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="admin-btn-submit">Salvar Registro</button>
                            </div>
                        </form>
                    )}
                </AdminModal>

            </div>
        </main>
    );
}
