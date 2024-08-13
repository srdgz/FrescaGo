import { Router } from "express";
import { products } from "../constants/index.mjs";

const router = Router();

router.get("/productos", (_req, res) => {
  res.send(products);
});

router.get("/productos/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((item) => item.id === productId);

  if (!productId) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  res.send(product);
});

export default router;
