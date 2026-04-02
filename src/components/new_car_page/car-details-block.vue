<template>
  <section class="car-details-block">
    <div class="car-details-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-details-block__title car-section-title car-section-title--center">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-details-block__grid">
        <template v-for="(group, groupIndex) in groupedItems" :key="groupIndex">
          <div v-if="group.large" class="car-details-block__card car-details-block__card--large">
            <div class="car-details-block__card-image-wrap">
              <img
                :src="resolveImage(group.large.image)"
                :alt="getText(group.large.title)"
                class="car-details-block__card-image"
                loading="lazy"
              />
            </div>
            <div v-if="getText(group.large.title) || getText(group.large.description)" class="car-details-block__card-content">
              <h3 v-if="getText(group.large.title)" class="car-details-block__card-title">
                {{ getText(group.large.title) }}
              </h3>
              <p v-if="getText(group.large.description)" class="car-details-block__card-description">
                {{ getText(group.large.description) }}
              </p>
            </div>
          </div>

          <div v-if="group.small && group.small.length > 0" class="car-details-block__small-cards-wrapper">
            <div
              v-for="(item, itemIndex) in group.small"
              :key="itemIndex"
              class="car-details-block__card car-details-block__card--small"
            >
              <div class="car-details-block__card-image-wrap">
                <img
                  :src="resolveImage(item.image)"
                  :alt="getText(item.title)"
                  class="car-details-block__card-image"
                  loading="lazy"
                />
              </div>
              <div v-if="getText(item.title) || getText(item.description)" class="car-details-block__card-content">
                <h3 v-if="getText(item.title)" class="car-details-block__card-title">
                  {{ getText(item.title) }}
                </h3>
                <p v-if="getText(item.description)" class="car-details-block__card-description">
                  {{ getText(item.description) }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'

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
    return `/src/assets/pages/${props.carId}/details/${imagePath}`
  }
  return `/pages/${props.carId}/details/${imagePath}`
}

const items = computed(() => {
  return blockData.value.items || []
})

const groupedItems = computed(() => {
  const result = []
  const itemsList = items.value
  
  for (let i = 0; i < itemsList.length; i += 3) {
    const group = {
      large: itemsList[i] || null,
      small: []
    }

    if (itemsList[i + 1]) group.small.push(itemsList[i + 1])
    if (itemsList[i + 2]) group.small.push(itemsList[i + 2])
    
    result.push(group)
  }
  
  return result
})
</script>

<style lang="scss" scoped>
.car-details-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  padding: 64px 0;
  background: #fff;

  &__inner {
    width: var(--car-inner-width);
    max-width: var(--car-inner-max-width);
    margin: var(--car-inner-margin);
    padding: var(--car-inner-padding-x);
  }

  &__title {
        color: var(--car-title-color);
    margin: 0 0 48px;
    text-align: center;
  }

  &__grid {
    display: var(--car-stack-column);
    flex-direction: var(--car-stack-direction);
    gap: var(--car-stack-gap-lg);
  }

  &__card {
    display: var(--car-stack-column);
    flex-direction: var(--car-stack-direction);
    overflow: var(--car-card-overflow);
    background: #fff;
  }

  &__card--large {
    width: var(--car-card-width);
  }

  &__card--small {
    width: var(--car-card-width);
  }

  &__small-cards-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  &__card-image-wrap {
    width: var(--car-card-width);
    position: relative;
    overflow: var(--car-card-overflow);
    background: var(--car-card-media-bg);
    min-height: 300px;
  }

  &__card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__card-content {
    padding: 12px 0;
  }

  &__card-title {
        font-size: 20px;
    line-height: 1.3;
    font-weight: 400;
    color: var(--car-text-primary);
    margin: 0 0 12px;
  }

  &__card-description {
    font-family: var(--car-font-body);
    font-size: 14px;
    line-height: 1.6;
    color: var(--car-text-muted);
    margin: 0;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-details-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__inner {
      padding: var(--car-inner-padding-x-sm);
    }

    &__title {
      margin-bottom: 32px;
    }

    &__grid {
      gap: var(--car-stack-gap-sm);
    }

    &__small-cards-wrapper {
      grid-template-columns: 1fr;
      gap: var(--car-stack-gap-sm);
    }

    &__card-image-wrap {
      min-height: 250px;
    }

    &__card-content {
      padding: 20px;
    }

    &__card-title {
      font-size: 18px;
      margin-bottom: 8px;
    }

    &__card-description {
      font-size: 13px;
    }
  }
}
</style>
