// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // === TEMA UTAMA (Primary Merah Tetap) ===
        primary: {
          DEFAULT: '#D32F2F',  // Merah Light Mode
          hover: '#F16C6C',    // Coral Hover
          dark: '#F87171',     // Merah Soft Dark Mode
          'dark-hover': '#EF4444',
        },

        // === BACKGROUND & SURFACE (PALET BARU YANG ELEGAN) ===
        background: {
          light: '#FFFFFF',
          // Menggunakan warna Biru Dongker Gelap dari palet untuk background utama dark mode
          dark: '#212E3B',
        },
        surface: {
          light: '#EEF2F6',
          // Warna base untuk card/surface di dark mode
          dark: '#212E3B',
        },
        // WARNA KHUSUS UNTUK EFEK GLASSMORPHISM DARK MODE
        // Ini adalah warna #212E3B dengan transparansi 70%
        glass: {
          dark: 'rgba(33, 46, 59, 0.7)',
        },

        // === BORDER ===
        border: {
          light: '#D1D5DB',
          // Menggunakan warna Abu-abu Tua dari palet untuk border yang subtle
          dark: '#535C66',
        },

        // === TEXT ===
        text: {
          main: '#1F2937',
          // Menggunakan warna Abu-abu Terang/Putih Gading dari palet agar teks jelas
          'main-dark': '#E8EAE9',
          muted: '#6B7280',
          // Menggunakan warna Abu-abu Sedang untuk teks sekunder
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
        sans: ['Inter', 'sans-serif'],
      },
      // Menambahkan definisi backdrop blur untuk efek glass
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
