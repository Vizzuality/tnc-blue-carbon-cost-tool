import { useAtomValue } from "jotai";

import { renderCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import { popupAtom } from "@/app/(overview)/store";

import MapPopup from "@/components/map/popup";
import { Badge } from "@/components/ui/badge";

const HEADER_CLASSES = "py-0.5 text-left font-normal text-muted-foreground";
const CELL_CLASSES = "py-0.5 font-semibold";

export default function CostAbatementPopup() {
  const popup = useAtomValue(popupAtom);

  return (
    <MapPopup>
      <div className="flex items-center justify-between">
        <span className="font-semibold">
          {popup?.features?.[0]?.properties?.country}
        </span>
        <Badge variant="outline" className="pointer-events-none">
          SUM
        </Badge>
      </div>
      <table>
        <thead>
          <tr>
            <th className={cn(HEADER_CLASSES, "pr-2")}>Cost</th>
            <th className={cn(HEADER_CLASSES, "px-2")}>Abatement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={cn(CELL_CLASSES, "pr-2")}>
              {renderCurrency(popup?.features?.[0]?.properties?.cost)}
            </td>
            <td className={cn(CELL_CLASSES, "px-2")}>
              {renderCurrency(
                popup?.features?.[0]?.properties?.abatementPotential,
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground">
        Values for the SUM of all projects.
      </p>
    </MapPopup>
  );
}
