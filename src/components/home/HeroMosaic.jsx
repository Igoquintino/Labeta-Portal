/* ============================================================
 * [COMPONENTE] HeroMosaic
 * Descrição: Hero da Home: mosaico de 3 fotos (bancada, microscopia, campo) com emblema LABETA sobreposto.
 * Rota/Uso: Home (/), primeira seção.
 * Dados: nenhum (imagens em /placeholders)
 * CSS correlato: HeroMosaic.css
 * ============================================================ */
import './HeroMosaic.css';

/** [FUNÇÃO] HeroMosaic — renderiza o mosaico e o emblema central. */
export function HeroMosaic() {
    return (
        /* [SEÇÃO 1] .hero-mosaic-section — <section> */
        <section className="hero-mosaic-section" aria-label="Apresentação Visual do Laboratório">
            {/* Mosaico com 3 colunas de imagens */}
            {/* [SEÇÃO 1.1] .mosaic-grid — <div> */}
            <div className="mosaic-grid">
                {/* [SEÇÃO 1.1.1] .mosaic-item — <figure> */}
                <figure className="mosaic-item">
                    {/* [SEÇÃO 1.1.1.1] .mosaic-image-wrapper — <div> */}
                    <div className="mosaic-image-wrapper">
                        {/* [SEÇÃO 1.1.1.1.1] .mosaic-img — <img> */}
                        <img
                            src="/placeholders/bancada.svg"
                            alt="Pesquisador trabalhando em bancada no LABETA"
                            className="mosaic-img"
                            loading="eager"
                            width="800"
                            height="600"
                        />
                    </div>
                    {/* [SEÇÃO 1.1.1.2] .mosaic-caption — <figcaption> */}
                    <figcaption className="mosaic-caption">Atividade em Bancada</figcaption>
                </figure>

                {/* [SEÇÃO 1.1.2] .mosaic-item — <figure> */}
                <figure className="mosaic-item">
                    {/* [SEÇÃO 1.1.2.1] .mosaic-image-wrapper — <div> */}
                    <div className="mosaic-image-wrapper">
                        {/* [SEÇÃO 1.1.2.1.1] .mosaic-img — <img> */}
                        <img
                            src="/placeholders/microscopio.svg"
                            alt="Análise de algas em microscópio óptico"
                            className="mosaic-img"
                            loading="eager"
                            width="800"
                            height="600"
                        />
                    </div>
                    {/* [SEÇÃO 1.1.2.2] .mosaic-caption — <figcaption> */}
                    <figcaption className="mosaic-caption">Microscopia e Análise</figcaption>
                </figure>

                {/* [SEÇÃO 1.1.3] .mosaic-item — <figure> */}
                <figure className="mosaic-item">
                    {/* [SEÇÃO 1.1.3.1] .mosaic-image-wrapper — <div> */}
                    <div className="mosaic-image-wrapper">
                        {/* [SEÇÃO 1.1.3.1.1] .mosaic-img — <img> */}
                        <img
                            src="/placeholders/campo.svg"
                            alt="Coleta e expedição de campo em rios amazônicos"
                            className="mosaic-img"
                            loading="eager"
                            width="800"
                            height="600"
                        />
                    </div>
                    {/* [SEÇÃO 1.1.3.2] .mosaic-caption — <figcaption> */}
                    <figcaption className="mosaic-caption">Coleta em Campo</figcaption>
                </figure>
            </div>

            {/* Emblema Flutuante e Identificação Centralizada */}
            {/* [SEÇÃO 1.2] .hero-badge-container — <div> */}
            <div className="hero-badge-container">
                {/* [SEÇÃO 1.2.1] .hero-logo-frame — <div> */}
                <div className="hero-logo-frame">
                    {/* [SEÇÃO 1.2.1.1] .hero-logo-svg — <img> */}
                    <img
                        src="/logo-labeta.png"
                        alt="Emblema do Laboratório de Ecologia e Taxonomia de Algas"
                        className="hero-logo-svg"
                        width="130"
                        height="130"
                    />
                </div>
                {/* [SEÇÃO 1.2.2] .hero-lab-name — <h1> */}
                <h1 className="hero-lab-name">LABETA</h1>
                {/* [SEÇÃO 1.2.3] .hero-lab-tagline — <p> */}
                <p className="hero-lab-tagline">Algas da Amazônia</p>
            </div>
        </section>
    );
}
