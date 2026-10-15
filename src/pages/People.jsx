import { useState, useMemo } from 'react';
import { Users, GraduationCap, FlaskConical, ExternalLink, Mail, Award, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import membersData from '../data/members.json';
import './People.css';

export function People() {
    const { isAdmin } = useAuth();
    const [activeCategory, setActiveCategory] = useState('todos');

    const filteredMembers = useMemo(() => {
        if (activeCategory === 'todos') return membersData;
        return membersData.filter((member) => member.category === activeCategory);
    }, [activeCategory]);

    const countCoord = membersData.filter(m => m.category === 'coordenacao').length;
    const countPesq = membersData.filter(m => m.category === 'pesquisadores').length;
    const countDisc = membersData.filter(m => m.category === 'discentes').length;

    const getCategoryLabel = (cat) => {
        switch (cat) {
            case 'coordenacao': return 'Coordenação';
            case 'pesquisadores': return 'Pesquisadores';
            case 'discentes': return 'Discentes & Bolsistas';
            default: return 'Integrante';
        }
    };

    return (
        <main className="people-page" id="main-content">
            <div className="people-container">

                {/* Cabeçalho da Página */}
                <header className="people-header">
                    <div className="people-badge">
                        <Users size={16} />
                        <span>Corpo Científico</span>
                    </div>
                    <h1 className="people-title">Equipe e Pesquisadores</h1>
                    <p className="people-subtitle">
                        Conheça os docentes, pós-graduandos e discentes responsáveis pelo avanço dos estudos ecológicos e taxonômicos de algas no LABETA / UFOPA.
                    </p>

                    {/* Filtro por Categoria */}
                    <nav className="people-filter-nav" aria-label="Filtrar integrantes por função">
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
                            Discentes & Bolsistas ({countDisc})
                        </button>
                    </nav>
                </header>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button 
                            type="button" 
                            className="admin-btn-primary"
                            onClick={() => alert("Abrir modal: Cadastrar Novo Membro")}
                        >
                            <Plus size={16} /> Novo Membro
                        </button>
                    </div>
                )}

                {/* Grid de Membros */}
                <section className="people-grid" aria-label="Lista de integrantes do laboratório">
                    {filteredMembers.map((member) => (
                        <article key={member.id} className="person-card" style={{ position: 'relative' }}>

                            {/* Botões de Ação do Card (Admin) */}
                            {isAdmin && (
                                <div className="card-admin-actions">
                                    <button 
                                        type="button" 
                                        className="admin-action-btn edit" 
                                        title={`Editar dados de ${member.name}`}
                                        onClick={() => alert(`Editar membro: ${member.name}`)}
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        type="button" 
                                        className="admin-action-btn delete" 
                                        title={`Remover ${member.name}`}
                                        onClick={() => alert(`Excluir membro ID: ${member.id}`)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
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
                                        <div className="person-avatar-placeholder">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </figure>
                                <div className="person-identity">
                                    <span className={`person-category-badge category-${member.category}`}>
                                        {getCategoryLabel(member.category)}
                                    </span>
                                    <h2 className="person-name">{member.name}</h2>
                                    <span className="person-role">{member.role}</span>
                                </div>
                            </div>

                            <div className="person-body">
                                <div className="person-field-box">
                                    <span className="field-label">Linha de Pesquisa:</span>
                                    <p className="field-value">{member.researchArea}</p>
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

            </div>
        </main>
    );
}
