<template>
  <section class="car-inside-block">
    <div class="car-inside-block__image-wrap">
      <div
        class="car-inside-block__image car-inside-block__image--layer1"
        :style="{ 
          backgroundImage: currentImageUrl1,
          opacity: layer1Opacity
        }"
      ></div>
      <div
        class="car-inside-block__image car-inside-block__image--layer2"
        :style="{ 
          backgroundImage: currentImageUrl2,
          opacity: layer2Opacity
        }"
      ></div>
    </div>

    <div class="car-inside-block__bottom">
      <div class="car-inside-block__colors">
        <button
          v-for="opt in options"
          :key="opt.id"
          type="button"
          class="car-inside-block__color"
          :class="{ 'car-inside-block__color--active': activeId === opt.id }"
          @click="activeId = opt.id"
        >
          <img
            :src="getColorIcon(opt.id)"
            :alt="getText(opt.name)"
            class="car-inside-block__color-image"
          />
        </button>
      </div>

      <div class="car-inside-block__text">
        <div class="car-inside-block__title">{{ getText(blockData.title) }}</div>
        <div class="car-inside-block__subtitle">{{ getText(activeOption?.description) }}</div>
        <div class="car-inside-block__note">{{ getText(blockData.note) }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useLangStore } from '@/stores/lang'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '7x' }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})
const options = computed(() => blockData.value.options || [])

const activeId = ref('')

watch(options, (opts) => {
  if (opts?.length && !activeId.value) activeId.value = opts[0].id
}, { immediate: true })

const activeOption = computed(() => options.value.find(o => o.id === activeId.value) || options.value[0])

const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') return textObj
  if (typeof textObj === 'object' && textObj !== null) {
    return textObj[langStore.activeLang] || textObj.ua || textObj.en || ''
  }
  return ''
}

const getInsideImage = (id) => {
  // Try both formats: inside/inside_${id}.webp and ${carId}_inside_${id}.webp
  const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
  const path1 = `${basePath}/${props.carId}/inside/inside_${id}.webp`
  const path2 = `${basePath}/${props.carId}/${props.carId}_inside_${id}.webp`
  // For now, return path2 for 001 and 9x, path1 for others
  if (props.carId === '001' || props.carId === '9x') {
    return path2
  }
  return path1
}
const getColorIcon = (id) => {
  // Map biege to beige for icon
  const iconId = id === 'biege' ? 'beige' : id
  return `/src/assets/colors/${iconId}.webp`
}

// Preload images and store Image objects
const preloadedImages = ref({})

onMounted(() => {
  options.value.forEach(o => {
    const img = new Image()
    img.onload = () => {
      preloadedImages.value[o.id] = img
    }
    img.src = getInsideImage(o.id)
  })
})

const currentSrc = computed(() => {
  const id = activeId.value || options.value?.[0]?.id
  if (!id) return ''
  return getInsideImage(id)
})

// Crossfade: two layers with smooth opacity transition
const currentLayer = ref('layer1')
const layer1Src = ref('')
const layer2Src = ref('')
const layer1Opacity = ref(1)
const layer2Opacity = ref(0)
let transitionTimer = null
let pendingTransition = null

const currentImageUrl1 = computed(() => (layer1Src.value ? `url(${layer1Src.value})` : 'none'))
const currentImageUrl2 = computed(() => (layer2Src.value ? `url(${layer2Src.value})` : 'none'))

// Initialize first image when activeId is set
watch([activeId, options], ([id, opts]) => {
  if (opts?.length && id && !layer1Src.value) {
    const firstSrc = getInsideImage(id)
    layer1Src.value = firstSrc
    layer1Opacity.value = 1
    layer2Opacity.value = 0
    currentLayer.value = 'layer1'
  }
}, { immediate: true })

