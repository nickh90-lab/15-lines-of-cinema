/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        accent: "var(--accent)", // Aurora Pink/Cyan
        muted: "var(--muted)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        heading: ["var(--font-serif)", "serif"],
        body: ["var(--font-sans)", "sans-serif"],
      },
      animation: {
        shine: "shine 3s linear infinite",
      },
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-100%) translateY(-100%) rotate(45deg)", opacity: '0' },
          "50%": { opacity: '0.5' },
          "100%": { transform: "translateX(100%) translateY(100%) rotate(45deg)", opacity: '0' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow': { textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' },
        '.text-shadow-md': { textShadow: '0 4px 6px rgba(0, 0, 0, 0.5)' },
        '.text-shadow-lg': { textShadow: '0 10px 15px rgba(0, 0, 0, 0.5)' },
        '.text-shadow-none': { textShadow: 'none' },
      })
    },
  ],
}
