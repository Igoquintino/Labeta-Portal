/* ============================================================
 * [COMPONENTE] People
 * Descrição: Grade de pesquisadores com abas de filtro (Coordenação, Pesquisadores, Discentes).
 *            Possui integração reativa com Supabase e contingência automática via members.json.
 * Rota/Uso: Rota /pessoas.
 * Dados: Supabase ('members') com fallback em src/data/members.json via membersService.
 * CSS correlato: People.css
 * ============================================================ */
import { useState, useMemo, useEffect } from 'react';
import { Users, GraduationCap, FlaskConical, ExternalLink, Mail, Award, Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
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
    // [ESTADO] modalConfig — { isOpen, title, type, data } controla o AdminModal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });
    // [ESTADO] formSubmitting — envio de formulário em andamento
    const [formSubmitting, setFormSubmitting] = useState(false);
    // [ESTADO] toast — notificação de feedback temporário
    const [toast, setToast] = useState(null);

    /** [HOOK] useEffect — Carrega os membros na montagem */
    useEffect(() => {
        let isMounted = true;
        async function load() {
            setLoadingMembers(true);
            const { members: data } = await fetchMembers();
            if (isMounted) {
                setMembers(data);
                setLoadingMembers(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, []);

    /** [FUNÇÃO] openCreateModal — abre o AdminModal em modo "criar" (somente admin). */
    const openCreateModal = () => {
        setModalConfig({
            isOpen: true,
            title: 'Cadastrar Novo Integrante da Equipe',
            type: 'create',
            data: null
        });
    };

    /** [FUNÇÃO] openEditModal — abre o AdminModal em modo "editar" com os dados do item. */
    const openEditModal = (member) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${member.name}`,
            type: 'edit',
            data: member
        });
    };

    /** [FUNÇÃO] openDeleteModal — abre o AdminModal de confirmação de exclusão. */
    const openDeleteModal = (member) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Remoção de Integrante',
            type: 'delete',
            data: member
        });
    };

    /** [FUNÇÃO] closeModal — fecha o AdminModal e reseta modalConfig. */
    const closeModal = () => {
        if (formSubmitting) return;
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    /** [FUNÇÃO] handleConfirmDelete — remove o membro e atualiza o estado local */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setFormSubmitting(true);
        const item = modalConfig.data;
        const { error } = await deleteMember(item.id);

        if (error) {
            setToast({ type: 'error', message: `Erro ao remover membro: ${error.message}` });
        } else {
            setMembers((prev) => prev.filter((m) => m.id !== item.id));
            setToast({ type: 'success', message: 'Membro removido com sucesso!' });
            closeModal();
        }
        setFormSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — trata o envio do formulário (criação e edição) */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);

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
                setToast({ type: 'error', message: `Falha ao atualizar membro: ${error.message}` });
            } else {
                const updated = data || { id: currentId, ...payload };
                setMembers((prev) => prev.map((m) => (m.id === currentId ? updated : m)));
                setToast({ type: 'success', message: 'Membro atualizado com sucesso!' });
                closeModal();
            }
        } else {
            const { data, error } = await createMember(payload);
            if (error) {
                setToast({ type: 'error', message: `Falha ao cadastrar membro: ${error.message}` });
            } else {
                const created = data || { id: `local-${Date.now()}`, ...payload };
                setMembers((prev) => [...prev, created]);
                setToast({ type: 'success', message: 'Membro cadastrado com sucesso!' });
                closeModal();
            }
        }

        setFormSubmitting(false);
    };

    /** [HOOK] useMemo filteredMembers — membros da categoria ativa. */
    const filteredMembers = useMemo(() => {
        if (activeCategory === 'todos') return members;
        return members.filter((m) => m.category === activeCategory);
    }, [members, activeCategory]);

    // [ESTADO] contadores por categoria (coordenação, pesquisadores, discentes)
    const countCoord = useMemo(() => members.filter((m) => m.category === 'coordenacao').length, [members]);
    const countPesq = useMemo(() => members.filter((m) => m.category === 'pesquisadores').length, [members]);
    const countDisc = useMemo(() => members.filter((m) => m.category === 'discentes').length, [members]);

    return (
        /* [SEÇÃO 1] .people-page — <main> */
        <main className="people-page" id="main-content">
            {/* [SEÇÃO 1.1] .people-container — <div> */}
            <div className="people-container">

                {/* Cabeçalho */}
                {/* [SEÇÃO 1.1.1] .people-header — <header> */}
                <header className="people-header">
                    {/* [SEÇÃO 1.1.1.1] .people-badge — <div> */}
                    <div className="people-badge">
                        <Users size={16} />
                        <span>Recursos Humanos &amp; Pesquisa</span>
                    </div>
                    {/* [SEÇÃO 1.1.1.2] .people-title — <h1> */}
                    <h1 className="people-title">Equipe &amp; Pesquisadores</h1>
                    {/* [SEÇÃO 1.1.1.3] .people-subtitle — <p> */}
                    <p className="people-subtitle">
                        Conheça o corpo docente, pós-graduandos, pesquisadores e bolsistas que compõem o quadro científico do LABETA.
                    </p>

                    {/* Filtros por Categoria */}
                    {/* [SEÇÃO 1.1.1.4] .people-category-nav — <nav> */}
                    <nav className="people-category-nav" aria-label="Filtrar por papel acadêmico">
                        {/* [SEÇÃO 1.1.1.4.1] .people-filter-btn — <button> */}
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'todos' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('todos')}
                        >
                            <span>Todos</span>
                            <span className="count-pill">{members.length}</span>
                        </button>
                        {/* [SEÇÃO 1.1.1.4.2] .people-filter-btn — <button> */}
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'coordenacao' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('coordenacao')}
                        >
                            <Award size={14} />
                            <span>Coordenação</span>
                            <span className="count-pill">{countCoord}</span>
                        </button>
                        {/* [SEÇÃO 1.1.1.4.3] .people-filter-btn — <button> */}
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'pesquisadores' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('pesquisadores')}
                        >
                            <FlaskConical size={14} />
                            <span>Pesquisadores</span>
                            <span className="count-pill">{countPesq}</span>
                        </button>
                        {/* [SEÇÃO 1.1.1.4.4] .people-filter-btn — <button> */}
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'discentes' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('discentes')}
                        >
                            <GraduationCap size={14} />
                            <span>Discentes</span>
                            <span className="count-pill">{countDisc}</span>
                        </button>
                    </nav>
                </header>

                {/* Barra de Ações Administrativas */}
                {isAdmin && (
                    /* [SEÇÃO 1.1.1.5] .admin-toolbar — <div> */
                    <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        {/* [SEÇÃO 1.1.1.5.1] .admin-btn-primary — <button> */}
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={openCreateModal}
                        >
                            <Plus size={16} /> Novo Membro
                        </button>
                    </div>
                )}

                {/* Grade de Pessoas */}
                {/* [SEÇÃO 1.1.2] .people-grid — <div> */}
                <div className="people-grid">
                    {loadingMembers ? (
                        <div className="people-empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                            <p>Carregando equipe...</p>
                        </div>
                    ) : filteredMembers.map((member) => (
                        /* [SEÇÃO 1.1.2.1] .person-card — <article> */
                        <article key={member.id} className="person-card">
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
                                            title="Editar integrante"
                                            onClick={() => openEditModal(member)}
                                        >
                                            <Edit2 size={13} />
                                            <span>Editar</span>
                                        </button>
                                        {/* [SEÇÃO 1.1.2.1.1.2.2] .admin-action-btn .delete — <button> */}
                                        <button
                                            type="button"
                                            className="admin-action-btn delete"
                                            title="Excluir integrante"
                                            onClick={() => openDeleteModal(member)}
                                        >
                                            <Trash2 size={13} />
                                            <span>Excluir</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* [SEÇÃO 1.1.2.1.2] .person-avatar-wrapper — <div> */}
                            <div className="person-avatar-wrapper">
                                {member.avatar ? (
                                    /* [SEÇÃO 1.1.2.1.2.1] .person-avatar-img — <img> */
                                    <img
                                        src={member.avatar}
                                        alt={`Foto de ${member.name}`}
                                        className="person-avatar-img"
                                        loading="lazy"
                                        width="96"
                                        height="96"
                                    />
                                ) : (
                                    /* [SEÇÃO 1.1.2.1.2.2] .person-avatar-placeholder — <div> */
                                    <div className="person-avatar-placeholder" aria-hidden="true">
                                        {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                    </div>
                                )}
                            </div>

                            {/* [SEÇÃO 1.1.2.1.3] .person-info — <div> */}
                            <div className="person-info">
                                {/* [SEÇÃO 1.1.2.1.3.1] .person-category-tag — <span> */}
                                <span className={`person-category-tag tag-${member.category}`}>
                                    {member.category === 'coordenacao' && 'Coordenação'}
                                    {member.category === 'pesquisadores' && 'Pesquisador'}
                                    {member.category === 'discentes' && 'Discente'}
                                </span>
                                {/* [SEÇÃO 1.1.2.1.3.2] .person-name — <h2> */}
                                <h2 className="person-name">{member.name}</h2>
                                {/* [SEÇÃO 1.1.2.1.3.3] .person-role — <p> */}
                                <p className="person-role">{member.role}</p>

                                {member.researchArea && (
                                    /* [SEÇÃO 1.1.2.1.3.4] .person-research-area — <p> */
                                    <p className="person-research-area">
                                        <strong>Linha de Investigação:</strong> {member.researchArea}
                                    </p>
                                )}

                                {/* [SEÇÃO 1.1.2.1.3.5] .person-bio — <p> */}
                                <p className="person-bio">{member.bio}</p>
                            </div>

                            {/* [SEÇÃO 1.1.2.1.4] .person-card-footer — <footer> */}
                            <footer className="person-card-footer">
                                {member.email && (
                                    /* [SEÇÃO 1.1.2.1.4.1] .person-contact-link — <a> */
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
                                {member.lattes && (
                                    /* [SEÇÃO 1.1.2.1.4.2] .person-lattes-link — <a> */
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
                                )}
                            </footer>
                        </article>
                    ))}
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
                                Tem certeza de que deseja remover <strong className="admin-delete-highlight">"{modalConfig.data?.name}"</strong> da equipe? Esta ação não poderá ser desfeita.
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
                                    {formSubmitting ? 'Removendo...' : 'Confirmar Remoção'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            {/* [SEÇÃO 1.1.3.2.1] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.1.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Nome Completo</label>
                                {/* [SEÇÃO 1.1.3.2.1.2] .admin-form-input — <input> */}
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.name || ''}
                                    placeholder="Ex.: Dr. Nome do Pesquisador..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.2] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.2.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Papel / Categoria</label>
                                {/* [SEÇÃO 1.1.3.2.2.2] .admin-form-select — <select> */}
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

                            {/* [SEÇÃO 1.1.3.2.3] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.3.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Cargo / Função Exibida</label>
                                {/* [SEÇÃO 1.1.3.2.3.2] .admin-form-input — <input> */}
                                <input
                                    name="role"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.role || ''}
                                    placeholder="Ex.: Pós-Graduando (Mestrado)"
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.4] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.4.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Linha de Pesquisa</label>
                                {/* [SEÇÃO 1.1.3.2.4.2] .admin-form-input — <input> */}
                                <input
                                    name="researchArea"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.researchArea || ''}
                                    placeholder="Ex.: Diatomáceas de Água Doce..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.5] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.5.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">E-mail de Contato</label>
                                {/* [SEÇÃO 1.1.3.2.5.2] .admin-form-input — <input> */}
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.email || ''}
                                    placeholder="usuario@ufopa.edu.br"
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.6] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.6.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Link do Currículo Lattes</label>
                                {/* [SEÇÃO 1.1.3.2.6.2] .admin-form-input — <input> */}
                                <input
                                    name="lattes"
                                    type="url"
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.lattes || ''}
                                    placeholder="http://lattes.cnpq.br/..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.7] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.3.2.7.1] .admin-btn-cancel — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancelar
                                </button>
                                {/* [SEÇÃO 1.1.3.2.7.2] .admin-btn-submit — <button> */}
                                <button
                                    type="submit"
                                    className="admin-btn-submit"
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Salvando...' : 'Salvar Integrante'}
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
