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
					v-if="sliderData?.banner_info && sliderData.banner_info.length > 0"
					:count="sliderData.banner_info.length"  
					:slider-type="1"
				>
					<article
						class="slide"
						v-for="banner in sliderData.banner_info"
						:key="banner.id"
					>
						<picture class="picture intro-background">
							<source
								v-if="banner.value?.image_pc?.url"
								:srcset="banner.value.image_pc.url"
								media="(min-width: 992px)"
							/>
							<source
								v-if="banner.value?.image_tablet?.url"
								:srcset="banner.value.image_tablet.url"
								media="(min-width: 576px) and (max-width: 991px)"
							/>
							<source
								v-if="banner.value?.image_phone?.url"
								:srcset="banner.value.image_phone.url"
								media="(max-width: 575px)"
							/>
							<img
								:src="banner.value?.image_pc?.url || banner.value?.image_tablet?.url || banner.value?.image_phone?.url || banner.value?.image?.url || banner.value?.image"
								alt="Zeekr"
								loading="lazy"
							/>
						</picture>
						<div class="article-1__h article-1__h--1">
							{{ banner.value?.banner_title }}
						</div>
						<div class="article-1__h article-1__h--2">
							{{ banner.value?.banner_subtitle }}
						</div>
					</article>
				</Slider>
			</div>

			<section
				class="carousel"
			>
				<Transition name="carousel-fade">
					<div
						v-if="carouselModels[activeCarouselIndex]"
						:key="`${carouselModels[activeCarouselIndex].id}-${selected7xVersion}-${isMobile()}`"
						class="carousel__bg"
						:style="{ backgroundImage: `url(${getCarouselImage(carouselModels[activeCarouselIndex])})` }"
					></div>
				</Transition>

        <div>
          <h2 class="carousel__title">Модельний ряд</h2>

        <div class="carousel__tabs">
          <template v-for="(item, index) in carouselModels" :key="item.id">
            <div v-if="item.id === '7x'" class="carousel__tab-wrapper">
              <div class="carousel__tab-switcher">
                <button
                  type="button"
                  class="carousel__tab-switcher-btn"
                  :class="{ 'carousel__tab-switcher-btn--active': selected7xVersion === '7x' && index === activeCarouselIndex }"
                  @click="handle7xVersionClick('7x', index)"
                >
                  <span class="carousel__tab-switcher-btn-bg"></span>
                  <span class="carousel__tab-switcher-btn-text">7X</span>
                </button>
                <span class="carousel__tab-switcher-separator">|</span>
                <button
                  type="button"
                  class="carousel__tab-switcher-btn"
                  :class="{ 'carousel__tab-switcher-btn--active': selected7xVersion === '7x_eu' && index === activeCarouselIndex }"
                  @click="handle7xVersionClick('7x_eu', index)"
                >
                  <span class="carousel__tab-switcher-btn-bg"></span>
                  <span class="carousel__tab-switcher-btn-text">7X EU</span>
                </button>
              </div>
            </div>
            <button
              v-else
              type="button"
              class="carousel__tab"
              :class="{ 'carousel__tab--active': index === activeCarouselIndex }"
              @click="handleTabClick(index, item.id)"
            >
              <span class="carousel__tab-bg"></span>
              <span class="carousel__tab-text">{{ item.label }}</span>
            </button>
          </template>
        </div>

        </div>
				

				<div class="carousel__actions">
					<RouterLink
						:to="getCarDetailLink()"
						class="btn btn--white carousel__more"
					>
						Детальніше
					</RouterLink>
				</div>
			</section>

			<!-- <article class="article-2 models">
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
			</article> -->

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
					<RouterLink
						class="slide"
						v-for="article in news.results"
						:id="article.id"
						:to="`/news/${article.id}`"
					>
						<img
							class="slide__image"
							v-if="article.banner_image"
							:src="article.banner_image"
						/>
						<div class="slide__date">
							{{ article.post_date }}
						</div>
						<div class="slide__h">
							{{ article.banner_title }}
						</div>
					</RouterLink>
				</Slider>
			</div>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Slider from "@/components/Slider.vue";
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import API from "@/composables/API";
import { useLangStore } from "@/stores/lang";
import isMobile from "@/composables/isMobile";
import { useLoaderStore } from "@/stores/loader";
import Logo from "@/components/icons/logo.vue";
import img7x from "@/assets/courusel/7x.webp";
import img7xEu from "@/assets/courusel/7x_eu.webp";
import img001 from "@/assets/courusel/001.webp";
import img9x from "@/assets/courusel/9x.webp";
import img007gt from "@/assets/courusel/007gt.webp";
import img001fr from "@/assets/courusel/001fr.webp";
import img009 from "@/assets/courusel/009.webp";
import img009x from "@/assets/courusel/009x.webp";
import img007 from "@/assets/courusel/007.webp";
import imgMix from "@/assets/courusel/mix.webp";
import imgX from "@/assets/courusel/x.webp";

