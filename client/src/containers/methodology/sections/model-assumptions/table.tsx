import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import MethodologyTable, {
  MethodologyBaseTableRow,
  MethodologyTableDefinition,
} from "@/containers/methodology/table";
import { modelAssumptionsHeaders } from "@/containers/methodology/table/data";

const getTableData = (data: ModelAssumptions[]) => {
  const rows: MethodologyTableDefinition<MethodologyBaseTableRow>["rows"] =
    data.map((item) => ({
      id: item.id,
      assumptions: item.name,
      units: item.unit,
      value: item.value,
    }));

  return {
    headers: modelAssumptionsHeaders,
    rows,
  };
};
const queryKey = queryKeys.methodology.modelAssumptions.queryKey;
const ModelAssumptionsTable = () => {
  const { data } = client.methodology.getAllModelAssumptions.useQuery(
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

  return <MethodologyTable data={data} />;
};

export default ModelAssumptionsTable;
