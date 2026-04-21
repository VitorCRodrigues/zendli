import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores principais Zendli
        jade: {
          DEFAULT: '#38C9A0',
          dark:    '#17594A',
          light:   '#E8F8F2',
        },
        night:  '#0F1A2E',
        mist:   '#F5FAF8',
        menta:  '#E8F8F2',

        // Status semânticos
        status: {
          agendado:                { bg: '#E6F1FB', text: '#185FA5' },
          aguardando:              { bg: '#FAEEDA', text: '#854F0B' },
          confirmado:              { bg: '#E1F5EE', text: '#0F6E56' },
          cancelado:               { bg: '#FCEBEB', text: '#A32D2D' },
          reagendamento_solicitado:{ bg: '#EEEDFE', text: '#534AB7' },
          reagendado:              { bg: '#EDE9FE', text: '#4C1D95' },
          concluido:               { bg: '#F1EFE8', text: '#5F5E5A' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        tight:   '-0.4px',
        tighter: '-0.8px',
        label:   '0.06em',
      },
      borderRadius: {
        brand: '28%',
      },
    },
  },
  plugins: [],
}

export default config
