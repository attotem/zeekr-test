<template>
  <section class="car-video-block">
    <div class="car-video-block__inner">
      <div class="car-video-block__video-wrap">
        <video
          class="car-video-block__video"
          :src="videoSrc"
          autoplay
          muted
          loop
          playsinline
        ></video>
        <div class="car-video-block__overlay"></div>
        <div class="car-video-block__text">
          <h2 class="car-video-block__title">{{ getText(blockData.title) }}</h2>
          <p v-if="getText(blockData.subtitle)" class="car-video-block__subtitle">
            {{ getText(blockData.subtitle) }}
          </p>
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

const videoSrc = computed(() => {
  if (!blockData.value.video) {
    const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
    return `${basePath}/${props.carId}/7x_video2.mp4`
  }
  const videoPath = blockData.value.video
  
  if (videoPath.startsWith('/')) {
    return videoPath
  }
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${videoPath}`
  }
  return `/pages/${props.carId}/${videoPath}`
})
</script>

<style lang="scss" scoped>
.car-video-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);

  &__inner {
    width: 100%;
    max-width: 1540px;
    margin: 0 auto;
  }

  &__video-wrap {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.38), transparent);
    pointer-events: none;
  }

  &__text {
    position: absolute;
    top: 12%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: #fff;
    padding: 0 24px;
  }

  &__title {
    font-family: var(--car-font-heading);
    font-size: 40px;
    line-height: 1.2;
    font-weight: 400;
    margin: 0 0 8px;
  }

  &__subtitle {
    font-family: var(--car-font-body);
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
    opacity: 0.9;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-video-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: 48px 0 56px;

    &__inner {
      max-width: 100%;
    }

 

    &__text {
      top: 10%;
      padding: var(--car-inner-padding-x-sm);
    }

    &__title {
      font-size: 26px;
      margin-bottom: 6px;
    }

    &__subtitle {
      font-size: 14px;
    }
  }
}
</style>

