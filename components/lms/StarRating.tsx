'use client';

import { Star } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
};

export default function StarRating({ rating, max = 5, size = 16, showValue = true }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i && rating < i + 1;
          return (
            <Star
              key={i}
              className={`${filled ? 'fill-amber-400 text-amber-400' : half ? 'fill-amber-400/50 text-amber-400' : 'text-slate-600'} transition-colors`}
              style={{ width: size, height: size }}
            />
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-slate-300">{rating.toFixed(1)}</span>}
    </div>
  );
}
