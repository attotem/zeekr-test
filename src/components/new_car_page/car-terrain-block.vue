<template>
  <section class="car-terrain-block">
    <div class="car-terrain-block__inner">
      <div class="car-terrain-block__content">
        <!-- Text section -->
        <div class="car-terrain-block__text">
          <h2 v-if="getText(blockData.title)" class="car-terrain-block__title">
            {{ getText(blockData.title) }}
          </h2>
          <p v-if="getText(blockData.subtitle)" class="car-terrain-block__subtitle">
            {{ getText(blockData.subtitle) }}
          </p>
          
          <!-- Standard modes -->
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
          
          <!-- Adaptive modes -->
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

        <!-- Image section -->
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
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}

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
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 60px 0;
  background: #fff;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 48px;
    align-items: center;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 42px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    margin: 0;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #666;
    margin: 0;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e5e5;
  }

  &__modes {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__modes-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.4;
    font-weight: 400;
    color: #111;
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
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: #666;
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

@media screen and (max-width: 876px) {
  .car-terrain-block {
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

    &__title {
      font-size: 28px;
    }

    &__subtitle {
      font-size: 14px;
    }

    &__modes-grid {
      gap: 16px;
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
