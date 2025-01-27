import { atom } from "jotai";

import { METHODOLOGY_SECTIONS } from "@/containers/methodology/sections";

export const methodologyStepAtom = atom<
  (typeof METHODOLOGY_SECTIONS)[number]["id"] | null
>(null);
