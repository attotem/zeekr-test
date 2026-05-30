<template>
  <section class="car-view-block">
    <div class="car-view-block__mobile-title">
      <h2 v-if="getText(blockData.title)" class="car-view-block__title-text">{{ getText(blockData.title) }}</h2>
      <p v-if="getText(blockData.subtitle)" class="car-view-block__subtitle-text">{{ getText(blockData.subtitle) }}</p>
    </div>
    <div class="car-view-block__image-wrap">
      <img
        :src="resolveImage(blockData.image)"
        :alt="getText(blockData.title)"
        class="car-view-block__img"
      />
      <div class="car-view-block__overlay">
        <h2 v-if="getText(blockData.title)" class="car-view-block__title">{{ getText(blockData.title) }}</h2>
        <p v-if="getText(blockData.subtitle)" class="car-view-block__subtitle">{{ getText(blockData.subtitle) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'
import { resolveMediaPath } from '@/utils/resolveMedia'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '' }
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
    return textObj.uk || textObj.ua || textObj.en || ''
  }
  return ''
}

const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })
</script>

<style lang="scss" scoped>
.car-view-block {
  width: 100%;
  padding: 20px;


  &__mobile-title {
    display: none;
  }

  &__image-wrap {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-top: 8%;
    pointer-events: none;
    flex-direction: column;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 40px;
    font-weight: 400;
    color: #fff;
    margin: 0 0 8px;
    text-align: center;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    text-align: center;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  }

  &__title-text {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 24px;
    font-weight: 400;
    color: #111;
    margin: 0 0 6px;
    text-align: center;
  }

  &__subtitle-text {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: rgba(17, 17, 17, 0.6);
    margin: 0;
    text-align: center;
  }
}

@media screen and (max-width: 876px) {
  .car-view-block {
    &__mobile-title {
      display: block;
      padding: 32px 16px 24px;
      background: #fff;
    }

    &__overlay {
      display: none;
    }
  }
}
</style>
