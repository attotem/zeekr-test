<template>
  <section class="car-text-image-block">
    <div class="car-text-image-block__image-wrap">
      <img
        :src="resolveImage(blockData.image)"
        :alt="getText(blockData.title)"
        class="car-text-image-block__image"
        loading="lazy"
      />
      <div class="car-text-image-block__overlay"></div>
      <div class="car-text-image-block__text">
        <h2 v-if="getText(blockData.title)" class="car-text-image-block__title">
          {{ getText(blockData.title) }}
        </h2>
        <p v-if="getText(blockData.subtitle)" class="car-text-image-block__subtitle">
          {{ getText(blockData.subtitle) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'
import { resolveMediaPath } from '@/utils/resolveMedia'

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

const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })
</script>

<style lang="scss" scoped>
.car-text-image-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  position: relative;

  &__image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    min-height: 80vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.2) 100%);
    z-index: 1;
  }

  &__text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 20px 40px;
    max-width: 1320px;
    margin: 0 auto;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #ffffff;
    margin: 0 0 16px 0;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 20px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
}

@media screen and (max-width: 876px) {
  .car-text-image-block {
    width: calc(100% - 32px);
    margin: 0 16px;

    &__image-wrap {
      min-height: auto;
      display: flex;
      flex-direction: column-reverse;
      align-items: stretch;
      justify-content: flex-start;
    }

    &__text {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      padding: 24px 0 16px;
      width: 100%;
      max-width: 100%;
      margin: 0;
    }

    &__title {
      font-size: 24px;
      margin-bottom: 8px;
      color: #000000;
    }

    &__subtitle {
      font-size: 14px;
      color: #333333;
    }

    &__image {
      position: relative;
      top: auto;
      left: auto;
      height: auto;
    }

    &__overlay {
      display: none;
    }
  }
}
</style>
