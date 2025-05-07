import { render, screen } from "@testing-library/react";
import { Provider } from "jotai";
import { describe, it, expect } from "vitest";
import Header from "@/components/Header";

describe("Header component", () => {
  it("renders the header with a switch snapshots", () => {
    const { container } = render(
      <Provider>
        <Header />
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders the header with a switch", () => {
    render(
      <Provider>
        <Header />
      </Provider>
    );

    // Check if the switch/toggle is present
    const switchElement = screen.getByRole("switch", {
      name: /toggle dark\/light mode/i,
    });
    expect(switchElement).toBeInTheDocument();
  });
});
