import { defineStore } from "pinia";
import { ref } from "vue";

export const useLangStore = defineStore("lang", () => {
	const langs = ref(["en", "uk"]),
		activeLang = ref("uk");

	function changeLang(newLang) {
		activeLang.value = newLang;
	}

	return { langs, activeLang, changeLang };
});
