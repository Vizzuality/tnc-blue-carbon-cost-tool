import { useAtomValue } from "jotai";

import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import { popupAtom } from "@/app/(overview)/store";

import MapPopup from "@/components/map/popup";
import Currency from "@/components/ui/currency";

const HEADER_CLASSES = "py-0.5 text-left font-normal text-muted-foreground";
const CELL_CLASSES = "py-0.5 font-semibold";

export default function CostAbatementPopup() {
  const popup = useAtomValue(popupAtom);

  return (
    <MapPopup>
      <div className="flex items-center justify-between">
        <span className="font-semibold leading-none">
          {popup?.features?.[0]?.properties?.country}
        </span>
      </div>
      <table className="mt-2">
        <thead>
          <tr>
            <th className={cn(HEADER_CLASSES, "pr-2")}>AVG Cost (USD)</th>
            <th className={cn(HEADER_CLASSES, "px-2")}>Abatement (tCO2e)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={cn(CELL_CLASSES, "pr-2")}>
              <Currency value={popup?.features?.[0]?.properties?.cost} />
            </td>
            <td className={cn(CELL_CLASSES, "px-2")}>
              {formatNumber(
                popup?.features?.[0]?.properties?.abatementPotential,
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted-foreground">
        Values for the country
      </p>
    </MapPopup>
  );
}
