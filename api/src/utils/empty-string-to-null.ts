import { ValueTransformer } from 'typeorm';

// Helper function to convert empty strings to null. This is useful for parsed excel, depending on how the file has been built,
// empty cells can be represented as empty strings. This function will convert those empty strings to null.

export const EmptyStringToNull: ValueTransformer = {
  to: (value: string | null) => (value === '' ? null : value),
  from: (value: string | null) => value,
};
