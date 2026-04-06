<template>
  <label class="input" :class="{ 'input--error': hasDisplayError }">
    <div class="input__name" :class="{ 'input__name--required': isRequired }">
      {{ name }}
    </div>

    <input
      v-if="type === 'tel'"
      ref="inputRef"
      class="input__inner"
      type="tel"
      :placeholder="placeholder"
      :required="isRequired"
      inputmode="tel"
      autocomplete="tel"
      @blur="onBlur"
    />

    <input
      v-else
      ref="inputRef"
      class="input__inner"
      :type="type === 'email' ? 'email' : type"
      :placeholder="placeholder"
      :required="isRequired"
      :inputmode="type === 'email' ? 'email' : undefined"
      :autocomplete="type === 'email' ? 'email' : undefined"
      :value="content"
      @input="onTextInput"
      @blur="onBlur"
    />

    <Wrong v-if="hasDisplayError && showStatusIcon" class="input__icon" />
    <Ok v-else-if="showOkIcon" class="input__icon" />
  </label>

  <div class="input__error" v-if="displayErrorText">
    {{ displayErrorText }}
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import IMask from 'imask'
import Wrong from './icons/wrong.vue'
import Ok from './icons/ok.vue'

const props = defineProps({
  name: String,
  isRequired: Boolean,
  type: { type: String, default: 'text' },
  /** Якщо false — помилки лише через errorMessage (наприклад Zod) */
  useInternalValidation: { type: Boolean, default: true },
  /** Показувати стан помилки та текст (після першого submit у модалці — true) */
  errorsVisible: { type: Boolean, default: true },
  /** Текст помилки зі схеми (Zod) */
  errorMessage: { type: String, default: '' },
})

const content = ref('')
const isError = ref(false)
const inputRef = ref(null)
let maskInstance = null

const placeholder = computed(() => {
  if (props.type === 'tel') return '+380 __ ___ __ __'
  return props.name
})

const hasDisplayError = computed(() => {
  if (!props.errorsVisible) return false
  if (props.errorMessage && String(props.errorMessage).trim() !== '') return true
  if (props.useInternalValidation && props.isRequired && isError.value) return true
  return false
})

const displayErrorText = computed(() => {
  if (!props.errorsVisible) return ''
  if (props.errorMessage && String(props.errorMessage).trim() !== '') return props.errorMessage
  return ''
})

const showStatusIcon = computed(() => {
  if (props.errorMessage && String(props.errorMessage).trim() !== '') return true
  return props.isRequired
})

const showOkIcon = computed(() => {
  if (hasDisplayError.value) return false
  const v = String(content.value ?? '').trim()
  if (!v) return false
  if (props.isRequired) return true
  if (props.type === 'email') return true
  return false
})

function validateInternal() {
  if (!props.useInternalValidation) {
    isError.value = false
    return
  }

  if (!props.isRequired) {
    if (props.type === 'email' && String(content.value).trim() !== '') {
      const t = String(content.value).trim()
      isError.value = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
    } else {
      isError.value = false
    }
    return
  }

  if (props.type === 'tel') {
    const digits = String(content.value).replace(/\D/g, '')
    isError.value = digits.length !== 12 || !digits.startsWith('380')
  } else if (props.type === 'email') {
    const t = String(content.value).trim()
    isError.value = t.length === 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
  } else {
    isError.value = String(content.value).trim().length === 0
  }
}

function onBlur() {
  if (props.useInternalValidation && props.errorsVisible) validateInternal()
}

function onTextInput(e) {
  let val = e.target.value
  content.value = val
  if (props.useInternalValidation && props.errorsVisible) validateInternal()
}

function initPhoneMask() {
  if (props.type !== 'tel' || !inputRef.value) return
  maskInstance?.destroy()
  maskInstance = IMask(inputRef.value, {
    mask: '+{380} 00 000 00 00',
    lazy: false,
  })
  maskInstance.on('accept', () => {
    content.value = maskInstance.value
    /* Помилку телефону показуємо після blur, а не на кожній цифрі */
  })
}

onMounted(() => {
  nextTick(() => {
    if (props.type === 'tel') initPhoneMask()
  })
})

onUnmounted(() => {
  maskInstance?.destroy()
  maskInstance = null
})

watch(
  () => props.type,
  () => {
    nextTick(() => {
      if (props.type === 'tel') initPhoneMask()
      else {
        maskInstance?.destroy()
        maskInstance = null
      }
    })
  },
)

watch(
  () => props.errorsVisible,
  (visible) => {
    if (visible && props.useInternalValidation) validateInternal()
  },
)

function clearField() {
  isError.value = false
  content.value = ''
  if (maskInstance) {
    maskInstance.value = ''
  } else if (inputRef.value) {
    inputRef.value.value = ''
  }
}

defineExpose({
  content,
  isError,
  clear: clearField,
})
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: text;
  transition: .3s ease-in-out;

  &:hover {
    border-color: #9DA2A5;
  }

  &:focus,
  &:focus-within,
  &:active {
    .input {
      &__name {
        opacity: 1;
      }
    }
  }

  &--error {
    border-color: #F75400 !important;

    .input__icon {
      opacity: 1;
    }

    +.input__error {
      opacity: 1;
    }
  }

  &__inner {
    width: 100%;
    border: unset;
    outline: unset;
    margin: unset;
    padding: unset;

    display: flex;
    flex-direction: row;
    align-items: center;

    font-size: 16px;
    line-height: 1.4;
    color: #000;

    &::placeholder {
      color: #9DA2A5;
    }
  }

  &__name {
    z-index: 2;
    position: absolute;
    top: -8px;
    left: 16px;
    padding: 0 4px;
    color: #9DA2A5;
    background-color: #fff;

    font-size: 12px;
    line-height: 1.4;
    opacity: 0;
    transition: .3s ease-in-out;

    &--required {
      &::after {
        content: '*';
        font-size: 12px;
        line-height: 1.4;
        color: #F75400;
      }
    }
  }

  &__icon {
    width: 16px;
    aspect-ratio: 1/1;
    opacity: 0;
    transition: .3s ease-in-out;
  }
}

.input__error {
  position: relative;
  left: 16px;
  bottom: 2px;
  margin-top: 2px;
  color: #F75400;
  opacity: 0;
  transition: .3s ease-in-out;
  font-size: 12px;
  line-height: 1.4;
}

@media screen and (max-width: 876px) {
  .input {
    padding: 10px 12px;

    &__name {
      left: 12px;
      padding: 0 2px;
    }
  }

  .input__error {
    left: 12px;
  }
}
</style>
