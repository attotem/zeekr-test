<template>
  <section class="car-image-text-bottom-block">
    <div class="car-image-text-bottom-block__image-wrap">
      <img
        :src="resolveImage(blockData.image)"
        :alt="getText(blockData.title)"
        class="car-image-text-bottom-block__image"
        loading="lazy"
      />
      <div class="car-image-text-bottom-block__overlay"></div>
      <div class="car-image-text-bottom-block__text">
        <h2 v-if="getText(blockData.title)" class="car-image-text-bottom-block__title">
          {{ getText(blockData.title) }}
        </h2>
        <p v-if="getText(blockData.subtitle)" class="car-image-text-bottom-block__subtitle">
          {{ getText(blockData.subtitle) }}
        </p>
        <div v-if="blockData.features && blockData.features.length" class="car-image-text-bottom-block__features">
          <div
            v-for="(feature, index) in blockData.features"
            :key="index"
            class="car-image-text-bottom-block__feature"
          >
            <div class="car-image-text-bottom-block__feature-text">{{ getText(feature) }}</div>
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
.car-image-text-bottom-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  position: relative;

  &__image-wrap {
    width: 100%;
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  &__text {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 40px;
    max-width: 1320px;
    margin: 0 auto;
    width: 100%;
    text-align: center;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #fff;
    margin: 0;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: #fff;
    margin: 0;
    opacity: 0.9;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }

  &__feature {
    display: flex;
    align-items: center;
  }

  &__feature-text {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: #fff;
  }
}

@media screen and (max-width: 876px) {
  .car-image-text-bottom-block {
    width: calc(100% - 32px);
    margin: 0 16px;

    &__image-wrap {
      min-height: 40vh;
    }

    &__text {
      padding: 30px 16px;
      gap: 20px;
    }

    &__title {
      font-size: 32px;
    }

    &__subtitle {
      font-size: 16px;
    }

    &__feature-text {
      font-size: 16px;
    }
  }
}
</style>
