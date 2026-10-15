import { Link } from 'react-router-dom';
import { Microscope, Layers, ShieldCheck, Check, ArrowRight, MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import labData from '../data/labFacilities.json';
import './Lab.css';

export function Lab() {
    const { isAdmin } = useAuth();

    return (
        <main className="lab-page" id="main-content">
            <div className="lab-container">

                {/* Cabeçalho da Página */}
                <header className="lab-header">
                    <div className="lab-badge">
                        <Microscope size={16} aria-hidden="true" />
                        <span>Infraestrutura Física</span>
                    </div>
                    <h1 className="lab-title">O Laboratório & Práticas Científicas</h1>
                    <p className="lab-subtitle">
                        Conheça os espaços analíticos, a tecnologia de microscopia instalada e o fluxo metodológico rigoroso de pesquisas no LABETA / UFOPA.
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
                            onClick={() => alert("Abrir modal: Cadastrar Novo Espaço / Equipamento")}
                        >
                            <Plus size={16} /> Novo Espaço / Equipamento
                        </button>
                        <button 
                            type="button" 
                            className="admin-btn-primary"
                            onClick={() => alert("Abrir modal: Adicionar Etapa Metodológica")}
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
                                <article key={space.id} className="space-card" style={{ position: 'relative' }}>
                                    
                                    {/* Botões de Ação do Card de Espaço (Admin) */}
                                    {isAdmin && (
                                        <div className="card-admin-actions">
                                            <button 
                                                type="button" 
                                                className="admin-action-btn edit" 
                                                title={`Editar: ${space.title}`}
                                                onClick={() => alert(`Editar espaço: ${space.title}`)}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                type="button" 
                                                className="admin-action-btn delete" 
                                                title={`Excluir: ${space.title}`}
                                                onClick={() => alert(`Excluir espaço ID: ${space.id}`)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-card-top">
                                        <span className="space-tag">{space.tag}</span>
                                        <h3 className="space-title">{space.title}</h3>
                                    </div>

                                    <p className="space-description">{space.description}</p>

                                    <div className="equipment-block">
                                        <span className="equipment-label">Equipamentos & Recursos:</span>
                                        <ul className="equipment-list">
                                            {space.equipment.map((item, idx) => (
                                                <li key={idx} className="equipment-item">
                                                    <Check size={14} className="check-icon" aria-hidden="true" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Coluna 2: Protocolos Metodológicos & Rotina de Pesquisa */}
                    <section className="protocols-column" aria-label="Protocolos Metodológicos e Rotina">
                        <div className="column-header">
                            <ShieldCheck size={20} className="column-icon" aria-hidden="true" />
                            <div>
                                <h2 className="column-title">Rotina Metodológica</h2>
                                <p className="column-desc">Etapas padronizadas para pesquisa ficológica e taxonômica.</p>
                            </div>
                        </div>

                        <div className="timeline-wrapper">
                            {labData.protocols.map((proto) => (
                                <article key={proto.step} className="protocol-step-card" style={{ position: 'relative' }}>
                                    
                                    {/* Botões de Ação da Etapa Metodológica (Admin) */}
                                    {isAdmin && (
                                        <div className="card-admin-actions">
                                            <button 
                                                type="button" 
                                                className="admin-action-btn edit" 
                                                title={`Editar etapa: ${proto.name}`}
                                                onClick={() => alert(`Editar protocolo: ${proto.name}`)}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                type="button" 
                                                className="admin-action-btn delete" 
                                                title={`Excluir etapa: ${proto.name}`}
                                                onClick={() => alert(`Excluir protocolo etapa: ${proto.step}`)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="step-number-badge">{proto.step}</div>
                                    <div className="step-content">
                                        <h3 className="step-title">{proto.name}</h3>
                                        <p className="step-details">{proto.details}</p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Caixa Informativa sobre Agendamento */}
                        <aside className="booking-cta-box" aria-label="Aviso de Agendamento">
                            <h3 className="cta-box-title">Uso Acadêmico dos Equipamentos</h3>
                            <p className="cta-box-text">
                                O acesso aos microscópios ópticos, lupas e estufas é exclusivo para a comunidade acadêmica vinculada e requer solicitação prévia via Portal de Agendamento.
                            </p>
                            <Link to="/agendamento" className="cta-box-link">
                                <span>Ver Disponibilidade & Agendar</span>
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </aside>
                    </section>

                </div>

            </div>
        </main>
    );
}
