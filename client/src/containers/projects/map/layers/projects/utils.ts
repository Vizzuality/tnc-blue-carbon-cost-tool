export const MATRIX_COLORS: Record<string, string[]> = {
  "#e8e8e8": ["00"],
  "#e4acac": ["01"],
  "#c85a5a": ["02"],
  "#b0d5df": ["10"],
  "#ad9ea5": ["11"],
  "#985356": ["12"],
  "#64acbe": ["20"],
  "#627f8c": ["21"],
  "#574249": ["22"],
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
