/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f6f3ee",
        ink: {
          DEFAULT: "#1f1c18",
          hover: "#3a342d",
        },
        card: "#fffdf9",
        line: {
          DEFAULT: "#e4ded4",
          soft: "#efeae1",
        },
        field: "#d9d2c6",
        muted: "#6b645a",
        faint: "#9a9186",
        dim: "#8a8176",
        label: "#4a443c",
        chip: "#ece6dc",
        dark: "#2a2520",
        cream: "#efe8dc",
        sand: "#b8ad9c",
        clay: "#c9c0b2",
        copy: "#34302a",
        row: "#faf7f1",
        cover: "#f6f1e7",
        track: "#443d35",
        stone: "#8c8272",
        accent: "oklch(0.5 0.12 40)",
        avatar: "oklch(0.55 0.1 40)",
        gold: "oklch(0.72 0.1 80)",
        success: {
          DEFAULT: "oklch(0.48 0.09 150)",
          dark: "oklch(0.42 0.09 150)",
        },
        danger: {
          DEFAULT: "oklch(0.55 0.13 30)",
          text: "oklch(0.5 0.13 30)",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "serif"],
        sans: ["Instrument Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "toast-in": {
          from: { opacity: "0", transform: "translate(-50%, 8px)" },
          to: { opacity: "1", transform: "translate(-50%, 0)" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
