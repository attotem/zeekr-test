<template>
  <section ref="rootEl" class="car-fr-line-block">
    <div class="car-fr-line-block__media">

      <div class="car-fr-line-block__top car-fr-line-block__top--mobile">
      <h2 class="car-fr-line-block__title">{{ getText(blockData.title) }}</h2>
      <p class="car-fr-line-block__subtitle">{{ getText(blockData.subtitle) }}</p>
      <button
        v-if="blockData.button"
        type="button"
        class="car-fr-line-block__button"
        @click="onButtonClick"
      >
        {{ getText(blockData.button.text) }}
      </button>
    </div>

      <picture class="car-fr-line-block__image">
        <source
          v-if="blockImage.desktop"
          :srcset="blockImage.desktop"
          media="(min-width: 992px)"
        />
        <source
          v-if="blockImage.tablet"
          :srcset="blockImage.tablet"
          media="(min-width: 576px) and (max-width: 991px)"
        />
        <source
          v-if="blockImage.mobile"
          :srcset="blockImage.mobile"
          media="(max-width: 575px)"
        />
        <img
          :src="blockImage.desktop || blockImage.tablet || blockImage.mobile"
          :alt="getText(blockData.title) || 'FR-LINE'"
          loading="lazy"
        />
      </picture>

      <div class="car-fr-line-block__overlay"></div>

      <div class="car-fr-line-block__top car-fr-line-block__top--desktop">
        <h2 class="car-fr-line-block__title">{{ getText(blockData.title) }}</h2>
        <p class="car-fr-line-block__subtitle">{{ getText(blockData.subtitle) }}</p>
        <button
          v-if="blockData.button"
          type="button"
          class="car-fr-line-block__button"
          @click="onButtonClick"
        >
          {{ getText(blockData.button.text) }}
        </button>
      </div>

      <div class="car-fr-line-block__specs car-fr-line-block__specs--desktop">
        <div
          v-for="(item, index) in blockData.specs || []"
          :key="index"
          class="car-fr-line-block__spec"
        >
          <div class="car-fr-line-block__spec-value">{{ item.value }}</div>
          <div class="car-fr-line-block__spec-label">{{ getText(item.label) }}</div>
        </div>
      </div>
    </div>

   

    <div class="car-fr-line-block__specs car-fr-line-block__specs--mobile">
      <div
        v-for="(item, index) in blockData.specs || []"
        :key="index"
        class="car-fr-line-block__spec"
      >
        <div class="car-fr-line-block__spec-value">{{ item.value }}</div>
        <div class="car-fr-line-block__spec-label">{{ getText(item.label) }}</div>
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

const emit = defineEmits(['buttonClick'])
const langStore = useLangStore()
const blockData = computed(() => props.data || {})

const blockImage = computed(() => {
  const image = blockData.value.image || {}
  return {
    desktop: resolveMediaPath(image.desktop, { carId: props.carId }),
    tablet: resolveMediaPath(image.tablet, { carId: props.carId }),
    mobile: resolveMediaPath(image.mobile, { carId: props.carId })
  }
})

const getText = (textObj) => {
  return getTextByLang(textObj, langStore.activeLang)
}

const onButtonClick = () => {
  emit('buttonClick', blockData.value.button?.type || 'scroll_down')
}
</script>

<style lang="scss" scoped>
.car-fr-line-block {
  width: calc(100% - 40px);
  margin: 20px;

  &__media {
    position: relative;
    overflow: hidden;
    min-height: 70vh;
  }

  &__image,
  &__image img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__overlay {
    position: absolute;
    inset: 0;
  }

  &__top {
    text-align: center;
    width: min(90%, 720px);

    &--desktop {
      position: absolute;
      top: 48px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
    }

    &--mobile {
      display: none;
      width: 100%;
      max-width: none;
      text-align: left;
      padding: 22px 16px 8px;
      color: #222;
    }
  }

  &__title {
    font-size: 54px;
    line-height: 1.15;
    margin: 0 0 12px;
    font-weight: 400;
  }

  &__subtitle {
    font-size: 30px;
    line-height: 1.2;
    margin: 0 0 24px;
    font-weight: 400;
  }

  &__button {
    border: 1px solid #fff;
    color: #fff;
    background: transparent;
    border-radius: 999px;
    padding: 10px 22px;
    font-size: 14px;
    cursor: pointer;
  }

  &__specs {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 24px;
    padding: 28px 18px 34px;

    &--desktop {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }

    &--mobile {
      display: none;
      padding: 8px 16px 28px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 24px;
    }
  }

  &__spec-value {
    font-size: 22px;
    font-weight: 600;
    color: #fff4e2;
    margin-bottom: 8px;
  }

  &__spec-label {
    color: #fff4e2;
    font-size: 14px;
    opacity: 0.8;
    font-style: normal;
    font-weight: 400;
  }
}

@media screen and (max-width: 876px) {
  .car-fr-line-block {
    width: 100%;
    margin: 0;
    padding: 20px;
    background: rgb(235, 232, 227);

    &__media {
      min-height: 48vh;
    }

    &__top {
      &--desktop {
        display: none;
      }

      &--mobile {
        display: block;
        text-align: center;
        padding:  44px 0 ;
      }
    }

    &__title {
      font-size: 30px;
      margin-bottom: 8px;
    }

    &__subtitle {
      font-size: 22px;
      margin-bottom: 14px;
    }

    &__button {
      padding: 8px 16px;
      font-size: 12px;
      border-color: #222;
      color: #222;
    }

    &__specs {
      &--desktop {
        display: none;
      }

      &--mobile {
        display: grid;
        padding: 24px 20px;
      }
    }

    &__spec-value {
      font-size: 24px;
      margin-bottom: 8px;
      color: #222;
    }

    &__spec-label {
      font-size: 16px;
      line-height: 1.2;
      color: #222;
    }
  }
}
</style>
