'use client';

import { useState, useEffect } from 'react';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import Image from 'next/image';
import styles from './noticias.module.scss';

interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  isFeatured: boolean;
  publishedAt: string;
}

export default function NoticiasPage() {
  const { language } = useYugiohLanguage();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch('/api/yugioh/news');
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNews = news.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Simple markdown to HTML converter
  const renderMarkdown = (content: string) => {
    let html = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br />');

    html = html.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');
    return `<p>${html}</p>`;
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner}></span>
        <p>{language === 'es' ? 'Cargando noticias...' : 'Loading news...'}</p>
      </div>
    );
  }

  // Article detail view
  if (selectedArticle) {
    return (
      <div className={styles.container}>
        <button
          className={styles.backButton}
          onClick={() => setSelectedArticle(null)}
        >
          ← {language === 'es' ? 'Volver a noticias' : 'Back to news'}
        </button>

        <article className={styles.articleDetail}>
          {selectedArticle.coverImage && (
            <div className={styles.articleCover}>
              <Image
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                width={800}
                height={400}
                className={styles.coverImage}
              />
            </div>
          )}

          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{selectedArticle.title}</h1>
            <div className={styles.articleMeta}>
              <span className={styles.author}>
                ✍️ {selectedArticle.author}
              </span>
              <span className={styles.date}>
                📅 {formatDate(selectedArticle.publishedAt)}
              </span>
            </div>
          </header>

          <div
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedArticle.content) }}
          />

          {selectedArticle.tags.length > 0 && (
            <div className={styles.articleTags}>
              {selectedArticle.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </article>
      </div>
    );
  }

  // News list view
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          📰 {language === 'es' ? 'Noticias' : 'News'}
        </h1>
        <p className={styles.subtitle}>
          {language === 'es'
            ? 'Últimas novedades y anuncios'
            : 'Latest updates and announcements'}
        </p>
      </div>

      {/* Search */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder={language === 'es' ? 'Buscar noticias...' : 'Search news...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* News List */}
      {filteredNews.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📰</span>
          <p>
            {searchTerm
              ? (language === 'es' ? 'No se encontraron noticias' : 'No news found')
              : (language === 'es' ? 'No hay noticias disponibles' : 'No news available')}
          </p>
        </div>
      ) : (
        <div className={styles.newsList}>
          {filteredNews.map((article) => (
            <article
              key={article._id}
              className={`${styles.newsCard} ${article.isFeatured ? styles.featured : ''}`}
              onClick={() => setSelectedArticle(article)}
            >
              {article.isFeatured && (
                <span className={styles.featuredBadge}>
                  ⭐ {language === 'es' ? 'Destacado' : 'Featured'}
                </span>
              )}

              {article.coverImage && (
                <div className={styles.newsImage}>
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    width={300}
                    height={150}
                    className={styles.image}
                  />
                </div>
              )}

              <div className={styles.newsContent}>
                <h2 className={styles.newsTitle}>{article.title}</h2>
                <p className={styles.newsSummary}>{article.summary}</p>

                <div className={styles.newsMeta}>
                  <span className={styles.author}>{article.author}</span>
                  <span className={styles.date}>{formatDate(article.publishedAt)}</span>
                </div>

                {article.tags.length > 0 && (
                  <div className={styles.tags}>
                    {article.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {filteredNews.length > 0 && (
        <div className={styles.resultsCount}>
          {language === 'es'
            ? `Mostrando ${filteredNews.length} noticia(s)`
            : `Showing ${filteredNews.length} article(s)`}
        </div>
      )}
    </div>
  );
}
