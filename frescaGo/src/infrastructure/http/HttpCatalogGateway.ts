import type { CatalogGateway, RatesGateway } from "../../application/ports";
import { FALLBACK_USD_PER_EUR } from "../../domain/currency";

const getJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
  if (!response.ok) {
    throw new Error(`Data fetching error: ${response.statusText}`);
  }
  return response.json();
};

export const createHttpCatalogGateway = (baseUrl: string): CatalogGateway => ({
  getFeatured: (locale) => getJson(`${baseUrl}/destacados?lang=${locale}`),
  getCategories: (locale) => getJson(`${baseUrl}/categorias?lang=${locale}`),
  getProducts: (locale) => getJson(`${baseUrl}/productos?lang=${locale}`),
  getProduct: (id, locale) =>
    getJson(`${baseUrl}/productos/${id}?lang=${locale}`),
});

export const createHttpRatesGateway = (baseUrl: string): RatesGateway => ({
  async getRate() {
    try {
      return await getJson(`${baseUrl}/rates`);
    } catch (error) {
      console.error("Exchange rate error:", error);
      return {
        usdPerEur: FALLBACK_USD_PER_EUR,
        date: new Date().toISOString().slice(0, 10),
        source: "fallback",
      };
    }
  },
});
