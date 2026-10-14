import { Newspaper, Bell, FileText, ExternalLink, Calendar, Tag, Sparkles } from 'lucide-react';
import newsData from '../data/news.json';
import './News.css';

export function News() {
    return (
        <main className="news-page" id="main-content">
            <div className="news-container">

                {/* Cabeçalho da Página */}
                <header className="news-header">
                    <div className="news-badge">
                        <Newspaper size={16} />
                        <span>Divulgação & Informação</span>
                    </div>
                    <h1 className="news-title">Notícias & Radar Científico</h1>
                    <p className="news-subtitle">
                        Acompanhe comunicados operacionais do laboratório e os principais artigos científicos publicados sobre algas e ecossistemas aquáticos amazônicos.
                    </p>
                </header>

                {/* Layout em Duas Colunas */}
                <div className="news-grid-columns">

                    {/* Coluna 1: Comunicados e Avisos do LABETA */}
                    <section className="news-col announcements-col" aria-label="Comunicados Internos do Laboratório">
                        <div className="news-col-header">
                            <div className="header-icon-box announcement-icon">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h2 className="news-col-title">Comunicados do LABETA</h2>
                                <p className="news-col-desc">Avisos da rotina, editais e informes da coordenação.</p>
                            </div>
                        </div>

                        <div className="cards-stack">
                            {newsData.announcements.map((item) => (
                                <article key={item.id} className="news-card announcement-card">
                                    <div className="news-card-meta">
                                        <span className="news-tag announcement-tag">
                                            <Tag size={12} />
                                            {item.tag}
                                        </span>
                                        <span className="news-date">
                                            <Calendar size={13} />
                                            {item.date}
                                        </span>
                                    </div>

                                    <h3 className="news-item-title">{item.title}</h3>
                                    <p className="news-item-content">{item.content}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Coluna 2: Radar Científico (Artigos em Periódicos) */}
                    <section className="news-col radar-col" aria-label="Radar Científico e Artigos">
                        <div className="news-col-header">
                            <div className="header-icon-box radar-icon">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h2 className="news-col-title">Radar Científico</h2>
                                <p className="news-col-desc">Destaques de artigos publicados em revistas internacionais.</p>
                            </div>
                        </div>

                        <div className="cards-stack">
                            {newsData.scientificRadar.map((article) => (
                                <article key={article.id} className="news-card radar-card">
                                    <div className="news-card-meta">
                                        <span className="news-tag radar-tag">
                                            <FileText size={12} />
                                            {article.journal} ({article.year})
                                        </span>
                                        <span className="news-date">
                                            <Calendar size={13} />
                                            {article.date}
                                        </span>
                                    </div>

                                    <h3 className="news-item-title radar-title">{article.title}</h3>
                                    <p className="radar-authors"><strong>Autores:</strong> {article.authors}</p>
                                    <p className="news-item-content">{article.summary}</p>

                                    <div className="news-card-footer">
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="doi-badge-link"
                                            title="Acessar publicação no periódico"
                                        >
                                            <span>Acessar Artigo (DOI: {article.doi})</span>
                                            <ExternalLink size={13} />
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                </div>

            </div>
        </main>
    );
}
