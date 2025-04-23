const sanitizeFileName = (originalName: string): string => {
  // Remove any path info and invalid characters
  const baseName = originalName.replace(/^.*[\\/]/, '').split('.')[0];

  // Keep only letters, numbers, dashes, underscores, and dots
  const cleanBase = baseName
    .normalize('NFKD') // Normalize accents (e.g., é -> e)
    .replace(/[^\w\-]+/g, '-') // Replace spaces and symbols with dash
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing dashes

  const ext = originalName.split('.').pop()?.toLowerCase() || '';

  return ext ? `${cleanBase}.${ext}` : cleanBase;
};
const generateS3Key = (
  date: Date,
  userId: string,
  originalName: string,
): string => {
  const timestamp = date.toISOString().replace(/[:.]/g, '-'); // e.g., 2025-04-08T15-34-22-123Z
  const safeName = sanitizeFileName(originalName);
  return `${userId}/${timestamp}/${safeName}`;
};

export const S3Utils = {
  generateS3Key,
};
