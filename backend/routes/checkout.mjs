import Stripe from "stripe";
import { Router } from "express";
import { products } from "../constants/index.mjs";

const router = Router();

const MAX_QUANTITY = 99;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildLineItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  const lineItems = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item?.id);
    const quantity = Number(item?.quantity);
    if (
      !product ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY
    ) {
      return null;
    }
    lineItems.push({
      quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.title,
          description: product.category,
          images: [product.image],
        },
      },
    });
  }
  return lineItems;
};

router.post("/checkout", async (req, res) => {
  const { items, email } = req.body ?? {};

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: "Faltan parámetros requeridos." });
  }

  const lineItems = buildLineItems(items);
  if (!lineItems) {
    return res.status(400).json({ error: "Carrito no válido." });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const frontendUrl = process.env.FRONTEND_URL || "https://frescago.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel`,
      metadata: {
        email,
      },
    });

    res.json({
      message: "Server is connected",
      success: true,
      id: session.id,
    });
  } catch (error) {
    console.error("Checkout error:", error.message);
    res.status(500).json({ error: "No se pudo crear la sesión de pago." });
  }
});
export default router;
