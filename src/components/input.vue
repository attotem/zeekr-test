<template>
	<label
		class="input"
		:class="{ 'input--error': isError }"
	>
		<div
			class="input__name"
			:class="{ 'input__name--required': props.isRequired }"
		>
			{{ props.name }}
		</div>
		<input
			class="input__inner"
			:placeholder="placeholderText"
			:type="props.type"
			:required="props.isRequired"
			:inputmode="props.type == 'tel' ? 'tel' : undefined"
			autocomplete="tel"
			:maxlength="props.type == 'tel' ? maxLengthAttr : undefined"
			@keydown="onKeyDown"
			v-model="content"
		/>
		<template v-if="props.isRequired">
			<Wrong
				class="input__icon"
				v-if="isError"
			/>
			<Ok
				class="input__icon"
				v-else
			/>
		</template>
	</label>
	<div class="input__error">
		<template v-if="langStore.activeLang == 'en'">Incorrect</template>
	</div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Wrong from './icons/wrong.vue';
import Ok from './icons/ok.vue';
import { useLangStore } from '@/stores/lang';

const content = defineModel({
  set(value) {
    if (props.type !== 'tel') return value

    if (!value) return ''

    let digits = value.replace(/\D/g, '')
    if (digits.startsWith('0')) digits = digits.slice(1)
    if (digits.startsWith('380')) digits = digits.slice(3)

    const d = digits.slice(0, 9)
    if (d.length === 0) return ''
    const i1 = d.slice(0, 2)
    const i2 = d.slice(2, 5)
    const i3 = d.slice(5, 7)
    const i4 = d.slice(7, 9)
    return `+380${i1 ? ' ' + i1 : ''}${i2 ? ' ' + i2 : ''}${i3 ? ' ' + i3 : ''}${i4 ? ' ' + i4 : ''}`.trim()
  },
  get(value) {
    if (props.type !== 'tel') return value
    if (!value) return ''

    let digits = value.replace(/\D/g, '')
    if (digits.startsWith('0')) digits = digits.slice(1)
    if (digits.startsWith('380')) digits = digits.slice(3)

    const d = digits.slice(0, 9)
    if (d.length === 0) return ''
    const i1 = d.slice(0, 2)
    const i2 = d.slice(2, 5)
    const i3 = d.slice(5, 7)
    const i4 = d.slice(7, 9)
    return `+380${i1 ? ' ' + i1 : ''}${i2 ? ' ' + i2 : ''}${i3 ? ' ' + i3 : ''}${i4 ? ' ' + i4 : ''}`.trim()
  }
})

let langStore = useLangStore()

let props = defineProps(['name', 'isRequired', 'type'])
let isError = ref(false)

const placeholderText = computed(() => {
  if (props.type == 'tel') return '+380 __ ___ __ __'
  return props.name
})

const maxLengthAttr = computed(() => 17) 

const onKeyDown = (e) => {
  if (props.type !== 'tel') return

  const allowedControl = [
    'Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Home','End'
  ]
  if (allowedControl.includes(e.key) || (e.ctrlKey || e.metaKey)) return

  const isDigit = /\d/.test(e.key)

  if (!isDigit) {
    e.preventDefault()
    return
  }

  const inputEl = e.currentTarget
  const current = String(content.value || '')
  const start = inputEl.selectionStart || 0
  const end = inputEl.selectionEnd || 0
  const nextRaw = current.slice(0, start) + e.key + current.slice(end)
  const nextDigits = nextRaw.replace(/\D/g, '')

  let nd = nextDigits
  if (nd.startsWith('0')) nd = nd.slice(1)
  if (nd.startsWith('380')) nd = nd.slice(3)
  const maxDigits = 9
  if (nd.length > maxDigits) {
    e.preventDefault()
  }
}

watch(content, () => {
  if (props.type == 'tel') {
    const digits = (content.value || '').replace(/\D/g, '')
    if (digits.startsWith('0')) isError.value = digits.length !== 10
    else isError.value = digits.startsWith('380') ? digits.length !== 12 : digits.length !== 9 && digits.length !== 12
  } else {
    isError.value = false
  }
})

defineExpose({ isError, content })
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
