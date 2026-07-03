import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Feature-slice isolation: a feature may never import another feature through
  // the `@/features/*` alias. Intra-feature imports use relative paths (./ ...)
  // and are unaffected; genuinely shared code is promoted to `lib/`/`components/`.
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*"],
              message:
                "Features must not import from other features. Use relative imports within a feature, or promote shared code to `lib/`/`components/`.",
            },
          ],
        },
      ],
    },
  },

  // Disable stylistic rules that conflict with Prettier. Must stay last.
  prettier,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
