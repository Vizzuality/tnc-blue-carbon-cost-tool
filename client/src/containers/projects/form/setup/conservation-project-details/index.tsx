import * as React from "react";

import { useFormContext } from "react-hook-form";

import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import {
  PROJECT_EMISSION_FACTORS,
  PROJECT_SPECIFIC_EMISSION,
} from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/custom-project.schema";

import { CreateCustomProjectForm } from "@/containers/projects/form/setup";
import LossRate from "@/containers/projects/form/setup/conservation-project-details/loss-rate";
import T1GlobalEmissionFactor from "@/containers/projects/form/setup/conservation-project-details/t1-global-emission-factor";
import T2NationalEmissionFactors from "@/containers/projects/form/setup/conservation-project-details/t2-national-emission-factors";

import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConservationProjectDetails() {
  const form = useFormContext<CreateCustomProjectForm>();

  return (
    <Card variant="secondary" className="flex flex-col gap-4">
      <h2 className="font-semibold">Conservation project details</h2>
      <p className="text-sm text-muted-foreground">
        This information only applies for conservation projects
      </p>

      {/* lossRateUsed */}
      <FormField
        control={form?.control}
        name="parameters.lossRateUsed"
        render={() => (
          <FormItem className="flex items-center justify-between gap-4 space-y-0">
            <FormLabel
              tooltip={{
                title: "Loss rate used",
                content: "TBD",
              }}
            >
              Loss rate used
            </FormLabel>
            <FormControl>
              <div className="relative flex items-center">
                <RadioGroup
                  className="flex gap-4"
                  defaultValue={
                    form.getValues("parameters.lossRateUsed") as LOSS_RATE_USED
                  }
                  onValueChange={async (v) => {
                    form.setValue(
                      "parameters.lossRateUsed",
                      v as LOSS_RATE_USED,
                    );
                    await form.trigger("parameters.lossRateUsed");
                  }}
                >
                  {Object.values(LOSS_RATE_USED).map((rate) => (
                    <div className="flex items-center gap-2" key={rate}>
                      <RadioGroupItem className="flex-1" value={rate} />
                      <FormLabel>{rate}</FormLabel>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <LossRate />

      {/* emission factor used */}
      <div className="flex">
        <FormField
          control={form.control}
          name="parameters.emissionFactorUsed"
          render={() => (
            <FormItem className="basis-1/2">
              <FormLabel
                tooltip={{
                  title: "Emission factors",
                  content: "TBD",
                }}
              >
                Emission factor used (as committed emissions)
              </FormLabel>
              <FormControl>
                <Select
                  name="parameters.emissionFactorUsed"
                  value={form.getValues("parameters.emissionFactorUsed")}
                  onValueChange={async (v) => {
                    form.setValue(
                      "parameters.emissionFactorUsed",
                      v as EMISSION_FACTORS_TIER_TYPES,
                    );
                    await form.trigger("parameters.emissionFactorUsed");

                    // ? selecting T2, the ecosystem must be set to mangrove
                    if (v === EMISSION_FACTORS_TIER_TYPES.TIER_2) {
                      form.setValue("ecosystem", ECOSYSTEM.MANGROVE);
                      await form.trigger("ecosystem");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PROJECT_EMISSION_FACTORS).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {form.getValues("parameters.emissionFactorUsed") ===
        EMISSION_FACTORS_TIER_TYPES.TIER_1 && <T1GlobalEmissionFactor />}

      {form.getValues("parameters.emissionFactorUsed") ===
        EMISSION_FACTORS_TIER_TYPES.TIER_2 && <T2NationalEmissionFactors />}

      {form.getValues("parameters.emissionFactorUsed") ===
        EMISSION_FACTORS_TIER_TYPES.TIER_3 && (
        <>
          <div className="flex">
            {/* T3-exclusive emission factors */}
            <FormField
              control={form.control}
              name="parameters.projectSpecificEmission"
              render={() => (
                <FormItem className="basis-1/2">
                  <FormLabel
                    tooltip={{
                      title: "Project-specific emissions type",
                      content: "TBD",
                    }}
                  >
                    Project-specific emissions type
                  </FormLabel>
                  <FormControl>
                    <Select
                      name="parameters.projectSpecificEmission"
                      value={form.getValues(
                        "parameters.projectSpecificEmission",
                      )}
                      onValueChange={async (v) => {
                        form.setValue(
                          "parameters.projectSpecificEmission",
                          v as PROJECT_SPECIFIC_EMISSION,
                        );
                        await form.trigger(
                          "parameters.projectSpecificEmission",
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PROJECT_SPECIFIC_EMISSION)?.map(
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

          {/* T3 and One Emission Factor */}
          {form.getValues("parameters.projectSpecificEmission") ===
            PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR && (
            <div className="flex">
              <FormField
                control={form?.control}
                name="parameters.projectSpecificEmissionFactor"
                render={({ field }) => (
                  <FormItem className="basis-1/2">
                    <FormLabel
                      tooltip={{
                        title: "Project Specific Emission Factor",
                        content: "TBD",
                      }}
                    >
                      Project Specific Emission Factor
                    </FormLabel>
                    <FormControl className="relative after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['tCO2e/ha/year']">
                      <div className="relative flex flex-1 items-center">
                        <Input
                          {...field}
                          className="w-full pr-32"
                          type="number"
                          min={0}
                          onChange={async (v) => {
                            form.setValue(
                              "parameters.projectSpecificEmissionFactor",
                              Number(v.target.value),
                            );
                            await form.trigger(
                              "parameters.projectSpecificEmissionFactor",
                            );
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* T3 and Two Emission Factors */}
          {form.getValues("parameters.projectSpecificEmission") ===
            PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS && (
            <div className="flex gap-3">
              <FormField
                control={form?.control}
                name="parameters.emissionFactorAGB"
                render={({ field }) => (
                  <FormItem className="basis-1/2">
                    <FormLabel
                      tooltip={{
                        title: "AGB Emission Factor",
                        content: "TBD",
                      }}
                    >
                      AGB Emission Factor
                    </FormLabel>
                    <FormControl className="relative after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['tCO2e/ha/year']">
                      <div className="relative flex flex-1 items-center">
                        <Input
                          {...field}
                          className="w-full pr-32"
                          type="number"
                          min={0}
                          onChange={async (v) => {
                            form.setValue(
                              "parameters.emissionFactorAGB",
                              Number(v.target.value),
                            );
                            await form.trigger("parameters.emissionFactorAGB");
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form?.control}
                name="parameters.emissionFactorSOC"
                render={({ field }) => (
                  <FormItem className="basis-1/2">
                    <FormLabel
                      tooltip={{
                        title: "SOC Emission Factor",
                        content: "TBD",
                      }}
                    >
                      SOC Emission Factor
                    </FormLabel>
                    <FormControl className="relative after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['tCO2e/ha/year']">
                      <div className="relative flex flex-1 items-center">
                        <Input
                          {...field}
                          className="w-full pr-32"
                          type="number"
                          min={0}
                          onChange={async (v) => {
                            form.setValue(
                              "parameters.emissionFactorSOC",
                              Number(v.target.value),
                            );
                            await form.trigger("parameters.emissionFactorSOC");
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
