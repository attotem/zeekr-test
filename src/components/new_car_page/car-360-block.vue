<template>
  <section class="car-360-block">
    <!-- 360 Image Viewer -->
    <div
      ref="viewerElement"
      class="car-360-block__viewer"
      :style="{ 
        backgroundImage: currentImageUrl,
        cursor: isDragging ? 'grabbing' : `url(${cursor360Svg.value}) 16 16, grab`
      }"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchmove.prevent="handleTouchMove"
      @touchstart.prevent="handleTouchStart"
      @touchend.prevent="handleMouseUp"
    >
      <div class="car-360-block__debug" v-if="false">
        Frame: {{ Math.round(currentFrame) }} / 35<br>
        Dragging: {{ isDragging ? 'Yes' : 'No' }}<br>
        Color: {{ activeColor }}
      </div>
    </div>

    <!-- Bottom Section: Colors and Description -->
    <div class="car-360-block__bottom">
      <!-- Color Selector -->
      <div class="car-360-block__colors">
        <button
          v-for="color in colors"
          :key="color.id"
          type="button"
          class="car-360-block__color"
          :class="{ 'car-360-block__color--active': activeColor === color.id }"
          @click="selectColor(color.id)"
        >
          <img
            :src="getColorImagePath(color.id)"
            :alt="getText(color.name)"
            class="car-360-block__color-image"
          />
          <span class="car-360-block__color-name">{{ getText(color.name) }}</span>
        </button>
      </div>

      <!-- Color Description -->
      <div
        v-if="activeColorData.description"
        class="car-360-block__description"
      >
        <p class="car-360-block__description-text">{{ getText(activeColorData.description) }}</p>
        <p class="car-360-block__description-note">{{ getText(blockData.note) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useLangStore } from '@/stores/lang'
import isMobile from '@/composables/isMobile'

// Get cursor SVG as data URI
// Using data URI ensures the cursor works in all browsers
const cursor360Svg = computed(() => {
  // Simplified SVG cursor optimized for cursor use (32x32)
  // Based on 360_cursor.svg file
  const svgContent = `<svg width="32" height="32" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M391.502,210.725c-5.311-1.52-10.846,1.555-12.364,6.865c-1.519,5.31,1.555,10.846,6.864,12.364C431.646,243.008,460,261.942,460,279.367c0,12.752-15.51,26.749-42.552,38.402c-29.752,12.82-71.958,22.2-118.891,26.425l-40.963-0.555c-0.047,0-0.093-0.001-0.139-0.001c-5.46,0-9.922,4.389-9.996,9.865c-0.075,5.522,4.342,10.06,9.863,10.134l41.479,0.562c0.046,0,0.091,0.001,0.136,0.001c0.297,0,0.593-0.013,0.888-0.039c49.196-4.386,93.779-14.339,125.538-28.024C470.521,316.676,480,294.524,480,279.367C480,251.424,448.57,227.046,391.502,210.725z M96.879,199.333c-5.522,0-10,4.477-10,10c0,5.523,4.478,10,10,10H138v41.333H96.879c-5.522,0-10,4.477-10,10s4.478,10,10,10H148c5.523,0,10-4.477,10-10V148c0-5.523-4.477-10-10-10H96.879c-5.522,0-10,4.477-10,10s4.478,10,10,10H138v41.333H96.879z M188.879,280.667h61.334c5.522,0,10-4.477,10-10v-61.333c0-5.523-4.477-10-10-10h-51.334V158H240c5.523,0,10-4.477,10-10s-4.477-10-10-10h-51.121c-5.523,0-10,4.477-10,10v122.667C178.879,276.19,183.356,280.667,188.879,280.667z M291.121,280.667h61.334c5.522,0,10-4.477,10-10V148c0-5.523-4.478-10-10-10h-61.334c-5.522,0-10,4.477-10,10v122.667C281.121,276.19,285.599,280.667,291.121,280.667z M182.857,305.537c-3.567-4.216-9.877-4.743-14.093-1.176c-4.217,3.567-4.743,9.876-1.177,14.093l22.366,26.44c-47.196-3.599-89.941-12.249-121.37-24.65C37.708,308.06,20,293.162,20,279.367c0-16.018,23.736-33.28,63.493-46.176c5.254-1.704,8.131-7.344,6.427-12.598c-1.703-5.253-7.345-8.13-12.597-6.427c-23.129,7.502-41.47,16.427-54.515,26.526C7.674,252.412,0,265.423,0,279.367c0,23.104,21.178,43.671,61.242,59.48c32.564,12.849,76.227,21.869,124.226,25.758l-19.944,22.104c-3.7,4.1-3.376,10.424,0.725,14.123c1.912,1.726,4.308,2.576,6.696,2.576c2.731,0,5.453-1.113,7.427-3.301l36.387-40.325c1.658-1.837,2.576-4.224,2.576-6.699v-0.764c0-2.365-0.838-4.653-2.365-6.458L182.857,305.537z M381.414,137.486h40.879c5.522,0,10-4.477,10-10V86.592c0-5.523-4.478-10-10-10h-40.879c-5.522,0-10,4.477-10,10v40.894C371.414,133.009,375.892,137.486,381.414,137.486z"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`
})

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  carId: {
    type: String,
    default: '7x'
  }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})

