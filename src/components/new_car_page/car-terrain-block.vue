<template>
  <section class="car-terrain-block">
    <div class="car-terrain-block__inner">
      <div class="car-terrain-block__content">
        <div class="car-terrain-block__text">
          <h2 v-if="getText(blockData.title)" class="car-terrain-block__title">
            {{ getText(blockData.title) }}
          </h2>
          <p v-if="getText(blockData.subtitle)" class="car-terrain-block__subtitle">
            {{ getText(blockData.subtitle) }}
          </p>
          
          <div v-if="blockData.standardModes" class="car-terrain-block__modes">
            <h3 class="car-terrain-block__modes-title">{{ getText(blockData.standardModes.title) }}</h3>
            <div class="car-terrain-block__modes-grid">
              <div 
                v-for="(mode, index) in blockData.standardModes.items" 
                :key="'standard-' + index"
                class="car-terrain-block__mode"
              >
                <img 
                  :src="resolveIcon(mode.icon)" 
                  :alt="getText(mode.label)"
                  class="car-terrain-block__mode-icon"
                />
                <span class="car-terrain-block__mode-label">{{ getText(mode.label) }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="blockData.adaptiveModes" class="car-terrain-block__modes">
            <h3 class="car-terrain-block__modes-title">{{ getText(blockData.adaptiveModes.title) }}</h3>
            <div class="car-terrain-block__modes-grid car-terrain-block__modes-grid--adaptive">
              <div 
                v-for="(mode, index) in blockData.adaptiveModes.items" 
                :key="'adaptive-' + index"
                class="car-terrain-block__mode"
              >
                <img 
                  :src="resolveIcon(mode.icon)" 
                  :alt="getText(mode.label)"
                  class="car-terrain-block__mode-icon"
                />
                <span class="car-terrain-block__mode-label">{{ getText(mode.label) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="car-terrain-block__image-wrap">
          <img
            :src="resolveImage(blockData.image)"
            :alt="getText(blockData.title)"
            class="car-terrain-block__image"
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
import { getTextByLang } from '@/utils/getText'
import { resolveMediaPath } from '@/utils/resolveMedia'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  carId: {
    type: String,
    default: '9x'
  }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })

const resolveIcon = (iconPath) => {
  if (!iconPath) return ''
  if (iconPath.startsWith('/')) return iconPath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/icons/${iconPath}`
  }
  return `/pages/${props.carId}/icons/${iconPath}`
}
</script>

<style lang="scss" scoped>
.car-terrain-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  padding: var(--car-section-padding-y);
  background: #fff;

  &__inner {
    width: var(--car-inner-width);
    max-width: var(--car-inner-max-width);
    margin: var(--car-inner-margin);
    padding: var(--car-inner-padding-x);
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 48px;
    align-items: center;
  }

  &__text {
    display: var(--car-stack-column);
    flex-direction: var(--car-stack-direction);
    gap: var(--car-stack-gap-lg);
  }

  &__title {
    font-family: var(--car-font-heading);
    font-size: 42px;
    line-height: 1.3;
    font-weight: 400;
    color: var(--car-text-primary);
    margin: 0;
  }

  &__subtitle {
    font-family: var(--car-font-body);
    font-size: 16px;
    line-height: 1.6;
    color: var(--car-text-muted);
    margin: 0;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e5e5;
  }

  &__modes {
    display: flex;
    flex-direction: column;
    gap: var(--car-stack-gap-sm);
  }

  &__modes-title {
    font-family: var(--car-font-body);
    font-size: 16px;
    line-height: 1.4;
    font-weight: 400;
    color: var(--car-text-primary);
    margin: 0;
  }

  &__modes-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    
    &--adaptive {
      gap: 20px;
    }
  }

  &__mode {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 60px;
  }

  &__mode-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  &__mode-label {
    font-family: var(--car-font-body);
    font-size: 12px;
    line-height: 1.4;
    color: var(--car-text-muted);
    text-align: center;
  }

  &__image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    object-position: center;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-terrain-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__inner {
      padding: var(--car-inner-padding-x-sm);
    }

    &__content {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    &__title {
      font-size: 28px;
    }

    &__subtitle {
      font-size: 14px;
    }

    &__modes-grid {
      gap: var(--car-stack-gap-sm);
    }

    &__mode {
      min-width: 50px;
    }

    &__mode-icon {
      width: 32px;
      height: 32px;
    }

    &__mode-label {
      font-size: 11px;
    }
  }
}
</style>
