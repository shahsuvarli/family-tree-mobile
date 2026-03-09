import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { getDefaultConfig } from "@expo/metro-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const punycodePath = require.resolve("punycode/");

const config = await getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;
config.resolver.resolverMainFields = ["react-native", "browser", "module", "main"];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  punycode: punycodePath,
  ws: path.resolve(__dirname, "shims/ws.js"),
};
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "punycode") {
    return {
      filePath: punycodePath,
      type: "sourceFile",
    };
  }

  if (moduleName === "ws") {
    return {
      filePath: path.resolve(__dirname, "shims/ws.js"),
      type: "sourceFile",
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

export default config;
