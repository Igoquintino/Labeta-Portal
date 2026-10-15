import { useState } from 'react';
import { Calendar, Clock, ShieldCheck, Microscope, CheckCircle, ExternalLink, HelpCircle, Plus, Edit2, Trash2, Settings } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import equipmentData from '../data/equipment.json';
import './Booking.css';

export function Booking() {
    const { isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('catalogo'); // 'catalogo' | 'agenda'
    const [selectedEquipment, setSelectedEquipment] = useState(null);

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
                            Catálogo de Equipamentos ({equipmentData.length})
                        </button>
                        <button
                            type="button"
                            className={`booking-tab-btn ${activeTab === 'agenda' ? 'active' : ''}`}
                            onClick={() => setActiveTab('agenda')}
                        >
                            <Clock size={16} />
                            Consultar Agenda & Reservar
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
                                onClick={() => alert("Abrir modal: Cadastrar Novo Equipamento")}
                            >
                                <Plus size={16} /> Novo Equipamento
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="admin-btn-primary"
                                onClick={() => alert("Abrir modal: Configurar Links da Agenda e Formulário")}
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
                                    <article key={eq.id} className="equipment-card" style={{ position: 'relative' }}>
                                        
                                        {/* Botões de Ação do Card (Admin) */}
                                        {isAdmin && (
                                            <div className="card-admin-actions">
                                                <button 
                                                    type="button" 
                                                    className="admin-action-btn edit" 
                                                    title={`Editar: ${eq.name}`}
                                                    onClick={() => alert(`Editar equipamento: ${eq.name}`)}
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="admin-action-btn delete" 
                                                    title={`Excluir: ${eq.name}`}
                                                    onClick={() => alert(`Excluir equipamento ID: ${eq.id}`)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="equipment-card-header">
                                            <div className="equipment-meta">
                                                <span className="equipment-category">{eq.category}</span>
                                                <span className="equipment-code">{eq.code}</span>
                                            </div>
                                            <span className={`status-tag ${isAvailable ? 'tag-available' : 'tag-maintenance'}`}>
                                                {isAvailable ? 'Disponível' : 'Manutenção'}
                                            </span>
                                        </div>

                                        <h2 className="equipment-name">{eq.name}</h2>
                                        <p className="equipment-desc">{eq.description}</p>

                                        <div className="capacity-info">
                                            <span className="capacity-label">Capacidade:</span>
                                            <span className="capacity-value">{eq.capacity}</span>
                                        </div>

                                        <div className="requirements-box">
                                            <span className="requirements-title">Critérios & Requisitos:</span>
                                            <ul className="requirements-list">
                                                {eq.requirements.map((req, idx) => (
                                                    <li key={idx} className="requirement-item">
                                                        <CheckCircle size={13} className="req-icon" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button
                                            type="button"
                                            className="select-reserve-btn"
                                            disabled={!isAvailable}
                                            onClick={() => {
                                                setSelectedEquipment(eq);
                                                setActiveTab('agenda');
                                            }}
                                        >
                                            {isAvailable ? 'Reservar este Equipamento' : 'Indisponível no Momento'}
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Conteúdo da Aba: Consulta de Agenda e Solicitação */}
                {activeTab === 'agenda' && (
                    <section className="schedule-section" aria-label="Painel de Agendamento e Horários">

                        {selectedEquipment && (
                            <div className="selected-equipment-alert">
                                <span>Equipamento selecionado: <strong>{selectedEquipment.name}</strong> ({selectedEquipment.code})</span>
                                <button
                                    type="button"
                                    className="clear-selection-btn"
                                    onClick={() => setSelectedEquipment(null)}
                                >
                                    Trocar equipamento
                                </button>
                            </div>
                        )}

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

            </div>
        </main>
    );
}
