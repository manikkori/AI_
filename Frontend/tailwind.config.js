/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#09090b",
          card: "#121215",
          elevated: "#18181c",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.04)",
        },
        accent: {
          coral: "#ff4d2d",
          orange: "#ff6a3d",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'glow-pill': '0 0 20px rgba(255, 77, 45, 0.35)',
      }
    },
  },
  plugins: [],
}
