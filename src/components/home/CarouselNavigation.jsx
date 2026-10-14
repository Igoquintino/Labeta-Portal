import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from 'lucide-react';
import cardsData from '../../data/carouselCards.json';
import './CarouselNavigation.css';

export function CarouselNavigation() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        return false;
    });
    const [touchStartX, setTouchStartX] = useState(null);
    const autoPlayRef = useRef(null);
    const duration = 5000;
    const total = cardsData.length;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
    }, [total]);

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
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

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
        <section
            className="carousel-section"
            aria-roledescription="carousel"
            aria-label="Exploração Rápida do LABETA"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="carousel-container">

                <div className="carousel-top-bar">
                    <span className="carousel-section-tag">Navegação Rápida</span>
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

                <div className="carousel-stage">
                    <button
                        type="button"
                        className="carousel-btn btn-prev"
                        onClick={prevSlide}
                        aria-label="Ver slide anterior"
                    >
                        <ChevronLeft size={28} aria-hidden="true" />
                    </button>

                    <div className="carousel-cards-grid">
                        {visibleCards.map((card, index) => (
                            <article className="carousel-card-item" key={`${card.id}-${index}`}>
                                <div className="card-thumb-frame">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="card-thumb-img"
                                        loading="lazy"
                                        width="400"
                                        height="150"
                                    />
                                </div>

                                <div className="card-body">
                                    <span className="card-tag">{card.tag}</span>
                                    <h3 className="card-title">{card.title}</h3>
                                    <p className="card-description">{card.description}</p>

                                    <Link to={card.link} className="card-cta-btn">
                                        <span>{card.ctaText}</span>
                                        <ArrowRight size={15} aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

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
