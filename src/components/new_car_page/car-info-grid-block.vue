<template>
  <section class="car-info-grid-block">
    <div class="car-info-grid-block__inner">
      <div
        v-if="isFeatureSplit"
        class="car-info-grid-block__feature-split"
      >
        <article
          v-if="items[0]"
          class="car-info-grid-block__card car-info-grid-block__feature-left"
        >
          <div class="car-info-grid-block__image-wrap">
            <img
              class="car-info-grid-block__image"
              :src="resolveImage(items[0].image)"
              :alt="getText(items[0].caption)"
              loading="lazy"
            />
          </div>
          <p class="car-info-grid-block__caption">{{ getText(items[0].caption) }}</p>
        </article>

        <div class="car-info-grid-block__feature-right">
          <article
            v-for="(item, index) in featureRightItems"
            :key="`feature-right-${index}`"
            class="car-info-grid-block__card"
          >
            <div class="car-info-grid-block__image-wrap">
              <img
                class="car-info-grid-block__image"
                :src="resolveImage(item.image)"
                :alt="getText(item.caption)"
                loading="lazy"
              />
            </div>
            <p class="car-info-grid-block__caption">{{ getText(item.caption) }}</p>
          </article>
        </div>
      </div>

      <div
        v-else
        class="car-info-grid-block__grid"
      >
        <article
          v-for="(item, index) in items"
          :key="index"
          class="car-info-grid-block__card"
        >
          <div class="car-info-grid-block__image-wrap">
            <img
              class="car-info-grid-block__image"
              :src="resolveImage(item.image)"
              :alt="getText(item.caption)"
              loading="lazy"
            />
          </div>
          <p class="car-info-grid-block__caption">{{ getText(item.caption) }}</p>
        </article>
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
const items = computed(() => blockData.value.items || [])
const isFeatureSplit = computed(() => blockData.value.layout === 'featureSplit')
const featureRightItems = computed(() => items.value.slice(1, 4))

const getText = (value) => getTextByLang(value, langStore.activeLang)
const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })
</script>

<style lang="scss" scoped>
.car-info-grid-block {
  background: #efefee;
  padding: 60px 180px;
  
  &__inner {
    width: calc(100% - 40px);
    margin: 0 20px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  &__feature-split {
    display: flex;
    gap: 30px;
    align-items: flex-start;
  }

  &__feature-left {
    flex: 0 0 40%;
  }

  &__feature-right {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;

    .car-info-grid-block__card:first-child {
      grid-column: 1 / -1;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__image-wrap {
    overflow: hidden;
    background: #ddd;
  }

  &__image {
    display: block;
    width: 100%;
    height: auto;
  }

  &__caption {
    margin: 0;
    font-size: 24px;
    line-height: 1.2;
    color: #1a1a1a;
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
  }
}

@media screen and (max-width: 876px) {
  .car-info-grid-block {
    padding: 16px 0 24px;

    &__inner {
      width: calc(100% - 32px);
      margin: 0 16px;
    }

    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    &__feature-split {
      display: block;
    }

    &__feature-left {
      width: 100%;
      margin-bottom: 8px;
    }

    &__feature-right {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;

      .car-info-grid-block__card:first-child {
        grid-column: 1 / -1;
      }
    }

    &__feature-split .car-info-grid-block__card {
      position: static;
      gap: 10px;
    }

    &__feature-split .car-info-grid-block__caption {
      position: static;
      font-size: 16px;
      line-height: 1.3;
      margin: 0;
      color: #1a1a1a;
      text-shadow: none;
    }
  }
}
</style>
