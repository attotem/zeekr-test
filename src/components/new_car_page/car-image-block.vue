<template>
  <section 
    class="car-image-block"
    :style="{ backgroundImage: `url(${getBackgroundImage})` }"
  >
    <h2 class="car-image-block__title">{{ getText(blockData.title) }}</h2>
    <p class="car-image-block__subtitle">{{ getText(blockData.subtitle) }}</p>
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

const resolveImage = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}

const getBackgroundImage = computed(() => {
  if (blockData.value.image) {
    return resolveImage(blockData.value.image)
  }
  // Fallback to default
  const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
  return `${basePath}/${props.carId}/7x-second.webp`
})

// Функция для получения текста в зависимости от языка
const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') {
    return textObj
  }
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
</script>

<style lang="scss" scoped>
.car-image-block {
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &__title {
    font-family: ZeekrLanTingHei-Regular, sans-serif;
    font-size: 64px;
    line-height: 1.2;
    margin: 0 0 24px;
    font-weight: 400;
    color: #fff;
    text-align: center;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 24px;
    line-height: 1.4;
    margin: 0;
    font-weight: 400;
    color: hsla(0, 0%, 100%, .75) !important;
    text-align: center;
  }
}

@media screen and (max-width: 876px) {
  .car-image-block {
    min-height: 40vh;
    padding: 30px 16px;

    &__title {
      font-size: 36px;
      margin-bottom: 16px;
    }

    &__subtitle {
      font-size: 18px;
    }
  }
}
</style>
