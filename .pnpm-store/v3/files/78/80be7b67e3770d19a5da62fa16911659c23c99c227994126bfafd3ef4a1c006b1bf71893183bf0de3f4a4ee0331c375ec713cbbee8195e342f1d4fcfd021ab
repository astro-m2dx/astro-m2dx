import type { HmrContext, ModuleNode } from 'vite';
import type { AstroConfig } from '../@types/astro';
import type { LogOptions } from '../core/logger/core.js';
import { cachedCompilation } from './compile.js';
export interface HandleHotUpdateOptions {
    config: AstroConfig;
    logging: LogOptions;
    compile: () => ReturnType<typeof cachedCompilation>;
}
export declare function handleHotUpdate(ctx: HmrContext, { config, logging, compile }: HandleHotUpdateOptions): Promise<ModuleNode[] | undefined>;
