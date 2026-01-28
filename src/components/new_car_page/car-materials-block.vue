<template>
  <section class="car-materials-block" :style="{ background: blockData.background || '#fff' }">
    <div class="car-materials-block__inner">
      <div class="car-materials-block__grid">
        <div
          v-for="(material, index) in materials"
          :key="index"
          class="car-materials-block__material"
        >
          <div class="car-materials-block__image-wrap">
            <img
              v-if="!isVideo(material.image || material.video)"
              :src="resolveImage(material.image || material.video)"
              :alt="getText(material.title)"
              class="car-materials-block__image"
              loading="lazy"
            />
            <video
              v-else
              :src="resolveImage(material.video || material.image)"
              class="car-materials-block__video"
              muted
              loop
              playsinline
              autoplay
            />
          </div>
          <div class="car-materials-block__content">
            <h3 v-if="getText(material.title)" class="car-materials-block__title">
              {{ getText(material.title) }}
            </h3>
            <p v-if="getText(material.description)" class="car-materials-block__description">
              {{ getText(material.description) }}
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

// Normalize image value (string or { desktop, tablet, mobile }) to a path
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

const materials = computed(() => {
  if (blockData.value.materials && Array.isArray(blockData.value.materials)) {
    return blockData.value.materials
  }
  return []
})

const isVideo = (path) => {
  if (!path) return false
  const imagePath = getImagePath(path)
  if (!imagePath || typeof imagePath !== 'string') return false
  return imagePath.endsWith('.mp4') || imagePath.endsWith('.webm') || imagePath.endsWith('.mov')
}
</script>

<style lang="scss" scoped>
.car-materials-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  background: #fff;
  padding: 60px 0;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  &__material {
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;

    &:nth-child(1),
    &:nth-child(2) {
      grid-column: span 1;
    }

    &:nth-child(3) {
      grid-column: 1;
      grid-row: 2;
    }

    &:nth-child(4),
    &:nth-child(5) {
      grid-column: 2;
    }

    &:nth-child(4) {
      grid-row: 2;
    }

    &:nth-child(5) {
      grid-row: 3;
    }
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

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__content {
    padding: 24px 20px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 20px;
    line-height: 1.4;
    font-weight: 400;
    color: #111;
    margin: 0 0 12px 0;
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
  .car-materials-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 0px;
    }

    &__content {
      padding: 20px 16px;
    }

    &__title {
      font-size: 18px;
      margin-bottom: 10px;
    }

    &__description {
      font-size: 13px;
    }
  }
}

@media screen and (min-width: 877px) and (max-width: 1200px) {
  .car-materials-block {
    &__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media screen and (min-width: 1201px) {
  .car-materials-block {
    &__grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
