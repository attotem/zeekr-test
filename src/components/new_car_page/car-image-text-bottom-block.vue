<template>
  <section class="car-image-text-bottom-block">
    <div class="car-image-text-bottom-block__image-wrap">
      <img
        :src="resolveImage(blockData.image)"
        :alt="getText(blockData.title)"
        class="car-image-text-bottom-block__image"
        loading="lazy"
      />
      <div class="car-image-text-bottom-block__overlay"></div>
      <div class="car-image-text-bottom-block__text">
        <h2 v-if="getText(blockData.title)" class="car-image-text-bottom-block__title">
          {{ getText(blockData.title) }}
        </h2>
        <p v-if="getText(blockData.subtitle)" class="car-image-text-bottom-block__subtitle">
          {{ getText(blockData.subtitle) }}
        </p>
        <div v-if="blockData.features && blockData.features.length" class="car-image-text-bottom-block__features">
          <div
            v-for="(feature, index) in blockData.features"
            :key="index"
            class="car-image-text-bottom-block__feature"
          >
            <div class="car-image-text-bottom-block__feature-text">{{ getText(feature) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useLangStore } from '@/stores/lang'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  carId: {
    type: String,
    default: '7x'
  }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})

// Track viewport width for responsive image selection
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
let resizeHandler = null

onMounted(() => {
  if (typeof window !== 'undefined') {
    resizeHandler = () => {
      windowWidth.value = window.innerWidth
    }
    window.addEventListener('resize', resizeHandler)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})

const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') return textObj
  if (typeof textObj === 'object' && textObj !== null) {
    const lang = langStore.activeLang
    if (lang && textObj[lang]) return textObj[lang]
    if (lang === 'uk' && textObj.ua) return textObj.ua
    if (lang === 'ua' && textObj.uk) return textObj.uk
    if (lang === 'zh' && (textObj.zh || textObj.cn)) return textObj.zh || textObj.cn
    return textObj.uk || textObj.ua || textObj.en || textObj.ru || textObj.zh || textObj.cn || ''
  }
  return ''
}

// Normalize image value (string or { desktop, tablet, mobile }) to a file name
const getImagePath = (imageObj) => {
  if (!imageObj) return ''
  if (typeof imageObj === 'string') return imageObj

  if (typeof imageObj === 'object' && imageObj !== null) {
    const isMobile = windowWidth.value <= 876
    const isTablet = windowWidth.value > 876 && windowWidth.value <= 1200

    if (isMobile && imageObj.mobile) return imageObj.mobile
    if (isTablet && imageObj.tablet) return imageObj.tablet
    if (imageObj.desktop) return imageObj.desktop

    return imageObj.mobile || imageObj.tablet || imageObj.desktop || ''
  }

  return ''
}

const resolveImage = (imagePath) => {
  const path = getImagePath(imagePath)
  if (!path) return ''
  if (typeof path === 'string' && path.startsWith('/')) return path
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${path}`
  }
  return `/pages/${props.carId}/${path}`
}
</script>

<style lang="scss" scoped>
.car-image-text-bottom-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  position: relative;

  &__image-wrap {
    width: 100%;
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  &__text {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 40px;
    max-width: 1320px;
    margin: 0 auto;
    width: 100%;
    text-align: center;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #fff;
    margin: 0;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: #fff;
    margin: 0;
    opacity: 0.9;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }

  &__feature {
    display: flex;
    align-items: center;
  }

  &__feature-text {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: #fff;
  }
}

@media screen and (max-width: 876px) {
  .car-image-text-bottom-block {
    width: calc(100% - 32px);
    margin: 0 16px;

    &__image-wrap {
      min-height: 40vh;
    }

    &__text {
      padding: 30px 16px;
      gap: 20px;
    }

    &__title {
      font-size: 32px;
    }

    &__subtitle {
      font-size: 16px;
    }

    &__feature-text {
      font-size: 16px;
    }
  }
}
</style>
