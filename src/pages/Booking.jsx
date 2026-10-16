/* ============================================================
 * [COMPONENTE] Booking
 * Descrição: Portal de agendamento: catálogo de equipamentos, agenda e formulário (restrito à comunidade UFOPA).
 * Rota/Uso: Rota /agendamento.
 * Dados: src/data/equipment.json
 * CSS correlato: Booking.css
 * ============================================================ */
import { useState } from 'react';
import { Calendar, Clock, ShieldCheck, Microscope, CheckCircle, ExternalLink, HelpCircle, Plus, Edit2, Trash2, Settings } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import equipmentData from '../data/equipment.json';
import './Booking.css';

/** [FUNÇÃO] Booking — renderiza abas Catálogo/Agenda e modais de gestão. */
export function Booking() {
    const { isAdmin } = useAuth();
    // [ESTADO] activeTab — aba ativa: 'catalogo' | 'agenda'
    const [activeTab, setActiveTab] = useState('catalogo'); // 'catalogo' | 'agenda'
    // [ESTADO] selectedEquipment — equipamento selecionado para solicitação
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    // [ESTADO] modalConfig — { isOpen, title, type, data } controla o AdminModal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });

    /** [FUNÇÃO] openCreateModal — abre o AdminModal em modo "criar" (somente admin). */
    const openCreateModal = () => {
        setModalConfig({
            isOpen: true,
            title: 'Cadastrar Novo Equipamento Analítico',
            type: 'create',
            data: null
        });
    };

    /** [FUNÇÃO] openConfigModal — abre o AdminModal de configuração (links de agenda/formulário). */
    const openConfigModal = () => {
        setModalConfig({
            isOpen: true,
            title: 'Configurações de Agenda e Formulário',
            type: 'config',
            data: null
        });
    };

    /** [FUNÇÃO] openEditModal — abre o AdminModal em modo "editar" com os dados do item. */
    const openEditModal = (eq) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${eq.name}`,
            type: 'edit',
            data: eq
        });
    };

    /** [FUNÇÃO] openDeleteModal — abre o AdminModal de confirmação de exclusão. */
    const openDeleteModal = (eq) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Remoção de Equipamento',
            type: 'delete',
            data: eq
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
        /* [SEÇÃO 1] .booking-page — <main> */
        <main className="booking-page" id="main-content">
            {/* [SEÇÃO 1.1] .booking-container — <div> */}
            <div className="booking-container">

                {/* Cabeçalho da Página */}
                {/* [SEÇÃO 1.1.1] .booking-header — <header> */}
                <header className="booking-header">
                    {/* [SEÇÃO 1.1.1.1] .booking-badge — <div> */}
                    <div className="booking-badge">
                        <Calendar size={16} />
                        <span>Acesso Acadêmico</span>
                    </div>
                    {/* [SEÇÃO 1.1.1.2] .booking-title — <h1> */}
                    <h1 className="booking-title">Portal de Agendamento do LABETA</h1>
                    {/* [SEÇÃO 1.1.1.3] .booking-subtitle — <p> */}
                    <p className="booking-subtitle">
                        Ambiente exclusivo para solicitação de uso de microscópios, bancadas e equipamentos analíticos vinculados às pesquisas científicas da UFOPA.
                    </p>

                    {/* Banner de Restrição Institucional */}
                    {/* [SEÇÃO 1.1.1.4] .restriction-banner — <aside> */}
                    <aside className="restriction-banner" role="alert">
                        {/* [SEÇÃO 1.1.1.4.1] .restriction-icon-box — <div> */}
                        <div className="restriction-icon-box">
                            <ShieldCheck size={24} />
                        </div>
                        {/* [SEÇÃO 1.1.1.4.2] .restriction-text — <div> */}
                        <div className="restriction-text">
                            <strong>Acesso Restrito à Comunidade UFOPA</strong>
                            <p>
                                O uso das dependências e equipamentos é concedido apenas a docentes, discentes orientados e pesquisadores com projetos ativos cadastrados no LABETA. O agendamento deve ser realizado com antecedência mínima de 48 horas úteis.
                            </p>
                        </div>
                    </aside>

                    {/* Abas de Navegação do Portal */}
                    {/* [SEÇÃO 1.1.1.5] .booking-nav-tabs — <nav> */}
                    <nav className="booking-nav-tabs" aria-label="Navegação do Portal de Agendamento">
                        {/* [SEÇÃO 1.1.1.5.1] .booking-tab-btn — <button> */}
                        <button
                            type="button"
                            className={`booking-tab-btn ${activeTab === 'catalogo' ? 'active' : ''}`}
                            onClick={() => setActiveTab('catalogo')}
                        >
                            <Microscope size={16} />
                            <span>1. Catálogo de Equipamentos ({equipmentData.length})</span>
                        </button>
                        {/* [SEÇÃO 1.1.1.5.2] .booking-tab-btn — <button> */}
                        <button
                            type="button"
                            className={`booking-tab-btn ${activeTab === 'agenda' ? 'active' : ''}`}
                            onClick={() => setActiveTab('agenda')}
                        >
                            <Clock size={16} />
                            <span>2. Agenda e Solicitação</span>
                        </button>
                    </nav>
                </header>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    /* [SEÇÃO 1.1.1.6] .admin-toolbar — <div> */
                    <div className="admin-toolbar" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        {activeTab === 'catalogo' ? (
                            /* [SEÇÃO 1.1.1.6.1] .admin-btn-primary — <button> */
                            <button
                                type="button"
                                className="admin-btn-primary"
                                onClick={openCreateModal}
                            >
                                <Plus size={16} /> Novo Equipamento
                            </button>
                        ) : (
                            /* [SEÇÃO 1.1.1.6.2] .admin-btn-primary — <button> */
                            <button
                                type="button"
                                className="admin-btn-primary"
                                onClick={openConfigModal}
                            >
                                <Settings size={16} /> Configurar Agenda / Formulário
                            </button>
                        )}
                    </div>
                )}

                {/* Conteúdo da Aba: Catálogo de Equipamentos */}
                {activeTab === 'catalogo' && (
                    /* [SEÇÃO 1.1.1.7] .equipment-catalog-section — <section> */
                    <section className="equipment-catalog-section" aria-label="Catálogo de Equipamentos Disponíveis">
                        {/* [SEÇÃO 1.1.1.7.1] .equipment-grid — <div> */}
                        <div className="equipment-grid">
                            {equipmentData.map((eq) => {
                                const isAvailable = eq.status === 'disponivel';
                                return (
                                    /* [SEÇÃO 1.1.1.7.1.1] .equipment-card — <article> */
                                    <article key={eq.id} className="equipment-card">

                                        {/* Barra de Ações Administrativas do Card */}
                                        {isAdmin && (
                                            /* [SEÇÃO 1.1.1.7.1.1.1] .card-admin-actions — <div> */
                                            <div className="card-admin-actions">
                                                {/* [SEÇÃO 1.1.1.7.1.1.1.1] .card-admin-badge — <span> */}
                                                <span className="card-admin-badge">
                                                    <ShieldCheck size={12} aria-hidden="true" />
                                                    <span>Gestão</span>
                                                </span>
                                                {/* [SEÇÃO 1.1.1.7.1.1.1.2] .card-admin-btns-group — <div> */}
                                                <div className="card-admin-btns-group">
                                                    {/* [SEÇÃO 1.1.1.7.1.1.1.2.1] .admin-action-btn .edit — <button> */}
                                                    <button
                                                        type="button"
                                                        className="admin-action-btn edit"
                                                        title={`Editar: ${eq.name}`}
                                                        onClick={() => openEditModal(eq)}
                                                    >
                                                        <Edit2 size={13} />
                                                        <span>Editar</span>
                                                    </button>
                                                    {/* [SEÇÃO 1.1.1.7.1.1.1.2.2] .admin-action-btn .delete — <button> */}
                                                    <button
                                                        type="button"
                                                        className="admin-action-btn delete"
                                                        title={`Excluir: ${eq.name}`}
                                                        onClick={() => openDeleteModal(eq)}
                                                    >
                                                        <Trash2 size={13} />
                                                        <span>Excluir</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* [SEÇÃO 1.1.1.7.1.1.2] .equipment-card-header — <div> */}
                                        <div className="equipment-card-header">
                                            {/* [SEÇÃO 1.1.1.7.1.1.2.1] .equipment-meta — <div> */}
                                            <div className="equipment-meta">
                                                {/* [SEÇÃO 1.1.1.7.1.1.2.1.1] .equipment-category — <span> */}
                                                <span className="equipment-category">{eq.category}</span>
                                                {/* [SEÇÃO 1.1.1.7.1.1.2.1.2] .equipment-code — <span> */}
                                                <span className="equipment-code">{eq.code}</span>
                                            </div>
                                            {/* [SEÇÃO 1.1.1.7.1.1.2.2] .status-badge — <span> */}
                                            <span className={`status-badge ${isAvailable ? 'available' : 'maintenance'}`}>
                                                {isAvailable ? 'Disponível' : 'Em Manutenção'}
                                            </span>
                                        </div>

                                        {/* [SEÇÃO 1.1.1.7.1.1.3] .equipment-name — <h2> */}
                                        <h2 className="equipment-name">{eq.name}</h2>
                                        {/* [SEÇÃO 1.1.1.7.1.1.4] .equipment-desc — <p> */}
                                        <p className="equipment-desc">{eq.description}</p>

                                        {/* [SEÇÃO 1.1.1.7.1.1.5] .specs-list — <div> */}
                                        <div className="specs-list">
                                            {/* [SEÇÃO 1.1.1.7.1.1.5.1] .spec-row — <div> */}
                                            <div className="spec-row">
                                                {/* [SEÇÃO 1.1.1.7.1.1.5.1.1] .spec-label — <span> */}
                                                <span className="spec-label">Capacidade Máxima:</span>
                                                {/* [SEÇÃO 1.1.1.7.1.1.5.1.2] .spec-value — <span> */}
                                                <span className="spec-value">{eq.capacity}</span>
                                            </div>
                                            {/* [SEÇÃO 1.1.1.7.1.1.5.2] .spec-row — <div> */}
                                            <div className="spec-row">
                                                {/* [SEÇÃO 1.1.1.7.1.1.5.2.1] .spec-label — <span> */}
                                                <span className="spec-label">Localização:</span>
                                                {/* [SEÇÃO 1.1.1.7.1.1.5.2.2] .spec-value — <span> */}
                                                <span className="spec-value">{eq.location}</span>
                                            </div>
                                        </div>

                                        {/* [SEÇÃO 1.1.1.7.1.1.6] .requirements-box — <div> */}
                                        <div className="requirements-box">
                                            {/* [SEÇÃO 1.1.1.7.1.1.6.1] .req-title — <span> */}
                                            <span className="req-title">Requisitos de Biossegurança:</span>
                                            {/* [SEÇÃO 1.1.1.7.1.1.6.2] .req-list — <ul> */}
                                            <ul className="req-list">
                                                {eq.requirements.map((req, idx) => (
                                                    /* [SEÇÃO 1.1.1.7.1.1.6.2.1] .req-item — <li> */
                                                    <li key={idx} className="req-item">
                                                        {/* [SEÇÃO 1.1.1.7.1.1.6.2.1.1] .req-icon — <CheckCircle> */}
                                                        <CheckCircle size={13} className="req-icon" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* [SEÇÃO 1.1.1.7.1.1.7] .equipment-card-footer — <div> */}
                                        <div className="equipment-card-footer">
                                            {/* [SEÇÃO 1.1.1.7.1.1.7.1] .select-equipment-btn — <button> */}
                                            <button
                                                type="button"
                                                className="select-equipment-btn"
                                                onClick={() => {
                                                    setSelectedEquipment(eq);
                                                    setActiveTab('agenda');
                                                }}
                                            >
                                                <span>Ver Disponibilidade na Agenda</span>
                                                <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Conteúdo da Aba: Calendário e Formulário */}
                {activeTab === 'agenda' && (
                    /* [SEÇÃO 1.1.1.8] .schedule-section — <section> */
                    <section className="schedule-section" aria-label="Painel de Agendamento e Horários">

                        {selectedEquipment && (
                            /* [SEÇÃO 1.1.1.8.1] .selected-equipment-alert — <div> */
                            <div className="selected-equipment-alert">
                                <span>Equipamento pré-selecionado: <strong>{selectedEquipment.name}</strong> ({selectedEquipment.code})</span>
                                {/* [SEÇÃO 1.1.1.8.1.2] .clear-selection-btn — <button> */}
                                <button
                                    type="button"
                                    className="clear-selection-btn"
                                    onClick={() => setSelectedEquipment(null)}
                                >
                                    Limpar seleção
                                </button>
                            </div>
                        )}

                        {/* Guia Visual de Turnos de Bancada */}
                        {/* [SEÇÃO 1.1.1.8.2] .shifts-guide-panel — <div> */}
                        <div className="shifts-guide-panel" aria-label="Guia de Turnos de Bancada">
                            {/* [SEÇÃO 1.1.1.8.2.1] .shift-card — <div> */}
                            <div className="shift-card">
                                {/* [SEÇÃO 1.1.1.8.2.1.1] .shift-header — <div> */}
                                <div className="shift-header">
                                    {/* [SEÇÃO 1.1.1.8.2.1.1.1] .shift-badge .morning — <span> */}
                                    <span className="shift-badge morning">Manhã</span>
                                    {/* [SEÇÃO 1.1.1.8.2.1.1.2] .shift-hours — <span> */}
                                    <span className="shift-hours">08:00 – 12:00</span>
                                </div>
                                {/* [SEÇÃO 1.1.1.8.2.1.2] .shift-desc — <p> */}
                                <p className="shift-desc">Triagem, preparação e lavagem de amostras ficológicas.</p>
                            </div>
                            {/* [SEÇÃO 1.1.1.8.2.2] .shift-card — <div> */}
                            <div className="shift-card">
                                {/* [SEÇÃO 1.1.1.8.2.2.1] .shift-header — <div> */}
                                <div className="shift-header">
                                    {/* [SEÇÃO 1.1.1.8.2.2.1.1] .shift-badge .afternoon — <span> */}
                                    <span className="shift-badge afternoon">Tarde</span>
                                    {/* [SEÇÃO 1.1.1.8.2.2.1.2] .shift-hours — <span> */}
                                    <span className="shift-hours">14:00 – 18:00</span>
                                </div>
                                {/* [SEÇÃO 1.1.1.8.2.2.2] .shift-desc — <p> */}
                                <p className="shift-desc">Microscopia óptica avançada, contagem celular e capturas digitais.</p>
                            </div>
                            {/* [SEÇÃO 1.1.1.8.2.3] .shift-card — <div> */}
                            <div className="shift-card">
                                {/* [SEÇÃO 1.1.1.8.2.3.1] .shift-header — <div> */}
                                <div className="shift-header">
                                    {/* [SEÇÃO 1.1.1.8.2.3.1.1] .shift-badge .night — <span> */}
                                    <span className="shift-badge night">Noite</span>
                                    {/* [SEÇÃO 1.1.1.8.2.3.1.2] .shift-hours — <span> */}
                                    <span className="shift-hours">18:00 – 21:00</span>
                                </div>
                                {/* [SEÇÃO 1.1.1.8.2.3.2] .shift-desc — <p> */}
                                <p className="shift-desc">Oxidação química, estufa e processos de longa duração (Pós-graduação).</p>
                            </div>
                        </div>

                        {/* [SEÇÃO 1.1.1.8.3] .schedule-layout-grid — <div> */}
                        <div className="schedule-layout-grid">

                            {/* Calendário de Disponibilidade */}
                            {/* [SEÇÃO 1.1.1.8.3.1] .calendar-panel — <div> */}
                            <div className="calendar-panel">
                                {/* [SEÇÃO 1.1.1.8.3.1.1] .panel-header — <div> */}
                                <div className="panel-header">
                                    {/* [SEÇÃO 1.1.1.8.3.1.1.1] .panel-icon — <Clock> */}
                                    <Clock size={18} className="panel-icon" />
                                    <div>
                                        {/* [SEÇÃO 1.1.1.8.3.1.1.2.1] .panel-title — <h2> */}
                                        <h2 className="panel-title">1. Consultar Horários Ocupados</h2>
                                        {/* [SEÇÃO 1.1.1.8.3.1.1.2.2] .panel-subtitle — <p> */}
                                        <p className="panel-subtitle">Verifique no calendário abaixo os horários com reservas já confirmadas.</p>
                                    </div>
                                </div>

                                {/* [SEÇÃO 1.1.1.8.3.1.2] .calendar-embed-container — <div> */}
                                <div className="calendar-embed-container">
                                    {/* [SEÇÃO 1.1.1.8.3.1.2.1] .calendar-iframe — <iframe> */}
                                    <iframe
                                        src="https://calendar.google.com/calendar/embed?height=400&wkst=1&ctz=America%2FSao_Paulo&showPrint=0&color=%23165B33&color=%23D6C28F"
                                        className="calendar-iframe"
                                        width="100%"
                                        height="400"
                                        title="Google Agenda do LABETA - Horários de Bancada e Equipamentos"
                                        loading="lazy"
                                    />
                                </div>
                                {/* [SEÇÃO 1.1.1.8.3.1.3] .calendar-footer-hint — <div> */}
                                <div className="calendar-footer-hint">
                                    <span>Visualização otimizada para web. </span>
                                    {/* [SEÇÃO 1.1.1.8.3.1.3.2] .calendar-direct-link — <a> */}
                                    <a
                                        href="https://calendar.google.com/calendar/embed?ctz=America%2FSao_Paulo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="calendar-direct-link"
                                        aria-label="Abrir Google Agenda do laboratório em nova aba"
                                    >
                                        <span>Abrir agenda em tela cheia</span>
                                        <ExternalLink size={13} aria-hidden="true" />
                                    </a>
                                </div>
                            </div>

                            {/* Painel do Formulário de Reserva */}
                            {/* [SEÇÃO 1.1.1.8.3.2] .form-panel — <div> */}
                            <div className="form-panel">
                                {/* [SEÇÃO 1.1.1.8.3.2.1] .panel-header — <div> */}
                                <div className="panel-header">
                                    {/* [SEÇÃO 1.1.1.8.3.2.1.1] .panel-icon — <Calendar> */}
                                    <Calendar size={18} className="panel-icon" />
                                    <div>
                                        {/* [SEÇÃO 1.1.1.8.3.2.1.2.1] .panel-title — <h2> */}
                                        <h2 className="panel-title">2. Solicitar Reserva de Horário</h2>
                                        {/* [SEÇÃO 1.1.1.8.3.2.1.2.2] .panel-subtitle — <p> */}
                                        <p className="panel-subtitle">Preencha o formulário institucional com seus dados de pesquisa.</p>
                                    </div>
                                </div>

                                {/* [SEÇÃO 1.1.1.8.3.2.2] .form-action-box — <div> */}
                                <div className="form-action-box">
                                    {/* [SEÇÃO 1.1.1.8.3.2.2.1] .form-notice — <div> */}
                                    <div className="form-notice">
                                        {/* [SEÇÃO 1.1.1.8.3.2.2.1.1] .notice-icon — <HelpCircle> */}
                                        <HelpCircle size={18} className="notice-icon" />
                                        <p>
                                            As solicitações são analisadas pela coordenação. Você receberá um e-mail com a confirmação e orientações para retirada da chave/acesso à sala.
                                        </p>
                                    </div>

                                    {/* [SEÇÃO 1.1.1.8.3.2.2.2] .booking-steps-list — <ul> */}
                                    <ul className="booking-steps-list">
                                        <li><strong>Passo 1:</strong> Escolha um horário livre no calendário ao lado.</li>
                                        <li><strong>Passo 2:</strong> Tenha em mãos seu número de matrícula ou SIAPE da UFOPA.</li>
                                        <li><strong>Passo 3:</strong> Submeta o formulário de reserva para homologação.</li>
                                    </ul>

                                    {/* [SEÇÃO 1.1.1.8.3.2.2.3] .open-form-btn — <a> */}
                                    <a
                                        href="https://forms.google.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="open-form-btn"
                                    >
                                        <span>Abrir Formulário de Agendamento (Google Forms)</span>
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>

                        </div>
                    </section>
                )}

                {/* Modal Administrativo Unificado */}
                <AdminModal
                    isOpen={modalConfig.isOpen}
                    onClose={closeModal}
                    title={modalConfig.title}
                >
                    {modalConfig.type === 'delete' ? (
                        /* [SEÇÃO 1.1.2.1] .admin-delete-box — <div> */
                        <div className="admin-delete-box">
                            {/* [SEÇÃO 1.1.2.1.1] .admin-delete-notice — <p> */}
                            <p className="admin-delete-notice">
                                Tem certeza de que deseja remover o equipamento <strong className="admin-delete-highlight">"{modalConfig.data?.name}"</strong>?
                            </p>
                            {/* [SEÇÃO 1.1.2.1.2] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.2.1.2.1] .admin-btn-cancel — <button> */}
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                {/* [SEÇÃO 1.1.2.1.2.2] .admin-btn-submit — <button> */}
                                <button type="button" className="admin-btn-submit" style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={closeModal}>
                                    Confirmar Exclusão
                                </button>
                            </div>
                        </div>
                    ) : modalConfig.type === 'config' ? (
                        <form onSubmit={handleFormSubmit}>
                            {/* [SEÇÃO 1.1.2.2.1] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.2.2.1.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">URL Embed do Google Calendar</label>
                                {/* [SEÇÃO 1.1.2.2.1.2] .admin-form-input — <input> */}
                                <input
                                    type="url"
                                    required
                                    className="admin-form-input"
                                    defaultValue="https://calendar.google.com/calendar/embed?..."
                                />
                            </div>
                            {/* [SEÇÃO 1.1.2.2.2] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.2.2.2.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Link do Google Formulários</label>
                                {/* [SEÇÃO 1.1.2.2.2.2] .admin-form-input — <input> */}
                                <input
                                    type="url"
                                    required
                                    className="admin-form-input"
                                    defaultValue="https://forms.google.com"
                                />
                            </div>
                            {/* [SEÇÃO 1.1.2.2.3] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.2.2.3.1] .admin-btn-cancel — <button> */}
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                {/* [SEÇÃO 1.1.2.2.3.2] .admin-btn-submit — <button> */}
                                <button type="submit" className="admin-btn-submit">Salvar Configurações</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            {/* [SEÇÃO 1.1.2.3.1] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.2.3.1.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Nome do Equipamento</label>
                                {/* [SEÇÃO 1.1.2.3.1.2] .admin-form-input — <input> */}
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.name || ''}
                                    placeholder="Ex.: Microscópio Óptico Trinocular..."
                                />
                            </div>
                            {/* [SEÇÃO 1.1.2.3.2] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.2.3.2.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Código Patrimonial / Sigla</label>
                                {/* [SEÇÃO 1.1.2.3.2.2] .admin-form-input — <input> */}
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.code || ''}
                                    placeholder="Ex.: LABETA-MIC-01"
                                />
                            </div>
                            {/* [SEÇÃO 1.1.2.3.3] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.2.3.3.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Categoria</label>
                                {/* [SEÇÃO 1.1.2.3.3.2] .admin-form-input — <input> */}
                                <input
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.category || ''}
                                    placeholder="Ex.: Microscopia, Bancada, Esterilização..."
                                />
                            </div>
                            {/* [SEÇÃO 1.1.2.3.4] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.2.3.4.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Status de Uso</label>
                                {/* [SEÇÃO 1.1.2.3.4.2] .admin-form-select — <select> */}
                                <select className="admin-form-select" defaultValue={modalConfig.data?.status || 'disponivel'}>
                                    <option value="disponivel">Disponível</option>
                                    <option value="manutencao">Em Manutenção</option>
                                </select>
                            </div>
                            {/* [SEÇÃO 1.1.2.3.5] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.2.3.5.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Descrição e Capacidade</label>
                                {/* [SEÇÃO 1.1.2.3.5.2] .admin-form-textarea — <textarea> */}
                                <textarea
                                    rows="3"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.description || ''}
                                    placeholder="Especificações de lentes, aumento e uso..."
                                />
                            </div>
                            {/* [SEÇÃO 1.1.2.3.6] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.2.3.6.1] .admin-btn-cancel — <button> */}
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                {/* [SEÇÃO 1.1.2.3.6.2] .admin-btn-submit — <button> */}
                                <button type="submit" className="admin-btn-submit">Salvar Equipamento</button>
                            </div>
                        </form>
                    )}
                </AdminModal>

            </div>
        </main>
    );
}
