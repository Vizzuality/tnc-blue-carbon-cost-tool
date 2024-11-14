import { useForm } from "react-hook-form";

import { atom } from "jotai/index";

import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

export const projectFormState = atom<{
  setup: ReturnType<typeof useForm<CreateCustomProjectForm>> | null;
  // todo: define schema
  assumptions: ReturnType<typeof useForm> | null;
  // todo: define schema
  costInputsOverrides: ReturnType<typeof useForm> | null;
}>({
  setup: null,
  assumptions: null,
  costInputsOverrides: null,
});
