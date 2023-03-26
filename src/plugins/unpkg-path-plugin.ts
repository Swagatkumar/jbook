import axios from "axios";
import {
  OnLoadArgs,
  PluginBuild,
  OnLoadResult,
  OnResolveResult,
  OnResolveArgs,
} from "esbuild-wasm";

const handleResolve = async (args: OnResolveArgs): Promise<OnResolveResult> => {
  console.log("onResolve", args);
  if (args.path === "index.js") return { path: args.path, namespace: "a" };
  if (args.path.includes("./") || args.path.includes("../")) {
    return {
      path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
        .href,
      namespace: "a",
    };
  }
  return {
    path: `https://unpkg.com/${args.path}`,
    namespace: "a",
  };
};

const handleLoad = async (args: OnLoadArgs): Promise<OnLoadResult> => {
  console.log("onLoad", args);

  if (args.path === "index.js") {
    return {
      loader: "jsx",
      contents: `
          const message = require('react');
          console.log(message);
        `,
    };
  }
  const { data, request } = await axios.get(args.path);
  return {
    loader: "jsx",
    contents: data,
    resolveDir: new URL("./", request.responseURL).pathname,
  };
};

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: PluginBuild) {
      build.onResolve({ filter: /.*/ }, handleResolve);

      build.onLoad({ filter: /.*/ }, handleLoad);
    },
  };
};
