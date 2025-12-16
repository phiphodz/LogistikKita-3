/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '375px',    // Extra small phones
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        // === TEMA UTAMA (Primary Merah Tetap) ===
        primary: {
          DEFAULT: '#D32F2F',  // Merah Light Mode
          hover: '#F16C6C',    // Coral Hover
          dark: '#F87171',     // Merah Soft Dark Mode
          'dark-hover': '#EF4444',
        },

        // === BACKGROUND & SURFACE ===
        background: {
          light: '#FFFFFF',
          dark: '#212E3B',
        },
        surface: {
          light: '#EEF2F6',
          dark: '#212E3B',
        },
        // WARNA KHUSUS UNTUK EFEK GLASSMORPHISM DARK MODE
        glass: {
          dark: 'rgba(33, 46, 59, 0.7)',
        },

        // === BORDER ===
        border: {
          light: '#D1D5DB',
          dark: '#535C66',
        },

        // === TEXT ===
        text: {
          main: '#1F2937',
          'main-dark': '#E8EAE9',
          muted: '#6B7280',
          'muted-dark': '#B2B6B9',
        },

        // === STATUS ORDER ===
        status: {
          draft: '#9CA3AF',
          'draft-dark': '#B2B6B9',
          process: '#F16C6C',
          'process-dark': '#FCA5A5',
          sent: '#D32F2F',
          'sent-dark': '#F87171',
          done: '#16A34A',
          'done-dark': '#22C55E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow-red': 'pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'scroll': 'scroll 20s linear infinite',
        'scroll-reverse': 'scroll-reverse 20s linear infinite',
        'image-pulse': 'image-pulse 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        imagePulse: {
          '0%, 100%': { transform: 'scale(1.0)', opacity: '0.95' },
          '50%': { transform: 'scale(1.02)', opacity: '1.0' },
        },
        'border-spin-glow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow-red': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(211, 47, 47, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 50px rgba(211, 47, 47, 0.6)',
            transform: 'scale(1.05)'
          },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
          }
