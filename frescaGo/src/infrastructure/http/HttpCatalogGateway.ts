import type { CatalogGateway } from "../../application/ports";

export const createHttpCatalogGateway = (baseUrl: string): CatalogGateway => {
  const get = async <T>(path: string): Promise<T> => {
    const response = await fetch(`${baseUrl}${path}`, {
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

  return {
    getFeatured: () => get("/destacados"),
    getCategories: () => get("/categorias"),
    getProducts: () => get("/productos"),
    getProduct: (id) => get(`/productos/${id}`),
  };
};
