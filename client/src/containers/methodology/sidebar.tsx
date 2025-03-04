import { FC } from "react";

import { useAtomValue } from "jotai";

import METHODOLOGY_SECTIONS from "@/containers/methodology/sections";
import { methodologyStepAtom } from "@/containers/methodology/store";
import Sidebar from "@/containers/sidebar";
import SidebarNavigation from "@/containers/sidebar/sidebar-navigation";

const navItems = METHODOLOGY_SECTIONS.map(({ id, title, href }) => ({
  id,
  label: title,
  href,
}));

const MethodologySidebar: FC = () => {
  const intersecting = useAtomValue(methodologyStepAtom);

  return (
    <Sidebar className="max-w-[400px]">
      <SidebarNavigation
        srOnlyTitle="Methodology sections"
        items={navItems}
        currentSection={intersecting}
      />
    </Sidebar>
  );
};

export default MethodologySidebar;
