import { MethodologySourcesDto } from "@shared/dtos/methodology/methodology-sources.dto";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import MethodologyTable, {
  MethodologyTableRow,
} from "@/containers/methodology/table";
import { sourcesHeaders } from "@/containers/methodology/table/data";

const getTableData = (data: MethodologySourcesDto) => {
  const rows: MethodologyTableRow[] = [];

  data.forEach((item) => {
    const category = item.category;

    item.sourcesByComponentName?.forEach((source) => {
      const modelComponent = source.name;

      rows.push({
        category,
        modelComponent,
        sources: getSourcesComponent(source.sources),
      });
    });
  });

  return rows;
};

const getSourcesComponent = (
  sources: MethodologySourcesDto[number]["sourcesByComponentName"][number]["sources"],
) => {
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
      <>
        <p>{key}</p>
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </>
    );
  });
};
const queryKey = queryKeys.methodology.sources.queryKey;
export default function Sources() {
  const { data } = client.methodology.getMethodologySources.useQuery(
    queryKey,
    {},
    {
      queryKey,
      select: (data) => {
        return getTableData(data.body.data);
      },
    },
  );

  if (!data) {
    return null;
  }

  return <MethodologyTable headers={sourcesHeaders} data={data} categorized />;
}
