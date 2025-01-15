import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { NewsCard } from './components/NewsCard';
import { KeywordManager } from './components/KeywordManager';
import { searchNews } from './api';
import { SearchResult, KeywordCategory } from './types';
import { Building2, ArrowUp } from 'lucide-react';

// デフォルトのキーワードカテゴリー
const DEFAULT_CATEGORIES: KeywordCategory[] = [
  {
    id: 'ma',
    name: 'M&A全般',
    keywords: ['買収', '合併', 'M&A', '資本提携', 'TOB']
  },
  {
    id: 'business',
    name: '事業再編',
    keywords: ['株式取得', '子会社化', '経営統合', '事業譲渡', '出資']
  }
];

function App() {
  const [articles, setArticles] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categories, setCategories] = useState<KeywordCategory[]>(() => {
    const saved = localStorage.getItem('keywordCategories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('keywordCategories', JSON.stringify(categories));
  }, [categories]);

  const handleSearch = async (keyword: string) => {
    setLoading(true);
    setError(null);
    try {
      // すべてのカテゴリーからキーワードを収集
      const allKeywords = categories.flatMap(category => category.keywords);
      const results = await searchNews(keyword, allKeywords);
      setArticles(results);
      if (results.length === 0) {
        setError('本日のM&A情報は見つかりませんでした。');
      }
    } catch (err) {
      setError('検索中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 今日の日付を取得
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-blue-600 p-3 rounded-full">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  M&A情報検索
                </h1>
                <p className="text-sm text-gray-600 mt-1">{today}の企業M&A情報</p>
              </div>
            </div>
            <KeywordManager
              categories={categories}
              onUpdateCategories={setCategories}
            />
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-4 mx-auto max-w-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto shadow-sm">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                企業名を入力して、本日のM&A情報を検索してください。
              </p>
              <p className="text-sm text-gray-500 mt-2">
                例: ソフトバンク、楽天、KDDI など
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="opacity-0 animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 animate-bounce"
            aria-label="トップへ戻る"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </main>
    </div>
  );
}

export default App;