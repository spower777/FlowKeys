import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Valid SSR hydration pattern: reading localStorage in useEffect to avoid
      // hydration mismatch. React Compiler flags this but it's intentional here.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);

export default eslintConfig;
