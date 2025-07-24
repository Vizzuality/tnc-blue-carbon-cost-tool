import { Changelog } from "@shared/entities/model-versioning/changelog.type";
import { AlertTriangleIcon } from "lucide-react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import MethodologyTable, {
  MethodologyBaseTableRow,
  MethodologyTableDefinition,
} from "@/containers/methodology/table";
import { versionsHeaders } from "@/containers/methodology/table/data";

const getTableData = (changelogs: Changelog[]) => {
  const rows: MethodologyTableDefinition<MethodologyBaseTableRow>["rows"] = [];

  changelogs.forEach((changelog) => {
    rows.push({
      id: changelog.versionName,
      ...changelog,
      createdAt: new Date(changelog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      versionNotes: (
        <div
          dangerouslySetInnerHTML={{
            __html: changelog.versionNotes ? changelog.versionNotes : "N/A",
          }}
        />
      ),
    });
  });

  return { headers: versionsHeaders, rows };
};

const queryKey = queryKeys.methodology.changelogs.queryKey;
const VersionsTable = () => {
  const { data } = client.methodology.getChangeLogs.useQuery(
    queryKey,
    {},
    {
      queryKey,
      select: (data) => {
        const sortedChangelogs = data.body.data.sort(
          (a, b) =>
            new Date(b?.createdAt as unknown as string).getTime() -
            new Date(a?.createdAt as unknown as string).getTime(),
        );
        return getTableData(sortedChangelogs as Changelog[]);
      },
    },
  );

  if (!data?.rows.length) {
    return (
      <div className="!mt-12 px-2">
        <div className="flex justify-center gap-2">
          <AlertTriangleIcon className="h-5 w-5" />
          <p className="text-center">No versions published yet</p>
        </div>
      </div>
    );
  }

  return <MethodologyTable data={data} />;
};

export default VersionsTable;
