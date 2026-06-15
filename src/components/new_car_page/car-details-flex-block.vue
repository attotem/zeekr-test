<template>
  <section class="car-details-flex-block">
    <h2 v-if="getText(blockData.title)" class="car-details-flex-block__title">
      {{ getText(blockData.title) }}
    </h2>

    <div class="car-details-flex-block__body">
      <!-- Row 1: large left + 2 stacked right -->
      <div class="car-details-flex-block__row car-details-flex-block__row--split">
        <div v-if="items[0]" class="car-details-flex-block__card car-details-flex-block__card--large">
          <img :src="resolveImage(items[0].image)" :alt="getText(items[0].title)" loading="lazy" />
          <div class="car-details-flex-block__overlay">
            <h3 class="car-details-flex-block__card-title">{{ getText(items[0].title) }}</h3>
            <p class="car-details-flex-block__card-desc">{{ getText(items[0].description) }}</p>
          </div>
        </div>

        <div class="car-details-flex-block__col">
          <div v-if="items[1]" class="car-details-flex-block__card">
            <img :src="resolveImage(items[1].image)" :alt="getText(items[1].title)" loading="lazy" />
            <div class="car-details-flex-block__overlay">
              <h3 class="car-details-flex-block__card-title">{{ getText(items[1].title) }}</h3>
              <p class="car-details-flex-block__card-desc">{{ getText(items[1].description) }}</p>
            </div>
          </div>
          <div v-if="items[2]" class="car-details-flex-block__card">
            <img :src="resolveImage(items[2].image)" :alt="getText(items[2].title)" loading="lazy" />
            <div class="car-details-flex-block__overlay">
              <h3 class="car-details-flex-block__card-title">{{ getText(items[2].title) }}</h3>
              <p class="car-details-flex-block__card-desc">{{ getText(items[2].description) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 2: equal halves -->
      <div class="car-details-flex-block__row">
        <div v-if="items[3]" class="car-details-flex-block__card">
          <img :src="resolveImage(items[3].image)" :alt="getText(items[3].title)" loading="lazy" />
          <div class="car-details-flex-block__overlay">
            <h3 class="car-details-flex-block__card-title">{{ getText(items[3].title) }}</h3>
            <p class="car-details-flex-block__card-desc">{{ getText(items[3].description) }}</p>
          </div>
        </div>
        <div v-if="items[4]" class="car-details-flex-block__card">
          <img :src="resolveImage(items[4].image)" :alt="getText(items[4].title)" loading="lazy" />
          <div class="car-details-flex-block__overlay">
            <h3 class="car-details-flex-block__card-title">{{ getText(items[4].title) }}</h3>
            <p class="car-details-flex-block__card-desc">{{ getText(items[4].description) }}</p>
          </div>
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
const items = computed(() => blockData.value.items || [])

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
  const subdir = blockData.value.subdir !== undefined ? blockData.value.subdir : ''
  const filePath = subdir ? `${subdir}/${imagePath}` : imagePath
  if (import.meta.env.DEV) return `/src/assets/pages/${props.carId}/${filePath}`
  return `/pages/${props.carId}/${filePath}`
}
</script>

<style lang="scss" scoped>
.car-details-flex-block {
  width: 100%;
  padding: 64px 40px;
  background: #fff;

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 40px;
    font-weight: 400;
    color: #111;
    text-align: center;
    margin: 0 0 48px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 1320px;
    margin: 0 auto;
  }

  &__row {
    display: flex;
    flex-direction: row;
    gap: 8px;

    &--split {
      align-items: stretch;
    }
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  &__card {
    position: relative;
    flex: 1;
    overflow: hidden;
    border-radius: 4px;
    min-height: 200px;

    &--large {
      flex: none;
      width: 50%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px 24px;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%);
  }

  &__card-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 4px;
    line-height: 1.3;
  }

  &__card-desc {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.85);
    margin: 0;
    line-height: 1.5;
  }
}

@media screen and (max-width: 876px) {
  .car-details-flex-block {
    padding: 40px 16px;

    &__title {
      font-size: 28px;
      margin-bottom: 32px;
    }

    &__row {
      flex-direction: column;

      &--split {
        flex-direction: column;
      }
    }

    &__card--large {
      width: 100%;
    }

    &__card {
      // min-height: 220px;
    }
  }
}
</style>
