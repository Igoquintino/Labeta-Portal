import './HeroMosaic.css';

export function HeroMosaic() {
    return (
        <section className="hero-mosaic-section" aria-label="Apresentação Visual do Laboratório">
            {/* Mosaico com 3 colunas de imagens */}
            <div className="mosaic-grid">
                <figure className="mosaic-item">
                    <div className="mosaic-image-wrapper">
                        <img
                            src="/placeholders/bancada.svg"
                            alt="Pesquisador trabalhando em bancada no LABETA"
                            className="mosaic-img"
                            loading="eager"
                            width="800"
                            height="600"
                        />
                    </div>
                    <figcaption className="mosaic-caption">Atividade em Bancada</figcaption>
                </figure>

                <figure className="mosaic-item">
                    <div className="mosaic-image-wrapper">
                        <img
                            src="/placeholders/microscopio.svg"
                            alt="Análise de algas em microscópio óptico"
                            className="mosaic-img"
                            loading="eager"
                            width="800"
                            height="600"
                        />
                    </div>
                    <figcaption className="mosaic-caption">Microscopia e Análise</figcaption>
                </figure>

                <figure className="mosaic-item">
                    <div className="mosaic-image-wrapper">
                        <img
                            src="/placeholders/campo.svg"
                            alt="Coleta e expedição de campo em rios amazônicos"
                            className="mosaic-img"
                            loading="eager"
                            width="800"
                            height="600"
                        />
                    </div>
                    <figcaption className="mosaic-caption">Coleta em Campo</figcaption>
                </figure>
            </div>

            {/* Emblema Flutuante e Identificação Centralizada */}
            <div className="hero-badge-container">
                <div className="hero-logo-frame">
                    <img
                        src="/logo-labeta.png"
                        alt="Emblema do Laboratório de Ecologia e Taxonomia de Algas"
                        className="hero-logo-svg"
                        width="130"
                        height="130"
                    />
                </div>
                <h1 className="hero-lab-name">LABETA</h1>
                <p className="hero-lab-tagline">Algas da Amazônia</p>
            </div>
        </section>
    );
}
