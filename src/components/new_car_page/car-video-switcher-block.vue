<template>
  <section class="car-video-switcher-block">
    <div class="car-video-switcher-block__inner">
      <h2 v-if="getText(blockData.title)" class="car-video-switcher-block__title">
        {{ getText(blockData.title) }}
      </h2>
      <div class="car-video-switcher-block__video-wrap">
        <div
          v-for="(video, index) in videos"
          :key="index"
          class="car-video-switcher-block__video-layer"
          :class="{ 'car-video-switcher-block__video-layer--active': currentIndex === index }"
        >
          <video
            :ref="el => { if (el) videoRefs[index] = el }"
            :src="video"
            class="car-video-switcher-block__video"
            muted
            loop
            playsinline
            @loadeddata="handleVideoLoaded(index)"
          />
        </div>
      </div>
      <div class="car-video-switcher-block__switcher">
        <div class="car-video-switcher-block__switcher-content">
          <button
            v-for="(item, index) in items"
            :key="index"
            type="button"
            class="car-video-switcher-block__switcher-item"
            :class="{ 'car-video-switcher-block__switcher-item--active': currentIndex === index }"
            @click="setIndex(index)"
          >
            <span class="car-video-switcher-block__switcher-title">{{ getText(item.title) }}</span>
          </button>
        </div>
      </div>
      <div class="car-video-switcher-block__description">
        <p v-if="getText(currentItemDescription)" class="car-video-switcher-block__description-text">
          {{ getText(currentItemDescription) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'
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
  }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})
const currentIndex = ref(0)
const videoRefs = ref({})

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

const resolveVideo = (videoPath) => {
  if (!videoPath) return ''
  if (videoPath.startsWith('/')) return videoPath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${videoPath}`
  }
  return `/pages/${props.carId}/${videoPath}`
}

const items = computed(() => {
  return blockData.value.items || []
})

const videos = computed(() => {
  if (blockData.value.videos && Array.isArray(blockData.value.videos)) {
    return blockData.value.videos.map(video => resolveVideo(video))
  }
  return []
})

const currentItemDescription = computed(() => {
  if (items.value[currentIndex.value] && items.value[currentIndex.value].description) {
    return items.value[currentIndex.value].description
  }
  return ''
})

const setIndex = async (index) => {
  
  Object.values(videoRefs.value).forEach(video => {
    if (video && video.pause) {
      video.pause()
    }
  })
  
  currentIndex.value = index
  
  
  await nextTick()
  const currentVideo = videoRefs.value[index]
  if (currentVideo) {
    currentVideo.currentTime = 0
    currentVideo.play().catch(() => {
      
    })
  }
}

const handleVideoLoaded = (index) => {
  const video = videoRefs.value[index]
  if (video && currentIndex.value === index) {
    video.play().catch(() => {
      
    })
  }
}


watch(currentIndex, async (newIndex) => {
  await nextTick()
  
  Object.values(videoRefs.value).forEach(video => {
    if (video && video.pause) {
      video.pause()
    }
  })
  
  const currentVideo = videoRefs.value[newIndex]
  if (currentVideo) {
    currentVideo.currentTime = 0
    currentVideo.play().catch(() => {
      
    })
  }
})


onMounted(async () => {
  await nextTick()
  const firstVideo = videoRefs.value[0]
  if (firstVideo) {
    firstVideo.play().catch(() => {
      
    })
  }
})

watch(() => langStore.activeLang, () => {
  
})
</script>

<style lang="scss" scoped>
.car-video-switcher-block {
  width: 100%;
  margin: 0;
  padding: 60px 0;
  background: rgb(245, 246, 247);

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 48px;
    line-height: 1.3;
    font-weight: 400;
    color: #111;
    text-align: center;
    margin: 0 0 48px 0;
  }

  &__video-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #000;
    border-radius: 8px;
    aspect-ratio: 16 / 9;
    max-height: 80vh;
    margin-bottom: 40px;
  }

  &__video-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;

    &--active {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  &__switcher {
    width: 100%;
    margin-bottom: 24px;
  }

  &__switcher-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0;
    position: relative;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  &__switcher-item {
    background: none;
    border: none;
    padding: 12px 24px;
    cursor: pointer;
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: rgba(17, 17, 17, 0.5);
    transition: color 0.3s ease;
    position: relative;
    margin: 0 8px;

    &:hover {
      color: rgba(17, 17, 17, 0.8);
    }

    &--active {
      color: #111;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -17px;
        left: 0;
        right: 0;
        height: 3px;
        background: #111;
        border-radius: 2px;
      }
    }
  }

  &__switcher-title {
    display: block;
  }

  &__description {
    width: 100%;
    text-align: center;
    padding-top: 24px;
  }

  &__description-text {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #111;
    margin: 0;
  }
}

@media screen and (max-width: 876px) {
  .car-video-switcher-block {
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__title {
      font-size: 32px;
      margin-bottom: 32px;
    }

    &__video-wrap {
      max-height: 60vh;
      margin-bottom: 32px;
    }

    &__switcher-content {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }

    &__switcher-item {
      width: 100%;
      text-align: center;
      margin: 0;
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      &:last-child {
        border-bottom: none;
      }

      &--active {
        &::after {
          display: none;
        }
        
        background: rgba(0, 0, 0, 0.05);
      }
    }

    &__description {
      padding-top: 20px;
    }

    &__description-text {
      font-size: 14px;
    }
  }
}
</style>
