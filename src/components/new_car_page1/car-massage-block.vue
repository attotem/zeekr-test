<template>
  <section class="car-massage-block">
    <div class="car-massage-block__inner">
      <div class="car-massage-block__sections">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="car-massage-block__section"
        >
          <h3 v-if="getText(section.title)" class="car-massage-block__section-title">
            {{ getText(section.title) }}
          </h3>
          <div class="car-massage-block__section-content">
            <div
              v-for="(item, itemIndex) in section.items"
              :key="itemIndex"
              class="car-massage-block__item"
            >
              <div v-if="getText(item.value)" class="car-massage-block__item-value">
                {{ getText(item.value) }}
              </div>
              <div v-if="getText(item.label)" class="car-massage-block__item-label">
                {{ getText(item.label) }}
              </div>
              <div v-if="getText(item.description)" class="car-massage-block__item-description">
                {{ getText(item.description) }}
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

const sections = computed(() => {
  if (blockData.value.sections && Array.isArray(blockData.value.sections)) {
    return blockData.value.sections
  }
  return []
})
</script>

<style lang="scss" scoped>
.car-massage-block {
  width: var(--car-section-width);
  margin: var(--car-section-margin);
  background: #fff;

  &__inner {
    width: 100%;
    margin: 0 auto;
    padding: var(--car-inner-padding-x);
    max-width: 1600px;
  }

  &__sections {
    display: flex;
    gap: 0;
  }

  &__section {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 1px;
      background: #e5e5e5;
      height: 50%;
      transform: translateY(50%);
    }
  }

  &__section-title {
    font-family: var(--car-font-heading);
    font-size: 16px;
    line-height: 1.4;
    font-weight: 400;
    color: var(--car-text-primary);
    margin: 0 0 20px 0;
  }

  &__section-content {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    justify-content: space-evenly;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  &__item-value {
    font-family: var(--car-font-heading);
    font-size: 22px;
    line-height: 1.2;
    font-weight: 400;
    color: var(--car-text-primary);
  }

  &__item-label {
    font-family: var(--car-font-body);
    font-size: 13px;
    line-height: 1.5;
    color: var(--car-text-muted);
  }

  &__item-description {
    font-family: var(--car-font-body);
    font-size: 11px;
    line-height: 1.4;
    color: #999;
    margin-top: 2px;
  }
}

@media screen and (max-width: 1200px) {
  .car-massage-block {
    padding: 50px 0;

    &__section {
      padding: 28px 16px;
    }

    &__section-title {
      font-size: 15px;
      margin-bottom: 18px;
    }

    &__section-content {
      gap: 14px;
    }

    &__item-value {
      font-size: 26px;
    }

    &__item-label {
      font-size: 12px;
    }

    &__sections {
      flex-wrap: wrap;
    }

    &__section {
      flex: 1 1 calc(50% - 1px);
      border-right: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;

      &:nth-child(2n) {
        border-right: none;
      }

      &:last-child {
        border-right: none;
      }
    }
  }
}

@media screen and (max-width: var(--car-bp-sm)) {
  .car-massage-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    padding: var(--car-section-padding-y-sm);

    &__inner {
      padding: var(--car-inner-padding-x-sm);
    }

    &__sections {
      flex-direction: column;
    }

    &__section {
      padding: 28px 16px;
      border-right: none;
      border-bottom: 1px solid #e5e5e5;

      &:last-child {
        border-bottom: none;
      }
    }

    &__section-title {
      font-size: 15px;
      margin-bottom: 16px;
    }

    &__section-content {
      gap: 14px;
    }

    &__item {
      gap: 5px;
    }

    &__item-value {
      font-size: 24px;
    }

    &__item-label {
      font-size: 12px;
    }

    &__item-description {
      font-size: 10px;
    }
  }
}
</style>
