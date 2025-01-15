import { FC } from "react";

import { ACTIVITY } from "@shared/entities/activity.enum";
import { CARBON_REVENUES_TO_COVER } from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { FileEdit } from "lucide-react";

import { useFeatureFlags } from "@/hooks/use-feature-flags";

import DetailItem from "@/containers/projects/custom-project/details/detail-item";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProjectDetailsProps {
  data: {
    country: { code: string; name: string };
    projectSize: number;
    projectLength: number;
    ecosystem: ECOSYSTEM;
    activity: ACTIVITY;
    lossRate: number;
    carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;
    initialCarbonPrice: number;
    emissionFactors: {
      emissionFactor: number | null;
      emissionFactorAgb: number;
      emissionFactorSoc: number;
    };
  };
}

const ProjectDetails: FC<ProjectDetailsProps> = ({ data }) => {
  const {
    country,
    projectSize,
    projectLength,
    ecosystem,
    carbonRevenuesToCover,
    activity,
    initialCarbonPrice,
    lossRate,
    emissionFactors,
  } = data;
  const featureFlags = useFeatureFlags();

  return (
    <Card className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Project details</h2>
        {featureFlags["edit-project"] && (
          <Button type="button" variant="ghost">
            <FileEdit />
            <span>Edit project</span>
          </Button>
        )}
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
                value: emissionFactors.emissionFactorAgb,
                unit: "tCO2e/ha/yr",
              },
              {
                label: "SOC",
                value: emissionFactors.emissionFactorSoc,
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
