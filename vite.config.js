import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vike from "vike/plugin";
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync, readFileSync } from "fs";
import { join, dirname, relative } from "path";

function copyPagesPlugin() {
	return {
		name: "copy-pages",
		apply: "build",
		async generateBundle() {
			const srcDir = fileURLToPath(new URL("./src/assets/pages", import.meta.url));
			const projectRoot = fileURLToPath(new URL("./", import.meta.url));
			
			if (!existsSync(srcDir)) {
				console.warn("⚠️ src/assets/pages directory not found");
				return;
			}
			
			function copyRecursive(src, baseSrc) {
				const stats = statSync(src);
				if (stats.isDirectory()) {
					const files = readdirSync(src);
					files.forEach(file => {
						copyRecursive(join(src, file), baseSrc);
					});
				} else {
					const relPath = relative(baseSrc, src);
					this.emitFile({
						type: "asset",
						fileName: `pages/${relPath}`,
						source: readFileSync(src)
					});
				}
			}
			
			copyRecursive(srcDir, srcDir);
		}
	};
}

export default defineConfig({
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
	},
});
