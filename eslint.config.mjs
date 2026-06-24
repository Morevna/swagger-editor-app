import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    extends: [
      eslintPluginBetterTailwindcss.configs.recommended
    ],
    settings: {
      "better-tailwindcss": {
        entryPoint: "./src/app/globals.css",
      }
    }
  },
  prettier,
]);

export default eslintConfig;
