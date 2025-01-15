import React, { useState } from 'react';
import { Plus, X, Save, Tag } from 'lucide-react';
import { KeywordCategory } from '../types';

interface KeywordManagerProps {
  categories: KeywordCategory[];
  onUpdateCategories: (categories: KeywordCategory[]) => void;
}

export const KeywordManager: React.FC<KeywordManagerProps> = ({
  categories,
  onUpdateCategories,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddKeyword = () => {
    if (!newKeyword.trim() || !selectedCategory) return;

    const updatedCategories = categories.map(category => {
      if (category.id === selectedCategory) {
        return {
          ...category,
          keywords: [...new Set([...category.keywords, newKeyword.trim()])]
        };
      }
      return category;
    });

    onUpdateCategories(updatedCategories);
    setNewKeyword('');
  };

  const handleRemoveKeyword = (categoryId: string, keyword: string) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          keywords: category.keywords.filter(k => k !== keyword)
        };
      }
      return category;
    });

    onUpdateCategories(updatedCategories);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: KeywordCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      keywords: []
    };

    onUpdateCategories([...categories, newCategory]);
    setNewCategoryName('');
    setSelectedCategory(newCategory.id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200"
      >
        <Tag className="w-4 h-4" />
        キーワード管理
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">新しいカテゴリー</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="カテゴリー名"
                className="flex-1 px-3 py-1 text-sm border rounded"
              />
              <button
                onClick={handleAddCategory}
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">新しいキーワード</h3>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 text-sm border rounded"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="キーワード"
                className="flex-1 px-3 py-1 text-sm border rounded"
              />
              <button
                onClick={handleAddKeyword}
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {categories.map(category => (
              <div key={category.id} className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                  {category.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-sm text-gray-700"
                    >
                      {keyword}
                      <button
                        onClick={() => handleRemoveKeyword(category.id, keyword)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};