<template>
  <section
    class="car-slider-block"
    :class="{ 'car-slider-block--desktop-static': isDesktopStaticMode }"
    :style="blockData.background ? { background: blockData.background } : {}"
  >
    <div class="car-slider-block__inner">
      <h2 class="car-slider-block__title">{{ getText(blockData.title) }}</h2>
      <p v-if="getText(blockData.subtitle)" class="car-slider-block__subtitle">{{ getText(blockData.subtitle) }}</p>

      <div class="car-slider-block__slider">
        <button
          type="button"
          class="car-slider-block__arrow car-slider-block__arrow--left"
          aria-label="Previous"
          @click="prev"
          v-show="canPrev"
          :style="{ backgroundImage: `url(${swiperLeftPng})` }"
        >
        </button>

        <div
          ref="viewportEl"
          class="car-slider-block__viewport"
          @touchstart.passive="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div
            ref="trackEl"
            class="car-slider-block__track"
            :class="{ 'is-animating': isAnimating && !isDesktopStaticMode && !isTouching }"
            :style="{ transform: `translateX(${effectiveTrackTranslatePx}px)` }"
          >
            <div
              v-for="slot in visibleSlots"
              :key="slot.key"
              class="car-slider-block__slide"
              :class="slot.role"
              ref="slideEls"
            >
              <div class="car-slider-block__image-wrap">
                <img
                  v-if="slot.slide && !isVideo(slot.slide.image)"
                  :src="resolveImage(slot.slide.image)"
                  class="car-slider-block__image"
                  :alt="getText(slot.slide.caption)"
                  loading="eager"
                  decoding="sync"
                  fetchpriority="high"
                />
                <video
                  v-else-if="slot.slide && isVideo(slot.slide.image)"
                  :src="resolveImage(slot.slide.image)"
                  class="car-slider-block__video"
                  autoplay
                  muted
                  loop
                  playsinline
                ></video>
              </div>
              <div v-if="slot.slide && getText(slot.slide.title)" class="car-slider-block__slide-title">{{ getText(slot.slide.title) }}</div>
              <div class="car-slider-block__caption">{{ slot.slide ? getText(slot.slide.description || slot.slide.caption) : '' }}</div>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="car-slider-block__arrow car-slider-block__arrow--right"
          aria-label="Next"
          @click="next"
          v-show="canNext"
          :style="{ backgroundImage: `url(${swiperRightPng})` }"
        >
        </button>
      </div>

      <!-- Mobile dots -->
      <div v-if="isMobile && slides.length > 1" class="car-slider-block__dots">
        <button
          v-for="(_, i) in slides"
          :key="i"
          type="button"
          class="car-slider-block__dot"
          :class="{ 'car-slider-block__dot--active': active === i }"
          @click="setActiveIndex(i)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLangStore } from '@/stores/lang'
import { resolveMediaPath, pickResponsivePath } from '@/utils/resolveMedia'
import swiperLeftPng from '@/assets/swiper_left.png'
import swiperRightPng from '@/assets/swiper_right.png'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '7x' }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})
const slides = computed(() => blockData.value.slides || [])

const active = ref(0)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
const isMobile = computed(() => windowWidth.value <= 876)
const isDesktopStaticMode = computed(() => !isMobile.value && blockData.value.desktopStatic === true)

watch(slides, (s) => {
  if (!s?.length) active.value = 0
  else if (active.value > s.length - 1) active.value = 0
}, { immediate: true })



const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') return textObj
  if (typeof textObj === 'object' && textObj !== null) {
    const lang = langStore.activeLang
    if (lang && textObj[lang]) return textObj[lang]
    if (lang === 'uk' && textObj.ua) return textObj.ua
    if (lang === 'ua' && textObj.uk) return textObj.uk
    if (lang === 'zh' && (textObj.zh || textObj.cn)) return textObj.zh || textObj.cn
    return textObj.uk || textObj.ua || textObj.en || textObj.ru || textObj.zh || textObj.cn || ''
  }
  return ''
}

