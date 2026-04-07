<template>
  <section class="car-image-caption-block">
    <div class="car-image-caption-block__inner">
      <div class="car-image-caption-block__image-wrap">
        <img
          :src="resolveImage(blockData.image)"
          :alt="getText(blockData.caption)"
          class="car-image-caption-block__image"
          loading="lazy"
        />
      </div>
      <div v-if="getText(blockData.caption)" class="car-image-caption-block__caption">
        {{ getText(blockData.caption) }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'
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

const resolveImage = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}

const preloadImage = () => {
  const imagePath = blockData.value.image
  if (!imagePath) return
  
  const imgSrc = resolveImage(imagePath)
  if (!imgSrc) return

  preloadImageUtil(imgSrc)
}


watch(() => blockData.value.image, (newImage) => {
  if (newImage) {
    preloadImage()
  }
}, { immediate: true })

onMounted(() => {
  preloadImage()
})
</script>

<style lang="scss" scoped>
.car-image-caption-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  background: #fff;

  &__inner {
    width: 100%;
    margin: 0 auto;
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
    object-fit: contain;
    object-position: center;
  }

  &__caption {
    font-family: var(--car-font-body);
    font-size: 14px;
    line-height: 1.6;
    color: var(--car-text-muted);
    margin-top: 10px;
    text-align: left;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-image-caption-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__inner {
      padding: var(--car-inner-padding-x-sm);
    }

    &__caption {
      font-size: 12px;
      margin-top: 16px;
    }
  }
}
</style>
