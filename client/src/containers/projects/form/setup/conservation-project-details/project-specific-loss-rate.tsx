import { useState, ChangeEvent } from "react";

import { useFormContext } from "react-hook-form";

import { toPercentageValue, toDecimalPercentageValue } from "@/lib/format";

import { CustomProjectForm } from "@/containers/projects/form/setup";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/**
 * Separate component for project specific loss rate,
 * to make sure the percentage value is formatted correctly
 * on each input change
 */
const ProjectSpecificLossRate = () => {
  const form = useFormContext<CustomProjectForm>();
  const parameters = form.getValues().parameters;
  const [value, setValue] = useState<string>(
    "projectSpecificLossRate" in parameters
      ? toPercentageValue(parameters.projectSpecificLossRate ?? 0)
      : "",
  );
  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setValue(newValue);
    form.setValue(
      "parameters.projectSpecificLossRate",
      toDecimalPercentageValue(newValue),
    );
    await form.trigger("parameters.projectSpecificLossRate");
  };

  return (
    <FormField
      name="parameters.projectSpecificLossRate"
      render={() => (
        <FormItem className="flex items-center justify-between gap-4 space-y-0">
          <div className="flex-1">
            <FormLabel
              tooltip={{
                title: "Project-specific loss rate",
                content: "TBD",
              }}
            >
              Project-specific loss rate
            </FormLabel>
          </div>
          <FormControl className="relative after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground after:content-['%']">
            <div className="relative flex flex-1 items-center">
              <Input
                value={value}
                onChange={handleOnChange}
                className="w-full pr-12"
                type="number"
                max={0}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProjectSpecificLossRate;
