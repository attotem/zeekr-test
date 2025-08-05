<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<div
			class="bg"
			v-if="data"
		>
			<div class="stock">
				<div class="stock__h">
					{{ i18n.pages.stock.carsInStock?.[langStore.activeLang] }}
				</div>

				<main class="main">
					<div
						class="sort"
						id="sort"
					>
						<div
							class="sort__inner"
							@click="mobileSortOpened = true"
						>
							<Sort class="sort__icon" />
							<div class="sort__active">
								{{ sorts[activeSortsIndex]?.label || sorts[activeSortsIndex]?.text }}
							</div>
							<Dropdown />
						</div>
						<div
							class="dropdown"
							id="sort-dropdown"
							:class="{'dropdown--opened': mobileSortOpened}"
							@click="mobileSortOpened = false"
						>
							<div class="dropdown__inner">
								<div class="dropdown__h--mobile">
									{{ i18n.pages.stock.sort?.[langStore.activeLang] }}
									<Cross @click="mobileSortOpened = false" />
								</div>

								<div
									class="sort__item"
									v-for="(sort, counter) in sorts"
									:class="{ 'sort__item--active': activeSortsIndex == counter }"
									@click="activeSortsIndex = counter; mobileSortOpened = false"
								>
									{{ sort.text }}
								</div>
							</div>
						</div>
					</div>

					<div
						class="filters--mobile"
						@click="mobileFiltersOpened = true"
					>
						<Filters />
						{{ i18n.pages.stock.filters?.[langStore.activeLang] }}
						<div
							class="filters__count"
							v-if="Object.keys(chosenFilters)?.length"
						>
							{{ Object.keys(chosenFilters)?.length }}
						</div>
					</div>

					<div
						v-if="Object.keys(chosenFilters).length"
						class="list"
					>
						<div
							v-for="filter in Object.entries(chosenFilters)"
							class="list__category"
						>
							{{ filters.find(el => el.id == filter[0]).name }}:
							<div
								v-for="value in filter[1]"
								class="list__value"
							>
								{{ filters.find(el => el.id == filter[0]).values.find(el => el.id == value)?.string }}
							</div>
							<Cross
								class="list__cross"
								@click="delete chosenFilters[filter[0]]"
							/>
						</div>
					</div>

					<aside
						class="filters"
						:class="{'filters--opened': mobileFiltersOpened}"
					>
						<div class="filters__h--mobile">
							{{ i18n.pages.stock.filters?.[langStore.activeLang] }}
							<Cross @click="mobileFiltersOpened = false" />
						</div>
						<div
							class="filter"
							v-for="filter in filters"
							:id="`filter-${filter.id}`"
							:key="`filter-${filter.id}`"
						>
							<div class="filter__name">{{ filter.name }}</div>
							<Expand />

							<div
								class="dropdown"
								:id="`filter-${filter.id}-dropdown`"
							>
								<div class="dropdown__inner">
									<template v-if="true || filter.type == 'checkbox'">
										<label
											class="filter__label"
											v-for="item in filter.values"
											@click.stop
											:key="item.id"
										>
											<input
												class="filter__input"
												type="checkbox"
												:id="`filter-${filter.id}-checkbox-${item.id}`"
												@change="applyFilter(filter.id, item.id)"
											/>
											<div
												class="filter__checkbox"
												:id="`filter-${filter.id}-checkbox-${item.id}`"
											>
												<Checkbox />
											</div>
											{{ item.string }}
										</label>
									</template>
								</div>
							</div>
						</div>

						<div
							class="filter"
							:id="`filter-price`"
							:key="`filter-price`"
						>
							<div class="filter__name">
								{{ i18n.pages.stock.priceFilter?.[langStore.activeLang] }}
							</div>
							<Expand />

							<div
								class="dropdown"
								:id="`filter-price-dropdown`"
								@click.stop
							>
								<div class="dropdown__inner">
									<div class="range">
										<input
											class="range__input"
											type="number"
											min="0"
											:max="maxCarPrice"
											v-model="price.range[0]"
											name="priceMin"
										/>
										<div class="range__delimiter"></div>
										<input
											class="range__input"
											type="number"
											min="0"
											:max="maxCarPrice"
											v-model="price.range[1]"
											name="priceMax"
										/>
									</div>
								</div>
							</div>
						</div>

						<div
							class="btn btn--black"
							@click="mobileFiltersOpened = false; search()"
						>
							{{ i18n.pages.stock.applyFilters[langStore.activeLang] }}
						</div>
					</aside>

					<section
						class="cars"
						v-if="data?.length"
					>
						<div
							class="car"
							v-for="car in data"
							:key="car.id"
						>
							<div class="car__images">
								<img
									class="car__image car__image--main"
									v-if="activeImagesMap?.[car.id] || car?.exterior_images?.[0]"
									:src="activeImagesMap[car.id] || car?.exterior_images?.[0]"
								/>
								<img
									class="car__image"
									v-for="(image, counter) in car.exterior_images.slice(0,3)"
									:key="`${car.id}-image-${counter}`"
									:src="image"
									@click="activeImagesMap[car.id] = image"
								/>
							</div>

							<div class="car__info">
								<div class="car__name">{{ car.car_model_name }}</div>
								<div
									class="car__char"
									v-for="char in car.data.base_features"
									:key="`${car.id}-${char.key}`"
								>
									<span>
										<strong>{{ char.key }}:</strong> {{ char.value }}
									</span>
								</div>

								<div class="car__price">
									{{ moneyFormat(car.price_uah) }} UAH

									<div class="car__price-secondary">
										{{ moneyFormat(car.price) }}$
									</div>
								</div>

								<div class="car__btns">
									<RouterLink
										:to="`cars-in-stock/${car.id}`"
										class="btn btn--transparent btn--transparent-black"
									>
										{{ i18n.pages.stock.details?.[langStore.activeLang] }}
									</RouterLink>
									<div class="btn btn--black">
										{{ i18n.pages.stock.sendAnApplication?.[langStore.activeLang] }}
									</div>
								</div>
							</div>
						</div>
					</section>
					<div
						v-else
						class="notFound"
					>
						<div class="notFound__h">
							{{ i18n.pages.stock.notFound[langStore.activeLang] }}
						</div>
						<div class="notFound__text">
							{{ i18n.pages.stock.otherOptions[langStore.activeLang] }}
						</div>
						<div
							class="btn btn--orange"
							v-if="false"
						>
							Configurator
						</div>
					</div>
				</main>
			</div>
		</div>
	</TransitionGroup>
