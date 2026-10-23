import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import categorias from "./routes/categorias.mjs";
import checkout from "./routes/checkout.mjs";
import destacados from "./routes/destacados.mjs";
import productos from "./routes/productos.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createApp = () => {
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "http://localhost:5173,https://frescago.vercel.app"
  )
    .split(",")
    .map((origin) => origin.trim());

  const app = express();

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  for (const router of [categorias, checkout, destacados, productos]) {
    app.use("/", router);
  }

  app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  return app;
};
