<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>
		<article
			class="article-2 models"
			v-if="modelsData"
		>
			<h1 class="article-2__h">{{ modelsData.banner_title }}</h1>
			<h2 class="article-2__underh">{{ modelsData.banner_subtitle }}</h2>
			<RouterLink
				class="model"
				v-for="model in modelsData.car_models"
				:to="`/${model?.model_page?.url?.child}`"
			>
				<img
					v-if="model.image"
					:src="model.image"
					class="model__image"
				/>
				<div class="model__info">
					<h3 class="model__name">
						{{ model?.name }}
					</h3>
					<div class="model__text">{{ model?.description }}</div>
					<div class="model__price">{{ model?.price }}</div>
				</div>
			</RouterLink>
		</article>
	</TransitionGroup>
</template>

<script setup>
import Logo from '@/components/icons/logo.vue';
import API from '@/composables/API';
import { useLangStore } from '@/stores/lang';
import { useLoaderStore } from '@/stores/loader';
import { computed, onMounted, ref } from 'vue';

let modelsData = ref({})
let langStore = useLangStore()
let isLoading = computed(() => useLoaderStore().isLoading)

onMounted(async () => {
  useLoaderStore().isLoading = true
  modelsData.value = await API.Models.get()
  console.log(modelsData.value)
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>

.article-2 {
  &__underh {
    margin-top: -4px;
    margin-bottom: 12px;
  }
}

.model {
  position: relative;
  width: 100%;
  height: 500px;

  &s {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 145px;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background-color: #ddd;
  }

  &__info {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #00000059;
    color: #fff;
  }

  &__name {
    font-family: Tenor Sans;
    font-size: 42px;
    line-height: 1.15;
  }

  &__text {
    font-size: 20px;
    line-height: 1.2;
    margin-top: 4px;
    margin-bottom: 32px;
  }

  &__price {
    font-size: 28px;
    line-height: 1.25;
    font-weight: 500;
  }
}

@media screen and (max-width: 876px) {
  .article-2 {
    &__h {
      margin-bottom: 0;
    }

    &__underh {
      margin-top: -14px;
      margin-bottom: 0;
    }
  }

  .model {
    height: fit-content;

    &:has(+.model) {
      padding-bottom: 24px;
      border-bottom: 1px solid #ddd;
    }

    &s {
      margin-top: 114px;
      gap: 24px;
    }

    &__image {
      height: 223px;
    }

    &__info {
      position: relative;
      align-items: flex-start;
      background-color: unset;
      color: #000;
      margin-top: 12px;
    }

    &__name {
      font-size: 28px;
    }

    &__text {
      margin-top: 4px;
      margin-bottom: 24px;
      font-size: 16px;
    }

    &__price {
      font-size: 18px;
    }
  }
}
</style>
