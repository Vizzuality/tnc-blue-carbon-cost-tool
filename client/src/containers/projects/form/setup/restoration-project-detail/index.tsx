import * as React from "react";

import { useFormContext } from "react-hook-form";

import { RESTORATION_ACTIVITY_SUBTYPE } from "@shared/entities/activity.enum";
import { SEQUESTRATION_RATE_TIER_TYPES } from "@shared/entities/carbon-inputs/sequestration-rate.entity";

import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RestorationProjectDetails() {
  const form = useFormContext<CreateCustomProjectForm>();

  return (
    <Card variant="secondary">
      <div className="flex gap-3">
        <div className="basis-1/2 space-y-2">
          <FormField
            control={form.control}
            name="parameters.restorationActivity"
            render={() => (
              <FormItem className="basis-1/2">
                <FormLabel
                  tooltip={{
                    title: "Project-specific emissions type",
                    content: "TBD",
                  }}
                >
                  Restoration Activity type
                </FormLabel>
                <FormControl>
                  <Select
                    name="parameters.restorationActivity"
                    value={form.getValues("parameters.restorationActivity")}
                    onValueChange={async (v) => {
                      form.setValue(
                        "parameters.restorationActivity",
                        v as RESTORATION_ACTIVITY_SUBTYPE,
                      );
                      await form.trigger("parameters.restorationActivity");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select restoration activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(RESTORATION_ACTIVITY_SUBTYPE)?.map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="basis-1/2 space-y-2">
          <FormField
            control={form.control}
            name="parameters.restorationActivity"
            render={() => (
              <FormItem className="basis-1/2">
                <FormLabel
                  tooltip={{
                    title: "Project-specific emissions type",
                    content: "TBD",
                  }}
                >
                  Sequestration Factor Used
                </FormLabel>
                <FormControl>
                  <Select
                    name="parameters.tierSelector"
                    value={form.getValues("parameters.tierSelector")}
                    onValueChange={async (v) => {
                      form.setValue(
                        "parameters.tierSelector",
                        v as SEQUESTRATION_RATE_TIER_TYPES,
                      );
                      await form.trigger("parameters.tierSelector");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sequestration tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SEQUESTRATION_RATE_TIER_TYPES)?.map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Card>
  );
}
