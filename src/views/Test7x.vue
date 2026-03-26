<template>
  <div class="test-7x-page">
    <TransitionGroup name="loading">
      <div
        v-if="isLoading"
        key="loading"
        class="loading-spinner"
      >
        <Logo />
      </div>
    </TransitionGroup>
    <div v-if="!isLoading">
      <template v-for="(block, index) in visibleBlocks" :key="`block-${index}-${block.type}-${block.dataKey}`">
        <div
          v-if="block.showSwitcher && carId === '7x'"
          class="block-appear"
          v-appear
        >
          <Car360VersionSwitcher
            v-model="selected360Version"
            :labels="{
              standard: {
                ua: '7X New',
                en: '7X New'
              },
              kz: {
                ua: '7X CCS 2',
                en: '7X CCS 2'
              }
            }"
          />
        </div>
        <div
          v-if="block.shouldRender"
          class="block-appear"
          v-appear
        >
          <component
            v-if="block.type === 'hero'"
            :is="block.component"
            :data="block.data"
            :car-id="carId"
            :price-list-url="priceListUrl"
            @buttonClick="handleHeroButtonClick"
          />
          <component
            v-else
            :is="block.component"
            :data="block.data"
            :car-id="carId"
          />
        </div>
      </template>

      
      <CarVersionsCards
        v-if="modelBackendData?.car_versions"
        :title="modelBackendData?.car_versions_title"
        :versions="modelBackendData?.car_versions"
        :icons="modelBackendData?.car_versions_tab_icons"
        :version-images="pageData?.versionsImages || {}"
        :car-id="carId"
      />

      <ModalContact
        :heading="i18n.modal?.[modalType]"
        :is-opened="isModalOpened !== false"
        :mailObj="mailObj"
        @close="isModalOpened = false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '@/components/icons/logo.vue'
import CarHero from '@/components/new_car_page/car-hero.vue'
import CarTextBlock from '@/components/new_car_page/car-text-block.vue'
import CarTextSimpleBlock from '@/components/new_car_page/car-text-simple-block.vue'
import CarImageBlock from '@/components/new_car_page/car-image-block.vue'
import CarNavigationBlock from '@/components/new_car_page/car-navigation-block.vue'
import Car360Block from '@/components/new_car_page/car-360-block.vue'
import Car360KzBlock from '@/components/new_car_page/car-360-kz-block.vue'
import Car360VersionSwitcher from '@/components/new_car_page/car-360-version-switcher.vue'
import CarInsideBlock from '@/components/new_car_page/car-inside-block.vue'
import CarDesignBlock from '@/components/new_car_page/car-design-block.vue'
import CarSliderBlock from '@/components/new_car_page/car-slider-block.vue'
import CarStargateBlock from '@/components/new_car_page/car-stargate-block.vue'
import CarVideoBlock from '@/components/new_car_page/car-video-block.vue'
import CarSpaceBlock from '@/components/new_car_page/car-space-block.vue'
import CarImageCaptionBlock from '@/components/new_car_page/car-image-caption-block.vue'
import CarStorageBlock from '@/components/new_car_page/car-storage-block.vue'
import CarCardsBlock from '@/components/new_car_page/car-cards-block.vue'
import CarImageTextBlock from '@/components/new_car_page/car-image-text-block.vue'
import CarDetailsBlock from '@/components/new_car_page/car-details-block.vue'
import CarMvpBlock from '@/components/new_car_page/car-mvp-block.vue'
import CarBatteryBlock from '@/components/new_car_page/car-battery-block.vue'
import CarTwoImagesBlock from '@/components/new_car_page/car-two-images-block.vue'
import CarImageTextBottomBlock from '@/components/new_car_page/car-image-text-bottom-block.vue'
import CarImageWithTextBelow from '@/components/new_car_page/car-image-with-text-below.vue'
import CarVideoWithTextTop from '@/components/new_car_page/car-video-with-text-top.vue'
import CarVideoNotFullscreenWithTextTop from '@/components/new_car_page/car-video-not-fullscreen-with-text-top.vue'
import CarVideoWithTextOverlay from '@/components/new_car_page/car-video-with-text-overlay.vue'
import CarVideoSwitcherBlock from '@/components/new_car_page/car-video-switcher-block.vue'
import CarMassageBlock from '@/components/new_car_page/car-massage-block.vue'
import CarMaterialsBlock from '@/components/new_car_page/car-materials-block.vue'
import CarCabinFunctionsBlock from '@/components/new_car_page/car-cabin-functions-block.vue'
import CarScreensBlock from '@/components/new_car_page/car-screens-block.vue'
import CarLuxuryBlock from '@/components/new_car_page/car-luxury-block.vue'
import CarTextImageBlock from '@/components/new_car_page/car-text-image-block.vue'
import CarImageTextOverlayBlock from '@/components/new_car_page/car-image-text-overlay-block.vue'
import CarPassiveSecurityBlock from '@/components/new_car_page/car-passive-security-block.vue'
import CarBatterySafetyBlock from '@/components/new_car_page/car-battery-safety-block.vue'
import CarTitleTwoSubtitlesBlock from '@/components/new_car_page/car-title-two-subtitles-block.vue'
import CarPerformanceBlock from '@/components/new_car_page/car-performance-block.vue'
import CarTwoVideosBlock from '@/components/new_car_page/car-two-videos-block.vue'
import CarVideoTextBlock from '@/components/new_car_page/car-video-text-block.vue'
import CarTerrainBlock from '@/components/new_car_page/car-terrain-block.vue'
import CarStrengthBlock from '@/components/new_car_page/car-strength-block.vue'
import CarDetectBlock from '@/components/new_car_page/car-detect-block.vue'
import CarVersionsCards from '@/components/new_car_page/car-versions-cards.vue'
import pageDataJson from '@/assets/pages/7x.json'
import ModalContact from '@/components/ModalContact.vue'
import API from '@/composables/API'
import { useLangStore } from '@/stores/lang'

