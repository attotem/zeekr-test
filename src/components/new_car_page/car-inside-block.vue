<template>
  <section class="car-inside-block">
    <div class="car-inside-block__image-wrap">
      <div
        v-for="opt in options"
        :key="opt.id"
        class="car-inside-block__image"
        :class="{ 'active': activeId === opt.id }"
        :style="{ 
          backgroundImage: `url(${getInsideImage(opt.id)})`
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

// Preload images
onMounted(() => {
  options.value.forEach(o => {
    const img = new Image()
    img.src = getInsideImage(o.id)
  })
})
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
    inset: 0px;
    background-color: #f5f5f5;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity 0.25s linear;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;

    &.active {
      opacity: 1;
    }
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
      padding: 20px 16px;
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

