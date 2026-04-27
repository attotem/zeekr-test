<template>
  <section class="car-versions-cards" v-if="cards.length">
    <div class="car-versions-cards__inner">
      <div class="car-versions-cards__header">
        <h2 v-if="title" class="car-versions-cards__title">
          {{ title }}
        </h2>
        <a
          v-if="specUrl"
          :href="specUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="car-versions-cards__spec-btn"
        >
          {{ specBtnLabel }}
        </a>
      </div>

      <div class="car-versions-cards__layout">
        <div class="car-versions-cards__categories">
          <button
            v-for="(cat, index) in categories"
            :key="cat.key"
            type="button"
            class="car-versions-cards__category"
            :class="{ 'car-versions-cards__category--active': cat.key === activeCategoryKey }"
            @click="activeCategoryKey = cat.key"
          >
            <img
              v-if="cat.icon"
              :src="cat.icon"
              alt=""
              class="car-versions-cards__category-icon"
              loading="lazy"
            />
            <span class="car-versions-cards__category-label">
              {{ cat.key }}
            </span>
          </button>
        </div>

        <div class="car-versions-cards__grid">
        <article
          v-for="(card, index) in cards"
          :key="index"
          class="car-versions-cards__card"
        >
          <header class="car-versions-cards__card-header">
            <div v-if="card.image" class="car-versions-cards__card-image-wrap">
              <img
                :src="card.image"
                :alt="card.name"
                class="car-versions-cards__card-image"
                loading="lazy"
              />
            </div>
            <div class="car-versions-cards__card-name">
              {{ card.name }}
            </div>
            <div v-if="card.price" class="car-versions-cards__card-price">
              {{ card.price }}
            </div>
          </header>

          <ul class="car-versions-cards__spec-list">
            <li
              v-for="(spec, sIndex) in card.specs"
              :key="sIndex"
              class="car-versions-cards__spec"
            >
              <div v-if="spec.label" class="car-versions-cards__spec-label">
                {{ spec.label }}
              </div>
              <div v-if="spec.value" class="car-versions-cards__spec-value">
                {{ spec.value }}
              </div>
            </li>
          </ul>
        </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { resolveMediaPath } from '@/utils/resolveMedia'

const props = defineProps({
  versions: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  icons: {
    type: Object,
    default: () => ({})
  },
    versionImages: {
    type: Object,
    default: () => ({})
  },
  carId: {
    type: String,
    default: '7x'
  },
  specUrl: {
    type: String,
    default: ''
  },
  specBtnLabel: {
    type: String,
    default: 'Специфікація'
  }
})

const rawCategories = computed(() => {
  const versions = props.versions || {}
  return Object.keys(versions)
})

const categories = computed(() =>
  rawCategories.value.map(key => ({
    key,
    icon: props.icons?.[key] || null
  }))
)

const activeCategoryKey = ref('')

// Следим за изменением версий и сбрасываем выбранную категорию
watch(
  () => rawCategories.value,
  (keys) => {
    if (!keys.length) {
      activeCategoryKey.value = ''
      return
    }
    if (!keys.includes(activeCategoryKey.value)) {
      activeCategoryKey.value = keys[0]
    }
  },
  { immediate: true }
)

// Преобразуем структуру car_versions для выбранной категории в массив карточек
const cards = computed(() => {
  const versions = props.versions || {}
  const categoryKey = activeCategoryKey.value || rawCategories.value[0]
  if (!categoryKey || !versions[categoryKey]) return []

  const category = versions[categoryKey]
  if (!Array.isArray(category) || !category.length) return []

  const [headerRow, ...rows] = category
  if (!Array.isArray(headerRow) || headerRow.length < 2) return []

  const versionCount = headerRow.length - 1

  // rows: каждая строка — массив вида [label, valueForV1, valueForV2, ...]
  // Первая колонка считаем заголовком характеристики
  const rowLabels = rows.map(r => r[0])

  const cards = []
  for (let i = 0; i < versionCount; i++) {
    const name = headerRow[i + 1] || ''

    // Пытаемся подобрать изображение для этой версии
    const imageFile = props.versionImages?.[name]
    const image =
      imageFile && typeof imageFile === 'string'
        ? resolveMediaPath(imageFile, { carId: props.carId })
        : ''

    const specs = rows.map((row, idx) => {
      const label = rowLabels[idx]
      const value = row[i + 1]
      return { label, value }
    }).filter(s => s.label || s.value)

    cards.push({
      name,
      image,
      // Цена, если содержится в отдельной строке (сейчас не используется)
      price: null,
      specs
    })
  }

  return cards
})
</script>

