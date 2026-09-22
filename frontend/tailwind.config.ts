import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xxs: '320px',
        xs: '375px',
      },
      colors: {
        // ─── High School Youth Club Design System ─────────────────────────────────
        crimson: {
          DEFAULT: '#9E1B1B',
          50: '#FDF2F2',
          100: '#FAE0E0',
          200: '#F5C0C0',
          300: '#EC8F8F',
          400: '#E05555',
          500: '#9E1B1B',
          600: '#8A1717',
          700: '#711212',
          800: '#5E0F0F',
          900: '#4A0B0B',
          950: '#2E0707',
        },
        forest: {
          DEFAULT: '#2D6A4F',
          50: '#EEF8F3',
          100: '#D4EEE2',
          200: '#A5DAC1',
          300: '#71C0A0',
          400: '#48A880',
          500: '#2D6A4F',
          600: '#275E46',
          700: '#214D3A',
          800: '#1B3D2E',
          900: '#132B20',
          950: '#0B1912',
        },
        marigold: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        ivory: {
          DEFAULT: '#FAF8F5',
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F0EDE7',
          300: '#E2DDD4',
          400: '#CFC8BC',
          500: '#B8B0A4',
        },
        charcoal: {
          DEFAULT: '#1F2421',
          50: '#F5F6F5',
          100: '#E3E5E3',
          200: '#C5CAC5',
          300: '#9BA39B',
          400: '#6E7A6E',
          500: '#4C574C',
          600: '#3A443A',
          700: '#2B332B',
          800: '#1F2421',
          900: '#131713',
          950: '#0A0D0A',
        },
        // ─── Semantic Tokens ─────────────────────────────────────────
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        heading: ['var(--font-outfit)', ...fontFamily.sans],
        body: ['var(--font-plus-jakarta-sans)', ...fontFamily.sans],
        sans: ['var(--font-plus-jakarta-sans)', ...fontFamily.sans],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.12)',
        'crimson-glow': '0 4px 20px rgba(158, 27, 27, 0.25)',
        'forest-glow': '0 4px 20px rgba(45, 106, 79, 0.25)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
      },
      backgroundImage: {
        'crimson-gradient': 'linear-gradient(135deg, #9E1B1B 0%, #7A1212 100%)',
        'forest-gradient': 'linear-gradient(135deg, #2D6A4F 0%, #1B3D2E 100%)',
        'hero-gradient': 'linear-gradient(165deg, #1F2421 0%, #2D6A4F 40%, #9E1B1B 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FAF8F5 0%, #F0EDE7 100%)',
      },
    },
  },
  plugins: [animate],
};

export default config;
