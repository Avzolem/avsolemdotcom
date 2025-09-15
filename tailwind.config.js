/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Light theme - Beige colors
        beige: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ebe3d6',
          300: '#dfd4c1',
          400: '#d0c0a8',
          500: '#baa58d',
          600: '#9e8872',
          700: '#7e6b59',
          800: '#5f5145',
          900: '#443832',
        },
        // Dark theme - Navy/Black colors
        navy: {
          50: '#e6f1ff',
          100: '#b3d4ff',
          200: '#80b7ff',
          300: '#4d9aff',
          400: '#1a7dff',
          500: '#0e1929',
          600: '#0a192f',
          700: '#001529',
          800: '#000511',
          900: '#0a0a0a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'beige-gradient': 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #ebe3d6 100%)',
        'navy-gradient': 'radial-gradient(ellipse at top center, rgba(14, 25, 41, 0.6) 0%, rgba(14, 25, 41, 0.3) 40%, transparent 70%)',
        'navy-linear': 'linear-gradient(135deg, #0e1929 0%, #0a0a0a 100%)',
      },
      animation: {
        'gradient-shift': 'gradient 8s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}