const i18n = getCurrentInstance()?.appContext?.config?.globalProperties?.i18n || {}

const props = defineProps({
  pageData: {
    type: Object,
    default: null
  },
  carId: {
    type: String,
    default: null
  }
})

const route = useRoute()
const langStore = useLangStore()
const pageData = ref(null)
const isLoading = ref(true)
const selected360Version = ref('standard')
const priceListUrl = ref('')
const modelBackendData = ref(null)

const isModalOpened = ref(false)
const modalType = ref(null)
const mailObj = ref({})

const carId = computed(() => {
  return props.carId || route.params.carId || route.meta.carId || '7x'
})

const carDataModules = import.meta.glob('@/assets/pages/*.json', { eager: false })

const loadCarData = async (id) => {
  try {
    isLoading.value = true
    if (props.pageData) {
      pageData.value = props.pageData
      isLoading.value = false
      return
    }
    const modulePath = `/src/assets/pages/${id}.json`
    const module = carDataModules[modulePath]
    if (module) {
      const data = await module()
      const finalData = data.default || data
      pageData.value = finalData
    } else {
      pageData.value = pageDataJson
    }
  } catch (error) {
    pageData.value = pageDataJson
  } finally {
    isLoading.value = false
  }
}

const loadPriceList = async (id) => {
  try {
    const slug = id === '7x' ? 'zeekr-7x' : `zeekr-${id}`
    const data = await API.Models.getByURL(slug)
    modelBackendData.value = data
    priceListUrl.value = data?.price_list || ''
  } catch (e) {
    console.error('Failed to load model data for car', id, e)
    modelBackendData.value = null
    priceListUrl.value = ''
  }
}

onMounted(() => {
  loadCarData(carId.value)
  loadPriceList(carId.value)
  window.scrollTo(0, 0)
})

watch(() => carId.value, (newId) => {
  if (!props.pageData) {
    loadCarData(newId)
  }
  loadPriceList(newId)
  window.scrollTo(0, 0)
})

watch(() => route.path, () => {
  if (route.name === 'car-page') {
    window.scrollTo(0, 0)
  }
})

