<template>
  <section
    class="car-fr-feature-block"
    :class="{
      'car-fr-feature-block--centered': isCentered,
      'car-fr-feature-block--two-images': isTwoImages,
      'car-fr-feature-block--centered-specs': isCenteredSpecs,
      'car-fr-feature-block--video': isVideo,
      'car-fr-feature-block--light': isLightTheme
    }"
  >
    <!-- video layout -->
    <template v-if="isVideo">
      <div class="car-fr-feature-block__video-wrap">
        <video
          class="car-fr-feature-block__video"
          :src="resolveVideo(blockData.video)"
          :poster="resolvePoster(blockData.poster)"
          autoplay muted loop playsinline
        />
        <div class="car-fr-feature-block__video-overlay" />
        <div class="car-fr-feature-block__video-text">
          <h2 class="car-fr-feature-block__video-title">{{ getText(blockData.title) }}</h2>
          <p class="car-fr-feature-block__video-subtitle">{{ getText(blockData.subtitle) }}</p>
        </div>
      </div>
      <!-- Mobile: text below video -->
      <div class="car-fr-feature-block__video-text-mobile">
        <h2 class="car-fr-feature-block__video-title">{{ getText(blockData.title) }}</h2>
        <p class="car-fr-feature-block__video-subtitle">{{ getText(blockData.subtitle) }}</p>
      </div>
    </template>

    <!-- two-images layout -->
    <template v-else-if="isTwoImages">
      <div
        v-for="(img, index) in blockData.images || []"
        :key="index"
        class="car-fr-feature-block__img-card"
      >
        <img
          class="car-fr-feature-block__img-card-image"
          :src="resolveImage(img.image)"
          :alt="getText(img.title)"
          loading="lazy"
          draggable="false"
        />
        <h3 class="car-fr-feature-block__img-card-title">{{ getText(img.title) }}</h3>
        <p class="car-fr-feature-block__img-card-desc">{{ getText(img.description) }}</p>
      </div>
    </template>

    <!-- default & centered & centered-specs layouts -->
    <template v-else-if="!isTwoImages">
      <div class="car-fr-feature-block__text">
        <h2 class="car-fr-feature-block__title">{{ getText(blockData.title) }}</h2>
        <p v-if="isCenteredSpecs && getText(blockData.subtitle)" class="car-fr-feature-block__subtitle">{{ getText(blockData.subtitle) }}</p>
        <ul v-if="!isCentered && !isCenteredSpecs" class="car-fr-feature-block__items">
          <li
            v-for="(item, index) in blockData.items || []"
            :key="index"
            class="car-fr-feature-block__item"
          >
            <h3 class="car-fr-feature-block__item-title">{{ getText(item.title) }}</h3>
            <p class="car-fr-feature-block__item-desc">{{ getText(item.description) }}</p>
          </li>
        </ul>
      </div>

      <div class="car-fr-feature-block__image-wrap">
        <img
          class="car-fr-feature-block__image"
          :src="resolveImage(blockData.image)"
          :alt="getText(blockData.title)"
          loading="lazy"
          draggable="false"
        />
      </div>

      <!-- specs row for centered-specs layout -->
      <div v-if="isCenteredSpecs" class="car-fr-feature-block__specs-row">
        <div
          v-for="(spec, index) in blockData.specs || []"
          :key="index"
          class="car-fr-feature-block__spec"
        >
          <div v-if="getText(spec.category)" class="car-fr-feature-block__spec-category">{{ getText(spec.category) }}</div>
          <div class="car-fr-feature-block__spec-value">{{ getText(spec.value) }}</div>
          <div class="car-fr-feature-block__spec-label">{{ getText(spec.label) }}</div>
        </div>
      </div>
      <div v-if="isCenteredSpecs && (blockData.notes || []).length" class="car-fr-feature-block__notes">
        <p
          v-for="(note, i) in blockData.notes || []"
          :key="i"
          class="car-fr-feature-block__note"
        >{{ getText(note) }}</p>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLangStore } from '@/stores/lang'
import { getTextByLang } from '@/utils/getText'
import { resolveMediaPath } from '@/utils/resolveMedia'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '7x' }
})

const langStore = useLangStore()
const blockData = computed(() => props.data || {})
const isCentered = computed(() => blockData.value.layout === 'centered')
const isTwoImages = computed(() => blockData.value.layout === 'two-images')
const isCenteredSpecs = computed(() => blockData.value.layout === 'centered-specs')
const isLightTheme = computed(() => blockData.value.theme === 'light')
const isVideo = computed(() => blockData.value.layout === 'video')

const resolveVideo = (video) => resolveMediaPath(video, { carId: props.carId })
const resolvePoster = (poster) => poster ? resolveMediaPath(poster, { carId: props.carId }) : undefined
const getText = (value) => getTextByLang(value, langStore.activeLang)
const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })
</script>

