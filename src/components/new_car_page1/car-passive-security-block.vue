<template>
  <section class="car-passive-security-block" :style="{ background: blockData.background || 'rgb(245, 246, 247)' }">
    <div class="car-passive-security-block__inner">
      <div class="car-passive-security-block__grid">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="car-passive-security-block__item"
          :class="`car-passive-security-block__item--${index + 1}`"
        >
          <div class="car-passive-security-block__media">
            <img
              :src="resolveMedia(item.image)"
              :alt="getText(item.title)"
              class="car-passive-security-block__image"
              loading="lazy"
            />
          </div>
          <div
            v-if="getText(item.title)"
            class="car-passive-security-block__label"
          >
            {{ getText(item.title) }}
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
  data: { type: Object, required: true },
  carId: { type: String, default: '7x' }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

const resolveMedia = (media) => resolveMediaPath(media, { carId: props.carId })

const items = computed(() => {
  
  if (Array.isArray(blockData.value.items)) return blockData.value.items
  if (Array.isArray(blockData.value.materials)) return blockData.value.materials
  return []
})
</script>

<style lang="scss" scoped>
.car-passive-security-block {
  width: 100%;
  margin: 0;
  padding: var(--car-section-padding-y);
  background: rgb(245, 246, 247);

  &__inner {
    width: var(--car-section-width);
    max-width: var(--car-inner-max-width);
    margin: 0 auto;
    padding: var(--car-inner-padding-x);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  &__item--1 {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  &__item--2 {
    grid-column: 2;
    grid-row: 1;
  }

  &__item--3 {
    grid-column: 2;
    grid-row: 2;
  }

  &__item--4 {
    grid-column: 1;
    grid-row: 3;
  }

  &__item--5 {
    grid-column: 2;
    grid-row: 3;
  }

  &__media {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.02);
    aspect-ratio: 16 / 9;
  }

  &__item--1 &__media {
    aspect-ratio: 1 / 1;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__label {
    margin-top: 12px;
    font-family: var(--car-font-body);
    font-size: 16px;
    line-height: 1.4;
    color: var(--car-text-muted-092);
    font-weight: 600;
    max-width: 100%;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-passive-security-block {
    padding: var(--car-section-padding-y-sm);

    &__inner {
      width: var(--car-section-width-sm);
      padding: var(--car-inner-padding-x-sm);
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    &__item--1,
    &__item--2,
    &__item--3,
    &__item--4,
    &__item--5 {
      grid-column: auto;
      grid-row: auto;
    }

    &__media {
      aspect-ratio: 16 / 9;
    }

    &__label {
      margin-top: 10px;
      font-size: 14px;
    }
  }
}
</style>

