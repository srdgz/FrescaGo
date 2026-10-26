import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const createSession = vi.hoisted(() => vi.fn());
const retrieveSession = vi.hoisted(() => vi.fn());

vi.mock("stripe", () => ({
  default: class {
    checkout = {
      sessions: { create: createSession, retrieve: retrieveSession },
    };
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

const shipping = {
  recipient: "Ana Pérez",
  phone: "+34 600 123 123",
  street: "Calle Mayor 12, 3ºB",
  postalCode: "28013",
  city: "Madrid",
  country: "ES",
};

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
    createSession.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/c/pay/cs_test_123",
    });
  });

  const send = (body: object) =>
    request(app)
      .post("/checkout")
      .send({ shipping, ...body });

  it("creates a session priced from the server catalog in euros", async () => {
    const res = await send({
      items: [{ id: product.id, quantity: 2, price: 0.01 }],
      email: "buyer@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      id: "cs_test_123",
      url: "https://checkout.stripe.com/c/pay/cs_test_123",
    });

    const params = createSession.mock.calls[0][0];
    expect(params.line_items[0].quantity).toBe(2);
    expect(params.line_items[0].price_data.currency).toBe("eur");
    expect(params.line_items[0].price_data.unit_amount).toBe(
      Math.round(product.price * 100)
    );
    expect(params.allowed_payment_method_types).toEqual(["card"]);
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

  it("fails without leaking details when Stripe returns no payment page", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    createSession.mockResolvedValue({ id: "cs_test_123", url: null });

    const res = await send({
      items: [{ id: product.id, quantity: 1 }],
      email: "buyer@example.com",
    });

    expect(res.status).toBe(500);
    expect(res.body.url).toBeUndefined();
  });

  it("sends the shipping address to Stripe", async () => {
    await send({
      items: [{ id: product.id, quantity: 1 }],
      email: "buyer@example.com",
    });

    expect(createSession.mock.calls[0][0].payment_intent_data.shipping).toEqual({
      name: "Ana Pérez",
      phone: "+34 600 123 123",
      address: {
        line1: "Calle Mayor 12, 3ºB",
        postal_code: "28013",
        city: "Madrid",
        country: "ES",
      },
    });
  });

  it("charges the shipping fee as its own line below the free shipping limit", async () => {
    await send({
      items: [{ id: product.id, quantity: 2 }],
      email: "buyer@example.com",
    });

    const lines = createSession.mock.calls[0][0].line_items;
    expect(lines).toHaveLength(2);
    expect(lines[1]).toEqual({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: 499,
        product_data: { name: "Envío" },
      },
    });
  });

  it("does not charge shipping above 30 euros", async () => {
    await send({
      items: [{ id: product.id, quantity: 20 }],
      email: "buyer@example.com",
    });

    const lines = createSession.mock.calls[0][0].line_items;
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(20);
  });

  it("charges the shipping fee in dollars with an English label", async () => {
    await send({
      items: [{ id: product.id, quantity: 1 }],
      email: "buyer@example.com",
      currency: "USD",
      locale: "en",
    });

    const [, shippingLine] = createSession.mock.calls[0][0].line_items;
    expect(shippingLine.price_data).toEqual({
      currency: "usd",
      unit_amount: 549,
      product_data: { name: "Shipping" },
    });
  });

  it("ignores a shipping price sent by the client", async () => {
    await send({
      items: [{ id: product.id, quantity: 1 }],
      email: "buyer@example.com",
      shippingCents: 0,
      shippingFee: 0,
    });

    expect(createSession.mock.calls[0][0].line_items[1].price_data.unit_amount).toBe(499);
  });

  it("rejects a checkout without a shipping address", async () => {
    const res = await send({
      items: [{ id: product.id, quantity: 1 }],
      email: "buyer@example.com",
      shipping: null,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Dirección de envío no válida.");
    expect(createSession).not.toHaveBeenCalled();
  });

  it("rejects an incomplete or unsupported shipping address", async () => {
    for (const bad of [
      { ...shipping, street: "" },
      { ...shipping, city: undefined },
      { ...shipping, country: "XX" },
      { ...shipping, postalCode: "!!" },
    ]) {
      const res = await send({
        items: [{ id: product.id, quantity: 1 }],
        email: "buyer@example.com",
        shipping: bad,
      });
      expect(res.status).toBe(400);
    }
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

describe("checkout metadata", () => {
  beforeEach(() => {
    createSession.mockReset();
    createSession.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/c/pay/cs_test_123",
    });
  });

  it("records what is needed to rebuild the order after the payment", async () => {
    await request(app)
      .post("/checkout")
      .send({
        shipping,
        items: [
          { id: product.id, quantity: 2 },
          { id: products[1].id, quantity: 1 },
        ],
        email: "buyer@example.com",
        currency: "USD",
        locale: "en",
      });

    const { metadata } = createSession.mock.calls[0][0];
    expect(JSON.parse(metadata.items)).toEqual([
      [product.id, 2],
      [products[1].id, 1],
    ]);
    expect(metadata).toMatchObject({
      email: "buyer@example.com",
      currency: "USD",
      locale: "en",
      usdPerEur: "1.1",
      ship_recipient: "Ana Pérez",
      ship_street: "Calle Mayor 12, 3ºB",
      ship_postalCode: "28013",
      ship_city: "Madrid",
      ship_country: "ES",
    });
  });

  it("rejects carts with too many lines", async () => {
    const res = await request(app)
      .post("/checkout")
      .send({
        shipping,
        items: Array.from({ length: 41 }, () => ({
          id: product.id,
          quantity: 1,
        })),
        email: "buyer@example.com",
      });

    expect(res.status).toBe(400);
    expect(createSession).not.toHaveBeenCalled();
  });
});

describe("GET /checkout/sessions/:id", () => {
  const sessionId = "cs_test_a1B2c3D4e5F6g7H8";
  const url = (id = sessionId) => "/checkout/sessions/" + encodeURIComponent(id);
  const paidSession = (overrides = {}) => ({
    id: sessionId,
    payment_status: "paid",
    amount_total: 877,
    created: 1_790_000_000,
    metadata: {
      email: "buyer@example.com",
      currency: "EUR",
      locale: "es",
      usdPerEur: "1.1",
      items: JSON.stringify([[product.id, 2]]),
      ship_recipient: "Ana Pérez",
      ship_phone: "",
      ship_street: "Calle Mayor 12, 3ºB",
      ship_postalCode: "28013",
      ship_city: "Madrid",
      ship_country: "ES",
    },
    ...overrides,
  });

  beforeEach(() => {
    retrieveSession.mockReset();
  });

  it("returns the order rebuilt from what was paid", async () => {
    retrieveSession.mockResolvedValue(paidSession());

    const res = await request(app).get(url());

    expect(res.status).toBe(200);
    expect(res.headers["cache-control"]).toBe("no-store");
    expect(res.body).toMatchObject({
      paymentId: sessionId,
      email: "buyer@example.com",
      currency: "EUR",
      exchangeRate: 1.1,
      amountPaid: 8.77,
      shippingCost: 4.99,
      createdAt: new Date(1_790_000_000 * 1000).toISOString(),
      shipping: { recipient: "Ana Pérez", city: "Madrid", country: "ES" },
    });
    expect(res.body.items).toEqual([
      expect.objectContaining({
        id: product.id,
        title: "Plátanos de Canarias",
        price: product.price,
        quantity: 2,
      }),
    ]);
    expect(retrieveSession).toHaveBeenCalledWith(sessionId);
  });

  it("rebuilds the order in the language of the purchase", async () => {
    retrieveSession.mockResolvedValue(
      paidSession({ metadata: { ...paidSession().metadata, locale: "en" } })
    );

    const res = await request(app).get(url());

    expect(res.body.items[0].title).toBe("Canary Islands bananas");
    expect(res.body.items[0].categoryLabel).toBe("Fruit");
  });

  it("fails loudly when a paid session points outside the catalog", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    retrieveSession.mockResolvedValue(
      paidSession({
        metadata: {
          ...paidSession().metadata,
          items: JSON.stringify([[999999, 1]]),
        },
      })
    );

    const res = await request(app).get(url());

    expect(res.status).toBe(500);
  });

  it("refuses an order that has not been paid", async () => {
    retrieveSession.mockResolvedValue(paidSession({ payment_status: "unpaid" }));

    const res = await request(app).get(url());

    expect(res.status).toBe(402);
    expect(res.body.error).toBe("El pago todavía no se ha completado.");
  });

  it("answers 404 when Stripe does not know the session", async () => {
    retrieveSession.mockRejectedValue(
      Object.assign(new Error("No such session"), { code: "resource_missing" })
    );

    const res = await request(app).get(url());

    expect(res.status).toBe(404);
  });

  it("answers 404 for sessions created before the order data was recorded", async () => {
    retrieveSession.mockResolvedValue(
      paidSession({ metadata: { email: "buyer@example.com", currency: "EUR" } })
    );

    const res = await request(app).get(url());

    expect(res.status).toBe(404);
  });

  it.each([
    "abc",
    "cs_test_",
    "../../etc/passwd",
    "cs_test_a b",
    "pi_test_a1B2c3D4e5F6",
  ])("rejects the malformed id %s without calling Stripe", async (id) => {
    const res = await request(app).get(url(id));

    expect(res.status).toBe(400);
    expect(retrieveSession).not.toHaveBeenCalled();
  });

  it("does not leak Stripe errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    retrieveSession.mockRejectedValue(new Error("sk_live_secret exploded"));

    const res = await request(app).get(url());

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
