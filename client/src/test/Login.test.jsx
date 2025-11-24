import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import Login from "../pages/Login.jsx";
import React from "react";

//helper function for to render with providers
function renderWithProviders(ui) {
  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>,
  );
}

describe("Login Page", () => {
  it("renders login form", () => {
    renderWithProviders(<Login />);
    const heading = screen.getByText("Sign In");
    expect(heading).toBeInTheDocument();
  });

  it("shows email and password inputs", () => {
    renderWithProviders(<Login />);

    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("allow user input in email and password", () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password");
  });
});
