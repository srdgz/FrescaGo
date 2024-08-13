import { Router } from "express";
import { generalProductsData } from "../constants/index.mjs";

const router = Router();

router.get("/destacados", (_req, res) => {
  res.send(generalProductsData);
});

export default router;
