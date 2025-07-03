<template>
	<div class="stock">
		<div class="stock__h">
			{{ i18n.pages.stock.carsInStock?.[langStore.activeLang] }}
		</div>

		<div class="sort dropdown">
			<div class="sort__inner">
				<div class="sort__active">{{ sorts[activeSortsIndex] }}</div>
				<Dropdown />
			</div>
			<div class="dropdown__inner">
				<div
					class="sort__item"
					v-for="(sort, counter) in sorts"
					:class="{ 'sort__item--active': activeSortsIndex == counter }"
				>
					{{ sort.text }}
				</div>
			</div>
		</div>

		<main class="main">
			<aside class="filters">
				<div
					class="filter dropdown"
					v-for="filter in filters"
				>
					<div class="filter__name">{{ filter.name }}</div>
					<Expand />

					<div class="dropdown__inner">
						<template v-if="filter.type == 'checkbox'">
							<input
								class="filter__checkbox"
								type="checkbox"
								:name="filter.name"
								v-for="item in filter.items"
								:id="`filter-${filter.name}-checkbox-${item.id}`"
								:key="item.id"
								:value="item?.text"
							/>
						</template>
						<div
							v-else-if="filter.type == 'range'"
							class="range"
						>
							<input
								class="range__input"
								type="number"
								min="0"
								:max="maxCarPrice"
								:value="filter.range[0]"
							/>
							<div class="range__delimiter"></div>
							<input
								class="range__input"
								type="number"
								min="0"
								:max="maxCarPrice"
								:value="filter.range[1]"
							/>
						</div>
					</div>
				</div>
			</aside>

			<section class="cars">
				<div
					class="car"
					v-for="car in cars"
				>
					<div class="car__images">
						<img
							class="car__image car__image--main"
							:src="activeImagesIndex[car.id]"
						/>
						<img
							class="car__image"
							v-for="(image, counter) in Math.min(car.images, 3)"
							:src="image"
							@click="activeImagesIndex[car.id] = counter"
						/>
					</div>

					<div class="car__info">
						<div class="car__name">{{ car.name }}</div>
						<div
							class="car__char"
							v-for="char in car"
						>
							<strong>{{ char.name }}:</strong> {{ char.value }}
						</div>

						<div class="car__price-primary">{{ car.price.primary }}</div>
						<div class="car__price-secondary">{{ car.price.secondary }}</div>

						<div class="car__btns">
							<div class="btn btn--white">
								{{ i18n.pages.stock.details?.[langStore.activeLang] }}
							</div>
							<div class="btn btn--black">
								{{ i18n.pages.stock.sendAnApplication?.[langStore.activeLang] }}
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	</div>
</template>

<script setup>
import Dropdown from '@/components/icons/dropdown.vue';
import Expand from '@/components/icons/expand.vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

let sorts = ref([
  {
    id: 0,
    text: 'By novelty (newest by publication date)'
  },
  {
    id: 1,
    text: 'By popularity (the largest number of applications)'
  },
  {
    id: 2,
    text: 'By descending order of price'
  },
  {
    id: 3,
    text: 'By price increase'
  }
]),
  activeSortsIndex = ref(0),
  filters = ref([
    {
      id: 0,
      name: 'Models',
      type: 'checkbox',
      items: [
        {
          id: '0-0',
          text: '001'
        },
        {
          id: '0-1',
          text: '007'
        }
      ]
    }, {
      id: 1,
      name: 'Car drive type',
      type: 'checkbox',
      items: [
        {
          id: '0-0',
          text: '001'
        },
        {
          id: '0-1',
          text: '007'
        }
      ]
    }, {
      id: 2,
      name: 'Price, UAH',
      type: 'range',
      range: [0, 2_699_000]
    }
  ]),
  cars = ref(),
  // TODO analyze cars max price from cars list here
  maxCarPrice = computed(() => 999_999_999)

onMounted(() => {
  alert('Сторінка ще в розробці!')
  useRouter().push('/')
})
</script>

<style lang="scss" scoped>
.stock {
  &__h {}
}

.main {}

.filter {
  &__s {}

  &__name {}

  &__checkbox {}

  .range {
    &__input {}

    &__delimiter {}
  }
}

.car {
  &__s {}

  &__images {
    &--main {}
  }

  &__info {}

  &__name {}

  &__char {}

  &__price {
    &-primary {}

    &-secondary {}
  }

  &__btns {}
}
</style>
