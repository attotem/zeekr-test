<template>
  <section class="car-design-block">
    <h2 v-if="getText(blockData.topTitle)" class="car-design-block__top-title">{{ getText(blockData.topTitle) }}</h2>
    <div ref="imageWrapEl" class="car-design-block__image-wrap">
      <div
        v-for="(media, index) in mediaItems"
        :key="index"
        class="car-design-block__image-layer"
        :class="{ 'car-design-block__image-layer--active': currentIndex === index }"
      >
        <img
          v-if="media.type === 'image'"
          :src="media.src"
          :alt="getText(items[index]?.title)"
          class="car-design-block__image"
        />
        <video
          v-else-if="media.type === 'video'"
          :src="media.src"
          class="car-design-block__video"
          muted
          loop
          playsinline
          :autoplay="currentIndex === index"
          @loadeddata="handleVideoLoaded"
        />
      </div>
    </div>
    <div class="car-design-block__switcher">
      <div class="car-design-block__switcher-content">
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          class="car-design-block__switcher-item"
          :class="{ 'car-design-block__switcher-item--active': currentIndex === index }"
          @click="setIndex(index)"
        >
          <span class="car-design-block__switcher-title">{{ getText(item.title) }}</span>
        </button>
      </div>
    </div>
    <div class="car-design-block__content">
      <h2 v-if="getText(blockData.title)" class="car-design-block__title">{{ getText(blockData.title) }}</h2>
      <!-- <div v-if="currentItemFeatures.length > 0" class="car-design-block__features">
        <div
          v-for="(feature, index) in currentItemFeatures"
          :key="index"
          class="car-design-block__feature"
        >
          <div class="car-design-block__feature-label">{{ getText(feature.label) }}</div>
          <div class="car-design-block__feature-value">{{ getText(feature.value) }}</div>
        </div>
      </div> -->
      <p v-if="getText(currentItemDescription)" class="car-design-block__description">
        {{ getText(currentItemDescription) }}
      </p>
      <p v-if="getText(blockData.details)" class="car-design-block__details">
        {{ getText(blockData.details) }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useLangStore } from '@/stores/lang'
import { resolveMediaPath, pickResponsivePath } from '@/utils/resolveMedia'

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
const currentIndex = ref(0)
const imageWrapEl = ref(null)

const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') return textObj
  if (typeof textObj === 'object' && textObj !== null) {
    const lang = langStore.activeLang
    // app uses "uk" / "en"; keep compatibility with ua/ru/zh fields in JSON content
    if (lang && textObj[lang]) return textObj[lang]
    if (lang === 'uk' && textObj.ua) return textObj.ua
    if (lang === 'ua' && textObj.uk) return textObj.uk
    if (lang === 'ru' && textObj.ua) return textObj.ua
    if (lang === 'zh' && (textObj.zh || textObj.cn)) return textObj.zh || textObj.cn
    return textObj.uk || textObj.ua || textObj.en || textObj.ru || textObj.zh || textObj.cn || ''
  }
  return ''
}

const resolveMedia = (media) => resolveMediaPath(media, { carId: props.carId })

