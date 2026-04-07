<template>
  <section class="car-360-kz-block">
    <div
      ref="viewerElement"
      class="car-360-kz-block__viewer"
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
      <div class="car-360-kz-block__debug" v-if="false">
        Frame: {{ Math.round(currentFrame) }} / {{ totalFrames - 1 }}<br>
        Dragging: {{ isDragging ? 'Yes' : 'No' }}<br>
        Color: {{ activeColor }}
      </div>
    </div>

    <div class="car-360-kz-block__bottom">
      <div class="car-360-kz-block__colors">
        <button
          v-for="color in colors"
          :key="color.id"
          type="button"
          class="car-360-kz-block__color"
          :class="{ 'car-360-kz-block__color--active': activeColor === color.id }"
          @click="selectColor(color.id)"
        >
          <img
            :src="getColorImagePath(color.id)"
            :alt="getText(color.name)"
            class="car-360-kz-block__color-image"
          />
          <span class="car-360-kz-block__color-name">{{ getText(color.name) }}</span>
        </button>
      </div>

      <div
        v-if="activeColorData.description"
        class="car-360-kz-block__description"
      >
        <p class="car-360-kz-block__description-text">{{ getText(activeColorData.description) }}</p>
        <p class="car-360-kz-block__description-note">{{ getText(blockData.note) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  carId: {
    type: String,
    default: '7x'
  },
  invertRotation: {
    type: Boolean,
    default: true
  }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})

const colors = computed(() => blockData.value.colors || [])

const totalFrames = 73

const activeColor = ref('')
const currentFrame = ref(0)

const isDragging = ref(false)
const startX = ref(0)
const lastX = ref(0)
const viewerElement = ref(null)

const colorImages = ref({})
const preloadedImageObjects = ref({})

const getImagePath = (colorId, frame) => {
  const basePath = import.meta.env.DEV ? `/src/assets/pages` : `/pages`
  const folderName = '360_kz'
  const frameNumber = frame.toString().padStart(2, '0')
  return `${basePath}/${props.carId}/${folderName}/${colorId}/${colorId}_${frameNumber}.webp`
}

const getColorImagePath = (colorId) => {
  return `/src/assets/colors/${colorId}.webp`
}

const preloadImages = (images, colorId) => {
  const imageObjects = []
  let loadedCount = 0
  let errorCount = 0
  
  images.forEach((imagePath) => {
    const img = new Image()
    
    img.onload = () => {
      loadedCount++
    }
    
    img.onerror = () => {
      errorCount++
      console.warn(`Failed to load image: ${imagePath}`)
    }
    
    img.src = imagePath
    imageObjects.push(img)
  })
  
  preloadedImageObjects.value[colorId] = imageObjects
  
  
  setTimeout(() => {
    if (errorCount > 0) {
      console.warn(`Color ${colorId}: ${errorCount} images failed to load out of ${images.length}`)
    } else if (loadedCount === images.length) {
    }
  }, 1000)
}

const reloadImages = () => {
  if (!colors.value || colors.value.length === 0) {
    console.warn('Cannot reload images: colors not available')
    return
  }
  
  colorImages.value = {}
  preloadedImageObjects.value = {}
  
  const activeColorId = activeColor.value || (colors.value.length > 0 ? colors.value[0].id : null)
  const activeColorObj = colors.value.find(c => c.id === activeColorId)
  const otherColors = colors.value.filter(c => c.id !== activeColorId)
  
  
  if (activeColorObj) {
    const activeImages = []
    for (let i = 0; i < totalFrames; i++) {
      const imagePath = getImagePath(activeColorObj.id, i)
      activeImages.push(imagePath)
    }
    colorImages.value[activeColorObj.id] = activeImages
    preloadImages(activeImages, activeColorObj.id)
  }
  
  
  otherColors.forEach(color => {
    const images = []
    for (let i = 0; i < totalFrames; i++) {
      const imagePath = getImagePath(color.id, i)
      images.push(imagePath)
    }
    colorImages.value[color.id] = images
    preloadImages(images, color.id)
  })
}


