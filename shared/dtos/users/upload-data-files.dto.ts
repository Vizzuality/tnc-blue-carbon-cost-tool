export const UPLOAD_DATA_FILE_KEYS = {
  COST_INPUTS_TEMPLATE: "cost-inputs-template",
  CARBON_INPUTS_TEMPLATE: "carbon-inputs-template",
} as const;

export type UploadDataFilesDto = Express.Multer.File[];
export type UploadDataFilesWithKeyDto = (Express.Multer.File & {
  key: string;
})[];
