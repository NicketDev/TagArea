import fs from "fs";
import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";

if (!fs.existsSync("./dist/")) {
	fs.mkdirSync("./dist/");
}

const commonOptions = {
	bundle: true,
	mainFields: ["svelte", "browser", "module", "main"],
	conditions: ["svelte", "browser"],
	write: true,
	plugins: [
		esbuildSvelte({
			preprocess: sveltePreprocess(),
			compilerOptions: {
				css: "injected"
			}
		})
	]
};

const formats: esbuild.Format[] = ["esm", "iife"];

const builds = formats.flatMap((format) => {
	const isIife = format === "iife";
	const entryPoint = isIife ? `./src/cdn.ts` : `./src/index.ts`;
	return [
		esbuild.build({
			...commonOptions,
			format,
			entryPoints: [entryPoint],
			outfile: `./dist/index.${format}.js`,
			minify: false
		}),
		esbuild.build({
			...commonOptions,
			format,
			entryPoints: [entryPoint],
			outfile: `./dist/index.${format}.min.js`,
			minify: true
		})
	];
});

Promise.all(builds).catch((reason) => {
	console.warn(`Errors: `, reason);
});
