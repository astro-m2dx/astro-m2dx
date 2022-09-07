import type * as vite from 'vite';
import type { AstroConfig } from '../@types/astro';
import { LogOptions } from '../core/logger/core.js';
interface AstroPluginOptions {
    config: AstroConfig;
    logging: LogOptions;
}
export declare function baseMiddleware(config: AstroConfig, logging: LogOptions): vite.Connect.NextHandleFunction;
export default function createPlugin({ config, logging }: AstroPluginOptions): vite.Plugin;
export {};
