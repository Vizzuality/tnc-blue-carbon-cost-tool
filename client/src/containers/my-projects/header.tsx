import { PlusCircledIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h1 className="text-2xl font-medium">My projects</h1>
      </div>
      <Button variant="default">
        <PlusCircledIcon className="mr-1 h-4 w-4" />
        Project
      </Button>
    </div>
  );
}
