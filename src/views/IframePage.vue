<template>
	<iframe
		ref="iframeEl"
		class="iframe-page"
		:src="initialSrc"
		frameborder="0"
		allowfullscreen
	></iframe>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const TARGET_ORIGIN = "https://dev.zeekr-2ca.pages.dev";

const route = useRoute();
const router = useRouter();
const iframeEl = ref(null);
const initialSrc = TARGET_ORIGIN + route.fullPath;

// Tracks the path already reflected on both sides, so a route change caused
// by an incoming iframe message doesn't loop back into reloading the iframe.
let lastSyncedPath = route.fullPath;

function handleMessage(event) {
	if (event.origin !== TARGET_ORIGIN) return;
	const data = event.data;
	if (!data || data.type !== "zeekr:route" || typeof data.path !== "string") return;
	if (data.path === route.fullPath) return;

	lastSyncedPath = data.path;
	router.replace(data.path);
}

watch(
	() => route.fullPath,
	(newPath) => {
		if (newPath === lastSyncedPath) return;
		lastSyncedPath = newPath;
		if (iframeEl.value) {
			iframeEl.value.src = TARGET_ORIGIN + newPath;
		}
	}
);

onMounted(() => window.addEventListener("message", handleMessage));
onBeforeUnmount(() => window.removeEventListener("message", handleMessage));
</script>

<style scoped>
.iframe-page {
	position: fixed;
	inset: 0;
	width: 100%;
	height: 100%;
	border: none;
}
</style>
