export const formatCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
};

export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => {
  const formatted = Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
    ...options,
  }).format(value);

  // Removes trailing ".00" if present
  return formatted.replace(/\.00$/, "");
};

/**
 * Converts a large numeric value into a compact format with an "M" suffix
 * representing millions.
 *
 * @param {number} value - The numeric value to be converted.
 * @returns {string} - The formatted string representing the value in millions with one decimal place.
 *
 * @example
 * toCompactAmount(38023789); // Returns "38.0M"
 */
export const toCompactAmount = (value: number) => {
  return `${(value / 1_000_000).toFixed(1)}M`;
};

export const toPercentageValue = (value: number): string =>
  formatNumber(value * 100);
export const toDecimalPercentageValue = (value: string): number =>
  parseFloat(value) / 100;
