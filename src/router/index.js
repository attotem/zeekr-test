import { createRouter, createWebHistory } from "vue-router";
import IframePage from "@/views/IframePage.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/:pathMatch(.*)*",
			name: "iframe",
			component: IframePage,
		},
	],
});

export default router;
