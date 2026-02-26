import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactFormWrapper } from "../ContactFormWrapper";

// Mock the Form component to isolate the test
jest.mock("../../form", () => ({
  Form: () => (
    <form data-testid="contact-form">
      <input data-testid="name-input" placeholder="Name" />
      <input data-testid="email-input" placeholder="Email" />
      <textarea data-testid="message-input" placeholder="Message" />
      <button type="submit" data-testid="submit-button">
        Submit
      </button>
    </form>
  ),
}));

describe("ContactFormWrapper", () => {
  it("functions correctly when formData is not passed as a prop", () => {
    // Act
    render(<ContactFormWrapper />);

    // Assert - The component should render the Form component successfully
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("message-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("renders without any props and does not crash", () => {
    // This test specifically verifies the component works without formData prop
    expect(() => render(<ContactFormWrapper />)).not.toThrow();
  });

  it("renders the Form component as a child", () => {
    render(<ContactFormWrapper />);

    // Verify that the ContactFormWrapper correctly renders the Form component
    const form = screen.getByTestId("contact-form");
    expect(form).toBeInTheDocument();
  });
});
