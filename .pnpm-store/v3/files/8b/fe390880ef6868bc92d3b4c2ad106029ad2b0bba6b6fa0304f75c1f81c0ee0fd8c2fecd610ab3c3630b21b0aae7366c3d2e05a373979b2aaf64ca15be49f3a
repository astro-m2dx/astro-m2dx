import { jsToTreeNode } from "./utils.js";
function remarkInitializeAstroData() {
  return function(tree, vfile) {
    if (!vfile.data.astro) {
      vfile.data.astro = { frontmatter: {} };
    }
  };
}
const EXPORT_NAME = "frontmatter";
function rehypeApplyFrontmatterExport(pageFrontmatter) {
  return function(tree, vfile) {
    const { frontmatter: injectedFrontmatter } = safelyGetAstroData(vfile.data);
    const frontmatter = { ...injectedFrontmatter, ...pageFrontmatter };
    const exportNodes = [
      jsToTreeNode(`export const ${EXPORT_NAME} = ${JSON.stringify(frontmatter)};`)
    ];
    if (frontmatter.layout) {
      exportNodes.unshift(
        jsToTreeNode(
          `import { jsx as layoutJsx } from 'astro/jsx-runtime';
				
				export default async function ({ children }) {
					const Layout = (await import(${JSON.stringify(frontmatter.layout)})).default;
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					return layoutJsx(Layout, {
						file,
						url,
						content,
						frontmatter: content,
						headings: getHeadings(),
						'server:root': true,
						children,
					});
				};`
        )
      );
    }
    tree.children = exportNodes.concat(tree.children);
  };
}
function isValidAstroData(obj) {
  if (typeof obj === "object" && obj !== null && obj.hasOwnProperty("frontmatter")) {
    const { frontmatter } = obj;
    try {
      JSON.stringify(frontmatter);
    } catch {
      return false;
    }
    return typeof frontmatter === "object" && frontmatter !== null;
  }
  return false;
}
function safelyGetAstroData(vfileData) {
  const { astro } = vfileData;
  if (!astro)
    return { frontmatter: {} };
  if (!isValidAstroData(astro)) {
    throw Error(
      `[MDX] A remark or rehype plugin tried to add invalid frontmatter. Ensure "astro.frontmatter" is a JSON object!`
    );
  }
  return astro;
}
export {
  rehypeApplyFrontmatterExport,
  remarkInitializeAstroData,
  safelyGetAstroData
};
