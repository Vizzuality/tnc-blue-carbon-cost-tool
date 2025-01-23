import { atom } from "jotai";

import { METHODOLOGY_SECTIONS } from "@/containers/methodology";

export const methodologyStepAtom = atom<
  (typeof METHODOLOGY_SECTIONS)[number]["id"] | null
>(null);
