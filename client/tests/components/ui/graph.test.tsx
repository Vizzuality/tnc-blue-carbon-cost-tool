import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { GraphWithLegend } from "@/components/ui/graph";

describe("GraphWithLegend", () => {
  it("renders graph with correct total, segments and legend items", () => {
    const testData = {
      total: 1000,
      items: [
        {
          value: 400,
          label: "CapEx",
          circleClassName: "bg-sky-blue-200",
          labelClassName: "text-sky-blue-200",
        },
        {
          value: 600,
          label: "Opex",
          circleClassName: "bg-sky-blue-500",
          labelClassName: "text-sky-blue-500",
        },
      ],
    };

    render(<GraphWithLegend {...testData} />);

    // Check if total amount is displayed
    const totalAmount = screen.getByText("1,000");
    expect(totalAmount).toBeInTheDocument();
    expect(totalAmount.previousSibling).toHaveTextContent("$");

    // Check if legend items are rendered
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("CapEx")).toBeInTheDocument();
    expect(screen.getByText("Opex")).toBeInTheDocument();

    // Check if segment values are displayed (using the Currency component format)
    const capExAmount = screen.getByText("400.0");
    expect(capExAmount).toBeInTheDocument();
    expect(capExAmount.previousSibling).toHaveTextContent("$");

    const opExAmount = screen.getByText("600.0");
    expect(opExAmount).toBeInTheDocument();
    expect(opExAmount.previousSibling).toHaveTextContent("$");
  });
});