// Colors configuration
const colors = computed(() => blockData.value.colors || [])

const activeColor = ref('')
const currentFrame = ref(0)

const isDragging = ref(false)
const startX = ref(0)
const lastX = ref(0)
const viewerElement = ref(null)

const colorImages = ref({})
const preloadedImageObjects = ref({}) // Store Image objects to keep them in memory
const isMobileDevice = ref(isMobile())

// Update mobile state on window resize
const updateMobileState = () => {
  isMobileDevice.value = isMobile()
  // Reload images when switching between mobile/desktop
  reloadImages()
}

// Reload images when mobile state changes
const reloadImages = () => {
  colorImages.value = {}
  preloadedImageObjects.value = {}
  
  colors.value.forEach(color => {
    const images = []
    for (let i = 0; i < 36; i++) {
      const imagePath = getImagePath(color.id, i)
      images.push(imagePath)
    }
    colorImages.value[color.id] = images
    
    // Preload all images once and keep references
    preloadImages(images, color.id)
  })
}

// Initialize activeColor when colors are available
watch(colors, (newColors) => {
  if (newColors.length > 0 && !activeColor.value) {
    activeColor.value = newColors[0].id
  }
}, { immediate: true })

// Mapping between desktop color names and mobile color names
const colorNameMapping = {
  // Desktop name -> Mobile name
  'interstellarViolet': 'purple',
  'grey': 'gray',
  'darkPurple': 'deepPurple',
  // Colors that are the same in both
  'white': 'white',
  'black': 'black',
  'green': 'green',
  'beige': 'beige'
}

// Get mobile color name from desktop color name
const getMobileColorName = (colorId) => {
  return colorNameMapping[colorId] || colorId
}

// Get image path helper using Vite's asset handling
// In Vite dev mode, assets in src/assets are served at /src/assets/...
const getImagePath = (colorId, frame) => {
  // Direct path - Vite dev server serves files from src/assets
  const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
  // Use 360_mobile folder for mobile devices, 360 for desktop
  const folderName = isMobileDevice.value ? '360_mobile' : '360'
  // Map color name for mobile if needed
  const mappedColorId = isMobileDevice.value ? getMobileColorName(colorId) : colorId
  return `${basePath}/${props.carId}/${folderName}/${mappedColorId}/${mappedColorId}_${frame}.webp`
}

// Get color image path for color selector
const getColorImagePath = (colorId) => {
  return `/src/assets/colors/${colorId}.webp`
}

