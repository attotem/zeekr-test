<template>
  <section class="car-luxury-block">
    <div class="car-luxury-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-luxury-block__title">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-luxury-block__grid">
        <div
          v-if="items[0]"
          class="car-luxury-block__item"
        >
          <div class="car-luxury-block__image-wrap">
            <img
              :src="resolveImage(items[0].image)"
              :alt="getText(items[0].title)"
              class="car-luxury-block__image"
              loading="lazy"
            />
          </div>
          <div class="car-luxury-block__content">
            <h3 v-if="getText(items[0].title)" class="car-luxury-block__item-title">
              {{ getText(items[0].title) }}
            </h3>
            <p v-if="getText(items[0].description)" class="car-luxury-block__description">
              {{ getText(items[0].description) }}
            </p>
          </div>
        </div>
        <div class="car-luxury-block__right-column">
          <div
            v-if="items[1]"
            class="car-luxury-block__item"
          >
            <div class="car-luxury-block__image-wrap">
              <img
                :src="resolveImage(items[1].image)"
                :alt="getText(items[1].title)"
                class="car-luxury-block__image"
                loading="lazy"
              />
            </div>
            <div class="car-luxury-block__content">
              <h3 v-if="getText(items[1].title)" class="car-luxury-block__item-title">
                {{ getText(items[1].title) }}
              </h3>
              <p v-if="getText(items[1].description)" class="car-luxury-block__description">
                {{ getText(items[1].description) }}
              </p>
            </div>
          </div>
          <div
            v-if="items[2]"
            class="car-luxury-block__item"
          >
            <div class="car-luxury-block__image-wrap">
              <img
                :src="resolveImage(items[2].image)"
                :alt="getText(items[2].title)"
                class="car-luxury-block__image"
                loading="lazy"
              />
            </div>
            <div class="car-luxury-block__content">
              <h3 v-if="getText(items[2].title)" class="car-luxury-block__item-title">
                {{ getText(items[2].title) }}
              </h3>
              <p v-if="getText(items[2].description)" class="car-luxury-block__description">
                {{ getText(items[2].description) }}
              </p>
            </div>
          </div>
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

const items = computed(() => {
  if (blockData.value.items && Array.isArray(blockData.value.items)) {
    return blockData.value.items
  }
  return []
})


const preloadAllImages = () => {
  if (!items.value || items.value.length === 0) return
  
  items.value.forEach(item => {
    if (!item || !item.image) return
    
    const imgSrc = resolveImage(item.image)
    if (!imgSrc) return
    
    const img = new Image()
    img.onerror = () => {
      console.warn(`Failed to preload luxury image: ${imgSrc}`)
    }
    img.src = imgSrc
  })
}

watch(items, (newItems) => {
  if (newItems && newItems.length > 0) {
    preloadAllImages()
  }
}, { immediate: true })

onMounted(() => {
  preloadAllImages()
})
</script>

<style lang="scss" scoped>
.car-luxury-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  background: #fff;
  padding: 60px 0;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    text-align: center;
    margin: 0 0 48px 0;
  }

  &__grid {
    display: flex;
    align-items: stretch;
    gap: 32px;
    justify-content: center;
  }

  &__item {
    display: flex;
    flex-direction: column;
    background: transparent;
    overflow: hidden;
  }

  &__grid > &__item {
    width: 45%;
    flex-shrink: 0;
  }

  &__right-column {
    display: flex;
    flex-direction: column;
    width: 45%;
    flex-shrink: 0;
  }

  &__image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__grid > &__item &__image-wrap {
    flex: 1;
    min-height: 0;
  }



  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__content {
    padding: 14px 0px;
  }

  &__item-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 20px;
    line-height: 1.4;
    font-weight: 400;
    color: #111;
    margin: 0 0 6px 0;
  }

  &__description {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #666;
    margin: 0;
  }
}

@media screen and (max-width: 876px) {
  .car-luxury-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__title {
      font-size: 32px;
      margin-bottom: 32px;
    }

    &__grid {
      flex-direction: column;
      gap: 24px;
    }

    &__item {
      width: 100% !important;
    }

    &__right-column {
      width: 100%;
    }

    &__content {
      padding: 14px 0px;
    }

    &__item-title {
      font-size: 18px;
      margin-bottom: 6px;
    }

    &__description {
      font-size: 13px;
    }
  }
}
</style>
