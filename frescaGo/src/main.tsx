import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./presentation/App";
import { AppProvider } from "./presentation/AppContext";
import { setupI18n } from "./presentation/i18n";
import {
  detectBrowserLocale,
  localeFromPathname,
} from "./presentation/routes/paths";
import { createUseCases } from "./infrastructure/container";
import "./index.css";

setupI18n(
  localeFromPathname(window.location.pathname) ??
    detectBrowserLocale(navigator.languages ?? [navigator.language])
);

const useCases = createUseCases();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider useCases={useCases}>
      <Toaster position="bottom-right" reverseOrder={false} gutter={8} />
      <App />
    </AppProvider>
  </React.StrictMode>
);
