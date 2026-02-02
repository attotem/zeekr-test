<template>
  <section class="car-two-images-block" :style="{ background: blockData.background || '#fff' }">
    <div class="car-two-images-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-two-images-block__title">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-two-images-block__grid">
        <div
          v-for="(item, index) in images"
          :key="index"
          class="car-two-images-block__item"
        >
          <div class="car-two-images-block__image-wrap">
            <img
              v-if="!isVideo(item.image)"
              :src="resolveImage(item.image)"
              :alt="getText(item.title) || getText(item.caption)"
              class="car-two-images-block__image"
              loading="lazy"
            />
            <video
              v-else
              :src="resolveImage(item.image)"
              class="car-two-images-block__video"
              muted
              loop
              playsinline
              autoplay
            />
          </div>
          <div class="car-two-images-block__caption">
            <div v-if="getText(item.title)" class="car-two-images-block__caption-title">
              {{ getText(item.title) }}
            </div>
            <div v-if="getText(item.description)" class="car-two-images-block__caption-text">
              {{ getText(item.description) }}
            </div>
            <div v-else-if="getText(item.caption)" class="car-two-images-block__caption-text">
              {{ getText(item.caption) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
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

// Track window width for responsive image selection
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

// Normalize image value (string or { desktop, tablet, mobile }) to a path string.
// Fallback: если нет mobile — показываем tablet, если нет tablet — desktop.
const getImagePath = (imageObj) => {
  if (!imageObj) return ''
  if (typeof imageObj === 'string') return imageObj
  if (typeof imageObj === 'object' && imageObj !== null) {
    const isMobile = windowWidth.value <= 876
    const isTablet = windowWidth.value > 876 && windowWidth.value <= 1200

    if (isMobile) return imageObj.mobile || imageObj.tablet || imageObj.desktop || ''
    if (isTablet) return imageObj.tablet || imageObj.desktop || ''
    return imageObj.desktop || ''
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

const isVideo = (path) => {
  if (!path) return false
  const imagePath = getImagePath(path)
  if (!imagePath || typeof imagePath !== 'string') return false
  return imagePath.endsWith('.mp4') || imagePath.endsWith('.webm') || imagePath.endsWith('.mov')
}

const images = computed(() => {
  if (blockData.value.images && Array.isArray(blockData.value.images)) {
    return blockData.value.images
  }
  return []
})

// Preload all images (not videos)
const preloadAllImages = () => {
  if (!images.value || images.value.length === 0) return
  
  images.value.forEach(item => {
    if (!item) return
    
    // item can be a string, an object with image property, or directly an image object
    const imagePath = typeof item === 'string' ? item : (item.image || item)
    if (!imagePath || isVideo(imagePath)) return
    
    const imgSrc = resolveImage(imagePath)
    if (!imgSrc) return
    
    const img = new Image()
    img.onerror = () => {
      console.warn(`Failed to preload two-images image: ${imgSrc}`)
    }
    img.src = imgSrc
  })
}

// Watch images to preload when they change
watch(images, (newImages) => {
  if (newImages && newImages.length > 0) {
    preloadAllImages()
  }
}, { immediate: true })

onMounted(() => {
  preloadAllImages()
})
</script>

<style lang="scss" scoped>
.car-two-images-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 60px 0;
  animation: fadeUp 0.6s ease 0.05s both;

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
    margin: 0 0 60px 0;
    text-align: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  &__item {
    display: flex;
    flex-direction: column;
  }

  &__image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  &__caption {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    margin-top: 20px;
    text-align: left;
  }

  &__caption-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 18px;
    line-height: 1.4;
    color: #111;
    margin: 0 0 8px 0;
    font-weight: 400;
  }

  &__caption-text {
    font-size: 14px;
    line-height: 1.6;
    color: rgba(17, 17, 17, 0.7);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 876px) {
  .car-two-images-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__title {
      font-size: 32px;
      margin-bottom: 44px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    &__image-wrap {
      min-height: 300px;
    }

    &__caption {
      margin-top: 16px;
    }

    &__caption-title {
      font-size: 16px;
      margin-bottom: 6px;
    }

    &__caption-text {
      font-size: 13px;
    }
  }
}
</style>
