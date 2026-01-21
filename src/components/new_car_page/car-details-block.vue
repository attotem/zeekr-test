<template>
  <section class="car-details-block">
    <div class="car-details-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-details-block__title">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-details-block__grid">
        <template v-for="(group, groupIndex) in groupedItems" :key="groupIndex">
          <!-- Large card -->
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

          <!-- Small cards wrapper -->
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

const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') return textObj
  if (typeof textObj === 'object' && textObj !== null) {
    const lang = langStore.activeLang
    if (lang && textObj[lang]) return textObj[lang]
    if (lang === 'uk' && textObj.ua) return textObj.ua
    if (lang === 'ua' && textObj.uk) return textObj.uk
    if (lang === 'zh' && (textObj.zh || textObj.cn)) return textObj.zh || textObj.cn
    return textObj.uk || textObj.ua || textObj.en || textObj.ru || textObj.zh || textObj.cn || ''
  }
  return ''
}

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
    
    // Add next 2 items as small cards
    if (itemsList[i + 1]) group.small.push(itemsList[i + 1])
    if (itemsList[i + 2]) group.small.push(itemsList[i + 2])
    
    result.push(group)
  }
  
  return result
})
</script>

<style lang="scss" scoped>
.car-details-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 64px 0;
  background: #fff;

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
    margin: 0 0 48px;
    text-align: center;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
  }

  &__card--large {
    width: 100%;
  }

  &__card--small {
    width: 100%;
  }

  &__small-cards-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  &__card-image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
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
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 20px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    margin: 0 0 12px;
  }

  &__card-description {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #666;
    margin: 0;
  }
}

@media screen and (max-width: 876px) {
  .car-details-block {
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
      gap: 16px;
    }

    &__small-cards-wrapper {
      grid-template-columns: 1fr;
      gap: 16px;
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
