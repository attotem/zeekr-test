<template>
  <section class="car-fr-line-slider-block">
    <!-- PC: title above the image -->
    <div v-if="!isMobileView" class="car-fr-line-slider-block__title-section">
      <h2 class="car-fr-line-slider-block__title">{{ getText(blockData.title) }}</h2>
    </div>

    <div
      class="car-fr-line-slider-block__wrapper"
      ref="wrapperEl"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
    >
      <div
        class="car-fr-line-slider-block__track"
        :class="{ 'is-animating': isAnimating }"
        :style="{ transform: `translateX(${trackTranslate}px)` }"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="car-fr-line-slider-block__slide"
        >
          <img
            class="car-fr-line-slider-block__image"
            :src="resolveImage(slide.image)"
            :alt="getText(blockData.title)"
            loading="lazy"
            draggable="false"
          />
        </div>
      </div>

      <!-- Mobile: overlay + title on top of image -->
      <template v-if="isMobileView">
        <div class="car-fr-line-slider-block__overlay" />
        <h2 class="car-fr-line-slider-block__title-mobile">{{ getText(blockData.title) }}</h2>
      </template>

      <!-- Arrows (PC only) -->
      <button
        v-if="!isMobileView"
        v-show="canPrev"
        type="button"
        class="car-fr-line-slider-block__arrow car-fr-line-slider-block__arrow--left"
        :style="{ backgroundImage: `url(${swiperLeftPng})` }"
        aria-label="Previous"
        @click="prev"
      />
      <button
        v-if="!isMobileView"
        v-show="canNext"
        type="button"
        class="car-fr-line-slider-block__arrow car-fr-line-slider-block__arrow--right"
        :style="{ backgroundImage: `url(${swiperRightPng})` }"
        aria-label="Next"
        @click="next"
      />

      <!-- Dots -->
      <div class="car-fr-line-slider-block__dots">
        <button
          v-for="(_, index) in slides"
          :key="index"
          type="button"
          class="car-fr-line-slider-block__dot"
          :class="{ 'is-active': index === activeIndex }"
          @click="goTo(index)"
          :aria-label="`Go to slide ${index + 1}`"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'
import { resolveMediaPath } from '@/utils/resolveMedia'
import swiperLeftPng from '@/assets/swiper_left.png'
import swiperRightPng from '@/assets/swiper_right.png'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '7x' }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})
const slides = computed(() => blockData.value.slides || [])
const activeIndex = ref(0)
const isAnimating = ref(false)
const trackTranslate = ref(0)
const wrapperEl = ref(null)
const isMobileView = ref(typeof window !== 'undefined' ? window.innerWidth <= 876 : false)
let resizeObserver = null

// Touch swipe
let touchStartX = 0
let touchCurrentX = 0
let isSwiping = false
const SWIPE_THRESHOLD = 50

function startDrag(x) {
  touchStartX = x
  touchCurrentX = x
  isSwiping = true
}

function moveDrag(x) {
  if (!isSwiping) return
  touchCurrentX = x
  const delta = touchCurrentX - touchStartX
  trackTranslate.value = -activeIndex.value * getWrapperWidth() + delta
}

function endDrag() {
  if (!isSwiping) return
  isSwiping = false
  const delta = touchCurrentX - touchStartX
  const prev = activeIndex.value
  if (delta < -SWIPE_THRESHOLD && canNext.value) activeIndex.value++
  else if (delta > SWIPE_THRESHOLD && canPrev.value) activeIndex.value--
  applyTranslate(activeIndex.value, activeIndex.value !== prev)
}

function onTouchStart(e) { startDrag(e.touches[0].clientX) }
function onTouchMove(e) { moveDrag(e.touches[0].clientX) }
function onTouchEnd() { endDrag() }

