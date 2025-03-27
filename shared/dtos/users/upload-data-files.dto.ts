export const UPLOAD_DATA_FILE_KEYS = {
  COST_INPUTS_TEMPLATE: "cost-inputs-template",
  CARBON_INPUTS_TEMPLATE: "carbon-inputs-template",
} as const;

export type UploadDataFilesDto = {
  [key in keyof typeof UPLOAD_DATA_FILE_KEYS]?: Express.Multer.File;
};
