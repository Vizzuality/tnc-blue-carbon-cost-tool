import { FC } from "react";

import Tabs from "@/containers/projects/custom-project/annual-project-cash-flow/header/tabs";

import InfoButton from "@/components/ui/info-button";

const Header: FC = () => {
  return (
    <header className="flex items-center justify-between">
      <h2 className="text-base font-semibold">Annual project cash flow</h2>
      <Tabs />
      <InfoButton title="tooltip title">tooltip.content</InfoButton>
    </header>
  );
};

export default Header;
