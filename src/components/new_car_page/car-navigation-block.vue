<template>
  <section class="car-navigation-block">
    <!-- Background image -->
    <div
      class="car-navigation-block__image"
      :style="{ backgroundImage: `url(${getImageSrc})` }"
    ></div>

    <!-- Dark overlay -->
    <div class="car-navigation-block__overlay"></div>

    <!-- Content -->
    <div class="car-navigation-block__content">
      <!-- Bottom section: Specs -->
      <div class="car-navigation-block__specs">
        <div
          v-for="(spec, index) in blockData.specs"
          :key="index"
          class="car-navigation-block__spec"
        >
          <div class="car-navigation-block__spec-value">{{ spec.value }}</div>
          <div class="car-navigation-block__spec-label">{{ getText(spec.label) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const resolveImagePath = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}

const getImageSrc = computed(() => {
  // Use image from data if available
  if (blockData.value.image?.desktop) {
    return resolveImagePath(blockData.value.image.desktop)
  }
  if (blockData.value.image?.tablet) {
    return resolveImagePath(blockData.value.image.tablet)
  }
  if (blockData.value.image?.mobile) {
    return resolveImagePath(blockData.value.image.mobile)
  }
  // If image is a string, resolve it
  if (typeof blockData.value.image === 'string') {
    return resolveImagePath(blockData.value.image)
  }
  // Fallback - return empty string if no image specified
  return ''
})

// Функция для получения текста в зависимости от языка
const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') {
    return textObj
  }
  if (typeof textObj === 'object' && textObj !== null) {
    return textObj[langStore.activeLang] || textObj.ua || textObj.en || ''
  }
  return ''
}
</script>

<style lang="scss" scoped>
.car-navigation-block {
  position: relative;
  width: calc(100% - 40px);
  min-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0 20px;

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }

  &__content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    min-height: 95vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 80px 76px;
    max-width: 1920px;
    margin: 0 auto;
  }

  &__specs {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
    width: 100%;
  }

  &__spec {
    text-align: center;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &__spec-value {
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 8px;
  }

  &__spec-label {
    color: #fff;
    font-size: 14px;
    opacity: 0.8;
    font-style: normal;
    font-weight: 400;
  }
}

@media screen and (max-width: 876px) {
  .car-navigation-block {
    width: calc(100% - 32px);
    margin: 0 16px;

    &__content {
      padding: 28px 16px;
      min-height: 95vh;
    }

    &__specs {
      gap: 16px;
      flex-wrap: wrap;
    }

    &__spec {
      &:not(:last-child)::after {
        display: none;
      }
    }

    &__spec-value {
      font-size: 18px;
    }

    &__spec-label {
      font-size: 12px;
    }
  }
}
</style>
