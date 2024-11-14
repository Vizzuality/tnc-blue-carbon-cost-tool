import * as React from "react";

import {
  PROJECT_SPECIFIC_EMISSION,
  CARBON_REVENUES_TO_COVER,
} from "@shared/entities/custom-project.entity";
import { useAtom } from "jotai/index";

import { projectFormState } from "@/app/projects/store";

import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function ConservationProjectDetails() {
  const [{ setup: form }] = useAtom(projectFormState);

  return (
    <Card className="bg-transparent">
      <h2 className="font-semibold">Conservation project details</h2>
      <p className="text-sm text-muted-foreground">
        This information only applies for conservation projects
      </p>

      <FormField
        control={form?.control}
        name="initialCarbonPriceAssumption"
        render={({ field }) => (
          <FormItem className="flex justify-between gap-4">
            <FormLabel
              tooltip={{
                title: "Initial carbon price assumption",
                content: "TBD",
              }}
            >
              Initial carbon price assumption in $
            </FormLabel>
            <FormControl className="relative after:absolute after:right-9 after:inline-block after:text-sm after:text-muted-foreground after:content-['$']">
              <div className="relative flex items-center">
                <Input
                  type="number"
                  placeholder="Insert project name"
                  className="min-w-[225px]"
                  min={0}
                  {...field}
                  onChange={async (v) => {
                    form?.setValue(
                      "initialCarbonPriceAssumption",
                      Number(v.target.value),
                    );
                    await form?.trigger("initialCarbonPriceAssumption");
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
}
