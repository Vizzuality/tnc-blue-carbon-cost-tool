import * as fs from 'fs';
import * as path from 'path';

const FIXTURES_DIR = path.join(__dirname, '.');

export const loadFixtures = (): Record<string, any>[] => {
  return fs
    .readdirSync(FIXTURES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((file) => ({
      name: file,
      data: JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, file), 'utf-8')),
    }));
};
