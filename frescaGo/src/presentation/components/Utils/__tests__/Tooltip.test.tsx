import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tooltip from "../Tooltip";

const setup = () =>
  render(
    <div>
      <Tooltip label="More about shipping">Flat fee per order.</Tooltip>
      <button type="button">Other</button>
    </div>
  );

describe("Tooltip", () => {
  it("is hidden until the user asks for it", () => {
    setup();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "More about shipping" })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("shows on hover and hides when the pointer leaves", async () => {
    setup();
    const trigger = screen.getByRole("button", { name: "More about shipping" });

    await userEvent.hover(trigger);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Flat fee per order.");

    await userEvent.unhover(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows on keyboard focus and is linked to the button", async () => {
    setup();

    await userEvent.tab();

    const trigger = screen.getByRole("button", { name: "More about shipping" });
    const tooltip = screen.getByRole("tooltip");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes with Escape without leaving the button", async () => {
    setup();
    await userEvent.tab();

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "More about shipping" })
    ).toHaveFocus();
  });

  it("opens when pressed and closes when the user taps elsewhere", async () => {
    setup();
    const trigger = screen.getByRole("button", { name: "More about shipping" });

    await userEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Other" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes when focus moves elsewhere", async () => {
    setup();
    await userEvent.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await userEvent.tab();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
