import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "big-stone": {
          50: "#f2f7fd",
          100: "#e4edfa",
          200: "#c3dbf4",
          300: "#8fbeea",
          400: "#539ddd",
          500: "#2d80ca",
          600: "#1e64ab",
          700: "#19508b",
          800: "#194673",
          900: "#1a3b60",
          950: "#132a47",
          1000: "#0f2139",
        },
        "sky-blue": {
          50: "#edfcfe",
          100: "#d1f5fc",
          200: "#a8eaf9",
          300: "#6cd9f4",
          400: "#29bee7",
          500: "#0da1cd",
          600: "#0e80ac",
          700: "#12678c",
          800: "#185572",
          900: "#194760",
          950: "#0a2d42",
        },
        "mint-green": {
          200: "#70C69B",
        },
        wheat: {
          200: "#EEE0BD",
        },
        yellow: {
          500: "#EACD3F",
        },
        green: "#90BA36",
        ramps: {
          green: "#A4B591",
          yellow: "#F5EBB8",
          red: "#F7BA93",
        },
        "deep-ocean": "#132A47",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-spline-sans)"],
      },
      listStyleType: {
        circle: "circle",
        square: "square",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
