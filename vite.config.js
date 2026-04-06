import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import {  readdirSync, statSync, existsSync, readFileSync } from "fs";
import { join, relative } from "path";

function copyPagesPlugin() {
	return {
		name: "copy-pages",
		apply: "build",
		async generateBundle() {
			const pagesDir = fileURLToPath(new URL("./src/assets/pages", import.meta.url));
			const colorsDir = fileURLToPath(new URL("./src/assets/colors", import.meta.url));
			const self = this;
			
			function copyRecursive(src, baseSrc, destPrefix) {
				if (!existsSync(src)) return;
				
				const stats = statSync(src);
				if (stats.isDirectory()) {
					const files = readdirSync(src);
					files.forEach(file => {
						copyRecursive(join(src, file), baseSrc, destPrefix);
					});
				} else {
					const relPath = relative(baseSrc, src);
					self.emitFile({
						type: "asset",
						fileName: `${destPrefix}/${relPath}`,
						source: readFileSync(src)
					});
				}
			}
			
			if (existsSync(pagesDir)) {
				copyRecursive(pagesDir, pagesDir, "pages");
			} else {
				console.warn("⚠️ src/assets/pages directory not found");
			}
			
			if (existsSync(colorsDir)) {
				copyRecursive(colorsDir, colorsDir, "src/assets/colors");
			} else {
				console.warn("⚠️ src/assets/colors directory not found");
			}
		}
	};
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const mediaProxyTarget = env.VITE_API_ORIGIN || "https://zeekr-back.xyz";

	return {
		base: "/",
		plugins: [vue(), vueDevTools(), copyPagesPlugin()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
				"fast-deep-equal": "fast-deep-equal/es6",
			},
		},
		server: {
			historyApiFallback: true,
			proxy: {
				"/media": {
					target: mediaProxyTarget.replace(/\/$/, ""),
					changeOrigin: true,
				},
			},
		},
	};
});
