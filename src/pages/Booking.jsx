/* ============================================================
 * [COMPONENTE] Booking
 * Descrição: Portal de agendamento: catálogo de equipamentos, agenda e formulário (restrito à comunidade UFOPA).
 *            Possui integração reativa com Supabase e contingência automática via equipment.json.
 * Rota/Uso: Rota /agendamento.
 * Dados: Supabase ('equipment') com fallback em src/data/equipment.json via equipmentService.
 * CSS correlato: Booking.css
 * ============================================================ */
import { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, ShieldCheck, Microscope, CheckCircle, ExternalLink, Plus, Settings, List, Globe } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useModalState } from '../hooks/useModalState';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { PageHeader } from '../components/common/PageHeader';
import { FilterTabs } from '../components/common/FilterTabs';
import { Badge } from '../components/common/Badge';
import { CardAdminActions } from '../components/common/CardAdminActions';
import { DeleteConfirmDialog } from '../components/common/DeleteConfirmDialog';
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
    // [ESTADO] calendarMode — modo de visualização do Google Agenda: 'MONTH' | 'AGENDA'
    const [calendarMode, setCalendarMode] = useState(() => (
        typeof window !== 'undefined' && window.innerWidth < 768 ? 'AGENDA' : 'MONTH'
    ));
    // [ESTADO] selectedEquipment — equipamento selecionado para solicitação
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    // [HOOK] useModalState — controle de estado de modais e toasts
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

    const bookingTabs = useMemo(() => [
        { id: 'catalogo', label: `Catálogo de Recursos (${equipmentList.length})`, icon: Microscope },
        { id: 'agenda', label: 'Agenda e Solicitação', icon: Calendar }
    ], [equipmentList.length]);

    /** [FUNÇÃO] handleConfirmDelete — remove o equipamento e atualiza o estado */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setIsSubmitting(true);
        const item = modalConfig.data;
        const { error } = await deleteEquipment(item.id);

        if (error) {
            showToast(`Erro ao remover equipamento: ${error.message}`, 'error');
        } else {
            setEquipmentList((prev) => prev.filter((eq) => eq.id !== item.id));
            showToast('Equipamento removido do catálogo!', 'success');
            closeModal();
        }
        setIsSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — trata cadastro, edição e configs */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const isConfig = modalConfig.type === 'config';
        const isEdit = modalConfig.type === 'edit';

        if (isConfig) {
            showToast('Configurações de integração atualizadas!', 'info');
            closeModal();
            setIsSubmitting(false);
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
                showToast(`Falha ao atualizar equipamento: ${error.message}`, 'error');
            } else {
                const updated = data || { id: currentId, ...payload };
                setEquipmentList((prev) => prev.map((eq) => (eq.id === currentId ? updated : eq)));
                showToast('Equipamento atualizado com sucesso!', 'success');
                closeModal();
            }
        } else {
            const { data, error } = await createEquipment(payload);
            if (error) {
                showToast(`Falha ao cadastrar equipamento: ${error.message}`, 'error');
            } else {
                const created = data || { id: `local-${Date.now()}`, ...payload };
                setEquipmentList((prev) => [...prev, created]);
                showToast('Equipamento cadastrado com sucesso!', 'success');
                closeModal();
            }
        }

        setIsSubmitting(false);
    };

    return (
        /* [SEÇÃO 1] .booking-page — <main> */
        <main className="booking-page" id="main-content">
            {/* [SEÇÃO 1.1] .booking-container — <div> */}
            <div className="booking-container">

                {/* Cabeçalho da Página com PageHeader Reutilizável */}
                <PageHeader
                    badgeIcon={Calendar}
                    badgeText="Acesso Acadêmico"
                    title="Portal de Agendamento do LABETA"
                    subtitle="Ambiente exclusivo para solicitação de uso de microscópios, bancadas e equipamentos analíticos vinculados às pesquisas científicas da UFOPA."
                >
                    {/* Banner de Restrição Institucional */}
                    <aside className="restriction-banner" role="alert">
                        <div className="restriction-icon-box">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="restriction-text">
                            <strong className="restriction-title">Aviso de Elegibilidade de Uso:</strong>
                            <p className="restriction-desc">
                                O uso da infraestrutura analítica é restrito a docentes, discentes e colaboradores em projetos formais de pesquisa cadastrados na UFOPA. Solicitações externas necessitam de autorização prévia da coordenação do laboratório.
                            </p>
                        </div>
                    </aside>

                    {/* Navegação entre Abas com FilterTabs */}
                    <FilterTabs
                        tabs={bookingTabs}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                </PageHeader>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    <div className="admin-toolbar" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        {activeTab === 'catalogo' ? (
                            <button
                                type="button"
                                className="admin-btn-primary"
                                onClick={() => openCreate('Cadastrar Novo Equipamento Analítico', 'create')}
                            >
                                <Plus size={16} /> Novo Equipamento
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="admin-btn-primary"
                                onClick={() => openCreate('Configurações de Agenda e Formulário', 'config')}
                            >
                                <Settings size={16} /> Configurar Agenda / Formulário
                            </button>
                        )}
                    </div>
                )}

                {/* ABA 1: Catálogo de Recursos e Equipamentos */}
                {activeTab === 'catalogo' && (
                    <section className="equipment-catalog-section" aria-label="Catálogo de Recursos">
                        <div className="section-intro">
                            <h2 className="section-heading">Equipamentos e Bancadas Disponíveis</h2>
                            <p className="section-lead">
                                Consulte as especificações técnicas, exigências de biossegurança e capacidade por turno antes de formalizar sua solicitação.
                            </p>
                        </div>

                        <div className="equipment-grid">
                            {loadingEquipment ? (
                                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>Carregando catálogo de equipamentos...</p>
                            ) : equipmentList.map((eq) => (
                                <article key={eq.id} className="equipment-card">
                                    {/* Barra de Ações Administrativas do Card */}
                                    {isAdmin && (
                                        <CardAdminActions
                                            onEdit={() => openEdit(`Editar: ${eq.name}`, 'edit', eq)}
                                            onDelete={() => openDelete('Confirmar Remoção de Equipamento', eq)}
                                            editTitle="Editar equipamento"
                                            deleteTitle="Excluir equipamento"
                                        />
                                    )}

                                    <div className="equipment-header">
                                        <div>
                                            <Badge variant="subtle" size="sm" className="equipment-category-tag">
                                                {eq.category}
                                            </Badge>
                                            <h3 className="equipment-name">{eq.name}</h3>
                                        </div>
                                        <span className="equipment-code">{eq.code}</span>
                                    </div>

                                    <div className="equipment-status-row">
                                        <Badge
                                            variant={
                                                eq.status === 'disponivel'
                                                    ? 'emerald'
                                                    : eq.status === 'manutencao_preventiva'
                                                    ? 'gold'
                                                    : 'danger'
                                            }
                                        >
                                            <span className="status-dot" aria-hidden="true" />
                                            {eq.status === 'disponivel' && 'Disponível'}
                                            {eq.status === 'manutencao_preventiva' && 'Manutenção Preventiva'}
                                            {eq.status === 'indisponivel' && 'Indisponível'}
                                        </Badge>
                                        <span className="equipment-capacity">
                                            <Clock size={12} />
                                            {eq.capacity}
                                        </span>
                                    </div>

                                    <p className="equipment-description">{eq.description}</p>

                                    <div className="equipment-requirements-box">
                                        <span className="requirements-label">Requisitos e Cuidados Específicos:</span>
                                        <ul className="requirements-list">
                                            {Array.isArray(eq.requirements) && eq.requirements.map((req, idx) => (
                                                <li key={idx} className="requirement-item">
                                                    <CheckCircle size={13} className="req-check-icon" aria-hidden="true" />
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="equipment-card-footer">
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
                    <section className="booking-agenda-section" aria-label="Agenda e Formulário de Solicitação">
                        {/* Guia Visual de Turnos de Bancada */}
                        <div className="shifts-guide-panel">
                            <div className="shift-card">
                                <div className="shift-header">
                                    <span className="shift-badge morning">Manhã</span>
                                    <span className="shift-hours">08:00 – 12:00</span>
                                </div>
                                <p className="shift-desc">Preferencial para triagem de fitoplâncton fresco e preparo inicial de lâminas.</p>
                            </div>
                            <div className="shift-card">
                                <div className="shift-header">
                                    <span className="shift-badge afternoon">Tarde</span>
                                    <span className="shift-hours">14:00 – 18:00</span>
                                </div>
                                <p className="shift-desc">Sessões contínuas de microscopia óptica, micrometria e análise taxonômica.</p>
                            </div>
                            <div className="shift-card">
                                <div className="shift-header">
                                    <span className="shift-badge night">Especial</span>
                                    <span className="shift-hours">18:00 – 21:00</span>
                                </div>
                                <p className="shift-desc">Exclusivo para pós-graduação e projetos em regime de amostragem intensiva.</p>
                            </div>
                        </div>

                        <div className="agenda-grid">

                            {/* Coluna 1: Visualização de Disponibilidade */}
                            <article className="agenda-calendar-col">
                                <div className="col-header">
                                    <div className="col-icon-box">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h2 className="col-title">Disponibilidade do Laboratório</h2>
                                        <p className="col-desc">Consulte horários e bancadas ocupadas antes de enviar a proposta.</p>
                                    </div>
                                </div>

                                {/* Barra de Controles e Alternância de Visualização */}
                                <div className="calendar-controls-bar">
                                    <div className="calendar-mode-toggle" role="group" aria-label="Modo de visualização do calendário">
                                        <button
                                            type="button"
                                            className={`calendar-mode-btn ${calendarMode === 'MONTH' ? 'active' : ''}`}
                                            onClick={() => setCalendarMode('MONTH')}
                                            aria-pressed={calendarMode === 'MONTH'}
                                        >
                                            <Calendar size={13} aria-hidden="true" />
                                            <span>Visão Mensal</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`calendar-mode-btn ${calendarMode === 'AGENDA' ? 'active' : ''}`}
                                            onClick={() => setCalendarMode('AGENDA')}
                                            aria-pressed={calendarMode === 'AGENDA'}
                                        >
                                            <List size={13} aria-hidden="true" />
                                            <span>Lista / Agenda</span>
                                        </button>
                                    </div>

                                    <span className="calendar-tz-badge" title="Fuso horário oficial do laboratório">
                                        <Globe size={11} aria-hidden="true" />
                                        <span>Santarém (UTC-3)</span>
                                    </span>
                                </div>

                                <div className="calendar-embed-container">
                                    <iframe
                                        src={`https://calendar.google.com/calendar/embed?src=pt.brazilian%23holiday%40group.v.calendar.google.com&ctz=America%2FSantarem&mode=${calendarMode}&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&bgcolor=%2314241B`}
                                        title="Agenda Oficial de Ocupação e Reservas do LABETA"
                                        className="google-calendar-iframe"
                                        frameBorder="0"
                                        scrolling="no"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="calendar-footer-hint">
                                    <a
                                        href="https://calendar.google.com/calendar/embed?src=pt.brazilian%23holiday%40group.v.calendar.google.com&ctz=America%2FSantarem"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="calendar-direct-link"
                                        title="Abrir Google Agenda oficial em nova aba"
                                    >
                                        <span>Abrir no Google Agenda</span>
                                        <ExternalLink size={12} aria-hidden="true" />
                                    </a>
                                </div>
                            </article>

                            {/* Coluna 2: Formulário de Solicitação */}
                            <article className="agenda-form-col">
                                <div className="col-header">
                                    <div className="col-icon-box">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h2 className="col-title">Submissão de Agendamento</h2>
                                        <p className="col-desc">Preencha o formulário acadêmico formal para análise da coordenação.</p>
                                    </div>
                                </div>

                                <div className="form-embed-container">
                                    <div className="form-notice">
                                        <h3 className="form-notice-title">Formulário Oficial de Reserva</h3>
                                        <p>
                                            O agendamento de recursos é realizado via Google Formulários institucional da UFOPA para registro auditável das atividades práticas.
                                        </p>
                                        {selectedEquipment && (
                                            <div style={{ marginTop: '0.85rem', padding: '0.6rem 0.85rem', background: 'var(--status-available-bg)', border: '1px solid var(--accent-chlorophyll)', borderRadius: '6px', fontSize: 'var(--font-sm)', color: 'var(--status-available-text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span>Recurso pré-selecionado: <strong>{selectedEquipment}</strong></span>
                                                <button type="button" onClick={() => setSelectedEquipment(null)} style={{ background: 'none', border: 'none', color: 'var(--color-danger-300, #fc8181)', cursor: 'pointer', fontSize: 'var(--font-xs)', textDecoration: 'underline' }}>Remover seleção</button>
                                            </div>
                                        )}
                                    </div>

                                    <ol className="booking-steps-list">
                                        <li className="booking-step-item">
                                            <strong>01.</strong> Selecione os dias e turnos verificando a disponibilidade na agenda ao lado.
                                        </li>
                                        <li className="booking-step-item">
                                            <strong>02.</strong> Indique o orientador responsável e o número do processo ou projeto formal.
                                        </li>
                                        <li className="booking-step-item">
                                            <strong>03.</strong> Aguarde o e-mail de homologação emitido pela equipe técnica do laboratório.
                                        </li>
                                    </ol>

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
                        <DeleteConfirmDialog
                            itemName={modalConfig.data?.name || 'este equipamento'}
                            itemType="equipamento"
                            onConfirm={handleConfirmDelete}
                            onCancel={closeModal}
                            isDeleting={isSubmitting}
                        />
                    ) : modalConfig.type === 'config' ? (
                        <form onSubmit={handleFormSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">URL Embed do Google Calendar</label>
                                <input
                                    name="calendarUrl"
                                    type="url"
                                    required
                                    className="admin-form-input"
                                    defaultValue="https://calendar.google.com/calendar/embed?..."
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Link do Google Formulários</label>
                                <input
                                    name="formUrl"
                                    type="url"
                                    required
                                    className="admin-form-input"
                                    defaultValue="https://forms.google.com"
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
                                    Salvar Configurações
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Nome do Equipamento</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.name || ''}
                                    placeholder="Ex.: Microscópio Óptico Trinocular..."
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Código Patrimonial / Sigla</label>
                                <input
                                    name="code"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.code || ''}
                                    placeholder="Ex.: LABETA-MIC-01"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Categoria</label>
                                <input
                                    name="category"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.category || ''}
                                    placeholder="Ex.: Microscopia, Bancada, Esterilização..."
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Status de Uso</label>
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
                            <div className="admin-form-group">
                                <label className="admin-form-label">Descrição e Capacidade</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.description || ''}
                                    placeholder="Especificações de lentes, aumento e uso..."
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
                                    {isSubmitting ? 'Salvando...' : 'Salvar Equipamento'}
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
