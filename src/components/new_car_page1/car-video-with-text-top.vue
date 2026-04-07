<template>
  <section class="car-video-with-text-top">
    <div class="car-video-with-text-top__inner">
      <div class="car-video-with-text-top__video-wrap">
        <video
          v-if="videoSrc"
          :src="videoSrc"
          class="car-video-with-text-top__video"
          autoplay
          muted
          loop
          playsinline
        ></video>
        
        <div class="car-video-with-text-top__overlay-top"></div>
        <div class="car-video-with-text-top__overlay-bottom"></div>
        
        <div class="car-video-with-text-top__title-wrap">
          <h2 v-if="getText(blockData.title)" class="car-video-with-text-top__title">
            {{ getText(blockData.title) }}
          </h2>
        </div>

        <div class="car-video-with-text-top__content">
          <div v-if="blockData.features && blockData.features.length" class="car-video-with-text-top__features">
            <div
              v-for="(feature, index) in blockData.features"
              :key="index"
              class="car-video-with-text-top__feature"
            >
              <div v-if="feature.value" class="car-video-with-text-top__feature-value">{{ getText(feature.value) }}</div>
              <div v-if="getText(feature.label)" class="car-video-with-text-top__feature-label">{{ getText(feature.label) }}</div>
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

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

const resolveVideo = (videoPath) => {
  if (!videoPath) return ''
  if (videoPath.startsWith('/')) return videoPath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${videoPath}`
  }
  return `/pages/${props.carId}/${videoPath}`
}

const videoSrc = computed(() => {
  return resolveVideo(blockData.value.video)
})
</script>

<style lang="scss" scoped>
.car-video-with-text-top {
  width: 100%;
  margin: 0;
  position: relative;

  &__inner {
    width: 100%;
    position: relative;
  }

  &__video-wrap {
    width: 100%;
    height: 100vh;
    min-height: 600px;
    overflow: hidden;
    position: relative;
  }

  &__video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  &__overlay-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
    pointer-events: none;
    z-index: 1;
  }

  &__overlay-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
    pointer-events: none;
    z-index: 1;
  }

  &__title-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 60px 20px 40px;
    text-align: center;
    z-index: 2;
  }

  &__title {
    font-family: var(--car-font-heading);
    font-size: var(--car-title-size-xl);
    line-height: 1.3;
    font-weight: 400;
    color: #fff;
    margin: 0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 40px 20px 60px;
    text-align: center;
    z-index: 2;
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    max-width: var(--car-inner-max-width);
    margin: 0 auto;
  }

  &__feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 150px;
  }

  &__feature-value {
    font-family: var(--car-font-heading);
    font-size: 36px;
    line-height: 1.2;
    font-weight: 400;
    color: #fff;
    text-align: center;
    margin-bottom: 8px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  &__feature-label {
    font-family: var(--car-font-body);
    font-size: 14px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.95);
    text-align: center;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  &__video-wrap {
    width: 100%;
    height: 100vh;
    min-height: 600px;
    overflow: hidden;
    position: relative;
  }

  &__video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-video-with-text-top {
    &__title-wrap {
      padding: 40px 16px 32px;
    }

    &__title {
      font-size: 32px;
    }

    &__content {
      padding: 32px 16px 40px;
    }

    &__features {
      gap: 24px;
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

    &__video-wrap {
      min-height: 400px;
    }
  }
}
</style>
