export const TimeUtils = {
  parseDurationToSeconds: (duration: string): number => {
    const timeValue = parseInt(duration.slice(0, -1), 10); // Get the numeric part
    const timeUnit = duration.slice(-1); // Get the unit part (e.g., 'h', 'm', 's', 'd')

    switch (timeUnit) {
      case 's': // Seconds
        return timeValue;
      case 'm': // Minutes
        return timeValue * 60;
      case 'h': // Hours
        return timeValue * 3600;
      case 'd': // Days
        return timeValue * 86400;
      default:
        throw new Error('Invalid time unit. Use "s", "m", "h", or "d".');
    }
  },
} as const;
