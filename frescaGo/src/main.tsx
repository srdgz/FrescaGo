import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./presentation/App";
import { AppProvider } from "./presentation/AppContext";
import { createUseCases } from "./infrastructure/container";
import "./index.css";

const useCases = createUseCases();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider useCases={useCases}>
      <Toaster position="bottom-right" reverseOrder={false} gutter={8} />
      <App />
    </AppProvider>
  </React.StrictMode>
);
