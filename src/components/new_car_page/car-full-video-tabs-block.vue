<template>
  <section class="car-full-video-tabs-block" :style="bgStyle">
    <h2 v-if="getText(blockData.title)" class="car-full-video-tabs-block__title">
      {{ getText(blockData.title) }}
    </h2>

    <div class="car-full-video-tabs-block__media">
      <video
        v-if="videoSrc"
        class="car-full-video-tabs-block__video"
        :src="videoSrc"
        autoplay
        muted
        loop
        playsinline
      ></video>
      <img
        v-else-if="imageSrc"
        class="car-full-video-tabs-block__video"
        :src="imageSrc"
        alt=""
        loading="lazy"
      />
    </div>

    <div class="car-full-video-tabs-block__caption">
      <div class="car-full-video-tabs-block__tabs">
        <button
          v-for="(tab, i) in tabs"
          :key="i"
          class="car-full-video-tabs-block__tab"
          :class="{ 'car-full-video-tabs-block__tab--active': activeTab === i }"
          @click="activeTab = i"
        >
          {{ getText(tab.label) }}
        </button>
      </div>
      <p v-if="activeDescription" class="car-full-video-tabs-block__desc">{{ activeDescription }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLangStore } from '@/stores/lang'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '' }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})
const tabs = computed(() => blockData.value.tabs || [])
const activeTab = ref(0)

const bgStyle = computed(() => {
  const bg = blockData.value.background
  return bg ? { background: bg } : {}
})

const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') return textObj
  if (typeof textObj === 'object' && textObj !== null) {
    const lang = langStore.activeLang
    if (lang && textObj[lang]) return textObj[lang]
    if (lang === 'uk' && textObj.ua) return textObj.ua
    if (lang === 'ua' && textObj.uk) return textObj.uk
    return textObj.uk || textObj.ua || textObj.en || ''
  }
  return ''
}

const videoSrc = computed(() => {
  const v = blockData.value.video
  if (!v) return null
  if (v.startsWith('/')) return v
  if (import.meta.env.DEV) return `/src/assets/pages/${props.carId}/${v}`
  return `/pages/${props.carId}/${v}`
})

const imageSrc = computed(() => {
  const img = blockData.value.image
  if (!img) return null
  if (img.startsWith('/')) return img
  if (import.meta.env.DEV) return `/src/assets/pages/${props.carId}/${img}`
  return `/pages/${props.carId}/${img}`
})

const activeDescription = computed(() => {
  const tab = tabs.value[activeTab.value]
  return tab ? getText(tab.description) : ''
})
</script>

<style lang="scss" scoped>
.car-full-video-tabs-block {
  width: 100%;
  background: #fff;

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 28px;
    font-weight: 400;
    color: #111;
    text-align: center;
    margin: 0;
    padding: 56px 40px 48px;
  }

  &__media {
    width: 100%;
    overflow: hidden;
    line-height: 0;
  }

  &__video {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  &__caption {
    padding: 40px 40px 56px;
    margin: 0 auto;
    text-align: center;
  }

  &__tabs {
    display: flex;
    justify-content: center;
    gap: 48px;
    margin-bottom: 24px;
    flex-wrap: wrap;

    &:has(> :only-child) {
      gap: 0;
      margin-bottom: 16px;
    }
  }

  &__tab {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 14px;
    color: rgba(17, 17, 17, 0.45);
    background: none;
    border: none;
    border-bottom: 1.5px solid transparent;
    padding: 0 0 8px;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;

    &--active {
      color: #111;
      border-bottom-color: #111;
    }

    &:hover:not(&--active) {
      color: rgba(17, 17, 17, 0.7);
    }
  }

  &__desc {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 13px;
    color: rgba(17, 17, 17, 0.6);
    margin: 0;
    line-height: 1.7;
  }
}

@media screen and (max-width: 876px) {
  .car-full-video-tabs-block {
    &__title {
      font-size: 22px;
      padding: 40px 20px 32px;
    }

    &__caption {
      padding: 28px 20px 40px;
    }

    &__tabs {
      gap: 24px;
    }

    &__tab {
      font-size: 13px;
    }
  }
}
</style>
