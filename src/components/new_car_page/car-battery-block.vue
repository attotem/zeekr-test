<template>
  <section class="car-battery-block">
    <div class="car-battery-block__inner">
      <div class="car-battery-block__grid">
        <div
          v-for="(battery, index) in batteries"
          :key="index"
          class="car-battery-block__battery"
        >
          <div class="car-battery-block__battery-image-wrap">
            <img
              :src="resolveImage(battery.image)"
              :alt="getText(battery.name)"
              class="car-battery-block__battery-image"
              loading="lazy"
            />
          </div>
          <div class="car-battery-block__battery-content">
            <h3 v-if="getText(battery.name)" class="car-battery-block__battery-name">
              {{ getText(battery.name) }}
            </h3>
            <div v-if="battery.specs" class="car-battery-block__battery-specs">
              <div
                v-for="(spec, specIndex) in battery.specs"
                :key="specIndex"
                class="car-battery-block__battery-spec"
              >
                <div class="car-battery-block__battery-spec-value">{{ spec.value }}</div>
                <div class="car-battery-block__battery-spec-label">{{ getText(spec.label) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="blockData.footnotes && blockData.footnotes.length > 0" class="car-battery-block__footnotes">
        <div
          v-for="(footnote, index) in blockData.footnotes"
          :key="index"
          class="car-battery-block__footnote"
        >
          <span class="car-battery-block__footnote-number">{{ index + 1 }}.</span>
          <span class="car-battery-block__footnote-text">{{ getText(footnote) }}</span>
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
    if (lang === 'ru' && textObj.ua) return textObj.ua
    if (lang === 'zh' && (textObj.zh || textObj.cn)) return textObj.zh || textObj.cn
    return textObj.uk || textObj.ua || textObj.en || textObj.ru || textObj.zh || textObj.cn || ''
  }
  return ''
}

const resolveImage = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}

const batteries = computed(() => {
  return blockData.value.batteries || []
})
</script>

<style lang="scss" scoped>
.car-battery-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  background: #fff;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  &__battery {
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  &__battery-image-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__battery-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  &__battery-content {
    padding: 32px 0 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__battery-name {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 24px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    margin: 0;
  }

  &__battery-specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 32px;
  }

  &__battery-spec {
    display: flex;
    flex-direction: column;
  }

  &__battery-spec-value {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 20px;
    line-height: 1.2;
    font-weight: 400;
    color: #111;
  }

  &__battery-spec-label {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #666;
  }

  &__footnotes {
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid rgba(17, 17, 17, 0.1);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__footnote {
    display: flex;
    gap: 8px;
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 12px;
    line-height: 1.6;
    color: #666;
  }

  &__footnote-number {
    flex-shrink: 0;
  }

  &__footnote-text {
    flex: 1;
  }
}

@media screen and (max-width: 876px) {
  .car-battery-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 28px 0;

    &__inner {
      padding: 0 16px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    &__battery-image-wrap {
      min-height: 250px;
    }

    &__battery-content {
      padding: 24px 0 0;
      gap: 20px;
    }

    &__battery-name {
      font-size: 20px;
    }

    &__battery-specs {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    &__battery-spec-value {
      font-size: 18px;
    }

    &__battery-spec-label {
      font-size: 13px;
    }

    &__footnotes {
      margin-top: 32px;
      padding-top: 24px;
      gap: 10px;
    }

    &__footnote {
      font-size: 11px;
    }
  }
}
</style>
