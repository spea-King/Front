/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#1a2744',
        },
        gold: {
          500: '#d4af37',
          600: '#c9a227',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Pretendard', 'Source Sans Pro', 'sans-serif'],
      },
      animation: {
        'bounce': 'bounce 1s infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
