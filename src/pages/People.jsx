/* ============================================================
 * [COMPONENTE] People
 * Descrição: Grade de pesquisadores com abas de filtro (Coordenação, Pesquisadores, Discentes).
 * Rota/Uso: Rota /pessoas.
 * Dados: src/data/members.json
 * CSS correlato: People.css
 * ============================================================ */
import { useState, useMemo } from 'react';
import { Users, GraduationCap, FlaskConical, ExternalLink, Mail, Award, Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import membersData from '../data/members.json';
import './People.css';

/** [FUNÇÃO] People — renderiza abas e cards dos membros. */
export function People() {
    const { isAdmin } = useAuth();
    // [ESTADO] activeCategory — aba ativa ('todos' | 'coordenacao' | 'pesquisadores' | 'discentes')
    const [activeCategory, setActiveCategory] = useState('todos');
    // [ESTADO] modalConfig — { isOpen, title, type, data } controla o AdminModal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });

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
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    /** [FUNÇÃO] handleFormSubmit — trata o envio do formulário do modal (por ora apenas simula e fecha). */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        closeModal();
    };

    /** [HOOK] useMemo filteredMembers — membros da categoria ativa. */
    const filteredMembers = useMemo(() => {
        if (activeCategory === 'todos') return membersData;
        return membersData.filter((m) => m.category === activeCategory);
    }, [activeCategory]);

    // [ESTADO] contadores por categoria (coordenação, pesquisadores, discentes)
    const countCoord = useMemo(() => membersData.filter((m) => m.category === 'coordenacao').length, []);
    const countPesq = useMemo(() => membersData.filter((m) => m.category === 'pesquisadores').length, []);
    const countDisc = useMemo(() => membersData.filter((m) => m.category === 'discentes').length, []);

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
                            Todos ({membersData.length})
                        </button>
                        {/* [SEÇÃO 1.1.1.4.2] .people-filter-btn — <button> */}
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'coordenacao' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('coordenacao')}
                        >
                            <Award size={15} />
                            Coordenação ({countCoord})
                        </button>
                        {/* [SEÇÃO 1.1.1.4.3] .people-filter-btn — <button> */}
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'pesquisadores' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('pesquisadores')}
                        >
                            <FlaskConical size={15} />
                            Pesquisadores ({countPesq})
                        </button>
                        {/* [SEÇÃO 1.1.1.4.4] .people-filter-btn — <button> */}
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'discentes' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('discentes')}
                        >
                            <GraduationCap size={15} />
                            Discentes &amp; Bolsistas ({countDisc})
                        </button>
                    </nav>
                </header>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
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

                {/* Grid de Membros */}
                {/* [SEÇÃO 1.1.2] .people-grid — <section> */}
                <section className="people-grid" aria-label="Lista de integrantes do laboratório">
                    {filteredMembers.map((member) => (
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
                                            title={`Editar dados de ${member.name}`}
                                            onClick={() => openEditModal(member)}
                                        >
                                            <Edit2 size={13} />
                                            <span>Editar</span>
                                        </button>
                                        {/* [SEÇÃO 1.1.2.1.1.2.2] .admin-action-btn .delete — <button> */}
                                        <button
                                            type="button"
                                            className="admin-action-btn delete"
                                            title={`Remover ${member.name}`}
                                            onClick={() => openDeleteModal(member)}
                                        >
                                            <Trash2 size={13} />
                                            <span>Excluir</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* [SEÇÃO 1.1.2.1.2] .person-card-header — <div> */}
                            <div className="person-card-header">
                                {/* [SEÇÃO 1.1.2.1.2.1] .person-avatar-frame — <figure> */}
                                <figure className="person-avatar-frame">
                                    {member.avatar ? (
                                        /* [SEÇÃO 1.1.2.1.2.1.1] .person-avatar-img — <img> */
                                        <img
                                            src={member.avatar.startsWith('/') ? member.avatar : `/${member.avatar}`}
                                            alt={`Foto de ${member.name}`}
                                            className="person-avatar-img"
                                            width="60"
                                            height="60"
                                        />
                                    ) : (
                                        /* [SEÇÃO 1.1.2.1.2.1.2] .person-avatar-initial — <div> */
                                        <div className="person-avatar-initial">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </figure>
                                <div>
                                    {/* [SEÇÃO 1.1.2.1.2.2.1] .person-role-tag — <span> */}
                                    <span className="person-role-tag">{member.role}</span>
                                    {/* [SEÇÃO 1.1.2.1.2.2.2] .person-name — <h2> */}
                                    <h2 className="person-name">{member.name}</h2>
                                </div>
                            </div>

                            {/* [SEÇÃO 1.1.2.1.3] .person-card-body — <div> */}
                            <div className="person-card-body">
                                {/* [SEÇÃO 1.1.2.1.3.1] .person-area-box — <div> */}
                                <div className="person-area-box">
                                    {/* [SEÇÃO 1.1.2.1.3.1.1] .area-label — <span> */}
                                    <span className="area-label">Linha de Pesquisa:</span>
                                    {/* [SEÇÃO 1.1.2.1.3.1.2] .area-value — <p> */}
                                    <p className="area-value">{member.researchArea}</p>
                                </div>

                                {/* [SEÇÃO 1.1.2.1.3.2] .person-bio — <p> */}
                                <p className="person-bio">{member.bio}</p>
                            </div>

                            {/* [SEÇÃO 1.1.2.1.4] .person-card-footer — <footer> */}
                            <footer className="person-card-footer">
                                {member.lattes && member.lattes.startsWith('http') && !member.lattes.includes('0000000000000000') ? (
                                    /* [SEÇÃO 1.1.2.1.4.1] .person-lattes-link — <a> */
                                    <a
                                        href={member.lattes}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="person-lattes-link"
                                        title={`Currículo Lattes de ${member.name} (abre em nova aba)`}
                                        aria-label={`Currículo Lattes de ${member.name} (abre em nova aba)`}
                                    >
                                        <span>Currículo Lattes</span>
                                        <ExternalLink size={13} aria-hidden="true" />
                                    </a>
                                ) : (
                                    /* [SEÇÃO 1.1.2.1.4.2] .person-lattes-link .disabled — <span> */
                                    <span
                                        className="person-lattes-link disabled"
                                        title="Currículo Lattes em atualização"
                                        aria-disabled="true"
                                        role="note"
                                    >
                                        <span>Lattes em atualização</span>
                                    </span>
                                )}

                                {/* [SEÇÃO 1.1.2.1.4.3] .person-email-link — <a> */}
                                <a
                                    href={`mailto:${member.email}`}
                                    className="person-email-link"
                                    title={`Enviar e-mail para ${member.email}`}
                                    aria-label={`Enviar e-mail para ${member.email}`}
                                >
                                    <Mail size={16} aria-hidden="true" />
                                </a>
                            </footer>

                        </article>
                    ))}
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
                                Tem certeza de que deseja remover <strong className="admin-delete-highlight">"{modalConfig.data?.name}"</strong> da listagem do laboratório?
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
                                <label className="admin-form-label">Nome Completo</label>
                                {/* [SEÇÃO 1.1.3.2.1.2] .admin-form-input — <input> */}
                                <input
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
                                <select className="admin-form-select" defaultValue={modalConfig.data?.category || 'discentes'}>
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
                                    type="url"
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.lattes || ''}
                                    placeholder="http://lattes.cnpq.br/..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.7] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.3.2.7.1] .admin-btn-cancel — <button> */}
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                {/* [SEÇÃO 1.1.3.2.7.2] .admin-btn-submit — <button> */}
                                <button type="submit" className="admin-btn-submit">Salvar Integrante</button>
                            </div>
                        </form>
                    )}
                </AdminModal>

            </div>
        </main>
    );
}
