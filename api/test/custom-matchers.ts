// Custom matcher to compare objects with a tolerance for numbers.

expect.extend({
  toBeCloseToObject(received: any, expected: any, tolerance = 50) {
    function recursiveCompare(a: any, b: any, path = ''): string | null {
      if (typeof a === 'number' && typeof b === 'number') {
        if (Math.abs(a - b) > tolerance) {
          return `At ${path}: ${a} vs ${b}`;
        }
        return null;
      }
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
          return `Length of array: ${path}: ${a.length} vs ${b.length}`;
        }
        for (let i = 0; i < a.length; i++) {
          const diff = recursiveCompare(a[i], b[i], `${path}[${i}]`);
          if (diff) return diff;
        }
        return null;
      }
      if (a && b && typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) {
          return `Key numbers in ${path}: ${keysA.length} vs ${keysB.length}`;
        }
        for (const key of keysA) {
          if (!(key in b)) {
            return `Missing key: '${key}' in expected: ${path}`;
          }
          const diff = recursiveCompare(
            a[key],
            b[key],
            path ? `${path}.${key}` : key,
          );
          if (diff) return diff;
        }
        return null;
      }
      if (a !== b) {
        return `At ${path}: ${a} vs ${b}`;
      }
      return null;
    }

    const diffMessage = recursiveCompare(received, expected);
    const pass = diffMessage === null;
    return {
      pass,
      message: () =>
        pass
          ? `Input and output are similar with tolerance of: ${tolerance}`
          : `Differences found: ${diffMessage}`,
    };
  },
});
/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeCloseToObject(expected: any, tolerance?: number): R;
    }
  }
}

export {};