<style lang="scss" scoped>
.car-fr-feature-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  margin: 0;
  background: rgb(15, 15, 15);
  min-height: 90vh;

  &__text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 48px 64px 72px;
    color: rgb(255, 244, 226);
  }

  &__title {
    font-size: 40px;
    font-weight: 400;
    line-height: 1.25;
    margin: 0 0 48px;
    color: rgb(255, 244, 226);
  }

  &__items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  &__item {
    padding: 24px 0;
    border-top: 1px solid rgba(255, 244, 226, 0.2);

    &:last-child {
      border-bottom: 1px solid rgba(255, 244, 226, 0.2);
    }
  }

  &__item-title {
    font-size: 17px;
    font-weight: 500;
    margin: 0 0 8px;
    color: rgb(255, 244, 226);
    line-height: 1.3;
  }

  &__item-desc {
    font-size: 13px;
    font-weight: 400;
    margin: 0;
    color: rgba(255, 244, 226, 0.6);
    line-height: 1.6;
  }

  &__image-wrap {
    overflow: hidden;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image {
    width: 100%;
    object-fit: cover;
    display: block;
    border-radius: 2px;
  }
}

// ─── Centered layout: title-top / image-below ───────────────────────────────
.car-fr-feature-block--centered {
  display: flex;
  flex-direction: column;
  min-height: unset;

  .car-fr-feature-block__text {
    padding: 56px 24px 40px;
    align-items: center;
  }

  .car-fr-feature-block__title {
    font-size: 40px;
    text-align: center;
    margin: 0;
  }

  .car-fr-feature-block__image-wrap {
    padding: 0 40px 48px;
    height: auto;
  }

  .car-fr-feature-block__image {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 4px;
  }
}

// ─── Video layout ────────────────────────────────────────────────────────────
.car-fr-feature-block--video {
  display: flex;
  flex-direction: column;
  min-height: unset;

  .car-fr-feature-block__video-wrap {
    position: relative;
    overflow: hidden;
  }

  .car-fr-feature-block__video {
    width: 100%;
    display: block;
    object-fit: cover;
  }

  .car-fr-feature-block__video-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 50%);
    pointer-events: none;
  }

  .car-fr-feature-block__video-text {
    position: absolute;
    top: 48px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    width: 90%;
    z-index: 2;
  }

  .car-fr-feature-block__video-title {
    font-size: 36px;
    font-weight: 400;
    margin: 0 0 12px;
    color: rgb(255, 244, 226);
    line-height: 1.2;
  }

  .car-fr-feature-block__video-subtitle {
    font-size: 16px;
    margin: 0;
    color: rgba(255, 244, 226, 0.75);
    line-height: 1.5;
  }

  .car-fr-feature-block__video-text-mobile {
    display: none;
  }
}

