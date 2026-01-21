<template>
  <section class="car-two-images-block" :style="{ background: blockData.background || '#fff' }">
    <div class="car-two-images-block__inner">
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
import { computed } from 'vue'
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

const resolveImage = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}

const isVideo = (path) => {
  if (!path) return false
  return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')
}

const images = computed(() => {
  if (blockData.value.images && Array.isArray(blockData.value.images)) {
    return blockData.value.images
  }
  return []
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
