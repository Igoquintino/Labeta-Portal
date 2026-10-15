import { useState } from 'react';
import { Calendar, Clock, ShieldCheck, Microscope, CheckCircle, ExternalLink, HelpCircle, Plus, Edit2, Trash2, Settings } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { AdminModal } from '../components/admin/AdminModal';
import equipmentData from '../data/equipment.json';
import './Booking.css';

export function Booking() {
    const { isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('catalogo'); // 'catalogo' | 'agenda'
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null });

    const openCreateModal = () => {
        setModalConfig({
            isOpen: true,
            title: 'Cadastrar Novo Equipamento Analítico',
            type: 'create',
            data: null
        });
    };

    const openConfigModal = () => {
        setModalConfig({
            isOpen: true,
            title: 'Configurações de Agenda e Formulário',
            type: 'config',
            data: null
        });
    };

    const openEditModal = (eq) => {
        setModalConfig({
            isOpen: true,
            title: `Editar: ${eq.name}`,
            type: 'edit',
            data: eq
        });
    };

    const openDeleteModal = (eq) => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Remoção de Equipamento',
            type: 'delete',
            data: eq
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
        <main className="booking-page" id="main-content">
            <div className="booking-container">

                {/* Cabeçalho da Página */}
                <header className="booking-header">
                    <div className="booking-badge">
                        <Calendar size={16} />
                        <span>Acesso Acadêmico</span>
                    </div>
                    <h1 className="booking-title">Portal de Agendamento do LABETA</h1>
                    <p className="booking-subtitle">
                        Ambiente exclusivo para solicitação de uso de microscópios, bancadas e equipamentos analíticos vinculados às pesquisas científicas da UFOPA.
                    </p>

                    {/* Banner de Restrição Institucional */}
                    <aside className="restriction-banner" role="alert">
                        <div className="restriction-icon-box">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="restriction-text">
                            <strong>Acesso Restrito à Comunidade UFOPA</strong>
                            <p>
                                O uso das dependências e equipamentos é concedido apenas a docentes, discentes orientados e pesquisadores com projetos ativos cadastrados no LABETA. O agendamento deve ser realizado com antecedência mínima de 48 horas úteis.
                            </p>
                        </div>
                    </aside>

                    {/* Abas de Navegação do Portal */}
                    <nav className="booking-nav-tabs" aria-label="Navegação do Portal de Agendamento">
                        <button
                            type="button"
                            className={`booking-tab-btn ${activeTab === 'catalogo' ? 'active' : ''}`}
                            onClick={() => setActiveTab('catalogo')}
                        >
                            <Microscope size={16} />
                            <span>1. Catálogo de Equipamentos ({equipmentData.length})</span>
                        </button>
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
                    <div className="admin-toolbar" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        {activeTab === 'catalogo' ? (
                            <button
                                type="button"
                                className="admin-btn-primary"
                                onClick={openCreateModal}
                            >
                                <Plus size={16} /> Novo Equipamento
                            </button>
                        ) : (
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
                    <section className="equipment-catalog-section" aria-label="Catálogo de Equipamentos Disponíveis">
                        <div className="equipment-grid">
                            {equipmentData.map((eq) => {
                                const isAvailable = eq.status === 'disponivel';
                                return (
                                    <article key={eq.id} className="equipment-card">

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
                                                        title={`Editar: ${eq.name}`}
                                                        onClick={() => openEditModal(eq)}
                                                    >
                                                        <Edit2 size={13} />
                                                        <span>Editar</span>
                                                    </button>
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

                                        <div className="equipment-card-header">
                                            <div className="equipment-meta">
                                                <span className="equipment-category">{eq.category}</span>
                                                <span className="equipment-code">{eq.code}</span>
                                            </div>
                                            <span className={`status-badge ${isAvailable ? 'available' : 'maintenance'}`}>
                                                {isAvailable ? 'Disponível' : 'Em Manutenção'}
                                            </span>
                                        </div>

                                        <h2 className="equipment-name">{eq.name}</h2>
                                        <p className="equipment-desc">{eq.description}</p>

                                        <div className="specs-list">
                                            <div className="spec-row">
                                                <span className="spec-label">Capacidade Máxima:</span>
                                                <span className="spec-value">{eq.capacity}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Localização:</span>
                                                <span className="spec-value">{eq.location}</span>
                                            </div>
                                        </div>

                                        <div className="requirements-box">
                                            <span className="req-title">Requisitos de Biossegurança:</span>
                                            <ul className="req-list">
                                                {eq.requirements.map((req, idx) => (
                                                    <li key={idx} className="req-item">
                                                        <CheckCircle size={13} className="req-icon" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="equipment-card-footer">
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
                    <section className="schedule-section" aria-label="Painel de Agendamento e Horários">

                        {selectedEquipment && (
                            <div className="selected-equipment-alert">
                                <span>Equipamento pré-selecionado: <strong>{selectedEquipment.name}</strong> ({selectedEquipment.code})</span>
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
                        <div className="shifts-guide-panel" aria-label="Guia de Turnos de Bancada">
                            <div className="shift-card">
                                <div className="shift-header">
                                    <span className="shift-badge morning">Manhã</span>
                                    <span className="shift-hours">08:00 – 12:00</span>
                                </div>
                                <p className="shift-desc">Triagem, preparação e lavagem de amostras ficológicas.</p>
                            </div>
                            <div className="shift-card">
                                <div className="shift-header">
                                    <span className="shift-badge afternoon">Tarde</span>
                                    <span className="shift-hours">14:00 – 18:00</span>
                                </div>
                                <p className="shift-desc">Microscopia óptica avançada, contagem celular e capturas digitais.</p>
                            </div>
                            <div className="shift-card">
                                <div className="shift-header">
                                    <span className="shift-badge night">Noite</span>
                                    <span className="shift-hours">18:00 – 21:00</span>
                                </div>
                                <p className="shift-desc">Oxidação química, estufa e processos de longa duração (Pós-graduação).</p>
                            </div>
                        </div>

                        <div className="schedule-layout-grid">

                            {/* Calendário de Disponibilidade */}
                            <div className="calendar-panel">
                                <div className="panel-header">
                                    <Clock size={18} className="panel-icon" />
                                    <div>
                                        <h2 className="panel-title">1. Consultar Horários Ocupados</h2>
                                        <p className="panel-subtitle">Verifique no calendário abaixo os horários com reservas já confirmadas.</p>
                                    </div>
                                </div>

                                <div className="calendar-embed-container">
                                    <iframe
                                        src="https://calendar.google.com/calendar/embed?height=400&wkst=1&ctz=America%2FSao_Paulo&showPrint=0&color=%23165B33&color=%23D6C28F"
                                        className="calendar-iframe"
                                        width="100%"
                                        height="400"
                                        title="Google Agenda do LABETA - Horários de Bancada e Equipamentos"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="calendar-footer-hint">
                                    <span>Visualização otimizada para web. </span>
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
                            <div className="form-panel">
                                <div className="panel-header">
                                    <Calendar size={18} className="panel-icon" />
                                    <div>
                                        <h2 className="panel-title">2. Solicitar Reserva de Horário</h2>
                                        <p className="panel-subtitle">Preencha o formulário institucional com seus dados de pesquisa.</p>
                                    </div>
                                </div>

                                <div className="form-action-box">
                                    <div className="form-notice">
                                        <HelpCircle size={18} className="notice-icon" />
                                        <p>
                                            As solicitações são analisadas pela coordenação. Você receberá um e-mail com a confirmação e orientações para retirada da chave/acesso à sala.
                                        </p>
                                    </div>

                                    <ul className="booking-steps-list">
                                        <li><strong>Passo 1:</strong> Escolha um horário livre no calendário ao lado.</li>
                                        <li><strong>Passo 2:</strong> Tenha em mãos seu número de matrícula ou SIAPE da UFOPA.</li>
                                        <li><strong>Passo 3:</strong> Submeta o formulário de reserva para homologação.</li>
                                    </ul>

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
                        <div className="admin-delete-box">
                            <p className="admin-delete-notice">
                                Tem certeza de que deseja remover o equipamento <strong className="admin-delete-highlight">"{modalConfig.data?.name}"</strong>?
                            </p>
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                <button type="button" className="admin-btn-submit" style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={closeModal}>
                                    Confirmar Exclusão
                                </button>
                            </div>
                        </div>
                    ) : modalConfig.type === 'config' ? (
                        <form onSubmit={handleFormSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">URL Embed do Google Calendar</label>
                                <input
                                    type="url"
                                    required
                                    className="admin-form-input"
                                    defaultValue="https://calendar.google.com/calendar/embed?..."
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Link do Google Formulários</label>
                                <input
                                    type="url"
                                    required
                                    className="admin-form-input"
                                    defaultValue="https://forms.google.com"
                                />
                            </div>
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="admin-btn-submit">Salvar Configurações</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Nome do Equipamento</label>
                                <input
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
                                    type="text"
                                    required
                                    className="admin-form-input"
                                    defaultValue={modalConfig.data?.category || ''}
                                    placeholder="Ex.: Microscopia, Bancada, Esterilização..."
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Status de Uso</label>
                                <select className="admin-form-select" defaultValue={modalConfig.data?.status || 'disponivel'}>
                                    <option value="disponivel">Disponível</option>
                                    <option value="manutencao">Em Manutenção</option>
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Descrição e Capacidade</label>
                                <textarea
                                    rows="3"
                                    required
                                    className="admin-form-textarea"
                                    defaultValue={modalConfig.data?.description || ''}
                                    placeholder="Especificações de lentes, aumento e uso..."
                                />
                            </div>
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-cancel" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="admin-btn-submit">Salvar Equipamento</button>
                            </div>
                        </form>
                    )}
                </AdminModal>

            </div>
        </main>
    );
}
