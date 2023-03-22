import {
  OnLoadArgs,
  PluginBuild,
  OnLoadResult,
  OnResolveResult,
} from "esbuild-wasm";

const handleResolve = async (args: any): Promise<OnResolveResult> => {
  console.log("onResolve", args);
  return { path: args.path, namespace: "a" };
};

const handleLoad = async (args: OnLoadArgs): Promise<OnLoadResult> => {
  console.log("onLoad", args);

  if (args.path === "index.js") {
    return {
      loader: "jsx",
      contents: `
          import message from './message';
          console.log(message);
        `,
    };
  } else {
    return {
      loader: "jsx",
      contents: 'export default "hi there!"',
    };
  }
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
