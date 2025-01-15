import React, { useState } from 'react';
import { Search, Building2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword);
    }
  };

  const examples = [
    'ソフトバンク', '楽天', 'KDDI', 'NTT', 'トヨタ'
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="relative group">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="企業名を入力してください..."
            className={`w-full px-4 py-3 pl-12 text-gray-900 bg-white/50 backdrop-blur-sm border-2 rounded-full 
              transition-all duration-300 ease-in-out
              ${isFocused 
                ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'}`}
          />
          <Building2 
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300
              ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}
          />
          <button
            type="submit"
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full
              transition-all duration-300 hover:bg-blue-700 hover:shadow-md
              ${keyword.trim() ? 'opacity-100' : 'opacity-0'}`}
            disabled={!keyword.trim()}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>
      <div className="flex flex-wrap gap-2 justify-center">
        {examples.map((example) => (
          <button
            key={example}
            onClick={() => {
              setKeyword(example);
              onSearch(example);
            }}
            className="px-3 py-1 text-sm bg-white/50 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};