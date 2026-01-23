<template>
  <section class="car-text-simple-block">
    <h2 class="car-text-simple-block__title">{{ getText(blockData.title) }}</h2>
    <p v-if="getText(blockData.subtitle)" class="car-text-simple-block__subtitle">{{ getText(blockData.subtitle) }}</p>
    <p v-if="getText(blockData.note)" class="car-text-simple-block__note">{{ getText(blockData.note) }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const langStore = useLangStore()

const blockData = computed(() => props.data || {})

const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') {
    return textObj
  }
  if (typeof textObj === 'object' && textObj !== null) {
    return textObj[langStore.activeLang] || textObj.ua || textObj.en || textObj.zh || ''
  }
  return ''
}
</script>

<style lang="scss" scoped>
.car-text-simple-block {
  width: 100%;
  min-height: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background: #fff;

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    margin: 0;
    font-weight: 400;
    color: #111;
    text-align: center;
  }

  &__title::after {
    content: '';
    display: block;
    height: 2px;
    width: 96px;
    margin: 18px auto 0;
    background: rgba(17, 17, 17, 0.12);
    transform: scaleX(0);
    transform-origin: center;
    opacity: 0;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 20px;
    line-height: 1.5;
    margin: 16px 0 0;
    font-weight: 400;
    color: #666;
    text-align: center;
    max-width: 800px;
  }

  &__note {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    margin: 16px 0 0;
    font-weight: 400;
    color: #666;
    text-align: center;
    max-width: 800px;
  }
}

/* Default: visible (so content never disappears if wrapper classes fail) */
.car-text-simple-block__title,
.car-text-simple-block__subtitle,
.car-text-simple-block__note {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* When wrapper is hidden (before entering viewport) */
:deep(.block-appear.is-hidden) .car-text-simple-block__title,
:deep(.block-appear.is-hidden) .car-text-simple-block__subtitle,
:deep(.block-appear.is-hidden) .car-text-simple-block__note {
  opacity: 0;
  transform: translateY(14px);
  filter: blur(6px);
}

/* Extra staggered text reveal when the block wrapper becomes visible */
:deep(.block-appear.is-visible) .car-text-simple-block__title,
:deep(.block-appear.is-visible) .car-text-simple-block__subtitle,
:deep(.block-appear.is-visible) .car-text-simple-block__note {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
  transition: opacity 520ms ease, transform 520ms ease, filter 520ms ease;
  will-change: opacity, transform, filter;
}

:deep(.block-appear.is-visible) .car-text-simple-block__subtitle {
  transition-delay: 120ms;
}

:deep(.block-appear.is-visible) .car-text-simple-block__note {
  transition-delay: 220ms;
}

/* Underline draw effect for simple title (only when visible) */
:deep(.block-appear.is-visible) .car-text-simple-block__title::after {
  opacity: 1;
  transform: scaleX(1);
  transition: transform 640ms ease 220ms, opacity 360ms ease 220ms;
}

@media (prefers-reduced-motion: reduce) {
  .car-text-simple-block__title,
  .car-text-simple-block__subtitle,
  .car-text-simple-block__note {
    transition: none;
    transform: none;
    filter: none;
    opacity: 1;
  }

  .car-text-simple-block__title::after {
    transition: none;
    transform: none;
    opacity: 1;
  }
}

@media screen and (max-width: 876px) {
  .car-text-simple-block {
    min-height: 10vh;
    padding: 28px 16px;

    &__title {
      font-size: 32px;
    }

    &__subtitle {
      font-size: 16px;
      margin-top: 12px;
    }

    &__note {
      font-size: 12px;
      margin-top: 12px;
    }
  }
}
</style>
