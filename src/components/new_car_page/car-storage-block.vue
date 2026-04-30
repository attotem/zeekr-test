<template>
  <section class="car-storage-block" :class="{ 'car-storage-block--mobile-stack': mobileStack }" :style="blockData.background ? { background: blockData.background } : {}">
    <div class="car-storage-block__inner">

      <!-- Desktop switcher view -->
      <div class="car-storage-block__desktop-view">
        <div class="car-storage-block__image-wrap">
          <template v-for="(item, index) in items" :key="index">
            <video
              v-if="getVideoSrc(item)"
              class="car-storage-block__video-layer"
              :class="{ 'car-storage-block__video-layer--active': currentIndex === index }"
              :src="getVideoSrc(item)"
              :poster="getPoster(item)"
              muted
              loop
              playsinline
              autoplay
            />
            <div
              v-else
              class="car-storage-block__image-layer"
              :class="{ 'car-storage-block__image-layer--active': currentIndex === index }"
              :style="{ backgroundImage: `url(${getImageSrc(item, index)})` }"
            ></div>
          </template>
        </div>
        <div class="car-storage-block__switcher" :style="blockData.background ? { background: blockData.background } : {}">
          <div class="car-storage-block__switcher-content">
            <button
              v-for="(item, index) in items"
              :key="index"
              type="button"
              class="car-storage-block__switcher-item"
              :class="{ 'car-storage-block__switcher-item--active': currentIndex === index }"
              @click="setIndex(index)"
            >
              <span class="car-storage-block__switcher-title">{{ getText(item.title) }}</span>
            </button>
          </div>
        </div>
        <div class="car-storage-block__content" :style="blockData.background ? { background: blockData.background } : {}">
          <p v-if="getText(currentItemDescription)" class="car-storage-block__description">
            {{ getText(currentItemDescription) }}
          </p>
        </div>
      </div>

      <!-- Mobile stacked view (only when mobileStack: true) -->
      <div v-if="mobileStack" class="car-storage-block__mobile-view">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="car-storage-block__mobile-item"
        >
          <div class="car-storage-block__mobile-media">
            <video
              v-if="getMobileVideoSrc(item)"
              class="car-storage-block__mobile-video"
              :src="getMobileVideoSrc(item)"
              :poster="getPoster(item)"
              muted
              loop
              playsinline
              autoplay
            />
            <img
              v-else
              :src="getMobileImageSrc(item, index)"
              :alt="getText(item.title)"
              class="car-storage-block__mobile-image"
              loading="lazy"
            />
          </div>
          <div class="car-storage-block__mobile-caption">
            <h3 v-if="getText(item.title)" class="car-storage-block__mobile-title">
              {{ getText(item.title) }}
            </h3>
            <p v-if="getText(item.description)" class="car-storage-block__mobile-desc">
              {{ getText(item.description) }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useLangStore } from '@/stores/lang'
import { resolveMediaPath } from '@/utils/resolveMedia'

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

const mobileStack = computed(() => blockData.value.mobileStack === true)

const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') return textObj
  if (typeof textObj === 'object' && textObj !== null) {
    const lang = langStore.activeLang
    if (lang && textObj[lang]) return textObj[lang]
    if (lang === 'uk' && textObj.ua) return textObj.ua
    if (lang === 'ua' && textObj.uk) return textObj.uk
    if (lang === 'ru' && textObj.ua) return textObj.ua
    if (lang === 'zh' && (textObj.zh || textObj.cn)) return textObj.zh || textObj.cn
    return textObj.uk || textObj.ua || textObj.en || textObj.ru || textObj.zh || textObj.cn || ''
  }
  return ''
}

const resolvePath = (path) => resolveMediaPath(path, { carId: props.carId })

const resolveSimplePath = (filename) => {
  if (!filename) return ''
  if (filename.startsWith('/')) return filename
  const base = import.meta.env.DEV ? '/src/assets/pages' : '/pages'
  return `${base}/${props.carId}/${filename}`
}

const isVideoFile = (path) => {
  if (!path || typeof path !== 'string') return false
  return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')
}

// Desktop: resolves video using desktop/tablet image by default
const getVideoSrc = (item) => {
  if (!item.video) return null
  const src = resolvePath(item.video)
  return isVideoFile(src) ? src : null
}

