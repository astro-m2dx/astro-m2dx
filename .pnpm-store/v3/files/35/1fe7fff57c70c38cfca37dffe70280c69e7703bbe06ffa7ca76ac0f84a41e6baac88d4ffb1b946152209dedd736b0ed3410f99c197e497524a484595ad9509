import type { AstroConfig } from '../@types/astro';
import type * as vite from 'vite';
/** Result of successfully parsed tsconfig.json or jsconfig.json. */
export declare interface Alias {
    find: RegExp;
    replacement: string;
}
/** Returns a Vite plugin used to alias pathes from tsconfig.json and jsconfig.json. */
export default function configAliasVitePlugin({ config: astroConfig, }: {
    config: AstroConfig;
}): vite.PluginOption;
