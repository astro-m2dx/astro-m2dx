import fs from "fs";
import * as colors from "kleur/colors";
import { performance } from "perf_hooks";
import {
  runHookBuildDone,
  runHookBuildStart,
  runHookConfigDone,
  runHookConfigSetup
} from "../../integrations/index.js";
import { createVite } from "../create-vite.js";
import { fixViteErrorMessage } from "../errors.js";
import { debug, info, levels, timerMessage } from "../logger/core.js";
import { apply as applyPolyfill } from "../polyfill.js";
import { RouteCache } from "../render/route-cache.js";
import { createRouteManifest } from "../routing/index.js";
import { collectPagesData } from "./page-data.js";
import { staticBuild } from "./static-build.js";
import { getTimeStat } from "./util.js";
async function build(config, options) {
  applyPolyfill();
  const builder = new AstroBuilder(config, options);
  await builder.run();
}
class AstroBuilder {
  constructor(config, options) {
    this.mode = "production";
    if (options.mode) {
      this.mode = options.mode;
    }
    this.config = config;
    this.logging = options.logging;
    this.routeCache = new RouteCache(this.logging);
    this.origin = config.site ? new URL(config.site).origin : `http://localhost:${config.server.port}`;
    this.manifest = { routes: [] };
    this.timer = {};
  }
  async setup() {
    debug("build", "Initial setup...");
    const { logging } = this;
    this.timer.init = performance.now();
    this.config = await runHookConfigSetup({ config: this.config, command: "build", logging });
    this.manifest = createRouteManifest({ config: this.config }, this.logging);
    const viteConfig = await createVite(
      {
        mode: this.mode,
        server: {
          hmr: false,
          middlewareMode: true
        }
      },
      { astroConfig: this.config, logging, mode: "build" }
    );
    await runHookConfigDone({ config: this.config, logging });
    return { viteConfig };
  }
  async build({ viteConfig }) {
    const buildConfig = {
      client: new URL("./client/", this.config.outDir),
      server: new URL("./server/", this.config.outDir),
      serverEntry: "entry.mjs"
    };
    await runHookBuildStart({ config: this.config, buildConfig, logging: this.logging });
    info(this.logging, "build", `output target: ${colors.green(this.config.output)}`);
    if (this.config._ctx.adapter) {
      info(this.logging, "build", `deploy adapter: ${colors.green(this.config._ctx.adapter.name)}`);
    }
    info(this.logging, "build", "Collecting build info...");
    this.timer.loadStart = performance.now();
    const { assets, allPages } = await collectPagesData({
      astroConfig: this.config,
      logging: this.logging,
      manifest: this.manifest
    });
    debug("build", timerMessage("All pages loaded", this.timer.loadStart));
    const pageNames = [];
    this.timer.buildStart = performance.now();
    info(
      this.logging,
      "build",
      colors.dim(`Completed in ${getTimeStat(this.timer.init, performance.now())}.`)
    );
    await staticBuild({
      allPages,
      astroConfig: this.config,
      logging: this.logging,
      manifest: this.manifest,
      mode: this.mode,
      origin: this.origin,
      pageNames,
      routeCache: this.routeCache,
      viteConfig,
      buildConfig
    });
    this.timer.assetsStart = performance.now();
    Object.keys(assets).map((k) => {
      if (!assets[k])
        return;
      const filePath = new URL(`file://${k}`);
      fs.mkdirSync(new URL("./", filePath), { recursive: true });
      fs.writeFileSync(filePath, assets[k], "utf8");
      delete assets[k];
    });
    debug("build", timerMessage("Additional assets copied", this.timer.assetsStart));
    await runHookBuildDone({
      config: this.config,
      buildConfig,
      pages: pageNames,
      routes: Object.values(allPages).map((pd) => pd.route),
      logging: this.logging
    });
    if (this.logging.level && levels[this.logging.level] <= levels["info"]) {
      await this.printStats({
        logging: this.logging,
        timeStart: this.timer.init,
        pageCount: pageNames.length,
        buildMode: this.config.output
      });
    }
  }
  async run() {
    const setupData = await this.setup();
    try {
      await this.build(setupData);
    } catch (_err) {
      throw fixViteErrorMessage(_err);
    }
  }
  async printStats({
    logging,
    timeStart,
    pageCount,
    buildMode
  }) {
    const total = getTimeStat(timeStart, performance.now());
    let messages = [];
    if (buildMode === "static") {
      messages = [`${pageCount} page(s) built in`, colors.bold(total)];
    } else {
      messages = ["Server built in", colors.bold(total)];
    }
    info(logging, "build", messages.join(" "));
    info(logging, "build", `${colors.bold("Complete!")}`);
  }
}
export {
  build as default
};
