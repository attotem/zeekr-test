<template>
  <section class="car-video-with-text-overlay">
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
.car-video-with-text-overlay {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 0 60px 0;
  background: #fff;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
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
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #fff;
    margin: 0;
    text-align: center;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
}

@media screen and (max-width: 876px) {
  .car-video-with-text-overlay {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__video-wrap {
      max-height: 60vh;
    }

    &__text {
      padding: 40px 16px;
    }

    &__title {
      font-size: 32px;
    }
  }
}
</style>
