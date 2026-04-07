<template>
  <section class="car-two-images-block" :style="{ background: blockData.background || '#fff' }">
    <div class="car-two-images-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-two-images-block__title car-section-title car-section-title--center">
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
import { computed, onMounted, ref, watch } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'
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

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

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


const preloadAllImages = () => {
  if (!images.value || images.value.length === 0) return
  
  images.value.forEach(item => {
    if (!item) return
    
    
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
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  padding: var(--car-section-padding-y);
  animation: fadeUp 0.6s ease 0.05s both;

  &__inner {
    width: var(--car-inner-width);
    max-width: var(--car-inner-max-width);
    margin: var(--car-inner-margin);
    padding: var(--car-inner-padding-x);
  }

  &__title {
        color: var(--car-title-color);
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
    width: var(--car-card-width);
    position: relative;
    overflow: var(--car-card-overflow);
    background: var(--car-card-media-bg);
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
    font-family: var(--car-font-body);
    margin-top: 20px;
    text-align: left;
  }

  &__caption-title {
        font-size: 18px;
    line-height: 1.4;
    color: var(--car-text-primary);
    margin: 0 0 8px 0;
    font-weight: 400;
  }

  &__caption-text {
    font-size: 14px;
    line-height: 1.6;
    color: var(--car-text-muted-07);
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

@media screen and (max-width: var(--car-bp-sm)) {
  .car-two-images-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__inner {
      padding: var(--car-inner-padding-x-sm);
    }

    &__title {
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
