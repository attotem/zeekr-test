<template>
  <section class="car-engine-specs-block" :style="bgStyle">
    <div v-if="getText(blockData.title)" class="car-engine-specs-block__header">
      <h2 class="car-engine-specs-block__title">{{ getText(blockData.title) }}</h2>
      <p v-if="getText(blockData.subtitle)" class="car-engine-specs-block__subtitle">{{ getText(blockData.subtitle) }}</p>
    </div>

    <div class="car-engine-specs-block__rows">
      <div
        v-for="(row, i) in rows"
        :key="i"
        class="car-engine-specs-block__row"
        :class="{ 'car-engine-specs-block__row--reversed': row.imageRight }"
      >
        <div class="car-engine-specs-block__image-side">
          <img
            :src="resolveImage(row.image)"
            :alt="getText(row.title)"
            class="car-engine-specs-block__img"
            loading="lazy"
          />
        </div>

        <div class="car-engine-specs-block__text-side">
          <h3 class="car-engine-specs-block__row-title">{{ getText(row.title) }}</h3>
          <div class="car-engine-specs-block__divider"></div>

          <div v-if="row.specs && row.specs.length" class="car-engine-specs-block__specs">
            <div v-for="(spec, j) in row.specs" :key="j" class="car-engine-specs-block__spec">
              <div class="car-engine-specs-block__spec-value">{{ getText(spec.value) }}</div>
              <div class="car-engine-specs-block__spec-label">{{ getText(spec.label) }}</div>
            </div>
          </div>

          <p v-if="getText(row.description)" class="car-engine-specs-block__desc">{{ getText(row.description) }}</p>
        </div>
      </div>
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
const rows = computed(() => blockData.value.rows || [])

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
.car-engine-specs-block {
  width: 100%;
  background: #f5f6f7;

  &__header {
    text-align: center;
    padding: 64px 40px 48px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 32px;
    font-weight: 400;
    color: #111;
    margin: 0 0 10px;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    color: rgba(17, 17, 17, 0.55);
    margin: 0;
    letter-spacing: 0.04em;
  }

  &__rows {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;

    &--reversed {
      direction: rtl;

      > * {
        direction: ltr;
      }
    }
  }

  &__image-side {
    overflow: hidden;
    height: 100%;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  &__text-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 64px;
    height: 100%;
    box-sizing: border-box;
  }

  &__row-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 18px;
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
    gap: 40px;
  }

  &__spec-value {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 28px;
    font-weight: 400;
    color: #111;
    margin-bottom: 4px;
  }

  &__spec-label {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 12px;
    color: rgba(17, 17, 17, 0.55);
  }

  &__desc {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 13px;
    color: rgba(17, 17, 17, 0.7);
    line-height: 1.7;
    margin: 0;
    white-space: pre-line;
  }
}

@media screen and (max-width: 876px) {
  .car-engine-specs-block {
    &__header {
      padding: 40px 16px 32px;
    }

    &__title {
      font-size: 24px;
    }

    &__row {
      grid-template-columns: 1fr;
      height: auto;
      direction: ltr !important;

      &--reversed {
        direction: ltr;
      }
    }

    &__image-side {
      height: 260px;
    }

    &__text-side {
      padding: 28px 20px;
    }

    &__specs {
      gap: 24px;
    }

    &__spec-value {
      font-size: 22px;
    }
  }
}
</style>
