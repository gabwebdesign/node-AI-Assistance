import type { Config } from "tailwindcss";

export default {
  content: [
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: "var(--gray)",
        turquoise: "var(--turquoise)",
      },
    },
  },
  plugins: [],
} satisfies Config;
