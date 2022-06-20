#!/usr/bin/env node

import esbuild from "esbuild";
import { globbySync } from "globby";
import rimraf from "rimraf";
import path from "path";

const __dirname = process.cwd();

console.log("Empty es and lib dirs...");
rimraf.sync(path.resolve(__dirname, "./dist"));

console.log("Bundle `src/**/*.js*`");

const buildIdx = esbuild.build({
  bundle: false,
  format: "cjs",
  target: "node12",
  watch: process.env.WATCH === "true",
  platform: "node",
  outdir: "./dist",
  treeShaking: true,
  charset: "utf8",
  entryPoints: [...globbySync(path.resolve(__dirname, "./src/**/*.js*"))],
});

Promise.all([buildIdx]).then(() => {
  console.log("Awesome! build completed successfully!");
});
