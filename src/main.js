import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import { initLanguageWatch } from "./composables/API";

import "swiper/css";
import "swiper/css/navigation";
import "fullpage.js/dist/fullpage.min.css";

(async () => {
	const resp = await fetch(`/i18n.json`);
	const i18n = await resp.json();

	if (!localStorage.getItem('bpmHref')) {
		const firstUrl = window.location.href;
		localStorage.setItem('bpmHref', firstUrl);
	}

	const app = createApp(App)
		.use(router)
		.use(createPinia())
		.use(VueGoogleMaps, {
			load: {
				key: "AIzaSyAKG-JJuX-81l317nZRBoUHy7eO_xv_uLo",
				v: "weekly",
			},
		});

	app.config.globalProperties.i18n = i18n;
	app.mount("#app");
	
	initLanguageWatch();
})();
