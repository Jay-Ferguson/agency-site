import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography"; 

const config = {
  darkMode: "class",
  content: [
    "src/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "../../packages/ui/src/components/**/*.{ts,tsx}",
  ],
  
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config;

export default config;
