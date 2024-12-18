import { atom } from "jotai";

import { PROFILE_SECTIONS } from "@/containers/profile";

export const profileStepAtom = atom<
  (typeof PROFILE_SECTIONS)[number]["id"] | null
>(null);
