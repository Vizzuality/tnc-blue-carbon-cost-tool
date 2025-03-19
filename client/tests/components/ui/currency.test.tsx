import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Currency from "@/components/ui/currency";

describe("components/ui/currency", () => {
  describe("styling", () => {
    it("applies plain symbol styling when plainSymbol is true", () => {
      const { getByText } = render(<Currency value={1234.56} plainSymbol />);
      const symbolElement = getByText("$");
      expect(symbolElement).not.toHaveClass("text-xs");
      expect(symbolElement).not.toHaveClass("text-muted-foreground");
    });

    it("applies muted symbol styling by default", () => {
      const { getByText } = render(<Currency value={1234.56} />);
      const symbolElement = getByText("$");
      expect(symbolElement).toHaveClass("text-xs", "text-muted-foreground");
    });

    it("applies custom className to wrapper", () => {
      const customClass = "test-class";
      const { container } = render(
        <Currency value={1234.56} className={customClass} />,
      );
      expect(container.firstChild).toHaveClass(
        "inline-flex",
        "gap-x-0.5",
        customClass,
      );
    });
  });

  describe("number formatting", () => {
    it("renders basic currency value correctly", () => {
      render(<Currency value={1234.56} />);
      expect(screen.getByText("1,234.56")).toBeInTheDocument();
      expect(screen.getByText("$")).toBeInTheDocument();
    });

    it("handles negative values correctly", () => {
      render(<Currency value={-1234.56} />);
      expect(screen.getByText("1,234.56")).toBeInTheDocument();
      expect(screen.getByText("-$")).toBeInTheDocument();
    });

    it("uses compact notation for large numbers", () => {
      const { getByText } = render(<Currency value={1e12} />);
      expect(getByText(/\d+(\.\d+)?T/)).toBeInTheDocument();
    });
  });
});
