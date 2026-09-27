/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-warm": "#FAF8F5",
        "surface-cream": "#F6F1E8",
        "surface-pure": "#FFFFFF",
        "primary": "#865300",
        "primary-rich": "#9C5400",
        "amber-brand": "#D97706",
        "amber-accent": "#F59E0B",
        "amber-soft": "#FDF2E2",
        "peach-glow": "#FBD5A5",
        "text-obsidian": "#1C1917",
        "text-umber": "#292524",
        "text-muted": "#6E655C",
        "text-subtle": "#857463",
        "border-soft": "#EBE4D8",
        "border-subtle": "rgba(220, 200, 175, 0.45)",
        setu: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary Teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "serif-italic": ["Instrument Serif", "Georgia", "serif"],
        "body": ["Inter", "sans-serif"],
        "handwriting": ["Caveat", "cursive"]
      }
    },
  },
  plugins: [],
}
