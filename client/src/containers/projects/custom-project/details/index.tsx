import { FC } from "react";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { CARBON_REVENUES_TO_COVER } from "@shared/entities/carbon-revenues-to-cover.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";

import { projectsUIState } from "@/app/projects/[id]/store";

import DetailItem from "@/containers/projects/custom-project/details/detail-item";

import FileEdit from "@/components/icons/file-edit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProjectDetailsProps {
  country: { code: string; name: string };
  projectSize: number;
  projectLength: number;
  ecosystem: ECOSYSTEM;
  activity: ACTIVITY;
  lossRate: number;
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;
  initialCarbonPrice: number;
  emissionFactors: {
    emissionFactor: number;
    emissionFactorAGB: number;
    emissionFactorSOC: number;
  };
}

const ProjectDetails: FC<ProjectDetailsProps> = ({
  country,
  projectSize,
  projectLength,
  ecosystem,
  carbonRevenuesToCover,
  activity,
  initialCarbonPrice,
  lossRate,
  emissionFactors,
}) => {
  const { projectSummaryOpen } = useAtomValue(projectsUIState);

  return (
    <Card
      className={cn({ "flex-2 space-y-1": true, hidden: projectSummaryOpen })}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Project details</h2>
        <Button type="button" variant="ghost">
          <FileEdit />
          <span>Edit project</span>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          <DetailItem
            label="Country"
            value={country.name}
            countryCode={country.code}
          />
          <DetailItem label="Ecosystem" value={ecosystem} />
          <DetailItem
            label="Carbon revenues to cover"
            value={carbonRevenuesToCover}
          />
        </div>
        <div className="space-y-3">
          <DetailItem
            label="Project size"
            value={projectSize}
            unit="hectares"
          />
          <DetailItem label="Activity type" value={activity} />
          <DetailItem
            label="Initial carbon price"
            value={initialCarbonPrice}
            unit="$"
            numberFormatOptions={{
              maximumFractionDigits: 0,
            }}
          />
        </div>
        <div className="space-y-3">
          <DetailItem
            label="Project length"
            value={projectLength}
            unit="years"
          />
          <DetailItem
            label="Loss rate"
            value={lossRate}
            unit="%"
            numberFormatOptions={{
              minimumFractionDigits: 2,
            }}
          />
          <DetailItem
            label="Emission factor"
            subValues={[
              {
                label: "AGB",
                value: emissionFactors.emissionFactorAGB,
                unit: "tCO2e/ha/yr",
              },
              {
                label: "SOC",
                value: emissionFactors.emissionFactorSOC,
                unit: "tCO2e/ha/yr",
              },
            ]}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProjectDetails;
