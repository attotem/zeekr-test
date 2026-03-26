<template>
  <section class="car-image-with-text-below" :style="{ background: blockData.background || '#fff' }">
    <div class="car-image-with-text-below__inner">
      <div class="car-image-with-text-below__image-wrap">
        <img
          v-if="imageSrc && !isVideo"
          :src="imageSrc"
          :alt="getText(blockData.title)"
          class="car-image-with-text-below__image"
          loading="lazy"
          @error="onImageError"
        />
        <video
          v-else-if="videoSrc"
          :src="videoSrc"
          class="car-image-with-text-below__video"
          autoplay
          muted
          loop
          playsinline
        ></video>
      </div>
      
      <div class="car-image-with-text-below__content">
        <h2 v-if="getText(blockData.title)" class="car-image-with-text-below__title">
          {{ getText(blockData.title) }}
        </h2>
        <p v-if="getText(blockData.subtitle)" class="car-image-with-text-below__subtitle">
          {{ getText(blockData.subtitle) }}
        </p>
        <div v-if="blockData.features && blockData.features.length" class="car-image-with-text-below__features">
          <div
            v-for="(feature, index) in blockData.features"
            :key="index"
            class="car-image-with-text-below__feature"
          >
            <div v-if="feature.value" class="car-image-with-text-below__feature-value">{{ getText(feature.value) }}</div>
            <div v-if="getText(feature.label)" class="car-image-with-text-below__feature-label">{{ getText(feature.label) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
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

const isVideo = computed(() => {
  const mediaObj = blockData.value.video || blockData.value.image
  const mediaPath = pickResponsivePath(mediaObj)
  return (
    mediaPath &&
    typeof mediaPath === 'string' &&
    (mediaPath.endsWith('.mp4') || mediaPath.endsWith('.webm') || mediaPath.endsWith('.mov'))
  )
})

const resolveImage = (imagePath) => {
  return resolveMediaPath(imagePath, { carId: props.carId })
}

const imageSrc = computed(() => {
  if (blockData.value.video && !isVideo.value) {
    return resolveImage(blockData.value.video)
  }
  return resolveImage(blockData.value.image)
})

const videoSrc = computed(() => {
  if (blockData.value.video && isVideo.value) {
    return resolveImage(blockData.value.video)
  }
  if (blockData.value.image && isVideo.value) {
    return resolveImage(blockData.value.image)
  }
  return ''
})

const onImageError = (event) => {
  console.error('❌ Image failed to load:', event.target.src)
  console.error('Block data:', blockData.value)
  console.error('Car ID:', props.carId)
}

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)
</script>

<style lang="scss" scoped>
.car-image-with-text-below {
  width: 100%;
  margin: 0;
  position: relative;
  min-height: 100vh;

  &__inner {
    width: 100%;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &__image-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  &__video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 60px 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);
    z-index: 2;
    text-align: center;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #fff;
    margin: 0 0 16px 0;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 32px 0;
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    margin-top: 40px;
    max-width: 1320px;
    margin-left: auto;
    margin-right: auto;
  }

  &__feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 150px;
  }

  &__feature-value {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 36px;
    line-height: 1.2;
    font-weight: 400;
    color: #fff;
    text-align: center;
    margin-bottom: 8px;
  }

  &__feature-label {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
  }
}

@media screen and (max-width: 876px) {
  .car-image-with-text-below {
    &__inner {
      min-height: 100vh;
    }

    &__content {
      padding: 40px 16px;
    }

    &__title {
      font-size: 32px;
      margin-bottom: 12px;
    }

    &__subtitle {
      font-size: 16px;
      margin-bottom: 24px;
    }

    &__features {
      gap: 24px;
      margin-top: 32px;
    }

    &__feature {
      min-width: 120px;
    }

    &__feature-value {
      font-size: 28px;
      margin-bottom: 6px;
    }

    &__feature-label {
      font-size: 12px;
    }
  }
}
</style>
