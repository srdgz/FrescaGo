import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import express from "express";
import { parseLocale } from "../../domain/locale.js";
import { InvalidCartError, InvalidEmailError } from "../../domain/order.js";
import { createContainer } from "../container.js";
import type { Container } from "../container.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../../../public");

export const createApp = (container: Container = createContainer()) => {
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "http://localhost:5173,https://frescago.vercel.app"
  )
    .split(",")
    .map((origin) => origin.trim());

  const app = express();

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });

  app.get("/productos", (req, res) => {
    res.send(container.catalog.listProducts(parseLocale(req.query.lang)));
  });

  app.get("/productos/:id", (req, res) => {
    const product = container.catalog.getProduct(
      parseInt(req.params.id),
      parseLocale(req.query.lang)
    );
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.send(product);
  });

  app.get("/categorias", (req, res) => {
    res.send(container.catalog.listCategories(parseLocale(req.query.lang)));
  });

  app.get("/categorias/:id", (req, res) => {
    const matches = container.catalog.getCategories(
      parseInt(req.params.id),
      parseLocale(req.query.lang)
    );
    if (matches.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay productos en esta categoría" });
    }
    res.json(matches);
  });

  app.get("/destacados", (req, res) => {
    res.send(container.catalog.listFeatured(parseLocale(req.query.lang)));
  });

  app.get("/rates", async (_req, res) => {
    const rate = await container.getExchangeRate();
    res.json({ base: "EUR", ...rate });
  });

  app.post("/checkout", async (req, res) => {
    try {
      const id = await container.createCheckout({
        items: req.body?.items,
        email: req.body?.email,
        currency: req.body?.currency,
        locale: req.body?.locale,
      });
      res.json({ message: "Server is connected", success: true, id });
    } catch (error) {
      if (error instanceof InvalidEmailError || error instanceof InvalidCartError) {
        return res.status(400).json({ error: error.message });
      }
      console.error("Checkout error:", (error as Error).message);
      res.status(500).json({ error: "No se pudo crear la sesión de pago." });
    }
  });

  return app;
};
