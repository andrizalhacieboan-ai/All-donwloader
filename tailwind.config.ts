import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        neu: {
          bg: '#1a1a1a',
          dark: '#0a0a0a',
          light: '#2a2a2a',
          orange: '#FF6B00'
        }
      },
      boxShadow: {
        'neu-out': '8px 8px 16px #0a0a0a, -8px -8px 16px #2a2a2a',
        'neu-in': 'inset 8px 8px 16px #0a0a0a, inset -8px -8px 16px #2a2a2a',
        'neu-sm': '5px 5px 10px #0a0a0a, -5px -5px 10px #2a2a2a',
        'neu-orange': '5px 5px 10px #0a0a0a, -5px -5px 10px #2a2a2a, 0 0 15px rgba(255, 107, 0, 0.3)'
      }
    },
  },
  plugins: [],
};
export default config;
