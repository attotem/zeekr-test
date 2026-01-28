<template>
  <section class="car-video-not-fullscreen-with-text-top">
    <div class="car-video-not-fullscreen-with-text-top__inner">
      <h2 v-if="getText(blockData.title)" class="car-video-not-fullscreen-with-text-top__title">
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
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 60px 0;
  background: #fff;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
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

@media screen and (max-width: 876px) {
  .car-video-not-fullscreen-with-text-top {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__title {
      font-size: 32px;
      margin-bottom: 32px;
    }

    &__video-wrap {
      max-height: 60vh;
    }
  }
}
</style>
