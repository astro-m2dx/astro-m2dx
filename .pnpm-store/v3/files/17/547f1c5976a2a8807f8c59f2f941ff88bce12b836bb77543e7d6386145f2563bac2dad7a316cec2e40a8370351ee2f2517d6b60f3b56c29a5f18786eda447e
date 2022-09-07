/// <reference types="node" />
import type { AddressInfo } from 'net';
import type { ViteDevServer } from 'vite';
import { AstroConfig, BuildConfig, RouteData } from '../@types/astro.js';
import type { SerializedSSRManifest } from '../core/app/types';
import type { PageBuildData } from '../core/build/types';
import type { ViteConfigWithSSR } from '../core/create-vite.js';
import { LogOptions } from '../core/logger/core.js';
export declare function runHookConfigSetup({ config: _config, command, logging, }: {
    config: AstroConfig;
    command: 'dev' | 'build';
    logging: LogOptions;
}): Promise<AstroConfig>;
export declare function runHookConfigDone({ config, logging, }: {
    config: AstroConfig;
    logging: LogOptions;
}): Promise<void>;
export declare function runHookServerSetup({ config, server, logging, }: {
    config: AstroConfig;
    server: ViteDevServer;
    logging: LogOptions;
}): Promise<void>;
export declare function runHookServerStart({ config, address, logging, }: {
    config: AstroConfig;
    address: AddressInfo;
    logging: LogOptions;
}): Promise<void>;
export declare function runHookServerDone({ config, logging, }: {
    config: AstroConfig;
    logging: LogOptions;
}): Promise<void>;
export declare function runHookBuildStart({ config, buildConfig, logging, }: {
    config: AstroConfig;
    buildConfig: BuildConfig;
    logging: LogOptions;
}): Promise<void>;
export declare function runHookBuildSetup({ config, vite, pages, target, logging, }: {
    config: AstroConfig;
    vite: ViteConfigWithSSR;
    pages: Map<string, PageBuildData>;
    target: 'server' | 'client';
    logging: LogOptions;
}): Promise<void>;
export declare function runHookBuildSsr({ config, manifest, logging, }: {
    config: AstroConfig;
    manifest: SerializedSSRManifest;
    logging: LogOptions;
}): Promise<void>;
export declare function runHookBuildDone({ config, buildConfig, pages, routes, logging, }: {
    config: AstroConfig;
    buildConfig: BuildConfig;
    pages: string[];
    routes: RouteData[];
    logging: LogOptions;
}): Promise<void>;
