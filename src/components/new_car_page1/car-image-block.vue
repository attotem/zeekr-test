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
import { getTextByLang } from '@/utils/getText'

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


const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)
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
    font-family: var(--car-font-body);
    font-size: 24px;
    line-height: 1.4;
    margin: 0;
    font-weight: 400;
    color: hsla(0, 0%, 100%, .75) !important;
    text-align: center;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
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
