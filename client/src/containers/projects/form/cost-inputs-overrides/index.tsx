import CapexCostInputsTable from "@/containers/projects/form/cost-inputs-overrides/capex";
import OpexCostInputsTable from "@/containers/projects/form/cost-inputs-overrides/opex";
import OtherCostInputsTable from "@/containers/projects/form/cost-inputs-overrides/other";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CostInputsOverridesProjectForm() {
  return (
    <Accordion type="single" collapsible defaultValue="cost-inputs-overrides">
      <AccordionItem value="cost-inputs-overrides" className="border-b-0">
        <AccordionTrigger className="pt-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-medium">Cost inputs overrides</h2>
              <span className="font-normal text-muted-foreground">
                optional
              </span>
            </div>
            <p className="font-normal text-muted-foreground">
              Override specific cost inputs in this field. Otherwise, country
              specific assumptions will be considered.
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div className="flex flex-col gap-8">
            <CapexCostInputsTable />
            <OpexCostInputsTable />
            <OtherCostInputsTable />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
