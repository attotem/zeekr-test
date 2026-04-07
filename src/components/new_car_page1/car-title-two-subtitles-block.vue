<template>
  <section class="car-title-two-subtitles-block">
    <div class="car-title-two-subtitles-block__wrap">
      <img
        :src="resolveImage(blockData.image)"
        :alt="getText(blockData.title)"
        class="car-title-two-subtitles-block__image"
        loading="lazy"
      />
      <div class="car-title-two-subtitles-block__content">
        <h2 v-if="getText(blockData.title)" class="car-title-two-subtitles-block__title">
          {{ getText(blockData.title) }}
        </h2>
        <div v-if="hasSubtitles" class="car-title-two-subtitles-block__subtitles">
          <span v-if="getText(blockData.subtitleLeft)" class="car-title-two-subtitles-block__subtitle">
            {{ getText(blockData.subtitleLeft) }}
          </span>
          <span class="car-title-two-subtitles-block__divider" aria-hidden="true"></span>
          <span v-if="getText(blockData.subtitleRight)" class="car-title-two-subtitles-block__subtitle">
            {{ getText(blockData.subtitleRight) }}
          </span>
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

const hasSubtitles = computed(() => {
  return !!(getText(blockData.value.subtitleLeft) || getText(blockData.value.subtitleRight))
})

const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })
</script>

<style lang="scss" scoped>
.car-title-two-subtitles-block {
  width: 100%;
  padding: 40px 20px;

  &__wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    position: absolute;
    inset: 0;
  }

  &__content {
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    padding: var(--car-inner-padding-x);
    text-align: center;
    z-index: 2;
    color: var(--car-text-primary);
  }

  &__title {
    font-family: var(--car-font-heading);
    font-size: 44px;
    line-height: 1.25;
    font-weight: 400;
    margin: 0 0 18px 0;
  }

  &__subtitles {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    font-family: var(--car-font-body);
    font-size: 14px;
    line-height: 1.5;
    color: rgba(17, 17, 17, 0.9);
  }

  &__divider {
    width: 1px;
    height: 14px;
    background: rgba(17, 17, 17, 0.35);
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-title-two-subtitles-block {
    &__wrap {
      min-height: 48vh;
    }

    &__content {
      top: 36px;
      padding: var(--car-inner-padding-x-sm);
    }

    &__title {
      font-size: 28px;
      margin-bottom: 12px;
    }

    &__subtitles {
      gap: 14px;
      font-size: 12px;
    }

    &__divider {
      height: 12px;
    }
  }
}
</style>

