<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<template v-else-if="data">
			<article
				class="article-1"
				:style="{ backgroundImage: `url(${data.banner_image})` }"
			>
				<h1 class="article-1__h article-1__h--1">
					{{ data.banner_title }}
				</h1>
				<h2 class="article-1__h article-1__h--2">
					{{ data.banner_subtitle }}
				</h2>
			</article>

			<article
				class="partner"
				v-html="data.value_block_text"
			></article>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from '@/components/icons/logo.vue';
import API from '@/composables/API';
import { useLangStore } from '@/stores/lang';
import { useLoaderStore } from '@/stores/loader';
import { computed, onMounted, ref, watch } from 'vue';

let data = ref({})
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => useLangStore().activeLang, async () => {
  data.value = await API.BecomeAPartner.get();
})

onMounted(async () => {
	useLoaderStore().isLoading = true;
  data.value = await API.BecomeAPartner.get();
	useLoaderStore().isLoading = false;
})
</script>

<style lang="scss" scoped>
.partner {
  padding: 80px 76px;
  font-size: 16px;
  line-height: 1.4;
}

@media screen and (max-width: 876px) {
  .partner {
    padding: 50px 16px;
    font-size: 14px;
  }
}
</style>
