/** @type {import('tailwindcss').Config} */
module.exports = {
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
}

