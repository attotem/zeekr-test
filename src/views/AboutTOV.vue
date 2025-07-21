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
				:style="{ backgroundImage: `url(${data?.banner_image})` }"
			>
				<h1 class="article-1__h article-1__h--1">
					{{ data?.banner_title }}
				</h1>
			</article>

			<article class="article-4">
				<div
					class="article-4__text"
					v-html="data?.description"
				></div>
			</article>

			<article class="article-3">
				<section
					class="section"
					v-for="item in data?.faq"
				>
					<img
						class="section__image"
						:src="item?.value.image.url"
						:key="item.id"
					/>
					<div class="section__info">
						<h3 class="section__h">{{ item.value.name }}</h3>
						<div
							class="section__text"
							v-html="item.value.description"
						></div>
					</div>
				</section>
			</article>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from "@/components/icons/logo.vue";
import { useLoaderStore } from "@/stores/loader";
import API from "@/composables/API";
import { useLangStore } from "@/stores/lang";
import { computed, onMounted, ref, watch } from "vue";

let langStore = useLangStore()
let isModalOpened = ref(false),
  data = ref({})
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => langStore.activeLang, async () => {
  data.value = await API.AboutTOVPage.get()
})

onMounted(async () => {
	useLoaderStore().isLoading = true;
  data.value = await API.AboutTOVPage.get()
	useLoaderStore().isLoading = false;
})
</script>

<style lang="scss" scoped>
.article {
  &-4 {
    &__text {
      width: 100%;
    }
  }
}

@media screen and (max-width: 876px) {
  .article {
    &-1 {
      &__h {
        &--2 {
          max-width: 250px;
          margin-top: -4px;
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>
