const addDuration = (baseDate: Date, duration: string) => {
  const match = duration.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(
      `Invalid duration format: "${duration}". Use formats like 15m, 2h, etc.`,
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const result = new Date(baseDate);

  switch (unit) {
    case "s":
      result.setSeconds(result.getSeconds() + value);
      break;
    case "m":
      result.setMinutes(result.getMinutes() + value);
      break;
    case "h":
      result.setHours(result.getHours() + value);
      break;
    case "d":
      result.setDate(result.getDate() + value);
      break;
    default:
      throw new Error(`Unsupported duration unit: "${unit}"`);
  }

  return result;
};

export const DateUtils = {
  addDuration,
};