// Mobile: resolves mobile video specifically
const getMobileVideoSrc = (item) => {
  if (!item.video) return null
  const mobileVideo = item.video.mobile || item.video.desktop || (typeof item.video === 'string' ? item.video : null)
  if (!mobileVideo) return null
  return resolveSimplePath(mobileVideo)
}

const getImageSrc = (item, index = 0) => {
  if (item.image) return resolvePath(item.image)
  // Legacy: fall back to images[] array by index
  return images.value[index] || ''
}

const getMobileImageSrc = (item, index = 0) => {
  if (item.image) {
    const mobilePath = item.image.mobile || item.image.tablet || item.image.desktop || (typeof item.image === 'string' ? item.image : null)
    return resolveSimplePath(mobilePath)
  }
  // Legacy: fall back to images[] array by index
  return images.value[index] || ''
}

const getPoster = (item) => {
  if (!item.poster) return ''
  return resolveSimplePath(item.poster)
}

// Legacy image resolution (for backward compat with old format)
const images = computed(() => {
  const itemList = blockData.value.items || []
  if (itemList.length > 0 && (itemList[0]?.image || itemList[0]?.video)) {
    return itemList.map(item => item.video ? getVideoSrc(item) : getImageSrc(item))
  }
  const imageList = blockData.value.images || []
  if (imageList.length > 0) {
    const folder = blockData.value.folder || 'storage'
    return imageList.map(img => {
      if (typeof img === 'object') return resolvePath(img)
      if (img.startsWith('/')) return img
      const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
      return `${basePath}/${props.carId}/${folder}/${img}`
    })
  }
  return []
})

// Preload images
const preloadAllImages = () => {
  images.value.forEach(src => {
    if (!src || isVideoFile(src)) return
    const img = new Image()
    img.src = src
  })
}

watch(images, (newImages) => {
  if (newImages && newImages.length > 0) preloadAllImages()
}, { immediate: true })

onMounted(() => {
  preloadAllImages()
})

const items = computed(() => blockData.value.items || [])

function setIndex(nextIndex) {
  const max = items.value.length - 1
  currentIndex.value = Math.max(0, Math.min(nextIndex, max))
}

watch(items, (its) => {
  if (currentIndex.value > its.length - 1) currentIndex.value = 0
}, { immediate: true })

const currentItem = computed(() => items.value[currentIndex.value] || {})

const currentItemDescription = computed(() => {
  return currentItem.value.description || blockData.value.description
})
</script>

<style lang="scss" scoped>
.car-storage-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 64px 0 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__image-wrap {
    width: 100%;
    height: 55vh;
    min-height: 400px;
    overflow: hidden;
    position: relative;
    background: #f5f5f5;
  }

  &__image-layer {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
    transform: translateZ(0);
    backface-visibility: hidden;

    &--active {
      opacity: 1;
    }
  }

  &__video-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0;
    transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;

    &--active {
      opacity: 1;
    }
  }

  &__switcher {
    width: 100%;
    background: #fff;
    border-top: 1px solid rgba(17, 17, 17, 0.12);
  }

  &__switcher-content {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 56px;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

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

  &__description {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: rgba(17, 17, 17, 0.78);
    margin: 0 auto;
    text-align: center;
  }

  // Mobile stacked sections - hidden by default
  &__mobile-view {
    display: none;
  }
}

@media screen and (max-width: 876px) {
  .car-storage-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__image-wrap {
      height: 35vh;
      min-height: 250px;
    }

    &__switcher-content {
      padding: 0;
      gap: 28px;
      justify-content: flex-start;
      overflow-x: scroll;
    }

    &__switcher-item {
      padding: 16px 0;
    }

    &__switcher-title {
      font-size: 16px;
      padding-bottom: 10px;
    }

    &__content {
      padding: 34px 0 44px;
      gap: 22px;
    }

    &__description {
      font-size: 16px;
    }

    // mobileStack mode: hide switcher, show stacked items
    &--mobile-stack {
      .car-storage-block__desktop-view {
        display: none;
      }

      .car-storage-block__mobile-view {
        display: flex;
        flex-direction: column;
        gap: 40px;
        padding-bottom: 44px;
      }
    }
  }

  .car-storage-block__mobile-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .car-storage-block__mobile-media {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
  }

  .car-storage-block__mobile-video,
  .car-storage-block__mobile-image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  .car-storage-block__mobile-caption {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .car-storage-block__mobile-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 18px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    margin: 0;
  }

  .car-storage-block__mobile-desc {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(17, 17, 17, 0.7);
    margin: 0;
  }
}
</style>
