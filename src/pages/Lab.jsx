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
import { Microscope, Layers, Check, ArrowRight, MapPin, Plus } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useModalState } from '../hooks/useModalState';
import { AdminModal } from '../components/admin/AdminModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { PageHeader } from '../components/common/PageHeader';
import { CardAdminActions } from '../components/common/CardAdminActions';
import { DeleteConfirmDialog } from '../components/common/DeleteConfirmDialog';
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

    // [HOOK] useModalState — controle centralizado de diálogos e notificações
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

    /** [FUNÇÃO] handleConfirmDelete — remove o registro e atualiza o estado */
    const handleConfirmDelete = async () => {
        if (!modalConfig.data) return;
        setIsSubmitting(true);
        const item = modalConfig.data;
        const isSpace = item.title !== undefined;

        if (isSpace) {
            const { error } = await deleteLabSpace(item.id);
            if (error) {
                showToast(`Erro ao remover espaço: ${error.message}`, 'error');
            } else {
                setSpaces((prev) => prev.filter((s) => s.id !== item.id));
                showToast('Espaço analítico removido!', 'success');
                closeModal();
            }
        } else {
            const { error } = await deleteLabProtocol(item.id || item.step);
            if (error) {
                showToast(`Erro ao remover protocolo: ${error.message}`, 'error');
            } else {
                setProtocols((prev) => prev.filter((p) => (p.id || p.step) !== (item.id || item.step)));
                showToast('Etapa metodológica removida!', 'success');
                closeModal();
            }
        }
        setIsSubmitting(false);
    };

    /** [FUNÇÃO] handleFormSubmit — submissão de cadastro e alteração */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const isSpace = modalConfig.type.includes('space');
        const isEdit = Boolean(modalConfig.data?.id || (modalConfig.data?.step && !isSpace));

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
                    showToast(`Erro ao atualizar espaço: ${error.message}`, 'error');
                } else {
                    const updated = data || { id: currentId, ...payload };
                    setSpaces((prev) => prev.map((s) => (s.id === currentId ? updated : s)));
                    showToast('Espaço analítico atualizado!', 'success');
                    closeModal();
                }
            } else {
                const { data, error } = await createLabSpace(payload);
                if (error) {
                    showToast(`Erro ao cadastrar espaço: ${error.message}`, 'error');
                } else {
                    const created = data || { id: `local-${Date.now()}`, ...payload };
                    setSpaces((prev) => [...prev, created]);
                    showToast('Espaço analítico criado!', 'success');
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
                    showToast(`Erro ao atualizar protocolo: ${error.message}`, 'error');
                } else {
                    const updated = data || { id: currentId, ...payload };
                    setProtocols((prev) => prev.map((p) => ((p.id || p.step) === currentId ? updated : p)));
                    showToast('Etapa metodológica atualizada!', 'success');
                    closeModal();
                }
            } else {
                const { data, error } = await createLabProtocol(payload);
                if (error) {
                    showToast(`Erro ao cadastrar etapa: ${error.message}`, 'error');
                } else {
                    const created = data || { id: `local-${Date.now()}`, ...payload };
                    setProtocols((prev) => [...prev, created]);
                    showToast('Etapa metodológica adicionada!', 'success');
                    closeModal();
                }
            }
        }

        setIsSubmitting(false);
    };

    return (
        /* [SEÇÃO 1] .lab-page — <main> */
        <main className="lab-page" id="main-content">
            {/* [SEÇÃO 1.1] .lab-container — <div> */}
            <div className="lab-container">

                {/* Cabeçalho da Página com PageHeader Reutilizável */}
                <PageHeader
                    badgeIcon={Microscope}
                    badgeText="Infraestrutura Científica"
                    title="O Laboratório"
                    subtitle="Conheça os espaços dedicados e as etapas metodológicas que compõem o cotidiano de pesquisa ficológica no oeste do Pará."
                >
                    <div className="lab-location-tag">
                        <MapPin size={14} aria-hidden="true" />
                        <span>UFOPA – Unidade Tapajós, Bloco 09, sala 06 — Santarém, Pará</span>
                    </div>
                </PageHeader>

                {/* Barra de Ações Administrativas (Visível apenas para administradores logados) */}
                {isAdmin && (
                    <div className="admin-toolbar" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreate('Cadastrar Novo Espaço Analítico', 'space')}
                        >
                            <Plus size={16} /> Novo Espaço Analítico
                        </button>
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => openCreate('Adicionar Etapa Metodológica', 'protocol')}
                        >
                            <Plus size={16} /> Nova Etapa / Protocolo
                        </button>
                    </div>
                )}

                {/* Layout em Duas Colunas */}
                <div className="lab-grid-columns">

                    {/* Coluna 1: Espaços e Instalações */}
                    <section className="lab-col spaces-col" aria-label="Espaços e Instalações Analíticas">
                        <div className="col-header">
                            <div className="col-header-icon spaces-icon">
                                <Microscope size={20} />
                            </div>
                            <div>
                                <h2 className="col-title">Espaços Analíticos</h2>
                                <p className="col-desc">Ambientes preparados com condições específicas de trabalho e segurança.</p>
                            </div>
                        </div>

                        <div className="spaces-list">
                            {loadingLab ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Carregando infraestrutura...</p>
                            ) : spaces.map((space) => (
                                <article key={space.id} className="space-card">
                                    {/* Barra de Ações Administrativas Reutilizável */}
                                    {isAdmin && (
                                        <CardAdminActions
                                            onEdit={() => openEdit(`Editar: ${space.title}`, 'space', space)}
                                            onDelete={() => openDelete('Confirmar Remoção', space)}
                                            editLabel="Editar espaço analítico"
                                            deleteLabel="Excluir espaço"
                                        />
                                    )}

                                    <div className="space-image-wrapper">
                                        <img
                                            src={space.image}
                                            alt={space.title}
                                            className="space-img"
                                            loading="lazy"
                                        />
                                        <span className="space-tag">{space.tag}</span>
                                    </div>

                                    <div className="space-body">
                                        <h3 className="space-title">{space.title}</h3>
                                        <p className="space-description">{space.description}</p>

                                        <div className="space-equipment-section">
                                            <span className="equipment-label">Equipamentos e recursos principais:</span>
                                            <ul className="equipment-list">
                                                {Array.isArray(space.equipment) && space.equipment.map((item, idx) => (
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
                    <section className="lab-col protocols-col" aria-label="Rotina Metodológica e Procedimentos">
                        <div className="col-header">
                            <div className="col-header-icon protocols-icon">
                                <Layers size={20} />
                            </div>
                            <div>
                                <h2 className="col-title">Rotina Metodológica</h2>
                                <p className="col-desc">Passos analíticos padrão executados desde a coleta até o laudo florístico.</p>
                            </div>
                        </div>

                        {/* Linha do Tempo de Passos */}
                        <div className="timeline-steps">
                            {protocols.map((proto, index) => (
                                <article key={proto.id || proto.step || index} className="step-item">
                                    {/* Barra de Ações Administrativas Reutilizável */}
                                    {isAdmin && (
                                        <CardAdminActions
                                            onEdit={() => openEdit(`Editar: ${proto.name}`, 'protocol', proto)}
                                            onDelete={() => openDelete('Confirmar Remoção', proto)}
                                            editLabel="Editar etapa metodológica"
                                            deleteLabel="Excluir etapa"
                                        />
                                    )}

                                    <div className="step-badge" aria-hidden="true">{proto.step}</div>
                                    <div className="step-body">
                                        <h3 className="step-name">{proto.name}</h3>
                                        <p className="step-details">{proto.details}</p>
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
                        <DeleteConfirmDialog
                            itemName={modalConfig.data?.title || modalConfig.data?.name || 'este registro'}
                            itemType="espaço / protocolo"
                            onConfirm={handleConfirmDelete}
                            onCancel={closeModal}
                            isDeleting={isSubmitting}
                        />
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

                            <div className="admin-form-group">
                                <label className="admin-form-label">Nome / Título</label>
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

                            <div className="admin-form-group">
                                <label className="admin-form-label">Descrição</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.description || modalConfig.data?.details || ''}
                                    placeholder="Detalhes dos procedimentos ou equipamentos..."
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
                                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
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
