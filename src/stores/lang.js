import { defineStore } from "pinia";
import { ref } from "vue";

export const useLangStore = defineStore("lang", () => {
	const langs = ref(["en", "uk"]),
		activeLang = ref(sessionStorage.getItem('lang') || "uk");

	function changeLang(newLang) {
		activeLang.value = newLang;
		sessionStorage.setItem('lang', newLang);
	}

	return { langs, activeLang, changeLang };
});
