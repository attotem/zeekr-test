<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>
		<template v-if="sliderData">
			<div class="article-1">
				<Slider
					v-if="Object.keys(sliderData?.media_content || {}).length > 0"
					:count="Object.keys(sliderData?.media_content || {}).length"
					:slider-type="1"
				>
					<article
						class="slide"
						v-for="slide in sliderData.media_content"
						:style="{ backgroundImage: `url(${slide.value.image_url || slide.value.video_url})` }"
					>
						<div class="article-1__h article-1__h--1">
							{{ sliderData.banner_title }}
						</div>
						<div class="article-1__h article-1__h--2">
							{{ sliderData.banner_subtitle }}
						</div>
					</article>
				</Slider>
			</div>

			<article class="article-2 models">
				<h2 class="article-2__h">
					{{ i18n.pages.home.models?.[langStore.activeLang] }}
				</h2>
				<div
					class="model"
					v-for="model in models"
				>
					<img
						v-if="model.value.image.url"
						:src="model.value.image.url"
						class="model__image"
					/>
					<h3 class="model__name">{{ model.value.name }}</h3>
					<div class="model__overlay">
						<RouterLink
							class="btn btn--orange"
							:to="model?.value.car_page ? `/${model?.value.car_page?.url?.child}` : ''"
						>
							{{ i18n.pages.home.details?.[langStore.activeLang] }}
						</RouterLink>
						<RouterLink
							v-if="false"
							class="btn btn--transparent"
							:class="{ 'btn--transparent-white': !isMobile(), 'btn--transparent-black': isMobile() }"
							to="/configurator"
							>Configurator</RouterLink
						>
					</div>
				</div>
			</article>

			<article
				class="article-2 assemble"
				v-if="sliderData.configurator && false"
			>
				<div class="assemble__inner">
					<div class="article-2__h">
						{{ sliderData.configurator.banner_title }}
					</div>
					<div class="btn btn--white">Configurator</div>
				</div>
				<img
					class="assemble__image"
					:src="sliderData.configurator.image"
				/>
			</article>

			<div
				class="article-2 news"
				v-if="false"
			>
				<div class="article-2__h">
					{{ i18n.universal.news?.[langStore.activeLang] }}
				</div>
				<Slider
					:slider-type="2"
					:count="news?.length"
				>
					<article
						class="slide"
						v-for="article in news"
						:key="article.id"
					>
						<img
							class="slide__image"
							:src="article.image"
						/>
						<div class="slide__date">
							{{ new Date(article.date).toLocaleDateString() }}
						</div>
						<div class="slide__h">
							{{ article.heading?.[langStore.activeLang] }}
						</div>
					</article>
				</Slider>
				<div class="btn btn--black">
					{{ i18n.universal.more?.[langStore.activeLang] }}
				</div>
			</div>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Slider from "@/components/Slider.vue";
import { computed, onMounted, ref } from "vue";
import API from "@/composables/API";
import { useLangStore } from "@/stores/lang";
import isMobile from "@/composables/isMobile";
import { useLoaderStore } from "@/stores/loader";
import Logo from "@/components/icons/logo.vue";

let models = ref([]),
  news = ref([]),
  sliderData = ref({})
let langStore = useLangStore()
let isLoading = computed(() => useLoaderStore().isLoading)

onMounted(async () => {
  useLoaderStore().isLoading = true
  news.value = await API.News.get();

  sliderData.value = await API.HomePage.get();
  document.title = sliderData.value.title;
  models.value = sliderData.value.car_models;
  console.log(models.value)
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
.slide {
  &r {
    width: 100%;
    height: 100%;
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: #fff;
}

.model {
  &s {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    background-color: #fff;

    .article-2__h {
      color: #000;
      grid-column: 1 / span 2;
    }
  }

  position: relative;

  &:hover {
    .model__overlay {
      opacity: 1;
      user-select: none;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    aspect-ratio: 634/330;
    object-fit: cover;
    background-color: #cdcdcd;
  }

  &__name {
    z-index: 0;
    position: absolute;
    top: 16px;
    left: 16px;

    font-family: Tenor Sans;
    font-size: 28px;
    line-height: 1.15;
    color: #fff;
  }

  &__overlay {
    user-select: auto;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 16px;
    opacity: 0;
    transition: .3s ease-in-out;
    background-color: #00000060;
  }
}

.assemble {
  position: relative;
  background-color: #fff;
  margin-top: unset;

  &__inner {
    top: 50px;
    left: 0;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
  }

  .article-2__h {
    color: #fff;
  }

  .btn {
    width: 198px;
  }

  &__image {
    width: 100%;
  }
}

@media screen and (max-width: 876px) {
  .model {
    &s {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 24px;

    &:has(+.model) {
      border-bottom: 1px solid #DDDDDD;
    }

    &__image {
      aspect-ratio: 343/228;
    }

    &__name {
      position: relative;
      top: 0;
      left: 0;
      color: #000;
    }

    &__overlay {
      position: relative;
      opacity: 1;
      background: unset;

      .btn {
        width: 100%;
        text-align: center;
      }
    }
  }

  .assemble {
    margin-top: 0;

    &__image {
      height: 540px;
      object-fit: cover;
    }
  }
}
</style>
