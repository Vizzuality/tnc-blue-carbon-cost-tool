import {
  COST_TYPE_SELECTOR,
  PROJECT_PRICE_TYPE,
} from "@shared/entities/projects.entity";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider, createStore } from "jotai";

import { projectDetailsFiltersAtom } from "@/app/(overview)/store";
import ProjectDetailsOffsetPrice from "@/containers/overview/project-details/offset-price";

const projectCost = {
  total: { totalCost: 1000, capex: 300, opex: 700, costPerTCO2e: 10 },
  npv: { totalCost: 800, capex: 200, opex: 600, costPerTCO2e: 8 },
} as any;

const renderOffsetPrice = (
  props: React.ComponentProps<typeof ProjectDetailsOffsetPrice>,
) => {
  const store = createStore();
  store.set(projectDetailsFiltersAtom, {
    costRangeSelector: COST_TYPE_SELECTOR.TOTAL,
  });

  return render(
    <Provider store={store}>
      <ProjectDetailsOffsetPrice {...props} />
    </Provider>,
  );
};

describe("ProjectDetailsOffsetPrice", () => {
  it("calculates OpEx break-even price from credits issued", () => {
    renderOffsetPrice({ data: projectCost, creditsIssued: 100 });

    expect(screen.getByText("$7.00")).toBeInTheDocument();
  });

  it("calculates total cost break-even price from NPV costs", () => {
    const store = createStore();
    store.set(projectDetailsFiltersAtom, {
      costRangeSelector: COST_TYPE_SELECTOR.NPV,
    });

    render(
      <Provider store={store}>
        <ProjectDetailsOffsetPrice
          data={projectCost}
          creditsIssued={100}
          priceType={PROJECT_PRICE_TYPE.TOTAL_COST_BREAKEVEN}
        />
      </Provider>,
    );

    expect(screen.getByText("$8.00")).toBeInTheDocument();
  });

  it("allows switching from OpEx to total-cost break-even", () => {
    renderOffsetPrice({ data: projectCost, creditsIssued: 100 });
    fireEvent.click(screen.getByRole("combobox", { name: "Price type" }));
    fireEvent.click(
      screen.getByRole("option", { name: "Total cost breakeven" }),
    );

    expect(screen.getByText("$10.00")).toBeInTheDocument();
  });

  it("does not divide by zero credits", () => {
    renderOffsetPrice({ data: projectCost, creditsIssued: 0 });

    expect(screen.getByText("Not available")).toBeInTheDocument();
    expect(screen.getByText("No credits issued")).toBeInTheDocument();
  });
});
