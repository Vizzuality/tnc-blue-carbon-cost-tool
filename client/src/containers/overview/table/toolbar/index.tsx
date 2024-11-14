import SearchProjectsTable from "@/containers/overview/table/toolbar/search";
import TabsProjectsTable from "@/containers/overview/table/toolbar/table-selector";

import InfoButton from "@/components/ui/info-button";

export default function ToolbarProjectsTable() {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <SearchProjectsTable />
      <TabsProjectsTable />
      <div className="flex flex-1 items-center justify-end space-x-2">
        <InfoButton>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            vehicula, nunc nec vehicula fermentum, nunc libero bibendum purus,
            nec tincidunt libero nunc nec libero. Integer nec libero nec libero
            tincidunt tincidunt. Sed vehicula, nunc nec vehicula fermentum, nunc
            libero bibendum purus, nec tincidunt libero nunc nec libero. Integer
            nec libero nec libero tincidunt tincidunt.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            vehicula, nunc nec vehicula fermentum, nunc libero bibendum purus,
            nec tincidunt libero nunc nec libero. Integer nec libero nec libero
            tincidunt tincidunt. Sed vehicula, nunc nec vehicula fermentum, nunc
            libero bibendum purus, nec tincidunt libero nunc nec libero. Integer
            nec libero nec libero tincidunt tincidunt.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            vehicula, nunc nec vehicula fermentum, nunc libero bibendum purus,
            nec tincidunt libero nunc nec libero. Integer nec libero nec libero
            tincidunt tincidunt. Sed vehicula, nunc nec vehicula fermentum, nunc
            libero bibendum purus, nec tincidunt libero nunc nec libero. Integer
            nec libero nec libero tincidunt tincidunt.
          </p>
        </InfoButton>
      </div>
    </div>
  );
}
