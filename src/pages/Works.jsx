/* ============================================================
 * [COMPONENTE] Works
 * Descrição: Produção científica separada em "Em Andamento" e "Concluídos", com busca e links de DOI.
 *            Possui integração reativa com Supabase e contingência automática via works.json.
 * Rota/Uso: Rota /trabalhos.
 * Dados: Supabase ('works') com fallback em src/data/works.json via worksService.
 * CSS correlato: Works.css
 * ============================================================ */
import { useState, useMemo, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle2, ExternalLink, Tag, Plus } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useModalState } from '../hooks/useModalState';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { SearchInput } from '../components/common/SearchInput';
import { FilterTabs } from '../components/common/FilterTabs';
import { CardAdminActions } from '../components/common/CardAdminActions';
import { DeleteConfirmDialog } from '../components/common/DeleteConfirmDialog';
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

    // [HOOK] useModalState — controle unificado do AdminModal e toasts
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

    /** [FUNÇÃO] handleConfirmDelete — remove o trabalho e atualiza o estado */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setIsSubmitting(true);
        const item = modalConfig.data;
        const { error } = await deleteWork(item.id);

        if (error) {
            showToast(`Erro ao remover trabalho: ${error.message}`, 'error');
        } else {
            setWorks((prev) => prev.filter((w) => w.id !== item.id));
            showToast('Trabalho removido com sucesso!', 'success');
            closeModal();
        }
        setIsSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — trata a submissão de cadastro e alteração */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

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
                showToast(`Falha ao atualizar trabalho: ${error.message}`, 'error');
            } else {
                const updated = data || { id: currentId, ...payload };
                setWorks((prev) => prev.map((w) => (w.id === currentId ? updated : w)));
                showToast('Trabalho atualizado com sucesso!', 'success');
                closeModal();
            }
        } else {
            const { data, error } = await createWork(payload);
            if (error) {
                showToast(`Falha ao cadastrar trabalho: ${error.message}`, 'error');
            } else {
                const created = data || { id: `local-${Date.now()}`, ...payload };
                setWorks((prev) => [created, ...prev]);
                showToast('Trabalho cadastrado com sucesso!', 'success');
                closeModal();
            }
        }

        setIsSubmitting(false);
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

    const tabsConfig = useMemo(() => [
        { id: 'todos', label: 'Todos os Trabalhos', count: works.length },
        { id: 'em_andamento', label: 'Em Andamento', count: countAndamento, icon: Clock },
        { id: 'concluidos', label: 'Concluídos', count: countConcluidos, icon: CheckCircle2 }
    ], [works.length, countAndamento, countConcluidos]);

    return (
        <main className="works-page" id="main-content">
            <div className="works-container">

                {/* Cabeçalho Unificado com Busca e Abas */}
                <PageHeader
                    badgeIcon={BookOpen}
                    badgeText="Produção Científica & Extensão"
                    title="Trabalhos do Laboratório"
                    subtitle="Catálogo de projetos de pesquisa, dissertações, artigos científicos e inventários taxonômicos desenvolvidos por discentes e pesquisadores do LABETA."
                >
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Buscar por título, autor, metodologia ou palavra-chave..."
                        ariaLabel="Filtrar trabalhos científicos"
                        className="works-search-slot"
                    />

                    <FilterTabs
                        tabs={tabsConfig}
                        activeTab={filter}
                        onChange={setFilter}
                        ariaLabel="Filtrar trabalhos por status"
                        className="works-tabs-slot"
                    />
                </PageHeader>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    <div className="admin-toolbar">
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreate('Cadastrar Novo Trabalho / Projeto', 'create')}
                        >
                            <Plus size={16} aria-hidden="true" />
                            <span>Cadastrar Novo Trabalho</span>
                        </button>
                    </div>
                )}

                {/* Grid de Cards de Trabalhos */}
                <div className="works-grid">
                    {loadingWorks ? (
                        <div className="works-loading-state">
                            <p>Carregando produção científica...</p>
                        </div>
                    ) : filteredWorks.length === 0 ? (
                        <div className="works-empty-state">
                            <BookOpen size={48} className="empty-icon" aria-hidden="true" />
                            <h3>Nenhum trabalho encontrado</h3>
                            <p>Tente alterar os termos de busca ou selecionar outra aba de status.</p>
                        </div>
                    ) : (
                        filteredWorks.map((work) => (
                            <article key={work.id} className="work-card">
                                {/* Barra de Ações Administrativas do Card */}
                                {isAdmin && (
                                    <CardAdminActions
                                        label="Gestão"
                                        onEdit={() => openEdit(`Editar: ${work.title}`, 'edit', work)}
                                        onDelete={() => openDelete('Confirmar Remoção de Trabalho', work)}
                                        editTitle="Editar trabalho"
                                        deleteTitle="Excluir trabalho"
                                    />
                                )}

                                <header className="work-card-header">
                                    <Badge
                                        variant={work.status === 'em_andamento' ? 'gold' : 'green'}
                                        icon={work.status === 'em_andamento' ? Clock : CheckCircle2}
                                    >
                                        {work.status === 'em_andamento' ? 'Em Andamento' : 'Concluído'}
                                    </Badge>
                                    <span className="work-year">{work.year}</span>
                                </header>

                                <h2 className="work-title">{work.title}</h2>
                                <p className="work-authors"><strong>Autores:</strong> {work.authors}</p>
                                <p className="work-summary">{work.summary}</p>

                                <div className="work-tags" aria-label="Palavras-chave do trabalho">
                                    {Array.isArray(work.tags) && work.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="subtle" icon={Tag}>
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                {(work.doi || work.externalUrl) && (
                                    <footer className="work-card-footer">
                                        {work.doi && (
                                            <a
                                                href={`https://doi.org/${work.doi.replace(/^https?:\/\/doi\.org\//, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="work-link doi-link"
                                                title="Acessar publicação via identificador DOI"
                                                aria-label={`Acessar publicação de ${work.title} via DOI (abre em nova aba)`}
                                            >
                                                <span>DOI: {work.doi}</span>
                                                <ExternalLink size={13} />
                                            </a>
                                        )}
                                        {work.externalUrl && !work.doi && (
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
                        <DeleteConfirmDialog
                            title={modalConfig.data?.title}
                            message={`Tem certeza de que deseja remover "${modalConfig.data?.title}"? Esta pesquisa será excluída do catálogo público.`}
                            onConfirm={handleConfirmDelete}
                            onCancel={closeModal}
                            isSubmitting={isSubmitting}
                            confirmLabel="Confirmar Exclusão"
                        />
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Título da Pesquisa / Trabalho</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.title || ''}
                                    placeholder="Nome completo do projeto ou artigo..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Status do Trabalho</label>
                                <select
                                    name="status"
                                    className="admin-form-select"
                                    defaultValue={modalConfig.data?.status || 'em_andamento'}
                                >
                                    <option value="em_andamento">Em Andamento</option>
                                    <option value="concluido">Concluído</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Autores</label>
                                <input
                                    name="authors"
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
                                    name="summary"
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
                                    name="externalUrl"
                                    type="url"
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.externalUrl || (modalConfig.data?.doi ? `https://doi.org/${modalConfig.data.doi}` : '')}
                                    placeholder="https://doi.org/..."
                                />
                            </div>

                            <div className="admin-form-actions">
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Salvando...' : 'Salvar Trabalho'}
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
                        onClose={clearToast}
                    />
                )}

            </div>
        </main>
    );
}
