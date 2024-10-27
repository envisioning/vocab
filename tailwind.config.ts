import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
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
