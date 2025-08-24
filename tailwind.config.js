/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff00',
        'neon-red': '#ff0000',
        'neon-cyan': '#00ffff',
        'neon-yellow': '#ffff00',
        'matrix-green': '#00d700',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'text-glow': 'textGlow 2s ease-in-out infinite',
        'border-pulse': 'borderPulse 1.5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'flicker': 'flicker 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), 0 0 40px rgba(0, 255, 0, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.5)',
          },
        },
        textGlow: {
          '0%, 100%': {
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor',
          },
          '50%': {
            textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
          },
        },
        borderPulse: {
          '0%, 100%': {
            borderColor: 'rgba(0, 255, 0, 0.5)',
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
          },
          '50%': {
            borderColor: 'rgba(0, 255, 0, 1)',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.8' },
          '94%': { opacity: '1' },
          '95%': { opacity: '0.7' },
          '96%': { opacity: '1' },
        },
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 0, 0.5)',
        'neon-red': '0 0 20px rgba(255, 0, 0, 0.5)',
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'neon-intense': '0 0 30px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.4)',
      },
    },
  },
  plugins: [],
}