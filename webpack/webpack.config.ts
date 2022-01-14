import createExpoWebpackConfigAsync from "@expo/webpack-config/webpack";
import { Arguments, Environment } from "@expo/webpack-config/webpack/types";
import resolveFrom from "resolve-from";
import { VirtualNavigationPlugin } from "./VirtualNavigationPlugin";

module.exports = async function (env: Environment, argv: Arguments) {
  let config = await createExpoWebpackConfigAsync(env, argv);

  const isNative = ["ios", "android"].includes(env.platform);

  if (isNative) {
    // Add the virtual navigation plugin,
    // this is responsible for generating the `_nav.js` file.
    config.plugins!.push(
      new VirtualNavigationPlugin({
        projectRoot: env.projectRoot ?? __dirname,
      })
    );

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    // Alias the demo package
    config.resolve.alias["@expo/auto-nav"] = resolveFrom(
      env.projectRoot,
      "./lib/index.ts"
    );
  }
  // Customize the config before returning it.
  return config;
};
