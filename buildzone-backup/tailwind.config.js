// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        // semantic color tokens used throughout the app
        background: '#f7fafc',        // page background
        surface: '#ffffff',           // cards / surfaces
        muted: '#f3f4f6',             // muted blocks
        border: 'rgba(15, 23, 42, 0.06)', // subtle border
        foreground: '#0f172a',        // main text
        'muted-foreground': '#64748b',// muted text
        primary: '#0b69ff',           // primary action color
        destructive: '#dc2626'        // destructive / error
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.375rem'
      }
    }
  },
  plugins: []
};
