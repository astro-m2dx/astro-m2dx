import { Plugin } from 'unified';

export interface Options {
  levels: number[];
}

interface Node {
  type: string;
  children: Node[];
  name?: string;
  depth?: number;
  value?: string;
  data?: Record<string, unknown>;
}

/**
 * Plugin
 * @param options fully optional options
 * @returns transformer function
 */
export const plugin: Plugin<[Partial<Options>], unknown> = ({ levels } = {}) => {
  function sectionize(node: Node, index: number, parent: Node) {
    // Usually the mdast is a flat list,
    // but you never know which plugins have worked on it before...
    // let's sectionize the children first, just in case.
    if (node.children && node.children.length > 0) {
      sectionize(node.children[0], 0, node);
    }

    // Only headings have depth 1..6
    const level = node.depth ?? 7;
    if (level < 7 && (!levels || levels.includes(level))) {
      const section: Node = {
        type: 'section',
        data: {
          hName: 'section',
          hProperties: { class: `h${level}` },
        },
        children: [],
      };
      const childCount = countChildren(parent.children, index, level);
      section.children = parent.children.splice(index, childCount, section);
      if (section.children.length > 1) {
        // recursively sectionize cildren of the section (skip first heading)
        sectionize(section.children[1], 1, section);
      }
    }

    // sectionize next siblings
    const next = index + 1;
    if (parent.children.length > next) {
      sectionize(parent.children[next], next, parent);
    }
  }

  return function transformer(root: Node) {
    sectionize(root.children[0], 0, root);
  };
};

function countChildren(children: Node[], start: number, level: number) {
  let count = 1;
  for (; start + count < children.length; count++) {
    const child = children[start + count];
    // Heading level is smaller, i.e. bigger heading
    if (child.depth ?? 7 <= level) return count;
  }
  return count;
}

export default plugin;
