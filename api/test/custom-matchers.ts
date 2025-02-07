expect.extend({
  toBeCloseToCustomProjectOutput(received: any, expected: any, tolerance = 50) {
    function recursiveCompare(a: any, b: any, path: string[] = []): string[] {
      let diffs: string[] = [];
      const fullPath = path.length ? path.join(' -> ') : 'root';
      if (typeof a === 'number' && typeof b === 'number') {
        if (Math.abs(a - b) > tolerance) {
          // Rojo para received, verde para expected
          diffs.push(
            `At ${fullPath}: \x1b[31m${a}\x1b[0m vs \x1b[32m${b}\x1b[0m`,
          );
        }
        return diffs;
      }
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
          diffs.push(
            `Array length mismatch at ${fullPath}: ${a.length} vs ${b.length}`,
          );
        }
        const len = Math.min(a.length, b.length);
        for (let i = 0; i < len; i++) {
          // TODO extend this to show all properties of the cost
          const elementPath =
            a[i] && typeof a[i] === 'object' && 'costName' in a[i]
              ? a[i].costName
              : `[${i}]`;
          diffs = diffs.concat(
            recursiveCompare(a[i], b[i], [...path, elementPath]),
          );
        }
        return diffs;
      }
      if (a && b && typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) {
          diffs.push(
            `Key count mismatch at ${fullPath}: ${keysA.length} vs ${keysB.length}`,
          );
        }
        for (const key of keysA) {
          if (!(key in b)) {
            diffs.push(`Missing key '${key}' at ${fullPath}`);
          } else {
            diffs = diffs.concat(
              recursiveCompare(a[key], b[key], [...path, key]),
            );
          }
        }
        return diffs;
      }
      if (a !== b) {
        diffs.push(
          `Mismatch at ${fullPath}: \x1b[31m${a}\x1b[0m vs \x1b[32m${b}\x1b[0m`,
        );
      }
      return diffs;
    }

    const differences = recursiveCompare(received, expected);
    const pass = differences.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? `Input and output are similar within a tolerance of ${tolerance}`
          : `Differences found:\n${differences.join('\n')}`,
    };
  },
});

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeCloseToCustomProjectOutput(expected: any, tolerance?: number): R;
    }
  }
}

export {};
