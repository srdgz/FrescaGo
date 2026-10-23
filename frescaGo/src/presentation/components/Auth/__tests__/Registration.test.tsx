import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import Registration from "../Registration";
import { renderWithApp } from "../../../../test/renderWithApp";
import { AuthError } from "../../../../domain/user";

const fill = (name: string, value: string) => {
  const input = document.querySelector(`input[name="${name}"]`);
  fireEvent.change(input as Element, { target: { value } });
};

const fillForm = () => {
  fill("firstName", "Ana");
  fill("lastName", "Pérez");
  fill("email", "ana@example.com");
  fill("password", "secret1");
  fireEvent.submit(document.querySelector("form") as HTMLFormElement);
};

describe("Registration", () => {
  it("registers the user with the form values", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const register = vi.fn().mockResolvedValue(undefined);
    renderWithApp(<Registration />, { register });

    fillForm();

    await vi.waitFor(() =>
      expect(register).toHaveBeenCalledWith(
        {
          firstName: "Ana",
          lastName: "Pérez",
          email: "ana@example.com",
          password: "secret1",
        },
        null
      )
    );
  });

  it("shows a friendly message for a known error", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const register = vi
      .fn()
      .mockRejectedValue(new AuthError("email-already-in-use"));
    renderWithApp(<Registration />, { register });

    fillForm();

    expect(await screen.findByText(/ya está registrado/i)).toBeInTheDocument();
  });

  it("shows the fallback message for an unexpected error", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const register = vi.fn().mockRejectedValue(new Error("boom"));
    renderWithApp(<Registration />, { register });

    fillForm();

    expect(await screen.findByText(/algo no ha funcionado/i)).toBeInTheDocument();
  });
});
