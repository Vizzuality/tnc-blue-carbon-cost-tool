import { ChevronUp, ChevronDown, Plus } from "lucide-react";

import { parseCurrency, formatCurrency } from "@/lib/format";

import BarChart from "@/containers/overview/project-details/bar-chart";
import ParametersProjects from "@/containers/overview/project-details/parameters";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import InfoButton from "@/components/ui/info-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Currency = ({ value }: { value: number }) => {
  const [symbol, amount] = parseCurrency(value);
  return (
    <span>
      <sup className="text-big-stone-200">{symbol}</sup> {amount}
    </span>
  );
};

//////// ScoreIndicator component ////////
interface ScoreIndicatorProps {
  score: "High" | "Medium" | "Low";
  className?: string;
}

const ScoreIndicator = ({ score, className = "" }: ScoreIndicatorProps) => {
  const bgColorClass = {
    High: "bg-high",
    Medium: "bg-medium",
    Low: "bg-low",
  }[score];

  return (
    <div
      className={`flex h-10 items-center justify-center font-medium text-deep-ocean ${bgColorClass} ${className}`}
    >
      {score}
    </div>
  );
};

//////// Legend component ////////
const Legend = ({
  name,
  textColor,
  bgColor,
}: {
  name: string;
  textColor: string;
  bgColor: string;
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${bgColor}`}></div>
        <span className={`text-xs ${textColor}`}>{name}</span>
      </div>
    </div>
  );
};

// Mock data - to be replaced with API data later
const projectData = {
  name: "Australian Mangrove Conservation",
  size: "Small",
  carbonPricingType: "Market (30$)",
  cost: "NPV",
  totalCost: 38023789,
  capEx: 1500000,
  opEx: 36500000,
  leftover: 4106132,
  totalRevenue: 40600000,
  opExRevenue: 36500000,
  abatement: 962991,
  overallScore: "Medium",
  scorecard: [
    { name: "Economic feasibility", rating: "High" },
    { name: "Legal feasibility", rating: "Low" },
    { name: "Implementation risk", rating: "High" },
    { name: "Social feasibility", rating: "Medium" },
    { name: "Security risk", rating: "Medium" },
    { name: "Value for money", rating: "Low" },
    { name: "Overall", rating: "Medium" },
  ],
  costEstimates: [
    {
      name: "Capital expenditure",
      value: 1514218,
      items: [
        { name: "Feasibility analysis", value: 70000 },
        { name: "Conservation planning and admin", value: 629559 },
        { name: "Data collection and field costs", value: 76963 },
        { name: "Community representation", value: 286112 },
        { name: "Blue carbon project planning", value: 111125 },
        { name: "Establishing carbon rights", value: 296010 },
        { name: "Validation", value: 44450 },
        { name: "Implementation labor", value: 0 },
      ],
    },
    {
      name: "Operating expenditure",
      value: 36509571,
      items: [
        { name: "Monitoring and Maintenance", value: 402322 },
        { name: "Community benefit sharing fund", value: 34523347 },
        { name: "Carbon standard fees", value: 227875 },
        { name: "Baseline reassessment", value: 75812 },
        { name: "MRV", value: 223062 },
      ],
    },
    { name: "Total cost", value: 38023789 },
  ],
};

interface IProjectDetailsProps {
  projectName: string;
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ProjectDetails({
  projectName,
  open,
  setIsOpen,
}: IProjectDetailsProps) {
  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-scroll sm:max-w-[50%]">
        <SheetHeader className="space-y-6">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0 hover:bg-transparent"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 hover:bg-transparent"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <SheetTitle>{projectName}</SheetTitle>
            </div>
          </div>
          <ParametersProjects />
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-md font-medium">Total project cost</h3>
                    <InfoButton title="Refers to the summary of Capital Expenditure and Operating Expenditure" />
                  </div>
                  <div className="text-sm">
                    Refers to the summary of Capital Expenditure and Operating
                    Expenditure
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-xl font-normal">
                      <Currency value={projectData.totalCost} />
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Legend
                      name="CapEx"
                      textColor="text-sky-blue-500"
                      bgColor="bg-sky-blue-500"
                    />
                    <Legend
                      name="OpEx"
                      textColor="text-sky-blue-200"
                      bgColor="bg-sky-blue-200"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <BarChart
                    orientation="vertical"
                    total={projectData.totalRevenue}
                    segments={[
                      {
                        value: projectData.capEx,
                        label: "CapEx Revenue",
                        colorClass: "bg-sky-blue-500",
                      },
                      {
                        value: projectData.opExRevenue,
                        label: "OpEx",
                        colorClass: "bg-sky-blue-200",
                      },
                    ]}
                  />
                </div>
              </div>
            </Card>

            <Card className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-md font-medium">Total project cost</h3>
                    <InfoButton title="Refers to the summary of Capital Expenditure and Operating Expenditure" />
                  </div>
                  <div className="text-sm">
                    Refers to the summary of Capital Expenditure and Operating
                    Expenditure
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-xl font-normal">
                      <Currency value={projectData.totalCost} />
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Legend
                      name="CapEx"
                      textColor="text-yellow-500"
                      bgColor="bg-yellow-500"
                    />
                    <Legend
                      name="OpEx"
                      textColor="text-sky-blue-200"
                      bgColor="bg-sky-blue-200"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <BarChart
                    total={projectData.totalRevenue}
                    segments={[
                      {
                        value: projectData.totalRevenue,
                        label: "Total Revenue",
                        colorClass: "bg-yellow-500",
                      },
                      {
                        value: projectData.opExRevenue,
                        label: "OpEx",
                        colorClass: "bg-sky-blue-200",
                      },
                    ]}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-4">
            <Card className="w-3/4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-md font-medium">Abatement potential</h3>
                  <InfoButton title="Refers to the summary of Capital Expenditure and Operating Expenditure" />
                </div>
                <span className="text-xl font-normal">
                  <Currency value={projectData.abatement} />
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p>Estimation of total CO2 expected during the project.</p>
              </div>
            </Card>

            <Card className="w-1/4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-md font-medium">Overall score</h3>
                  <InfoButton title="Refers to the summary of Capital Expenditure and Operating Expenditure" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <span className="text-xl font-normal text-wheat-200">
                  {projectData.overallScore}
                </span>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-md font-medium">Scorecard ratings</h3>
                <InfoButton title="Refers to the summary of Capital Expenditure and Operating Expenditure" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Compare with a different project
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 hover:bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              {projectData.scorecard.map((item) => (
                <>
                  <div key={item.name} className="flex">
                    <div className="w-2/3 content-center py-2">{item.name}</div>
                    <ScoreIndicator
                      className="w-1/3"
                      score={item.rating as "High" | "Medium" | "Low"}
                    />
                  </div>
                  <hr className="m-0" />
                </>
              ))}
            </div>
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <h3 className="text-md font-medium">Cost estimates</h3>
                <InfoButton title="Refers to the summary of Capital Expenditure and Operating Expenditure" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Compare with a different project
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 hover:bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              {projectData.costEstimates.map((estimate) => (
                <div key={estimate.name}>
                  <div className="flex bg-big-stone-900 px-2">
                    <div className="w-2/3 content-center py-2 pl-2 font-medium">
                      {estimate.name}
                    </div>
                    <div className="w-1/3 content-center py-2">
                      <span className="font-medium">
                        {formatCurrency(estimate.value)}
                      </span>
                    </div>
                  </div>
                  {estimate.items?.map((item) => (
                    <div key={item.name} className="flex px-2">
                      <div className="w-2/3 content-center py-2 pl-2">
                        {item.name}
                      </div>
                      <div className="w-1/3 content-center py-2">
                        <span className="font-normal">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <hr className="m-0" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
