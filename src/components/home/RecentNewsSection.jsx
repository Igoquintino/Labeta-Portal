import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, Sparkles, Bell } from 'lucide-react';
import newsData from '../../data/news.json';
import './RecentNewsSection.css';

export function RecentNewsSection() {
    // Combina e seleciona as 3 notícias/artigos mais recentes
    const recentItems = [
        ...newsData.announcements.slice(0, 2).map((item) => ({
            id: item.id,
            type: 'announcement',
            tag: item.tag,
            title: item.title,
            date: item.date,
            description: item.content
        })),
        ...newsData.scientificRadar.slice(0, 1).map((item) => ({
            id: item.id,
            type: 'radar',
            tag: `${item.journal} (${item.year})`,
            title: item.title,
            date: item.date,
            description: item.summary
        }))
    ];

    return (
        <section className="recent-news-section" aria-labelledby="recent-news-title">
            <div className="recent-news-container">

                <header className="recent-news-header">
                    <div className="header-meta">
                        <span className="recent-news-badge">
                            <Newspaper size={14} aria-hidden="true" />
                            <span>Mural Informativo</span>
                        </span>
                        <h2 id="recent-news-title" className="recent-news-title">Últimas do LABETA</h2>
                    </div>

                    <Link to="/noticias" className="view-all-link">
                        <span>Ver todas as notícias</span>
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </header>

                <div className="recent-news-grid">
                    {recentItems.map((item) => (
                        <article key={item.id} className="recent-news-card">
                            <div className="card-header-row">
                                <span className={`news-item-pill pill-${item.type}`}>
                                    {item.type === 'announcement' ? (
                                        <Bell size={12} aria-hidden="true" />
                                    ) : (
                                        <Sparkles size={12} aria-hidden="true" />
                                    )}
                                    <span>{item.tag}</span>
                                </span>
                                <span className="news-item-date">
                                    <Calendar size={12} aria-hidden="true" />
                                    {item.date}
                                </span>
                            </div>

                            <h3 className="news-card-heading">
                                <Link to="/noticias">{item.title}</Link>
                            </h3>

                            <p className="news-card-excerpt">{item.description}</p>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
}
