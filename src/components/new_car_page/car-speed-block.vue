<template>
  <section class="car-speed-block">
    <div class="car-speed-block__grid">
      <div v-for="(card, i) in cards" :key="i" class="car-speed-block__card">
        <img
          :src="resolveImage(card.image.desktop)"
          :alt="getText(card.title)"
          class="car-speed-block__img car-speed-block__img--desktop"
        />
        <img
          :src="resolveImage(card.image.mobile)"
          :alt="getText(card.title)"
          class="car-speed-block__img car-speed-block__img--mobile"
        />
        <div class="car-speed-block__text">
          <h3 class="car-speed-block__title">{{ getText(card.title) }}</h3>
          <div class="car-speed-block__specs">
            <div v-for="(spec, j) in card.specs" :key="j" class="car-speed-block__spec">
              <div class="car-speed-block__spec-value">{{ spec.value }}</div>
              <div class="car-speed-block__spec-label">{{ getText(spec.label) }}</div>
            </div>
          </div>
          <p v-if="getText(card.note)" class="car-speed-block__note">{{ getText(card.note) }}</p>
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
const cards = computed(() => blockData.value.cards || [])

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

const resolveImage = (path) => {
  if (!path) return ''
  if (path.startsWith('/')) return path
  if (import.meta.env.DEV) return `/src/assets/pages/${props.carId}/${path}`
  return `/pages/${props.carId}/${path}`
}
</script>

<style lang="scss" scoped>
.car-speed-block {
  width: calc(100% - 40px);
  margin: 0 20px;

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  &__card {
    position: relative;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;

    &--mobile {
      display: none;
    }
  }

  &__text {
    display: none;
  }
}

@media screen and (max-width: 876px) {
  .car-speed-block {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__img {
      &--desktop {
        display: none;
      }

      &--mobile {
        display: block;
        height: auto;
      }
    }

    &__text {
      display: block;
      padding: 20px 16px 32px;
      background: #fff;
    }

    &__title {
      font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
      font-size: 22px;
      font-weight: 400;
      color: #111;
      margin: 0 0 20px;
    }

    &__specs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 24px;
      margin-bottom: 16px;
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
      font-size: 13px;
      color: rgba(17, 17, 17, 0.55);
      line-height: 1.4;
    }

    &__note {
      font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
      font-size: 12px;
      color: rgba(17, 17, 17, 0.45);
      line-height: 1.6;
      margin: 0;
    }
  }
}
</style>
