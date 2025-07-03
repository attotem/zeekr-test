<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>
		<div
			class="page"
			v-if="data"
		>
			<h1 class="page__h">{{ data?.page_title }}</h1>
			<div
				class="page__text"
				v-html="data?.description"
			></div>
		</div>
	</TransitionGroup>
</template>

<script setup>
import Logo from '@/components/icons/logo.vue';
import API from '@/composables/API';
import { useLoaderStore } from '@/stores/loader';
import { computed, onMounted, ref } from 'vue';

let data = ref({})
let isLoading = computed(() => useLoaderStore().isLoading)

onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.PrivacyPolicyPage.get();
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
.page {
  margin: 114px 76px 50px;

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
    margin-bottom: 16px;
  }

  &__text:deep(*) {
    font-size: 16px;
    line-height: 1.4;
  }
}

@media screen and (max-width: 876px) {
  .page {
    margin: 96px 16px 50px;

    &__h {
      font-size: 36px;
    }

    &__text {
      font-size: 14px;
    }
  }
}
</style>
