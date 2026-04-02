<template>
  <section class="car-battery-safety-block" :style="{ background: blockData.background || '#fff' }">
    <div class="car-battery-safety-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-battery-safety-block__title car-section-title car-section-title--center">
        {{ getText(blockData.title) }}
      </h2>

      <div class="car-battery-safety-block__media-wrap">
        <img
          v-if="!isVideo(blockData.image)"
          :src="resolveMedia(blockData.image)"
          :alt="getText(blockData.title)"
          class="car-battery-safety-block__media"
          loading="lazy"
        />
        <video
          v-else
          :src="resolveMedia(blockData.image)"
          class="car-battery-safety-block__media"
          muted
          loop
          playsinline
          autoplay
        />
      </div>

      <div v-if="stats.length" class="car-battery-safety-block__stats">
        <div v-for="(s, idx) in stats" :key="idx" class="car-battery-safety-block__stat">
          <div class="car-battery-safety-block__value">{{ s.value }}</div>
          <div class="car-battery-safety-block__label">{{ getText(s.label) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'
import { resolveMediaPath, pickResponsivePath } from '@/utils/resolveMedia'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '7x' }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

const resolveMedia = (media) => resolveMediaPath(media, { carId: props.carId })

const isVideo = (media) => {
  const path = pickResponsivePath(media)
  if (!path || typeof path !== 'string') return false
  return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')
}

const stats = computed(() => {
  if (Array.isArray(blockData.value.stats)) return blockData.value.stats
  return []
})
</script>

<style lang="scss" scoped>
.car-battery-safety-block {
  width: 100%;
  margin: 0;
  padding: var(--car-section-padding-y);
  background: #fff;

  &__inner {
    width: var(--car-section-width);
    max-width: var(--car-inner-max-width);
    margin: 0 auto;
    padding: var(--car-inner-padding-x);
  }

  &__title {
        color: var(--car-title-color);
    text-align: center;
    margin: 0 0 36px 0;
  }

  &__media-wrap {
    width: 100%;
    background: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }

  &__media {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }

  &__stats {
    display: flex;
    justify-content: center;
    gap: 80px;
    padding: 34px 0 0;
    flex-wrap: wrap;
  }

  &__stat {
    text-align: center;
    min-width: 180px;
  }

  &__value {
        font-size: 44px;
    line-height: 1.1;
    font-weight: 400;
    color: var(--car-text-primary);
    margin-bottom: 8px;
  }

  &__label {
    font-family: var(--car-font-body);
    font-size: 14px;
    line-height: 1.4;
    color: var(--car-text-muted-06);
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-battery-safety-block {
    padding: var(--car-section-padding-y-sm);

    &__inner {
      width: var(--car-section-width-sm);
      padding: var(--car-inner-padding-x-sm);
    }

    &__title {
      margin-bottom: 26px;
    }

    &__stats {
      gap: 32px;
    }

    &__value {
      font-size: 34px;
    }
  }
}
</style>

