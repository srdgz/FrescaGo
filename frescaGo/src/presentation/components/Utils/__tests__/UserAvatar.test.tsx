import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import UserAvatar from "../UserAvatar";

describe("UserAvatar", () => {
  it("shows the photo when there is one", () => {
    const { container } = render(
      <UserAvatar
        user={{ avatar: "https://img/ana.png", firstName: "Ana", lastName: "Pérez" }}
      />
    );

    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://img/ana.png"
    );
  });

  it("falls back to the initials", () => {
    const { container } = render(
      <UserAvatar user={{ avatar: null, firstName: "ana", lastName: "pérez" }} />
    );

    expect(container.querySelector("img")).toBeNull();
    expect(container).toHaveTextContent("AP");
  });

  it("uses one initial when there is only a first name", () => {
    const { container } = render(
      <UserAvatar user={{ avatar: null, firstName: "Ana", lastName: "" }} />
    );

    expect(container).toHaveTextContent(/^A$/);
  });

  it("falls back to an icon without a name", () => {
    const { container } = render(<UserAvatar user={null} />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("is hidden from assistive technology when it has no photo", () => {
    const { container } = render(
      <UserAvatar user={{ avatar: null, firstName: "Ana", lastName: "Pérez" }} />
    );

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
