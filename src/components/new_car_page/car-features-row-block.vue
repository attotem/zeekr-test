<template>
  <section class="car-features-row-block">
    <div class="car-features-row-block__grid">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="car-features-row-block__item"
      >
        <h3 class="car-features-row-block__title">{{ getText(item.title) }}</h3>
        <div class="car-features-row-block__divider"></div>
        <p class="car-features-row-block__description">{{ getText(item.description) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '' }
})

const langStore = useLangStore()
const items = computed(() => props.data?.items || [])

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
</script>

<style lang="scss" scoped>
.car-features-row-block {
  width: 100%;
  background: #fff;
  padding: 40px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    max-width: 1320px;
    margin: 0 auto;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #111;
    margin: 0;
    line-height: 1.4;
  }

  &__divider {
    width: 100%;
    height: 1px;
    background: rgba(17, 17, 17, 0.12);
  }

  &__description {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #555;
    margin: 0;
  }
}

@media screen and (max-width: 876px) {
  .car-features-row-block {
    padding: 24px 16px;

    &__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    &__title {
      font-size: 14px;
    }

    &__description {
      font-size: 12px;
    }
  }
}
</style>
