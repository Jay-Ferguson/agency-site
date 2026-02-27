import { nextJsConfig } from "@workspace/eslint-config/next-js";
import globals from "globals";
/** @type {import("eslint").Linter.Config} */
export default [
  nextJsConfig,
  {
    files: ["app/**/*.js', 'app/**/*.ts"], // Only target the app folder
    languageOptions: {
      globals: {
        ...globals.node, // Adds all Node.js globals
      },
    },
  },
];
