<template>
  <section class="car-mvp-block">
    <div class="car-mvp-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-mvp-block__title car-section-title car-section-title--center">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-mvp-block__content">
        <div class="car-mvp-block__image-wrap">
          <img
            :src="resolveImage(blockData.image)"
            :alt="getText(blockData.title)"
            class="car-mvp-block__image"
            loading="lazy"
          />
          <div v-if="blockData.features" class="car-mvp-block__features">
            <div
              v-for="(feature, index) in blockData.features"
              :key="index"
              class="car-mvp-block__feature"
            >
              <div class="car-mvp-block__feature-value">{{ feature.value }}</div>
              <div class="car-mvp-block__feature-label">{{ getText(feature.label) }}</div>
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

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

const resolveImage = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}
</script>

<style lang="scss" scoped>
.car-mvp-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  padding: 64px 0;
  background: #fff;

  &__inner {
    width: var(--car-inner-width);
    max-width: var(--car-inner-max-width);
    margin: var(--car-inner-margin);
    padding: var(--car-inner-padding-x);
  }

  &__title {
        color: var(--car-title-color);
    margin: 0 0 48px;
    text-align: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__image-wrap {
    width: var(--car-card-width);
    position: relative;
    overflow: var(--car-card-overflow);
    background: var(--car-card-media-bg);
    min-height: 60vh;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    position: absolute;
    inset: 0;
  }

  &__features {
    position: absolute;
    left: 48px;
    bottom: 48px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 400px;
  }

  &__feature {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
  }

  &__feature-value {
        font-size: 32px;
    line-height: 1.2;
    font-weight: 400;
    color: #fff;
  }

  &__feature-label {
    font-family: var(--car-font-body);
    font-size: 16px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.9);
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-mvp-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__inner {
      padding: var(--car-inner-padding-x-sm);
    }

    &__title {
      margin-bottom: 32px;
    }

    &__image-wrap {
      min-height: 50vh;
    }

    &__features {
      left: 24px;
      bottom: 24px;
      gap: 24px;
      max-width: 100%;
    }

    &__feature-value {
      font-size: 28px;
    }

    &__feature-label {
      font-size: 14px;
    }
  }
}
</style>
