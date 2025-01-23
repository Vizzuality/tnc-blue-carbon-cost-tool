import { FC } from "react";

import { useAtomValue } from "jotai";

import { methodologyStepAtom } from "@/containers/methodology/store";
import Sidebar from "@/containers/sidebar";
import SidebarNavigation, {
  SidebarNavigationItem,
} from "@/containers/sidebar/sidebar-navigation";

interface MethodologySidebarProps {
  navItems: SidebarNavigationItem[];
}

const MethodologySidebar: FC<MethodologySidebarProps> = ({ navItems }) => {
  const intersecting = useAtomValue(methodologyStepAtom);

  return (
    <Sidebar>
      <SidebarNavigation
        srOnlyTitle="Methodology sections"
        items={navItems}
        currentSection={intersecting}
      />
    </Sidebar>
  );
};

export default MethodologySidebar;
