<template>
	<div
		class="slider"
		@touchstart="touchStart"
		@touchend="touchEnd"
		:class="{ 'sliderType--1': props.sliderType == 1, 'sliderType--2': props.sliderType == 2 }"
	>
		<div
			class="slider__inner"
			:style="{ width: `${props.sliderType == 1 ? 100 * (props.count) + '%' : 'max-content'}`, transform: `translateX(${-100 * activeBulletIndex / props.count}%)` }"
		>
			<slot></slot>
		</div>
		<div class="slider__controls">
			<Horizontal
				class="slider__control slider__left"
				:class="{ 'slider__control--inactive': activeBulletIndex == 0 }"
				@click="prev"
			/>
			<Horizontal
				class="slider__control slider__right"
				:class="{ 'slider__control--inactive': activeBulletIndex == props.count - 1 }"
				@click="next"
			/>
		</div>
		<div class="slider__progress">
			<div
				class="slider__bullet"
				v-for="(bullet, counter) in props.count"
				:class="{ 'slider__bullet--active': counter == activeBulletIndex }"
				@click="activeBulletIndex = counter"
			></div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Horizontal from './icons/horizontal.vue';

let props = defineProps(['sliderType', 'count'])
let activeBulletIndex = ref(0)
let touch = ref()

const next = () => {
  // TODO if props.sliderType == 2 do check for visual place also (to stop sliding not on last element but when visually no need for scroll) ?
  if (activeBulletIndex.value !== props.count - 1) activeBulletIndex.value++;
}

const prev = () => {
  if (activeBulletIndex.value !== 0) activeBulletIndex.value--;
}

const touchStart = (e) => {
  if (props.sliderType !== 1) return;
  console.log(e.touches[0].pageX)
  touch.value = e.touches[0].pageX;
}

const touchEnd = (e) => {
  if (props.sliderType !== 1) return;
  if (e.changedTouches[0].pageX > touch.value) prev()
  else next()
  touch.value = null;
}
</script>

<style lang="scss" scoped>
.slider {
  position: relative;

  &Type--1 {
    overflow: hidden;
    .slider {
      &__inner {
        overflow: hidden;
        display: flex;
        height: 100%;
        transition: 1s ease-in-out;
      }

      &__control {
        width: 40px;
        height: 40px;
        padding: 11px;
        border-radius: 100%;
        background-color: #ffffff50;
        color: #fff;
        opacity: 1;
        transition: .3s ease-in-out;
        cursor: pointer;

        &s {
          top: 0;
          left: 0;
          position: absolute;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 76px;
        }

        &--inactive {
          cursor: not-allowed;
          opacity: .5;
        }
      }

      &__left {
        transform: rotateZ(180deg);
      }

      &__progress {
        z-index: 10;
        position: absolute;
        bottom: 32px;
        left: 0;
        width: 100%;
        height: 8px;
        display: flex;
        flex-direction: row;
        gap: 8px;
        justify-content: center;
        align-items: center;
      }

      &__bullet {
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background-color: #fff;
        opacity: .2;
        transition: .3s ease-in-out;
        cursor: pointer;

        &--active {
          opacity: 1;
        }
      }
    }

    :deep(.slide) {
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
    }
  }

  &Type--2 {
    position: unset;

    .slider {
      &__inner {
        display: flex;
        flex-direction: row;
        gap: 20px;
        transition: .5s ease-in-out;
      }

      &__control {
        &s {
          position: absolute;
          right: 0;
          top: 15px;
          display: flex;
          flex-direction: row;
          gap: 24px;
        }

        width: 34px;
        height: 34px;
        border: 1px solid #000;
        border-radius: 100%;
        padding: 9px;
        color: black;
        cursor: pointer;
        transition: .3s ease-in-out;

        &--inactive {
          cursor: not-allowed;
          opacity: .5;
        }
      }

      &__left {
        transform: rotateZ(180deg);
      }

      &__progress {
        display: none;
      }
    }
  }
}

@media screen and (max-width: 876px) {
  .slide {
    &r {
      &__controls {
        display: none !important;
      }
    }

    &r {
      &Type--2 {
        width: 100% !important;

        .slider {
          &__inner {
            width: 100% !important;
            flex-direction: column;
          }
        }
      }
    }
  }
}
</style>
