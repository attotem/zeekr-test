<template>
  <section class="car-screens-block">
    <div class="car-screens-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-screens-block__title">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-screens-block__grid">
        <div
          v-for="(screen, index) in screens"
          :key="index"
          class="car-screens-block__screen"
        >
          <div class="car-screens-block__image-wrap">
            <img
              :src="resolveImage(screen.image)"
              :alt="getText(screen.title)"
              class="car-screens-block__image"
              loading="lazy"
            />
          </div>
          <div class="car-screens-block__content">
            <h3 v-if="getText(screen.title)" class="car-screens-block__screen-title">
              {{ getText(screen.title) }}
            </h3>
            <p v-if="getText(screen.description)" class="car-screens-block__description">
              {{ getText(screen.description) }}
            </p>
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

// Track viewport width for responsive images
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

// Normalize image (string or { desktop, tablet, mobile }) to file name
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

const screens = computed(() => {
  if (blockData.value.screens && Array.isArray(blockData.value.screens)) {
    return blockData.value.screens
  }
  return []
})
</script>

<style lang="scss" scoped>
.car-screens-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  background: rgb(245, 246, 247);
  padding: 60px 0;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    text-align: center;
    margin: 0 0 48px 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  &__screen {
    display: flex;
    flex-direction: column;
    background: transparent;
    overflow: hidden;
  }

  &__image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
    aspect-ratio: 4 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__content {
    padding: 14px 0px;
  }

  &__screen-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 20px;
    line-height: 1.4;
    font-weight: 400;
    color: #111;
    margin: 0 0 6px 0;
  }

  &__description {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #666;
    margin: 0;
  }
}

@media screen and (max-width: 876px) {
  .car-screens-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__title {
      font-size: 32px;
      margin-bottom: 32px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    &__content {
      padding: 20px 16px;
    }

    &__screen-title {
      font-size: 18px;
      margin-bottom: 10px;
    }

    &__description {
      font-size: 13px;
    }
  }
}
</style>
