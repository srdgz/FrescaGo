import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const layerRule = (patterns) => ({
  "no-restricted-imports": ["error", { patterns }],
});

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["src/presentation/AppContext.tsx", "src/presentation/LocaleContext.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    files: ["src/domain/**"],
    ignores: ["src/domain/__tests__/**"],
    rules: layerRule([
      {
        group: ["**/application/**", "**/infrastructure/**", "**/presentation/**"],
        message: "The domain layer cannot depend on outer layers.",
      },
      {
        group: ["react", "react-*", "firebase/*", "zustand*", "@stripe/*"],
        message: "The domain layer must stay framework free.",
      },
    ]),
  },
  {
    files: ["src/application/**"],
    ignores: ["src/application/__tests__/**"],
    rules: layerRule([
      {
        group: ["**/infrastructure/**", "**/presentation/**"],
        message: "The application layer can only depend on the domain.",
      },
      {
        group: ["react", "react-*", "firebase/*", "zustand*", "@stripe/*"],
        message: "The application layer must stay framework free.",
      },
    ]),
  },
  {
    files: ["src/infrastructure/**"],
    rules: layerRule([
      {
        group: ["**/presentation/**"],
        message: "Infrastructure cannot depend on the presentation layer.",
      },
    ]),
  },
  {
    files: ["src/presentation/**"],
    ignores: ["src/presentation/**/__tests__/**", "src/presentation/**/*.test.*"],
    rules: layerRule([
      {
        group: ["**/infrastructure/**", "firebase", "firebase/*", "@stripe/*"],
        message:
          "The presentation layer talks to the app through use cases, never to infrastructure.",
      },
    ]),
  }
);
