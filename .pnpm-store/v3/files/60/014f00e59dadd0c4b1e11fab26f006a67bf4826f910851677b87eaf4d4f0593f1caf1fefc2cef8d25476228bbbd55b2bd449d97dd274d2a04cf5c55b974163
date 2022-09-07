import { runHookServerSetup } from "../integrations/index.js";
function astroIntegrationsContainerPlugin({
  config,
  logging
}) {
  return {
    name: "astro:integration-container",
    configureServer(server) {
      runHookServerSetup({ config, server, logging });
    }
  };
}
export {
  astroIntegrationsContainerPlugin as default
};
