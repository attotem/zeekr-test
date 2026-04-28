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
					:count="mainSliderSlides.length"
					:slider-type="1"
				>
					<article
						class="slide"
						v-for="(slide, index) in mainSliderSlides"
						:key="index"
					>
						<picture class="picture intro-background">
							<source
								v-if="slide.pc"
								:srcset="slide.pc"
								media="(min-width: 992px)"
							/>
							<source
								v-if="slide.tablet"
								:srcset="slide.tablet"
								media="(min-width: 576px) and (max-width: 991px)"
							/>
							<source
								v-if="slide.mobile"
								:srcset="slide.mobile"
								media="(max-width: 575px)"
							/>
							<img
								:src="slide.pc || slide.tablet || slide.mobile"
								:alt="getSlideText(slide.title) || 'Zeekr'"
								loading="eager"
							/>
						</picture>
						<template v-if="slide.isShowroom">
								<div class="article-1__showroom-content">
								<div v-if="getSlideText(slide.title)" class="article-1__h article-1__h--1 article-1__h--showroom">
									<span v-if="slide.titleHighlight">
										{{ getSlideText(slide.title).replace(slide.titleHighlight, '') }}
										<span class="article-1__h-highlight">{{ slide.titleHighlight }}</span>
									</span>
									<span v-else>{{ getSlideText(slide.title) }}</span>
								</div>
								<div class="article-1__info">
									<div v-if="slide.address" class="article-1__info-item">
										{{ slide.address }}
									</div>
									<div v-if="slide.date" class="article-1__info-item">
										{{ slide.date }}
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="article-1__slide-content">
								<div class="article-1__slide-text">
									<div v-if="getSlideText(slide.title)" class="article-1__h article-1__h--1 article-1__h--top">
										{{ getSlideText(slide.title) }}
									</div>
									<div v-if="getSlideText(slide.subtitle)" class="article-1__h article-1__h--2 article-1__h--top">
										{{ getSlideText(slide.subtitle) }}
									</div>
									<div v-if="getSlideText(slide.variants)" class="article-1__h article-1__h--variants article-1__h--top">
										<template
											v-for="(variant, index) in getSlideText(slide.variants).split(' ')"
											:key="index"
										>
											<span>{{ variant }}</span>
											<span
												v-if="index < getSlideText(slide.variants).split(' ').length - 1"
												class="article-1__h-separator"
											>
												|
											</span>
										</template>
									</div>
									<ul v-if="slide.points?.length" class="article-1__points">
										<li
											v-for="(point, idx) in slide.points"
											:key="idx"
											class="article-1__point"
										>
											{{ getSlideText(point) }}
										</li>
									</ul>
									<button
										v-if="slide.isTestDrive"
										type="button"
										class="btn btn--transparent btn--transparent-white article-1__testdrive-btn"
										@click="modalHeading = ''; isModalOpened = i18n.modal?.testDrive; modalType = 'testDrive'; mailObj = { type: 'test_drive', page: 'test_drive' }"
									>
										{{ getSlideText({ ua: 'Замовити тест-драйв', en: 'Book a test drive' }) }}
									</button>
									<button
										v-if="slide.isConsultation"
										type="button"
										class="btn btn--transparent btn--transparent-white article-1__testdrive-btn"
										@click="modalHeading = getSlideText(slide.consultationHeading); isModalOpened = true; modalType = null; mailObj = { type: slide.consultationMailType, page: slide.consultationMailType }"
									>
										{{ getSlideText({ ua: 'Замовити консультацію', en: 'Book a consultation' }) }}
									</button>
									<RouterLink
										v-if="slide.link"
										:to="slide.link"
										class="btn btn--transparent btn--transparent-white article-1__testdrive-btn"
									>
										{{ getSlideText({ ua: 'Детальніше', en: 'Learn more' }) }}
									</RouterLink>
								</div>
							</div>
						</template>
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
          <h2 class="carousel__title">
            {{ getSlideText({ ua: 'Модельний ряд', en: 'Model range' }) }}
          </h2>

        <div class="carousel__tabs">
          <template v-for="(item, index) in carouselModels" :key="item.id">
            <div v-if="item.id === '7x'" class="carousel__tab-wrapper">
              <div 
                class="carousel__tab-switcher"
                :class="{ 
                  'carousel__tab-switcher--active': index === activeCarouselIndex,
                  'carousel__tab-switcher--right': selected7xVersion === '7x_eu' && index === activeCarouselIndex
                }"
              >
                <span class="carousel__tab-switcher-slider"></span>
                <button
                  type="button"
                  class="carousel__tab-switcher-btn carousel__tab-switcher-btn--first"
                  :class="{ 'carousel__tab-switcher-btn--active': selected7xVersion === '7x' && index === activeCarouselIndex }"
                  @click="handle7xVersionClick('7x', index)"
                >
                  7X New
                </button>
                <button
                  type="button"
                  class="carousel__tab-switcher-btn"
                  :class="{ 'carousel__tab-switcher-btn--active': selected7xVersion === '7x_eu' && index === activeCarouselIndex }"
                  @click="handle7xVersionClick('7x_eu', index)"
                >
                  7X CCS 2
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
						class="btn btn--orange carousel__more"
					>
						{{ getSlideText({ ua: 'Детальніше', en: 'Learn more' }) }}
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
		<ModalContact
			:heading="modalHeading || i18n.modal?.[modalType]"
			:is-opened="isModalOpened !== false"
			:mailObj="mailObj"
			@close="isModalOpened = false; modalHeading = ''"
		/>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Slider from "@/components/Slider.vue";
