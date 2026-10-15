import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Microscope, Layers, ShieldCheck, Check, ArrowRight, MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import labData from '../data/labFacilities.json';
import './Lab.css';

export function Lab() {
    const { isAdmin } = useAuth();
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });

    const openCreateModal = (type) => {
        setModalConfig({
            isOpen: true,
            title: type === 'space' ? 'Cadastrar Novo Espaço Analítico' : 'Adicionar Etapa Metodológica',
            type,
            data: null
        });
    };

    const openEditModal = (type, item) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${item.title || item.name}`,
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
        closeModal();
    };

    return (
        <main className="lab-page" id="main-content">
            <div className="lab-container">

                {/* Cabeçalho da Página */}
                <header className="lab-header">
                    <div className="lab-badge">
                        <Microscope size={16} />
                        <span>Infraestrutura Científica</span>
                    </div>
                    <h1 className="lab-title">O Laboratório</h1>
                    <p className="lab-subtitle">
                        Conheça os espaços dedicados e as etapas metodológicas que compõem o cotidiano de pesquisa ficológica no oeste do Pará.
                    </p>

                    <div className="lab-location-tag">
                        <MapPin size={14} aria-hidden="true" />
                        <span>UFOPA – Campus Tapajós, Bloco 1, Sala 5 — Santarém, Pará</span>
                    </div>
                </header>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    <div className="admin-toolbar" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreateModal('space')}
                        >
                            <Plus size={16} /> Novo Espaço / Equipamento
                        </button>
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreateModal('protocol')}
                        >
                            <Plus size={16} /> Nova Etapa / Protocolo
                        </button>
                    </div>
                )}

                {/* Layout em Duas Colunas */}
                <div className="lab-grid-layout">

                    {/* Coluna 1: Espaços e Instalações Físicas */}
                    <section className="facilities-column" aria-label="Espaços e Ambientes do Laboratório">
                        <div className="column-header">
                            <Layers size={20} className="column-icon" aria-hidden="true" />
                            <div>
                                <h2 className="column-title">Espaços Analíticos</h2>
                                <p className="column-desc">Ambientes preparados para o tratamento e análise de algas amazônicas.</p>
                            </div>
                        </div>

                        <div className="spaces-cards-list">
                            {labData.spaces.map((space) => (
                                <article key={space.id} className="space-card">

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
                                                    title={`Editar: ${space.title}`}
                                                    onClick={() => openEditModal('space', space)}
                                                >
                                                    <Edit2 size={13} />
                                                    <span>Editar</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="admin-action-btn delete"
                                                    title={`Excluir: ${space.title}`}
                                                    onClick={() => openDeleteModal(space)}
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Excluir</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-card-top">
                                        <span className="space-tag">{space.tag}</span>
                                        <h3 className="space-title">{space.title}</h3>
                                    </div>

                                    <p className="space-description">{space.description}</p>

                                    <div className="space-equipment-box">
                                        <span className="equipment-list-label">Principais Equipamentos:</span>
                                        <ul className="equipment-items-list">
                                            {(space.equipment || space.equipments || []).map((eq, idx) => (
                                                <li key={idx} className="equipment-item">
                                                    <Check size={13} className="check-icon" aria-hidden="true" />
                                                    <span>{eq}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Coluna 2: Rotina Metodológica */}
                    <section className="methodology-column" aria-label="Rotina Metodológica de Pesquisa">
                        <div className="column-header">
                            <ShieldCheck size={20} className="column-icon" aria-hidden="true" />
                            <div>
                                <h2 className="column-title">Rotina Metodológica</h2>
                                <p className="column-desc">Etapas sequenciais da coleta à caracterização taxonômica no LABETA.</p>
                            </div>
                        </div>

                        <div className="timeline-wrapper">
                            {labData.protocols.map((proto) => (
                                <article key={proto.step} className="protocol-step-card">

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
                                                    title={`Editar etapa: ${proto.name}`}
                                                    onClick={() => openEditModal('protocol', proto)}
                                                >
                                                    <Edit2 size={13} />
                                                    <span>Editar</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="admin-action-btn delete"
                                                    title={`Excluir etapa: ${proto.name}`}
                                                    onClick={() => openDeleteModal(proto)}
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Excluir</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="step-number-badge">{proto.step}</div>
                                    <div className="step-content">
                                        <h3 className="step-title">{proto.name}</h3>
                                        <p className="step-description">{proto.description}</p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Bloco de Chamada para Agendamento */}
                        <aside className="booking-cta-box" aria-labelledby="cta-booking-title">
                            <div className="booking-cta-content">
                                <h3 id="cta-booking-title" className="cta-title">Necessita utilizar nossa infraestrutura?</h3>
                                <p className="cta-description">
                                    Pesquisadores e pós-graduandos vinculados à UFOPA podem solicitar reserva prévia de bancadas e microscópios ópticos.
                                </p>
                            </div>
                            <Link to="/agendamento" className="cta-action-btn">
                                <span>Acessar Portal de Agendamento</span>
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </aside>
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
                                Tem certeza de que deseja remover <strong className="admin-delete-highlight">"{modalConfig.data?.title || modalConfig.data?.name}"</strong>?
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
                                <label className="admin-form-label">Nome / Título</label>
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.title || modalConfig.data?.name || ''}
                                    placeholder="Ex.: Sala de Microscopia Avançada ou Etapa 05..."
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Descrição</label>
                                <textarea
                                    rows="4"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.description || ''}
                                    placeholder="Detalhes dos procedimentos ou equipamentos..."
                                />
                            </div>

                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="admin-btn-submit">Salvar Alterações</button>
                            </div>
                        </form>
                    )}
                </AdminModal>

            </div>
        </main>
    );
}