function onMouseDown(e) {
  if (e.target.closest('button')) return
  startDrag(e.clientX)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
function onMouseMove(e) { moveDrag(e.clientX) }
function onMouseUp() {
  endDrag()
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

watch(slides, (value) => {
  if (!value.length) activeIndex.value = 0
  else if (activeIndex.value > value.length - 1) activeIndex.value = 0
}, { immediate: true })

const canPrev = computed(() => activeIndex.value > 0)
const canNext = computed(() => activeIndex.value < slides.value.length - 1)

const getText = (value) => getTextByLang(value, langStore.activeLang)
const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })

function getWrapperWidth() {
  return wrapperEl.value?.getBoundingClientRect().width || window.innerWidth
}

function applyTranslate(index, animate = true) {
  if (!animate) {
    trackTranslate.value = -index * getWrapperWidth()
    return
  }
  isAnimating.value = true
  requestAnimationFrame(() => {
    trackTranslate.value = -index * getWrapperWidth()
    setTimeout(() => { isAnimating.value = false }, 520)
  })
}

function goTo(index) {
  if (isAnimating.value || index === activeIndex.value) return
  activeIndex.value = index
  applyTranslate(index)
}

function prev() {
  if (!canPrev.value || isAnimating.value) return
  goTo(activeIndex.value - 1)
}

function next() {
  if (!canNext.value || isAnimating.value) return
  goTo(activeIndex.value + 1)
}

const onResize = () => {
  isMobileView.value = window.innerWidth <= 876
  // Recalculate without animation to keep correct position
  trackTranslate.value = -activeIndex.value * getWrapperWidth()
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    onResize()
    window.addEventListener('resize', onResize)
    nextTick(() => {
      applyTranslate(activeIndex.value, false)
      resizeObserver = new ResizeObserver(() => {
        trackTranslate.value = -activeIndex.value * getWrapperWidth()
      })
      if (wrapperEl.value) resizeObserver.observe(wrapperEl.value)
    })
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', onResize)
  }
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style lang="scss" scoped>
.car-fr-line-slider-block {
  width: 100%;
  margin: 0;
  background: #fff;

  &__title-section {
    padding: 52px 24px 44px;
    text-align: center;
    background: #fff;
  }

  &__title {
    margin: 0;
    padding: 0;
    font-size: 52px;
    line-height: 1.15;
    font-weight: 400;
    background: linear-gradient(89deg, rgb(93, 75, 59) 0%, rgb(236, 194, 158) 56.39%, rgb(93, 75, 59) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  &__wrapper {
    position: relative;
    overflow: hidden;
    cursor: grab;
    user-select: none;

    &:active {
      cursor: grabbing;
    }
  }

  &__track {
    display: flex;
    will-change: transform;

    &.is-animating {
      transition: transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  }

  &__slide {
    flex: 0 0 100%;
    min-width: 100%;
    position: relative;
  }

  &__image {
    width: 100%;
    height: 86vh;
    min-height: 86vh;
    object-fit: cover;
    display: block;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.1) 35%, rgba(0, 0, 0, 0.45) 100%);
    pointer-events: none;
    z-index: 1;
  }

  &__title-mobile {
    position: absolute;
    top: 44px;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    padding: 0 12px;
    text-align: center;
    white-space: nowrap;
    background: linear-gradient(89deg, rgb(93, 75, 59) 0%, rgb(236, 194, 158) 56.39%, rgb(93, 75, 59) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    font-size: 24px;
    line-height: 1.5;
    font-weight: 400;
    max-width: 92%;
    z-index: 2;
  }

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border: none;
    padding: 0;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    cursor: pointer;
    z-index: 5;
    transition: transform 200ms ease, opacity 200ms ease;

    &:hover {
      transform: translateY(-50%) scale(1.1);
      opacity: 0.85;
    }

    &--left {
      left: 24px;
    }

    &--right {
      right: 24px;
    }
  }

  &__dots {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 2;
  }

  &__dot {
    width: 36px;
    height: 2px;
    border: none;
    padding: 0;
    background: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: background 200ms ease;

    &.is-active {
      background: #fff;
    }
  }
}

@media screen and (max-width: 876px) {
  .car-fr-line-slider-block {
    &__image {
      height: 82vh;
      min-height: 82vh;
    }
  }
}
</style>