import { computed, getCurrentInstance, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import API from "@/composables/API";
import { sortCarModelsForHeader } from "@/composables/sortCarModelsForHeader";
import { useLangStore } from "@/stores/lang";
import isMobile from "@/composables/isMobile";
import { useLoaderStore } from "@/stores/loader";
import Logo from "@/components/icons/logo.vue";
import ModalContact from "@/components/ModalContact.vue";
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
import img7xEuMb from "@/assets/courusel/7x_eu_mb.webp";

import showroomPc from "@/assets/slider/showroom/showroom_pc.webp";
import showroomTablet from "@/assets/slider/showroom/showroom_tablet.webp";
import showroomMb from "@/assets/slider/showroom/showroom_mb.png";

import slide001Pc from "@/assets/slider/001/001_pc.webp";
import slide001Tablet from "@/assets/slider/001/001_tablet.webp";
import slide001Mb from "@/assets/slider/001/001_mb.webp";

import slide7xPc from "@/assets/slider/7x/7X_pc.webp";
import slide7xTablet from "@/assets/slider/7x/7X_tablet.webp";
import slide7xMb from "@/assets/slider/7x/7X_mb.webp";

import slide9xPc from "@/assets/slider/9x/9X_pc.webp";
import slide9xTablet from "@/assets/slider/9x/9X_tablet.webp";
import slide9xMb from "@/assets/slider/9x/9X_mb.webp";

import slideTdPc from "@/assets/courusel/testdrive_pc_tablet_site.webp";
import slideTdTablet from "@/assets/courusel/testdrive_pc_tablet_site.webp";
import slideTdMb from "@/assets/courusel/testdrive_phone_tablet_site.webp";

import slideCreditPc from "@/assets/courusel/credit_pc_site.png";
import slideCreditTablet from "@/assets/courusel/credit_tablet_site.png";
import slideCreditMb from "@/assets/courusel/credit_phone_site.png";

import slideTradeinPc from "@/assets/courusel/tradein_pc_site.png";
import slideTradeinTablet from "@/assets/courusel/tradein_tablet_site.png";
import slideTradeinMb from "@/assets/courusel/tradein_phone_site.png";

let models = ref([]),
  news = ref([]), 
  sliderData = ref({})
let langStore = useLangStore()
let isLoading = computed(() => useLoaderStore().isLoading)

const i18n = getCurrentInstance()?.appContext?.config?.globalProperties?.i18n || {}
const isModalOpened = ref(false)
const modalType = ref()
const modalHeading = ref('')
const mailObj = ref({})

const mainSliderSlides = [
  {
    pc: slide001Pc,
    tablet: slide001Tablet,
    mobile: slide001Mb,
    link: '/zeekr-001',
    title: {
      ua: '001 NEW',
      en: '001 NEW'
    },
    subtitle: {
      ua: 'Оновлена модель 2026',
      en: 'Updated 2026 model'
    },
    variants: {
      ua: 'MAX ULTRA ULTRA+',
      en: 'MAX ULTRA ULTRA+'
    }
  },
  {
    pc: slide7xPc,
    tablet: slide7xTablet,
    mobile: slide7xMb,
    link: '/zeekr-7x',
    title: {
      ua: '7X New',
      en: '7X New'
    },
    subtitle: {
      ua: 'Оновлена модель 2026',
      en: 'Updated 2026 model'
    },
    variants: {
      ua: 'MAX ULTRA',
      en: 'MAX ULTRA'
    }
  },
  {
    pc: slide9xPc,
    tablet: slide9xTablet,
    mobile: slide9xMb,
    link: '/zeekr-9x',
    title: {
      ua: '9X NEW',
      en: '9X NEW'
    },
    subtitle: {
      ua: 'Новий розкішний флагманський SUV',
      en: 'New luxury flagship SUV'
    },
    variants: {
      ua: 'MAX ULTRA HYPER',
      en: 'MAX ULTRA HYPER'
    }
  },
  {
    pc: slideTdPc,
    tablet: slideTdTablet,
    mobile: slideTdMb,
    isTestDrive: true,
    title: {
      ua: 'Тест-драйв Zeekr вже доступний в Україні!',
      en: 'Zeekr test drive is now available in Ukraine!'
    },
    subtitle: {
      ua: 'Оцініть технологічну перевагу та безкомпромісний комфорт преміальних електромобілів Zeekr',
      en: 'Experience the technological advantage and uncompromising comfort of premium Zeekr electric vehicles'
    }
  },
  {
    pc: slideTradeinPc,
    tablet: slideTradeinTablet,
    mobile: slideTradeinMb,
    isConsultation: true,
    consultationMailType: 'order',
    consultationHeading: {
      ua: 'Trade-In Zeekr',
      en: 'Zeekr Trade-In'
    },
    title: {
      ua: 'Оновіть своє авто на новий Zeekr — легко та вигідно',
      en: 'Upgrade your car to a new Zeekr — easy and advantageous'
    },
    subtitle: {
      ua: 'Скористайтеся програмою Trade-In від Zeekr Ukraine та обміняйте свій автомобіль на новий рівень технологій і комфорту',
      en: 'Use the Zeekr Ukraine Trade-In program and exchange your car for a new level of technology and comfort'
    }
  },
  {
    pc: slideCreditPc,
    tablet: slideCreditTablet,
    mobile: slideCreditMb,
    isConsultation: true,
    consultationMailType: 'financial_service',
    consultationHeading: {
      ua: 'Zeekr Finance',
      en: 'Zeekr Finance'
    },
    title: {
      ua: 'Zeekr Finance — фінансові рішення без компромісів',
      en: 'Zeekr Finance — financial solutions without compromise'
    },
    subtitle: {
      ua: 'Вигідні умови для фізичних та юридичних осіб',
      en: 'Favorable terms for individuals and businesses'
    },
    points: [
      { ua: 'Кредит на 5 років', en: 'Loan for 5 years' },
      { ua: 'Відсоткова ставка 0,01% на перші 2 роки', en: '0.01% interest rate for the first 2 years' },
      { ua: 'Разова комісія 0%', en: 'One-time commission 0%' },
      { ua: 'КАСКО 5.99%', en: 'CASCO 5.99%' }
    ]
  }
]

const getSlideText = (field) => {
  if (!field) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'object' && field !== null) {
    const lang = langStore.activeLang || 'en'

    // Українська може бути як 'uk' або 'ua'
    if ((lang === 'uk' || lang === 'ua') && (field.ua || field.uk)) {
      return field.ua || field.uk
    }

    if (field[lang]) return field[lang]

    return field.ua || field.uk || field.en || Object.values(field)[0] || ''
  }
  return ''
}

