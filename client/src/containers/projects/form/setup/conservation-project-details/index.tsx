import * as React from "react";

import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import {
  PROJECT_EMISSION_FACTORS,
  PROJECT_SPECIFIC_EMISSION,
} from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { LOSS_RATE_USED } from "@shared/schemas/custom-projects/create-custom-project.schema";

import { CONSERVATION_PROJECT_DETAILS } from "@/constants/tooltip";

import NumberFormItem from "@/containers/projects/form/number-form-item";
import LossRate from "@/containers/projects/form/setup/conservation-project-details/loss-rate";
import T1GlobalEmissionFactor from "@/containers/projects/form/setup/conservation-project-details/t1-global-emission-factor";
import T2NationalEmissionFactors from "@/containers/projects/form/setup/conservation-project-details/t2-national-emission-factors";
import { useCustomProjectForm } from "@/containers/projects/form/utils";

import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConservationProjectDetails() {
  const { form, handleFormChange } = useCustomProjectForm();

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
                content: CONSERVATION_PROJECT_DETAILS.LOSS_RATE_USED,
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
                    if (v === LOSS_RATE_USED.NATIONAL_AVERAGE) {
                      form.setValue(
                        "parameters.projectSpecificLossRate",
                        // prettier-ignore
                        form.getFieldState("parameters.projectSpecificLossRate").invalid ?
                            // @ts-expect-error fix later
                            form.formState.defaultValues?.parameters?.projectSpecificLossRate
                            // @ts-expect-error fix later
                          : form.getValues().parameters?.projectSpecificLossRate,
                      );
                    }

                    await form.trigger("parameters.projectSpecificLossRate");
                    await form.trigger("parameters.lossRateUsed");
                  }}
                >
                  {Object.values(LOSS_RATE_USED).map((rate) => (
                    <div className="flex items-center gap-2" key={rate}>
                      <RadioGroupItem
                        id={`lossRateUsed-${rate}`}
                        className="flex-1"
                        value={rate}
                      />
                      <FormLabel
                        htmlFor={`lossRateUsed-${rate}`}
                        className="cursor-pointer"
                      >
                        {rate}
                      </FormLabel>
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
                  title: "Emission factor used (as committed emissions)",
                  content: CONSERVATION_PROJECT_DETAILS.EMISSION_FACTOR_USED,
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
                      content:
                        CONSERVATION_PROJECT_DETAILS.PROCET_SPECIFIC_EMISSIONS_TYPE,
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
                name="parameters.projectSpecificEmissionFactor"
                render={() => (
                  <NumberFormItem
                    label="Project Specific Emission Factor"
                    tooltip={{
                      title: "Emission factor (CO2e/ ha /yr)",
                      content: CONSERVATION_PROJECT_DETAILS.EMISSION_FACTOR,
                    }}
                    formItemClassName="basis-1/2"
                    formControlClassName="after:content-['tCO2e/ha/year']"
                    className="pr-32"
                    min={0}
                    onValueChange={async (v) =>
                      handleFormChange(
                        "parameters.projectSpecificEmissionFactor",
                        v,
                      )
                    }
                  />
                )}
              />
            </div>
          )}

          {/* T3 and Two Emission Factors */}
          {form.getValues("parameters.projectSpecificEmission") ===
            PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS && (
            <div className="flex gap-3">
              <FormField
                name="parameters.emissionFactorAGB"
                render={() => (
                  <NumberFormItem
                    label="AGB Emission Factor"
                    tooltip={{
                      title: "AGB emissions",
                      content: CONSERVATION_PROJECT_DETAILS.SOC_EMISSIONS,
                    }}
                    className="pr-24"
                    formItemClassName="basis-1/2"
                    formControlClassName="after:content-['tCO2e/ha']"
                    min={0}
                    initialValue={form.getValues(
                      "parameters.emissionFactorAGB",
                    )}
                    onValueChange={async (v) =>
                      handleFormChange("parameters.emissionFactorAGB", v)
                    }
                  />
                )}
              />
              <FormField
                name="parameters.emissionFactorSOC"
                render={() => (
                  <NumberFormItem
                    label="SOC Emission Factor"
                    tooltip={{
                      title: "SOC Emissions",
                      content: CONSERVATION_PROJECT_DETAILS.SOC_EMISSIONS,
                    }}
                    className="pr-32"
                    formItemClassName="basis-1/2"
                    formControlClassName="after:content-['tCO2e/ha/year']"
                    min={0}
                    initialValue={form.getValues(
                      "parameters.emissionFactorSOC",
                    )}
                    onValueChange={async (v) =>
                      handleFormChange("parameters.emissionFactorSOC", v)
                    }
                  />
                )}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}
