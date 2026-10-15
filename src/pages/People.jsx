import { useState, useMemo } from 'react';
import { Users, GraduationCap, FlaskConical, ExternalLink, Mail, Award, Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import membersData from '../data/members.json';
import './People.css';

export function People() {
    const { isAdmin } = useAuth();
    const [activeCategory, setActiveCategory] = useState('todos');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });

    const openCreateModal = () => {
        setModalConfig({
            isOpen: true,
            title: 'Cadastrar Novo Integrante da Equipe',
            type: 'create',
            data: null
        });
    };

    const openEditModal = (member) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${member.name}`,
            type: 'edit',
            data: member
        });
    };

    const openDeleteModal = (member) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Remoção de Integrante',
            type: 'delete',
            data: member
        });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        closeModal();
    };

    const filteredMembers = useMemo(() => {
        if (activeCategory === 'todos') return membersData;
        return membersData.filter((m) => m.category === activeCategory);
    }, [activeCategory]);

    const countCoord = useMemo(() => membersData.filter((m) => m.category === 'coordenacao').length, []);
    const countPesq = useMemo(() => membersData.filter((m) => m.category === 'pesquisadores').length, []);
    const countDisc = useMemo(() => membersData.filter((m) => m.category === 'discentes').length, []);

    return (
        <main className="people-page" id="main-content">
            <div className="people-container">

                {/* Cabeçalho */}
                <header className="people-header">
                    <div className="people-badge">
                        <Users size={16} />
                        <span>Recursos Humanos &amp; Pesquisa</span>
                    </div>
                    <h1 className="people-title">Equipe &amp; Pesquisadores</h1>
                    <p className="people-subtitle">
                        Conheça o corpo docente, pós-graduandos, pesquisadores e bolsistas que compõem o quadro científico do LABETA.
                    </p>

                    {/* Filtros por Categoria */}
                    <nav className="people-category-nav" aria-label="Filtrar por papel acadêmico">
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'todos' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('todos')}
                        >
                            Todos ({membersData.length})
                        </button>
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'coordenacao' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('coordenacao')}
                        >
                            <Award size={15} />
                            Coordenação ({countCoord})
                        </button>
                        <button
                            type="button"
                            className={`people-filter-btn ${activeCategory === 'pesquisadores' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('pesquisadores')}
                        >
                            <FlaskConical size={15} />
                            Pesquisadores ({countPesq})
                        </button>
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
                    <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
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
                <section className="people-grid" aria-label="Lista de integrantes do laboratório">
                    {filteredMembers.map((member) => (
                        <article key={member.id} className="person-card">

                            {/* Barra de Ações Administrativas do Card */}
                            {isAdmin && (
                                <div className="card-admin-actions">
                                    <span className="card-admin-badge">
                                        <ShieldCheck size={12} aria-hidden="true" />
                                        <span>Gestão</span>
                                    </span>
                                    <div className="card-admin-btns-group">
                                        <button
                                            type="button"
                                            className="admin-action-btn edit"
                                            title={`Editar dados de ${member.name}`}
                                            onClick={() => openEditModal(member)}
                                        >
                                            <Edit2 size={13} />
                                            <span>Editar</span>
                                        </button>
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

                            <div className="person-card-header">
                                <figure className="person-avatar-frame">
                                    {member.avatar ? (
                                        <img
                                            src={member.avatar.startsWith('/') ? member.avatar : `/${member.avatar}`}
                                            alt={`Foto de ${member.name}`}
                                            className="person-avatar-img"
                                            width="60"
                                            height="60"
                                        />
                                    ) : (
                                        <div className="person-avatar-initial">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </figure>
                                <div>
                                    <span className="person-role-tag">{member.role}</span>
                                    <h2 className="person-name">{member.name}</h2>
                                </div>
                            </div>

                            <div className="person-card-body">
                                <div className="person-area-box">
                                    <span className="area-label">Linha de Pesquisa:</span>
                                    <p className="area-value">{member.researchArea}</p>
                                </div>

                                <p className="person-bio">{member.bio}</p>
                            </div>

                            <footer className="person-card-footer">
                                {member.lattes && member.lattes.startsWith('http') && !member.lattes.includes('0000000000000000') ? (
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
                                    <span
                                        className="person-lattes-link disabled"
                                        title="Currículo Lattes em atualização"
                                        aria-disabled="true"
                                        role="note"
                                    >
                                        <span>Lattes em atualização</span>
                                    </span>
                                )}

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
                        <div className="admin-delete-box">
                            <p className="admin-delete-notice">
                                Tem certeza de que deseja remover <strong className="admin-delete-highlight">"{modalConfig.data?.name}"</strong> da listagem do laboratório?
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
                                <label className="admin-form-label">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.name || ''}
                                    placeholder="Ex.: Dr. Nome do Pesquisador..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Papel / Categoria</label>
                                <select className="admin-form-select" defaultValue={modalConfig.data?.category || 'discentes'}>
                                    <option value="coordenacao">Coordenação</option>
                                    <option value="pesquisadores">Pesquisador Associado</option>
                                    <option value="discentes">Discente / Bolsista</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Cargo / Função Exibida</label>
                                <input
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
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.researchArea || ''}
                                    placeholder="Ex.: Diatomáceas de Água Doce..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">E-mail de Contato</label>
                                <input
                                    type="email"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.email || ''}
                                    placeholder="usuario@ufopa.edu.br"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Link do Currículo Lattes</label>
                                <input
                                    type="url"
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.lattes || ''}
                                    placeholder="http://lattes.cnpq.br/..."
                                />
                            </div>

                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="admin-btn-submit">Salvar Integrante</button>
                            </div>
                        </form>
                    )}
                </AdminModal>

            </div>
        </main>
    );
}
