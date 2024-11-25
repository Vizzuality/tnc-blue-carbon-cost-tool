import Link from "next/link";

import { useAtom } from "jotai";
import { ChevronUp, ChevronDown, Plus, NotebookPen } from "lucide-react";

import {
  renderCurrency,
  formatCurrency,
  renderAbatementCurrency,
} from "@/lib/format";

import { projectDetailsAtom } from "@/app/(overview)/store";

import ParametersProjects from "@/containers/overview/project-details/parameters";

import BarChart from "@/components/ui/bar-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const CreateProjectDetails = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>
        <NotebookPen className="h-4 w-4" />
        Create Custom Project
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader className="flex flex-row items-center gap-2">
        <NotebookPen className="h-6 w-6 text-sky-blue-300" />
        <DialogTitle className="!m-0">Create a Custom Project</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        By creating a custom project you will generate a customizable version
        where you can edit all parameters to fit your specific needs.
      </DialogDescription>
      <DialogFooter>
        <DialogClose>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button>
          <Link href={"/projects/new"}>Create</Link>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

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

export default function ProjectDetails() {
  const [projectDetails, setProjectDetails] = useAtom(projectDetailsAtom);

  const handleOpenDetails = (open: boolean) =>
    setProjectDetails({ ...projectDetails, isOpen: open });

  return (
    <Sheet open={projectDetails.isOpen} onOpenChange={handleOpenDetails}>
      <SheetContent className="overflow-y-scroll pb-0 sm:max-w-[50%]">
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
              <SheetTitle>{projectDetails.projectName}</SheetTitle>
            </div>
          </div>
          <ParametersProjects />
        </SheetHeader>

        <div className="mb-8 mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="totalProjectCost"
                      className="text-md font-medium"
                      tooltip={{
                        title: "Total project cost",
                        content:
                          "Refers to the summary of Capital Expenditure and Operating Expenditure",
                      }}
                    >
                      <h3 className="text-md">Total project cost</h3>
                    </Label>
                  </div>
                  <div className="text-sm text-big-stone-200">
                    Refers to the summary of Capital Expenditure and Operating
                    Expenditure
                  </div>
                </div>
              </div>
              <div className="flex min-h-[160px] gap-4">
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-xl font-normal">
                      {renderCurrency(projectData.totalCost)}
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
                    <Label
                      htmlFor="totalProjectCost"
                      className="text-md font-medium"
                      tooltip={{
                        title: "Total project cost",
                        content:
                          "Refers to the summary of Capital Expenditure and Operating Expenditure",
                      }}
                    >
                      <h3 className="text-md">Total project cost</h3>
                    </Label>
                  </div>
                  <div className="text-sm text-big-stone-200">
                    Refers to the summary of Capital Expenditure and Operating
                    Expenditure
                  </div>
                </div>
              </div>
              <div className="flex min-h-[160px] gap-4">
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-xl font-normal">
                      {renderCurrency(projectData.totalCost)}
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
                  <Label
                    htmlFor="abatementPotential"
                    className="text-md font-medium"
                    tooltip={{
                      title: "Abatement potential",
                      content:
                        "Refers to the summary of Capital Expenditure and Operating Expenditure",
                    }}
                  >
                    <h3 className="text-md">Abatement potential</h3>
                  </Label>
                </div>
                <span className="text-xl font-normal">
                  {renderAbatementCurrency(projectData.abatement)}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-big-stone-200">
                <p>Estimation of total CO2 expected during the project.</p>
              </div>
            </Card>

            <Card className="w-1/4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="overallScore"
                    className="text-md font-medium"
                    tooltip={{
                      title: "Overall score",
                      content:
                        "Refers to the summary of Capital Expenditure and Operating Expenditure",
                    }}
                  >
                    <h3 className="text-md">Overall score</h3>
                  </Label>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <span className="text-xl font-normal text-wheat-200">
                  {projectData.overallScore}
                </span>
              </div>
            </Card>
          </div>

          <Card className="p-4 pb-0 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="scorecardRatings"
                  className="text-md font-medium"
                  tooltip={{
                    title: "Scorecard ratings",
                    content:
                      "Refers to the summary of Capital Expenditure and Operating Expenditure",
                  }}
                >
                  <h3 className="text-md">Scorecard ratings</h3>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-big-stone-200">
                  Compare with a different project
                </Label>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 hover:bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2">
              {projectData.scorecard.map((item, index) => (
                <>
                  {index === 0 && <hr className="m-0" />}
                  <div key={item.name} className="flex">
                    <div className="w-2/3 content-center py-2">{item.name}</div>
                    <ScoreIndicator
                      className="w-1/3"
                      score={item.rating as "High" | "Medium" | "Low"}
                    />
                  </div>
                  {projectData.scorecard.length !== index + 1 && (
                    <hr className="m-0" />
                  )}
                </>
              ))}
            </div>
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between p-4 py-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="costEstimates"
                  className="text-md font-medium"
                  tooltip={{
                    title: "Cost estimates",
                    content:
                      "Refers to the summary of Capital Expenditure and Operating Expenditure",
                  }}
                >
                  <h3 className="text-md">Cost estimates</h3>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-big-stone-200">
                  Compare with a different project
                </Label>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 hover:bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              {projectData.costEstimates.map((estimate) => (
                <div key={estimate.name}>
                  <div className="flex bg-big-stone-900 px-2 last:rounded-bl-lg last:rounded-br-lg">
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
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky bottom-0 flex w-full flex-wrap justify-between gap-4 border-t border-t-sky-900 bg-background py-2">
          <div className="text-xs">
            <div>
              Values considered for a{" "}
              <span className="font-bold">small project (40 ha).</span>
            </div>
            <div>For more detailed analysis, create a custom project.</div>
          </div>
          <div>
            <CreateProjectDetails />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
