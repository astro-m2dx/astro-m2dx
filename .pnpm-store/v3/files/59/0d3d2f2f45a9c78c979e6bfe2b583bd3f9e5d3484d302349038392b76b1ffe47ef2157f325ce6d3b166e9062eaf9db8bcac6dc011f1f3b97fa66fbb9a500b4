import { bold } from "kleur/colors";
import { mergeConfig } from "../core/config.js";
import { info } from "../core/logger/core.js";
async function withTakingALongTimeMsg({
  name,
  hookResult,
  timeoutMs = 3e3,
  logging
}) {
  const timeout = setTimeout(() => {
    info(logging, "build", `Waiting for the ${bold(name)} integration...`);
  }, timeoutMs);
  const result = await hookResult;
  clearTimeout(timeout);
  return result;
}
async function runHookConfigSetup({
  config: _config,
  command,
  logging
}) {
  var _a;
  if (_config.adapter) {
    _config.integrations.push(_config.adapter);
  }
  let updatedConfig = { ..._config };
  for (const integration of _config.integrations) {
    if ((_a = integration == null ? void 0 : integration.hooks) == null ? void 0 : _a["astro:config:setup"]) {
      let addPageExtension2 = function(...input) {
        const exts = input.flat(Infinity).map((ext) => `.${ext.replace(/^\./, "")}`);
        updatedConfig._ctx.pageExtensions.push(...exts);
      };
      var addPageExtension = addPageExtension2;
      const hooks = {
        config: updatedConfig,
        command,
        addRenderer(renderer) {
          updatedConfig._ctx.renderers.push(renderer);
        },
        injectScript: (stage, content) => {
          updatedConfig._ctx.scripts.push({ stage, content });
        },
        updateConfig: (newConfig) => {
          updatedConfig = mergeConfig(updatedConfig, newConfig);
        },
        injectRoute: (injectRoute) => {
          updatedConfig._ctx.injectedRoutes.push(injectRoute);
        }
      };
      Object.defineProperty(hooks, "addPageExtension", {
        value: addPageExtension2,
        writable: false,
        enumerable: false
      });
      await withTakingALongTimeMsg({
        name: integration.name,
        hookResult: integration.hooks["astro:config:setup"](hooks),
        logging
      });
    }
  }
  return updatedConfig;
}
async function runHookConfigDone({
  config,
  logging
}) {
  var _a;
  for (const integration of config.integrations) {
    if ((_a = integration == null ? void 0 : integration.hooks) == null ? void 0 : _a["astro:config:done"]) {
      await withTakingALongTimeMsg({
        name: integration.name,
        hookResult: integration.hooks["astro:config:done"]({
          config,
          setAdapter(adapter) {
            if (config._ctx.adapter && config._ctx.adapter.name !== adapter.name) {
              throw new Error(
                `Integration "${integration.name}" conflicts with "${config._ctx.adapter.name}". You can only configure one deployment integration.`
              );
            }
            config._ctx.adapter = adapter;
          }
        }),
        logging
      });
    }
  }
}
async function runHookServerSetup({
  config,
  server,
  logging
}) {
  var _a;
  for (const integration of config.integrations) {
    if ((_a = integration == null ? void 0 : integration.hooks) == null ? void 0 : _a["astro:server:setup"]) {
      await withTakingALongTimeMsg({
        name: integration.name,
        hookResult: integration.hooks["astro:server:setup"]({ server }),
        logging
      });
    }
  }
}
async function runHookServerStart({
  config,
  address,
  logging
}) {
  var _a;
  for (const integration of config.integrations) {
    if ((_a = integration == null ? void 0 : integration.hooks) == null ? void 0 : _a["astro:server:start"]) {
      await withTakingALongTimeMsg({
        name: integration.name,
        hookResult: integration.hooks["astro:server:start"]({ address }),
        logging
      });
    }
  }
}
async function runHookServerDone({
  config,
  logging
}) {
  var _a;
  for (const integration of config.integrations) {
    if ((_a = integration == null ? void 0 : integration.hooks) == null ? void 0 : _a["astro:server:done"]) {
      await withTakingALongTimeMsg({
        name: integration.name,
        hookResult: integration.hooks["astro:server:done"](),
        logging
      });
    }
  }
}
async function runHookBuildStart({
  config,
  buildConfig,
  logging
}) {
  var _a;
  for (const integration of config.integrations) {
    if ((_a = integration == null ? void 0 : integration.hooks) == null ? void 0 : _a["astro:build:start"]) {
      await withTakingALongTimeMsg({
        name: integration.name,
        hookResult: integration.hooks["astro:build:start"]({ buildConfig }),
        logging
      });
    }
  }
}
async function runHookBuildSetup({
  config,
  vite,
  pages,
  target,
  logging
}) {
  var _a;
  for (const integration of config.integrations) {
    if ((_a = integration == null ? void 0 : integration.hooks) == null ? void 0 : _a["astro:build:setup"]) {
      await withTakingALongTimeMsg({
        name: integration.name,
        hookResult: integration.hooks["astro:build:setup"]({
          vite,
          pages,
          target,
          updateConfig: (newConfig) => {
            mergeConfig(vite, newConfig);
          }
        }),
        logging
      });
    }
  }
}
async function runHookBuildSsr({
  config,
  manifest,
  logging
}) {
  var _a;
  for (const integration of config.integrations) {
    if ((_a = integration == null ? void 0 : integration.hooks) == null ? void 0 : _a["astro:build:ssr"]) {
      await withTakingALongTimeMsg({
        name: integration.name,
        hookResult: integration.hooks["astro:build:ssr"]({ manifest }),
        logging
      });
    }
  }
}
async function runHookBuildDone({
  config,
  buildConfig,
  pages,
  routes,
  logging
}) {
  var _a;
  const dir = config.output === "server" ? buildConfig.client : config.outDir;
  for (const integration of config.integrations) {
    if ((_a = integration == null ? void 0 : integration.hooks) == null ? void 0 : _a["astro:build:done"]) {
      await withTakingALongTimeMsg({
        name: integration.name,
        hookResult: integration.hooks["astro:build:done"]({
          pages: pages.map((p) => ({ pathname: p })),
          dir,
          routes
        }),
        logging
      });
    }
  }
}
export {
  runHookBuildDone,
  runHookBuildSetup,
  runHookBuildSsr,
  runHookBuildStart,
  runHookConfigDone,
  runHookConfigSetup,
  runHookServerDone,
  runHookServerSetup,
  runHookServerStart
};
