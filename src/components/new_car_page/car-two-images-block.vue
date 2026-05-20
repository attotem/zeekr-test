<template>
  <section class="car-two-images-block" :class="{ 'car-two-images-block--compact': blockData.compact }" :style="{ background: blockData.background || '#fff' }">
    <div class="car-two-images-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-two-images-block__title">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-two-images-block__grid" :class="`car-two-images-block__grid--cols-${blockData.cols || images.length}`">
        <div
          v-for="(item, index) in images"
          :key="index"
          class="car-two-images-block__item"
        >
          <div class="car-two-images-block__image-wrap">
            <!-- Poster + click-to-play video -->
            <template v-if="item.poster">
              <video
                v-if="playingIndex === index"
                :src="resolveImage(item.image)"
                class="car-two-images-block__video"
                autoplay
                controls
                playsinline
              />
              <template v-else>
                <img
                  :src="resolveImage(item.poster)"
                  :alt="getText(item.title)"
                  class="car-two-images-block__image"
                  loading="lazy"
                />
                <button class="car-two-images-block__play-btn" @click="playingIndex = index" aria-label="Play video">
                  <img :src="resolveImage(item.playIcon || 'play.png')" alt="Play" />
                </button>
              </template>
            </template>
            <!-- Regular image -->
            <img
              v-else-if="!isVideo(item.image)"
              :src="resolveImage(item.image)"
              :alt="getText(item.title) || getText(item.caption)"
              class="car-two-images-block__image"
              :style="blockData.objectFit ? { objectFit: blockData.objectFit } : {}"
              loading="lazy"
            />
            <!-- Autoplay video -->
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
      <p v-if="getText(blockData.subtitle)" class="car-two-images-block__subtitle">
        {{ getText(blockData.subtitle) }}
      </p>
      <p v-if="getText(blockData.note)" class="car-two-images-block__note">
        {{ getText(blockData.note) }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
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
const playingIndex = ref(null)

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

const resolveImage = (media) => resolveMediaPath(media, { carId: props.carId })

const isVideo = (media) => {
  const fileName = pickResponsivePath(media)
  if (!fileName || typeof fileName !== 'string') return false
  return fileName.endsWith('.mp4') || fileName.endsWith('.webm') || fileName.endsWith('.mov')
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
    margin: 0 auto;
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

    &--cols-1 { grid-template-columns: 1fr; }
    &--cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    &--cols-4 { grid-template-columns: repeat(4, 1fr); }
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
    min-height: v-bind("blockData.imageHeight ? blockData.imageHeight + 'px' : '400px'");
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__play-btn {
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 56px;
    height: 56px;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    &:hover {
      transform: scale(1.1);
      opacity: 0.9;
    }
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

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    color: rgba(17, 17, 17, 0.55);
    text-align: center;
    margin: 32px 0 0;
  }

  &__note {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 11px;
    color: rgba(17, 17, 17, 0.4);
    text-align: center;
    margin: 16px 0 0;
  }
}

.car-two-images-block--compact {
  padding: 20px 0 60px;
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
