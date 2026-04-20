<template>
  <section class="car-image-caption-block">
    <div class="car-image-caption-block__inner">
      <div class="car-image-caption-block__image-wrap">
        <img
          :src="resolveImage(blockData.image)"
          :alt="getText(blockData.caption)"
          class="car-image-caption-block__image"
          loading="lazy"
        />
      </div>
      <div v-if="getText(blockData.caption)" class="car-image-caption-block__caption">
        {{ getText(blockData.caption) }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
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

const resolveImage = (imagePath) => {
  return resolveMediaPath(imagePath, { carId: props.carId })
}

// Preload image
const preloadImage = () => {
  const imagePath = blockData.value.image
  if (!imagePath) return
  
  const imgSrc = resolveImage(imagePath)
  if (!imgSrc) return
  
  const img = new Image()
  img.onerror = () => {
    console.warn(`Failed to preload image: ${imgSrc}`)
  }
  img.src = imgSrc
}

// Watch blockData to preload when image changes
watch(() => blockData.value.image, (newImage) => {
  if (newImage) {
    preloadImage()
  }
}, { immediate: true })

onMounted(() => {
  preloadImage()
})
</script>

<style lang="scss" scoped>
.car-image-caption-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  background: #fff;

  &__inner {
    width: 100%;
    margin: 0 auto;
  }

  &__image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
  }

  &__image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    object-position: center;
  }

  &__caption {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #666;
    margin-top: 10px;
    text-align: left;
  }
}

@media screen and (max-width: 876px) {
  .car-image-caption-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__caption {
      font-size: 12px;
      margin-top: 16px;
    }
  }
}
</style>
