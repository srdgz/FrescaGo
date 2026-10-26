export type PageItem = { type: "page"; page: number } | { type: "gap"; key: string };

export const pageItems = (current: number, count: number): PageItem[] => {
  const wanted = new Set<number>();
  for (const page of [0, 1, count - 2, count - 1, current - 1, current, current + 1]) {
    if (page >= 0 && page < count) wanted.add(page);
  }

  const sorted = [...wanted].sort((a, b) => a - b);
  const items: PageItem[] = [];
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) {
      items.push({ type: "gap", key: `gap-${previous}` });
    }
    items.push({ type: "page", page });
  });
  return items;
};