// Preload images and keep Image objects in memory to prevent garbage collection
// This ensures browser keeps images cached
const preloadImages = (images, colorId) => {
  const imageObjects = []
  
  images.forEach((imagePath) => {
    const img = new Image()
    img.src = imagePath // This loads image into browser cache
    imageObjects.push(img) // Keep reference to prevent GC
  })
  
  // Store Image objects to keep them in memory
  preloadedImageObjects.value[colorId] = imageObjects
}

// Initialize images for each color and preload all images once
onMounted(() => {
  // Initial load
  reloadImages()
  
  // Set initial color if available
  if (colors.value.length > 0 && !activeColor.value) {
    activeColor.value = colors.value[0].id
  }
  
  // Listen for window resize to update mobile state
  window.addEventListener('resize', updateMobileState)
})

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileState)
})

const activeColorData = computed(() => {
  return colors.value.find(c => c.id === activeColor.value) || colors.value[0]
})

const currentImage = computed(() => {
  if (!activeColor.value || !colorImages.value[activeColor.value] || colorImages.value[activeColor.value].length === 0) {
    return ''
  }
  // Round frame index for image selection with cyclic wrapping
  let frameIndex = Math.round(currentFrame.value)
  
  // Cyclic wrapping: ensure frameIndex is always 0-35
  frameIndex = ((frameIndex % 36) + 36) % 36
  
  // Get preloaded image path
  const images = colorImages.value[activeColor.value]
  return images[frameIndex] || images[0] || ''
})

// Computed property for CSS background-image with proper URL format
const currentImageUrl = computed(() => {
  const imagePath = currentImage.value
  if (!imagePath) {
    return 'none'
  }
  // Use preloaded Image object if available to ensure browser uses cached version
  if (preloadedImageObjects.value[activeColor.value]) {
    const frameIndex = ((Math.round(currentFrame.value) % 36) + 36) % 36
    const preloadedImg = preloadedImageObjects.value[activeColor.value][frameIndex]
    if (preloadedImg && preloadedImg.complete) {
      // Image is loaded, use its src (browser will use cached version)
      return `url(${preloadedImg.src})`
    }
  }
  // Fallback to path - browser should use cached version from preload
  return `url(${imagePath})`
})

const selectColor = (colorId) => {
  // Keep current frame when changing color
  activeColor.value = colorId
  // Don't reset frame - keep the current position
}

const updateFrame = (x) => {
  if (!viewerElement.value) return
  
  const rect = viewerElement.value.getBoundingClientRect()
  const relativeX = x - rect.left
  const percentage = Math.max(0, Math.min(1, relativeX / rect.width))
  const targetFrame = percentage * 35
  
  // Плавная интерполяция
  const diff = targetFrame - currentFrame.value
  currentFrame.value += diff * 0.5
  currentFrame.value = Math.max(0, Math.min(35, currentFrame.value))
}

let animationFrameId = null

// Global mouse handlers for smooth dragging
const handleGlobalMouseMove = (e) => {
  if (!isDragging.value) {
    return
  }
  
  e.preventDefault()
  e.stopPropagation()
  
  const deltaX = e.clientX - lastX.value
  lastX.value = e.clientX
  
  if (Math.abs(deltaX) < 0.1) {
    return // Ignore tiny movements
  }
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
    animationFrameId = requestAnimationFrame(() => {
      if (!viewerElement.value || !isDragging.value) {
        return
      }
      
      // Calculate frame change based on movement delta
      // Sensitivity factor: adjust this to make rotation faster/slower
      const sensitivity = 1.2 // Increased sensitivity for better responsiveness
      const width = viewerElement.value.getBoundingClientRect().width
      
      if (width === 0) {
        return
      }
      
      // Invert deltaX for reverse rotation direction
      const frameDelta = (-deltaX / width) * 36 * sensitivity
      
      // Update frame value with cyclic wrapping
      currentFrame.value += frameDelta
      
      // Cyclic wrapping: 0-35, seamless loop
      // When we go past 35, wrap to 0, and when we go below 0, wrap to 35
      currentFrame.value = ((currentFrame.value % 36) + 36) % 36
    })
}

