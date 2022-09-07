import { preload } from "../../render/dev/index.js";
import { call as callEndpoint } from "../index.js";
async function call(ssrOpts) {
  const [, mod] = await preload(ssrOpts);
  return await callEndpoint(mod, {
    ...ssrOpts,
    ssr: ssrOpts.astroConfig.output === "server"
  });
}
export {
  call
};
