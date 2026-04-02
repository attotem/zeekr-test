<template>
  <section class="car-cards-block">
    <div class="car-cards-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-cards-block__title car-section-title car-section-title--center">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-cards-block__grid">
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
    width: var(--car-inner-width);
    max-width: var(--car-inner-max-width);
    margin: var(--car-inner-margin);
    padding: var(--car-inner-padding-x);
  }

  &__title {
        color: var(--car-title-color);
    margin: var(--car-title-margin-lg);
    text-align: var(--car-title-align);
  }

  &__grid {
    display: var(--car-stack-column);
    flex-direction: var(--car-stack-direction);
    gap: var(--car-stack-gap-lg);
  }

  &__card {
    overflow: var(--car-card-overflow);
    display: var(--car-stack-column);
    flex-direction: var(--car-stack-direction);
  }

  &__card--large {
    width: var(--car-card-width);
  }

  &__small-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  &__right-cards {
    display: var(--car-stack-column);
    flex-direction: var(--car-stack-direction);
    gap: var(--car-stack-gap-lg);
  }

  &__card--small {
    width: var(--car-card-width);
  }

  &__card-image-wrap {
    width: var(--car-card-width);
    position: relative;
    overflow: var(--car-card-overflow);
    background: var(--car-card-media-bg);
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
    padding-top: var(--car-card-content-padding-top);
  }

  &__card-title {
        font-size: 24px;
    line-height: 1.3;
    font-weight: 400;
    color: var(--car-text-primary);
    margin: 0 0 12px;
  }

  &__card-description {
    font-family: var(--car-font-body);
    font-size: 16px;
    line-height: 1.6;
    color: var(--car-text-secondary);
    margin: 0;
  }

  &__card-note {
    font-family: var(--car-font-body);
    font-size: 14px;
    line-height: 1.5;
    color: var(--car-text-muted);
    margin: 12px 0 0;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-cards-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__inner {
      padding: var(--car-inner-padding-x-sm);
    }

    &__title {
      margin: var(--car-title-margin-md);
    }

    &__grid {
      gap: var(--car-stack-gap-sm);
    }

    &__small-cards {
      grid-template-columns: 1fr;
      gap: var(--car-stack-gap-sm);
    }

    &__right-cards {
      gap: var(--car-stack-gap-sm);
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
