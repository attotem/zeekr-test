<template>
  <section class="car-video-text-block">
    <div class="car-video-text-block__inner">
      <div class="car-video-text-block__grid">
        <!-- Top Left: Video 1 or Image 1 -->
        <div class="car-video-text-block__video-wrap car-video-text-block__video-wrap--top-left">
          <video
            v-if="blockData.video1 && !blockData.image1"
            :src="resolveVideo(blockData.video1)"
            class="car-video-text-block__video"
            autoplay
            muted
            loop
            playsinline
          ></video>
          <img
            v-else-if="blockData.image1"
            :src="resolveImage(blockData.image1)"
            class="car-video-text-block__image"
            alt=""
            loading="lazy"
          />
        </div>

        <!-- Top Right: Text Block 1 -->
        <div class="car-video-text-block__text-block car-video-text-block__text-block--top-right">
          <div class="car-video-text-block__text-title">{{ getText(blockData.text1?.title) }}</div>
          <div v-if="blockData.text1?.items" class="car-video-text-block__text-items">
            <div
              v-for="(item, index) in blockData.text1.items"
              :key="index"
              class="car-video-text-block__text-item"
            >
              <div class="car-video-text-block__text-item-value">{{ item.value }}</div>
              <div class="car-video-text-block__text-item-label">{{ getText(item.label) }}</div>
            </div>
          </div>
          <div v-if="getText(blockData.text1?.note)" class="car-video-text-block__text-note">
            {{ getText(blockData.text1?.note) }}
          </div>
        </div>

        <!-- Bottom Left: Text Block 2 -->
        <div class="car-video-text-block__text-block car-video-text-block__text-block--bottom-left">
          <div class="car-video-text-block__text-title">{{ getText(blockData.text2?.title) }}</div>
          <div v-if="blockData.text2?.items" class="car-video-text-block__text-items">
            <div
              v-for="(item, index) in blockData.text2.items"
              :key="index"
              class="car-video-text-block__text-item"
            >
              <div class="car-video-text-block__text-item-value">{{ item.value }}</div>
              <div class="car-video-text-block__text-item-label">{{ getText(item.label) }}</div>
            </div>
          </div>
          <div v-if="getText(blockData.text2?.note)" class="car-video-text-block__text-note">
            {{ getText(blockData.text2?.note) }}
          </div>
        </div>

        <!-- Bottom Right: Video 2 or Image 2 -->
        <div class="car-video-text-block__video-wrap car-video-text-block__video-wrap--bottom-right">
          <video
            v-if="blockData.video2 && !blockData.image2"
            :src="resolveVideo(blockData.video2)"
            class="car-video-text-block__video"
            autoplay
            muted
            loop
            playsinline
          ></video>
          <img
            v-else-if="blockData.image2"
            :src="resolveImage(blockData.image2)"
            class="car-video-text-block__image"
            alt=""
            loading="lazy"
          />
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

const resolveImage = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}
</script>

<style lang="scss" scoped>
.car-video-text-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  background: rgb(245, 246, 247);

  &__inner {
    width: 100%;
    margin: 0 auto;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0;
    min-height: 80vh;
  }

  &__video-wrap {
    position: relative;
    overflow: hidden;
    background: #000;

    &--top-left {
      grid-column: 1;
      grid-row: 1;
    }

    &--bottom-right {
      grid-column: 2;
      grid-row: 2;
    }
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__text-block {
    padding: 60px 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: transparent;

    &--top-right {
      grid-column: 2;
      grid-row: 1;
    }

    &--bottom-left {
      grid-column: 1;
      grid-row: 2;
    }
  }

  &__text-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 32px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    margin-bottom: 24px;
  }

  &__text-items {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__text-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__text-item-value {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 400;
    color: #111;
  }

  &__text-item-label {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #666;
  }

  &__text-note {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #666;
    margin-top: 16px;
  }
}

@media screen and (max-width: 876px) {
  .car-video-text-block {
    width: calc(100% - 32px);
    margin: 0 16px;

    &__grid {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      min-height: auto;
    }

    &__video-wrap {
      &--top-left {
        grid-column: 1;
        grid-row: 1;
      }

      &--bottom-right {
        grid-column: 1;
        grid-row: 4;
      }
    }

    &__text-block {
      padding: 40px 24px;

      &--top-right {
        grid-column: 1;
        grid-row: 2;
      }

      &--bottom-left {
        grid-column: 1;
        grid-row: 3;
      }
    }

    &__text-title {
      font-size: 24px;
      margin-bottom: 20px;
    }

    &__text-item-value {
      font-size: 24px;
    }

    &__text-item-label {
      font-size: 14px;
    }
  }
}
</style>
