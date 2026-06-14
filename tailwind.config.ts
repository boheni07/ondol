import type { Config } from "tailwindcss";

// 디자인 토큰 출처: docs/07-design-system.md §1 (인증 슬라이스에 필요한 토큰만 발췌)
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#D6EDF3",
          200: "#A8D6E4",
          300: "#72BBCF",
          400: "#479DB6",
          500: "#3B7D8E",
          600: "#316878",
          700: "#265462",
          800: "#1C404B",
          900: "#122D36",
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        surface: {
          page: "#F9FAFB",
          card: "#FFFFFF",
        },
        // Semantic (docs/07 §1-6)
        success: { bg: "#EDFAF3", text: "#276B4C", border: "#3EA673" },
        warning: { bg: "#FFF5E6", text: "#B56F10", border: "#E8991E" },
        error: { bg: "#FEF0F0", text: "#BF3030", border: "#E04545" },
        info: { bg: "#EEF4FD", text: "#2E5FA8", border: "#4377C0" },
      },
      borderRadius: {
        xl: "0.75rem",
      },
      boxShadow: {
        "elevation-1": "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
      },
      maxWidth: {
        md: "28rem",
      },
      ringColor: {
        DEFAULT: "#3B7D8E",
      },
    },
  },
  plugins: [],
};

export default config;
