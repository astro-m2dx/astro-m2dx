import { findUp, VFile } from '@astro-m2dx/common';
import { readFileSync } from 'fs';
import { Content, Root } from 'mdast';
import { join } from 'path';
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const DEFAULT_NAME = '_auto-import.ts';
/**
 * Structured options for plugin remark-astro-auto-layout
 *
 * Use in astro.config.mjs like
 *
 * ```
 * markdown: {
 *     remarkPlugins: [[autoLayout, {name: "foo.astro"}]],
 *     ...
 */
export interface Options {
  /**
   * Name of Astro layout files to detect in the directory of the MDX-page.
   *
   * The default is '_auto-import.ts'
   */
  name: string;
}

interface AutoImport {
  file: string;
  components: string[];
}

/**
 * Plugin
 * @param options optional `name` property for the layout file
 * @returns transformer function, that operates only on VFile level
 */
export const plugin: Plugin<[Partial<Options>], unknown> = (options = {}) => {
  const { name = DEFAULT_NAME } = options;
  const cache: Record<string, AutoImport | null> = {};

  function findAutoImport(dir: string, stop: string) {
    // use null as marker that there is no file for this directory
    const found: AutoImport | null | undefined = cache[dir];
    if (found || found === null) {
      return found;
    }
    const file = findUp(name, dir, stop);
    if (file) {
      const components = readComponents(file);
      return (cache[dir] = { file, components });
    } else {
      return (cache[dir] = null);
    }
  }

  return async function transformer(root: Root, file: VFile) {
    const dir = file.dirname ?? '';
    const stop = join(file.cwd, 'src');
    const autoImport = await findAutoImport(dir, stop);
    const imports: string[] = [];

    function createAutoImports(root: Root) {
      let applied = false;
      visit(root, 'mdxJsxFlowElement', (node: Node) => {
        if (!imports.includes(node.name) && autoImport!.components.includes(node.name)) {
          node.name = `AutoImport.${node.name}`;
          applied = true;
        }
      });
      return applied;
    }

    if (autoImport) {
      imports.push(...findAllImports(root));
      const requiresAutoImport = createAutoImports(root);
      if (requiresAutoImport) {
        const node = createImport(autoImport.file);
        root.children.push(node as Content);
      }
    }
  };
};

interface Node {
  name: string;
  value: string;
}

const IMPORT = /import\s+(\w+)\s+from/g;
function findAllImports(root: Root) {
  const result: string[] = [];
  visit(root, 'mdxjsEsm', (node: Node) => {
    const imports = [...node.value.matchAll(IMPORT)].map((match) => match[1]);
    result.push(...imports);
  });
  return result;
}

// TODO: Minimize to what is really needed for downstream transformations
export function createImport(file: string) {
  const name = 'AutoImport';
  return {
    type: 'mdxjsEsm',
    value: `import ${name} from "${file}";`,
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {
                  type: 'Identifier',
                  name: name,
                },
              },
            ],
            source: {
              type: 'Literal',
              value: file,
              raw: `"${file}"`,
            },
          },
        ],
        sourceType: 'module',
        comments: [],
      },
    },
  };
}

const NO_MATCH = ['', undefined];
const DEFAULT_EXPORT = /export\s+default\s+(\w+)\s*;/;
function readComponents(file: string) {
  const src = readFileSync(file, 'utf8');
  const defaultExport = (src.match(DEFAULT_EXPORT) ?? NO_MATCH)[1];
  if (defaultExport) {
    const DECLARATION = new RegExp(`const\\s+${defaultExport}\\s*=\\s*{([\\s\\w,]*)}`);
    const declaration = (src.match(DECLARATION) ?? NO_MATCH)[1];
    if (declaration) {
      const result = declaration
        .split(',')
        .filter((s) => !!s)
        .map((s) => s.trim());
      return result;
    }
  }
  return [];
}

export default plugin;
