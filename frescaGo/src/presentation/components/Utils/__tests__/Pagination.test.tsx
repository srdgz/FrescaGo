import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../Pagination";
import { accessibilityViolations } from "../../../../test/axe";

const setup = (page: number, pageCount: number, onChange = vi.fn()) => {
  render(<Pagination page={page} pageCount={pageCount} onChange={onChange} />);
  return onChange;
};

describe("Pagination", () => {
  it("renders nothing for a single page", () => {
    const { container } = render(
      <Pagination page={0} pageCount={1} onChange={() => {}} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("is a labelled navigation made of a real list", () => {
    setup(0, 3);

    const nav = screen.getByRole("navigation", { name: "Paginación" });
    const list = within(nav).getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(5);
  });

  it("marks the current page and names every control", () => {
    setup(1, 3);

    expect(screen.getByRole("button", { name: "Página 2" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("button", { name: "Página 1" })).not.toHaveAttribute(
      "aria-current"
    );
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Página siguiente" })).toBeEnabled();
  });

  it("disables the arrows at both ends", () => {
    const { unmount } = render(
      <Pagination page={0} pageCount={3} onChange={() => {}} />
    );
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Página siguiente" })).toBeEnabled();
    unmount();

    render(<Pagination page={2} pageCount={3} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Página siguiente" })).toBeDisabled();
  });

  it("goes to the page that is chosen", async () => {
    const onChange = setup(0, 4);

    await userEvent.click(screen.getByRole("button", { name: "Página 3" }));
    await userEvent.click(screen.getByRole("button", { name: "Página siguiente" }));

    expect(onChange).toHaveBeenNthCalledWith(1, 2);
    expect(onChange).toHaveBeenNthCalledWith(2, 1);
  });

  it("can be used with the keyboard alone", async () => {
    const onChange = setup(0, 3);

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Página 1" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Página 2" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("hides the gaps from assistive technology", () => {
    setup(0, 12);

    const gaps = screen.getAllByText("…");
    expect(gaps.length).toBeGreaterThan(0);
    for (const gap of gaps) expect(gap).toHaveAttribute("aria-hidden", "true");
  });

  it("has no accessibility violations", async () => {
    setup(4, 12);

    expect(await accessibilityViolations()).toEqual([]);
  });
});