const mediaItems = computed(() => {
  const mediaList = blockData.value.media || blockData.value.images || []
  if (mediaList.length > 0) {
    return mediaList.map(media => {
      const path = pickResponsivePath(
        typeof media === 'string' || Array.isArray(media) ? media : (media.src || media)
      )
      const isVideo =
        path &&
        typeof path === 'string' &&
        (path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov'))
      return {
        type: isVideo ? 'video' : 'image',
        src: resolveMedia(
          typeof media === 'string' || Array.isArray(media) ? media : (media.src || media)
        )
      }
    })
  }
  // Fallback to single image
  const imagePath = blockData.value.image
  if (imagePath) {
    const path = pickResponsivePath(imagePath)
    const isVideo =
      path &&
      typeof path === 'string' &&
      (path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov'))
    return [{
      type: isVideo ? 'video' : 'image',
      src: resolveMedia(imagePath)
    }]
  }
  return []
})

// Find all layer <div> children inside the ref container
const getLayerVideos = () => {
  if (!imageWrapEl.value) return []
  const layers = imageWrapEl.value.children
  return Array.from(layers).map(layer => layer.querySelector('video'))
}

const playVideoAtIndex = (index) => {
  const videos = getLayerVideos()
  videos.forEach((video, idx) => {
    if (!video) return
    if (idx === index) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  })
}

const handleVideoLoaded = (event) => {
  const video = event.target
  // Find which index this video belongs to
  const videos = getLayerVideos()
  const videoIndex = videos.indexOf(video)
  if (currentIndex.value === videoIndex) {
    video.play().catch(() => {})
  } else {
    video.pause()
  }
}

watch(currentIndex, async (newIndex) => {
  await nextTick()
  playVideoAtIndex(newIndex)
})

// Preload images & autoplay first video
onMounted(async () => {
  mediaItems.value.forEach(media => {
    if (media.type === 'image') {
      const img = new Image()
      img.src = media.src
    }
  })
  // Ensure the first video starts playing
  await nextTick()
  playVideoAtIndex(0)
})

const items = computed(() => {
  return blockData.value.items || []
})

function setIndex(nextIndex) {
  const max = Math.min(mediaItems.value.length, items.value.length) - 1
  const clamped = Math.max(0, Math.min(nextIndex, max))
  currentIndex.value = clamped
}

watch([mediaItems, items], ([medias, its]) => {
  const max = Math.min(medias.length, its.length) - 1
  if (max < 0) {
    currentIndex.value = 0
    return
  }
  if (currentIndex.value > max) currentIndex.value = 0
}, { immediate: true })

const currentItem = computed(() => {
  return items.value[currentIndex.value] || {}
})

const currentItemFeatures = computed(() => {
  return currentItem.value.features || blockData.value.features || []
})

const currentItemDescription = computed(() => {
  return currentItem.value.description || blockData.value.description
})
</script>

<style lang="scss" scoped>
.car-design-block {
  // Keep the same side gutters as other blocks (360/inside/navigation)
  width: calc(100% - 40px);
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;

  &__top-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    margin: 0;
    padding: 60px 20px 40px;
    font-weight: 400;
    color: #111;
    text-align: center;
  }

  &__image-wrap {
    width: 100%;
    height: 90vh;
    min-height: 500px;
    overflow: hidden;
    position: relative;
    background: #f5f5f5;
  }

  &__image-layer {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
    transform: translateZ(0);
    backface-visibility: hidden;

    &--active {
      opacity: 1;
    }
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

  &__switcher {
    width: 100%;
    background: #fff;
    border-top: 1px solid rgba(17, 17, 17, 0.12);
  }

  &__switcher-content {
    width: 100%;
    // The parent already has side gutters; keep it flush
    max-width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 56px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__switcher-item {
    flex: 0 0 auto;
    padding: 20px 0;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: transparent;
    }

    
  }

  &__switcher-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 18px;
    line-height: 1.3;
    color: #111;
    font-weight: 400;
    letter-spacing: 0.01em;
    display: inline-block;
    position: relative;
    padding-bottom: 12px;
  }

  &__switcher-title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #111;
    opacity: 0;
    transform: scaleX(0.85);
    transform-origin: center;
    transition: opacity 200ms ease, transform 200ms ease;
  }

  &__switcher-item--active &__switcher-title::after {
    opacity: 1;
    transform: scaleX(1);
  }
  

  &__content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 0 60px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    margin: 0;
    font-weight: 400;
    color: #111;
    text-align: center;
  }

  &__features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin: 0;
  }

  &__feature {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px;
    background: rgba(17, 17, 17, 0.02);
    border: 1px solid rgba(17, 17, 17, 0.06);
  }

  &__feature-label {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: #666;
    font-weight: 400;
  }

  &__feature-value {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 20px;
    line-height: 1.3;
    color: #111;
    font-weight: 400;
  }

  &__description {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: rgba(17, 17, 17, 0.78);
    margin: 0;
    text-align: center;
    margin: 0 auto;
  }

  &__details {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.7;
    color: rgba(17, 17, 17, 0.58);
    margin: 0;
    text-align: center;
    max-width: 1000px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 876px) {
  .car-design-block {
    width: calc(100% - 32px);
    margin: 0 16px;

    &__top-title {
      font-size: 32px;
      padding: 44px 16px 32px;
    }

    &__image-wrap {
      height: 40vh;
      min-height: 300px;
    }

    &__switcher-content {
      padding: 0;
    }

    &__switcher-item {
      padding: 16px 0;
    }

    &__switcher-content {
      gap: 28px;
      justify-content: flex-start;
    }

    &__switcher-title {
      font-size: 16px;
      padding-bottom: 10px;
    }

    &__content {
      padding: 34px 0 44px;
      gap: 22px;
    }

    &__title {
      font-size: 32px;
    }

    &__features {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    &__feature {
      padding: 16px;
    }

    &__feature-value {
      font-size: 18px;
    }

    &__description {
      font-size: 16px;
    }

    &__details {
      font-size: 14px;
    }
  }
}
</style>
