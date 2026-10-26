import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { renderWithApp } from "../../../../test/renderWithApp";
import { AuthError } from "../../../../domain/user";

const setup = (signIn = vi.fn().mockResolvedValue(undefined)) => {
  renderWithApp(<Login setLogin={() => {}} />, { signIn });
  return signIn;
};

describe("Login", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("labels its fields and asks the browser to help", () => {
    setup();

    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Contraseña")).toHaveAttribute(
      "autocomplete",
      "current-password"
    );
    expect(screen.getByRole("form", { name: "Iniciar Sesión" })).toBeInTheDocument();
  });

  it("signs in with the typed credentials", async () => {
    const signIn = setup();

    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Contraseña"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    expect(signIn).toHaveBeenCalledWith("ana@example.com", "secret123");
  });

  it("shows and hides the password with a labelled button", async () => {
    setup();
    const password = screen.getByLabelText("Contraseña");

    await userEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
    expect(password).toHaveAttribute("type", "text");

    await userEvent.click(screen.getByRole("button", { name: "Ocultar contraseña" }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("announces a wrong password", async () => {
    const signIn = vi.fn().mockRejectedValue(new AuthError("invalid-credential"));
    setup(signIn);

    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Contraseña"), "nope");
    await userEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El email o la contraseña no coinciden"
    );
  });

  it("clears the previous error when trying again", async () => {
    const signIn = vi
      .fn()
      .mockRejectedValueOnce(new AuthError("wrong-password"))
      .mockResolvedValueOnce(undefined);
    setup(signIn);
    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Contraseña"), "nope");
    await userEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
