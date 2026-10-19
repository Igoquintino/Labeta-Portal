/* ============================================================
 * [COMPONENTE] Lab
 * Descrição: Visão física do laboratório: espaços analíticos e rotina metodológica em 2 colunas.
 *            Possui integração reativa com Supabase e contingência automática via labFacilities.json.
 * Rota/Uso: Rota /laboratorio.
 * Dados: Supabase ('lab_spaces', 'lab_protocols') com fallback em src/data/labFacilities.json via labService.
 * CSS correlato: Lab.css
 * ============================================================ */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Microscope, Layers, ShieldCheck, Check, ArrowRight, MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { fetchLabFacilities, createLabSpace, updateLabSpace, deleteLabSpace, createLabProtocol, updateLabProtocol, deleteLabProtocol } from '../services/labService';
import './Lab.css';

/** [FUNÇÃO] Lab — renderiza espaços e passos do preparo ficológico. */
export function Lab() {
    const { isAdmin } = useAuth();
    // [ESTADO] spaces — lista de espaços analíticos
    const [spaces, setSpaces] = useState([]);
    // [ESTADO] protocols — lista de etapas metodológicas
    const [protocols, setProtocols] = useState([]);
    // [ESTADO] loadingLab — indicador de carregamento
    const [loadingLab, setLoadingLab] = useState(true);

    // [ESTADO] modalConfig — { isOpen, title, type, data } controla o AdminModal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });
    // [ESTADO] formSubmitting — envio de formulário em andamento
    const [formSubmitting, setFormSubmitting] = useState(false);
    // [ESTADO] toast — notificação de feedback temporário
    const [toast, setToast] = useState(null);

    /** [HOOK] useEffect — Carrega instalações do laboratório na montagem */
    useEffect(() => {
        let isMounted = true;
        async function load() {
            setLoadingLab(true);
            const data = await fetchLabFacilities();
            if (isMounted) {
                setSpaces(data.spaces);
                setProtocols(data.protocols);
                setLoadingLab(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, []);

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
        if (formSubmitting) return;
        setModalConfig({ isOpen: false, title: '', type: '', data: null });
    };

    /** [FUNÇÃO] handleConfirmDelete — remove o registro e atualiza o estado */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setFormSubmitting(true);
        const item = modalConfig.data;
        const isSpace = item.title !== undefined;

        if (isSpace) {
            const { error } = await deleteLabSpace(item.id);
            if (error) {
                setToast({ type: 'error', message: `Erro ao remover espaço: ${error.message}` });
            } else {
                setSpaces((prev) => prev.filter((s) => s.id !== item.id));
                setToast({ type: 'success', message: 'Espaço analítico removido!' });
                closeModal();
            }
        } else {
            const { error } = await deleteLabProtocol(item.id || item.step);
            if (error) {
                setToast({ type: 'error', message: `Erro ao remover protocolo: ${error.message}` });
            } else {
                setProtocols((prev) => prev.filter((p) => (p.id || p.step) !== (item.id || item.step)));
                setToast({ type: 'success', message: 'Etapa metodológica removida!' });
                closeModal();
            }
        }
        setFormSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — submissão de cadastro e alteração */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const isEdit = modalConfig.type.startsWith('edit_');
        const isSpace = modalConfig.type.includes('space');

        if (isSpace) {
            const payload = {
                title: formData.get('title'),
                tag: formData.get('tag') || modalConfig.data?.tag || 'Espaço Analítico',
                description: formData.get('description'),
                image: modalConfig.data?.image || '/placeholders/bancada.svg',
                equipment: modalConfig.data?.equipment || ['Bancadas e equipamentos de apoio']
            };

            if (isEdit) {
                const currentId = modalConfig.data.id;
                const { data, error } = await updateLabSpace(currentId, payload);
                if (error) {
                    setToast({ type: 'error', message: `Erro ao atualizar espaço: ${error.message}` });
                } else {
                    const updated = data || { id: currentId, ...payload };
                    setSpaces((prev) => prev.map((s) => (s.id === currentId ? updated : s)));
                    setToast({ type: 'success', message: 'Espaço analítico atualizado!' });
                    closeModal();
                }
            } else {
                const { data, error } = await createLabSpace(payload);
                if (error) {
                    setToast({ type: 'error', message: `Erro ao cadastrar espaço: ${error.message}` });
                } else {
                    const created = data || { id: `local-${Date.now()}`, ...payload };
                    setSpaces((prev) => [...prev, created]);
                    setToast({ type: 'success', message: 'Espaço analítico criado!' });
                    closeModal();
                }
            }
        } else {
            const payload = {
                step: formData.get('step') || modalConfig.data?.step || String(protocols.length + 1).padStart(2, '0'),
                name: formData.get('title'),
                details: formData.get('description')
            };

            if (isEdit) {
                const currentId = modalConfig.data.id || modalConfig.data.step;
                const { data, error } = await updateLabProtocol(currentId, payload);
                if (error) {
                    setToast({ type: 'error', message: `Erro ao atualizar protocolo: ${error.message}` });
                } else {
                    const updated = data || { id: currentId, ...payload };
                    setProtocols((prev) => prev.map((p) => ((p.id || p.step) === currentId ? updated : p)));
                    setToast({ type: 'success', message: 'Etapa metodológica atualizada!' });
                    closeModal();
                }
            } else {
                const { data, error } = await createLabProtocol(payload);
                if (error) {
                    setToast({ type: 'error', message: `Erro ao cadastrar etapa: ${error.message}` });
                } else {
                    const created = data || { id: `local-${Date.now()}`, ...payload };
                    setProtocols((prev) => [...prev, created]);
                    setToast({ type: 'success', message: 'Etapa metodológica adicionada!' });
                    closeModal();
                }
            }
        }

        setFormSubmitting(false);
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
                        <span>UFOPA – Unidade Tapajós, Bloco 09, sala 06 — Santarém, Pará</span>
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
                            <Plus size={16} /> Novo Espaço Analítico
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
                {/* [SEÇÃO 1.1.2] .lab-grid-columns — <div> */}
                <div className="lab-grid-columns">

                    {/* Coluna 1: Espaços e Instalações */}
                    {/* [SEÇÃO 1.1.2.1] .lab-col .spaces-col — <section> */}
                    <section className="lab-col spaces-col" aria-label="Espaços e Instalações Analíticas">
                        {/* [SEÇÃO 1.1.2.1.1] .col-header — <div> */}
                        <div className="col-header">
                            {/* [SEÇÃO 1.1.2.1.1.1] .col-header-icon .spaces-icon — <div> */}
                            <div className="col-header-icon spaces-icon">
                                <Microscope size={20} />
                            </div>
                            <div>
                                {/* [SEÇÃO 1.1.2.1.1.2.1] .col-title — <h2> */}
                                <h2 className="col-title">Espaços Analíticos</h2>
                                {/* [SEÇÃO 1.1.2.1.1.2.2] .col-desc — <p> */}
                                <p className="col-desc">Ambientes preparados com condições específicas de trabalho e segurança.</p>
                            </div>
                        </div>

                        {/* [SEÇÃO 1.1.2.1.2] .spaces-list — <div> */}
                        <div className="spaces-list">
                            {loadingLab ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Carregando infraestrutura...</p>
                            ) : spaces.map((space) => (
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
                                                    title="Editar espaço analítico"
                                                    onClick={() => openEditModal('space', space)}
                                                >
                                                    <Edit2 size={13} />
                                                    <span>Editar</span>
                                                </button>
                                                {/* [SEÇÃO 1.1.2.1.2.1.1.2.2] .admin-action-btn .delete — <button> */}
                                                <button
                                                    type="button"
                                                    className="admin-action-btn delete"
                                                    title="Excluir espaço"
                                                    onClick={() => openDeleteModal(space)}
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Excluir</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* [SEÇÃO 1.1.2.1.2.1.2] .space-image-wrapper — <div> */}
                                    <div className="space-image-wrapper">
                                        {/* [SEÇÃO 1.1.2.1.2.1.2.1] .space-img — <img> */}
                                        <img
                                            src={space.image}
                                            alt={space.title}
                                            className="space-img"
                                            loading="lazy"
                                        />
                                        {/* [SEÇÃO 1.1.2.1.2.1.2.2] .space-tag — <span className="space-tag"> */}
                                        <span className="space-tag">{space.tag}</span>
                                    </div>

                                    {/* [SEÇÃO 1.1.2.1.2.1.3] .space-body — <div> */}
                                    <div className="space-body">
                                        {/* [SEÇÃO 1.1.2.1.2.1.3.1] .space-title — <h3> */}
                                        <h3 className="space-title">{space.title}</h3>
                                        {/* [SEÇÃO 1.1.2.1.2.1.3.2] .space-description — <p> */}
                                        <p className="space-description">{space.description}</p>

                                        {/* [SEÇÃO 1.1.2.1.2.1.3.3] .space-equipment-section — <div> */}
                                        <div className="space-equipment-section">
                                            {/* [SEÇÃO 1.1.2.1.2.1.3.3.1] .equipment-label — <span className="equipment-label"> */}
                                            <span className="equipment-label">Equipamentos e recursos principais:</span>
                                            {/* [SEÇÃO 1.1.2.1.2.1.3.3.2] .equipment-list — <ul> */}
                                            <ul className="equipment-list">
                                                {Array.isArray(space.equipment) && space.equipment.map((item, idx) => (
                                                    /* [SEÇÃO 1.1.2.1.2.1.3.3.2.1] .equipment-item — <li> */
                                                    <li key={idx} className="equipment-item">
                                                        <Check size={14} className="check-icon" aria-hidden="true" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Coluna 2: Rotina Metodológica */}
                    {/* [SEÇÃO 1.1.2.2] .lab-col .protocols-col — <section> */}
                    <section className="lab-col protocols-col" aria-label="Rotina Metodológica e Procedimentos">
                        {/* [SEÇÃO 1.1.2.2.1] .col-header — <div> */}
                        <div className="col-header">
                            {/* [SEÇÃO 1.1.2.2.1.1] .col-header-icon .protocols-icon — <div> */}
                            <div className="col-header-icon protocols-icon">
                                <Layers size={20} />
                            </div>
                            <div>
                                {/* [SEÇÃO 1.1.2.2.1.2.1] .col-title — <h2> */}
                                <h2 className="col-title">Rotina Metodológica</h2>
                                {/* [SEÇÃO 1.1.2.2.1.2.2] .col-desc — <p> */}
                                <p className="col-desc">Passos analíticos padrão executados desde a coleta até o laudo florístico.</p>
                            </div>
                        </div>

                        {/* Linha do Tempo de Passos */}
                        {/* [SEÇÃO 1.1.2.2.2] .timeline-steps — <div> */}
                        <div className="timeline-steps">
                            {protocols.map((proto, index) => (
                                /* [SEÇÃO 1.1.2.2.2.1] .step-item — <article> */
                                <article key={proto.id || proto.step || index} className="step-item">
                                    {/* Barra de Ações Administrativas do Card */}
                                    {isAdmin && (
                                        /* [SEÇÃO 1.1.2.2.2.1.1] .card-admin-actions — <div> */
                                        <div className="card-admin-actions" style={{ marginBottom: '0.5rem' }}>
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
                                                    title="Editar etapa"
                                                    onClick={() => openEditModal('protocol', proto)}
                                                >
                                                    <Edit2 size={13} />
                                                    <span>Editar</span>
                                                </button>
                                                {/* [SEÇÃO 1.1.2.2.2.1.1.2.2] .admin-action-btn .delete — <button> */}
                                                <button
                                                    type="button"
                                                    className="admin-action-btn delete"
                                                    title="Excluir etapa"
                                                    onClick={() => openDeleteModal(proto)}
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Excluir</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* [SEÇÃO 1.1.2.2.2.1.2] .step-badge — <div> */}
                                    <div className="step-badge" aria-hidden="true">{proto.step}</div>
                                    {/* [SEÇÃO 1.1.2.2.2.1.3] .step-body — <div> */}
                                    <div className="step-body">
                                        {/* [SEÇÃO 1.1.2.2.2.1.3.1] .step-name — <h3> */}
                                        <h3 className="step-name">{proto.name}</h3>
                                        {/* [SEÇÃO 1.1.2.2.2.1.3.2] .step-details — <p> */}
                                        <p className="step-details">{proto.details}</p>
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
                                    {formSubmitting ? 'Excluindo...' : 'Confirmar Exclusão'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            {modalConfig.type.includes('protocol') && (
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Número da Etapa (Ex.: 01, 02...)</label>
                                    <input
                                        name="step"
                                        type="text"
                                        className="admin-form-input"
                                        defaultValue={modalConfig.data?.step || String(protocols.length + 1).padStart(2, '0')}
                                        placeholder="01"
                                    />
                                </div>
                            )}

                            {/* [SEÇÃO 1.1.3.2.1] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.1.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Nome / Título</label>
                                {/* [SEÇÃO 1.1.3.2.1.2] .admin-form-input — <input> */}
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.title || modalConfig.data?.name || ''}
                                    placeholder="Ex.: Sala de Microscopia Avançada ou Etapa..."
                                />
                            </div>

                            {modalConfig.type.includes('space') && (
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Selo / Tag de Destaque</label>
                                    <input
                                        name="tag"
                                        type="text"
                                        className="admin-form-input"
                                        defaultValue={modalConfig.data?.tag || 'Ambiente Controlado'}
                                        placeholder="Ex.: Uso Restrito & EPIs"
                                    />
                                </div>
                            )}

                            {/* [SEÇÃO 1.1.3.2.2] .admin-form-group — <div> */}
                            <div className="admin-form-group">
                                {/* [SEÇÃO 1.1.3.2.2.1] .admin-form-label — <label> */}
                                <label className="admin-form-label">Descrição</label>
                                {/* [SEÇÃO 1.1.3.2.2.2] .admin-form-textarea — <textarea> */}
                                <textarea
                                    name="description"
                                    rows="4"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.description || modalConfig.data?.details || ''}
                                    placeholder="Detalhes dos procedimentos ou equipamentos..."
                                />
                            </div>

                            {/* [SEÇÃO 1.1.3.2.3] .admin-form-actions — <div> */}
                            <div className="admin-form-actions">
                                {/* [SEÇÃO 1.1.3.2.3.1] .admin-btn-cancel — <button> */}
                                <button
                                    type="button"
                                    className="admin-btn-cancel"
                                    onClick={closeModal}
                                    disabled={formSubmitting}
                                >
                                    Cancelar
                                </button>
                                {/* [SEÇÃO 1.1.3.2.3.2] .admin-btn-submit — <button> */}
                                <button
                                    type="submit"
                                    className="admin-btn-submit"
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Salvando...' : 'Salvar Alterações'}
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
