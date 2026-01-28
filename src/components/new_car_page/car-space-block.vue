<template>
  <section class="car-space-block">
    <div class="car-space-block__inner">
      <div class="car-space-block__grid">
        <!-- Top Left: Image 1 -->
        <div class="car-space-block__image-wrap car-space-block__image-wrap--top-left">
          <img
            :src="resolveImage(blockData.image1)"
            :alt="getText(blockData.title)"
            class="car-space-block__image"
            loading="lazy"
          />
        </div>

        <!-- Top Right: Text Block 1 -->
        <div class="car-space-block__text-block car-space-block__text-block--top-right">
          <div class="car-space-block__text-title">{{ getText(blockData.text1?.title) }}</div>
          <div class="car-space-block__text-body">{{ getText(blockData.text1?.body) }}</div>
          <div v-if="getText(blockData.text1?.note)" class="car-space-block__text-note">
            {{ getText(blockData.text1?.note) }}
          </div>
        </div>

        <!-- Bottom Left: Text Block 2 -->
        <div class="car-space-block__text-block car-space-block__text-block--bottom-left">
          <div class="car-space-block__text-title">{{ getText(blockData.text2?.title) }}</div>
          
          <div v-if="blockData.text2?.items" class="car-space-block__text-items">
            <div
              v-for="(item, index) in blockData.text2.items"
              :key="index"
              class="car-space-block__text-item"
            >
              <div class="car-space-block__text-item-value">{{ item.value }}</div>
              <div class="car-space-block__text-item-label">{{ getText(item.label) }}</div>
              <div v-if="getText(item.description)" class="car-space-block__text-item-description">
                {{ getText(item.description) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Right: Image 2 -->
        <div class="car-space-block__image-wrap car-space-block__image-wrap--bottom-right">
          <img
            :src="resolveImage(blockData.image2)"
            :alt="getText(blockData.title)"
            class="car-space-block__image"
            loading="lazy"
          />
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
  if (!imagePath) {
    console.warn('⚠️ Space block: empty image path')
    return ''
  }
  if (imagePath.startsWith('/')) return imagePath
  const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
  const resolvedPath = `${basePath}/${props.carId}/storage/${imagePath}`
  console.log('🖼️ Space block resolving image:', imagePath, '->', resolvedPath)
  return resolvedPath
}
</script>

<style lang="scss" scoped>
.car-space-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  background: rgb(245, 246, 247);

  &__inner {
    width: 100%;
    margin: 0 auto;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0;
    min-height: 80vh;
  }

  &__image-wrap {
    position: relative;
    overflow: hidden;
    background: #f5f5f5;

    &--top-left {
      grid-column: 1;
      grid-row: 1;
    }

    &--bottom-right {
      grid-column: 2;
      grid-row: 2;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__text-block {
    padding: 60px 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: transparent;

    &--top-right {
      grid-column: 2;
      grid-row: 1;
    }

    &--bottom-left {
      grid-column: 1;
      grid-row: 2;
    }
  }

  &__text-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 32px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    margin-bottom: 24px;
  }

  &__text-body {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: #333;
    margin-bottom: 16px;
  }

  &__text-note {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #666;
    margin-top: 16px;
  }

  &__text-items {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__text-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__text-item-value {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 400;
    color: #111;
  }

  &__text-item-label {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.4;
    font-weight: 500;
    color: #111;
    margin-top: 4px;
  }

  &__text-item-description {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #666;
    margin-top: 4px;
  }
}

@media screen and (max-width: 876px) {
  .car-space-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__grid {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      min-height: auto;
    }

    &__image-wrap {
      &--top-left {
        grid-column: 1;
        grid-row: 1;
        min-height: 50vh;
      }

      &--bottom-right {
        grid-column: 1;
        grid-row: 4;
        min-height: 50vh;
      }
    }

    &__text-block {
      padding: 40px 24px;

      &--top-right {
        grid-column: 1;
        grid-row: 2;
      }

      &--bottom-left {
        grid-column: 1;
        grid-row: 3;
      }
    }

    &__text-title {
      font-size: 24px;
      margin-bottom: 16px;
    }

    &__text-body {
      font-size: 16px;
    }

    &__text-item-value {
      font-size: 24px;
    }

    &__text-item-label {
      font-size: 16px;
    }

    &__text-item-description {
      font-size: 14px;
    }
  }
}
</style>