import img7xMb from "@/assets/courusel/7x_mb.webp";
import img001Mb from "@/assets/courusel/001_mb.webp";
import img9xMb from "@/assets/courusel/9x_mb.webp";
import img007gtMb from "@/assets/courusel/007gt_mb.webp";
import img001frMb from "@/assets/courusel/001fr_mb.webp";
import img009Mb from "@/assets/courusel/009_mb.webp";
import img009xMb from "@/assets/courusel/009x_mb.webp";
import img007Mb from "@/assets/courusel/007_mb.webp";
import imgMixMb from "@/assets/courusel/mix_mb.webp";
import imgXMb from "@/assets/courusel/x_mb.webp";

let models = ref([]),
  news = ref([]),
  sliderData = ref({})
let langStore = useLangStore()
let isLoading = computed(() => useLoaderStore().isLoading)

const carouselModels = ref([
  { id: "7x", label: "7X", image: img7x, imageMobile: img7xMb, imageEu: img7xEu, imageEuMobile: img7xMb, link: "/car/7x" },
  { id: "001", label: "001", image: img001, imageMobile: img001Mb, link: "/car/001" },
  { id: "9x", label: "9X", image: img9x, imageMobile: img9xMb, link: "/zeekr-9x" },
  { id: "007gt", label: "007 GT", image: img007gt, imageMobile: img007gtMb, link: "/zeekr-007gt" },
  { id: "001fr", label: "001 FR", image: img001fr, imageMobile: img001frMb, link: "/zeekr-001-fr" },
  { id: "009", label: "009", image: img009, imageMobile: img009Mb, link: "/zeekr-009" },
  { id: "009x", label: "009 Grand", image: img009x, imageMobile: img009xMb, link: "/zeekr-009-grand" },
  { id: "007", label: "007", image: img007, imageMobile: img007Mb, link: "/zeekr-007" },
  { id: "mix", label: "MIX", image: imgMix, imageMobile: imgMixMb, link: "/zeekr-mix" },
  { id: "x", label: "X", image: imgX, imageMobile: imgXMb, link: "/zeekr-x" }
])

const selected7xVersion = ref('7x')

const getCarouselImage = (model) => {
  if (model.id === '7x') {
    const isEu = selected7xVersion.value === '7x_eu'
    const baseImage = isEu ? (model.imageEu || model.image) : model.image
    const baseMobileImage = isEu ? (model.imageEuMobile || model.imageMobile) : model.imageMobile
    return isMobile() ? baseMobileImage : baseImage
  }
  return isMobile() ? model.imageMobile : model.image
}

const handle7xVersionClick = (version, index) => {
  selected7xVersion.value = version
  if (activeCarouselIndex.value !== index) {
    activeCarouselIndex.value = index
  }
}

const handleTabClick = (index, itemId) => {
  activeCarouselIndex.value = index
  if (itemId !== '7x') {
    selected7xVersion.value = '7x'
  }
}

const getCarDetailLink = () => {
  const currentModel = carouselModels.value[activeCarouselIndex.value]
  if (!currentModel) return ''
  
  if (currentModel.link) {
    return currentModel.link
  }
  
  return ''
}

const activeCarouselIndex = ref(0)

watch(() => langStore.activeLang, async () => {
  news.value = await API.News.get();

  sliderData.value = await API.HomePage.get();
  document.title = sliderData.value.title;
  models.value = sliderData.value.car_models;
  console.log(models.value)
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  news.value = await API.News.get();

  sliderData.value = await API.HomePage.get();
  document.title = sliderData.value.title;
  models.value = sliderData.value.car_models;
  console.log(models.value)
  useLoaderStore().isLoading = false
  news.value = await API.News.get();
})
</script>

