/* ============================================================
 * [COMPONENTE] Lab
 * Descrição: Visão física do laboratório: espaços analíticos e rotina metodológica em 2 colunas.
 * Rota/Uso: Rota /laboratorio.
 * Dados: src/data/labFacilities.json
 * CSS correlato: Lab.css
 * ============================================================ */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Microscope, Layers, ShieldCheck, Check, ArrowRight, MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import labData from '../data/labFacilities.json';
import './Lab.css';

/** [FUNÇÃO] Lab — renderiza espaços e passos do preparo ficológico. */
export function Lab() {
    const { isAdmin } = useAuth();
    // [ESTADO] modalConfig — { isOpen, title, type, data } controla o AdminModal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });

    /** [FUNÇÃO] openCreateModal — abre o AdminModal em modo "criar" (somente admin). */
    const openCreateModal = (type) => {
        setModalConfig({
            isOpen: true,
            title: type === 'space' ? 'Cadastrar Novo Espaço Analítico' : 'Adicionar Etapa Metodológica',
            type,
            data: null
        });
    };

    /** [FUNÇÃO] openEditModal — abre o AdminModal em modo "editar" com os dados do item. */
    const openEditModal = (type, item) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${item.title || item.name}`,
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
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    /** [FUNÇÃO] handleFormSubmit — trata o envio do formulário do modal (por ora apenas simula e fecha). */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        closeModal();
    };

    return (
        /* [SEÇÃO 1] .lab-page — <main> */
        <main className="lab-page" id="main-content">
            {/* [SEÇÃO 1.1] .lab-container — <div> */}
            <div className="lab-container">

                {/* Cabeçalho da Página */}
                {/* [SEÇÃO 1.1.1] .lab-header — <header> */}
                <header className="lab-header">
                    {/* [SEÇÃO 1.1.1.1] .lab-badge — <div> */}
                    <div className="lab-badge">
                        <Microscope size={16} />
                        <span>Infraestrutura Científica</span>
                    </div>
                    {/* [SEÇÃO 1.1.1.2] .lab-title — <h1> */}
                    <h1 className="lab-title">O Laboratório</h1>
                    {/* [SEÇÃO 1.1.1.3] .lab-subtitle — <p> */}
                    <p className="lab-subtitle">
                        Conheça os espaços dedicados e as etapas metodológicas que compõem o cotidiano de pesquisa ficológica no oeste do Pará.
                    </p>

                    {/* [SEÇÃO 1.1.1.4] .lab-location-tag — <div> */}
                    <div className="lab-location-tag">
                        <MapPin size={14} aria-hidden="true" />
                        <span>UFOPA – Campus Tapajós, Bloco 1, Sala 5 — Santarém, Pará</span>
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
                            onClick={() => openCreateModal('space')}
                        >
                            <Plus size={16} /> Novo Espaço / Equipamento
                        </button>
                        {/* [SEÇÃO 1.1.1.5.2] .admin-btn-primary — <button> */}
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
                {/* [SEÇÃO 1.1.2] .lab-grid-layout — <div> */}
                <div className="lab-grid-layout">

                    {/* Coluna 1: Espaços e Instalações Físicas */}
                    {/* [SEÇÃO 1.1.2.1] .facilities-column — <section> */}
                    <section className="facilities-column" aria-label="Espaços e Ambientes do Laboratório">
                        {/* [SEÇÃO 1.1.2.1.1] .column-header — <div> */}
                        <div className="column-header">
                            {/* [SEÇÃO 1.1.2.1.1.1] .column-icon — <Layers> */}
                            <Layers size={20} className="column-icon" aria-hidden="true" />
                            <div>
                                {/* [SEÇÃO 1.1.2.1.1.2.1] .column-title — <h2> */}
                                <h2 className="column-title">Espaços Analíticos</h2>
                                {/* [SEÇÃO 1.1.2.1.1.2.2] .column-desc — <p> */}
                                <p className="column-desc">Ambientes preparados para o tratamento e análise de algas amazônicas.</p>
                            </div>
                        </div>

                        {/* [SEÇÃO 1.1.2.1.2] .spaces-cards-list — <div> */}
                        <div className="spaces-cards-list">
                            {labData.spaces.map((space) => (
                                /* [SEÇÃO 1.1.2.1.2.1] .space-card — <article> */
                                <article key={space.id} className="space-card">

                                    {/* Barra de Ações Administrativas do Card */}
                                    {isAdmin && (
                                        /* [SEÇÃO 1.1.2.1.2.1.1] .card-admin-actions — <div> */
                                        <div className="card-admin-actions">
                                            {/* [SEÇÃO 1.1.2.1.2.1.1.1] .card-admin-badge — <span> */}
                                            <span className="card-admin-badge">
                                                <ShieldCheck size={12} aria-hidden="true" />
                                                <span>Gestão</span>
                                            </span>
                                            {/* [SEÇÃO 1.1.2.1.2.1.1.2] .card-admin-btns-group — <div> */}
                                            <div className="card-admin-btns-group">
                                                {/* [SEÇÃO 1.1.2.1.2.1.1.2.1] .admin-action-btn .edit — <button> */}
                                                <button
                                                    type="button"
                                                    className="admin-action-btn edit"
                                                    title={`Editar: ${space.title}`}
                                                    onClick={() => openEditModal('space', space)}
                                                >
                                                    <Edit2 size={13} />
                                                    <span>Editar</span>
                                                </button>
                                                {/* [SEÇÃO 1.1.2.1.2.1.1.2.2] .admin-action-btn .delete — <button> */}
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

                                    {/* [SEÇÃO 1.1.2.1.2.1.2] .space-card-top — <div> */}
                                    <div className="space-card-top">
                                        {/* [SEÇÃO 1.1.2.1.2.1.2.1] .space-tag — <span> */}
                                        <span className="space-tag">{space.tag}</span>
                                        {/* [SEÇÃO 1.1.2.1.2.1.2.2] .space-title — <h3> */}
                                        <h3 className="space-title">{space.title}</h3>
                                    </div>

                                    {/* [SEÇÃO 1.1.2.1.2.1.3] .space-description — <p> */}
                                    <p className="space-description">{space.description}</p>

                                    {/* [SEÇÃO 1.1.2.1.2.1.4] .space-equipment-box — <div> */}
                                    <div className="space-equipment-box">
                                        {/* [SEÇÃO 1.1.2.1.2.1.4.1] .equipment-list-label — <span> */}
                                        <span className="equipment-list-label">Principais Equipamentos:</span>
                                        {/* [SEÇÃO 1.1.2.1.2.1.4.2] .equipment-items-list — <ul> */}
                                        <ul className="equipment-items-list">
                                            {(space.equipment || space.equipments || []).map((eq, idx) => (
                                                /* [SEÇÃO 1.1.2.1.2.1.4.2.1] .equipment-item — <li> */
                                                <li key={idx} className="equipment-item">
                                                    {/* [SEÇÃO 1.1.2.1.2.1.4.2.1.1] .check-icon — <Check> */}
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
                    {/* [SEÇÃO 1.1.2.2] .methodology-column — <section> */}
                    <section className="methodology-column" aria-label="Rotina Metodológica de Pesquisa">
                        {/* [SEÇÃO 1.1.2.2.1] .column-header — <div> */}
                        <div className="column-header">
                            {/* [SEÇÃO 1.1.2.2.1.1] .column-icon — <ShieldCheck> */}
                            <ShieldCheck size={20} className="column-icon" aria-hidden="true" />
                            <div>
                                {/* [SEÇÃO 1.1.2.2.1.2.1] .column-title — <h2> */}
                                <h2 className="column-title">Rotina Metodológica</h2>
                                {/* [SEÇÃO 1.1.2.2.1.2.2] .column-desc — <p> */}
                                <p className="column-desc">Etapas sequenciais da coleta à caracterização taxonômica no LABETA.</p>
                            </div>
                        </div>

                        {/* [SEÇÃO 1.1.2.2.2] .timeline-wrapper — <div> */}
                        <div className="timeline-wrapper">
                            {labData.protocols.map((proto) => (
                                /* [SEÇÃO 1.1.2.2.2.1] .protocol-step-card — <article> */
                                <article key={proto.step} className="protocol-step-card">

                                    {/* Barra de Ações Administrativas do Card */}
                                    {isAdmin && (
                                        /* [SEÇÃO 1.1.2.2.2.1.1] .card-admin-actions — <div> */
                                        <div className="card-admin-actions">
                                            {/* [SEÇÃO 1.1.2.2.2.1.1.1] .card-admin-badge — <span> */}
                                            <span className="card-admin-badge">
                                                <ShieldCheck size={12} aria-hidden="true" />
                                                <span>Gestão</span>
                                            </span>
                                            {/* [SEÇÃO 1.1.2.2.2.1.1.2] .card-admin-btns-group — <div> */}
                                            <div className="card-admin-btns-group">
                                                {/* [SEÇÃO 1.1.2.2.2.1.1.2.1] .admin-action-btn .edit — <button> */}
                                                <button
                                                    type="button"
                                                    className="admin-action-btn edit"
                                                    title={`Editar etapa: ${proto.name}`}
                                                    onClick={() => openEditModal('protocol', proto)}
                                                >
                                                    <Edit2 size={13} />
                                                    <span>Editar</span>
                                                </button>
                                                {/* [SEÇÃO 1.1.2.2.2.1.1.2.2] .admin-action-btn .delete — <button> */}
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

                                    {/* [SEÇÃO 1.1.2.2.2.1.2] .step-number-badge — <div> */}
                                    <div className="step-number-badge">{proto.step}</div>
                                    {/* [SEÇÃO 1.1.2.2.2.1.3] .step-content — <div> */}
                                    <div className="step-content">
                                        {/* [SEÇÃO 1.1.2.2.2.1.3.1] .step-title — <h3> */}
                                        <h3 className="step-title">{proto.name}</h3>
                                        {/* [SEÇÃO 1.1.2.2.2.1.3.2] .step-description — <p> */}
                                        <p className="step-description">{proto.description}</p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Bloco de Chamada para Agendamento */}
                        {/* [SEÇÃO 1.1.2.2.3] .booking-cta-box — <aside> */}
                        <aside className="booking-cta-box" aria-labelledby="cta-booking-title">
                            {/* [SEÇÃO 1.1.2.2.3.1] .booking-cta-content — <div> */}
                            <div className="booking-cta-content">
                                {/* [SEÇÃO 1.1.2.2.3.1.1] .cta-title — <h3> */}
                                <h3 id="cta-booking-title" className="cta-title">Necessita utilizar nossa infraestrutura?</h3>
                                {/* [SEÇÃO 1.1.2.2.3.1.2] .cta-description — <p> */}
                                <p className="cta-description">
                                    Pesquisadores e pós-graduandos vinculados à UFOPA podem solicitar reserva prévia de bancadas e microscópios ópticos.
                                </p>
                            </div>
                            {/* [SEÇÃO 1.1.2.2.3.2] .cta-action-btn — <Link> */}
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
                        /* [SEÇÃO 1.1.3.1] .admin-delete-box — <div> */
                        <div className="admin-delete-box">
                            {/* [SEÇÃO 1.1.3.1.1] .admin-delete-notice — <p> */}
                            <p className="admin-delete-notice">
                                Tem certeza de que deseja remover <strong className="admin-delete-highlight">"{modalConfig.data?.title || modalConfig.data?.name}"</strong>?
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
                                <label className="admin-form-label">Nome / Título</label>
                                {/* [SEÇÃO 1.1.3.2.1.2] .admin-form-input — <input> */}
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.title || modalConfig.data?.name || ''}
                                    placeholder="Ex.: Sala de Microscopia Avançada ou Etapa 05..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.2] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.2.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Descrição</label>
                                {/* [SEÇÃO 1.1.3.2.2.2] .admin-form-textarea — <textarea> */}
                                <textarea
                                    rows="4"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.description || ''}
                                    placeholder="Detalhes dos procedimentos ou equipamentos..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.3] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.3.2.3.1] .admin-btn-cancel — <button> */}
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                {/* [SEÇÃO 1.1.3.2.3.2] .admin-btn-submit — <button> */}
                                <button type="submit" className="admin-btn-submit">Salvar Alterações</button>
                            </div>
                        </form>
                    )}
                </AdminModal>

            </div>
        </main>
    );
}