const carouselModels = ref([
  { id: "7x", label: "7X", image: img7x, imageMobile: img7xMb, imageEu: img7xEu, imageEuMobile: img7xEuMb, link: "/zeekr-7x" },
  { id: "001", label: "001 New", image: img001, imageMobile: img001Mb, link: "/zeekr-001" },
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
  models.value = sortCarModelsForHeader(sliderData.value.car_models || []);
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  news.value = await API.News.get();

  sliderData.value = await API.HomePage.get();
  document.title = sliderData.value.title;
  models.value = sortCarModelsForHeader(sliderData.value.car_models || []);
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
    border-radius: 24px;
    padding: 4px;
    gap: 0;
    position: relative;
    transition: border-color .3s ease;

    &--active {
      border-color: #F75400;
    }

    &-slider {
      position: absolute;
      top: 4px;
      bottom: 4px;
      left: 4px;
      right: calc(50% + 4px);
      background: #F75400;
      border-radius: 20px;
      z-index: 0;
      opacity: 0;
      transition: 
        left .35s cubic-bezier(0.4, 0, 0.2, 1),
        right .35s cubic-bezier(0.4, 0, 0.2, 1),
        opacity .2s ease;
    }

    &--active &-slider {
      opacity: 1;
    }

    &--right &-slider {
      left: calc(50% + 4px);
      right: 4px;
    }
  }

  &__tab-switcher-btn {
    color: #000;
    font-size: 14px;
    padding: 8px 16px;
    cursor: pointer;
    background: none;
    border: none;
    white-space: nowrap;
    border-radius: 20px;
    position: relative;
    transition: color .3s ease;
    z-index: 1;
    text-align: center;

    &--first {
      &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 16px;
        background: rgba(0, 0, 0, .2);
        z-index: 3;
      }
    }

    &--active {
      color: #fff;
    }

    &:hover:not(&--active) {
      color: #F75400;
    }
  }

  &__actions {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }

  &__more {
    min-width: 120px;
    font-size: 14px;
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
      padding: 3px;
      border-radius: 20px;

      &-slider {
        top: 3px;
        bottom: 3px;
        left: 3px;
        right: calc(50% + 3px);
        border-radius: 17px;
      }

      &--right &-slider {
        left: calc(50% + 3px);
        right: 3px;
      }
    }

    &__tab-switcher-btn {
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 17px;

      &--first::after {
        right: -3px;
        font-size: 12px;
      }
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

  .article-1__showroom-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 80px 20px 60px;
    z-index: 1;
    
    @media screen and (max-width: 876px) {
      padding: 90px 16px 60px;
    }
  }

  .article-1__slide-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 80px 20px 60px;
    z-index: 1;
    
    @media screen and (max-width: 876px) {
      padding: 150px 16px 60px;
    }
  }

  .article-1__slide-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .article-1__points {
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }

  .article-1__point {
    color: rgba(255, 244, 226, 0.9);
    font-size: 18px;
    font-weight: 400;
    line-height: 1.4;

    &::before {
      content: '— ';
      color: rgba(255, 244, 226, 0.6);
    }

    @media screen and (max-width: 876px) {
      font-size: 14px;
    }
  }

  .article-1__testdrive-btn {
    position: relative;
    z-index: 11;
    margin-top: 8px;
    min-width: 220px;
    font-size: 16px;
    
    @media screen and (max-width: 876px) {
      min-width: 180px;
      font-size: 14px;
    }
  }

  .article-1__h {
    position: relative;
    z-index: 1;
    
    &--showroom {
      font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
      font-size: 64px;
      font-weight: 400;
      line-height: 1.2;
      text-align: center;
      margin: 0;
      color: #fff;
      
      @media screen and (max-width: 876px) {
        font-size: 36px;
      }
    }

    &--top {
      font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
      font-size: 64px;
      font-weight: 400;
      line-height: 1.2;
      text-align: center;
      margin: 0;
      color: #fff4e2;
      background: linear-gradient(
        90deg,
        rgba(255, 244, 226, 0.7) 0%,
        #fff4e2 50%,
        rgba(255, 244, 226, 0.7) 100%
      );
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
      
      @media screen and (max-width: 876px) {
        font-size: 36px;
      }
    }

    &--2 {
      font-size: 24px;
      font-weight: 400;
      color: #fff4e2;
      
      @media screen and (max-width: 876px) {
        font-size: 18px;
      }
    }

    &--variants {
      font-size: 24px;
      font-weight: 400;
      display: flex;
      align-items: center;
      gap: 16px;
      color: #fff4e2;
      
      @media screen and (max-width: 876px) {
        font-size: 18px;
        gap: 12px;
      }
    }
    
    &-highlight {
      text-decoration: underline;
      text-decoration-color: #F75400;
      text-decoration-thickness: 2px;
      text-underline-offset: 6px;
    }

    &-separator {
      color: rgba(255, 244, 226, 0.5);
      font-weight: 300;
    }
  }
  
  .article-1__info {
    display: flex;
    gap: 24px;
    justify-content: center;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
    margin: 0;
    
    @media screen and (max-width: 876px) {
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
  }
  
  .article-1__info-item {
    background: transparent;
    border: 1px solid #F75400;
    border-radius: 8px;
    padding: 18px 32px;
    font-size: 20px;
    font-weight: 400;
    color: #fff;
    white-space: nowrap;
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    
    @media screen and (max-width: 876px) {
      font-size: 16px;
      padding: 14px 24px;
    }
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

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
