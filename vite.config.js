import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vike from "vike/plugin";

export default defineConfig({
	base: "/",
	plugins: [vue(), vueDevTools()],
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
