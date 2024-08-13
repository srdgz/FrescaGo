import { Router } from "express";
import { categories } from "../constants/index.mjs";

const router = Router();

router.get("/categorias", (_req, res) => {
  res.send(categories);
});

router.get("/categorias/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const matchedProducts = categories?.filter((item) => item.id === id);

  if (!matchedProducts || matchedProducts.length === 0) {
    return res
      .status(404)
      .json({ message: "No hay productos en esta categoría" });
  }
  res.json(matchedProducts);
});

export default router;