watch(colors, (newColors, oldColors) => {
  if (newColors.length > 0) {
    if (!activeColor.value) {
      activeColor.value = newColors[0].id
    }
    
    const colorsChanged = !oldColors || 
      newColors.length !== oldColors.length || 
      newColors.some((c, i) => !oldColors[i] || c.id !== oldColors[i].id)
    if (colorsChanged) {
      reloadImages()
    }
  }
}, { immediate: true })

onMounted(() => {
  if (colors.value.length > 0) {
    if (!activeColor.value) {
      activeColor.value = colors.value[0].id
    }
    
    
    reloadImages()
  }
})

const activeColorData = computed(() => {
  return colors.value.find(c => c.id === activeColor.value) || colors.value[0]
})

const currentImage = computed(() => {
  if (!activeColor.value || !colorImages.value[activeColor.value] || colorImages.value[activeColor.value].length === 0) {
    return ''
  }
  let frameIndex = Math.round(currentFrame.value)
  
  frameIndex = ((frameIndex % totalFrames) + totalFrames) % totalFrames
  
  const images = colorImages.value[activeColor.value]
  return images[frameIndex] || images[0] || ''
})

const currentImageUrl = computed(() => {
  const imagePath = currentImage.value
  if (!imagePath) {
    return 'none'
  }
  if (preloadedImageObjects.value[activeColor.value]) {
    const frameIndex = ((Math.round(currentFrame.value) % totalFrames) + totalFrames) % totalFrames
    const preloadedImg = preloadedImageObjects.value[activeColor.value][frameIndex]
    if (preloadedImg && preloadedImg.complete) {
      return `url(${preloadedImg.src})`
    }
  }
  return `url(${imagePath})`
})

const selectColor = (colorId) => {
  activeColor.value = colorId
}

const updateFrame = (x) => {
  if (!viewerElement.value) return
  
  const rect = viewerElement.value.getBoundingClientRect()
  const relativeX = x - rect.left
  const percentage = Math.max(0, Math.min(1, relativeX / rect.width))
  const targetFrame = percentage * (totalFrames - 1)
  
  const diff = targetFrame - currentFrame.value
  currentFrame.value += diff * 0.5
  currentFrame.value = Math.max(0, Math.min(totalFrames - 1, currentFrame.value))
}

let animationFrameId = null

const handleGlobalMouseMove = (e) => {
  if (!isDragging.value) {
    return
  }
  
  e.preventDefault()
  e.stopPropagation()
  
  const deltaX = e.clientX - lastX.value
  lastX.value = e.clientX
  
  if (Math.abs(deltaX) < 0.1) {
    return
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
      
      const frameDelta = (props.invertRotation ? -deltaX : deltaX) / width * totalFrames * sensitivity
      
      currentFrame.value += frameDelta
      
      currentFrame.value = ((currentFrame.value % totalFrames) + totalFrames) % totalFrames
    })
}

const handleGlobalMouseUp = () => {
  isDragging.value = false
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
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
  document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false })
  document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false })
}

const handleMouseMove = (e) => {
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
    e.preventDefault()
    const deltaX = e.touches[0].clientX - lastX.value
    lastX.value = e.touches[0].clientX
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    
    animationFrameId = requestAnimationFrame(() => {
      if (!viewerElement.value) return
      
      const sensitivity = 1.2
      const width = viewerElement.value.getBoundingClientRect().width
      const frameDelta = (props.invertRotation ? -deltaX : deltaX) / width * totalFrames * sensitivity
      
      currentFrame.value += frameDelta
      
      currentFrame.value = ((currentFrame.value % totalFrames) + totalFrames) % totalFrames
    })
  }
}

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

</script>

<style lang="scss" scoped>
.car-360-kz-block {
  width: var(--car-section-width);
  height: 100vh;
  margin: var(--car-section-margin);
  padding: 0 150px 150px 150px;
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
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
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
    gap: var(--car-stack-gap-sm);
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
    font-family: var(--car-font-body);
    font-size: 18px;
    line-height: 1.6;
    color: var(--car-text-secondary);
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

@media screen and (max-width: var(--car-bp-sm)) {
  .car-360-kz-block {
    width: var(--car-section-width-sm);
    margin: var(--car-section-margin-sm);
    height: 55vh;
    padding: 0;

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