const isVideo = (image) => {
  const path = pickResponsivePath(image)
  if (!path || typeof path !== 'string') return false
  return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.mov')
}

const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })

// Track loaded images
const loadedImages = new Set()

// Preload image and wait for it to load
function preloadImage(src) {
  if (!src || loadedImages.has(src)) return Promise.resolve()
  
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      loadedImages.add(src)
      resolve()
    }
    img.onerror = () => {
      loadedImages.add(src) // Mark as attempted even on error
      resolve()
    }
    img.src = src
  })
}

onMounted(() => {
  // Preload all images in parallel without blocking rendering
  slides.value.forEach((s) => {
    const src = resolveImage(s.image)
    if (!src) return
    
    // Use link preload for better browser optimization
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = 'high'
    document.head.appendChild(link)
    
    // Preload in background without blocking
    preloadImage(src).finally(() => {
      // Remove link after image is loaded
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    })
  })
})

watch([active, slides], ([newActive, newSlides]) => {
  const len = newSlides.length
  if (!len) return
  
  // Preload visible and adjacent slides
  const imagesToPreload = []
  
  if (newActive > 0) {
    imagesToPreload.push(resolveImage(newSlides[newActive - 1].image))
  }
  imagesToPreload.push(resolveImage(newSlides[newActive].image))
  if (newActive < len - 1) {
    imagesToPreload.push(resolveImage(newSlides[newActive + 1].image))
  }
  
  // Preload one more ahead/behind
  if (newActive > 1) {
    imagesToPreload.push(resolveImage(newSlides[newActive - 2].image))
  }
  if (newActive < len - 2) {
    imagesToPreload.push(resolveImage(newSlides[newActive + 2].image))
  }
  
  // Preload all images
  imagesToPreload.forEach(src => {
    if (src) preloadImage(src)
  })
}, { immediate: true })

const canPrev = computed(() => !isDesktopStaticMode.value && active.value > 0)
const canNext = computed(() => !isDesktopStaticMode.value && active.value < slides.value.length - 1)

const isAnimating = ref(false)
const trackTranslatePx = ref(0)
const effectiveTrackTranslatePx = computed(() => (isDesktopStaticMode.value ? 0 : trackTranslatePx.value))

const viewportEl = ref(null)
const trackEl = ref(null)
const slideEls = ref([])
let resizeObserver = null
let rafId = 0

function getGapPx() {
  const el = trackEl.value
  if (!el) return 0
  const gap = getComputedStyle(el).gap || '0px'
  const n = parseFloat(gap)
  return Number.isFinite(n) ? n : 0
}

function getSlideWidthPx() {
  const el = slideEls.value?.find(Boolean)
  if (!el) return 0
  const w = el.getBoundingClientRect().width
  return w || 0
}

function getViewportWidthPx() {
  const el = viewportEl.value
  if (!el) return 0
  return el.getBoundingClientRect().width || 0
}


function translateToActiveSlide() {
  // For mobile: center the active slide directly
  const vw = getViewportWidthPx()
  const sw = getSlideWidthPx()
  const gap = getGapPx()
  if (!vw || !sw) return 0
  const xCenter = vw / 2
  const slideCenter = active.value * (sw + gap) + sw / 2
  return xCenter - slideCenter
}

function recenterTrack() {
  if (isDesktopStaticMode.value) {
    trackTranslatePx.value = 0
    return
  }
  trackTranslatePx.value = translateToActiveSlide()
}

function scheduleRecenter() {
  // Don't recenter during animation
  if (isAnimating.value) return
  
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    if (!isAnimating.value) {
      recenterTrack()
    }
  })
}



onMounted(() => {
  if (typeof window !== 'undefined') {
    const handleResize = () => {
      windowWidth.value = window.innerWidth
    }
    window.addEventListener('resize', handleResize)
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
    })
  }
})

