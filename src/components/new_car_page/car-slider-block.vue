<template>
  <section class="car-slider-block">
    <div class="car-slider-block__inner">
      <h2 class="car-slider-block__title">{{ getText(blockData.title) }}</h2>

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

        <div ref="viewportEl" class="car-slider-block__viewport">
          <div
            ref="trackEl"
            class="car-slider-block__track"
            :class="{ 'is-animating': isAnimating }"
            :style="{ transform: `translateX(${trackTranslatePx}px)` }"
            @transitionend="handleTransitionEnd"
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
              <div class="car-slider-block__caption">{{ slot.slide ? getText(slot.slide.caption) : '' }}</div>
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

// Preload all images immediately for smooth transitions (non-blocking)
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

const canPrev = computed(() => active.value > 0)
const canNext = computed(() => active.value < slides.value.length - 1)

const isAnimating = ref(false)
const pendingDir = ref(null) // 'prev' | 'next' | null
const trackTranslatePx = ref(0)

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

function translateToCenterSlot(slotIndex) {
  // slotIndex: 0=left, 1=center(active), 2=right, 3=right-right
  const vw = getViewportWidthPx()
  const sw = getSlideWidthPx()
  const gap = getGapPx()
  if (!vw || !sw) return 0
  const xCenter = vw / 2
  const slotCenter = slotIndex * (sw + gap) + sw / 2
  return xCenter - slotCenter
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

function recenterTrack(skipAnimation = false) {
  // If skipAnimation is true, we're recentering after transition
  // so isAnimating should already be false
  if (isMobile.value) {
    // On mobile, center the active slide directly
    trackTranslatePx.value = translateToActiveSlide()
  } else {
    // On desktop, keep the active slide (middle slot) centered inside viewport
    trackTranslatePx.value = translateToCenterSlot(1)
  }
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

function handleTransitionEnd(e) {
  if (!isAnimating.value) return
  if (e.propertyName !== 'transform') return

  const len = slides.value.length
  if (!len) {
    isAnimating.value = false
    pendingDir.value = null
    recenterTrack()
    return
  }

  // On mobile, update active and recenter
  if (isMobile.value) {
    const dir = pendingDir.value
    if (dir === 'next') active.value = Math.min(len - 1, active.value + 1)
    if (dir === 'prev') active.value = Math.max(0, active.value - 1)
    
    isAnimating.value = false
    pendingDir.value = null
    recenterTrack(true)
    return
  }

  // Desktop: Update active index first
  const dir = pendingDir.value
  if (dir === 'next') active.value = Math.min(len - 1, active.value + 1)
  if (dir === 'prev') active.value = Math.max(0, active.value - 1)

  // Wait for DOM to update with new slots, then recenter
  nextTick(() => {
    isAnimating.value = false
    pendingDir.value = null
    
    // Recenter without animation to keep 3 images visible
    recenterTrack(true)
  })
}

const leftIndex = computed(() => (active.value > 0 ? active.value - 1 : null))
const rightIndex = computed(() => (active.value < slides.value.length - 1 ? active.value + 1 : null))
const rightRightIndex = computed(() => (active.value < slides.value.length - 2 ? active.value + 2 : null))

const leftSlide = computed(() => (leftIndex.value === null ? null : slides.value[leftIndex.value]))
const activeSlide = computed(() => (slides.value.length ? slides.value[active.value] : null))
const rightSlide = computed(() => (rightIndex.value === null ? null : slides.value[rightIndex.value]))
const rightRightSlide = computed(() => (rightRightIndex.value === null ? null : slides.value[rightRightIndex.value]))

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)

const isMobile = computed(() => windowWidth.value <= 876)

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
  // On mobile, show all slides for proper sliding
  if (isMobile.value) {
    return slides.value.map((slide, index) => ({
      key: `slide-${index}-${active.value}`,
      role: index === active.value ? 'is-active' : 'is-hidden',
      slide: slide
    }))
  }
  
  // On desktop, show 3 slots (left, active, right) - always show 3
  const slots = []
  
  // Left slot
  if (leftIndex.value !== null) {
    slots.push({ 
      key: `left-${leftIndex.value}-${active.value}`, 
      role: 'is-left', 
      slide: leftSlide.value 
    })
  } else {
    slots.push({ 
      key: `left-empty-${active.value}`, 
      role: 'is-empty', 
      slide: null 
    })
  }
  
  // Active slot
  slots.push({ 
    key: `active-${active.value}`, 
    role: 'is-active', 
    slide: activeSlide.value 
  })
  
  // Right slot
  if (rightIndex.value !== null) {
    slots.push({ 
      key: `right-${rightIndex.value}-${active.value}`, 
      role: 'is-right', 
      slide: rightSlide.value 
    })
  } else {
    slots.push({ 
      key: `right-empty-${active.value}`, 
      role: 'is-empty', 
      slide: null 
    })
  }
  
  return slots
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

// Preload image before animation and ensure it's ready
async function preloadImageForIndex(index) {
  if (index < 0 || index >= slides.value.length) return
  const src = resolveImage(slides.value[index].image)
  if (!src) return
  
  // Check if already loaded
  if (loadedImages.has(src)) {
    // Double check by verifying image is in cache
    const img = new Image()
    img.src = src
    if (img.complete) return
  }
  
  // Use link preload for immediate browser action
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  link.fetchPriority = 'high'
  document.head.appendChild(link)
  
  await preloadImage(src).finally(() => {
    if (document.head.contains(link)) {
      document.head.removeChild(link)
    }
  })
  
  // Additional check - ensure image is really loaded
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve() // Continue even on error
    img.src = src
    // Timeout after 100ms to not block too long
    setTimeout(resolve, 100)
  })
}