const componentMap = {
  hero: CarHero,
  textBlock: CarTextBlock,
  textSimpleBlock: CarTextSimpleBlock,
  imageBlock: CarImageBlock,
  navigationBlock: CarNavigationBlock,
  color360Block: Car360Block,
  color360KzBlock: Car360KzBlock,
  color360VersionSwitcher: Car360VersionSwitcher,
  insideBlock: CarInsideBlock,
  designBlock: CarDesignBlock,
  sliderBlock: CarSliderBlock,
  stargateBlock: CarStargateBlock,
  videoBlock: CarVideoBlock,
  spaceBlock: CarSpaceBlock,
  imageCaptionBlock: CarImageCaptionBlock,
  storageBlock: CarStorageBlock,
  cardsBlock: CarCardsBlock,
  imageTextBlock: CarImageTextBlock,
  detailsBlock: CarDetailsBlock,
  mvpBlock: CarMvpBlock,
  batteryBlock: CarBatteryBlock,
      twoImagesBlock: CarTwoImagesBlock,
      imageTextBottomBlock: CarImageTextBottomBlock,
      imageWithTextBelow: CarImageWithTextBelow,
      videoWithTextTop: CarVideoWithTextTop,
      videoNotFullscreenWithTextTop: CarVideoNotFullscreenWithTextTop,
      videoWithTextOverlay: CarVideoWithTextOverlay,
      videoSwitcherBlock: CarVideoSwitcherBlock,
      massageBlock: CarMassageBlock,
      materialsBlock: CarMaterialsBlock,
      cabinFunctionsBlock: CarCabinFunctionsBlock,
      screensBlock: CarScreensBlock,
      luxuryBlock: CarLuxuryBlock,
      textImageBlock: CarTextImageBlock,
      imageTextOverlayBlock: CarImageTextOverlayBlock,
      passiveSecurityBlock: CarPassiveSecurityBlock,
      batterySafetyBlock: CarBatterySafetyBlock,
  titleTwoSubtitlesBlock: CarTitleTwoSubtitlesBlock,
      performanceBlock: CarPerformanceBlock,
      twoVideosBlock: CarTwoVideosBlock,
  videoTextBlock: CarVideoTextBlock,
  terrainBlock: CarTerrainBlock,
  strengthBlock: CarStrengthBlock,
  detectBlock: CarDetectBlock
}

const getComponent = (type) => {
  const component = componentMap[type] || null
  return component
}

const vAppear = {
  mounted(el) {
    el.classList.add('is-hidden')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              el.classList.add('is-visible')
              el.classList.remove('is-hidden')
            })
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
  }
}

const layoutBlocks = computed(() => {
  if (!pageData.value || isLoading.value) {
    return []
  }
  
  const layout = pageData.value.layout || []
  if (!Array.isArray(layout)) {
    return []
  }
  
  let textBlock360Found = false
  
  const blocks = layout
    .map((blockConfig, index) => {
      if (!blockConfig || !blockConfig.dataKey) {
        return null
      }
      const data = pageData.value[blockConfig.dataKey]
      const isTextBlock360 = blockConfig.type === 'textSimpleBlock' && blockConfig.dataKey === 'textBlock360'
      if (isTextBlock360) {
        textBlock360Found = true
      }
      const showSwitcherAfter = textBlock360Found && blockConfig.type === 'color360Block' && blockConfig.dataKey === 'color360Block'
      if (showSwitcherAfter) {
        textBlock360Found = false
      }
      const component = getComponent(blockConfig.type)
      if (!component && blockConfig.type !== 'color360Block') {
        return null
      }
      
      const block = {
        type: blockConfig.type,
        dataKey: blockConfig.dataKey,
        data: data || null,
        component: component,
        showSwitcherAfter: showSwitcherAfter
      }
      return block
    })
    .filter(block => {
      if (!block) return false
      if (block.type === 'color360Block') {
        return block.data !== null
      }
      return block.data !== null && block.component !== null
    })
  return blocks
})

const visibleBlocks = computed(() => {
  return layoutBlocks.value.map(block => {
    let shouldRender = true
    let showSwitcher = false
    let component = block.component

    if (block.showSwitcherAfter && carId.value === '7x') {
      showSwitcher = true
    }

    if (block.type === 'color360Block' && carId.value === '7x') {
      if (block.dataKey === 'color360Block') {
        shouldRender = selected360Version.value === 'standard'
      } else if (block.dataKey === 'color360BlockKz') {
        shouldRender = selected360Version.value === 'kz'
        if (shouldRender) {
          component = getComponent('color360KzBlock')
        }
      }
    }

    if (block.type === 'textSimpleBlock' && block.dataKey === 'textBlock360Kz' && carId.value === '7x') {
      shouldRender = selected360Version.value === 'kz'
    }
    
    return {
      ...block,
      component,
      shouldRender,
      showSwitcher
    }
  })
})

const handleHeroButtonClick = (type) => {
  if (type === 'test_drive') {
    isModalOpened.value = i18n.modal.testDrive
    modalType.value = 'testDrive'
    mailObj.value = { type: 'test_drive', page: 'test_drive' }
  } else if (type === 'order') {
    isModalOpened.value = i18n.modal.car
    modalType.value = 'car'
    mailObj.value = { type: 'order', page: 'order' }
  } else if (type === 'price_list' && priceListUrl.value) {
    window.open(priceListUrl.value, '_blank')
  }
}
</script>

<style lang="scss" scoped>
.test-7x-page {
  width: 100%;
  min-height: 100vh;
}

.block-appear {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 720ms ease, transform 720ms ease;
}

.block-appear.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
