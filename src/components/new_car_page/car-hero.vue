<template>
  <section class="car-hero">
    <!-- Hero video background -->
    <video
      v-if="videoSrc"
      ref="videoElement"
      class="car-hero__video"
      autoplay
      muted
      loop
      playsinline
      @loadeddata="onVideoLoaded"
      @error="onVideoError"
    >
      <source :src="videoSrc" type="video/mp4" />
    </video>

    <picture
      v-else-if="heroImage"
      class="car-hero__image"
    >
      <source
        v-if="heroImage.desktop"
        :srcset="heroImage.desktop"
        media="(min-width: 992px)"
      />
      <source
        v-if="heroImage.tablet"
        :srcset="heroImage.tablet"
        media="(min-width: 576px) and (max-width: 991px)"
      />
      <source
        v-if="heroImage.mobile"
        :srcset="heroImage.mobile"
        media="(max-width: 575px)"
      />
      <img
        :src="heroImage.desktop || heroImage.tablet || heroImage.mobile"
        :alt="getText(heroData.title) || 'Zeekr'"
        loading="eager"
      />
    </picture>

    <!-- Dark overlay -->
    <div class="car-hero__overlay"></div>

    <!-- Hero content -->
    <div class="car-hero__content">
      <div>
        <h1 class="car-hero__title">{{ getText(heroData.title) }}</h1>
      <h2 class="car-hero__subtitle">{{ getText(heroData.subtitle) }}</h2>

      <!-- Buttons -->
      <div class="car-hero__buttons">
        <button
          v-for="(button, index) in heroData.buttons"
          :key="index"
          type="button"
          class="btn"
          :class="{
            'btn--transparent': button.style === 'transparent',
            'btn--white': button.style === 'white'
          }"
          @click="handleButtonClick(button.type)"
        >
          {{ getText(button.text) }}
        </button>
      </div>
      </div>

      <!-- Specs -->
      <div class="car-hero__specs">
        <div
          v-for="(spec, index) in heroData.specs"
          :key="index"
          class="car-hero__spec"
        >
          <div class="car-hero__spec-value">{{ spec.value }}</div>
          <div class="car-hero__spec-label">{{ getText(spec.label) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useLangStore } from '@/stores/lang'

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
const heroData = computed(() => {
  return props.data?.hero || props.data || {}
})
const videoElement = ref(null)

const videoSrc = computed(() => {
  if (heroData.value.video) {
    if (heroData.value.video.startsWith('/')) {
      return heroData.value.video
    }
    if (import.meta.env.DEV) {
      return `/src/assets/pages/${props.carId}/${heroData.value.video}`
    }
    return `/pages/${props.carId}/${heroData.value.video}`
  }
  return null
})

const resolveImagePath = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('/')) return imagePath
  // In dev mode, use /src/assets/pages/... (Vite dev server serves from src)
  // In production, use /pages/... (files should be in public/pages/)
  if (import.meta.env.DEV) {
    return `/src/assets/pages/${props.carId}/${imagePath}`
  }
  return `/pages/${props.carId}/${imagePath}`
}

const heroImage = computed(() => {
  if (!heroData.value.image) return null
  return {
    desktop: resolveImagePath(heroData.value.image.desktop),
    tablet: resolveImagePath(heroData.value.image.tablet),
    mobile: resolveImagePath(heroData.value.image.mobile)
  }
})

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

const handleButtonClick = (type) => {
  // Обработка клика по кнопке
  console.log('Button clicked:', type)
  // Здесь можно открыть модальное окно или выполнить другое действие
}

const onVideoLoaded = () => {
  console.log('Video loaded successfully')
  // Попытка воспроизвести видео
  if (videoElement.value) {
    videoElement.value.play().catch(err => {
      console.error('Error playing video:', err)
    })
  }
}

const onVideoError = (error) => {
  console.error('Video loading error:', error)
  console.log('Video src:', videoSrc.value)
}

onMounted(async () => {
  console.log('Hero data:', heroData.value)
  
  await nextTick()
  if (videoElement.value) {
    videoElement.value.load()
  }
})
</script>

<style lang="scss" scoped>
.car-hero {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__video,
  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }

  &__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: #fff;
    padding: 120px 20px 80px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: 64px;
    line-height: 1.2;
    margin: 0 0 16px;
    font-weight: 400;
  }

  &__subtitle {
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "FixelText", sans-serif;
    font-size: 24px;
    line-height: 1.4;
    margin: 0 0 40px;
    font-weight: 400;
  }

  &__buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 0;

    .btn {
      min-width: 110px;
      padding: 11px 24px;
      transition: all .25s linear;
      border: none;
      font-size: 14px;
      border-radius: 50px;
      cursor: pointer;

      &--white {
        background: #fff4e2;
        color: #000;
        border-radius: 50px;
      }

      &--transparent {
        border: 1px solid #fff4e2;
        background: transparent;
        color: #fff4e2;
        padding: 10px 23px;
        border-radius: 50px;
      }
    }
  }

  &__specs {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    flex-wrap: nowrap;
    width: 100%;
    padding-top: 40px;
  }

  &__spec {
    text-align: center;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &__spec-value {
    font-size: 22px;
    font-weight: 600;
    color: #fff4e2;
    margin-bottom: 8px;
  }

  &__spec-label {
    color: #fff4e2;
    font-size: 14px;
    opacity: 0.8;
    font-style: normal;
    font-weight: 400;
  }
}

@media screen and (max-width: 876px) {
  .car-hero {
    &__content {
      padding: 80px 16px 40px;
      min-height: 100dvh;
    }

    &__title {
      font-size: 36px;
    }

    &__subtitle {
      font-size: 18px;
      margin-bottom: 32px;
    }

    &__buttons {
      flex-direction: row;
      align-items: center;
      gap: 12px;
      margin-bottom: 0;
      flex-wrap: wrap;
    }

    &__specs {
      gap: 16px;
      flex-wrap: wrap;
      padding-top: 24px;
    }

    &__spec {
      &:not(:last-child)::after {
        display: none;
      }
    }

    &__spec-value {
      font-size: 18px;
    }

    &__spec-label {
      font-size: 12px;
    }
  }
}
</style>
