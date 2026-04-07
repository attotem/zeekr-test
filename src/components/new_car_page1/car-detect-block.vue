<template>
  <section class="car-detect-block">
    <div class="car-detect-block__image-wrap">
      <img
        :src="resolveImage(blockData.image)"
        :alt="getText(blockData.title)"
        class="car-detect-block__image"
        loading="lazy"
      />
      <div class="car-detect-block__overlay">
        <div class="car-detect-block__content">
          <h2 v-if="getText(blockData.title)" class="car-detect-block__title">
            {{ getText(blockData.title) }}
          </h2>
          <div class="car-detect-block__divider"></div>
          <div v-if="getText(blockData.subtitle)" class="car-detect-block__subtitle">
            {{ getText(blockData.subtitle) }}
          </div>
          <div v-if="blockData.specs" class="car-detect-block__specs">
            <div 
              v-for="(spec, index) in blockData.specs" 
              :key="index"
              class="car-detect-block__spec"
            >
              <div class="car-detect-block__spec-value">{{ spec.value }}</div>
              <div class="car-detect-block__spec-label">{{ getText(spec.label) }}</div>
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
.car-detect-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  padding: var(--car-section-padding-y);
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
    left: 0;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 60px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 400px;
  }

  &__title {
    font-family: var(--car-font-heading);
    font-size: 36px;
    line-height: 1.3;
    font-weight: 400;
    color: var(--car-text-primary);
    margin: 0;
  }

  &__divider {
    width: 100%;
    max-width: 300px;
    height: 1px;
    background: rgba(0, 0, 0, 0.2);
  }

  &__subtitle {
    font-family: var(--car-font-body);
    font-size: 16px;
    line-height: 1.5;
    color: var(--car-text-secondary);
  }

  &__specs {
    display: flex;
    flex-direction: row;
    gap: 40px;
  }

  &__spec {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__spec-value {
    font-family: var(--car-font-heading);
    font-size: 32px;
    line-height: 1.2;
    font-weight: 400;
    color: var(--car-text-primary);
  }

  &__spec-label {
    font-family: var(--car-font-body);
    font-size: 12px;
    line-height: 1.5;
    color: var(--car-text-muted);
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-detect-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__overlay {
      width: 100%;
      padding: 24px;
      background: linear-gradient(to right, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 70%, transparent 100%);
    }

    &__content {
      gap: 12px;
    }

    &__title {
      font-size: 22px;
    }

    &__subtitle {
      font-size: 13px;
    }

    &__specs {
      gap: 24px;
    }

    &__spec-value {
      font-size: 22px;
    }

    &__spec-label {
      font-size: 11px;
    }
  }
}
</style>
