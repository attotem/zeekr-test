<template>
  <section class="car-storage-grid-block">
    <div class="car-storage-grid-block__row">
      <div class="car-storage-grid-block__left">
        <img
          v-if="items[0]"
          :src="resolveImage(items[0].image)"
          class="car-storage-grid-block__img"
          loading="lazy"
        />
      </div>
      <div class="car-storage-grid-block__right">
        <div
          v-for="(item, i) in items.slice(1)"
          :key="i"
          class="car-storage-grid-block__right-item"
        >
          <img
            :src="resolveImage(item.image)"
            class="car-storage-grid-block__img"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { resolveMediaPath } from '@/utils/resolveMedia'

const props = defineProps({
  data: { type: Object, required: true },
  carId: { type: String, default: '' }
})

const items = computed(() => props.data?.items || [])

const resolveImage = (image) => resolveMediaPath(image, { carId: props.carId })
</script>

<style lang="scss" scoped>
.car-storage-grid-block {
  width: 100%;
  padding: 0 40px;

  &__row {
    display: flex;
    flex-direction: row;
    gap: 12px;
  }

  &__left {
    flex: 1;
  }

  &__right {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 12px;
  }

  &__right-item {
    flex: 1;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

@media screen and (max-width: 876px) {
  .car-storage-grid-block {
    padding: 0 16px;

    &__row {
      flex-direction: column;
      gap: 8px;
    }

    &__right {
      flex-direction: column;
      gap: 8px;
    }

    &__right-item {
    }

    &__left {
      aspect-ratio: 16/9;
    }
  }
}
</style>
