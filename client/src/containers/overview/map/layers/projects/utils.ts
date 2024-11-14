export const MATRIX_COLORS: Record<string, string[]> = {
  "#FFFFFF": ["00"],
  "#FFF6CC": ["01"],
  "#FFEF9C": ["02"],
  "#EACD3F": ["03"],
  "#CCF5FF": ["10"],
  "#DAF1C5": ["11"],
  "#CAE394": ["12"],
  "#C4C63C": ["13"],
  "#9EE8FA": ["20"],
  "#A4DDA6": ["21"],
  "#A0D171": ["22"],
  "#93BE37": ["23"],
  "#6CD9F4": ["30"],
  "#6FCEB6": ["31"],
  "#72C476": ["32"],
  "#75B935": ["33"],
};

export const generateColorRamp = function (
  COLOR_NUMBER: number = 3,
  COLORS: Record<string, string[]> = MATRIX_COLORS,
) {
  const colors = [...Array((COLOR_NUMBER + 1) * (COLOR_NUMBER + 1)).keys()];

  return colors
    .map((c, i) => {
      const position = `${Math.floor((i / (COLOR_NUMBER + 1)) % (COLOR_NUMBER + 1))}${
        i % (COLOR_NUMBER + 1)
      }`;
      const color = Object.keys(COLORS).reduce((acc, k) => {
        if (COLORS[k].includes(position) && !acc) {
          return k;
        }

        return acc;
      }, "");

      return [position, color];
    })
    .flat();
};
