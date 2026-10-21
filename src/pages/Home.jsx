/* ============================================================
 * [COMPONENTE] Home
 * Descrição: Página inicial: monta as seções em sequência (Hero, Sobre, Regras, Notícias recentes, Carrossel).
 * Rota/Uso: Rota / (e fallback *).
 * Dados: delegado às seções
 * CSS correlato: estilos em cada seção de components/home
 * ============================================================ */
import { useEffect } from 'react';
import { HeroMosaic } from '../components/home/HeroMosaic';
import { AboutSection } from '../components/home/AboutSection';
import { RulesSection } from '../components/home/RulesSection';
import { RecentNewsSection } from '../components/home/RecentNewsSection';
import { CarouselNavigation } from '../components/home/CarouselNavigation';
import { useMicroscope } from '../context/useMicroscope';

/** [FUNÇÃO] Home — compõe a página inicial com scrollytelling cinematográfico. */
export function Home() {
    let setMicroscopeConfig = null;
    let setZoom = null;

    try {
        const microscope = useMicroscope();
        setMicroscopeConfig = microscope.setMicroscopeConfig;
        setZoom = microscope.setZoom;
    } catch {
        // Fallback seguro caso montado fora de MicroscopeProvider
    }

    // Configura o modo cinematográfico e gerencia o zoom óptico por scroll
    useEffect(() => {
        if (setMicroscopeConfig) {
            setMicroscopeConfig({ mode: 'cinematic', intensity: 1.0, zoom: 1.0 });
        }

        const handleScrollZoom = () => {
            if (typeof window !== 'undefined' && setZoom) {
                // Efeito Apple-like: o zoom óptico aproxima suavemente de 1.0x a 1.25x na rolagem
                const scrollProgress = Math.min(1, Math.max(0, window.scrollY / 1200));
                const opticalZoom = 1.0 + scrollProgress * 0.25;
                setZoom(opticalZoom);
            }
        };

        window.addEventListener('scroll', handleScrollZoom, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScrollZoom);
        };
    }, [setMicroscopeConfig, setZoom]);
    return (
        <main id="main-content" tabIndex="-1">
            {/* 1. Topo Mosaico com Emblema Centralizado */}
            <HeroMosaic />

            {/* 2. Seção Sobre o LABETA */}
            <AboutSection />

            {/* 3. Normas de Biossegurança e Convivência */}
            <RulesSection />

            {/* 4. Mural com as Notícias Recentes */}
            <RecentNewsSection />

            {/* 5. Carrossel Interativo com Controles Acessíveis */}
            <CarouselNavigation />
        </main>
    );
}
