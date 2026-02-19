<template>
  <label class="input" :class="{ 'input--error': isError }">
    <div class="input__name" :class="{ 'input__name--required': isRequired }">
      {{ name }}
    </div>

    <input
      class="input__inner"
      :type="type === 'tel' ? 'tel' : type"
      :placeholder="placeholder"
      :required="isRequired"
      :inputmode="type === 'tel' ? 'numeric' : undefined"
      :autocomplete="type === 'tel' ? 'tel' : undefined"
      :value="content"
      @input="onInput"
      @blur="validate"
    />

    <Wrong v-if="isError && isRequired" class="input__icon" />
    <Ok v-else-if="!isError && content && isRequired" class="input__icon" />
  </label>

  <div class="input__error" v-if="isError && isRequired">
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Wrong from './icons/wrong.vue'
import Ok from './icons/ok.vue'

const props = defineProps({
  name: String,
  isRequired: Boolean,
  type: { type: String, default: 'text' }
})

const content = ref('')
const isError = ref(false)

const placeholder = computed(() => {
  if (props.type === 'tel') return '+380 XX XXX XX XX'
  return props.name
})

const formatPhone = (value) => {
  let digits = value.replace(/\D/g, '')

  if (digits.startsWith('0')) digits = digits.slice(1)
  if (digits.startsWith('380')) digits = digits.slice(3)

  const d = digits.slice(0, 9)

  const i1 = d.slice(0, 2)
  const i2 = d.slice(2, 5)
  const i3 = d.slice(5, 7)
  const i4 = d.slice(7, 9)

  return `+380${i1 ? ' ' + i1 : ''}${i2 ? ' ' + i2 : ''}${i3 ? ' ' + i3 : ''}${i4 ? ' ' + i4 : ''}`.trim()
}

const onInput = (e) => {
  let val = e.target.value

  if (props.type === 'tel') {
    val = formatPhone(val)
  }

  content.value = val
  validate()
}

const validate = () => {
  if (!props.isRequired) {
    isError.value = false
    return
  }

  if (props.type === 'tel') {
    const digits = content.value.replace(/\D/g, '')
    isError.value = digits.length !== 12
  } else {
    isError.value = content.value.trim().length === 0
  }
}

defineExpose({
  content,
  isError
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
      color: #000;
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

  &__error {
    position: relative;
    left: 16px;
    bottom: 2px;
    color: #F75400;
    opacity: 0;
    transition: .3s ease-in-out;

    font-size: 12px;
    line-height: 1.4;
  }

  &__icon {
    width: 16px;
    aspect-ratio: 1/1;
    opacity: 0;
    transition: .3s ease-in-out;
  }
}

@media screen and (max-width: 876px) {
  .input {
    padding: 10px 12px;

    &__name {
      left: 12px;
      padding: 0 2px;
    }

    &__error {
      left: 12px;
    }
  }
}
</style>
