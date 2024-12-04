import { FC } from "react";

import Tabs from "@/containers/projects/custom-project/annual-project-cash-flow/header/tabs";

import InfoButton from "@/components/ui/info-button";

const Header: FC = () => {
  return (
    <header className="flex items-center justify-between py-2">
      <h2 className="pl-4 text-base font-semibold">Annual project cash flow</h2>
      <Tabs />
      <div className="flex items-center p-3">
        <InfoButton title="tooltip title">tooltip.content</InfoButton>
      </div>
    </header>
  );
};

export default Header;
