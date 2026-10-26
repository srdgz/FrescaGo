import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import EditProfileScreen from "../EditProfileScreen";
import { renderWithApp } from "../../../test/renderWithApp";
import { buyer, newcomer } from "../../../test/fixtures";
import type { User } from "../../../domain/user";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const Where = () => <p data-testid="where">{useLocation().pathname}</p>;

const setup = (
  user: User,
  route: string | { pathname: string; state?: unknown } = "/es/editar",
  updateProfile = vi.fn().mockResolvedValue(undefined)
) => {
  const view = renderWithApp(
    <>
      <EditProfileScreen />
      <Where />
    </>,
    { updateProfile },
    { route, state: { currentUser: user, isLoading: false } }
  );
  return { ...view, updateProfile };
};

describe("EditProfileScreen", () => {
  it("starts from the saved profile and address", async () => {
    setup(buyer);

    expect(await screen.findByLabelText("Calle y número")).toHaveValue("Calle Mayor 12, 3ºB");
    expect(screen.getByLabelText("Código postal")).toHaveValue("28013");
    expect(screen.getByLabelText("Ciudad")).toHaveValue("Madrid");
    expect(screen.getByLabelText("País")).toHaveValue("ES");
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ana");
  });

  it("offers the supported countries in the current language", async () => {
    setup(buyer);

    const country = await screen.findByLabelText("País");
    expect(country).toContainElement(screen.getByRole("option", { name: "España" }));
    expect(screen.getByRole("option", { name: "Alemania" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(7);
  });

  it("marks the address fields as required", async () => {
    setup(newcomer);

    for (const label of ["Calle y número", "Código postal", "Ciudad", "País"]) {
      expect(await screen.findByLabelText(label)).toBeRequired();
    }
  });

  it("saves the shipping address and goes back to the account", async () => {
    const { updateProfile } = setup(newcomer);

    await userEvent.type(await screen.findByLabelText("Calle y número"), "Calle Sol 4");
    await userEvent.type(screen.getByLabelText("Código postal"), "28001");
    await userEvent.type(screen.getByLabelText("Ciudad"), "Madrid");
    await userEvent.selectOptions(screen.getByLabelText("País"), "PT");
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(updateProfile).toHaveBeenCalledWith(
      newcomer,
      expect.objectContaining({
        firstName: "Luis",
        street: "Calle Sol 4",
        postalCode: "28001",
        city: "Madrid",
        country: "PT",
      }),
      null
    );
    expect(toast.success).toHaveBeenCalled();
    expect(await screen.findByText("/es/usuario")).toBeInTheDocument();
  });

  it("returns to the cart after saving when the shopper came from it", async () => {
    setup(buyer, { pathname: "/es/editar", state: { returnTo: "shop" } });

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Completa tu dirección de envío para poder terminar la compra."
    );
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByText("/es/tienda")).toBeInTheDocument();
  });

  it("stays on the page and warns when saving fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    setup(buyer, "/es/editar", vi.fn().mockRejectedValue(new Error("offline")));

    await userEvent.click(await screen.findByRole("button", { name: "Guardar" }));

    expect(toast.error).toHaveBeenCalled();
    expect(screen.getByTestId("where")).toHaveTextContent("/es/editar");
  });

  it("reuses the old single line address as the street", async () => {
    setup({ ...newcomer, address: "Calle Vieja 3" });

    expect(await screen.findByLabelText("Calle y número")).toHaveValue("Calle Vieja 3");
    expect(screen.getByLabelText("Código postal")).toHaveValue("");
  });
});