<style scoped lang="scss">
.car-versions-cards {
  width: calc(100% - 40px);
  max-width: 100%;
  margin: 0 20px;
  padding: 60px 0;
  background: #f4f4f5;
  color: #111;

  &__inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  &__title {
    font-family: ZeekrText-Regular, "Tenor Sans", sans-serif;
    font-size: 40px;
    line-height: 1.3;
    font-weight: 400;
    text-align: left;
    margin: 0;
    color: #111;
  }

  &__spec-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #111;
    border-radius: 999px;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 400;
    color: #111;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: #111;
      color: #fff;
    }
  }

  &__layout {
    display: flex;
    align-items: flex-start;
    gap: 24px;
  }

  &__categories {
    flex: 0 0 210px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__category {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: #ffffff;
    color: rgba(17, 17, 17, 0.75);
    font-family: ZeekrText-Regular, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  &__category-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__category-label {
    white-space: nowrap;
  }

  &__category--active {
    background: #111;
    color: #ffffff;
    border-color: #111;

    .car-versions-cards__category-icon {
      filter: invert(1);
    }
  }

  &__grid {
    flex: 1 1 auto;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  &__card {
    background: #ffffff;
    border-radius: 8px;
    padding: 18px 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  }

  &__card-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 6px;
  }

  &__card-image-wrap {
    width: 100%;
    margin-bottom: 4px;
  }

  &__card-image {
    width: 100%;
    height: auto;
    max-height: 140px;
    object-fit: contain;
    display: block;
    border-radius: 6px;
  }

  &__card-name {
    font-family: ZeekrText-Regular, "Tenor Sans", sans-serif;
    font-size: 18px;
    line-height: 1.3;
    font-weight: 400;
  }

  &__card-price {
    font-family: ZeekrText-Regular, "FixelText", sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: #ff5c1a;
  }

  &__spec-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0px;
  }

  &__spec {
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    padding-top: 10px;
  }

  &__spec-label {
    font-family: ZeekrText-Regular, "FixelText", sans-serif;
    font-size: 11px;
    line-height: 1.4;
    color: rgba(17, 17, 17, 0.55);
    margin-bottom: 2px;
  }

  &__spec-value {
    font-family: ZeekrText-Regular, "Tenor Sans", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #111;
  }
}

@media screen and (max-width: 876px) {
  .car-versions-cards {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 40px 0;

    &__inner {
      padding: 0;
      max-width: 100%;
    }

    &__title {
      font-size: 28px;
      margin-bottom: 24px;
      padding: 0 16px;
    }

    &__layout {
      flex-direction: column;
      gap: 20px;
    }

    &__categories {
      flex: 0 0 auto;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 8px;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 0 16px 4px;
      max-width: 100%;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__category {
      flex: 0 0 auto;
      white-space: nowrap;
      padding: 6px 10px;
      font-size: 12px;
    }

    &__grid {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 16px;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 0 16px;
      max-width: 100%;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      scroll-padding-left: 16px;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__spec-list {
      padding-bottom: 0;
      margin-bottom: 0;
    }

    &__spec {
      padding-top: 0;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    &__spec-label {
      padding-top: 5px;
      margin-bottom: 2px;
    }

    &__spec-value {
      padding-bottom: 6px;
    }

    &__card {
      flex: 0 0 85%;
      min-width: 85%;
      max-width: 85%;
      width: 85%;
      scroll-snap-align: start;
      padding: 20px 18px 22px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:first-child {
        margin-left: 16px;
      }
    }
  }
}
</style>

