<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<template v-else-if="modelData">
			<article class="article-1">
				<picture class="picture intro-background">
					<source
						v-if="modelData.banner_image_pc"
						:srcset="modelData.banner_image_pc"
						media="(min-width: 992px)"
					/>
					<source
						v-if="modelData.banner_image_tablet"
						:srcset="modelData.banner_image_tablet"
						media="(min-width: 576px) and (max-width: 991px)"
					/>
					<source
						v-if="modelData.banner_image_phone"
						:srcset="modelData.banner_image_phone"
						media="(max-width: 575px)"
					/>
					<img
						:src="modelData.banner_image_pc || modelData.banner_image_tablet || modelData.banner_image_phone || modelData.image"
						alt="Zeekr"
						loading="lazy"
					/>
				</picture>
				<h1 class="article-1__h article-1__h--1">
					{{ modelData.banner_title }}
				</h1>
				<h2 class="article-1__h article-1__h--2">
					{{ modelData.banner_subtitle }}
				</h2>
				<div class="article-1__btns">
					<div
						class="btn btn--orange"
						@click="isModalOpened = i18n.modal.testDrive; modalType = 'testDrive'; mailObj = {type: 'test_drive', page: 'test_drive'}"
					>
						{{ i18n.pages.car.testDrive?.[langStore.activeLang] }}
					</div>
					<!-- <div
						class="btn btn--transparent btn--transparent-white"
						@click="isModalOpened = i18n.modal.car; modalType = 'car'; mailObj = {type: 'order', page: 'order'}"
					>
						{{ i18n.pages.car.order?.[langStore.activeLang] }}
					</div> -->
					<a
						v-if="modelData.price_list"
						class="btn btn--transparent btn--transparent-white"
						:href="sameOriginMediaUrl(modelData.price_list)"
						target="_blank"
						rel="noopener noreferrer"
					>
						{{ i18n.pages.car.priceList?.[langStore.activeLang] }}
					</a>
				</div>
			</article>

			<article
				class="specifications"
				v-if="modelData.car_versions"
			>
				<div class="specifications__inner">
					<h3 class="specifications__h">
						{{ modelData.car_versions_title }}
					</h3>
					<div class="specifications__categories">
						<div
							class="category"
							v-for="(category, counter) in Object.keys(modelData.car_versions)"
							:class="{ 'category--active': counter == activeCategoryIndex }"
							@click="activeCategoryIndex = counter"
						>
							<img
								:src="modelData.car_versions_tab_icons[category]"
								class="category__image"
							/>
							<div class="category__text">{{ category }}</div>
						</div>
					</div>

					<div
						class="table"
						:style="{ gridTemplateColumns: `repeat(${Object.values(modelData.car_versions)[activeCategoryIndex][0].length}, 1fr)` }"
					>
						<div class="table__body">
							<div
								class="table__heading"
								v-for="(h, counter) in Object.values(modelData.car_versions)[activeCategoryIndex][0]"
							>
								{{ h }}
							</div>

							<template
								v-for="column in Object.values(modelData.car_versions)[activeCategoryIndex].slice(1)"
							>
								<template v-for="(cell, key) in column">
									<div class="table__cell">{{ cell }}</div>
								</template>
							</template>
						</div>
					</div>

					<a
						v-if="false"
						:href="modelData.allDetails"
						target="_blank"
						class="show"
						>{{ i18n.universal.showAllCharacteristics?.[langStore.activeLang] }}</a
					>
				</div>
			</article>

			<article class="article-2">
				<h3 class="article-2__h">{{ modelData.images_slider_title }}</h3>

				<div
					class="swiper"
					ref="photoSwiper"
				>
					<div class="swiper__inner swiper-wrapper">
						<img
							class="swiper__image swiper-slide"
							v-for="image in modelData.slider_images"
							:src="image.value.image.url"
						/>
					</div>
				</div>
			</article>

			<article class="article-2">
				<h3 class="article-2__h">{{ modelData.images_slider_title1 }}</h3>

				<div class="swiper">
					<div class="swiper__inner swiper-wrapper">
						<img
							class="swiper__image swiper-slide"
							v-for="image in modelData.slider_images1"
							:src="image.value.image.url"
						/>
					</div>
				</div>
			</article>

			<article class="article-2 tech">
				<h3 class="article-2__h">{{ modelData.technology_block_title }}</h3>

				<div
					class="tech__item"
					v-for="item in modelData.technologies"
				>
					<img
						class="tech__image"
						:src="item.value.image.url"
					/>
					<h4 class="tech__h">{{ item.value.name }}</h4>
					<div class="tech__text">
						{{ item.value.description }}
					</div>
				</div>
			</article>

			<article class="article-2 tech">
				<h3 class="article-2__h">{{ modelData.technology_block_title1 }}</h3>

				<div
					class="tech__item"
					v-for="item in modelData.technologies1"
				>
					<img
						class="tech__image"
						:src="item.value.image.url"
					/>
					<h4 class="tech__h">{{ item.value.name }}</h4>
					<div class="tech__text">
						{{ item.value.description }}
					</div>
				</div>
			</article>

			<article
				class="article-2 swiper--black"
				v-if="false"
			>
				<h3 class="article-2__h">{{ modelData.youtube_videos_title }}</h3>

				<div class="swiper swiper--video">
					<div class="swiper__inner swiper-wrapper">
						<template v-for="video in modelData.youtube_videos">
							<img
								v-if="false"
								class="swiper__image swiper-slide"
								:src="video.value.image.url"
							/>

							<div
								class="swiper__image swiper-slide"
								v-html="video.value.link"
							></div>
						</template>
					</div>
				</div>
			</article>

			<article
				class="article-2 accessories"
				v-if="false"
			>
				<h3 class="article-2__h">
					{{ i18n.universal.accessories?.[langStore.activeLang] }}
				</h3>

				<Slider
					:slider-type="2"
					:count="5"
				>
					<article
						class="slide"
						v-for="article in accessories"
						:key="article.id"
					>
						<img
							class="slide__image"
							:src="article.image"
						/>
						<h4 class="slide__h">
							{{ article.heading?.[langStore.activeLang] }}
						</h4>
					</article>
				</Slider>
			</article>

			<ModalContact
				:heading="i18n.modal?.[modalType]"
				:is-opened="isModalOpened !== false"
				:mailObj="mailObj"
				@close="isModalOpened = false"
			/>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from "@/components/icons/logo.vue";
