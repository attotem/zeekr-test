<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<template v-else-if="data.results">
			<div class="news">
				<h1 class="news__h">
					{{ i18n.universal.news?.[langStore.activeLang] }}
				</h1>

				<div class="items">
					<RouterLink
						class="item"
						v-for="item in data.results"
						:to="`news/${item.id}`"
					>
						<img
							class="item__image"
							v-if="item.banner_image"
							:src="item.banner_image"
						/>
						<div class="item__date">{{ item.post_date }}</div>
						<h2 class="item__text">{{ item.banner_title }}</h2>
					</RouterLink>
				</div>

				<div
					class="btn btn--black"
					@click="loadMore"
					v-if="data.has_more"
				>
					{{ i18n.universal.more?.[langStore.activeLang] }}
				</div>
			</div>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from '@/components/icons/logo.vue';
import API from '@/composables/API';
import { useLangStore } from '@/stores/lang';
import { useLoaderStore } from '@/stores/loader';
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

let langStore = useLangStore(),
  data = ref([]),
  offset = ref(0),
  limit = 9,
  isLoading = computed(() => useLoaderStore().isLoading)

watch(() => langStore.activeLang, async () => {
  data.value = await API.News.get(0, limit);
})

onMounted(async () => {
	useLoaderStore().isLoading = true;
  data.value = await API.News.get(0, limit);
	useLoaderStore().isLoading = false;
})

const loadMore = async () => {
  offset.value += limit;
  let resp = await API.News.get(offset.value, limit)
  data.value.push(resp.results)
  data.has_more = resp.has_more
}
</script>

<style lang="scss" scoped>
.news {
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
      gap: 12px;

      &__image {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
      }

      &__date {
        margin-bottom: 4px;
        font-size: 16px;
        line-height: 1.25;
      }

      &__text {
        font-weight: 500;
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        transition: .3s ease-in-out;
      }

      &:hover .item__text {
        color: #69514B;
        text-decoration: underline;
      }
    }
  }
}

@media screen and (max-width: 876px) {
  .news {
    padding: 96px 16px 50px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__h {
      font-size: 42px;
    }

    .items {
      grid-template-columns: 1fr;
      gap: 24px;

      .item {
        gap: 8px;

        &__date {
          font-size: 14px;
        }

        &__text {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