const handleGlobalMouseUp = () => {
  isDragging.value = false
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  // Remove global listeners
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseup', handleGlobalMouseUp)
}

const handleMouseDown = (e) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = true
  lastX.value = e.clientX
  startX.value = e.clientX
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  // Add global listeners for smooth dragging
  document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false })
  document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false })
}

const handleMouseMove = (e) => {
  // This is called when mouse moves over the element
  // But we use global handler for dragging
  if (isDragging.value) {
    handleGlobalMouseMove(e)
  }
}

const handleMouseUp = (e) => {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  handleGlobalMouseUp()
}

const handleTouchStart = (e) => {
  e.preventDefault()
  isDragging.value = true
  startX.value = e.touches[0].clientX
  lastX.value = e.touches[0].clientX
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
}

const handleTouchMove = (e) => {
  if (isDragging.value && e.touches[0]) {
    e.preventDefault() // Prevent scrolling
    const deltaX = e.touches[0].clientX - lastX.value
    lastX.value = e.touches[0].clientX
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    
    animationFrameId = requestAnimationFrame(() => {
      if (!viewerElement.value) return
      
      // Use delta-based rotation for touch, same as mouse
      const sensitivity = 1.2 // Increased sensitivity for better responsiveness
      const width = viewerElement.value.getBoundingClientRect().width
      // Invert deltaX for reverse rotation direction
      const frameDelta = (-deltaX / width) * 36 * sensitivity
      
      currentFrame.value += frameDelta
      
      // Cyclic wrapping: 0-35, seamless loop
      currentFrame.value = ((currentFrame.value % 36) + 36) % 36
    })
  }
}

// Function to get text based on language
const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') {
    return textObj
  }
  if (typeof textObj === 'object' && textObj !== null) {
    return textObj[langStore.activeLang] || textObj.ua || textObj.en || ''
  }
  return ''
}

</script>

<style lang="scss" scoped>
.car-360-block {
  width: calc(100% - 40px);
  height: 100vh;
  margin: 0 20px;
  position: relative;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__viewer {
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
    overflow: hidden;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    // Remove transition to prevent flickering
    // transition: background-image 0.1s ease;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    // Prevent image flickering
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);

    &:active {
      cursor: grabbing;
    }
  }
  
  &__debug {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 8px 12px;
    font-size: 14px;
    z-index: 100;
  }

  &__bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
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
    position: relative;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0;
    background: transparent;
    filter: drop-shadow(0 1.5px 3px rgba(0, 0, 0, 0.25));
    overflow: hidden;

    &:hover {
      transform: scale(1.1);
    }

    &--active {
      border: 0.5px solid #fff;
      filter: drop-shadow(0 1.5px 3px rgba(0, 0, 0, 0.25));
    }
  }

  &__color-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }

  &__color-name {
    font-size: 0;
    opacity: 0;
  }

  &__description {
    text-align: center;
    max-width: 800px;
  }

  &__description-text {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: #333;
    margin: 0 0 12px;
    font-weight: 400;
  }

  &__description-note {
    font-size: 12px;
    color: #999;
    margin: 0;
    line-height: 1.4;
  }
}

@media screen and (max-width: 876px) {
  .car-360-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    height: 55vh;

    &__viewer {
      height: 100%;
    }

    &__bottom {
      padding: 24px 16px;
      gap: 20px;
    }

    &__colors {
      gap: 12px;
    }

    &__color {
      width: 28px;
      height: 28px;
      border-width: 0.5px;

      &--active {
        border-width: 0.5px;
      }
    }

    &__description-text {
      font-size: 16px;
      margin-bottom: 8px;
    }

    &__description-note {
      font-size: 11px;
    }
  }
}
</style>
