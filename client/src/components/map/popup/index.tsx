import { PropsWithChildren } from "react";
import * as React from "react";

import { Popup } from "react-map-gl";

import { useAtom } from "jotai";
import { XIcon } from "lucide-react";

import { popupAtom } from "@/app/(overview)/store";

export default function MapPopup({ children }: PropsWithChildren) {
  const [popup, setPopup] = useAtom(popupAtom);

  if (!popup || !popup.features?.length) {
    return null;
  }

  const closePopup = () => {
    setPopup(null);
  };

  return (
    <Popup
      longitude={popup.lngLat.lng}
      latitude={popup.lngLat.lat}
      closeOnClick={false}
      onClose={closePopup}
      className="bg-transparent text-sm"
      maxWidth="320"
    >
      <div className="flex flex-col">
        <button type="button" onClick={closePopup} className="self-end">
          <XIcon className="h-4 w-4 text-foreground hover:text-muted-foreground" />
        </button>
        {children}
      </div>
    </Popup>
  );
}
