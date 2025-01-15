import axios, { AxiosError } from 'axios';
import { SearchResult } from './types';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ENGINE_ID;
const BASE_URL = 'https://www.googleapis.com/customsearch/v1';

// デフォルトのM&Aに関連するキーワード
const DEFAULT_MA_KEYWORDS = [
  '買収', '合併', 'M&A', '資本提携',
  'TOB', '株式取得', '子会社化',
  '経営統合', '事業譲渡', '出資'
];

export const searchNews = async (keyword: string, customKeywords: string[] = []): Promise<SearchResult[]> => {
  try {
    // カスタムキーワードとデフォルトキーワードを結合
    const allKeywords = [...new Set([...DEFAULT_MA_KEYWORDS, ...customKeywords])];
    
    // 企業名とM&A関連キーワードを組み合わせた検索クエリを作成
    const searchQuery = `(${keyword}) (${allKeywords.join(' OR ')}) ${getTodayDateString()}`;
    
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: searchQuery,
        sort: 'date',
        num: 10,
        dateRestrict: 'd1'
      }
    });

    // 検索結果をキーワードでフィルタリング
    const items = response.data.items || [];
    return items.filter(item => 
      allKeywords.some(keyword => 
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.snippet.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching search results:', error.message);
    } else {
      console.error('An unexpected error occurred');
    }
    return [];
  }
};

// 今日の日付を取得（YYYY-MM-DD形式）
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};