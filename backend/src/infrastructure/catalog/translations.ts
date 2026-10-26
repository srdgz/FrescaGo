export const productTitlesEn: Record<number, string> = {
  2001: "Canary Islands bananas",
  2002: "Bananas",
  2003: "Galia melon",
  2004: "Cantaloupe melon",
  2005: "Nectarine",
  2006: "Ercolini pears",
  2007: "Avocados",
  2008: "Large strawberries",
  2009: "Golden apples",
  2010: "Oranges",
  2011: "Black watermelon",
  2012: "Kiwi",
  2013: "Lemons",
  2014: "Cherry tomatoes",
  2015: "Carrots",
  2016: "Red peppers",
  2017: "Courgettes",
  2018: "Lettuce hearts",
  2019: "Aubergines",
  2020: "Iceberg lettuce",
  2021: "Cauliflower",
  2022: "Batavia lettuce",
  2023: "Potatoes",
  2024: "Garlic",
  2025: "Onions",
  2026: "Radishes",
  2027: "Vine tomatoes",
  2028: "Fruit basket",
  2029: "Vegetable basket",
  2030: "Mixed basket",
};

export const featuredTitlesEn: Record<number, string> = {
  3001: "Assorted apples",
  3002: "Bananas and plantains",
  3003: "Leafy green vegetables",
  3004: "Assorted tomatoes",
};

export const categoryLabelsEn: Record<string, string> = {
  Fruta: "Fruit",
  Frutas: "Fruit",
  Verdura: "Vegetables",
  Verduras: "Vegetables",
  Cestas: "Baskets",
};

export const localizeFeaturedPrice = (price: string): string =>
  price
    .replace(/^desde/i, "from")
    .replace(/(\d),(\d)/g, "$1.$2")
    .replace(/Kg/g, "kg");