<style lang="scss" scoped>
.article-1 {
  min-height: 100dvh;
}

.carousel {
  margin: 20px;
    padding: 80px 76px 40px;
    min-height: 80dvh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

  &__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1;
  }

  &__title {
    margin: 0 0 24px;
    font-family: "Tenor Sans";
    font-size: 32px;
    line-height: 1.2;
    text-align: center;
  }

  &__tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
    width: 100%;
  }

  &__tab {
    color: #000;
    border: 1px solid rgba(0, 0, 0, .15);
    font-size: 14px;
    padding: 6px 12px;
    cursor: pointer;
    background: none;
    white-space: nowrap;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    transition: color .3s ease, border-color .3s ease;

    &-bg {
      position: absolute;
      inset: 0;
      background: #F75400;
      border-radius: 20px;
      transform: scale(0);
      transform-origin: center;
      transition: transform .4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 0;
    }

    &-text {
      position: relative;
      z-index: 1;
    }

    &--active {
      color: #fff;
      border-color: #F75400;

      .carousel__tab-bg {
        transform: scale(1);
      }
    }

    &:hover:not(&--active) {
      border-color: rgba(247, 84, 0, .5);
    }
  }

  &__tab-wrapper {
    display: flex;
    align-items: center;
  }

  &__tab-switcher {
    display: flex;
    align-items: center;
    background: none;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: 20px;
    padding: 0;
    gap: 0;
    position: relative;
    transition: border-color .3s ease;

    &:has(.carousel__tab-switcher-btn--active) {
      border-color: #F75400;
    }
  }

  &__tab-switcher-btn {
    color: #000;
    font-size: 14px;
    padding: 6px 12px;
    cursor: pointer;
    background: none;
    border: none;
    white-space: nowrap;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    transition: color .3s ease;
    z-index: 1;

    &-bg {
      position: absolute;
      inset: 0;
      background: #F75400;
      border-radius: 20px;
      transform: scale(0);
      transform-origin: center;
      transition: transform .4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 0;
    }

    &-text {
      position: relative;
      z-index: 1;
    }

    &--active {
      color: #fff;

      .carousel__tab-switcher-btn-bg {
        transform: scale(1);
      }
    }

    &:hover:not(&--active) {
      color: #F75400;
    }
  }

  &__tab-switcher-separator {
    color: rgba(0, 0, 0, .3);
    font-size: 14px;
    padding: 0 4px;
    user-select: none;
    position: relative;
    z-index: 2;
  }

  &__actions {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }

  &__more {
    min-width: 120px;
    font-size: 14px;
    background: none;
    border: .0078125rem solid #000;

  }

  &__image-wrapper {
    display: none;
  }
}

@media screen and (max-width: 876px) {
  .carousel {
    margin: 16px;
    padding: 40px 16px 24px;
    min-height: 70dvh;
    overflow: visible;
    align-items: stretch;

    & > div {
      width: 100%; 
      overflow: visible;
    }

    &__title {
      font-size: 24px;
      margin-bottom: 16px;
    }

    &__tabs {
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      overflow-x: auto;
      overflow-y: hidden;
      gap: 8px;
      margin-bottom: 24px;
      padding-bottom: 8px;
      width: 100%;
      max-width: 100%;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__tab {
      flex-shrink: 0;
      font-size: 12px;
      padding: 6px 12px;

      &-bg {
        border-radius: 20px;
      }
    }

    &__tab-switcher {
      flex-shrink: 0;
    }

    &__tab-switcher-btn {
      font-size: 12px;
      padding: 6px 10px;

      &-bg {
        border-radius: 20px;
      }
    }

    &__tab-switcher-separator {
      font-size: 12px;
      padding: 0 2px;
    }

    &__actions {
      margin-top: 24px;
    }

    &__more {
      min-width: 100px;
      font-size: 12px;
    }
  }
}

.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity .4s ease;
}

.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
}

.slide {
  &r {
    width: 100%;
    height: 100%;
  }

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: #fff;
  overflow: hidden;

  .picture {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .article-1__h {
    position: relative;
    z-index: 1;
  }
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
    width: 120px;
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
