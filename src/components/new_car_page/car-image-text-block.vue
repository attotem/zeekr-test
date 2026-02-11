<template>
  <section class="car-image-text-block">
    <div class="car-image-text-block__inner">
      <div
        class="car-image-text-block__content"
        :class="{ 'car-image-text-block__content--reverse': blockData.textRight }"
      >
        <!-- Text section -->
        <div class="car-image-text-block__text">
          <h2 v-if="getText(blockData.title)" class="car-image-text-block__title">
            {{ getText(blockData.title) }}
          </h2>
          <div v-if="blockData.features" class="car-image-text-block__features">
            <div
              v-for="(feature, index) in blockData.features"
              :key="index"
              class="car-image-text-block__feature"
            >
              <div class="car-image-text-block__feature-text">{{ getText(feature) }}</div>
            </div>
          </div>
        </div>

        <div class="car-image-text-block__image-wrap">
          <img
            :src="resolveImage(blockData.image)"
            :alt="getText(blockData.title)"
            class="car-image-text-block__image"
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
    if (lang === 'zh' && (textObj.zh || textObj.cn)) return textObj.zh || textObj.cn
    return textObj.uk || textObj.ua || textObj.en || textObj.ru || textObj.zh || textObj.cn || ''
  }
  return ''
}

const resolveImage = (image) =>
  resolveMediaPath(image, { carId: props.carId })

const preloadImage = () => {
  const image = blockData.value.image
  if (!image) return

  const imgSrc = resolveImage(image)
  if (!imgSrc) return

  const img = new Image()
  img.onerror = () => {
    console.warn(`Failed to preload image-text image: ${imgSrc}`)
  }
  img.src = imgSrc
}

watch(
  () => blockData.value.image,
  (newImage) => {
    if (newImage) {
      preloadImage()
    }
  },
  { immediate: true }
)

onMounted(() => {
  preloadImage()
})
</script>

<style lang="scss" scoped>
.car-image-text-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 32px 0;
  background: #fff;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 48px;
    align-items: center;

    &--reverse {
      grid-template-columns: 2fr 1fr;
      
      .car-image-text-block__text {
        order: 2;
      }
      
      .car-image-text-block__image-wrap {
        order: 1;
      }
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    margin: 0;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__feature {
    display: flex;
    align-items: center;
  }

  &__feature-text {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: #333;
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
    object-fit: cover;
    object-position: center;
  }
}

@media screen and (max-width: 876px) {
  .car-image-text-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__content {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    &__text {
      gap: 24px;
    }

    &__title {
      font-size: 32px;
    }

    &__feature-text {
      font-size: 16px;
    }
  }
}
</style>