const visibleSlots = computed(() => {
  // Static desktop mode: render all slides in one row
  if (isDesktopStaticMode.value) {
    return slides.value.map((slide, index) => ({
      key: `static-${index}`,
      role: 'is-static',
      slide
    }))
  }

  // Mobile and normal desktop: all slides always rendered with stable keys
  return slides.value.map((slide, index) => ({
    key: `slide-${index}`,
    role: index === active.value ? 'is-active'
        : index === active.value - 1 ? 'is-left'
        : index === active.value + 1 ? 'is-right'
        : 'is-far',
    slide
  }))
})

watch([slides, active], () => {
  // Only recenter if not animating (will be handled by transitionend)
  if (!isAnimating.value && slides.value.length > 0) {
    scheduleRecenter()
  }
}, { immediate: true })

onMounted(() => {
  // center on first render immediately
  nextTick(() => {
    recenterTrack()
    // keep centered on resizes
    resizeObserver = new ResizeObserver(() => scheduleRecenter())
    if (viewportEl.value) resizeObserver.observe(viewportEl.value)
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  if (resizeObserver) resizeObserver.disconnect()
})


// Touch / swipe support
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchCurrentX = ref(0)
const isTouching = ref(false)
const touchLocked = ref(false) // locked to vertical scroll — don't intercept

function onTouchStart(e) {
  if (isDesktopStaticMode.value || isAnimating.value) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  touchCurrentX.value = e.touches[0].clientX
  isTouching.value = true
  touchLocked.value = false
}

function onTouchMove(e) {
  if (!isTouching.value || isDesktopStaticMode.value) return
  const dx = e.touches[0].clientX - touchStartX.value
  const dy = e.touches[0].clientY - touchStartY.value

  // If first significant movement is vertical — let page scroll
  if (!touchLocked.value && Math.abs(dy) > Math.abs(dx) + 4) {
    isTouching.value = false
    return
  }
  touchLocked.value = true
  touchCurrentX.value = e.touches[0].clientX

  if (isMobile.value) {
    const resistance = (dx > 0 && active.value === 0) || (dx < 0 && active.value === slides.value.length - 1) ? 0.25 : 1
    trackTranslatePx.value = translateToActiveSlide() + dx * resistance
  }
}

function onTouchEnd() {
  if (!isTouching.value) return
  isTouching.value = false
  touchLocked.value = false

  const delta = touchCurrentX.value - touchStartX.value
  const threshold = 48

  if (delta < -threshold && canNext.value) animateTo(active.value + 1)
  else if (delta > threshold && canPrev.value) animateTo(active.value - 1)
  else recenterTrack()
}

function setActiveIndex(index) {
  const clamped = Math.max(0, Math.min(index, slides.value.length - 1))
  animateTo(clamped)
}

function animateTo(targetIndex) {
  if (isAnimating.value) return
  isAnimating.value = true
  active.value = targetIndex

  // Wait for Vue to flush DOM (active change → role classes update),
  // then wait one paint frame before changing transform so CSS transition fires
  nextTick(() => {
    requestAnimationFrame(() => {
      recenterTrack()
      setTimeout(() => { isAnimating.value = false }, 420)
    })
  })
}

const prev = () => {
  if (!canPrev.value || isAnimating.value) return
  animateTo(active.value - 1)
}

const next = () => {
  if (!canNext.value || isAnimating.value) return
  animateTo(active.value + 1)
}
</script>

<style lang="scss" scoped>
.car-slider-block {
  background: rgb(235, 232, 227);
  overflow: hidden;
  padding: 64px 0 72px;
  opacity: 1;
  animation: fadeIn 0.3s ease-in;

  &__inner {
    width: 100%;
    margin: 0 auto;
    padding: 0 200px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.2;
    font-weight: 400;
    margin: 0 0 12px;
    color: #111;
    text-align: center;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
    margin: 0 0 44px;
    color: rgba(17, 17, 17, 0.6);
    text-align: center;
  }

  &__slide-title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #111;
    margin: 0 0 8px;
  }

  &__slider {
    position: relative;
  }

  &__viewport {
    width: 100%;
    overflow: hidden;
    min-height: 400px;
  }

  &__track {
    display: flex;
    gap: 22px;
    align-items: center;
    will-change: transform;
    transform: translateX(0px);
    padding-left: calc((100% - (4 * calc((100% - 66px) / 4) + 3 * 22px)) / 2);
  }
  

  &__track.is-animating {
    transition: transform 380ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  &__dots {
    display: none;
  }

  &__slide {
    flex: 0 0 calc((100% - 66px) / 4);
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: opacity 250ms ease, transform 250ms ease;
  }

  &__image-wrap {
    width: 100%;
    aspect-ratio: 16 / 9;
    background: rgba(255, 255, 255, 0.35);
    overflow: hidden;
    min-height: 42vh;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transform: translateZ(0);
    backface-visibility: hidden;
    will-change: opacity;
    opacity: 1;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

&__image-wrap {
    will-change: contents;
  }

  &__caption {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.4;
    color: rgba(17, 17, 17, 0.75);
  }

  .is-active {
    opacity: 1;
    transform: scale(1);

    .car-slider-block__caption {
      color: rgba(17, 17, 17, 0.95);
      font-size: 18px;
    }
  }

  .is-left {
    opacity: 0.2;
    transform: scale(0.95);
  }

  .is-right,
  .is-right-right {
    opacity: 0.35;
    transform: scale(1);
  }

  .is-far {
    opacity: 0;
    pointer-events: none;
  }

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background-color: rgba(255, 255, 255, 0.0);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0;
    line-height: 0;
    transition: background 200ms ease, transform 200ms ease;
    z-index: 5;

    &:hover {
      transform: translateY(-50%) scale(1.05);
    }
  }

  &__arrow--left {
    left: calc(50% - 540px);
  }

  &__arrow--right {
    right: calc(50% - 540px);
  }

  &--desktop-static {
    .car-slider-block__viewport {
      min-height: 0;
      overflow: visible;
    }

    .car-slider-block__track {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      padding-left: 0;
      gap: 22px;
      transform: none !important;
      align-items: start;
    }

    .car-slider-block__slide {
      flex: initial;
      opacity: 1;
      transform: none;
    }

    .car-slider-block__image-wrap {
      aspect-ratio: auto;
      background: transparent;
      overflow: visible;
      min-height: 0;
    }

    .car-slider-block__image {
      width: 100%;
      height: auto;
      image-rendering: crisp-edges;
    }

    .car-slider-block__caption {
      color: rgba(17, 17, 17, 0.95);
      font-size: 18px;
    }

    .car-slider-block__arrow {
      display: none;
    }
  }
}

@media screen and (max-width: 876px) {
  .car-slider-block {
    width: 100%;
    margin: 0;
    padding: 40px 0 52px;

    &__inner {
      padding: 0;
    }

    &__title {
      font-size: 28px;
      margin-bottom: 8px;
      padding: 0 16px;
    }

    &__subtitle {
      font-size: 14px;
      margin-bottom: 28px;
      padding: 0 16px;
    }

    &__track {
      gap: 0;
      transform: translateX(0px);
      padding-left: 0;
    }

    &__slide {
      flex: 0 0 100%;
      min-width: 0;
    }

    &__slide-title {
      padding: 12px 16px 0;
      font-size: 16px;
    }

    .car-slider-block__caption {
      font-size: 14px;
      line-height: 1.5;
      padding: 6px 16px 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }

    .is-active {
      .car-slider-block__caption {
        font-size: 14px;
      }
    }

    .is-active {
      opacity: 1;
    }

    .is-left,
    .is-right,
    .is-far {
      opacity: 0.4;
    }

    &__arrow {
      width: 36px;
      height: 36px;
      background-color: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.14);
    }

    &__arrow--left {
      left: 12px;
    }

    &__arrow--right {
      right: 12px;
    }

    &__dots {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 20px;
    }

    &__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      border: none;
      background: rgba(17, 17, 17, 0.2);
      padding: 0;
      cursor: pointer;
      transition: background 250ms ease, transform 250ms ease, width 250ms ease;

      &--active {
        background: #111;
        width: 18px;
        border-radius: 3px;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

