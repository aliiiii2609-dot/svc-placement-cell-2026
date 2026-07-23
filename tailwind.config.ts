import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // NOTE: all semantic colors are driven by CSS custom properties defined in
        // src/styles/tokens.css (light on :root, dark under html.dark). Solid tokens
        // use the `rgb(var(--x) / <alpha-value>)` channel pattern so Tailwind opacity
        // modifiers keep working (e.g. bg-surface/95, border-ink/15, text-gold/30).
        // Inherently-translucent tokens (line, *-soft) keep a baked rgba() via var().
        // Do NOT rename these keys — components reference them everywhere.

        // Stripe-style near-white background
        bg: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          2: 'rgb(var(--bg-2) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          2: 'rgb(var(--surface-2) / <alpha-value>)',
        },
        // Deep ink for primary, mid-gray for secondary
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          2: 'rgb(var(--ink-2) / <alpha-value>)',
          3: 'rgb(var(--ink-3) / <alpha-value>)',
        },
        // Restrained gold accent (kept for the institution's identity)
        gold: {
          DEFAULT: 'rgb(var(--gold) / <alpha-value>)',
          soft: 'var(--gold-soft)',
          deep: 'rgb(var(--gold-deep) / <alpha-value>)',
        },
        // Stripe-style hyperlink / CTA accent
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'var(--accent-soft)',
          deep: 'rgb(var(--accent-deep) / <alpha-value>)',
        },
        // Hairlines keep a baked alpha (so bare `border-line` stays a faint hairline);
        // consumed as plain var() because the default already carries its own opacity.
        line: {
          DEFAULT: 'var(--line)',
          2: 'var(--line-2)',
        },
        // Gradient ribbon stops (used in hero animation)
        ribbon: {
          peach: '#ffb088',
          rose: '#ff6b9d',
          violet: '#a26bff',
          azure: '#6ba6ff',
          mint: '#7fd9c1',
        },
      },
      fontFamily: {
        // "Inter Tight" removed: see the note in index.html. Inter with the
        // tightest tracking token is visually equivalent at display sizes and
        // saves four font files on every page load.
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'ui-serif', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
        tight: '-0.022em',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10, 37, 64, 0.04), 0 8px 24px rgba(10, 37, 64, 0.06)',
        'soft-lg': '0 2px 4px rgba(10, 37, 64, 0.05), 0 16px 40px rgba(10, 37, 64, 0.08)',
        glow: '0 8px 32px -8px rgba(99, 91, 255, 0.35)',
        bubble: '0 4px 12px rgba(10, 37, 64, 0.08), 0 20px 40px -10px rgba(10, 37, 64, 0.12)',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in': 'fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        rise: 'rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        breathe: 'breathe 14s ease-in-out infinite',
        drift: 'drift 24s ease-in-out infinite',
        marquee: 'marquee 50s linear infinite',
        'marquee-reverse': 'marquee-reverse 50s linear infinite',
        orbit: 'orbit 40s linear infinite',
        float: 'float 8s ease-in-out infinite',
        'float-slow': 'float 14s ease-in-out infinite',
        'ribbon-sweep': 'ribbon-sweep 30s linear infinite',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        rise: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(20px, -10px)' },
          '66%': { transform: 'translate(-15px, 10px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'ribbon-sweep': {
          '0%, 100%': { transform: 'translate(0%, 0%) rotate(35deg)' },
          '50%': { transform: 'translate(5%, -3%) rotate(36deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
