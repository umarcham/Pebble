import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { cream: "#F3EDE0", ink: "#2B2420" },
    fontFamily: { display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"], body: ["'Instrument Sans'", "system-ui", "sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
