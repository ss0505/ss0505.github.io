import React from 'react';
import { ExternalLink, Calendar, Globe, Building2 } from 'lucide-react';
import { SearchResult } from '../types';

interface NewsCardProps {
  article: SearchResult;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '日付不明';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const defaultImage = 'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?q=80&w=800&auto=format&fit=crop';
  const imageUrl = article.pagemap?.cse_image?.[0]?.src || 
                  article.pagemap?.metatags?.[0]?.['og:image'] ||
                  defaultImage;
  const publishDate = article.pagemap?.metatags?.[0]?.['article:published_time'];

  // M&A関連キーワードをハイライト
  const highlightMATerms = (text: string) => {
    const maTerms = ['買収', '合併', 'M&A', '資本提携', 'TOB', '株式取得', '子会社化', '経営統合'];
    let highlightedText = text;
    maTerms.forEach(term => {
      const regex = new RegExp(term, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="text-blue-600 font-semibold">${term}</span>`);
    });
    return highlightedText;
  };

  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
              dangerouslySetInnerHTML={{ __html: highlightMATerms(article.title) }} />
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3"
           dangerouslySetInnerHTML={{ __html: highlightMATerms(article.snippet) }} />
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-1" />
            <span>{article.source?.title || new URL(article.link).hostname}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(publishDate)}</span>
          </div>
        </div>
        
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-800 
            border-2 border-blue-600 hover:border-blue-800 rounded-full transition-colors duration-300"
        >
          詳細を見る
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </article>
  );
};