// override prev/next to use pixel animation targets
const prev = async () => {
  if (!canPrev.value || isAnimating.value) return
  
  // Preload image before animation
  const targetIndex = active.value - 1
  await preloadImageForIndex(targetIndex)
  
  pendingDir.value = 'prev'
  isAnimating.value = true
  
  if (isMobile.value) {
    // On mobile, calculate target position for previous slide
    const vw = getViewportWidthPx()
    const sw = getSlideWidthPx()
    const gap = getGapPx()
    if (vw && sw) {
      const xCenter = vw / 2
      const targetSlideCenter = targetIndex * (sw + gap) + sw / 2
      trackTranslatePx.value = xCenter - targetSlideCenter
    }
  } else {
    // On desktop, animate so left slot moves into center
    trackTranslatePx.value = translateToCenterSlot(0)
  }
}

const next = async () => {
  if (!canNext.value || isAnimating.value) return
  
  // Preload image before animation
  const targetIndex = active.value + 1
  await preloadImageForIndex(targetIndex)
  
  pendingDir.value = 'next'
  isAnimating.value = true
  
  if (isMobile.value) {
    // On mobile, calculate target position for next slide
    const vw = getViewportWidthPx()
    const sw = getSlideWidthPx()
    const gap = getGapPx()
    if (vw && sw) {
      const xCenter = vw / 2
      const targetSlideCenter = targetIndex * (sw + gap) + sw / 2
      trackTranslatePx.value = xCenter - targetSlideCenter
    }
  } else {
    // Wait for DOM to update with new slide data
    await nextTick()
    
    // Small delay to ensure image is rendered
    await new Promise(resolve => requestAnimationFrame(resolve))
    
    // animate so right slot moves into center
    trackTranslatePx.value = translateToCenterSlot(2)
  }
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
    padding: 0 20px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.2;
    font-weight: 400;
    margin: 0 0 44px;
    color: #111;
    text-align: center;
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
  
  &__track:has(.is-hidden) {
    padding-left: 0;
  }

  &__track.is-animating {
    transition: transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
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

  &__slide.is-empty &__image {
    opacity: 0;
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

  .is-empty {
    opacity: 0;
    transform: scale(1);
    pointer-events: none;
  }

  .is-hidden {
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
}

@media screen and (max-width: 876px) {
  .car-slider-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0 52px;

    &__inner {
      padding: 0 16px;
    }

    &__title {
      font-size: 28px;
      margin-bottom: 28px;
    }

    &__track {
      gap: 18px;
      transform: translateX(0px);
    }

    &__slide {
      flex: 0 0 100%;
      min-width: 0;
    }

    &__track {
      padding-left: 0;
    }

    .car-slider-block__caption {
      font-size: 14px;
      line-height: 1.4;
      padding: 8px 8px 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }

    .is-left,
    .is-right,
    .is-empty {
      display: none;
    }
    
    .is-hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    .is-active {
      opacity: 1;
    }

    &__arrow--left {
      left: 8px;
    }

    &__arrow--right {
      right: 8px;
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

