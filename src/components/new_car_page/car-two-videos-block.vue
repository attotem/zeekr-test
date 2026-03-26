<template>
  <section class="car-two-videos-block">
    <div class="car-two-videos-block__inner">
      <div class="car-two-videos-block__grid">
        <div
          v-for="(item, index) in videos"
          :key="index"
          class="car-two-videos-block__item"
        >
          <div class="car-two-videos-block__video-wrap">
            <video
              :src="resolveVideo(item.video)"
              class="car-two-videos-block__video"
              autoplay
              muted
              loop
              playsinline
            ></video>
          </div>
          <div v-if="getText(item.caption)" class="car-two-videos-block__caption">
            {{ getText(item.caption) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
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

const getText = (textObj) => getTextByLang(textObj, langStore.activeLang)

const resolveVideo = (videoPath) => {
  if (!videoPath) return ''
  if (videoPath.startsWith('/')) return videoPath
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${videoPath}`
  }
  return `/pages/${props.carId}/${videoPath}`
}

const videos = computed(() => {
  if (blockData.value.videos && Array.isArray(blockData.value.videos)) {
    return blockData.value.videos
  }
  return []
})
</script>

<style lang="scss" scoped>
.car-two-videos-block {
  width: calc(100% - 40px);
  margin: 0 20px;
  background: #fff;
  padding: 60px 0;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  &__item {
    display: flex;
    flex-direction: column;
  }

  &__video-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #000;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &__caption {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    margin-top: 20px;
    text-align: center;
  }
}

@media screen and (max-width: 876px) {
  .car-two-videos-block {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 44px 0;

    &__inner {
      padding: 0 16px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    &__video-wrap {
      min-height: 300px;
    }

    &__caption {
      font-size: 14px;
      margin-top: 16px;
    }
  }
}
</style>
