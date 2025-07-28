<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<template v-else-if="data">
			<div class="article">
				<div class="article__date">{{ data.post_date }}</div>
				<h1 class="article__h">
					{{ data.banner_title }}
				</h1>
				<img
					class="article__img"
					v-if="data.banner_image"
					:src="data.banner_image"
				/>
				<div
					class="article__text"
					v-html="data.text_content"
				></div>
			</div>
		</template>

		<template v-if="allNews.results?.length">
			<div class="article-2 news">
				<div class="article-2__h">
					{{ i18n.universal.news?.[langStore.activeLang] }}
				</div>
				<Slider
					:slider-type="2"
					:count="allNews.results?.length"
				>
					<template
						v-for="article in allNews.results"
						:key="article.id"
					>
						<RouterLink
							class="slide"
							v-if="article.id != $route.params.id"
							:to="`/news/${article.id}`"
						>
							<img
								class="slide__image"
								v-if="article.banner_image"
								:src="article.banner_image"
							/>
							<div class="slide__date">
								{{ article.post_date }}
							</div>
							<div class="slide__h">
								{{ article.banner_title }}
							</div>
						</RouterLink>
					</template>
				</Slider>
			</div>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from '@/components/icons/logo.vue';
import Slider from '@/components/Slider.vue';
import API from '@/composables/API';
import { useLangStore } from '@/stores/lang';
import { useLoaderStore } from '@/stores/loader';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

let langStore = useLangStore(),
  data = ref(),
  isLoading = computed(() => useLoaderStore().isLoading),
  route = useRoute(),
  allNews = ref([])

watch(() => langStore.activeLang, async () => {
  data.value = await API.News.getById(route.params.id, route.params.lang_code)
  allNews.value = await API.News.get();
})

onMounted(async () => {
	useLoaderStore().isLoading = true;
  data.value = await API.News.getById(route.params.id, route.params.lang_code)
	useLoaderStore().isLoading = false;
  allNews.value = await API.News.get();
  console.log(allNews.value)
})
</script>

<style lang="scss" scoped>
.article {
  padding: 114px 76px 80px;
  background-color: #fff;

  &__date {
    font-size: 16px;
    line-height: 1.2;
    margin-bottom: 16px;
  }

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
    margin-bottom: 24px;
  }

  &__img {
    max-width: 100%;
    margin-bottom: 24px;
  }

	&__text {
		max-width: 981px;
	}
}

:deep(ul) {
	margin: unset;
	display: block;
	padding-left: 24px;
	margin-bottom: 24px;

	li {
		border: unset;
		padding: unset;
		margin-bottom: 6px;
	}
}

:deep(p) {
	margin: 16px 0;
}

:deep(h2) {
	margin: 32px 0 16px 0;
	font-weight: 600;
	font-size: 30px;
	line-height: 1.4;
}

:deep(h3) {
	margin: 16px 0 8px 0;
	font-weight: 600;
	font-size: 16px;
	line-height: 1.4;
}

:deep(hr) {
	border: unset;
}

@media screen and (max-width: 876px) {
  .article {
    padding: 96px 16px 50px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__date {
      font-size: 14px;
    }

    &__h {
      font-size: 42px;
    }

    &__img {
      margin-bottom: 16px;
    }
  }
}
</style>
