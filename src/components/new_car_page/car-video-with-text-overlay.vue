<template>
  <section class="car-video-with-text-overlay" :style="{ background: blockData.background || '#fff' }">
    <div class="car-video-with-text-overlay__inner">
      <div class="car-video-with-text-overlay__video-wrap">
        <video
          v-if="videoSrc"
          :src="videoSrc"
          class="car-video-with-text-overlay__video"
          autoplay
          muted
          loop
          playsinline
        ></video>
        
        <div class="car-video-with-text-overlay__overlay"></div>
        
        <div class="car-video-with-text-overlay__text">
          <h2 v-if="getText(blockData.title)" class="car-video-with-text-overlay__title">
            {{ getText(blockData.title) }}
          </h2>
        </div>
      </div>

      <div class="car-video-with-text-overlay__text-mobile">
        <h2 v-if="getText(blockData.title)" class="car-video-with-text-overlay__title-mobile">
          {{ getText(blockData.title) }}
        </h2>
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
.car-video-with-text-overlay {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  padding: var(--car-section-padding-y);

  &__inner {
    width: var(--car-inner-width);
    max-width: var(--car-inner-max-width);
    margin: var(--car-inner-margin);
    padding: var(--car-inner-padding-x);
  }

  &__video-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #000;
    border-radius: 8px;
    aspect-ratio: 16 / 9;
    max-height: 80vh;
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.2) 100%);
    pointer-events: none;
    z-index: 1;
  }

  &__text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 60px 20px;
    z-index: 2;
    pointer-events: none;
  }

  &__title {
    font-family: var(--car-font-heading);
    font-size: var(--car-title-size-xl);
    line-height: 1.3;
    font-weight: 400;
    color: #fff;
    margin: 0;
    text-align: center;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }

  &__text-mobile {
    display: none;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-video-with-text-overlay {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: 0;

    &__inner {
      padding: 0;
    }

    &__video-wrap {
      max-height: 60vh;
    }

    &__text {
      display: none;
    }

    &__text-mobile {
      display: block;
      padding: 20px 16px 0;
      text-align: left;
    }

    &__title-mobile {
      font-family: var(--car-font-heading);
      font-size: 24px;
      line-height: 1.3;
      font-weight: 400;
      color: var(--car-text-primary);
      margin: 0;
      text-align: left;
    }
  }
}
</style>
