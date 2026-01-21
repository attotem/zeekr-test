<template>
  <section class="car-battery-safety-block" :style="{ background: blockData.background || '#fff' }">
    <div class="car-battery-safety-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-battery-safety-block__title">
        {{ getText(blockData.title) }}
      </h2>

      <div class="car-battery-safety-block__media-wrap">
        <img
          v-if="!isVideo(blockData.image)"
          :src="resolveMedia(blockData.image)"
          :alt="getText(blockData.title)"
          class="car-battery-safety-block__media"
          loading="lazy"
        />
        <video
          v-else
          :src="resolveMedia(blockData.image)"
          class="car-battery-safety-block__media"
          muted
          loop
          playsinline
          autoplay
        />
      </div>

      <div v-if="stats.length" class="car-battery-safety-block__stats">
        <div v-for="(s, idx) in stats" :key="idx" class="car-battery-safety-block__stat">
          <div class="car-battery-safety-block__value">{{ s.value }}</div>
          <div class="car-battery-safety-block__label">{{ getText(s.label) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '7x' }
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

const resolveMedia = (path) => {
  if (!path) return ''
  if (path.startsWith('/')) return path
  if (import.meta.env.DEV) return `/src/assets/pages/${props.carId}/${path}`
  return `/pages/${props.carId}/${path}`
}

const isVideo = (path) => {
  if (!path) return false
  return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')
}

const stats = computed(() => {
  if (Array.isArray(blockData.value.stats)) return blockData.value.stats
  return []
})
</script>

<style lang="scss" scoped>
.car-battery-safety-block {
  width: 100%;
  margin: 0;
  padding: 60px 0;
  background: #fff;

  &__inner {
    width: calc(100% - 40px);
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
    margin: 0 0 36px 0;
  }

  &__media-wrap {
    width: 100%;
    background: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }

  &__media {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }

  &__stats {
    display: flex;
    justify-content: center;
    gap: 80px;
    padding: 34px 0 0;
    flex-wrap: wrap;
  }

  &__stat {
    text-align: center;
    min-width: 180px;
  }

  &__value {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 44px;
    line-height: 1.1;
    font-weight: 400;
    color: #111;
    margin-bottom: 8px;
  }

  &__label {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: rgba(17, 17, 17, 0.6);
  }
}

@media screen and (max-width: 876px) {
  .car-battery-safety-block {
    padding: 44px 0;

    &__inner {
      width: calc(100% - 32px);
      padding: 0 16px;
    }

    &__title {
      font-size: 32px;
      margin-bottom: 26px;
    }

    &__stats {
      gap: 32px;
    }

    &__value {
      font-size: 34px;
    }
  }
}
</style>

