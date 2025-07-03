import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoaderStore = defineStore("loader", () => {
	const isLoading = ref(true);

	function endLoading() {
		isLoading.value = false;
	}

	return { isLoading, endLoading };
});
