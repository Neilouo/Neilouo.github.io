/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx}', './theme.config.tsx'],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        warm: {
          50: '#FDFCFB',
          100: '#F9F5F0',
          200: '#F0E6D6',
          300: '#E2D2BC',
          400: '#C4AD8F',
          500: '#A68B6B',
          600: '#806A50',
          700: '#5C4D3C',
          800: '#3D342A',
          900: '#231E18',
          950: '#141210'
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
          solid: 'rgb(var(--color-accent-solid) / <alpha-value>)',
          'solid-hover': 'rgb(var(--color-accent-solid-hover) / <alpha-value>)'
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"LXGW WenKai"', '"STKaiti"', 'Georgia', 'serif']
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.15' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }]
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem'
      },
      maxWidth: {
        prose: '65ch',
        page: '72rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      boxShadow: {
        card: '0 1px 3px rgba(35,30,24,0.04), 0 1px 2px rgba(35,30,24,0.06)',
        'card-hover': '0 8px 24px rgba(35,30,24,0.10), 0 2px 6px rgba(35,30,24,0.06)',
        lift: '0 12px 32px rgba(194,65,12,0.10), 0 2px 8px rgba(35,30,24,0.06)'
      },
      borderRadius: {
        card: '1rem',
        tile: '0.75rem'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
  darkMode: 'class'
}
