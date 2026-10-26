import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import UserInfo from "../UserInfo";
import { renderWithApp } from "../../../../test/renderWithApp";
import { buyer, newcomer } from "../../../../test/fixtures";

describe("UserInfo", () => {
  it("reminds the shopper to add a shipping address", () => {
    renderWithApp(<UserInfo currentUser={newcomer} />);

    expect(
      screen.getByText(/Añade tu dirección de envío para poder hacer pedidos/)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Añadir dirección" })).toHaveAttribute(
      "href",
      "/es/editar"
    );
  });

  it("does not nag when the address is complete", () => {
    renderWithApp(<UserInfo currentUser={buyer} />);

    expect(screen.queryByText(/Añade tu dirección de envío/)).not.toBeInTheDocument();
  });

  it("welcomes the user by name with initials as the avatar", () => {
    const { container } = renderWithApp(<UserInfo currentUser={buyer} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ana Pérez");
    expect(container).toHaveTextContent("AP");
    expect(container.querySelector("img")).toBeNull();
  });
});
