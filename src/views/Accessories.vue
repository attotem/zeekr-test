<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<template v-else-if="data">
			<div class="accessories">
				<h1 class="accessories__h">
					{{ i18n.universal.accessories?.[langStore.activeLang] }}
				</h1>

				<div
					class="sort dropdown"
					v-if="false"
				>
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

				<div class="items">
					<h2
						class="item"
						v-for="item in data"
					>
						<img
							class="item__image"
							v-if="item.banner_image"
							:src="item.banner_image"
						/>
						{{ item.banner_title }}
					</h2>
				</div>
			</div>
		</template>
	</TransitionGroup>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import API from "@/composables/API";
import { useLangStore } from "@/stores/lang";
import { useLoaderStore } from "@/stores/loader";
import Logo from '@/components/icons/logo.vue';

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
]), activeSortsIndex = ref(0)

let langStore = useLangStore(),
  data = ref(),
  isLoading = computed(() => useLoaderStore().isLoading)

watch(() => langStore.activeLang, async () => {
  data.value = await API.Accessories.get();
})

onMounted(async () => {
	useLoaderStore().isLoading = true;
  data.value = await API.Accessories.get();
	useLoaderStore().isLoading = false;
})
</script>

<style lang="scss" scoped>
.accessories {
  padding: 114px 76px 80px;
  background-color: #F6F6F6;

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
  }

  .items {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px 20px;

    .item {
      display: flex;
      flex-direction: column;
      gap: 16px;

      &__image {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
      }

      font-weight: 500;
      font-size: 24px;
      line-height: 1.25;
      color: #000;
      transition: .3s ease-in-out;

      &:hover {
        color: #69514B;
        text-decoration: underline;
      }
    }
  }
}

@media screen and (max-width: 876px) {
  .accessories {
    padding: 96px 16px 50px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__h {
      font-size: 42px;
    }

    .items {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px 16px;

      .item {
        gap: 8px;
        font-size: 16px;
      }
    }
  }
}
</style>
