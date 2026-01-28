<template>
  <section class="car-text-block">
    <h2 class="car-text-block__title">{{ getText(blockData.title) }}</h2>
    <p class="car-text-block__subtitle">{{ getText(blockData.subtitle) }}</p>
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

// Функция для получения текста в зависимости от языка
const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') {
    return textObj
  }
  if (typeof textObj === 'object' && textObj !== null) {
    return textObj[langStore.activeLang] || textObj.ua || textObj.en || ''
  }
  return ''
}
</script>

<style lang="scss" scoped>
.car-text-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: #fff;

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 64px;
    line-height: 1.2;
    margin: 0 0 24px;
    font-weight: 400;
    background: linear-gradient(89deg, rgb(93, 75, 59) 0%, rgb(236, 194, 158) 84.07%, rgb(93, 75, 59) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 24px;
    line-height: 1.4;
    margin: 0;
    font-weight: 400;
    background: linear-gradient(89deg, rgb(93, 75, 59) 0%, rgb(236, 194, 158) 84.07%, rgb(93, 75, 59) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
  }
}

/* Default: visible (so content never disappears if wrapper classes fail) */
.car-text-block__title,
.car-text-block__subtitle {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* When wrapper is hidden (before entering viewport) */
:deep(.block-appear.is-hidden) .car-text-block__title,
:deep(.block-appear.is-hidden) .car-text-block__subtitle {
  opacity: 0;
  transform: translateY(14px);
  filter: blur(6px);
}

/* Extra staggered text reveal when the block wrapper becomes visible */
:deep(.block-appear.is-visible) .car-text-block__title,
:deep(.block-appear.is-visible) .car-text-block__subtitle {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
  transition: opacity 520ms ease, transform 520ms ease, filter 520ms ease;
  will-change: opacity, transform, filter;
}

:deep(.block-appear.is-visible) .car-text-block__subtitle {
  transition-delay: 120ms;
}

/* Subtle gradient shimmer for golden text (only when visible) */
:deep(.block-appear.is-visible) .car-text-block__title,
:deep(.block-appear.is-visible) .car-text-block__subtitle {
  background-size: 220% 100%;
  animation: goldShimmer 2200ms ease-in-out 200ms both;
}

@keyframes goldShimmer {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .car-text-block__title,
  .car-text-block__subtitle {
    transition: none;
    transform: none;
    filter: none;
    opacity: 1;
    animation: none;
  }
}

@media screen and (max-width: 876px) {
  .car-text-block {
    padding: 30px 16px;

    &__title {
      font-size: 36px;
      margin-bottom: 16px;
    }

    &__subtitle {
      font-size: 18px;
    }
  }
}
</style>
