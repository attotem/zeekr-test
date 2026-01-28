<template>
  <section class="car-passive-security-block" :style="{ background: blockData.background || 'rgb(245, 246, 247)' }">
    <div class="car-passive-security-block__inner">
      <div class="car-passive-security-block__grid">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="car-passive-security-block__item"
          :class="`car-passive-security-block__item--${index + 1}`"
        >
          <div class="car-passive-security-block__media">
            <img
              :src="resolveMedia(item.image)"
              :alt="getText(item.title)"
              class="car-passive-security-block__image"
              loading="lazy"
            />
            <div v-if="getText(item.title)" class="car-passive-security-block__label">
              {{ getText(item.title) }}
            </div>
          </div>
        </div>
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
  carId: { type: String, default: '7x' }
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

const resolveMedia = (media) => resolveMediaPath(media, { carId: props.carId })

const items = computed(() => {
  // Backward compatible: allow `materials` or `items`
  if (Array.isArray(blockData.value.items)) return blockData.value.items
  if (Array.isArray(blockData.value.materials)) return blockData.value.materials
  return []
})
</script>

<style lang="scss" scoped>
.car-passive-security-block {
  width: 100%;
  margin: 0;
  padding: 60px 0;
  background: rgb(245, 246, 247);

  &__inner {
    width: calc(100% - 40px);
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  &__item--1 {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  &__item--2 {
    grid-column: 2;
    grid-row: 1;
  }

  &__item--3 {
    grid-column: 2;
    grid-row: 2;
  }

  &__item--4 {
    grid-column: 1;
    grid-row: 3;
  }

  &__item--5 {
    grid-column: 2;
    grid-row: 3;
  }

  &__media {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.02);
    aspect-ratio: 16 / 9;
  }

  &__item--1 &__media {
    aspect-ratio: 1 / 1;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__label {
    position: absolute;
    left: 18px;
    bottom: 16px;
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.4;
    color: rgba(17, 17, 17, 0.92);
    font-weight: 600;
    max-width: calc(100% - 36px);
    pointer-events: none;
  }
}

@media screen and (max-width: 876px) {
  .car-passive-security-block {
    padding: 44px 0;

    &__inner {
      width: calc(100% - 32px);
      padding: 0 16px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    &__item--1,
    &__item--2,
    &__item--3,
    &__item--4,
    &__item--5 {
      grid-column: auto;
      grid-row: auto;
    }

    &__media {
      aspect-ratio: 16 / 9;
    }

    &__label {
      left: 14px;
      bottom: 12px;
      font-size: 14px;
    }
  }
}
</style>

