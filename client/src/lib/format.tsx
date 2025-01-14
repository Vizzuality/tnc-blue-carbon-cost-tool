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
  return Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
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
  (value * 100).toString();
export const toDecimalPercentageValue = (value: string): string =>
  (parseFloat(value) / 100).toString();
