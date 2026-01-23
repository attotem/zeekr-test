<template>
  <section class="car-image-text-overlay-block">
    <div class="car-image-text-overlay-block__image-wrap">
      <img
        v-if="!isVideo(blockData.image || blockData.video)"
        :src="resolveImage(blockData.image || blockData.video)"
        :alt="getText(blockData.title)"
        class="car-image-text-overlay-block__image"
        loading="lazy"
      />
      <video
        v-else
        :src="resolveImage(blockData.video || blockData.image)"
        class="car-image-text-overlay-block__video"
        muted
        loop
        playsinline
        autoplay
      />
      <div class="car-image-text-overlay-block__text">
        <h2 v-if="getText(blockData.title)" class="car-image-text-overlay-block__title">
          {{ getText(blockData.title) }}
        </h2>
        <div v-if="blockData.subtitles && blockData.subtitles.length" class="car-image-text-overlay-block__subtitles">
          <p
            v-for="(subtitle, index) in blockData.subtitles"
            :key="index"
            class="car-image-text-overlay-block__subtitle"
          >
            {{ getText(subtitle) }}
          </p>
        </div>
      </div>
    </div>
    <!-- Псевдоблок для мобільних - текст під фото -->
    <div class="car-image-text-overlay-block__text-mobile">
      <h2 v-if="getText(blockData.title)" class="car-image-text-overlay-block__title-mobile">
        {{ getText(blockData.title) }}
      </h2>
      <div v-if="blockData.subtitles && blockData.subtitles.length" class="car-image-text-overlay-block__subtitles-mobile">
        <p
          v-for="(subtitle, index) in blockData.subtitles"
          :key="index"
          class="car-image-text-overlay-block__subtitle-mobile"
        >
          {{ getText(subtitle) }}
        </p>
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

const resolveImage = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}

const isVideo = (path) => {
  if (!path) return false
  return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')
}
</script>

<style lang="scss" scoped>
.car-image-text-overlay-block {
  width: 100%;
  margin: 0;
  position: relative;
  animation: fadeUp 0.6s ease 0.05s both;

  &__image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    min-height: 90vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.4) 100%);
    z-index: 1;
  }

  &__text {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 60px 20px 40px;
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #000;
    margin: 0 0 24px 0;
  }

  &__subtitles {
    display: flex;
    flex-direction: row;
    gap: 0;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #000;
    margin: 0;
    padding: 0 16px;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 16px;
      background: rgba(0, 0, 0, 0.3);
    }
  }

  &__text-mobile {
    display: none;
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

@media screen and (max-width: 876px) {
  .car-image-text-overlay-block {
    width: 100%;
    margin: 0;
    padding: 0;

    &__image-wrap {
      min-height: auto;
      margin-bottom: 0;
    }

    &__text {
      display: none;
    }

    &__text-mobile {
      display: block;
      text-align: left;
      padding: 20px 16px;
      background: #fff;
    }

    &__title-mobile {
      font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
      font-size: 20px;
      line-height: 1.3;
      font-weight: 400;
      color: #111;
      margin: 0 0 12px 0;
      text-align: left;
    }

    &__subtitles-mobile {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
      justify-content: flex-start;
    }

    &__subtitle-mobile {
      font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #666;
      margin: 0;
      padding: 0;
      position: relative;

      &:not(:last-child)::after {
        display: none;
      }
    }
  }
}
</style>
