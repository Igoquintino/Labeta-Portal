/* ============================================================
 * [COMPONENTE] RulesSection
 * Descrição: Normas de biossegurança e EPIs em acordeão (<details>/<summary>).
 * Rota/Uso: Home (/).
 * Dados: lista interna de regras
 * CSS correlato: RulesSection.css
 * ============================================================ */
import { ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import './RulesSection.css';

/** [FUNÇÃO] RulesSection — renderiza o acordeão de regras do laboratório. */
export function RulesSection() {
    return (
        /* [SEÇÃO 1] .rules-section — <section> */
        <section className="rules-section" aria-labelledby="rules-title">
            {/* [SEÇÃO 1.1] .rules-container — <div> */}
            <div className="rules-container">

                {/* [SEÇÃO 1.1.1] .rules-header — <header> */}
                <header className="rules-header">
                    {/* [SEÇÃO 1.1.1.1] .rules-badge — <div> */}
                    <div className="rules-badge">
                        <ShieldAlert size={18} aria-hidden="true" />
                        <span>Normas e Conduta</span>
                    </div>
                    {/* [SEÇÃO 1.1.1.2] .rules-title — <h2> */}
                    <h2 id="rules-title" className="rules-title">Regras do Laboratório &amp; Biossegurança</h2>
                    {/* [SEÇÃO 1.1.1.3] .rules-subtitle — <p> */}
                    <p className="rules-subtitle">
                        Diretrizes inegociáveis para permanência e uso dos espaços e equipamentos do LABETA.
                    </p>
                </header>

                {/* [SEÇÃO 1.1.2] .rules-grid — <div> */}
                <div className="rules-grid">
                    {/* Regra 1: Processos de Oxidação e Químicos (Inicia aberta por ser prioritária) */}
                    {/* [SEÇÃO 1.1.2.1] .rule-card — <details> */}
                    <details className="rule-card" open>
                        {/* [SEÇÃO 1.1.2.1.1] .rule-summary — <summary> */}
                        <summary className="rule-summary">
                            {/* [SEÇÃO 1.1.2.1.1.1] .rule-icon-box .danger — <span> */}
                            <span className="rule-icon-box danger">
                                <AlertTriangle size={20} aria-hidden="true" />
                            </span>
                            {/* [SEÇÃO 1.1.2.1.1.2] .rule-name — <h3> */}
                            <h3 className="rule-name">1. EPIs Obrigatórios em Processos de Oxidação</h3>
                        </summary>
                        {/* [SEÇÃO 1.1.2.1.2] .rule-body — <div> */}
                        <div className="rule-body">
                            <p>
                                Durante qualquer procedimento de <strong>oxidação de amostras</strong> ou manipulação de reagentes químicos, é estritamente obrigatório o uso conjunto de:
                            </p>
                            {/* [SEÇÃO 1.1.2.1.2.2] .rule-list — <ul> */}
                            <ul className="rule-list">
                                <li>Jaleco de manga longa e calça comprida;</li>
                                <li>Calçado 100% fechado (tênis ou bota apropriada);</li>
                                <li>Luvas de proteção (látex ou nitrílica);</li>
                                <li>Máscara de proteção respiratória adequada.</li>
                            </ul>
                        </div>
                    </details>

                    {/* Regra 2: Higienização Pós-Uso */}
                    {/* [SEÇÃO 1.1.2.2] .rule-card — <details> */}
                    <details className="rule-card">
                        {/* [SEÇÃO 1.1.2.2.1] .rule-summary — <summary> */}
                        <summary className="rule-summary">
                            {/* [SEÇÃO 1.1.2.2.1.1] .rule-icon-box .warning — <span> */}
                            <span className="rule-icon-box warning">
                                <Sparkles size={20} aria-hidden="true" />
                            </span>
                            {/* [SEÇÃO 1.1.2.2.1.2] .rule-name — <h3> */}
                            <h3 className="rule-name">2. Limpeza Mandatória de Vidrarias e Utensílios</h3>
                        </summary>
                        {/* [SEÇÃO 1.1.2.2.2] .rule-body — <div> */}
                        <div className="rule-body">
                            <p>
                                É mandatório <strong>lavar e descontaminar todos os utensílios, lâminas e vidrarias imediatamente após o uso</strong>. Não é permitido deixar material sujo na bancada, prevenindo contaminação cruzada em pesquisas posteriores e danos ao patrimônio.
                            </p>
                        </div>
                    </details>

                    {/* Regra 3: Postura e Acesso */}
                    {/* [SEÇÃO 1.1.2.3] .rule-card — <details> */}
                    <details className="rule-card">
                        {/* [SEÇÃO 1.1.2.3.1] .rule-summary — <summary> */}
                        <summary className="rule-summary">
                            {/* [SEÇÃO 1.1.2.3.1.1] .rule-icon-box .neutral — <span> */}
                            <span className="rule-icon-box neutral">
                                <ShieldAlert size={20} aria-hidden="true" />
                            </span>
                            {/* [SEÇÃO 1.1.2.3.1.2] .rule-name — <h3> */}
                            <h3 className="rule-name">3. Postura e Acesso aos Equipamentos</h3>
                        </summary>
                        {/* [SEÇÃO 1.1.2.3.2] .rule-body — <div> */}
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
