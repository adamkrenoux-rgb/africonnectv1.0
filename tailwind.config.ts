import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        africa: {
          earth: '#8B4513',
          gold: '#FFD700',
          green: '#228B22',
          blue: '#1E90FF',
          sunset: '#FF6B35',
          savanna: '#D4AF37',
          forest: '#2D5016',
          sky: '#87CEEB',
          vibrant: {
            orange: '#FF8C00',
            red: '#DC143C',
            yellow: '#FFD700',
            green: '#32CD32',
            purple: '#8A2BE2',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
