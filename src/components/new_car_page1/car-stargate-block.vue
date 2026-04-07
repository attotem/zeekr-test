<template>
  <section class="car-stargate-block">
    <video
      v-if="videoSrc"
      class="car-stargate-block__video"
      :src="videoSrc"
      autoplay
      muted
      loop
      playsinline
    ></video>
    <div
      v-else
      class="car-stargate-block__image"
      :style="{ backgroundImage: `url(${getImageSrc})` }"
    ></div>

    <div class="car-stargate-block__overlay"></div>

    <div class="car-stargate-block__content">
      <div class="car-stargate-block__specs">
        <div
          v-for="(spec, index) in specs"
          :key="index"
          class="car-stargate-block__spec"
        >
          <div class="car-stargate-block__spec-value">{{ getText(spec.value) }}</div>
          <div class="car-stargate-block__spec-label">{{ getText(spec.label) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'

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

const resolveImagePath = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}

const resolveVideoPath = (videoPath) => {
  if (!videoPath) return ''
  if (videoPath.startsWith('/')) return videoPath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${videoPath}`
  }
  return `/pages/${props.carId}/${videoPath}`
}

const videoSrc = computed(() => {
  if (blockData.value.video) {
    return resolveVideoPath(blockData.value.video)
  }
  return null
})

const getImageSrc = computed(() => {
  if (blockData.value.image?.desktop) {
    return resolveImagePath(blockData.value.image.desktop)
  }
  if (blockData.value.image?.tablet) {
    return resolveImagePath(blockData.value.image.tablet)
  }
  if (blockData.value.image?.mobile) {
    return resolveImagePath(blockData.value.image.mobile)
  }
  return resolveImagePath('stargate.webp')
})

const specs = computed(() => {
  if (blockData.value.specs && Array.isArray(blockData.value.specs)) {
    return blockData.value.specs
  }
  if (blockData.value.features && Array.isArray(blockData.value.features)) {
    return blockData.value.features
  }
  return []
})

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)
</script>

<style lang="scss" scoped>
.car-stargate-block {
  position: relative;
  width: var(--car-section-width);
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: var(--car-section-margin);

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  &__video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    object-fit: cover;
    object-position: center;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }

  &__content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 50px 40px;
    max-width: var(--car-inner-max-width);
    margin: 0 auto;
  }

  &__specs {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
    width: 100%;
  }

  &__spec {
    text-align: center;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -16px;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 32px;
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &__spec-value {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 6px;
  }

  &__spec-label {
    color: #fff;
    font-size: 13px;
    opacity: 0.8;
    font-style: normal;
    font-weight: 400;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-stargate-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    min-height: 50vh;

    &__content {
      padding: 32px 20px;
      min-height: 50vh;
    }

    &__specs {
      gap: 16px;
      flex-wrap: wrap;
    }

    &__spec {
      &:not(:last-child)::after {
        display: none;
      }
    }

    &__spec-value {
      font-size: 16px;
    }

    &__spec-label {
      font-size: 12px;
    }
  }
}
</style>
