<template>
  <section class="car-360-block">
    <!-- 360 Image Viewer -->
    <div
      ref="viewerElement"
      class="car-360-block__viewer"
      :style="{ 
        backgroundImage: currentImageUrl,
        cursor: 'url(/cursor.svg), pointer'
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

    <div class="car-360-block__bottom">
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
const preloadedImageObjects = ref({}) 
const isMobileDevice = ref(isMobile())
const isLoadingImages = ref(false) 

const updateMobileState = () => {
  isMobileDevice.value = isMobile()
  reloadImages()
}

const reloadImages = () => {
  if (isLoadingImages.value) {
    return
  }
  
  if (!colors.value || colors.value.length === 0) {
    console.warn('Cannot reload images: colors not available')
    return
  }
  
  isLoadingImages.value = true
  colorImages.value = {}
  preloadedImageObjects.value = {}
  
  const activeColorId = activeColor.value || (colors.value.length > 0 ? colors.value[0].id : null)
  const activeColorObj = colors.value.find(c => c.id === activeColorId)
  const otherColors = colors.value.filter(c => c.id !== activeColorId)
  
  
  if (activeColorObj) {
    const activeImages = []
    for (let i = 0; i < 36; i++) {
      const imagePath = getImagePath(activeColorObj.id, i)
      activeImages.push(imagePath)
    }
    colorImages.value[activeColorObj.id] = activeImages
    preloadImages(activeImages, activeColorObj.id)
  }
  
  otherColors.forEach(color => {
    const images = []
    for (let i = 0; i < 36; i++) {
      const imagePath = getImagePath(color.id, i)
      images.push(imagePath)
    }
    colorImages.value[color.id] = images
    preloadImages(images, color.id)
  })
  
  setTimeout(() => {
    isLoadingImages.value = false
  }, 100)
}

let colorsWatchTimeout = null
watch(colors, (newColors, oldColors) => {
  const colorsChanged = !oldColors || 
    newColors.length !== oldColors.length || 
    newColors.some((c, i) => !oldColors[i] || c.id !== oldColors[i].id)
  
  if (newColors.length > 0) {
    if (!activeColor.value) {
      activeColor.value = newColors[0].id
    }
    
    if (colorsChanged) {
      clearTimeout(colorsWatchTimeout)
      colorsWatchTimeout = setTimeout(() => {
        reloadImages()
      }, 100)
    }
  }
}, { immediate: true })

const colorNameMapping = {
  'interstellarViolet': 'purple',
  'nightPurple': 'purple',
  'grey': 'gray',
  'darkPurple': 'deepPurple',
  'white': 'white',
  'black': 'black',
  'green': 'green',
  'beige': 'beige'
}


const folderNameMapping = {
  'silver': 'silver'
}

const fileNameMapping = {
  'silver': 'sliver'
}

const getMobileColorName = (colorId) => {
  return colorNameMapping[colorId] || colorId
}

const getFolderColorName = (colorId) => {
  return folderNameMapping[colorId] || colorId
}

const getFileName = (colorId) => {
  return fileNameMapping[colorId] || colorId
}

const getImagePath = (colorId, frame) => {
  const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
  const folderName = isMobileDevice.value ? '360_mobile' : '360'
  const mappedColorId = isMobileDevice.value ? getMobileColorName(colorId) : colorId
  const folderColorName = (!isMobileDevice.value && folderNameMapping[mappedColorId]) 
    ? folderNameMapping[mappedColorId] 
    : mappedColorId
  const fileColorName = (!isMobileDevice.value && props.carId === '9x' && fileNameMapping[mappedColorId]) 
    ? fileNameMapping[mappedColorId] 
    : mappedColorId
  const extension = props.carId === '007gt' ? 'jpg' : 'webp'
  return `${basePath}/${props.carId}/${folderName}/${folderColorName}/${fileColorName}_${frame}.${extension}`
}

// Get color image path for color selector
const getColorImagePath = (colorId) => {
  return `/src/assets/colors/${colorId}.webp`
}

// Preload images and keep Image objects in memory to prevent garbage collection
// This ensures browser keeps images cached
const preloadImages = (images, colorId) => {
  const imageObjects = []
  let loadedCount = 0
  let errorCount = 0
  
  images.forEach((imagePath, index) => {
    const img = new Image()
    
    img.onload = () => {
      loadedCount++
      // Log progress for first color only to avoid spam
      if (colorId === (activeColor.value || colors.value[0]?.id) && index % 6 === 0) {
      }
    }
    
    // Add error handling
    img.onerror = () => {
      errorCount++
      console.warn(`Failed to load image: ${imagePath}`)
    }
    
    // Start loading immediately - browser will cache it
    img.src = imagePath
    imageObjects.push(img) // Keep reference to prevent GC
  })
  
  // Store Image objects to keep them in memory
  preloadedImageObjects.value[colorId] = imageObjects
  
  // Log summary after a short delay
  setTimeout(() => {
    if (errorCount > 0) {
      console.warn(`Color ${colorId}: ${errorCount} images failed to load out of ${images.length}`)
    } else if (loadedCount === images.length) {
    }
  }, 1000)
}

// Initialize images for each color and preload all images once
onMounted(() => {
  // Set initial color if available
  if (colors.value.length > 0 && !activeColor.value) {
    activeColor.value = colors.value[0].id
  }
  
  // Initial load only if colors are already available
  // Otherwise, watch(colors) will trigger reloadImages when colors are loaded
  if (colors.value.length > 0) {
    reloadImages()
  }
  
  // Listen for window resize to update mobile state
  window.addEventListener('resize', updateMobileState)
})

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileState)
  if (colorsWatchTimeout) {
    clearTimeout(colorsWatchTimeout)
  }
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
      
      const sensitivity = 1.2 
      const width = viewerElement.value.getBoundingClientRect().width
      
      if (width === 0) {
        return
      }
      
      const frameDelta = (-deltaX / width) * 36 * sensitivity
      
      currentFrame.value += frameDelta
      
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
    height: 70vh;

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
