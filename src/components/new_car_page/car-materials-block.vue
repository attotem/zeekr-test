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
import { computed } from 'vue'
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

const materials = computed(() => {
  if (blockData.value.materials && Array.isArray(blockData.value.materials)) {
    return blockData.value.materials
  }
  return []
})

const isVideo = (media) => {
  const fileName = pickResponsivePath(media)
  if (!fileName || typeof fileName !== 'string') return false
  return fileName.endsWith('.mp4') || fileName.endsWith('.webm') || fileName.endsWith('.mov')
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
