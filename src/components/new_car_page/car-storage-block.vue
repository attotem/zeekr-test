<template>
  <section class="car-storage-block">
    <div class="car-storage-block__inner">
      <div class="car-storage-block__image-wrap">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="car-storage-block__image-layer"
          :class="{ 'car-storage-block__image-layer--active': currentIndex === index }"
          :style="{ backgroundImage: `url(${img})` }"
        ></div>
      </div>
      <div class="car-storage-block__switcher">
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
      <div class="car-storage-block__content">
        <p v-if="getText(currentItemDescription)" class="car-storage-block__description">
          {{ getText(currentItemDescription) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
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
const currentIndex = ref(0)

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

const images = computed(() => {
  const imageList = blockData.value.images || []
  if (imageList.length > 0) {
    const folder = blockData.value.folder || 'storage'
    return imageList.map(img => {
      if (img.startsWith('/')) return img
      const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
      return `${basePath}/${props.carId}/${folder}/${img}`
    })
  }
  return []
})

const resolveImage = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  const folder = blockData.value.folder || 'storage'
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${folder}/${imagePath}`
  }
  return `/pages/${props.carId}/${folder}/${imagePath}`
}

// Preload images
const preloadAllImages = () => {
  if (!images.value || images.value.length === 0) return
  
  images.value.forEach(imgSrc => {
    if (!imgSrc) return
    
    const img = new Image()
    img.onerror = () => {
      console.warn(`Failed to preload storage image: ${imgSrc}`)
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

const items = computed(() => {
  return blockData.value.items || []
})

function setIndex(nextIndex) {
  const max = Math.min(images.value.length, items.value.length) - 1
  const clamped = Math.max(0, Math.min(nextIndex, max))
  currentIndex.value = clamped
}

watch([images, items], ([imgs, its]) => {
  const max = Math.min(imgs.length, its.length) - 1
  if (max < 0) {
    currentIndex.value = 0
    return
  }
  if (currentIndex.value > max) currentIndex.value = 0
}, { immediate: true })

const currentItem = computed(() => {
  return items.value[currentIndex.value] || {}
})

const currentItemDescription = computed(() => {
  return currentItem.value.description || blockData.value.description
})
</script>

<style lang="scss" scoped>
.car-storage-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 64px 0 0 ;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    &:hover {
      background: transparent;
    }
  }

  &__switcher-preview {
    width: 120px;
    height: 80px;
    overflow: hidden;
    background: #f5f5f5;
    position: relative;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
  }

  &__switcher-preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__switcher-item--active &__switcher-preview {
    border-color: #111;
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
    margin: 0;
    text-align: center;
    margin: 0 auto;
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
    }

    &__switcher-item {
      padding: 16px 0;
    }

    &__switcher-preview {
      width: 100px;
      height: 66px;
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

    &__description {
      font-size: 16px;
    }
  }
}
</style>