import Car1 from "@/assets/img/car1.jpg"
import API from '@/composables/API';
import Slider from "@/components/Slider.vue";
import { useLangStore } from '@/stores/lang';
import { computed, markRaw, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { useRouter } from 'vue-router'
import { watch } from 'vue'
import { useLoaderStore } from "@/stores/loader";
import { ref as vueRef } from 'vue';
import ModalContact from "@/components/ModalContact.vue";
import { sameOriginMediaUrl } from "@/utils/sameOriginMediaUrl";

const router = useRouter();
let isLoading = computed(() => useLoaderStore().isLoading)

let langStore = useLangStore(),
  route = useRoute()
let modelData = ref({}),
  activeCategoryIndex = ref(0),
  accessories = ref([
    {
      image: Car1,
      heading: {
        en: 'Smart key for Zeekr 001'
      }
    }, {
      image: Car1,
      heading: {
        en: 'Original interior mats'
      }
    }, {
      image: Car1,
      heading: {
        en: 'Panorama sunshade for Zeekr001'
      }
    }, {
      image: Car1,
      heading: {
        en: 'Smart key for Zeekr 001'
      }
    }, {
      image: Car1,
      heading: {
        en: 'Original interior mats'
      }
    },
  ]),
	isModalOpened = ref(false),
	mailObj = ref({}),
	modalType = ref()

const photoSwiper = vueRef();
let currentPhotoIndex = ref(0);

function slidePhoto(dir) {
	const images = modelData.value.slider_images || [];
	currentPhotoIndex.value = Math.max(0, Math.min(currentPhotoIndex.value + dir, images.length - 1));
	// Прокрутка слайдера через Swiper API
	if (photoSwiper.value && photoSwiper.value.swiper) {
		photoSwiper.value.swiper.slideTo(currentPhotoIndex.value);
	}
}

onMounted(async () => {
	useLoaderStore().isLoading = true;
	await loadModelData()
	useLoaderStore().isLoading = false;
	initSwipers()
})

watch(() => langStore.activeLang, async () => {
	await loadModelData()
})

watch(
  () => [route.params.parentId, route.params.childId],
  async () => {
		useLoaderStore().isLoading = true;
    await loadModelData()
		useLoaderStore().isLoading = false;
    initSwipers()
  },
  { immediate: true }
)

async function loadModelData() {
	if (!route.params.childId) {
		console.warn("No model ID provided");
		router.push("/404");
		return;
	}

	try {
		const data = await API.Models.getByURL(route.params.childId);

		if (!data) {
			console.warn("Model not found");
			router.push("/404");
			return;
		}

		modelData.value = data;
		activeCategoryIndex.value = 0;
	} catch (error) {
		console.error("Failed to load model:", error);
		router.push("/404");
	} finally {
		useLoaderStore().isLoading = false;
	}
}


function initSwipers() {
	nextTick(() => {
		document.querySelectorAll('.swiper').forEach(el => {
			new Swiper(el, {
				slidesPerView: 1.1,
				speed: 750,
				centeredSlides: true,
				breakpoints: {
				876: {
					slidesPerView: 1.67,
					centeredSlides: false,
					slidesOffsetAfter: 400,
					slidesOffsetBefore: 0,
				}
				},
				slideToClickedSlide: true,
				modules: [Navigation],
				navigation: el.classList.contains('swiper--video') || window.innerWidth <= 876,
				createElements: el.classList.contains('swiper--video') || window.innerWidth <= 876
			});
		});
	});
}
</script>

<style lang="scss" scoped>
.article-1 {
  position: relative;
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

  h1, h2, &__btns {
    position: relative;
    z-index: 1;
  }

  &__btns {
    display: flex;
    flex-direction: row;
    gap: 20px;

    .btn {
      width: 122px;
    }
  }
}

.specifications {
  &__categories {
    .category {
      width: fit-content;
    }
  }
}

.tech {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px 20px;

  &__item {
    display: flex;
    flex-direction: column;
  }

  &__image {
    width: 100%;
    aspect-ratio: 634/537;
    object-fit: cover;
  }

  &__h {
    margin-top: 24px;
    margin-bottom: 10px;
    font-size: 24px;
    line-height: 1.25;
  }

  &__text {
    font-size: 16px;
    line-height: 1.2;
  }

  .article-2 {
    &__h {
      margin-bottom: -16px;
      grid-column: 1 / span 2;
    }
  }
}

.accessories {
  position: relative;

  .slide {
    width: 23dvw;
    display: flex;
    flex-direction: column;
    gap: 12px;

    &__date {
      margin-top: 6px;
      font-size: 16px;
      line-height: 1.25;
    }

    &__h {
      font-weight: 500;
      font-size: 20px;
      line-height: 1.25;
    }

    &__image {
      width: 100%;
    }
  }
}

@media screen and (max-width:876px) {
  .article-1 {
    &__btns {
      flex-direction: column;
      gap: 16px;
    }
  }

  .specifications {
    &__inner {
      padding: 50px 16px;
    }

    &__h {
      font-size: 36px;
    }

    &__categories {
      width: 100%;
      padding: 0;
      background-color: unset;
      flex-wrap: wrap;
      gap: 12px 4px;
    }
  }

  .tech {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .accessories {
    :deep(.slider__inner) {
      width: fit-content !important;
    }

    .article-2__h {
      margin-bottom: 16px;
    }

    .slide {
      width: unset;
    }
  }
}
</style>
