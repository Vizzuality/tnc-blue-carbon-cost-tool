import { FC } from "react";

import { useAtom } from "jotai";

import { showCostDetailsAtom } from "@/app/projects/store";

import { COST_DETAILS } from "@/constants/tooltip";

import CostDetailsParameters from "@/containers/projects/custom-project/cost-details/parameters";
import CostDetailTable from "@/containers/projects/custom-project/cost-details/table";

import InfoButton from "@/components/ui/info-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CostDetailsProps {
  data: {
    costName: string;
    label: string;
    value: string;
  }[];
}
const CostDetails: FC<CostDetailsProps> = ({ data }) => {
  const [isVisible, setIsVisible] = useAtom(showCostDetailsAtom);

  return (
    <Sheet open={isVisible} onOpenChange={setIsVisible}>
      <SheetContent className="flex h-full !max-w-[720px] flex-col gap-4 overflow-hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Cost details</h2>
            <InfoButton
              title="Cost details"
              className="max-h-screen overflow-y-auto"
            >
              {COST_DETAILS}
            </InfoButton>
          </SheetTitle>
        </SheetHeader>
        <CostDetailsParameters />
        <CostDetailTable data={data} />
      </SheetContent>
    </Sheet>
  );
};

export default CostDetails;
