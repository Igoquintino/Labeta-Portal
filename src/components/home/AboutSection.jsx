/* ============================================================
 * [COMPONENTE] AboutSection
 * Descrição: Bloco institucional "Sobre o LABETA" com divisor ondulado dourado.
 * Rota/Uso: Home (/).
 * Dados: nenhum
 * CSS correlato: AboutSection.css
 * ============================================================ */
import './AboutSection.css';

/** [FUNÇÃO] AboutSection — renderiza o texto institucional. */
export function AboutSection() {
    return (
        /* [SEÇÃO 1] .about-section — <section> */
        <section className="about-section" id="sobre" aria-labelledby="about-title">
            {/* [SEÇÃO 1.1] .about-container — <div> */}
            <div className="about-container">

                {/* [SEÇÃO 1.1.1] .about-header — <header> */}
                <header className="about-header">
                    {/* [SEÇÃO 1.1.1.1] .about-title — <h2> */}
                    <h2 id="about-title" className="about-title">Sobre o LABETA</h2>

                    {/* Ondulações fluviais orgânicas */}
                    {/* [SEÇÃO 1.1.1.2] .wavy-divider — <div> */}
                    <div className="wavy-divider" aria-hidden="true">
                        {/* [SEÇÃO 1.1.1.2.1] .wave-svg — <svg> */}
                        <svg viewBox="0 0 160 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="wave-svg">
                            <path d="M0 6 C40 0, 40 12, 80 6 C120 0, 120 12, 160 6" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M0 13 C40 7, 40 19, 80 13 C120 7, 120 19, 160 13" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
                        </svg>
                    </div>
                </header>

                {/* [SEÇÃO 1.1.2] .about-content — <div> */}
                <div className="about-content">
                    {/* [SEÇÃO 1.1.2.1] .about-lead — <p> */}
                    <p className="about-lead">
                        O <strong>Laboratório de Ecologia e Taxonomia de Algas (LABETA)</strong> da Universidade Federal do Oeste do Pará é um centro de referência dedicado à investigação da biodiversidade e dos processos funcionais de comunidades ficológicas nos ecossistemas aquáticos amazônicos.
                    </p>
                    {/* [SEÇÃO 1.1.2.2] .about-text — <p> */}
                    <p className="about-text">
                        Integrando taxonomia clássica e ecologia aplicada, o laboratório atua na vanguarda do monitoramento ambiental, utilizando as microalgas como bioindicadores essenciais para a saúde hídrica regional e o entendimento da dinâmica ecológica dos rios e igarapés da bacia do Rio Tapajós e do Baixo Amazonas.
                    </p>
                    {/* [SEÇÃO 1.1.2.3] .about-text — <p> */}
                    <p className="about-text">
                        Nossa infraestrutura alia rigor científico, inovação e extensão universitária, promovendo a formação de pesquisadores de alto nível e gerando dados estratégicos para a conservação e a gestão sustentável dos recursos naturais no oeste paraense.
                    </p>
                </div>

            </div>
        </section>
    );
}
