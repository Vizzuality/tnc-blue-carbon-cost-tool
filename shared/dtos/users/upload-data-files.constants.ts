// Map of file extensions to their corresponding MIME types
// reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types
export const ALLOWED_USER_UPLOAD_FILE_EXTENSIONS = {
  ".pdf": "application/pdf",
  ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;

export const AVAILABLE_USER_UPLOAD_TEMPLATES = [
  {
    id: "1",
    fileName: "carbon-input-template.xlsx",
  },
  {
    id: "2",
    fileName: "cost-input-template.xlsx",
  },
];

export const MAX_USER_UPLOAD_FILES = 3;
