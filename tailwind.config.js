/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        sans: ['"IBM Plex Sans"', '"Public Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px #000',
        'brutal': '4px 4px 0px 0px #000',
        'brutal-lg': '6px 6px 0px 0px #000',
        'brutal-xl': '8px 8px 0px 0px #000',
        'brutal-accent': '4px 4px 0px 0px #146CFD',
        'brutal-danger': '4px 4px 0px 0px #D7153A',
        'brutal-success': '4px 4px 0px 0px #16A34A',
        'brutal-hover': '2px 2px 0px 0px #000',
        'none': 'none',
      },
      borderWidth: {
        'brutal': '3px',
      },
      colors: {
        'brand': {
          dark: '#002664',
          accent: '#146CFD',
          purple: '#9747FF',
        },
        'surface': {
          primary: '#FFFFFF',
          secondary: '#F2F2F2',
        },
        'semantic': {
          positive: '#16A34A',
          negative: '#D7153A',
          warning: '#F59E0B',
          highlight: '#FFD700',
        },
        'zone': {
          residential: '#FF776E',
          commercial: '#62F0F5',
          industrial: '#9999FF',
          rural: '#E6CA97',
          environmental: '#F0AE3C',
          recreational: '#55FF00',
        },
      },
    },
  },
  plugins: [],
}
