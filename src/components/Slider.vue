<template>
	<div
		class="slider"
		@touchstart="touchStart"
		@touchend="touchEnd"
		@mouseenter="pauseAutoSlide"
		@mouseleave="resumeAutoSlide"
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
				@click="prev"
			/>
			<Horizontal
				class="slider__control slider__right"
				@click="next"
			/>
		</div>
		<div class="slider__progress">
			<div
				class="slider__bullet"
				v-for="(bullet, counter) in props.count"
				:class="{ 'slider__bullet--active': counter == activeBulletIndex }"
				@click="goToSlide(counter)"
			></div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, nextTick } from 'vue';
import Horizontal from './icons/horizontal.vue';

let props = defineProps(['sliderType', 'count'])
let realIndex = ref(0) // Реальний індекс для безперервного перелистування
let touch = ref()
let autoSlideInterval = null
let isPaused = ref(false)
let isTransitioning = ref(false)

// Computed для відображення індексу (завжди в межах 0..count-1)
const activeBulletIndex = computed(() => {
  return realIndex.value % props.count;
})

const next = () => {
  realIndex.value++;
  
  // Пауза при ручному переключенні
  if (props.sliderType === 1) {
    pauseAutoSlide();
    setTimeout(() => {
      resumeAutoSlide();
    }, 5000);
  }
}

const prev = () => {
  if (realIndex.value > 0) {
    realIndex.value--;
  } else {
    realIndex.value = props.count - 1;
  }
  
  if (props.sliderType === 1) {
    pauseAutoSlide();
    setTimeout(() => {
      resumeAutoSlide();
    }, 5000);
  }
}

const goToSlide = (index) => {
  const currentActive = realIndex.value % props.count;
  
  if (index > currentActive) {
    realIndex.value = realIndex.value + (index - currentActive);
  } else if (index < currentActive) {
    realIndex.value = realIndex.value - (currentActive - index);
  } else {
    realIndex.value = Math.floor(realIndex.value / props.count) * props.count + index;
  }
  
  if (props.sliderType === 1) {
    pauseAutoSlide();
    setTimeout(() => {
      resumeAutoSlide();
    }, 5000);
  }
}

const touchStart = (e) => {
  if (props.sliderType !== 1) return;
  touch.value = e.touches[0].pageX;
}

const touchEnd = (e) => {
  if (props.sliderType !== 1) return;
  if (e.changedTouches[0].pageX > touch.value) prev()
  else next()
  touch.value = null;
  // Пауза при свайпі
  pauseAutoSlide();
  setTimeout(() => {
    resumeAutoSlide();
  }, 5000);
}

const startAutoSlide = () => {
  if (props.sliderType !== 1) return;
  
  autoSlideInterval = setInterval(() => {
    if (!isPaused.value) {
      const currentActive = realIndex.value % props.count;
      realIndex.value++;
      const newActive = realIndex.value % props.count;
      
      // Якщо переходимо з останнього на перший, робимо миттєвий перехід
      if (currentActive === props.count - 1 && newActive === 0) {
        isTransitioning.value = true;
        nextTick(() => {
          const inner = document.querySelector('.sliderType--1 .slider__inner');
          if (inner) {
            // Миттєвий перехід без анімації
            inner.style.transition = 'none';
            // Після миттєвого переходу повертаємо анімацію
            setTimeout(() => {
              if (inner) {
                inner.style.transition = '';
              }
              isTransitioning.value = false;
            }, 50);
          } else {
            isTransitioning.value = false;
          }
        });
      }
    }
  }, 3000);
}

const pauseAutoSlide = () => {
  isPaused.value = true;
}

const resumeAutoSlide = () => {
  isPaused.value = false;
}

onMounted(() => {
  if (props.sliderType === 1) {
    startAutoSlide();
  }
});

onBeforeUnmount(() => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
  }
});
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
