import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Registration from "../Registration";
import { renderWithApp } from "../../../../test/renderWithApp";
import { AuthError } from "../../../../domain/user";

const fillName = async () => {
  await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
  await userEvent.type(screen.getByLabelText("Apellido"), "Pérez");
  await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
};

const fillPasswords = async (password: string, confirmation: string) => {
  await userEvent.type(screen.getByLabelText("Contraseña"), password);
  await userEvent.type(screen.getByLabelText("Repite la contraseña"), confirmation);
};

const submit = () => userEvent.click(screen.getByRole("button", { name: "Registrar" }));

describe("Registration", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("labels every field so it can be reached by its name", () => {
    renderWithApp(<Registration />);

    for (const label of [
      "Nombre",
      "Apellido",
      "Email",
      "Contraseña",
      "Repite la contraseña",
    ]) {
      expect(screen.getByLabelText(label)).toBeRequired();
    }
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Contraseña")).toHaveAttribute(
      "autocomplete",
      "new-password"
    );
    expect(screen.getByLabelText("Repite la contraseña")).toHaveAttribute(
      "autocomplete",
      "new-password"
    );
  });

  it("registers the user when both passwords match", async () => {
    const register = vi.fn().mockResolvedValue(undefined);
    renderWithApp(<Registration />, { register });

    await fillName();
    await fillPasswords("secret123", "secret123");
    await submit();

    expect(register).toHaveBeenCalledWith(
      {
        firstName: "Ana",
        lastName: "Pérez",
        email: "ana@example.com",
        password: "secret123",
      },
      null
    );
  });

  it("does not send the confirmation to the account service", async () => {
    const register = vi.fn().mockResolvedValue(undefined);
    renderWithApp(<Registration />, { register });

    await fillName();
    await fillPasswords("secret123", "secret123");
    await submit();

    expect(Object.keys(register.mock.calls[0][0])).not.toContain("confirmPassword");
  });

  it("tells the user when the passwords differ and registers nobody", async () => {
    const register = vi.fn();
    renderWithApp(<Registration />, { register });

    await fillName();
    await fillPasswords("secret123", "secret124");
    await userEvent.tab();

    expect(await screen.findByText("Las contraseñas no coinciden.")).toBeInTheDocument();
    const confirmation = screen.getByLabelText("Repite la contraseña");
    expect(confirmation).toHaveAttribute("aria-invalid", "true");
    expect(confirmation).toHaveAccessibleDescription("Las contraseñas no coinciden.");

    await submit();

    expect(register).not.toHaveBeenCalled();
    expect(confirmation).toHaveFocus();
  });

  it("clears the warning as soon as the passwords match", async () => {
    renderWithApp(<Registration />);
    await fillPasswords("secret123", "secret12");
    await userEvent.tab();
    expect(await screen.findByText("Las contraseñas no coinciden.")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Repite la contraseña"), "3");

    expect(screen.queryByText("Las contraseñas no coinciden.")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Repite la contraseña")).not.toHaveAttribute(
      "aria-invalid"
    );
  });

  it("asks for at least eight characters", async () => {
    const register = vi.fn();
    renderWithApp(<Registration />, { register });

    await fillName();
    await fillPasswords("short12", "short12");
    await submit();

    const password = screen.getByLabelText("Contraseña");
    expect(register).not.toHaveBeenCalled();
    expect(password).toHaveFocus();
    expect(password).toHaveAttribute("aria-invalid", "true");
    expect(password).toHaveAccessibleDescription("Mínimo 8 caracteres.");
  });

  it("shows and hides both passwords with one keyboard friendly button", async () => {
    renderWithApp(<Registration />);
    const password = screen.getByLabelText("Contraseña");
    const confirmation = screen.getByLabelText("Repite la contraseña");
    expect(password).toHaveAttribute("type", "password");

    const [toggle] = screen.getAllByRole("button", { name: "Mostrar contraseña" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);

    expect(password).toHaveAttribute("type", "text");
    expect(confirmation).toHaveAttribute("type", "text");
    expect(
      screen.getAllByRole("button", { name: "Ocultar contraseña" })[0]
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("announces a known error from the account service", async () => {
    const register = vi.fn().mockRejectedValue(new AuthError("email-already-in-use"));
    renderWithApp(<Registration />, { register });

    await fillName();
    await fillPasswords("secret123", "secret123");
    await submit();

    expect(await screen.findByRole("alert")).toHaveTextContent(/ya está registrado/i);
  });

  it("announces the fallback message for an unexpected error", async () => {
    const register = vi.fn().mockRejectedValue(new Error("boom"));
    renderWithApp(<Registration />, { register });

    await fillName();
    await fillPasswords("secret123", "secret123");
    await submit();

    expect(await screen.findByRole("alert")).toHaveTextContent(/algo no ha funcionado/i);
  });

  it("explains the confirmation in English", async () => {
    renderWithApp(<Registration />, {}, { locale: "en" });
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.type(screen.getByLabelText("Repeat the password"), "other");
    await userEvent.tab();

    expect(await screen.findByText("The passwords do not match.")).toBeInTheDocument();
    expect(screen.getByText("At least 8 characters.")).toBeInTheDocument();
  });
});