// ─── Centered-specs layout ───────────────────────────────────────────────────
.car-fr-feature-block--centered-specs {
  display: flex;
  flex-direction: column;
  min-height: unset;

  .car-fr-feature-block__text {
    padding: 56px 24px 24px;
    align-items: center;
  }

  .car-fr-feature-block__title {
    font-size: 40px;
    text-align: center;
    margin: 0 0 12px;
  }

  .car-fr-feature-block__subtitle {
    font-size: 16px;
    text-align: center;
    margin: 0;
    color: rgba(255, 244, 226, 0.65);
    line-height: 1.5;
  }

  .car-fr-feature-block__image-wrap {
    padding: 0 40px 0;
    height: auto;
  }

  .car-fr-feature-block__image {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 4px;
  }

  .car-fr-feature-block__specs-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    padding: 40px 40px 48px;
    border-top: 1px solid rgba(255, 244, 226, 0.15);
    margin-top: 40px;
  }

  .car-fr-feature-block__spec {
    padding: 0 24px;
    border-left: 1px solid rgba(255, 244, 226, 0.2);

    &:first-child {
      border-left: none;
      padding-left: 0;
    }
  }

  .car-fr-feature-block__spec-category {
    font-size: 14px;
    color: rgba(255, 244, 226, 0.5);
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .car-fr-feature-block__spec-value {
    font-size: 20px;
    font-weight: 500;
    color: rgb(255, 244, 226);
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .car-fr-feature-block__spec-label {
    font-size: 13px;
    color: rgba(255, 244, 226, 0.6);
    line-height: 1.5;
  }

  .car-fr-feature-block__notes {
    padding: 0 40px 32px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .car-fr-feature-block__note {
    margin: 0;
    font-size: 12px;
    color: rgba(255, 244, 226, 0.4);
    line-height: 1.5;
  }
}

// ─── Light theme override ─────────────────────────────────────────────────────
.car-fr-feature-block--light {
  background: rgb(242, 242, 240);

  .car-fr-feature-block__title {
    color: #111;
    background: none;
    -webkit-text-fill-color: unset;
  }

  .car-fr-feature-block__specs-row {
    border-top-color: rgba(0, 0, 0, 0.12);
  }

  .car-fr-feature-block__spec {
    border-left-color: rgba(0, 0, 0, 0.15);
  }

  .car-fr-feature-block__spec-category {
    color: rgba(0, 0, 0, 0.5);
  }

  .car-fr-feature-block__spec-value {
    color: #111;
  }

  .car-fr-feature-block__spec-label {
    color: rgba(0, 0, 0, 0.55);
  }

  .car-fr-feature-block__note {
    color: rgba(0, 0, 0, 0.4);
  }

  .car-fr-feature-block__subtitle {
    color: rgba(0, 0, 0, 0.5);
  }
}

// ─── Two-images layout ───────────────────────────────────────────────────────
.car-fr-feature-block--two-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  min-height: unset;
  padding: 0 40px 56px;

  .car-fr-feature-block__img-card {
    display: flex;
    flex-direction: column;
    padding: 40px 24px 0;
  }

  .car-fr-feature-block__img-card-image {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
    border-radius: 2px;
    margin-bottom: 20px;
  }

  .car-fr-feature-block__img-card-title {
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 8px;
    color: rgb(255, 244, 226);
    line-height: 1.3;
  }

  .car-fr-feature-block__img-card-desc {
    font-size: 13px;
    font-weight: 400;
    margin: 0;
    color: rgba(255, 244, 226, 0.6);
    line-height: 1.6;
  }
}

// ─── Light theme mobile overrides ────────────────────────────────────────────
@media screen and (max-width: 876px) {
  .car-fr-feature-block--light {
    .car-fr-feature-block__title {
      background: rgb(242, 242, 240);
      color: #111;
    }

    .car-fr-feature-block__image-wrap {
      background: rgb(242, 242, 240);
    }
  }
}

// ─── Mobile ──────────────────────────────────────────────────────────────────
@media screen and (max-width: 876px) {
  .car-fr-feature-block {
    display: flex;
    flex-direction: column;
    min-height: unset;

    &__text {
      display: contents;
    }

    &__title {
      order: 1;
      font-size: 26px;
      margin: 0;
      text-align: center;
      padding: 36px 20px 24px;
      background: rgb(15, 15, 15);
      color: rgb(255, 244, 226);
    }

    &__image-wrap {
      order: 2;
      padding: 0 16px 16px;
      height: auto;
    }

    &__image {
      width: 100%;
      height: auto;
      object-fit: cover;
      aspect-ratio: 4 / 3;
      border-radius: 2px;
    }

    &__items {
      order: 3;
      padding: 0 20px 36px;
    }

    &__item {
      padding: 20px 0;
    }

    &__item-title {
      font-size: 15px;
    }

    &__item-desc {
      font-size: 13px;
    }
  }

  .car-fr-feature-block--centered {
    .car-fr-feature-block__text {
      display: flex;
    }

    .car-fr-feature-block__title {
      order: unset;
      padding: 36px 20px 24px;
      font-size: 24px;
    }

    .car-fr-feature-block__image-wrap {
      order: unset;
      padding: 0 16px 32px;
    }

    .car-fr-feature-block__image {
      aspect-ratio: 3 / 4;
    }
  }

  .car-fr-feature-block--video {
    .car-fr-feature-block__video-wrap {
      padding: 0 16px;
    }

    .car-fr-feature-block__video {
      border-radius: 4px;
    }

    // Hide PC overlay text, show text below on mobile
    .car-fr-feature-block__video-text {
      display: none;
    }

    .car-fr-feature-block__video-text-mobile {
      display: block;
      padding: 24px 20px 36px;
    }

    .car-fr-feature-block__video-title {
      font-size: 22px;
      margin-bottom: 10px;
      color: rgb(255, 244, 226);
    }

    .car-fr-feature-block__video-subtitle {
      font-size: 14px;
      color: rgba(255, 244, 226, 0.65);
    }
  }

  .car-fr-feature-block--centered-specs {
    .car-fr-feature-block__text {
      display: flex;
      padding: 36px 20px 24px;
    }

    .car-fr-feature-block__title {
      order: unset;
      padding: 0;
      font-size: 24px;
    }

    .car-fr-feature-block__image-wrap {
      order: unset;
      padding: 0 16px;
    }

    .car-fr-feature-block__image {
      aspect-ratio: 4 / 3;
    }

    .car-fr-feature-block__specs-row {
      grid-template-columns: repeat(2, 1fr);
      padding: 28px 20px 36px;
      margin-top: 24px;
      gap: 20px 0;
    }

    .car-fr-feature-block__spec {
      padding: 0 16px;

      &:nth-child(odd) {
        border-left: none;
        padding-left: 0;
      }
    }

    .car-fr-feature-block__note {
      padding: 0 20px 28px;
    }
  }

  .car-fr-feature-block--two-images {
    display: flex;
    flex-direction: column;
    padding: 0 16px 40px;

    .car-fr-feature-block__img-card {
      padding: 24px 0 0;
    }

    .car-fr-feature-block__img-card-image {
      aspect-ratio: 3 / 2;
      margin-bottom: 16px;
    }

    .car-fr-feature-block__img-card-title {
      font-size: 16px;
    }
  }
}
</style>
