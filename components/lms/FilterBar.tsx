'use client';

import { SlidersHorizontal } from 'lucide-react';
import CategoryPill from './CategoryPill';
import { categories } from '../../lib/lms/data/categories';
import type { SortOption } from '../../lib/lms/utils';

type FilterBarProps = {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeLevel: string;
  onLevelChange: (level: string) => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
};

const levels = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
];

export default function FilterBar({
  activeCategory,
  onCategoryChange,
  activeLevel,
  onLevelChange,
  activeSort,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Category pills */}
      <div className="flex flex-wrap items-center gap-2">
        <CategoryPill
          label="All"
          active={!activeCategory || activeCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        />
        {categories.map((cat) => (
          <CategoryPill
            key={cat.id}
            label={cat.name}
            icon={cat.icon}
            active={activeCategory === cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
          />
        ))}
      </div>

      {/* Level & Sort dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Filters</span>
        </div>

        <select
          value={activeLevel}
          onChange={(e) => onLevelChange(e.target.value)}
          className="rounded-xl border border-slate-800/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-violet-500"
        >
          {levels.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-xl border border-slate-800/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-violet-500"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
