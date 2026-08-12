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
        zinc: {
          950: '#09090b',
        }
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        glow: '0 0 50px -10px rgba(0, 0, 0, 0.05)',
        elevated: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(0, 0, 0, 0.02), transparent 50%)',
        'card-glow': 'radial-gradient(circle at top right, rgba(0, 0, 0, 0.01), transparent 40%)'
      }
    }
  },
  plugins: []
};

export default config;

