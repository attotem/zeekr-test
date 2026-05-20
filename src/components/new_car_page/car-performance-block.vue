<template>
  <section class="car-performance-block">
    <div class="car-performance-block__inner">
      <!-- Row 1: Image Left, Text Right -->
      <div class="car-performance-block__row car-performance-block__row--image-left">
        <div class="car-performance-block__image-wrap">
          <img
            :src="resolveImage(blockData.image1)"
            :alt="getText(blockData.version1?.title)"
            class="car-performance-block__image"
            loading="lazy"
          />
        </div>
        <div class="car-performance-block__content">
          <h3 v-if="getText(blockData.version1?.title)" class="car-performance-block__title">
            {{ getText(blockData.version1.title) }}
          </h3>
          <div class="car-performance-block__divider"></div>
          <div v-if="blockData.version1?.specs" class="car-performance-block__specs">
            <div
              v-for="(spec, index) in blockData.version1.specs"
              :key="index"
              class="car-performance-block__spec"
            >
              <div class="car-performance-block__spec-value">{{ getText(spec.value) }}</div>
              <div class="car-performance-block__spec-label">{{ getText(spec.label) }}</div>
            </div>
          </div>
          <p v-if="getText(blockData.version1?.note)" class="car-performance-block__note">
            {{ getText(blockData.version1.note) }}
          </p>
        </div>
      </div>

      <!-- Row 2: Text Left, Image Right -->
      <div class="car-performance-block__row car-performance-block__row--text-left">
        <div class="car-performance-block__content">
          <h3 v-if="getText(blockData.version2?.title)" class="car-performance-block__title">
            {{ getText(blockData.version2.title) }}
          </h3>
          <div class="car-performance-block__divider"></div>
          <div v-if="blockData.version2?.specs" class="car-performance-block__specs">
            <div
              v-for="(spec, index) in blockData.version2.specs"
              :key="index"
              class="car-performance-block__spec"
            >
              <div class="car-performance-block__spec-value">{{ getText(spec.value) }}</div>
              <div class="car-performance-block__spec-label">{{ getText(spec.label) }}</div>
            </div>
          </div>
          <p v-if="getText(blockData.version2?.note)" class="car-performance-block__note">
            {{ getText(blockData.version2.note) }}
          </p>
        </div>
        <div class="car-performance-block__image-wrap">
          <img
            :src="resolveImage(blockData.image2)"
            :alt="getText(blockData.version2?.title)"
            class="car-performance-block__image"
            loading="lazy"
          />
        </div>
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
    if (lang === 'ru' && textObj.ua) return textObj.ua
    if (lang === 'zh' && (textObj.zh || textObj.cn)) return textObj.zh || textObj.cn
    return textObj.uk || textObj.ua || textObj.en || textObj.ru || textObj.zh || textObj.cn || ''
  }
  return ''
}

const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })

// Preload images
const preloadAllImages = () => {
  const images = [blockData.value.image1, blockData.value.image2].filter(Boolean)
  
  images.forEach(image => {
    if (!image) return

    const imgSrc = resolveImage(image)
    if (!imgSrc) return
    
    const img = new Image()
    img.onerror = () => {
      console.warn(`Failed to preload performance image: ${imgSrc}`)
    }
    img.src = imgSrc
  })
}

// Watch blockData to preload when images change
watch(() => [blockData.value.image1, blockData.value.image2], ([img1, img2]) => {
  if (img1 || img2) {
    preloadAllImages()
  }
}, { immediate: true })

onMounted(() => {
  preloadAllImages()
})
</script>

<style lang="scss" scoped>
.car-performance-block {
  background: v-bind("blockData.background || 'rgb(245, 246, 247)'");
  width: calc(100% - 40px);
  margin: auto;

  &__inner {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;

    &--image-left {
      .car-performance-block__image-wrap { order: 1; }
      .car-performance-block__content { order: 2; }
    }

    &--text-left {
      .car-performance-block__content { order: 1; }
      .car-performance-block__image-wrap { order: 2; }
    }
  }

  &__image-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__content {
    padding: 40px 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 18px;
    line-height: 1.4;
    font-weight: 400;
    color: #111;
    margin: 0 0 16px;
  }

  &__divider {
    width: 100%;
    height: 1px;
    background: rgba(17, 17, 17, 0.15);
    margin-bottom: 24px;
  }

  &__specs {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__spec {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__spec-value {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 16px;
    line-height: 1.3;
    font-weight: 600;
    color: #111;
  }

  &__spec-label {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: rgba(17, 17, 17, 0.55);
  }

  &__note {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 12px;
    line-height: 1.6;
    color: rgba(17, 17, 17, 0.55);
    margin: 16px 0 0;
  }
}

@media screen and (max-width: 876px) {
  .car-performance-block {
    &__row {
      grid-template-columns: 1fr;
      height: auto;

      &--image-left {
        .car-performance-block__image-wrap { order: 1; }
        .car-performance-block__content { order: 2; }
      }

      &--text-left {
        .car-performance-block__content { order: 1; }
        .car-performance-block__image-wrap { order: 2; }
      }
    }

    &__image-wrap {
      height: 280px;
    }

    &__content {
      padding: 28px 20px;
    }

    &__title {
      font-size: 16px;
    }

    &__spec-value {
      font-size: 15px;
    }
  }
}
</style>
