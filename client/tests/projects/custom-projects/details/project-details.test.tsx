import { ACTIVITY } from "@shared/entities/activity.enum";
import { CARBON_REVENUES_TO_COVER } from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { render } from "@testing-library/react";

import ProjectDetails, {
  ProjectDetailsProps,
} from "@/containers/projects/custom-project/details";

vi.mock("next/navigation", () => ({
  useParams: vi.fn().mockReturnValue({ id: undefined }),
}));

describe("projects/custom-projects/details/project-details", () => {
  const defaultProps: ProjectDetailsProps = {
    data: {
      country: { code: "US", name: "United States" },
      projectSize: 1000000,
      projectLength: 10,
      ecosystem: ECOSYSTEM.MANGROVE,
      activity: ACTIVITY.CONSERVATION,
      carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
      initialCarbonPrice: 10,
    },
  };
  it("renders correctly when no loss rate or emission factors are provided", () => {
    const { container } = render(<ProjectDetails {...defaultProps} />);

    expect(container).toHaveTextContent(ACTIVITY.CONSERVATION);
  });

  it("renders correctly when loss rate and emission factors are provided", () => {
    render(
      <ProjectDetails
        data={{
          ...defaultProps.data,
          lossRate: 10,
          emissionFactors: {
            emissionFactor: 10,
            emissionFactorAgb: 10,
            emissionFactorSoc: 10,
          },
        }}
      />,
    );
  });
});
