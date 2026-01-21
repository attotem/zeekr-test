<template>
  <section class="car-cards-block">
    <div class="car-cards-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-cards-block__title">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-cards-block__grid">
        <!-- Large card (top) -->
        <div v-if="cards[0]" class="car-cards-block__card car-cards-block__card--large">
          <div class="car-cards-block__card-image-wrap">
            <img
              :src="resolveImage(cards[0].image)"
              :alt="getText(cards[0].title)"
              class="car-cards-block__card-image"
              loading="lazy"
            />
          </div>
          <div v-if="getText(cards[0].title) || getText(cards[0].description)" class="car-cards-block__card-content">
            <h3 v-if="getText(cards[0].title)" class="car-cards-block__card-title">
              {{ getText(cards[0].title) }}
            </h3>
            <p v-if="getText(cards[0].description)" class="car-cards-block__card-description">
              {{ getText(cards[0].description) }}
            </p>
            <p v-if="getText(cards[0].note)" class="car-cards-block__card-note">
              {{ getText(cards[0].note) }}
            </p>
          </div>
        </div>

        <div class="car-cards-block__small-cards">
          <!-- Second card (left) -->
          <div v-if="cards[1]" class="car-cards-block__card car-cards-block__card--small">
            <div class="car-cards-block__card-image-wrap">
              <img
                :src="resolveImage(cards[1].image)"
                :alt="getText(cards[1].title)"
                class="car-cards-block__card-image"
                loading="lazy"
              />
            </div>
            <div v-if="getText(cards[1].title) || getText(cards[1].description)" class="car-cards-block__card-content">
              <h3 v-if="getText(cards[1].title)" class="car-cards-block__card-title">
                {{ getText(cards[1].title) }}
              </h3>
              <p v-if="getText(cards[1].description)" class="car-cards-block__card-description">
                {{ getText(cards[1].description) }}
              </p>
              <p v-if="getText(cards[1].note)" class="car-cards-block__card-note">
                {{ getText(cards[1].note) }}
              </p>
            </div>
          </div>

          <!-- Third and fourth cards (right, stacked) -->
          <div class="car-cards-block__right-cards">
            <div
              v-for="(card, index) in rightCards"
              :key="index + 2"
              class="car-cards-block__card car-cards-block__card--small"
            >
              <div class="car-cards-block__card-image-wrap">
                <img
                  :src="resolveImage(card.image)"
                  :alt="getText(card.title)"
                  class="car-cards-block__card-image"
                  loading="lazy"
                />
              </div>
              <div v-if="getText(card.title) || getText(card.description)" class="car-cards-block__card-content">
                <h3 v-if="getText(card.title)" class="car-cards-block__card-title">
                  {{ getText(card.title) }}
                </h3>
                <p v-if="getText(card.description)" class="car-cards-block__card-description">
                  {{ getText(card.description) }}
                </p>
              </div>
            </div>
          </div>
        </div>
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
    return `/src/assets/pages/${props.carId}/cards/${imagePath}`
  }
  return `/pages/${props.carId}/cards/${imagePath}`
}

const cards = computed(() => {
  return blockData.value.cards || []
})

const smallCards = computed(() => {
  return cards.value.slice(1) || []
})

const rightCards = computed(() => {
  return cards.value.slice(2) || []
})
</script>

<style lang="scss" scoped>
.car-cards-block {
  padding: 64px 0;
  background: rgb(245, 246, 247);

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
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__card--large {
    width: 100%;
  }

  &__small-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  &__right-cards {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__card--small {
    width: 100%;
  }

  &__card-image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
  }

  &__card--large &__card-image-wrap {
    min-height: 50vh;
  }

  &__card--small &__card-image-wrap {
    min-height: 30vh;
  }

  &__card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__card-content {
    padding-top: 12px;
  }

  &__card-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 24px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    margin: 0 0 12px;
  }

  &__card-description {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    margin: 0;
  }

  &__card-note {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #666;
    margin: 12px 0 0;
  }
}

@media screen and (max-width: 876px) {
  .car-cards-block {
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

    &__small-cards {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    &__right-cards {
      gap: 16px;
    }

    &__card--large &__card-image-wrap {
      min-height: 40vh;
    }

    &__card--small &__card-image-wrap {
      min-height: 25vh;
    }

    &__card-content {
      padding: 24px;
    }

    &__card-title {
      font-size: 20px;
      margin-bottom: 8px;
    }

    &__card-description {
      font-size: 14px;
    }

    &__card-note {
      font-size: 12px;
      margin-top: 8px;
    }
  }
}
</style>
