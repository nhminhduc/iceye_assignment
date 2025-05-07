import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { message } from "antd";
import LoginForm from "@/components/LoginForm";

const mockLogin = vi.fn();
vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useSetAtom: () => mockLogin,
  };
});
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

describe("LoginForm test", () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  const renderForm = () => render(<LoginForm />);

  it("renders username, password, remember checkbox, and submit button", () => {
    const { container } = renderForm();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Remember me/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("shows validation errors when form is submitted empty", async () => {
    renderForm();
    userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(
      await screen.findByText(/Please enter your username/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Please enter your password/i)
    ).toBeInTheDocument();
  });

  it("calls login and shows success message on valid submit", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const successSpy = vi.spyOn(message, "success");

    renderForm();
    await userEvent.type(screen.getByLabelText(/Username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/Password/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        userId: "testuser",
        password: "password",
      });
    });
    expect(successSpy).toHaveBeenCalledWith("Welcome!");
  });

  it("displays error message when login fails", async () => {
    const error = new Error("Invalid credentials");
    mockLogin.mockRejectedValueOnce(error);
    const errorSpy = vi.spyOn(message, "error");

    renderForm();
    await userEvent.type(screen.getByLabelText(/Username/i), "baduser");
    await userEvent.type(screen.getByLabelText(/Password/i), "badpass");
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("Invalid credentials");
    });
  });
});
