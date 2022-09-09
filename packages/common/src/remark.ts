import { VFile as UnistVFile, Data } from 'vfile';

export type VFile = UnistVFile & {
  data: Data & {
    astro: {
      frontmatter: Record<string, unknown>;
    };
  };
};
