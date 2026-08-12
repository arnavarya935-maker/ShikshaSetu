import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          lavender: '#F5F4FE',
          rose: '#FAF2F7',
          mint: '#F0FDF4',
          sky: '#F0F9FF',
          amber: '#FFFBEB',
        },
        zinc: {
          950: '#09090b',
        }
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        glow: '0 0 50px -10px rgba(139, 92, 246, 0.15)',
        elevated: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(168, 85, 247, 0.08), transparent 50%)',
        'card-glow': 'radial-gradient(circle at top right, rgba(168, 85, 247, 0.06), transparent 40%)'
      }
    }
  },
  plugins: []
};

export default config;

