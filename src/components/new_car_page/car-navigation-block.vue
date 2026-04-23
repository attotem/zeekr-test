<template>
  <section class="car-navigation-block">
    <!-- Background image -->
    <div
      class="car-navigation-block__image"
      :style="{ backgroundImage: `url(${getImageSrc})` }"
    ></div>

    <!-- Dark overlay -->
    <div
      class="car-navigation-block__overlay"
      :class="{ 'car-navigation-block__overlay--hidden-mobile': mobileTextBelow }"
    ></div>

    <!-- Content -->
    <div
      class="car-navigation-block__content"
      :class="{ 'car-navigation-block__content--mobile-below': mobileTextBelow }"
    >
      <!-- Bottom section: Specs -->
      <div class="car-navigation-block__specs">
        <div
          v-for="(spec, index) in blockData.specs"
          :key="index"
          class="car-navigation-block__spec"
        >
          <div class="car-navigation-block__spec-value">{{ getText(spec.value) }}</div>
          <div class="car-navigation-block__spec-label">{{ getText(spec.label) }}</div>
        </div>
      </div>
    </div>


  </section>

  <div
      v-if="mobileTextBelow"
      class="car-navigation-block__mobile-bottom"
    >
        <div
          v-for="(spec, index) in blockData.specs"
          :key="`mobile-${index}`"
          class="car-navigation-block__spec"
        >
          <div class="car-navigation-block__spec-value">{{ getText(spec.value) }}</div>
          <div class="car-navigation-block__spec-label">{{ getText(spec.label) }}</div>
      </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
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
const mobileTextBelow = computed(() => blockData.value.mobileTextBelow === true)

const getImageSrc = computed(() => {
  return resolveMediaPath(blockData.value.image, { carId: props.carId })
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

  &__mobile-bottom {
    display: none;
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
    min-height: 80vh;


    &__content {
      padding: 40px 20px;
      min-height: 80vh;
    }

    &__content--mobile-below {
      min-height: 80vh;
      justify-content: flex-end;
      padding-bottom: 0;
    }

    &__overlay--hidden-mobile {
      display: none;
    }

    &__mobile-bottom {
      display: block;
      background: #efefee;
      padding: 18px 16px 24px;
    }

    &__specs {
      gap: 16px;
      flex-wrap: wrap;
      display: none;
    }

    &__specs--mobile-below {
      justify-content: flex-start;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 16px;
    }

    &__spec {
      &:not(:last-child)::after {
        display: none;
      }
      text-align: left;
    }

    &__spec-value {
      font-size: 24px;
      color: #111;
      margin-bottom: 6px;
      font-weight: 400;
    }

    &__spec-label {
      font-size: 16px;
      color: #4a4a4a;
      opacity: 1;
    }
  }
}
</style>
