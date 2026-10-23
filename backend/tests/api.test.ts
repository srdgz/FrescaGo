import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const createSession = vi.hoisted(() => vi.fn());

vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { create: createSession } };
  },
}));

const { createApp } = await import("../src/infrastructure/http/app.js");
const { createContainer } = await import("../src/infrastructure/container.js");
const { createInMemoryCatalog } = await import(
  "../src/infrastructure/catalog/InMemoryCatalogRepository.js"
);
const { makeCatalogUseCases } = await import("../src/application/catalog.js");
const { makeCreateCheckout } = await import(
  "../src/application/createCheckout.js"
);
const { createStripePaymentGateway } = await import(
  "../src/infrastructure/payments/StripePaymentGateway.js"
);
const { products } = await import("../src/infrastructure/catalog/data.js");

const rates = {
  getRate: async () => ({
    usdPerEur: 1.1,
    date: "2026-10-23",
    source: "ecb" as const,
  }),
};

const catalog = createInMemoryCatalog();
const container = {
  ...createContainer(),
  catalog: makeCatalogUseCases(catalog),
  getExchangeRate: () => rates.getRate(),
  createCheckout: makeCreateCheckout({
    catalog,
    rates,
    payments: createStripePaymentGateway(() => "sk_test_fake"),
    getFrontendUrl: () => "https://shop.test",
  }),
};
const app = createApp(container);
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

describe("localized catalog", () => {
  it("serves Spanish by default", async () => {
    const res = await request(app).get(`/productos/${product.id}`);
    expect(res.body.title).toBe("Plátanos de Canarias");
    expect(res.body.categoryLabel).toBe("Fruta");
  });

  it("serves English with ?lang=en", async () => {
    const res = await request(app).get(`/productos/${product.id}?lang=en`);
    expect(res.body.title).toBe("Canary Islands bananas");
    expect(res.body.categoryLabel).toBe("Fruit");
    expect(res.body.category).toBe("Fruta");
  });

  it("translates categories and featured items", async () => {
    const categories = await request(app).get("/categorias?lang=en");
    expect(categories.body.map((c: { title: string }) => c.title)).toEqual([
      "Fruit",
      "Vegetables",
      "Baskets",
    ]);

    const featured = await request(app).get("/destacados?lang=en");
    expect(featured.body[0].title).toBe("Assorted apples");
    expect(featured.body[0].price).toMatch(/^from \d+\.\d+€\/kg$/);
  });

  it("ignores unsupported languages", async () => {
    const res = await request(app).get(`/productos/${product.id}?lang=fr`);
    expect(res.body.title).toBe("Plátanos de Canarias");
  });
});

describe("GET /rates", () => {
  it("returns the euro to dollar rate", async () => {
    const res = await request(app).get("/rates");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      base: "EUR",
      usdPerEur: 1.1,
      date: "2026-10-23",
      source: "ecb",
    });
  });
});

describe("POST /checkout", () => {
  beforeEach(() => {
    createSession.mockReset();
    createSession.mockResolvedValue({ id: "cs_test_123" });
  });

  const send = (body: object) => request(app).post("/checkout").send(body);

  it("creates a session priced from the server catalog in euros", async () => {
    const res = await send({
      items: [{ id: product.id, quantity: 2, price: 0.01 }],
      email: "buyer@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, id: "cs_test_123" });

    const params = createSession.mock.calls[0][0];
    expect(params.line_items[0].quantity).toBe(2);
    expect(params.line_items[0].price_data.currency).toBe("eur");
    expect(params.line_items[0].price_data.unit_amount).toBe(
      Math.round(product.price * 100)
    );
    expect(params.locale).toBe("es");
    expect(params.success_url).toBe(
      "https://shop.test/es/success?session_id={CHECKOUT_SESSION_ID}"
    );
  });

  it("charges in dollars with the English site when asked", async () => {
    await send({
      items: [{ id: product.id, quantity: 1 }],
      email: "buyer@example.com",
      currency: "USD",
      locale: "en",
    });

    const params = createSession.mock.calls[0][0];
    expect(params.line_items[0].price_data.currency).toBe("usd");
    expect(params.line_items[0].price_data.unit_amount).toBe(
      Math.round(product.price * 1.1 * 100)
    );
    expect(params.line_items[0].price_data.product_data.name).toBe(
      "Canary Islands bananas"
    );
    expect(params.locale).toBe("en");
    expect(params.cancel_url).toBe("https://shop.test/en/cancel");
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
    vi.spyOn(console, "error").mockImplementation(() => {});
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
