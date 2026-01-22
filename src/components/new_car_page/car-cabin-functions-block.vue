<template>
  <section class="car-cabin-functions-block" :style="{ background: blockData.background || 'rgb(245, 246, 247)' }">
    <div class="car-cabin-functions-block__inner">
      <div class="car-cabin-functions-block__grid">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="car-cabin-functions-block__item"
        >
          <div class="car-cabin-functions-block__media-wrap">
            <img
              v-if="!isVideo(item.image || item.video)"
              :src="resolveMedia(item.image || item.video)"
              :alt="getText(item.title)"
              class="car-cabin-functions-block__image"
              loading="lazy"
            />
            <video
              v-else
              :src="resolveMedia(item.video || item.image)"
              class="car-cabin-functions-block__video"
              muted
              loop
              playsinline
              autoplay
            />
          </div>
          <div class="car-cabin-functions-block__content">
            <h3 v-if="getText(item.title)" class="car-cabin-functions-block__title">
              {{ getText(item.title) }}
            </h3>
            <p v-if="getText(item.description)" class="car-cabin-functions-block__description">
              {{ getText(item.description) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
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

const resolveMedia = (mediaPath) => {
  if (!mediaPath) return ''
  if (mediaPath.startsWith('/')) return mediaPath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${mediaPath}`
  }
  return `/pages/${props.carId}/${mediaPath}`
}

const isVideo = (path) => {
  if (!path) return false
  return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')
}

const items = computed(() => {
  if (blockData.value.items && Array.isArray(blockData.value.items)) {
    return blockData.value.items
  }
  return []
})

// Preload all images (not videos)
const preloadAllImages = () => {
  if (!items.value || items.value.length === 0) return
  
  items.value.forEach(item => {
    if (!item) return
    
    const mediaPath = item.image || item.video
    if (!mediaPath || isVideo(mediaPath)) return
    
    const imgSrc = resolveMedia(mediaPath)
    if (!imgSrc) return
    
    const img = new Image()
    img.onerror = () => {
      console.warn(`Failed to preload cabin function image: ${imgSrc}`)
    }
    img.src = imgSrc
  })
}

// Watch items to preload when they change
watch(items, (newItems) => {
  if (newItems && newItems.length > 0) {
    preloadAllImages()
  }
}, { immediate: true })

onMounted(() => {
  preloadAllImages()
})
</script>

<style lang="scss" scoped>
.car-cabin-functions-block {
  width: 100%;
  margin: 0;
  padding: 60px 0;

  &__inner {
    width: calc(100% - 40px);
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__media-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
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
    padding: 12px 0px;
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
  .car-cabin-functions-block {
    padding: 44px 0;

    &__inner {
      width: calc(100% - 32px);
      padding: 0 16px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 24px;
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
</style>
