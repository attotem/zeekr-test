<template>
	<div
		class="modal"
		:class="{ 'modal--opened': isOpened }"
		@click="emits('close')"
	>
		<div
			class="modal__inner"
			v-if="data"
			@click.stop
		>
			<div class="modal__top">
				<div v-if="typeof data !== 'string'">
					{{ counter+1 }}/{{ data.length }}
				</div>
				<Cross
					class="modal__cross"
					@click="emits('close')"
				/>
			</div>
			<template v-if="typeof data == 'string'">
				<div
					class="content"
					v-html="data"
				></div>
			</template>
			<template v-else>
				<Slider
					class="content"
					:slider-type="1"
					:count="data?.length"
				>
					<article
						class="slide"
						v-for="slide in data"
						:style="{ backgroundImage: `url(${slide})` }"
					></article>
				</Slider>
			</template>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import Cross from './icons/cross.vue';
import Slider from './Slider.vue';

let props = defineProps(['data', 'isOpened'])
let emits = defineEmits(['close'])

let counter = ref(0)
</script>

<style lang="scss" scoped>
.modal {
  z-index: -1;
  position: fixed;
  left: 0;
  top: 0;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000066;
  transition: .5s ease-in-out;
  opacity: 0;
  cursor: pointer;
  user-select: none;

  &--opened {
    z-index: 100000;
    opacity: 1;
    user-select: none;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    width: 90dvw;
    aspect-ratio: 1440/740;
    padding: 22px 76px 64px 76px;
    border-radius: 12px;
    background-color: #fff;
    cursor: auto;
  }

  &__top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-family: Fixel Text;
    font-size: 16px;
    line-height: 120%;
    margin-bottom: 22px;
  }

  &__cross {
    margin-left: auto;
    cursor: pointer;
  }
}

.content {
  width: 100%;
  height: 100%;
  :deep(iframe){
    width: 100%;
    height: 100%;
  }
}

@media screen and (max-width: 876px) {
  .modal {
    &__inner {
      width: 100dvw;
      height: 100%;
      padding: 26px 0;
      border-radius: unset;
    }
    &__top {
      flex-direction: column-reverse;
      align-items: center;
      gap: 70px;
      padding: 0 24px;
    }
  }
  .content {
    position: unset !important;
  }
  :deep(.slider__controls) {
    display: flex !important;
    top: unset !important;
    bottom: 70px;
    padding: 0 76px !important;
    height: fit-content !important;
  }
  :deep(.slider__control) {
    border: 1px solid #000;
    color: #000 !important;
  }
}
</style>
