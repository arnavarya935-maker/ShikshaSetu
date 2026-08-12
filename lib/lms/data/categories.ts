import type { CourseCategory } from '../types';

export const categories: CourseCategory[] = [
  {
    id: 'cat-prog',
    name: 'Programming',
    slug: 'programming',
    icon: '💻',
    courseCount: 3,
  },
  {
    id: 'cat-design',
    name: 'Design',
    slug: 'design',
    icon: '🎨',
    courseCount: 2,
  },
  {
    id: 'cat-data',
    name: 'Data Science',
    slug: 'data-science',
    icon: '📊',
    courseCount: 1,
  },
  {
    id: 'cat-business',
    name: 'Business',
    slug: 'business',
    icon: '📈',
    courseCount: 1,
  },
  {
    id: 'cat-math',
    name: 'Mathematics',
    slug: 'mathematics',
    icon: '🔢',
    courseCount: 1,
  },
  {
    id: 'cat-language',
    name: 'Language',
    slug: 'language',
    icon: '🌍',
    courseCount: 1,
  },
];
