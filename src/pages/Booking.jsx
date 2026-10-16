/* ============================================================
 * [COMPONENTE] Booking
 * Descrição: Portal de agendamento: catálogo de equipamentos, agenda e formulário (restrito à comunidade UFOPA).
 *            Possui integração reativa com Supabase e contingência automática via equipment.json.
 * Rota/Uso: Rota /agendamento.
 * Dados: Supabase ('equipment') com fallback em src/data/equipment.json via equipmentService.
 * CSS correlato: Booking.css
 * ============================================================ */
import { useState, useEffect } from 'react';
import { Calendar, Clock, ShieldCheck, Microscope, CheckCircle, ExternalLink, Plus, Edit2, Trash2, Settings } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { fetchEquipment, createEquipment, updateEquipment, deleteEquipment } from '../services/equipmentService';
import './Booking.css';

/** [FUNÇÃO] Booking — renderiza abas Catálogo/Agenda e modais de gestão. */
export function Booking() {
    const { isAdmin } = useAuth();
    // [ESTADO] equipmentList — lista reativa de equipamentos
    const [equipmentList, setEquipmentList] = useState([]);
    // [ESTADO] loadingEquipment — indicador de carregamento
    const [loadingEquipment, setLoadingEquipment] = useState(true);
    // [ESTADO] activeTab — aba ativa: 'catalogo' | 'agenda'
    const [activeTab, setActiveTab] = useState('catalogo');
    // [ESTADO] selectedEquipment — equipamento selecionado para solicitação
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    // [ESTADO] modalConfig — { isOpen, title, type, data } controla o AdminModal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });
    // [ESTADO] formSubmitting — envio do formulário em andamento
    const [formSubmitting, setFormSubmitting] = useState(false);
    // [ESTADO] toast — notificação de feedback temporário
    const [toast, setToast] = useState(null);

    /** [HOOK] useEffect — Carrega equipamentos na montagem */
    useEffect(() => {
        let isMounted = true;
        async function load() {
            setLoadingEquipment(true);
            const { equipment } = await fetchEquipment();
            if (isMounted) {
                setEquipmentList(equipment);
                setLoadingEquipment(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, []);

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
        if (formSubmitting) return;
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    /** [FUNÇÃO] handleConfirmDelete — remove o equipamento e atualiza o estado */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setFormSubmitting(true);
        const item = modalConfig.data;
        const { error } = await deleteEquipment(item.id);

        if (error) {
            setToast({ type: 'error', message: `Erro ao remover equipamento: ${error.message}` });
        } else {
            setEquipmentList((prev) => prev.filter((eq) => eq.id !== item.id));
            setToast({ type: 'success', message: 'Equipamento removido do catálogo!' });
            closeModal();
        }
        setFormSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — trata cadastro, edição e configs */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const isConfig = modalConfig.type === 'config';
        const isEdit = modalConfig.type === 'edit';

        if (isConfig) {
            setToast({ type: 'info', message: 'Configurações de integração atualizadas!' });
            closeModal();
            setFormSubmitting(false);
            return;
        }

        const payload = {
            name: formData.get('name'),
            code: formData.get('code'),
            category: formData.get('category'),
            status: formData.get('status'),
            description: formData.get('description'),
            capacity: modalConfig.data?.capacity || '1 pesquisador por turno',
            requirements: modalConfig.data?.requirements || ['Uso exclusivo em bancada do LABETA']
        };

        if (isEdit) {
            const currentId = modalConfig.data.id;
            const { data, error } = await updateEquipment(currentId, payload);
            if (error) {
                setToast({ type: 'error', message: `Falha ao atualizar equipamento: ${error.message}` });
            } else {
                const updated = data || { id: currentId, ...payload };
                setEquipmentList((prev) => prev.map((eq) => (eq.id === currentId ? updated : eq)));
                setToast({ type: 'success', message: 'Equipamento atualizado com sucesso!' });
                closeModal();
            }
        } else {
            const { data, error } = await createEquipment(payload);
            if (error) {
                setToast({ type: 'error', message: `Falha ao cadastrar equipamento: ${error.message}` });
            } else {
                const created = data || { id: `local-${Date.now()}`, ...payload };
                setEquipmentList((prev) => [...prev, created]);
                setToast({ type: 'success', message: 'Equipamento cadastrado com sucesso!' });
                closeModal();
            }
        }

        setFormSubmitting(false);
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
                            {/* [SEÇÃO 1.1.1.4.2.1] .restriction-title — <strong> */}
                            <strong className="restriction-title">Aviso de Elegibilidade de Uso:</strong>
                            {/* [SEÇÃO 1.1.1.4.2.2] .restriction-desc — <p> */}
                            <p className="restriction-desc">
                                O uso da infraestrutura analítica é restrito a docentes, discentes e colaboradores em projetos formais de pesquisa cadastrados na UFOPA. Solicitações externas necessitam de autorização prévia da coordenação do laboratório.
                            </p>
                        </div>
                    </aside>

                    {/* Navegação entre Abas */}
                    {/* [SEÇÃO 1.1.1.5] .booking-nav-tabs / .booking-tabs — <nav> */}
                    <nav className="booking-nav-tabs booking-tabs" aria-label="Abas de agendamento">
                        {/* [SEÇÃO 1.1.1.5.1] .booking-tab-btn — <button> */}
                        <button
                            type="button"
                            className={`booking-tab-btn ${activeTab === 'catalogo' ? 'active' : ''}`}
                            onClick={() => setActiveTab('catalogo')}
                        >
                            <Microscope size={15} />
                            <span>Catálogo de Recursos ({equipmentList.length})</span>
                        </button>
                        {/* [SEÇÃO 1.1.1.5.2] .booking-tab-btn — <button> */}
                        <button
                            type="button"
                            className={`booking-tab-btn ${activeTab === 'agenda' ? 'active' : ''}`}
                            onClick={() => setActiveTab('agenda')}
                        >
                            <Calendar size={15} />
                            <span>Agenda e Solicitação</span>
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

                {/* ABA 1: Catálogo de Recursos e Equipamentos */}
                {activeTab === 'catalogo' && (
                    /* [SEÇÃO 1.1.2] .equipment-catalog-section — <section> */
                    <section className="equipment-catalog-section" aria-label="Catálogo de Recursos">
                        {/* [SEÇÃO 1.1.2.1] .section-intro — <div> */}
                        <div className="section-intro">
                            {/* [SEÇÃO 1.1.2.1.1] .section-heading — <h2> */}
                            <h2 className="section-heading">Equipamentos e Bancadas Disponíveis</h2>
                            {/* [SEÇÃO 1.1.2.1.2] .section-lead — <p> */}
                            <p className="section-lead">
                                Consulte as especificações técnicas, exigências de biossegurança e capacidade por turno antes de formalizar sua solicitação.
                            </p>
                        </div>

                        {/* [SEÇÃO 1.1.2.2] .equipment-grid — <div> */}
                        <div className="equipment-grid">
                            {loadingEquipment ? (
                                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando catálogo de equipamentos...</p>
                            ) : equipmentList.map((eq) => (
                                /* [SEÇÃO 1.1.2.2.1] .equipment-card — <article> */
                                <article key={eq.id} className="equipment-card">
                                    {/* Barra de Ações Administrativas do Card */}
                                    {isAdmin && (
                                        /* [SEÇÃO 1.1.2.2.1.1] .card-admin-actions — <div> */
                                        <div className="card-admin-actions">
                                            {/* [SEÇÃO 1.1.2.2.1.1.1] .card-admin-badge — <span> */}
                                            <span className="card-admin-badge">
                                                <ShieldCheck size={12} aria-hidden="true" />
                                                <span>Gestão</span>
                                            </span>
                                            {/* [SEÇÃO 1.1.2.2.1.1.2] .card-admin-btns-group — <div> */}
                                            <div className="card-admin-btns-group">
                                                {/* [SEÇÃO 1.1.2.2.1.1.2.1] .admin-action-btn .edit — <button> */}
                                                <button
                                                    type="button"
                                                    className="admin-action-btn edit"
                                                    title="Editar equipamento"
                                                    onClick={() => openEditModal(eq)}
                                                >
                                                    <Edit2 size={13} />
                                                    <span>Editar</span>
                                                </button>
                                                {/* [SEÇÃO 1.1.2.2.1.1.2.2] .admin-action-btn .delete — <button> */}
                                                <button
                                                    type="button"
                                                    className="admin-action-btn delete"
                                                    title="Excluir equipamento"
                                                    onClick={() => openDeleteModal(eq)}
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Excluir</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* [SEÇÃO 1.1.2.2.1.2] .equipment-header — <div> */}
                                    <div className="equipment-header">
                                        <div>
                                            {/* [SEÇÃO 1.1.2.2.1.2.1] .equipment-category-tag — <span className="equipment-category-tag"> */}
                                            <span className="equipment-category-tag">{eq.category}</span>
                                            {/* [SEÇÃO 1.1.2.2.1.2.2] .equipment-name — <h3> */}
                                            <h3 className="equipment-name">{eq.name}</h3>
                                        </div>
                                        {/* [SEÇÃO 1.1.2.2.1.2.3] .equipment-code — <span> */}
                                        <span className="equipment-code">{eq.code}</span>
                                    </div>

                                    {/* [SEÇÃO 1.1.2.2.1.3] .equipment-status-row — <div> */}
                                    <div className="equipment-status-row">
                                        {/* [SEÇÃO 1.1.2.2.1.3.1] .equipment-status-badge — <span> */}
                                        <span className={`equipment-status-badge status-${eq.status}`}>
                                            <span className="status-dot" aria-hidden="true" />
                                            {eq.status === 'disponivel' && 'Disponível'}
                                            {eq.status === 'manutencao_preventiva' && 'Manutenção Preventiva'}
                                            {eq.status === 'indisponivel' && 'Indisponível'}
                                        </span>
                                        {/* [SEÇÃO 1.1.2.2.1.3.2] .equipment-capacity — <span> */}
                                        <span className="equipment-capacity">
                                            <Clock size={12} />
                                            {eq.capacity}
                                        </span>
                                    </div>

                                    {/* [SEÇÃO 1.1.2.2.1.4] .equipment-description — <p> */}
                                    <p className="equipment-description">{eq.description}</p>

                                    {/* [SEÇÃO 1.1.2.2.1.5] .equipment-requirements-box — <div> */}
                                    <div className="equipment-requirements-box">
                                        {/* [SEÇÃO 1.1.2.2.1.5.1] .requirements-label — <span className="requirements-label"> */}
                                        <span className="requirements-label">Requisitos e Cuidados Específicos:</span>
                                        {/* [SEÇÃO 1.1.2.2.1.5.2] .requirements-list — <ul> */}
                                        <ul className="requirements-list">
                                            {Array.isArray(eq.requirements) && eq.requirements.map((req, idx) => (
                                                /* [SEÇÃO 1.1.2.2.1.5.2.1] .requirement-item — <li> */
                                                <li key={idx} className="requirement-item">
                                                    <CheckCircle size={13} className="req-check-icon" aria-hidden="true" />
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* [SEÇÃO 1.1.2.2.1.6] .equipment-card-footer — <div className="equipment-card-footer"> */}
                                    <div className="equipment-card-footer">
                                        {/* [SEÇÃO 1.1.2.2.1.6.1] .select-equipment-btn — <button> */}
                                        <button
                                            type="button"
                                            className="select-equipment-btn select-reserve-btn"
                                            onClick={() => {
                                                setSelectedEquipment(eq.name);
                                                setActiveTab('agenda');
                                            }}
                                            aria-label={`Solicitar agendamento do ${eq.name}`}
                                        >
                                            <span>Solicitar Este Recurso</span>
                                            <ExternalLink size={13} />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/* ABA 2: Calendário e Formulário */}
                {activeTab === 'agenda' && (
                    /* [SEÇÃO 1.1.3] .booking-agenda-section — <section> */
                    <section className="booking-agenda-section" aria-label="Agenda e Formulário de Solicitação">
                        {/* [SEÇÃO 1.1.3.1] .agenda-grid — <div> */}
                        <div className="agenda-grid">

                            {/* Coluna 1: Visualização de Disponibilidade */}
                            {/* [SEÇÃO 1.1.3.1.1] .agenda-calendar-col — <article> */}
                            <article className="agenda-calendar-col">
                                {/* [SEÇÃO 1.1.3.1.1.1] .col-header — <div> */}
                                <div className="col-header">
                                    {/* [SEÇÃO 1.1.3.1.1.1.1] .col-icon-box — <div> */}
                                    <div className="col-icon-box">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        {/* [SEÇÃO 1.1.3.1.1.1.2.1] .col-title — <h2> */}
                                        <h2 className="col-title">Disponibilidade do Laboratório</h2>
                                        {/* [SEÇÃO 1.1.3.1.1.1.2.2] .col-desc — <p> */}
                                        <p className="col-desc">Consulte horários e bancadas ocupadas antes de enviar a proposta.</p>
                                    </div>
                                </div>

                                {/* [SEÇÃO 1.1.3.1.1.2] .calendar-embed-container — <div> */}
                                <div className="calendar-embed-container">
                                    {/* [SEÇÃO 1.1.3.1.1.2.1] .google-calendar-iframe — <iframe> */}
                                    <iframe
                                        src="https://calendar.google.com/calendar/embed?src=pt.brazilian%23holiday%40group.v.calendar.google.com&ctz=America%2FSantarem&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&bgcolor=%2314241B"
                                        title="Agenda Oficial de Ocupação do LABETA"
                                        className="google-calendar-iframe"
                                        width="554"
                                        height="380"
                                        frameBorder="0"
                                        scrolling="no"
                                        loading="lazy"
                                    />
                                </div>
                            </article>

                            {/* Coluna 2: Formulário de Solicitação */}
                            {/* [SEÇÃO 1.1.3.1.2] .agenda-form-col — <article> */}
                            <article className="agenda-form-col">
                                {/* [SEÇÃO 1.1.3.1.2.1] .col-header — <div> */}
                                <div className="col-header">
                                    {/* [SEÇÃO 1.1.3.1.2.1.1] .col-icon-box — <div> */}
                                    <div className="col-icon-box">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        {/* [SEÇÃO 1.1.3.1.2.1.2.1] .col-title — <h2> */}
                                        <h2 className="col-title">Submissão de Agendamento</h2>
                                        {/* [SEÇÃO 1.1.3.1.2.1.2.2] .col-desc — <p> */}
                                        <p className="col-desc">Preencha o formulário acadêmico formal para análise da coordenação.</p>
                                    </div>
                                </div>

                                {/* [SEÇÃO 1.1.3.1.2.2] .form-embed-container — <div> */}
                                <div className="form-embed-container">
                                    {/* [SEÇÃO 1.1.3.1.2.2.1] .form-notice — <div> */}
                                    <div className="form-notice">
                                        {/* [SEÇÃO 1.1.3.1.2.2.1.1] .form-notice-title — <h3> */}
                                        <h3 className="form-notice-title">Formulário Oficial de Reserva</h3>
                                        <p>
                                            O agendamento de recursos é realizado via Google Formulários institucional da UFOPA para registro auditável das atividades práticas.
                                        </p>
                                        {selectedEquipment && (
                                            <div style={{ marginTop: '0.85rem', padding: '0.6rem 0.85rem', background: 'rgba(56, 161, 105, 0.15)', border: '1px solid rgba(56, 161, 105, 0.35)', borderRadius: '6px', fontSize: '0.85rem', color: '#68d391', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span>Recurso pré-selecionado: <strong>{selectedEquipment}</strong></span>
                                                <button type="button" onClick={() => setSelectedEquipment(null)} style={{ background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}>Remover seleção</button>
                                            </div>
                                        )}
                                    </div>

                                    {/* [SEÇÃO 1.1.3.1.2.2.2] .booking-steps-list — <ol> */}
                                    <ol className="booking-steps-list">
                                        {/* [SEÇÃO 1.1.3.1.2.2.2.1] .booking-step-item — <li> */}
                                        <li className="booking-step-item">
                                            <strong>01.</strong> Selecione os dias e turnos verificando a disponibilidade na agenda ao lado.
                                        </li>
                                        {/* [SEÇÃO 1.1.3.1.2.2.2.2] .booking-step-item — <li> */}
                                        <li className="booking-step-item">
                                            <strong>02.</strong> Indique o orientador responsável e o número do processo ou projeto formal.
                                        </li>
                                        {/* [SEÇÃO 1.1.3.1.2.2.2.3] .booking-step-item — <li> */}
                                        <li className="booking-step-item">
                                            <strong>03.</strong> Aguarde o e-mail de homologação emitido pela equipe técnica do laboratório.
                                        </li>
                                    </ol>

                                    {/* [SEÇÃO 1.1.3.1.2.2.3] .form-action-btn — <a> */}
                                    <a
                                        href="https://forms.google.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="form-action-btn"
                                        title="Abrir Formulário de Agendamento da UFOPA (em nova aba)"
                                    >
                                        <span>Abrir Formulário de Reserva Oficial</span>
                                        <ExternalLink size={16} aria-hidden="true" />
                                    </a>
                                </div>
                            </article>

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
                        /* [SEÇÃO 1.1.4.1] .admin-delete-box — <div> */
                        <div className="admin-delete-box">
                            {/* [SEÇÃO 1.1.4.1.1] .admin-delete-notice — <p> */}
                            <p className="admin-delete-notice">
                                Tem certeza de que deseja remover o equipamento <strong className="admin-delete-highlight">"{modalConfig.data?.name}"</strong>?
                            </p>
                            {/* [SEÇÃO 1.1.4.1.2] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.4.1.2.1] .admin-btn-cancel — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancelar
                                </button>
                                {/* [SEÇÃO 1.1.4.1.2.2] .admin-btn-submit — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-submit"
                                    style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                                    onClick={handleConfirmDelete}
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Excluindo...' : 'Confirmar Exclusão'}
                                </button>
                            </div>
                        </div>
                    ) : modalConfig.type === 'config' ? (
                        <form onSubmit={handleFormSubmit}>
                            {/* [SEÇÃO 1.1.4.2.1] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.4.2.1.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">URL Embed do Google Calendar</label>
                                {/* [SEÇÃO 1.1.4.2.1.2] .admin-form-input — <input> */}
                                <input
                                    name="calendarUrl"
                                    type="url"
                                    required
                                    className="admin-form-input"
                                    defaultValue="https://calendar.google.com/calendar/embed?..."
                                />
                            </div>
                            {/* [SEÇÃO 1.1.4.2.2] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.4.2.2.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Link do Google Formulários</label>
                                {/* [SEÇÃO 1.1.4.2.2.2] .admin-form-input — <input> */}
                                <input
                                    name="formUrl"
                                    type="url"
                                    required
                                    className="admin-form-input"
                                    defaultValue="https://forms.google.com"
                                />
                            </div>
                            {/* [SEÇÃO 1.1.4.2.3] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.4.2.3.1] .admin-btn-cancel — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancelar
                                </button>
                                {/* [SEÇÃO 1.1.4.2.3.2] .admin-btn-submit — <button> */}
                                <button
                                    type="submit"
                                    className="admin-btn-submit"
                                    disabled={formSubmitting}
                                >
                                    Salvar Configurações
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            {/* [SEÇÃO 1.1.4.3.1] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.4.3.1.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Nome do Equipamento</label>
                                {/* [SEÇÃO 1.1.4.3.1.2] .admin-form-input — <input> */}
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.name || ''}
                                    placeholder="Ex.: Microscópio Óptico Trinocular..."
                                />
                            </div>
                            {/* [SEÇÃO 1.1.4.3.2] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.4.3.2.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Código Patrimonial / Sigla</label>
                                {/* [SEÇÃO 1.1.4.3.2.2] .admin-form-input — <input> */}
                                <input
                                    name="code"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.code || ''}
                                    placeholder="Ex.: LABETA-MIC-01"
                                />
                            </div>
                            {/* [SEÇÃO 1.1.4.3.3] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.4.3.3.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Categoria</label>
                                {/* [SEÇÃO 1.1.4.3.3.2] .admin-form-input — <input> */}
                                <input
                                    name="category"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.category || ''}
                                    placeholder="Ex.: Microscopia, Bancada, Esterilização..."
                                />
                            </div>
                            {/* [SEÇÃO 1.1.4.3.4] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.4.3.4.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Status de Uso</label>
                                {/* [SEÇÃO 1.1.4.3.4.2] .admin-form-select — <select> */}
                                <select
                                    name="status"
                                    className="admin-form-select"
                                    defaultValue={modalConfig.data?.status || 'disponivel'}
                                >
                                    <option value="disponivel">Disponível</option>
                                    <option value="manutencao_preventiva">Em Manutenção Preventiva</option>
                                    <option value="indisponivel">Indisponível</option>
                                </select>
                            </div>
                            {/* [SEÇÃO 1.1.4.3.5] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.4.3.5.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Descrição e Capacidade</label>
                                {/* [SEÇÃO 1.1.4.3.5.2] .admin-form-textarea — <textarea> */}
                                <textarea
                                    name="description"
                                    rows="3"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.description || ''}
                                    placeholder="Especificações de lentes, aumento e uso..."
                                />
                            </div>
                            {/* [SEÇÃO 1.1.4.3.6] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.4.3.6.1] .admin-btn-cancel — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancelar
                                </button>
                                {/* [SEÇÃO 1.1.4.3.6.2] .admin-btn-submit — <button> */}
                                <button
                                    type="submit"
                                    className="admin-btn-submit"
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Salvando...' : 'Salvar Equipamento'}
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
