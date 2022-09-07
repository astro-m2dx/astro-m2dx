import type { TransformResult } from '@astrojs/compiler';
import type { PluginContext } from 'rollup';
import type { ViteDevServer } from 'vite';
import type { AstroConfig } from '../@types/astro';
import type { TransformStyleWithVite } from './styles';
declare type CompileResult = TransformResult & {
    cssDeps: Set<string>;
    source: string;
};
export interface CompileProps {
    config: AstroConfig;
    filename: string;
    moduleId: string;
    source: string;
    ssr: boolean;
    transformStyleWithVite: TransformStyleWithVite;
    viteDevServer?: ViteDevServer;
    pluginContext: PluginContext;
}
export declare function isCached(config: AstroConfig, filename: string): boolean;
export declare function getCachedSource(config: AstroConfig, filename: string): string | null;
export declare function invalidateCompilation(config: AstroConfig, filename: string): void;
export declare function cachedCompilation(props: CompileProps): Promise<CompileResult>;
export {};
