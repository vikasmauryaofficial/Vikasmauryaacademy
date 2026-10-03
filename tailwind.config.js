/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#1D9E75',
          dark: '#0F6E56',
          light: '#E1F5EE',
          mid: '#3FB58A',
        },
        blue: {
          DEFAULT: '#185FA5',
          light: '#E3F2FD',
        },
        red: {
          DEFAULT: '#E24B4A',
          light: '#FEECEC',
        },
        amber: {
          DEFAULT: '#BA7517',
          light: '#FEF3E2',
        },
        purple: {
          DEFAULT: '#534AB7',
          light: '#EEEDF8',
        },
        bg: '#F8F7F4',
        card: '#FFFFFF',
        border: '#E8E5DC',
        text: '#1A1916',
        muted: '#6B6860',
        faint: '#9B9890',
        dark: {
          DEFAULT: '#0F1117',
          card: '#1A1D27',
          border: '#2A2D37',
          hover: '#252830',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 16px rgba(0,0,0,0.06)',
        lg: '0 8px 40px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease forwards',
        fadeIn: 'fadeIn 0.4s ease forwards',
        pulseDot: 'pulseDot 1.4s infinite',
        shimmer: 'shimmer 1.5s infinite linear',
        slideUp: 'slideUp 0.3s ease forwards',
      },
    },
  },
  plugins: [],
};
