export type DataColumnDef<T = unknown> = {
  label: string;
  property: T;
  defaultValue: string;
  unit: string;
  value: string;
};
