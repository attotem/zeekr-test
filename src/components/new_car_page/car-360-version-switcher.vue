<template>
  <div class="car-360-version-switcher">
    <div class="car-360-version-switcher__container">
      <button
        type="button"
        class="car-360-version-switcher__button"
        :class="{ 'car-360-version-switcher__button--active': version === 'standard' }"
        @click="selectVersion('standard')"
      >
        <span class="car-360-version-switcher__label">{{ getText(labels.standard) }}</span>
      </button>
      <button
        type="button"
        class="car-360-version-switcher__button"
        :class="{ 'car-360-version-switcher__button--active': version === 'kz' }"
        @click="selectVersion('kz')"
      >
        <span class="car-360-version-switcher__label">{{ getText(labels.kz) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'standard'
  },
  labels: {
    type: Object,
    default: () => ({
      standard: {
        ua: '7X New',
        en: '7X New'
      },
      kz: {
        ua: '7X CCS 2',
        en: '7X CCS 2'
      }
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const langStore = useLangStore()
const version = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  version.value = newValue
})

const selectVersion = (newVersion) => {
  version.value = newVersion
  emit('update:modelValue', newVersion)
}

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)
</script>

<style lang="scss" scoped>
.car-360-version-switcher {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #fff;

  &__container {
    display: flex;
    gap: 12px;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 4px;
  }

  &__button {
    padding: 10px 24px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #666;
    white-space: nowrap;

    &:hover {
      color: #333;
    }

    &--active {
      background: #fff;
      color: #000;
      font-weight: 500;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  &__label {
    display: block;
  }
}

@media screen and (max-width: 876px) {
  .car-360-version-switcher {
    padding: 16px;

    &__container {
      gap: 8px;
      padding: 3px;
    }

    &__button {
      padding: 8px 16px;
      font-size: 13px;
    }
  }
}
</style>
