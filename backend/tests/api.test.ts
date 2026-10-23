import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";

const createSession = vi.hoisted(() => vi.fn());

vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { create: createSession } };
  },
}));

const { createApp } = await import("../src/infrastructure/http/app.js");
const { products } = await import("../src/infrastructure/catalog/data.js");

const app = createApp();
const product = products[0];

describe("catalog routes", () => {
  it("lists products", async () => {
    const res = await request(app).get("/productos");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(products.length);
  });

  it("returns a product by id", async () => {
    const res = await request(app).get(`/productos/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(product.title);
  });

  it("returns 404 for an unknown product", async () => {
    const res = await request(app).get("/productos/999999");
    expect(res.status).toBe(404);
  });

  it("lists categories and featured products", async () => {
    expect((await request(app).get("/categorias")).status).toBe(200);
    expect((await request(app).get("/destacados")).status).toBe(200);
  });

  it("returns 404 for an unknown category", async () => {
    const res = await request(app).get("/categorias/999999");
    expect(res.status).toBe(404);
  });
});

describe("POST /checkout", () => {
  beforeEach(() => {
    createSession.mockReset();
    createSession.mockResolvedValue({ id: "cs_test_123" });
    process.env.FRONTEND_URL = "https://shop.test";
  });

  const send = (body: object) => request(app).post("/checkout").send(body);

  it("creates a session priced from the server catalog", async () => {
    const res = await send({
      items: [{ id: product.id, quantity: 2, price: 0.01 }],
      email: "buyer@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, id: "cs_test_123" });

    const params = createSession.mock.calls[0][0];
    expect(params.line_items[0].quantity).toBe(2);
    expect(params.line_items[0].price_data.unit_amount).toBe(
      Math.round(product.price * 100)
    );
    expect(params.success_url).toBe(
      "https://shop.test/success?session_id={CHECKOUT_SESSION_ID}"
    );
    expect(params.cancel_url).toBe("https://shop.test/cancel");
  });

  it.each([
    ["an unknown product", [{ id: 999999, quantity: 1 }]],
    ["a zero quantity", [{ id: product.id, quantity: 0 }]],
    ["a fractional quantity", [{ id: product.id, quantity: 1.5 }]],
    ["an excessive quantity", [{ id: product.id, quantity: 100 }]],
    ["an empty cart", []],
  ])("rejects %s", async (_label, items) => {
    const res = await send({ items, email: "buyer@example.com" });
    expect(res.status).toBe(400);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const res = await send({
      items: [{ id: product.id, quantity: 1 }],
      email: "not-an-email",
    });
    expect(res.status).toBe(400);
  });

  it("does not leak Stripe errors", async () => {
    createSession.mockRejectedValue(new Error("sk_live_secret exploded"));
    const res = await send({
      items: [{ id: product.id, quantity: 1 }],
      email: "buyer@example.com",
    });
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain("sk_live_secret");
  });
});

describe("CORS", () => {
  it("allows a configured origin", async () => {
    const res = await request(app)
      .get("/productos")
      .set("Origin", "https://frescago.vercel.app");
    expect(res.headers["access-control-allow-origin"]).toBe(
      "https://frescago.vercel.app"
    );
  });

  it("does not allow other origins", async () => {
    const res = await request(app)
      .get("/productos")
      .set("Origin", "https://evil.example");
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
