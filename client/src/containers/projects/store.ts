import { atom } from "jotai";

import {
  PROJECT_SETUP_STEPS,
  RESTORATION_STEPS,
} from "@/containers/projects/new/sidebar";

export const formStepAtom = atom<
  | (typeof PROJECT_SETUP_STEPS)[number]["slug"]
  | (typeof RESTORATION_STEPS)[number]["slug"]
  | null
>(null);
