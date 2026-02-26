import { render, screen } from "@testing-library/react";
import { sanityFetch } from "@/lib/sanity/live";
import { client } from "@/lib/sanity/client";
import Page from "../page";

// Mock the external dependencies
jest.mock("@/lib/sanity/live", () => ({
  sanityFetch: jest.fn(),
}));

jest.mock("@/lib/sanity/client", () => ({
  client: {
    fetch: jest.fn(),
  },
}));

jest.mock("@/components/sections/ContactFormWrapper", () => ({
  ContactFormWrapper: () => (
    <div data-testid="contact-form-wrapper">Contact Form</div>
  ),
}));

// Mock the queries
jest.mock("@/lib/sanity/query", () => ({
  querySlugPageData: "mock-slug-query",
  CONTACT_FORM_QUERY: "mock-contact-form-query",
  CONTACT_FORM_SETTINGS_QUERY: "mock-contact-form-settings-query",
}));

describe("Contact Page Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("correctly unwraps and uses the promised params", async () => {
    // Arrange
    const mockParams = Promise.resolve({ slug: "contact" });
    const mockPageData = {
      _id: "page-id",
      _type: "page",
      title: "Contact Us",
      contactForm: {
        _ref: "form-id-123",
      },
    };
    const mockFormData = {
      _id: "form-id-123",
      title: "Contact Form",
      fields: [],
    };
    const mockFormSettings = {
      emailTo: "test@example.com",
    };

    const mockSanityFetch = sanityFetch as jest.MockedFunction<
      typeof sanityFetch
    >;
    const mockClientFetch = client.fetch as jest.MockedFunction<
      typeof client.fetch
    >;

    mockSanityFetch.mockResolvedValue({
      data: mockPageData,
    });

    // Mock the form data fetch calls
    mockClientFetch
      .mockResolvedValueOnce(mockFormData) // First call for CONTACT_FORM_QUERY
      .mockResolvedValueOnce(mockFormSettings); // Second call for CONTACT_FORM_SETTINGS_QUERY

    const props = {
      params: mockParams,
    };

    // Act
    const PageComponent = await Page(props);
    render(PageComponent);

    // Assert
    expect(screen.getByTestId("contact-form-wrapper")).toBeInTheDocument();

    // Verify that sanityFetch was called with the correct params
    expect(mockSanityFetch).toHaveBeenCalledWith({
      query: "mock-slug-query",
      params: { slug: "contact" },
    });

    // Verify that the form data was fetched with the correct form ID
    expect(mockClientFetch).toHaveBeenCalledWith("mock-contact-form-query", {
      formId: "form-id-123",
    });
    expect(mockClientFetch).toHaveBeenCalledWith(
      "mock-contact-form-settings-query",
    );
  });

  it("renders not found when page data is missing", async () => {
    // Arrange
    const mockParams = Promise.resolve({ slug: "contact" });
    const mockSanityFetch = sanityFetch as jest.MockedFunction<
      typeof sanityFetch
    >;

    mockSanityFetch.mockResolvedValue({
      data: null,
    });

    const props = {
      params: mockParams,
    };

    // Act
    const PageComponent = await Page(props);
    render(PageComponent);

    // Assert
    expect(screen.getByText("Not found")).toBeInTheDocument();
  });

  it("renders not found when form data is missing", async () => {
    // Arrange
    const mockParams = Promise.resolve({ slug: "contact" });
    const mockPageData = {
      _id: "page-id",
      _type: "page",
      title: "Contact Us",
      contactForm: null, // No form reference
    };

    const mockSanityFetch = sanityFetch as jest.MockedFunction<
      typeof sanityFetch
    >;

    mockSanityFetch.mockResolvedValue({
      data: mockPageData,
    });

    const props = {
      params: mockParams,
    };

    // Act
    const PageComponent = await Page(props);
    render(PageComponent);

    // Assert
    expect(screen.getByText("Not found")).toBeInTheDocument();
  });
});
