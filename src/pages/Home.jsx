import { HeroMosaic } from '../components/home/HeroMosaic';
import { AboutSection } from '../components/home/AboutSection';
import { RulesSection } from '../components/home/RulesSection';
import { RecentNewsSection } from '../components/home/RecentNewsSection';
import { CarouselNavigation } from '../components/home/CarouselNavigation';

export function Home() {
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
