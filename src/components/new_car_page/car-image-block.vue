<template>
  <section
    class="car-image-block"
    :style="{
      '--bg-desktop': `url(${getBackgroundImage})`,
      marginTop: blockData.marginTop ? blockData.marginTop + 'px' : undefined
    }"
  >
    <img
      v-if="getMobileBackgroundImage"
      class="car-image-block__mobile-img"
      :src="getMobileBackgroundImage"
      alt=""
      loading="lazy"
    />
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
  const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
  return `${basePath}/${props.carId}/7x-second.webp`
})

const getMobileBackgroundImage = computed(() => {
  const mob = blockData.value.imageMobile
  return mob ? resolveImage(mob) : null
})

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
  width: calc(100% - 40px);
  margin: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-image: var(--bg-desktop);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &__mobile-img {
    display: none;
  }

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
    width: 100%;
    min-height: unset;
    padding: 0 0 40px;
    background-image: none;

    &__mobile-img {
      display: block;
      width: 100%;
      height: auto;
    }

    &__title {
      font-size: 36px;
      margin-bottom: 16px;
      padding: 0 20px;
    }

    &__subtitle {
      font-size: 18px;
      padding: 0 20px;
    }
  }
}
</style>
