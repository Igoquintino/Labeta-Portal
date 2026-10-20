/* ============================================================
 * [COMPONENTE] People
 * Descrição: Grade de pesquisadores com abas de filtro (Coordenação, Pesquisadores, Discentes).
 *            Possui integração reativa com Supabase e contingência automática via members.json.
 * Rota/Uso: Rota /pessoas.
 * Dados: Supabase ('members') com fallback em src/data/members.json via membersService.
 * CSS correlato: People.css
 * ============================================================ */
import { useState, useMemo, useEffect } from 'react';
import { Users, GraduationCap, FlaskConical, ExternalLink, Mail, Award, Plus } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useModalState } from '../hooks/useModalState';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { PageHeader } from '../components/common/PageHeader';
import { Badge } from '../components/common/Badge';
import { FilterTabs } from '../components/common/FilterTabs';
import { CardAdminActions } from '../components/common/CardAdminActions';
import { DeleteConfirmDialog } from '../components/common/DeleteConfirmDialog';
import { fetchMembers, createMember, updateMember, deleteMember } from '../services/membersService';
import './People.css';

/** [FUNÇÃO] People — renderiza abas e cards dos membros. */
export function People() {
    const { isAdmin } = useAuth();
    // [ESTADO] members — lista reativa de pesquisadores/membros
    const [members, setMembers] = useState([]);
    // [ESTADO] loadingMembers — carregamento inicial
    const [loadingMembers, setLoadingMembers] = useState(true);
    // [ESTADO] activeCategory — aba ativa ('todos' | 'coordenacao' | 'pesquisadores' | 'discentes')
    const [activeCategory, setActiveCategory] = useState('todos');

    // [HOOK] useModalState — controle de diálogos de edição/criação/exclusão e toasts
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

    /** [HOOK] useEffect — Carrega os membros na montagem */
    useEffect(() => {
        let isMounted = true;
        async function load() {
            setLoadingWorks(true);
            const { members: data } = await fetchMembers();
            if (isMounted) {
                setMembers(data);
                setLoadingWorks(false);
            }
        }
        function setLoadingWorks(val) {
            setLoadingMembers(val);
        }
        load();
        return () => { isMounted = false; };
    }, []);

    /** [FUNÇÃO] handleConfirmDelete — remove o membro e atualiza o estado local */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setIsSubmitting(true);
        const item = modalConfig.data;
        const { error } = await deleteMember(item.id);

        if (error) {
            showToast(`Erro ao remover membro: ${error.message}`, 'error');
        } else {
            setMembers((prev) => prev.filter((m) => m.id !== item.id));
            showToast('Membro removido com sucesso!', 'success');
            closeModal();
        }
        setIsSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — trata o envio do formulário (criação e edição) */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const isEdit = modalConfig.type === 'edit';
        const payload = {
            name: formData.get('name'),
            category: formData.get('category'),
            role: formData.get('role'),
            researchArea: formData.get('researchArea'),
            email: formData.get('email'),
            lattes: formData.get('lattes'),
            avatar: modalConfig.data?.avatar || ''
        };

        if (isEdit) {
            const currentId = modalConfig.data.id;
            const { data, error } = await updateMember(currentId, payload);
            if (error) {
                showToast(`Falha ao atualizar membro: ${error.message}`, 'error');
            } else {
                const updated = data || { id: currentId, ...payload };
                setMembers((prev) => prev.map((m) => (m.id === currentId ? updated : m)));
                showToast('Membro atualizado com sucesso!', 'success');
                closeModal();
            }
        } else {
            const { data, error } = await createMember(payload);
            if (error) {
                showToast(`Falha ao cadastrar membro: ${error.message}`, 'error');
            } else {
                const created = data || { id: `local-${Date.now()}`, ...payload };
                setMembers((prev) => [...prev, created]);
                showToast('Membro cadastrado com sucesso!', 'success');
                closeModal();
            }
        }

        setIsSubmitting(false);
    };

    /** [HOOK] useMemo filteredMembers — membros da categoria ativa. */
    const filteredMembers = useMemo(() => {
        if (activeCategory === 'todos') return members;
        return members.filter((m) => m.category === activeCategory);
    }, [members, activeCategory]);

    // Contadores por categoria
    const countCoord = useMemo(() => members.filter((m) => m.category === 'coordenacao').length, [members]);
    const countPesq = useMemo(() => members.filter((m) => m.category === 'pesquisadores').length, [members]);
    const countDisc = useMemo(() => members.filter((m) => m.category === 'discentes').length, [members]);

    const tabsConfig = useMemo(() => [
        { id: 'todos', label: 'Todos os Membros', count: members.length },
        { id: 'coordenacao', label: 'Coordenação', count: countCoord, icon: Award },
        { id: 'pesquisadores', label: 'Pesquisadores', count: countPesq, icon: FlaskConical },
        { id: 'discentes', label: 'Discentes & Bolsistas', count: countDisc, icon: GraduationCap }
    ], [members.length, countCoord, countPesq, countDisc]);

    const getCategoryVariant = (cat) => {
        switch (cat) {
            case 'coordenacao': return 'gold';
            case 'pesquisadores': return 'green';
            case 'discentes': return 'blue';
            default: return 'subtle';
        }
    };

    const getCategoryLabel = (cat) => {
        switch (cat) {
            case 'coordenacao': return 'Coordenação';
            case 'pesquisadores': return 'Pesquisador';
            case 'discentes': return 'Discente';
            default: return cat;
        }
    };

    return (
        <main className="people-page" id="main-content">
            <div className="people-container">

                {/* Cabeçalho Unificado com Abas de Categoria */}
                <PageHeader
                    badgeIcon={Users}
                    badgeText="Recursos Humanos & Pesquisa"
                    title="Equipe & Pesquisadores"
                    subtitle="Conheça o corpo docente, pós-graduandos, pesquisadores e bolsistas que compõem o quadro científico do LABETA."
                >
                    <FilterTabs
                        tabs={tabsConfig}
                        activeTab={activeCategory}
                        onChange={setActiveCategory}
                        ariaLabel="Filtrar por papel acadêmico"
                        className="people-tabs-slot"
                    />
                </PageHeader>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    <div className="admin-toolbar">
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreate('Cadastrar Novo Integrante da Equipe', 'create')}
                        >
                            <Plus size={16} aria-hidden="true" />
                            <span>Cadastrar Novo Integrante</span>
                        </button>
                    </div>
                )}

                {/* Grade de Cards dos Membros */}
                <div className="people-grid">
                    {loadingMembers ? (
                        <div className="people-loading-state">
                            <p>Carregando quadro de pesquisadores...</p>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="people-empty-state">
                            <Users size={48} className="empty-icon" aria-hidden="true" />
                            <h3>Nenhum integrante encontrado</h3>
                            <p>Não há membros cadastrados nesta categoria no momento.</p>
                        </div>
                    ) : (
                        filteredMembers.map((member) => (
                            <article key={member.id} className="person-card">
                                {/* Barra de Ações Administrativas do Card */}
                                {isAdmin && (
                                    <CardAdminActions
                                        label="Gestão"
                                        onEdit={() => openEdit(`Editar: ${member.name}`, 'edit', member)}
                                        onDelete={() => openDelete('Confirmar Remoção de Integrante', member)}
                                        editTitle="Editar integrante"
                                        deleteTitle="Excluir integrante"
                                    />
                                )}

                                {/* Foto / Avatar com suporte progressivo a WebP */}
                                <div className="person-avatar-frame">
                                    {member.avatar ? (
                                        <picture>
                                            {member.avatar.match(/\.(jpg|jpeg|png)$/i) && (
                                                <source
                                                    srcSet={member.avatar.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                                                    type="image/webp"
                                                />
                                            )}
                                            <img
                                                src={member.avatar}
                                                alt={`Foto de ${member.name}`}
                                                className="person-avatar-img"
                                                loading="lazy"
                                                width="60"
                                                height="60"
                                            />
                                        </picture>
                                    ) : (
                                        <div className="person-avatar-placeholder" aria-hidden="true">
                                            {member.name ? member.name.charAt(0) : 'U'}
                                        </div>
                                    )}
                                </div>

                                <div className="person-info">
                                    <Badge variant={getCategoryVariant(member.category)}>
                                        {getCategoryLabel(member.category)}
                                    </Badge>

                                    <h2 className="person-name">{member.name}</h2>
                                    <p className="person-role">{member.role}</p>

                                    {member.researchArea && (
                                        <p className="person-research-area">
                                            <strong>Linha de Investigação:</strong> {member.researchArea}
                                        </p>
                                    )}

                                    <p className="person-bio">{member.bio}</p>
                                </div>

                                <footer className="person-card-footer">
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="person-contact-link"
                                            title={`Enviar e-mail para ${member.name}`}
                                            aria-label={`E-mail de contato de ${member.name}`}
                                        >
                                            <Mail size={15} />
                                            <span>E-mail</span>
                                        </a>
                                    )}
                                    {member.lattes ? (
                                        <a
                                            href={member.lattes}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="person-lattes-link"
                                            title="Currículo Lattes (abre em nova aba)"
                                            aria-label={`Currículo Lattes de ${member.name} (abre em nova aba)`}
                                        >
                                            <ExternalLink size={14} />
                                            <span>Lattes</span>
                                        </a>
                                    ) : (
                                        <span className="person-lattes-placeholder" title="Currículo em atualização">
                                            Lattes em atualização
                                        </span>
                                    )}
                                </footer>
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
                            title={modalConfig.data?.name}
                            message={`Tem certeza de que deseja remover "${modalConfig.data?.name}" da equipe? Esta ação não poderá ser desfeita.`}
                            onConfirm={handleConfirmDelete}
                            onCancel={closeModal}
                            isSubmitting={isSubmitting}
                            confirmLabel="Confirmar Remoção"
                        />
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Nome Completo</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.name || ''}
                                    placeholder="Ex.: Dr. Nome do Pesquisador..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Papel / Categoria</label>
                                <select
                                    name="category"
                                    className="admin-form-select"
                                    defaultValue={modalConfig.data?.category || 'discentes'}
                                >
                                    <option value="coordenacao">Coordenação</option>
                                    <option value="pesquisadores">Pesquisador Associado</option>
                                    <option value="discentes">Discente / Bolsista</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Cargo / Função Exibida</label>
                                <input
                                    name="role"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.role || ''}
                                    placeholder="Ex.: Pós-Graduando (Mestrado)"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Linha de Pesquisa</label>
                                <input
                                    name="researchArea"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.researchArea || ''}
                                    placeholder="Ex.: Taxonomia de Diatomáceas"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">E-mail Institucional</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.email || ''}
                                    placeholder="usuario@ufopa.edu.br"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Link Currículo Lattes</label>
                                <input
                                    name="lattes"
                                    type="url"
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.lattes || ''}
                                    placeholder="http://lattes.cnpq.br/..."
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
                                    {isSubmitting ? 'Salvando...' : 'Salvar Integrante'}
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
