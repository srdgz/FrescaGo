import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Paginate } from "../Paginate";

describe("Paginate", () => {
  it("is a component React can render", () => {
    expect(typeof Paginate).toBe("function");

    render(
      <Paginate
        pageCount={3}
        onPageChange={() => {}}
        ariaLabelBuilder={(page) => `Page ${page}`}
      />
    );

    expect(screen.getByLabelText("Page 2")).toBeInTheDocument();
  });
});
