import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from 'typescript-eslint';
import react from "eslint-plugin-react";
import vitestPlugin from "@vitest/eslint-plugin";
import storybook from "eslint-plugin-storybook";
import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";
import unusedImports from "eslint-plugin-unused-imports";
import prettierConfig from "eslint-config-prettier";

const compat = new FlatCompat();

const config = [
  {
    ignores: [
      "**/.next/**",
      "node_modules/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
  },

  ...compat.extends("next"),
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),

  eslint.configs.recommended,
  ...tseslint.configs.strict,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  vitestPlugin.configs.recommended,
  testingLibrary.configs["flat/react"],
  jestDom.configs["flat/recommended"],
  ...storybook.configs["flat/recommended"],
  ...compat.extends('plugin:react-hooks/recommended'),

  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
    },
  },

  {
    rules: {
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "jsx-a11y/anchor-is-valid": "error",
    },
  },
  { settings: { react: { version: "detect" } },
    rules: {
      "react/prop-types": "off",    
      "react/no-danger": "off",
      "react/self-closing-comp": "error",
      "react/hook-use-state": "off",
      "react/jsx-pascal-case": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-fragments": "error",
      "react/jsx-sort-props": "error",
      "react/jsx-no-useless-fragment": "error",
    },
  },
  prettierConfig,
];

export default config;