</template>

<script setup>
import Checkbox from '@/components/icons/checkbox.vue';
import Dropdown from '@/components/icons/dropdown.vue';
import Expand from '@/components/icons/expand.vue';
import Logo from '@/components/icons/logo.vue';
import Filters from '@/components/icons/filters.vue';
import API from '@/composables/API';
import addDropdown from '@/composables/dropdown';
import { useLangStore } from '@/stores/lang';
import { useLoaderStore } from '@/stores/loader';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import Sort from '@/components/icons/sort.vue';
import Cross from '@/components/icons/cross.vue';

const moneyFormat = (price) => new Intl.NumberFormat("ua-UA").format(price)

let sorts = ref([
  {
    id: 0,
    text: 'By novelty (newest by publication date)',
		label: 'By novelty'
  },
  {
    id: 1,
    text: 'By popularity (the largest number of applications)',
		label: 'By popularity'
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
	activeImagesMap = ref({}),
  filters = ref([]),
	chosenFilters = ref({}),
  data = ref(),
	maxCarPrice = ref(null),
	price = ref({
		range: []
	}),
	mobileFiltersOpened = ref(false),
	mobileSortOpened = ref(false)

let langStore = useLangStore()
let isLoading = computed(() => useLoaderStore().isLoading)

const applyFilter = (categoryId, optionId) => {
	console.log(categoryId, optionId)
	if(chosenFilters.value[categoryId]) {
		if(chosenFilters.value[categoryId].includes(optionId)) {
			chosenFilters.value[categoryId] = chosenFilters.value[categoryId].filter(el => el !== optionId)
			if(chosenFilters.value[categoryId].length == 0) delete chosenFilters.value[categoryId]
		}
		else chosenFilters.value[categoryId].push(optionId)
	}
	else {
		chosenFilters.value[categoryId] = [optionId]
	}
	console.log(chosenFilters.value)
}

const transformFilters = () => Object.entries(chosenFilters.value).map(el => `${el[0]}=${el[1]}`).join("&")

const search = async () => {
	console.log(chosenFilters.value, transformFilters())
  data.value = await API.CarsInStock.get(transformFilters())
}

watch(() => langStore.activeLang, async () => {
  search();
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  filters.value = await API.CarsInStock.getFilters();
	data.value = await API.CarsInStock.get();
	maxCarPrice.value = Math.max(...data.value.map(el => el.price_uah))
	price.value.range = [0, maxCarPrice.value];
	console.log(data.value, maxCarPrice.value)
  useLoaderStore().isLoading = false
	nextTick(() => {
		addDropdown("sort", false, false);
		filters.value.forEach(el => {
			addDropdown(`filter-${el.id}`, false, true)
		})
		addDropdown(`filter-price`, false, true)
	})
})
</script>

<style lang="scss" scoped>
.bg{
	background-color: #f6f6f6;
}

.stock {
	max-width: 1288px;
	display: flex;
	flex-direction: column;
  padding: 144px 0 80px 0;
	margin: auto;
	background-color: #f6f6f6;

  &__h {
		font-family: Tenor Sans;
		font-size: 56px;
		line-height: 125%;
	}
}

.main {
	display: grid;
	grid-template-columns: max(10%, 308px) auto 198px;
	gap: 12px 20px;
}

.sort {
	grid-column: 3;
	position: relative;
	max-height: unset;
	width: fit-content;
	margin-left: auto;

	&__inner {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		padding: 12px 16px;
		border-radius: 8px;
		background-color: #FFFFFF;

		font-weight: 500;
		font-size: 16px;
	}

	&__icon {
		display: none;
	}

	&__item {
		font-size: 16px;
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}

		&--active {
			color: #69514B;
			text-decoration: underline;
		}
	}

	&__checkbox {
		display: none;
	}

	.dropdown {
		left: unset;
		right: 0;
		width: max-content;
		border-radius: 8px;

		&__inner {
			height: 100%;
			display: flex;
			flex-direction: column;
			gap: 16px;
			padding: 16px;
			background-color: #fff;
			box-shadow: 4px 4px 12px 2px #4444440D;
		}

		&__h--mobile {
			display: none;
		}
	}
}

.filter {
	grid-column: 1;
	position: relative;
	display: grid;
	grid-template-columns: 1fr auto;
	justify-content: space-between;
	align-items: center;
	padding: 24px 0;
	cursor: pointer;

	&:has(+&) {
		border-bottom: 1px solid #000;
	}

  &s {
		width: 100%;
		display: flex;
		flex-direction: column;

		&--mobile {
			display: none;
		}

		&__h--mobile {
			display: none;
		}
	}

  &__name {
		font-weight: 500;
		font-size: 20px;
		line-height: 120%;
	}

	.dropdown {
		top: unset;
		position: relative;
		grid-column: 1 / span 2;

		&__inner {
			padding-top: 16px;
			display: flex;
			flex-direction: column;
			gap: 12px;
		}
	}

	&__label {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		line-height: 100%;
		color: #2b2b2b;
		cursor: pointer;
	}

	&__input {
		display: none;

		&:checked + .filter__checkbox svg {
			opacity: 1;
		}
	}

  &__checkbox {
		width: 20px;
		height: 20px;
		aspect-ratio: 1/1;
		border: 1px solid #000;
		border-radius: 4px;

		svg {
			width: 100%;
			height: 100%;
			opacity: 0;
			transition: .2s ease-in-out;
		}
	}

  .range {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 6px;

    &__input {
			width: 100%;
			padding: 10px 12px;
			border: 1px solid #DDDDDD;
			font-size: 14px;
			border-radius: 8px;
		}

    &__delimiter {
			flex-shrink: 0;
			width: 20px;
			height: 1px;
			background-color: #DDDDDD;
		}
  }
}

.list {
	display: none;
}

.car {
	overflow: hidden;
	width: 100%;
	display: flex;
	flex-direction: row;
	border-radius: 8px;
	background-color: #fff;

  &s {
		display: flex;
		flex-direction: column;
		gap: 32px;
		grid-column: 2 / span 2;
	}

  &__image {
		width: 100%;
		height: 137px;
		aspect-ratio: 169/137;
		object-fit: cover;

		&s {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 10px;
			height: fit-content;
		}

    &--main {
			grid-column: 1 / span 3;
			aspect-ratio: 525/301;
			height: 301px;
		}
  }

  &__info {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 28px 20px;
	}

  &__name {
		font-family: Tenor Sans;
		font-weight: 400;
		font-size: 40px;
		line-height: 125%;
	}

  &__char {
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-weight: 400;
		font-size: 16px;
		line-height: 120%;

		strong {
			font-weight: 500;
		}
	}

  &__price {
		margin-top: 8px;
		font-weight: 500;
		font-size: 24px;
		line-height: 120%;

    &-secondary {
			font-weight: 400;
			font-size: 16px;
			color: #9DA2A5;
		}
  }

  &__btns {
		margin-top: 24px;
		display: flex;
		flex-direction: row;
		gap: 20px;
	}
}

.notFound {
	width: 100%;
	height: fit-content;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 12px;
	margin-top: 24px;

	&__h {
		font-family: Tenor Sans;
		font-size: 22px;
		line-height: 125%;
	}

	&__text {
		font-size: 14px;
		line-height: 120%;
	}

	.btn {
		margin-top: 12px;
	}
}

@media screen and (max-width: 876px) {
	.stock {
		max-width: unset;
		width: 100%;
		padding: 96px 16px;
		margin: unset;

		&__h {
			font-size: 42px;
		}
	}

	.main {
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.sort {
		grid-column: 2;
		grid-row: 1;
		width: 100%;

		&__inner {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			gap: 4px;
			font-weight: 400;
		}

		&__icon {
			display: block;
		}

		&__active {
			margin-right: auto;
		}

		&__checkbox {
			display: block;
		}

		.dropdown {
			z-index: -1;
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			background-color: #00000066;
			transition: .3s ease-in-out;
			max-height: unset;
			right: unset;
			border-radius: unset;
			top: unset;
			opacity: 0;

			&--opened {
				z-index: 1000000;
				opacity: 1;

				.dropdown__inner {
					bottom: 0;
				}
			}

			&__inner {
				position: absolute;
				height: fit-content;
				margin-top: auto;
				border-radius: 8px 8px 0 0;
				bottom: -100%;
				transition: .5s ease-in-out;
			}

			&__h--mobile {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				background-color: #fff;

				font-weight: 500;
				font-size: 20px;
				line-height: 140%;
			}
		}
	}

	.filter {
		padding: 16px 0;
		margin: 0 16px;

		&s {
			z-index: 10000;
			position: fixed;
			left: 0;
			bottom: -100%;
			width: 100dvw;
			height: 100dvh;
			background-color: #f6f6f6;
			transition: .5s ease-in-out;

			&--mobile {
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				gap: 4px;
				padding: 8px;
				border-radius: 8px;
				background-color: #fff;
			}

			&--opened {
				bottom: 0;
			}

			&__count {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 16px;
				height: 16px;
				padding: 2px 4px;
				border-radius: 100%;
				background-color: #F75400;
				font-size: 10px;
				line-height: 1;
				color: #fff;
			}

			&__h--mobile {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				height: 64px;
				padding: 16px;
				background-color: #fff;

				font-weight: 500;
				font-size: 20px;
				line-height: 140%;
			}

			.btn {
				width: auto;
				margin: 0 16px;
			}
		}

		&__name {
			font-size: 16px;
		}

		.dropdown {
			gap: 10px;
		}

		&__label {
			font-size: 14px;
		}
	}

	.list {
		grid-column: 1 / span 2;
		grid-row: 2;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;

		font-weight: 500;
		font-size: 14px;
		line-height: 1;

		&__category {
			position: relative;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
			gap: 1ch;
			padding: 10px 12px;
			border-radius: 6px;
			background-color: #EAE8E2;
			// for cross
			padding-right: 40px;
		}

		&__value {
			&:not(&:last-of-type)::after {
				content: ',';
			}
		}

		&__cross {
			position: absolute;
			right: 10px;
			top: 5px;
			margin-left: auto;
		}
	}

	.car {
		flex-direction: column;

		&s {
			grid-column: 1 / span 2;
			grid-row: 3;
			gap: 24px;
		}

		&__image {
			aspect-ratio: 112/65;
			height: 65px;

			&s {
				gap: 5px;
			}

			&--main {
				aspect-ratio: 345/201;
				height: 201px;
			}
		}

		&__info {
			padding: 16px;
			gap: 6px;
		}

		&__name {
			margin-bottom: 6px;
		}

		&__char {
			gap: 8px;
			font-size: 14px;
		}

		&__price {
			margin-top: 10px;
		}

		&__btns {
			margin-top: 18px;
			gap: 16px;

			.btn {
				min-width: 128px;
				width: auto;
			}
		}
	}

	.notFound {
		grid-column: 1 / span 2;
		padding: 16px 42px;
		margin-top: unset;
		border-radius: 6px;
		background-color: #fff;
		text-align: center;
	}
}
</style>
