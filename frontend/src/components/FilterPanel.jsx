import React from 'react';

export default function FilterPanel({ categories, selectedCategory, onSelectCategory, sortBy, onSortBy }) {
  return (
    <div className="card-glass rounded-xl border border-slate-700 p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Category</label>
          <select
            value={selectedCategory || ''}
            onChange={e => onSelectCategory(e.target.value)}
            className="w-full bg-[#111f42] border border-slate-700 text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Sort</label>
          <select
            value={sortBy || ''}
            onChange={e => onSortBy(e.target.value)}
            className="w-full bg-[#111f42] border border-slate-700 text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Default</option>
            <option value="popular">Most Popular</option>
            <option value="latest">Latest</option>
            <option value="top-rated">Top Rated</option>
            <option value="most-loved">Most Loved (Favorites)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