watch(currentSrc, (newSrc, oldSrc) => {
  if (!newSrc || newSrc === oldSrc) return
  
  // Cancel any pending transitions
  if (transitionTimer) {
    clearTimeout(transitionTimer)
    transitionTimer = null
  }
  if (pendingTransition) {
    clearTimeout(pendingTransition)
    pendingTransition = null
  }
  
  // Store the source we want to transition to
  const targetSrc = newSrc
  const targetId = activeId.value
  
  // Ensure image is preloaded before transition
  const checkAndTransition = () => {
    // Double-check this is still the current source
    if (currentSrc.value !== targetSrc) return
    
    // Cancel any pending transition
    if (transitionTimer) {
      clearTimeout(transitionTimer)
      transitionTimer = null
    }
    
    performTransition(targetSrc)
  }
  
  if (preloadedImages.value[targetId] && preloadedImages.value[targetId].complete) {
    // Image already loaded, transition immediately
    pendingTransition = setTimeout(checkAndTransition, 0)
  } else {
    // Wait for image to load
    const img = new Image()
    img.onload = () => {
      preloadedImages.value[targetId] = img
      checkAndTransition()
    }
    img.onerror = () => {
      // Even if error, try to transition (image might be cached)
      checkAndTransition()
    }
    img.src = targetSrc
  }
})

function performTransition(newSrc) {
  // Double-check this is still the current source
  if (currentSrc.value !== newSrc) return
  
  // Cancel any pending cleanup
  if (transitionTimer) {
    clearTimeout(transitionTimer)
    transitionTimer = null
  }
  
  if (currentLayer.value === 'layer1') {
    // Show new image on layer2, fade it in while fading out layer1
    layer2Src.value = newSrc
    layer2Opacity.value = 0
    
    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Double-check again before starting transition
        if (currentSrc.value !== newSrc) return
        
        layer1Opacity.value = 0
        layer2Opacity.value = 1
        currentLayer.value = 'layer2'
        
        // Clear layer1 after transition completes
        transitionTimer = setTimeout(() => {
          if (currentLayer.value === 'layer2' && layer2Src.value === newSrc) {
            layer1Src.value = ''
            layer1Opacity.value = 1
          }
        }, 650)
      })
    })
  } else {
    // Show new image on layer1, fade it in while fading out layer2
    layer1Src.value = newSrc
    layer1Opacity.value = 0
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Double-check again before starting transition
        if (currentSrc.value !== newSrc) return
        
        layer2Opacity.value = 0
        layer1Opacity.value = 1
        currentLayer.value = 'layer1'
        
        // Clear layer2 after transition completes
        transitionTimer = setTimeout(() => {
          if (currentLayer.value === 'layer1' && layer1Src.value === newSrc) {
            layer2Src.value = ''
            layer2Opacity.value = 1
          }
        }, 650)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.car-inside-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #fff;

  &__image-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  &__image {
    position: absolute;
    inset: 0;
    background-color: #f5f5f5;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    will-change: opacity;
    transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1);
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }

  &__bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.8) 55%,
      transparent 100%
    );
    z-index: 10;
  }

  &__colors {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
  }

  &__color {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 0.5px solid transparent;
    cursor: pointer;
    background: transparent;
    padding: 0;
    overflow: hidden;
    filter: drop-shadow(0 1.5px 3px rgba(0, 0, 0, 0.25));
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.08);
    }

    &--active {
      border: 0.5px solid #fff;
    }
  }

  &__color-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }

  &__text {
    text-align: center;
    max-width: 900px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.3;
    color: #111;
    margin-bottom: 8px;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    margin-bottom: 6px;
  }

  &__note {
    font-size: 12px;
    color: #999;
    line-height: 1.4;
  }
}

@media screen and (max-width: 876px) {
  .car-inside-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    height: 100vh;

    &__bottom {
      padding: 24px 16px;
    }

    &__colors {
      gap: 12px;
    }

    &__color {
      width: 28px;
      height: 28px;
    }
  }
}
</style>

