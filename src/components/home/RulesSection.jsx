import { ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import './RulesSection.css';

export function RulesSection() {
    return (
        <section className="rules-section" aria-labelledby="rules-title">
            <div className="rules-container">

                <header className="rules-header">
                    <div className="rules-badge">
                        <ShieldAlert size={18} aria-hidden="true" />
                        <span>Normas e Conduta</span>
                    </div>
                    <h2 id="rules-title" className="rules-title">Regras do Laboratório &amp; Biossegurança</h2>
                    <p className="rules-subtitle">
                        Diretrizes inegociáveis para permanência e uso dos espaços e equipamentos do LABETA.
                    </p>
                </header>

                <div className="rules-grid">
                    {/* Regra 1: Processos de Oxidação e Químicos (Inicia aberta por ser prioritária) */}
                    <details className="rule-card" open>
                        <summary className="rule-summary">
                            <span className="rule-icon-box danger">
                                <AlertTriangle size={20} aria-hidden="true" />
                            </span>
                            <h3 className="rule-name">1. EPIs Obrigatórios em Processos de Oxidação</h3>
                        </summary>
                        <div className="rule-body">
                            <p>
                                Durante qualquer procedimento de <strong>oxidação de amostras</strong> ou manipulação de reagentes químicos, é estritamente obrigatório o uso conjunto de:
                            </p>
                            <ul className="rule-list">
                                <li>Jaleco de manga longa e calça comprida;</li>
                                <li>Calçado 100% fechado (tênis ou bota apropriada);</li>
                                <li>Luvas de proteção (látex ou nitrílica);</li>
                                <li>Máscara de proteção respiratória adequada.</li>
                            </ul>
                        </div>
                    </details>

                    {/* Regra 2: Higienização Pós-Uso */}
                    <details className="rule-card">
                        <summary className="rule-summary">
                            <span className="rule-icon-box warning">
                                <Sparkles size={20} aria-hidden="true" />
                            </span>
                            <h3 className="rule-name">2. Limpeza Mandatória de Vidrarias e Utensílios</h3>
                        </summary>
                        <div className="rule-body">
                            <p>
                                É mandatório <strong>lavar e descontaminar todos os utensílios, lâminas e vidrarias imediatamente após o uso</strong>. Não é permitido deixar material sujo na bancada, prevenindo contaminação cruzada em pesquisas posteriores e danos ao patrimônio.
                            </p>
                        </div>
                    </details>

                    {/* Regra 3: Postura e Acesso */}
                    <details className="rule-card">
                        <summary className="rule-summary">
                            <span className="rule-icon-box neutral">
                                <ShieldAlert size={20} aria-hidden="true" />
                            </span>
                            <h3 className="rule-name">3. Postura e Acesso aos Equipamentos</h3>
                        </summary>
                        <div className="rule-body">
                            <p>
                                O ambiente do laboratório exige vestimenta compatível em tempo integral. O uso de microscópios, lupas e estufas é exclusivo a pesquisadores vinculados e com agendamento prévio confirmado.
                            </p>
                        </div>
                    </details>
                </div>

            </div>
        </section>
    );
}
