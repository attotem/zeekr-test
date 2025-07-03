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
			:placeholder="props.name"
			:type="props.type"
			:required="props.isRequired"
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
import { ref, watch } from 'vue';
import Wrong from './icons/wrong.vue';
import Ok from './icons/ok.vue';
import { useLangStore } from '@/stores/lang';

const content = defineModel({
  set(value) {
    if (value && value !== '+' && props.type == 'tel') {
      let temp = value.replace(/\D/g, '')
      if(value.startsWith('0')) return `${temp.slice(0, 1)} ${temp.slice(1, 3)} ${temp.slice(3, 6)} ${temp.slice(6)}`.trimEnd()
      else return `+${temp.slice(0, 3)} ${temp.slice(3, 5)} ${temp.slice(5, 8)} ${temp.slice(8)}`
    }
    return ''
  },
  get(value) {
    if (value && value !== '+' && props.type == 'tel') {
      let temp = value.replace(/\D/g, '')
      if(value.startsWith('0')) return `${temp.slice(0, 1)} ${temp.slice(1, 3)} ${temp.slice(3, 6)} ${temp.slice(6)}`.trimEnd()
      else return `+${temp.slice(0, 3)} ${temp.slice(3, 5)} ${temp.slice(5, 8)} ${temp.slice(8)}`.trimEnd()
    }
    return value
  }
})

let langStore = useLangStore()

let props = defineProps(['name', 'isRequired', 'type'])
let isError = ref(false)

watch(content, () => {
  if (props.type == 'tel' && !content.value.replace(/\D/g, '').match(/^[0-9]{4,16}$/gm)) isError.value = true;
  else isError.value = false;
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
