import { MethodologySourcesDto } from "@shared/dtos/methodology/methodology-sources.dto";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import MethodologyTable, {
  MethodologyTableDefinition,
  MethodologyBaseTableRow,
} from "@/containers/methodology/table";
import { sourcesHeaders } from "@/containers/methodology/table/data";
import { Fragment } from "react";

const getTableData = (data: MethodologySourcesDto) => {
  const rows: MethodologyTableDefinition<MethodologyBaseTableRow>["rows"] = [];

  data.forEach((item) => {
    const category = item.category;

    item.sourcesByComponentName?.forEach((source) => {
      const modelComponent = source.name;

      rows.push({
        id: `${category}-${modelComponent}`,
        category,
        modelComponent,
        sources: getSourcesComponent(source.sources),
      });
    });
  });

  return { headers: sourcesHeaders, rows };
};

const getSourcesComponent = (
  sources:
    | MethodologySourcesDto[number]["sourcesByComponentName"][number]["sources"]
    | null,
) => {
  if (sources === null) return null;

  if (Array.isArray(sources)) {
    return (
      <ul>
        {sources.map((source) => (
          <li key={source.id}>{source.name}</li>
        ))}
      </ul>
    );
  }

  const keys = Object.keys(sources);

  return keys.map((key) => {
    const items: Array<{ id: number; name: string }> =
      sources[key as keyof typeof sources];

    return (
      <Fragment key={key}>
        <p>{key}</p>
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </Fragment>
    );
  });
};

const queryKey = queryKeys.methodology.sources.queryKey;
const SourcesTable = () => {
  const { data } = client.methodology.getMethodologySources.useQuery(
    queryKey,
    {},
    {
      queryKey,
      select: (data) => getTableData(data.body.data),
    },
  );

  if (!data) {
    return null;
  }

  return <MethodologyTable data={data} categorized />;
};

export default SourcesTable;
