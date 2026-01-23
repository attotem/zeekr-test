<template>
  <section class="car-mvp-block">
    <div class="car-mvp-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-mvp-block__title">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-mvp-block__content">
        <div class="car-mvp-block__image-wrap">
          <img
            :src="resolveImage(blockData.image)"
            :alt="getText(blockData.title)"
            class="car-mvp-block__image"
            loading="lazy"
          />
          <div v-if="blockData.features" class="car-mvp-block__features">
            <div
              v-for="(feature, index) in blockData.features"
              :key="index"
              class="car-mvp-block__feature"
            >
              <div class="car-mvp-block__feature-value">{{ feature.value }}</div>
              <div class="car-mvp-block__feature-label">{{ getText(feature.label) }}</div>
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
</script>

<style lang="scss" scoped>
.car-mvp-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 64px 0;
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
    margin: 0 0 48px;
    text-align: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
    min-height: 60vh;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    position: absolute;
    inset: 0;
  }

  &__features {
    position: absolute;
    left: 48px;
    bottom: 48px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 400px;
  }

  &__feature {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
  }

  &__feature-value {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 32px;
    line-height: 1.2;
    font-weight: 400;
    color: #fff;
  }

  &__feature-label {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.9);
  }
}

@media screen and (max-width: 876px) {
  .car-mvp-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 28px 0;

    &__inner {
      padding: 0 16px;
    }

    &__title {
      font-size: 32px;
      margin-bottom: 32px;
    }

    &__image-wrap {
      min-height: 50vh;
    }

    &__features {
      left: 24px;
      bottom: 24px;
      gap: 24px;
      max-width: 100%;
    }

    &__feature-value {
      font-size: 28px;
    }

    &__feature-label {
      font-size: 14px;
    }
  }
}
</style>
