<template>
  <section class="car-video-not-fullscreen-with-text-top">
    <div class="car-video-not-fullscreen-with-text-top__inner">
      <h2 v-if="getText(blockData.title)" class="car-video-not-fullscreen-with-text-top__title car-section-title car-section-title--center">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-video-not-fullscreen-with-text-top__video-wrap">
        <video
          v-if="videoSrc"
          :src="videoSrc"
          class="car-video-not-fullscreen-with-text-top__video"
          autoplay
          muted
          loop
          playsinline
        ></video>
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
.car-video-not-fullscreen-with-text-top {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  padding: var(--car-section-padding-y);
  background: #fff;

  &__inner {
    width: var(--car-inner-width);
    max-width: var(--car-inner-max-width);
    margin: var(--car-inner-margin);
    padding: var(--car-inner-padding-x);
  }

  &__title {
        color: var(--car-title-color);
    text-align: center;
    margin: 0 0 48px 0;
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
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-video-not-fullscreen-with-text-top {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__inner {
      padding: var(--car-inner-padding-x-sm);
    }

    &__title {
      margin-bottom: 32px;
    }

    &__video-wrap {
      max-height: 60vh;
    }
  }
}
</style>
