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
        space: {
          950: '#030712',
          900: '#070b19',
          850: '#0c1229',
          800: '#111a3b',
          700: '#1e2c5b',
          600: '#2b3f7f'
        },
        nasa: {
          blue: '#0B3D91',
          red: '#FC3D21',
          cyan: '#00e5ff',
          glow: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit-slow': 'orbit 60s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(0,229,255,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(0,229,255,0.85))' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
