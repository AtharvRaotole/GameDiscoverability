import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmotionInput } from "../EmotionInput";
import { useDiscoveryStore } from "@/stores/discovery-store";

// Mock the store
jest.mock("@/stores/discovery-store", () => ({
  useDiscoveryStore: () => ({
    setQuery: jest.fn(),
    setLoading: jest.fn(),
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock API
jest.mock("@/lib/api", () => ({
  api: {
    extractEmotions: jest.fn(),
  },
}));

describe("EmotionInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the input field", () => {
    render(<EmotionInput />);
    const textarea = screen.getByPlaceholderText(/I want to feel/i);
    expect(textarea).toBeInTheDocument();
  });

  it("shows character counter", () => {
    render(<EmotionInput />);
    expect(screen.getByText(/0\/500/i)).toBeInTheDocument();
  });

  it("disables submit button when input is too short", () => {
    render(<EmotionInput />);
    const button = screen.getByRole("button", { name: /discover games/i });
    expect(button).toBeDisabled();
  });

  it("enables submit button when input is valid", async () => {
    const user = userEvent.setup();
    render(<EmotionInput />);
    
    const textarea = screen.getByPlaceholderText(/I want to feel/i);
    await user.type(textarea, "I want to feel the way Outer Wilds made me feel");

    const button = screen.getByRole("button", { name: /discover games/i });
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("shows character counter", async () => {
    const user = userEvent.setup();
    render(<EmotionInput />);
    
    const textarea = screen.getByPlaceholderText(/I want to feel/i);
    await user.type(textarea, "This is a test query that is long enough");

    await waitFor(() => {
      const counter = screen.getByText(/\d+\/500/i);
      expect(counter).toBeInTheDocument();
    });
  });
});

