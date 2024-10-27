import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              marginTop: '3rem',
              marginBottom: '1.5rem',
            },
            h2: {
              marginTop: '2.5rem',
              marginBottom: '1rem',
            },
            h3: {
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            'h1, h2, h3, h4, h5': {
              color: 'var(--foreground)',
              fontWeight: '600',
              lineHeight: '1.25',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
