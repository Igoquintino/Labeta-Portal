/* ============================================================
 * [COMPONENTE] CarouselNavigation
 * Descrição: Carrossel com visualização lateral (peek/center-mode), auto-avanço de 5s,
 *            pausa no hover/botão, navegação por setas, toque/swipe e indicadores (dots).
 * Rota/Uso: Home (/).
 * Dados: src/data/carouselCards.json
 * CSS correlato: CarouselNavigation.css
 * ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from 'lucide-react';
import cardsData from '../../data/carouselCards.json';
import './CarouselNavigation.css';

/** [FUNÇÃO] CarouselNavigation — controla slides com foco central e visão dos cards laterais. */
export function CarouselNavigation() {
    // [ESTADO] currentIndex — índice do card ativo
    const [currentIndex, setCurrentIndex] = useState(0);

    // [ESTADO] isPaused — auto-avanço pausado (inicia pausado se prefers-reduced-motion)
    const [isPaused, setIsPaused] = useState(() => {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        return false;
    });

    // [ESTADO] dragOffset — deslocamento em pixels durante o gesto de touch
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartXRef = useRef(null);

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

    // Respeita preferências de redução de movimento do sistema
    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = (e) => {
            if (e.matches) setIsPaused(true);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Temporizador de auto-avanço
    useEffect(() => {
        if (!isPaused) {
            autoPlayRef.current = setInterval(() => {
                nextSlide();
            }, duration);
        }
        return () => clearInterval(autoPlayRef.current);
    }, [nextSlide, isPaused]);

    // Suporte a gestos touch (Mobile Swipe responsivo com arrasto tátil)
    const handleTouchStart = (e) => {
        touchStartXRef.current = e.touches[0].clientX;
        setIsDragging(true);
        setIsPaused(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || touchStartXRef.current === null) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - touchStartXRef.current;
        // Amortecimento do deslocamento em touch
        const damped = Math.max(Math.min(diffX, 80), -80);
        setDragOffset(damped);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (dragOffset < -40) {
            nextSlide();
        } else if (dragOffset > 40) {
            prevSlide();
        }
        setDragOffset(0);
        touchStartXRef.current = null;
    };

    // Navegação por teclado (Setas Esquerda / Direita)
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    };

    // Slots de visualização: central ativo com pré-visualização (peek) nas laterais
    const slots = [
        { card: cardsData[(currentIndex - 2 + total) % total], role: 'outer-left', slotKey: 'slot-outer-left' },
        { card: cardsData[(currentIndex - 1 + total) % total], role: 'prev', slotKey: 'slot-prev' },
        { card: cardsData[currentIndex % total], role: 'active', slotKey: 'slot-active' },
        { card: cardsData[(currentIndex + 1) % total], role: 'next', slotKey: 'slot-next' },
        { card: cardsData[(currentIndex + 2) % total], role: 'outer-right', slotKey: 'slot-outer-right' },
    ];

    return (
        /* [SEÇÃO 1] .carousel-section — <section> */
        <section
            className="carousel-section"
            role="region"
            aria-roledescription="carousel"
            aria-label="Exploração Rápida do LABETA"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
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

                    {/* [SEÇÃO 1.1.2.2] .carousel-viewport — <div> */}
                    <div
                        className="carousel-viewport"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* [SEÇÃO 1.1.2.3] .carousel-track — <div> */}
                        <div
                            className="carousel-track"
                            style={{
                                transform: dragOffset !== 0 ? `translateX(${dragOffset}px)` : undefined,
                                transition: isDragging ? 'none' : 'transform 0.25s ease-out'
                            }}
                        >
                            {slots.map(({ card, role, slotKey }) => {
                                const isActive = role === 'active';
                                const isPeek = role === 'prev' || role === 'next';
                                const isPrev = role === 'prev';
                                const isNext = role === 'next';

                                return (
                                    <article
                                        key={slotKey}
                                        className={`carousel-card-item ${
                                            isActive
                                                ? 'is-active'
                                                : isPeek
                                                ? `is-peek ${isPrev ? 'is-prev' : 'is-next'}`
                                                : `is-outer is-${role}`
                                        }`}
                                        onClick={isPrev ? prevSlide : isNext ? nextSlide : undefined}
                                        title={isPrev ? "Clique para ver slide anterior" : isNext ? "Clique para ver próximo slide" : undefined}
                                        aria-hidden={!isActive}
                                    >
                                        {/* Frame da Imagem de Destaque */}
                                        <div className="card-thumb-frame">
                                            <img
                                                src={card.image}
                                                alt={card.title}
                                                className="card-thumb-img"
                                                loading="lazy"
                                                width="400"
                                                height="160"
                                            />
                                        </div>

                                        {/* Corpo Informativo do Card */}
                                        <div className="card-body">
                                            <span className="card-tag">{card.tag}</span>
                                            <h3 className="card-title">{card.title}</h3>
                                            <p className="card-description">{card.description}</p>

                                            <Link
                                                to={card.link}
                                                className="card-cta-btn"
                                                tabIndex={isActive ? 0 : -1}
                                                aria-hidden={!isActive}
                                            >
                                                <span>{card.ctaText}</span>
                                                <ArrowRight size={15} aria-hidden="true" />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    {/* [SEÇÃO 1.1.2.4] .carousel-btn .btn-next — <button> */}
                    <button
                        type="button"
                        className="carousel-btn btn-next"
                        onClick={nextSlide}
                        aria-label="Ver próximo slide"
                    >
                        <ChevronRight size={28} aria-hidden="true" />
                    </button>
                </div>

                {/* [SEÇÃO 1.1.3] Indicadores de Paginação (Dots) */}
                <div className="carousel-dots-container" role="tablist" aria-label="Navegação por slides">
                    {cardsData.map((card, index) => (
                        <button
                            key={card.id}
                            type="button"
                            role="tab"
                            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-selected={index === currentIndex}
                            aria-label={`Ir para slide ${index + 1}: ${card.title}`}
                        />
                    ))}
                </div>

                {/* Linha de Progresso Visual */}
                <div className="carousel-progress-track" aria-hidden="true">
                    <div
                        className={`carousel-progress-bar ${isPaused ? 'paused' : ''}`}
                        key={currentIndex}
                    />
                </div>

            </div>
        </section>
    );
}
