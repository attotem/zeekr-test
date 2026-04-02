<template>
  <section class="car-image-text-block">
    <div class="car-image-text-block__inner">
      <div
        class="car-image-text-block__content"
        :class="{ 'car-image-text-block__content--reverse': blockData.textRight }"
      >
        <div class="car-image-text-block__text">
          <h2 v-if="getText(blockData.title)" class="car-image-text-block__title car-section-title car-section-title--center">
            {{ getText(blockData.title) }}
          </h2>
          <div v-if="blockData.features" class="car-image-text-block__features">
            <div
              v-for="(feature, index) in blockData.features"
              :key="index"
              class="car-image-text-block__feature"
            >
              <div class="car-image-text-block__feature-text">{{ getText(feature) }}</div>
            </div>
          </div>
        </div>

        <div class="car-image-text-block__image-wrap">
          <img
            :src="resolveImage(blockData.image)"
            :alt="getText(blockData.title)"
            class="car-image-text-block__image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'
import { resolveMediaPath } from '@/utils/resolveMedia'
import { preloadImage as preloadImageUtil } from '@/utils/preloadImage'

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

const resolveImage = (image) =>
  resolveMediaPath(image, { carId: props.carId })

const preloadImage = () => {
  const image = blockData.value.image
  if (!image) return

  const imgSrc = resolveImage(image)
  if (!imgSrc) return

  preloadImageUtil(imgSrc)
}

watch(
  () => blockData.value.image,
  (newImage) => {
    if (newImage) {
      preloadImage()
    }
  },
  { immediate: true }
)

onMounted(() => {
  preloadImage()
})
</script>

<style lang="scss" scoped>
.car-image-text-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  padding: 32px 0;
  background: #fff;

  &__inner {
    width: var(--car-inner-width);
    max-width: var(--car-inner-max-width);
    margin: var(--car-inner-margin);
    padding: var(--car-inner-padding-x);
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 48px;
    align-items: center;

    &--reverse {
      grid-template-columns: 2fr 1fr;
      
      .car-image-text-block__text {
        order: 2;
      }
      
      .car-image-text-block__image-wrap {
        order: 1;
      }
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__title {
        color: var(--car-title-color);
    margin: 0;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: var(--car-stack-gap-sm);
  }

  &__feature {
    display: flex;
    align-items: center;
  }

  &__feature-text {
    font-family: var(--car-font-body);
    font-size: 18px;
    line-height: 1.6;
    color: var(--car-text-secondary);
  }

  &__image-wrap {
    width: var(--car-card-width);
    position: relative;
    overflow: var(--car-card-overflow);
    background: var(--car-card-media-bg);
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
  .car-image-text-block {
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

    &__text {
      gap: 24px;
    }

    &__title {
    }

    &__feature-text {
      font-size: 16px;
    }
  }
}
</style>
