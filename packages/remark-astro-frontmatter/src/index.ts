import { addDefaults, findUpAll, ObjectLike, VFile } from '@astro-m2dx/common';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Plugin } from 'unified';
import YAML from 'js-yaml';

const DEFAULT_NAME = '_frontmatter.yaml';

export interface Options {
  name: string;
}

/**
 * Plugin
 * @param options
 * @returns transformer function
 */
export const plugin: Plugin<[Partial<Options>], unknown> = (options = {}) => {
  const { name = DEFAULT_NAME } = options;
  const cache: Record<string, Record<string, unknown> | null | undefined> = {};

  async function findFrontmatter(dir: string, stop: string) {
    let found: Record<string, unknown> | null | undefined = cache[dir];
    if (found === undefined) {
      const files = await findUpAll(name, dir, stop);
      if (files.length > 0) {
        const yaml = files.map((f) => readFileSync(f, 'utf8'));
        const frontmatter = yaml.map((y) => YAML.load(y)) as ObjectLike[];
        found = {};
        addDefaults(found, ...frontmatter);
      } else {
        found = null;
      }
      cache[dir] = found;
    }
    return found;
  }

  return async function transformer(_: unknown, file: VFile) {
    const dir = file.dirname ?? '';
    const stop = join(file.cwd, 'src');
    const frontmatter = await findFrontmatter(dir, stop);
    if (frontmatter) {
      if (!file.data.astro.frontmatter) {
        file.data.astro.frontmatter = {};
      }
      addDefaults(file.data.astro.frontmatter, frontmatter);
    }
  };
};

export default plugin;
