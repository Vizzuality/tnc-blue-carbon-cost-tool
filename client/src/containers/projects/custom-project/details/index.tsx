import { FC } from "react";

import DetailItem from "@/containers/projects/custom-project/details/detail-item";

import FileEdit from "@/components/icons/file-edit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const mockData = [
  [
    {
      label: "Country",
      value: "Indonesia",
      countryCode: "ID",
    },
    {
      label: "Ecosystem",
      value: "Seagrass",
    },
    {
      label: "Carbon revenues to cover",
      value: "Only Opex",
    },
  ],
  [
    {
      label: "Project size",
      value: 20,
      unit: "hectares",
    },
    {
      label: "Activity type",
      value: "Conservation",
    },
    {
      label: "Initial carbon price",
      value: 30,
      prefix: "$",
    },
  ],
  [
    {
      label: "Project length",
      value: 20,
      unit: "years",
    },
    {
      label: "Loss rate",
      value: "-0.10",
      unit: "%",
    },
    {
      label: "Emission factor",
      subValues: [
        {
          label: "AGB",
          value: 355,
          unit: "tCO2e/ha/yr",
        },
        {
          label: "SOC",
          value: 72,
          unit: "tCO2e/ha/yr",
        },
      ],
    },
  ],
];
const CustomProjectDetails: FC = () => {
  return (
    <Card className="space-y-1">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Project details</h2>
        <Button type="button" variant="ghost">
          <FileEdit />
          <span>Edit project</span>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {mockData.map((column, index) => (
          <div key={index} className="space-y-3">
            {column.map((detail, index) => (
              <DetailItem key={index} {...detail} />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CustomProjectDetails;
