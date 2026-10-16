/* ============================================================
 * [COMPONENTE] RecentNewsSection
 * Descrição: Mural com 3 destaques (2 comunicados + 1 item do radar científico)
 *            carregados reativamente via newsService (Supabase + fallback local).
 * Rota/Uso: Home (/).
 * Dados: Supabase ('news') com fallback em src/data/news.json via newsService.
 * CSS correlato: RecentNewsSection.css
 * ============================================================ */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, Sparkles, Bell } from 'lucide-react';
import { fetchNews } from '../../services/newsService';
import './RecentNewsSection.css';

/** [FUNÇÃO] RecentNewsSection — seleciona e exibe as notícias mais recentes. */
export function RecentNewsSection() {
    // [ESTADO] recentItems — lista dos 3 itens de destaque
    const [recentItems, setRecentItems] = useState([]);

    /** [HOOK] useEffect — busca as notícias e monta os 3 cards destacados */
    useEffect(() => {
        let isMounted = true;
        async function loadRecent() {
            const { announcements, scientificRadar } = await fetchNews();
            if (!isMounted) return;

            const items = [
                ...announcements.slice(0, 2).map((item) => ({
                    id: item.id,
                    type: 'announcement',
                    tag: item.tag || 'Comunicado',
                    title: item.title,
                    date: item.date,
                    description: item.content
                })),
                ...scientificRadar.slice(0, 1).map((item) => ({
                    id: item.id,
                    type: 'radar',
                    tag: `${item.journal || 'Periódico'} (${item.year || ''})`,
                    title: item.title,
                    date: item.date,
                    description: item.summary
                }))
            ];
            setRecentItems(items);
        }

        loadRecent();
        return () => { isMounted = false; };
    }, []);

    return (
        /* [SEÇÃO 1] .recent-news-section — <section> */
        <section className="recent-news-section" aria-labelledby="recent-news-title">
            {/* [SEÇÃO 1.1] .recent-news-container — <div> */}
            <div className="recent-news-container">

                {/* [SEÇÃO 1.1.1] .recent-news-header — <header> */}
                <header className="recent-news-header">
                    {/* [SEÇÃO 1.1.1.1] .header-meta — <div> */}
                    <div className="header-meta">
                        {/* [SEÇÃO 1.1.1.1.1] .recent-news-badge — <span> */}
                        <span className="recent-news-badge">
                            <Newspaper size={14} aria-hidden="true" />
                            <span>Mural Informativo</span>
                        </span>
                        {/* [SEÇÃO 1.1.1.1.2] .recent-news-title — <h2> */}
                        <h2 id="recent-news-title" className="recent-news-title">Últimas do LABETA</h2>
                    </div>

                    {/* [SEÇÃO 1.1.1.2] .view-all-link — <Link> */}
                    <Link to="/noticias" className="view-all-link">
                        <span>Ver todas as notícias</span>
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </header>

                {/* [SEÇÃO 1.1.2] .recent-news-grid — <div> */}
                <div className="recent-news-grid">
                    {recentItems.map((item) => (
                        /* [SEÇÃO 1.1.2.1] .recent-news-card — <article> */
                        <article key={item.id} className="recent-news-card">
                            {/* [SEÇÃO 1.1.2.1.1] .card-header-row — <div> */}
                            <div className="card-header-row">
                                {/* [SEÇÃO 1.1.2.1.1.1] .news-item-pill — <span> */}
                                <span className={`news-item-pill pill-${item.type}`}>
                                    {item.type === 'announcement' ? (
                                        <Bell size={12} aria-hidden="true" />
                                    ) : (
                                        <Sparkles size={12} aria-hidden="true" />
                                    )}
                                    <span>{item.tag}</span>
                                </span>
                                {/* [SEÇÃO 1.1.2.1.1.2] .news-item-date — <span> */}
                                <span className="news-item-date">
                                    <Calendar size={12} aria-hidden="true" />
                                    {item.date}
                                </span>
                            </div>

                            {/* [SEÇÃO 1.1.2.1.2] .news-card-heading — <h3> */}
                            <h3 className="news-card-heading">
                                <Link to="/noticias">{item.title}</Link>
                            </h3>

                            {/* [SEÇÃO 1.1.2.1.3] .news-card-excerpt — <p> */}
                            <p className="news-card-excerpt">{item.description}</p>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
}
