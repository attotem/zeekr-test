<template>
  <section class="car-image-text-bottom-block">
    <div class="car-image-text-bottom-block__image-wrap">
      <img
        :src="resolveImage(blockData.image)"
        :alt="getText(blockData.title)"
        class="car-image-text-bottom-block__image"
        loading="lazy"
      />
      <div class="car-image-text-bottom-block__overlay"></div>
      <div class="car-image-text-bottom-block__text">
        <h2 v-if="getText(blockData.title)" class="car-image-text-bottom-block__title">
          {{ getText(blockData.title) }}
        </h2>
        <p v-if="getText(blockData.subtitle)" class="car-image-text-bottom-block__subtitle">
          {{ getText(blockData.subtitle) }}
        </p>
        <div v-if="blockData.features && blockData.features.length" class="car-image-text-bottom-block__features">
          <div
            v-for="(feature, index) in blockData.features"
            :key="index"
            class="car-image-text-bottom-block__feature"
          >
            <div class="car-image-text-bottom-block__feature-text">{{ getText(feature) }}</div>
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
    default: '7x'
  }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

const resolveImage = (media) => resolveMediaPath(media, { carId: props.carId })
</script>

<style lang="scss" scoped>
.car-image-text-bottom-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  position: relative;

  &__image-wrap {
    width: 100%;
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  &__text {
    position: relative;
    z-index: 2;
    display: var(--car-stack-column);
    flex-direction: var(--car-stack-direction);
    gap: var(--car-stack-gap-lg);
    padding: 40px;
    max-width: var(--car-inner-max-width);
    margin: 0 auto;
    width: 100%;
    text-align: center;
  }

  &__title {
    font-family: var(--car-font-heading);
    font-size: var(--car-title-size-xl);
    line-height: 1.3;
    font-weight: 400;
    color: #fff;
    margin: 0;
  }

  &__subtitle {
    font-family: var(--car-font-body);
    font-size: 18px;
    line-height: 1.6;
    color: #fff;
    margin: 0;
    opacity: 0.9;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: var(--car-stack-gap-sm);
    align-items: center;
  }

  &__feature {
    display: flex;
    align-items: center;
  }

  &__feature-text {
    font-family: var(--car-font-body);
    font-size: 18px;
    line-height: 1.6;
    color: #fff;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-image-text-bottom-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);

    &__image-wrap {
      min-height: 40vh;
    }

    &__text {
      padding: 30px 16px;
      gap: 20px;
    }

    &__title {
      font-size: 32px;
    }

    &__subtitle {
      font-size: 16px;
    }

    &__feature-text {
      font-size: 16px;
    }
  }
}
</style>
