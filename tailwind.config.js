/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          activity: '#333333',
          border: '#3c3c3c',
          activeTab: '#1e1e1e',
          inactiveTab: '#2d2d2d',
          accent: '#007acc',
          status: '#007acc',
          text: '#cccccc',
          muted: '#858585',
          card: '#252526'
        },
        discord: {
          dark: '#1e1f22',
          sidebar: '#2b2d31',
          server: '#1e1f22',
          channel: '#313338',
          accent: '#5865f2',
          green: '#23a55a',
          yellow: '#f0b232',
          red: '#f23f43',
          text: '#dbdee1',
          muted: '#949ba4'
        },
        whatsapp: {
          dark: '#111b21',
          sidebar: '#202c33',
          header: '#202c33',
          accent: '#25d366',
          teal: '#00a884',
          bubbleOut: '#005c4b',
          bubbleIn: '#202c33',
          checkBlue: '#53bdeb',
          text: '#e9edef',
          muted: '#8696a0'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
