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

const langStore = useLangStore()
const blockData = computed(() => props.data || {})

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })

const batteries = computed(() => {
  return blockData.value.batteries || []
})
</script>

<style lang="scss" scoped>
.car-battery-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  background: #fff;

  &__inner {
    width: var(--car-inner-width);
    max-width: var(--car-inner-max-width);
    margin: var(--car-inner-margin);
    padding: var(--car-inner-padding-x);
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
    width: var(--car-card-width);
    position: relative;
    overflow: var(--car-card-overflow);
    background: var(--car-card-media-bg);
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
    display: var(--car-stack-column);
    flex-direction: var(--car-stack-direction);
    gap: var(--car-stack-gap-lg);
  }

  &__battery-name {
    font-family: var(--car-font-heading);
    font-size: 24px;
    line-height: 1.3;
    font-weight: 400;
    color: var(--car-text-primary);
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
    font-family: var(--car-font-heading);
    font-size: 20px;
    line-height: 1.2;
    font-weight: 400;
    color: var(--car-text-primary);
  }

  &__battery-spec-label {
    font-family: var(--car-font-body);
    font-size: 14px;
    line-height: 1.5;
    color: var(--car-text-muted);
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
    font-family: var(--car-font-body);
    font-size: 12px;
    line-height: 1.6;
    color: var(--car-text-muted);
  }

  &__footnote-number {
    flex-shrink: 0;
  }

  &__footnote-text {
    flex: 1;
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-battery-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__inner {
      padding: var(--car-inner-padding-x-sm);
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
      gap: var(--car-stack-gap-sm);
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
