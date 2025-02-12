import {
  ClipboardPenIcon,
  FileQuestionIcon,
  LayoutDashboardIcon,
  UserIcon,
} from "lucide-react";

const isServer = typeof window === "undefined";

export const introItems = [
  {
    title: "Projects Overview",
    description:
      "Explore and compare over 400 project scenarios with ease. Apply filters for location, ecosystem type, activity, cost, abatement potential and project size. The global map visualizes project blue carbon potential across 9 countries, enabling comparisons based on cost-to-abatement ratios. Additionally, use the comparison table for detailed cost and score analyses, and select a project for additional details.",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Create custom projects",
    description:
      "Design custom scenarios by modifying default parameters and exploring the resulting data in detail. Save your projects to revisit them anytime and quickly compare all the scenarios you’ve created.",
    icon: ClipboardPenIcon,
  },
  {
    title: "Methodology",
    description:
      "Explore for detailed information on model assumptions, estimations, and data sources.",
    icon: FileQuestionIcon,
  },
  {
    title: "Profile",
    description: "Access information about your personal account.",
    icon: UserIcon,
  },
];

export const showIntroModal = (): boolean => {
  if (isServer) return false;

  return !localStorage.getItem("hideIntroModal");
};

export const setHideIntroModal = (): void => {
  if (isServer) return;

  localStorage.setItem("hideIntroModal", "true");
};
