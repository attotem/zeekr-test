<template>
  <section class="car-strength-block">
    <div class="car-strength-block__image-wrap">
      <img
        :src="resolveImage(blockData.image)"
        :alt="getText(blockData.title)"
        class="car-strength-block__image"
        loading="lazy"
      />
      <div class="car-strength-block__overlay">
        <div class="car-strength-block__content">
          <h2 v-if="getText(blockData.title)" class="car-strength-block__title">
            {{ getText(blockData.title) }}
          </h2>
          <div class="car-strength-block__divider"></div>
          <div v-if="blockData.specs" class="car-strength-block__specs">
            <div 
              v-for="(spec, index) in blockData.specs" 
              :key="index"
              class="car-strength-block__spec"
            >
              <div class="car-strength-block__spec-value">{{ spec.value }}</div>
              <div class="car-strength-block__spec-label">{{ getText(spec.label) }}</div>
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
</script>

<style lang="scss" scoped>
.car-strength-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  position: relative;

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

  &__overlay {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 40px;
  }

  &__content {
    display: var(--car-stack-column);
    flex-direction: var(--car-stack-direction);
    gap: var(--car-stack-gap-lg);
    max-width: 400px;
  }

  &__title {
    font-family: var(--car-font-heading);
    font-size: 36px;
    line-height: 1.3;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }

  &__divider {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }

  &__specs {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__spec {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__spec-value {
    font-family: var(--car-font-heading);
    font-size: 42px;
    line-height: 1.2;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.95);
  }

  &__spec-label {
    font-family: var(--car-font-body);
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.7);
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-strength-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);

    &__overlay {
      width: 100%;
      padding: 24px;
      background: linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
    }

    &__content {
      gap: var(--car-stack-gap-sm);
    }

    &__title {
      font-size: 24px;
    }

    &__specs {
      gap: 20px;
    }

    &__spec-value {
      font-size: 28px;
    }

    &__spec-label {
      font-size: 12px;
    }
  }
}
</style>
