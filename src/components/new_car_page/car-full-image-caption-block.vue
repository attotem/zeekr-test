<template>
  <section class="car-full-image-caption-block" :style="bgStyle">
    <h2 v-if="getText(blockData.title)" class="car-full-image-caption-block__title">
      {{ getText(blockData.title) }}
    </h2>

    <div class="car-full-image-caption-block__image-wrap">
      <img
        :src="resolveImage(blockData.image)"
        :alt="getText(blockData.title)"
        class="car-full-image-caption-block__image"
        loading="lazy"
      />
    </div>

    <div class="car-full-image-caption-block__caption">
      <p v-if="getText(blockData.subtitle)" class="car-full-image-caption-block__subtitle">
        {{ getText(blockData.subtitle) }}
      </p>
      <div class="car-full-image-caption-block__divider"></div>
      <p v-if="getText(blockData.description)" class="car-full-image-caption-block__desc">
        {{ getText(blockData.description) }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '' }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})

const bgStyle = computed(() => {
  const bg = blockData.value.background
  return bg ? { background: bg } : {}
})

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

const resolveImage = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) return `/src/assets/pages/${props.carId}/${imagePath}`
  return `/pages/${props.carId}/${imagePath}`
}
</script>

<style lang="scss" scoped>
.car-full-image-caption-block {
  width: 100%;
  background: rgb(235, 232, 227);

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 28px;
    font-weight: 400;
    color: #111;
    text-align: center;
    margin: 0;
    padding: 56px 40px 48px;
  }

  &__image-wrap {
    width: 100%;
    overflow: hidden;
    line-height: 0;
  }

  &__image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  &__caption {
    padding: 40px 40px 56px;
    max-width: 640px;
    margin: 0 auto;
    text-align: center;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: #111;
    margin: 0 0 20px;
    line-height: 1.4;
  }

  &__divider {
    width: 100%;
    height: 1px;
    background: rgba(17, 17, 17, 0.2);
    margin-bottom: 20px;
  }

  &__desc {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 13px;
    color: rgba(17, 17, 17, 0.6);
    margin: 0;
    line-height: 1.7;
  }
}

@media screen and (max-width: 876px) {
  .car-full-image-caption-block {
    &__title {
      font-size: 22px;
      padding: 40px 20px 32px;
    }

    &__caption {
      padding: 28px 20px 40px;
    }

    &__subtitle {
      font-size: 15px;
    }
  }
}
</style>
