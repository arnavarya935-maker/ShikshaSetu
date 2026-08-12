import { Star } from 'lucide-react';

type TestimonialCardProps = {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  rating?: number;
};

export default function TestimonialCard({ name, role, quote, avatar, rating = 5 }: TestimonialCardProps) {
  const initials = avatar ?? name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-soft transition hover:-translate-y-1 hover:border-violet-400/30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-slate-700 text-sm font-semibold text-white">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-white">{name}</p>
            <p className="text-sm text-slate-400">{role}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, index) => (
            <Star key={index} className="h-4 w-4 fill-violet-400 text-violet-400" />
          ))}
        </div>
      </div>
      <p className="mt-6 text-slate-300 leading-8">“{quote}”</p>
    </div>
  );
}
