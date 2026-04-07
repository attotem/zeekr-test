<template>
  <section class="car-performance-block">
    <div class="car-performance-block__inner">
      <div class="car-performance-block__row car-performance-block__row--image-left">
        <div class="car-performance-block__image-wrap">
          <img
            :src="resolveImage(blockData.image1)"
            :alt="getText(blockData.version1?.title)"
            class="car-performance-block__image"
            loading="lazy"
          />
        </div>
        <div class="car-performance-block__content">
          <h3 v-if="getText(blockData.version1?.title)" class="car-performance-block__title">
            {{ getText(blockData.version1.title) }}
          </h3>
          <div class="car-performance-block__divider"></div>
          <div v-if="blockData.version1?.specs" class="car-performance-block__specs">
            <div
              v-for="(spec, index) in blockData.version1.specs"
              :key="index"
              class="car-performance-block__spec"
            >
              <div class="car-performance-block__spec-value">{{ spec.value }}</div>
              <div class="car-performance-block__spec-label">{{ getText(spec.label) }}</div>
            </div>
          </div>
          <p v-if="getText(blockData.version1?.note)" class="car-performance-block__note">
            {{ getText(blockData.version1.note) }}
          </p>
        </div>
      </div>

      <div class="car-performance-block__row car-performance-block__row--text-left">
        <div class="car-performance-block__content">
          <h3 v-if="getText(blockData.version2?.title)" class="car-performance-block__title">
            {{ getText(blockData.version2.title) }}
          </h3>
          <div class="car-performance-block__divider"></div>
          <div v-if="blockData.version2?.specs" class="car-performance-block__specs">
            <div
              v-for="(spec, index) in blockData.version2.specs"
              :key="index"
              class="car-performance-block__spec"
            >
              <div class="car-performance-block__spec-value">{{ spec.value }}</div>
              <div class="car-performance-block__spec-label">{{ getText(spec.label) }}</div>
            </div>
          </div>
          <p v-if="getText(blockData.version2?.note)" class="car-performance-block__note">
            {{ getText(blockData.version2.note) }}
          </p>
        </div>
        <div class="car-performance-block__image-wrap">
          <img
            :src="resolveImage(blockData.image2)"
            :alt="getText(blockData.version2?.title)"
            class="car-performance-block__image"
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

const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })

const preloadAllImages = () => {
  const images = [blockData.value.image1, blockData.value.image2].filter(Boolean)
  
  images.forEach(image => {
    if (!image) return

    const imgSrc = resolveImage(image)
    if (!imgSrc) return
    
    const img = new Image()
    img.onerror = () => {
      console.warn(`Failed to preload performance image: ${imgSrc}`)
    }
    img.src = imgSrc
  })
}

watch(() => [blockData.value.image1, blockData.value.image2], ([img1, img2]) => {
  if (img1 || img2) {
    preloadAllImages()
  }
}, { immediate: true })

onMounted(() => {
  preloadAllImages()
})
</script>

<style lang="scss" scoped>
.car-performance-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  background: #fff;

  &__inner {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: var(--car-inner-padding-x);
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    min-height: 500px;

    &--image-left {
      .car-performance-block__image-wrap {
        order: 1;
      }
      .car-performance-block__content {
        order: 2;
      }
    }

    &--text-left {
      .car-performance-block__content {
        order: 1;
      }
      .car-performance-block__image-wrap {
        order: 2;
      }
    }
  }

  &__image-wrap {
    width: 100%;
    height: 100%;
    min-height: 500px;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__content {
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    position: relative;
  }

  &__title {
    font-family: var(--car-font-heading);
    font-size: 28px;
    line-height: 1.3;
    font-weight: 400;
    color: var(--car-text-primary);
    margin: 0;
  }

  &__specs {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__spec {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__spec-value {
    font-family: var(--car-font-heading);
    font-size: 40px;
    line-height: 1.2;
    font-weight: 400;
    color: var(--car-text-primary);
  }

  &__spec-label {
    font-family: var(--car-font-body);
    font-size: 14px;
    line-height: 1.5;
    color: var(--car-text-muted);
  }

  &__note {
    font-family: var(--car-font-body);
    font-size: 11px;
    line-height: 1.6;
    color: var(--car-text-muted);
    margin: 0;
  }

  &__divider {
    width: 100%;
    height: 1px;
    background: rgba(17, 17, 17, 0.1);
    margin: 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: rgba(17, 17, 17, 0.1);
      border-radius: 50%;
    }
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-performance-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);

    &__inner {
      padding: 0;
    }

    &__row {
      grid-template-columns: 1fr;
      gap: 32px;
      min-height: auto;

      &--image-left {
        .car-performance-block__image-wrap {
          order: 1;
        }
        .car-performance-block__content {
          order: 2;
        }
      }

      &--text-left {
        .car-performance-block__content {
          order: 1;
        }
        .car-performance-block__image-wrap {
          order: 2;
        }
      }
    }

    &__image-wrap {
      min-height: 300px;
    }

    &__content {
      padding: 32px 0;
      gap: 24px;
    }

    &__title {
      font-size: 22px;
    }

    &__spec-value {
      font-size: 32px;
    }

    &__spec-label {
      font-size: 13px;
    }

    &__divider {
      margin: 40px 0;
    }
  }
}
</style>
