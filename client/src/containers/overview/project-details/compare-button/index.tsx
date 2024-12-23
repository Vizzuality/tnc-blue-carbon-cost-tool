import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CompareButton = () => {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs text-big-stone-200">
        Compare with a different project
      </Label>
      <Button variant="outline" className="h-8 w-8 p-0 hover:bg-transparent">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CompareButton;
