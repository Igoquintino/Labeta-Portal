/* ============================================================
 * [COMPONENTE] CarouselNavigation
 * Descrição: Carrossel de atalhos para as páginas internas: auto-avanço de 5s, pausa no hover, setas e barra de progresso.
 * Rota/Uso: Home (/).
 * Dados: src/data/carouselCards.json
 * CSS correlato: CarouselNavigation.css
 * ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from 'lucide-react';
import cardsData from '../../data/carouselCards.json';
import './CarouselNavigation.css';

/** [FUNÇÃO] CarouselNavigation — controla slides, auto-avanço e navegação por setas. */
export function CarouselNavigation() {
    // [ESTADO] currentIndex — slide atual
    const [currentIndex, setCurrentIndex] = useState(0);
    // [ESTADO] isPaused — auto-avanço pausado (inicia pausado se prefers-reduced-motion)
    const [isPaused, setIsPaused] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        return false;
    });
    // [ESTADO] touchStartX — posição X inicial do gesto de swipe
    const [touchStartX, setTouchStartX] = useState(null);
    // [ESTADO] autoPlayRef — id do setInterval do auto-avanço
    const autoPlayRef = useRef(null);
    const duration = 5000;
    const total = cardsData.length;

    /** [FUNÇÃO] nextSlide — avança para o próximo slide (circular). */
    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
    }, [total]);

    /** [FUNÇÃO] prevSlide — volta ao slide anterior (circular). */
    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    // Respeita mudanças em prefers-reduced-motion
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = (e) => {
            if (e.matches) setIsPaused(true);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        if (!isPaused) {
            autoPlayRef.current = setInterval(() => {
                nextSlide();
            }, duration);
        }
        return () => clearInterval(autoPlayRef.current);
    }, [nextSlide, isPaused]);

    // Suporte a gestos touch (Mobile Swipe)
    /** [FUNÇÃO] handleTouchStart — registra o início do swipe. */
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    /** [FUNÇÃO] handleTouchEnd — decide avançar/voltar conforme a distância do swipe (> 50px). */
    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;

        if (diffX > 50) {
            nextSlide(); // Deslizar para a esquerda avança
        } else if (diffX < -50) {
            prevSlide(); // Deslizar para a direita volta
        }
        setTouchStartX(null);
    };

    const visibleCards = [
        cardsData[currentIndex % total],
        cardsData[(currentIndex + 1) % total],
        cardsData[(currentIndex + 2) % total]
    ];

    return (
        /* [SEÇÃO 1] .carousel-section — <section> */
        <section
            className="carousel-section"
            aria-roledescription="carousel"
            aria-label="Exploração Rápida do LABETA"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* [SEÇÃO 1.1] .carousel-container — <div> */}
            <div className="carousel-container">

                {/* [SEÇÃO 1.1.1] .carousel-top-bar — <div> */}
                <div className="carousel-top-bar">
                    {/* [SEÇÃO 1.1.1.1] .carousel-section-tag — <span> */}
                    <span className="carousel-section-tag">Navegação Rápida</span>
                    {/* [SEÇÃO 1.1.1.2] .carousel-pause-btn — <button> */}
                    <button
                        type="button"
                        className="carousel-pause-btn"
                        onClick={() => setIsPaused((prev) => !prev)}
                        aria-label={isPaused ? "Retomar rotação automática do carrossel" : "Pausar rotação automática do carrossel"}
                    >
                        {isPaused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                        <span>{isPaused ? "Retomar" : "Pausar"}</span>
                    </button>
                </div>

                {/* [SEÇÃO 1.1.2] .carousel-stage — <div> */}
                <div className="carousel-stage">
                    {/* [SEÇÃO 1.1.2.1] .carousel-btn .btn-prev — <button> */}
                    <button
                        type="button"
                        className="carousel-btn btn-prev"
                        onClick={prevSlide}
                        aria-label="Ver slide anterior"
                    >
                        <ChevronLeft size={28} aria-hidden="true" />
                    </button>

                    {/* [SEÇÃO 1.1.2.2] .carousel-cards-grid — <div> */}
                    <div className="carousel-cards-grid">
                        {visibleCards.map((card, index) => (
                            /* [SEÇÃO 1.1.2.2.1] .carousel-card-item — <article> */
                            <article className="carousel-card-item" key={`${card.id}-${index}`}>
                                {/* [SEÇÃO 1.1.2.2.1.1] .card-thumb-frame — <div> */}
                                <div className="card-thumb-frame">
                                    {/* [SEÇÃO 1.1.2.2.1.1.1] .card-thumb-img — <img> */}
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="card-thumb-img"
                                        loading="lazy"
                                        width="400"
                                        height="150"
                                    />
                                </div>

                                {/* [SEÇÃO 1.1.2.2.1.2] .card-body — <div> */}
                                <div className="card-body">
                                    {/* [SEÇÃO 1.1.2.2.1.2.1] .card-tag — <span> */}
                                    <span className="card-tag">{card.tag}</span>
                                    {/* [SEÇÃO 1.1.2.2.1.2.2] .card-title — <h3> */}
                                    <h3 className="card-title">{card.title}</h3>
                                    {/* [SEÇÃO 1.1.2.2.1.2.3] .card-description — <p> */}
                                    <p className="card-description">{card.description}</p>

                                    {/* [SEÇÃO 1.1.2.2.1.2.4] .card-cta-btn — <Link> */}
                                    <Link to={card.link} className="card-cta-btn">
                                        <span>{card.ctaText}</span>
                                        <ArrowRight size={15} aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* [SEÇÃO 1.1.2.3] .carousel-btn .btn-next — <button> */}
                    <button
                        type="button"
                        className="carousel-btn btn-next"
                        onClick={nextSlide}
                        aria-label="Ver próximo slide"
                    >
                        <ChevronRight size={28} aria-hidden="true" />
                    </button>
                </div>

                {/* Linha de Progresso Visual */}
                {/* [SEÇÃO 1.1.3] .carousel-progress-track — <div> */}
                <div className="carousel-progress-track" aria-hidden="true">
                    {/* [SEÇÃO 1.1.3.1] .carousel-progress-bar — <div> */}
                    <div
                        className={`carousel-progress-bar ${isPaused ? 'paused' : ''}`}
                        key={currentIndex}
                    />
                </div>

            </div>
        </section>
    );
}
