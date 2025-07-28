<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<template v-else-if="data">
			<article
				class="article-1"
				:style="{ backgroundImage: `url(${data.banner_image})` }"
			>
				<h1 class="article-1__h article-1__h--1">
					{{ data.banner_title }}
				</h1>
				<h2 class="article-1__h article-1__h--2">
					{{ data.banner_subtitle }}
				</h2>
			</article>

			<article class="name">
				<svg
					width="401"
					height="71"
					viewBox="0 0 401 71"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="name__logo"
				>
					<g clip-path="url(#clip0_166_4213)">
						<path
							d="M27.4548 3.37622H3.97656V66.6803H45.2809M27.4548 3.37622H69.194V66.6803H45.2809M27.4548 3.37622V26.1657L45.2809 43.8908V66.6803"
							stroke="black"
							stroke-width="6"
						/>
						<path
							d="M151.37 17.7251H109.196V23.6335H135.718L107.457 52.3313H149.196V46.4229H122.674L151.37 17.7251Z"
							fill="black"
						/>
						<path
							d="M210.066 23.6335V17.7251H173.109V52.3313H210.066V46.4229H180.066V37.5604H208.327V31.652H180.066V23.6335H210.066Z"
							fill="black"
						/>
						<path
							d="M270.499 23.6335V17.7251H233.543V52.3313H270.499V46.4229H240.499V37.5604H268.76V31.652H240.499V23.6335H270.499Z"
							fill="black"
						/>
						<path
							d="M293.977 17.7251H301.803V34.8172L327.02 17.7251H338.759L313.107 34.1842L338.759 52.3313H327.455L301.803 34.8172V52.3313H293.977V17.7251Z"
							fill="black"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M355.719 17.7251V52.3313H363.11V34.6062L389.632 52.3313H400.501L381.806 39.6705H387.023C393.267 39.6705 398.327 34.7579 398.327 28.6978C398.327 22.6377 393.267 17.7251 387.023 17.7251H355.719ZM363.11 34.6062V23.6335H385.284C388.406 23.6335 390.936 26.0898 390.936 29.1198C390.936 32.1499 388.406 34.6062 385.284 34.6062H363.11Z"
							fill="black"
						/>
					</g>
					<defs>
						<clipPath id="clip0_166_4213">
							<rect
								width="400"
								height="70.0565"
								fill="white"
								transform="translate(0.5)"
							/>
						</clipPath>
					</defs>
				</svg>

				<div class="name__letters">
					<div
						class="letter"
						v-for="item in i18n.pages.about.letters"
					>
						<div class="letter__letter">{{ item.letter }}</div>
						<div class="letter__text">
							{{ item.definition?.[langStore.activeLang] }}
						</div>
					</div>
				</div>
			</article>

			<article class="values">
				<h3 class="values__h">{{ data.value_block_title }}</h3>
				<div class="values__underh">
					{{ data.value_block_subtitle }}
				</div>
				<div
					class="values__items"
					v-if="data?.value_cards?.length"
				>
					<div
						class="item"
						v-for="item in data?.value_cards"
					>
						<img
							class="item__image"
							:src="item?.value?.image?.url"
						/>
						<h4 class="item__h">{{ item?.value?.title }}</h4>
						<div
							class="item__text"
							v-html="item?.value?.description"
						></div>
					</div>
				</div>
			</article>

			<article class="article-2">
				<video
					class="article-2__video"
					v-if="data.text_block_video"
					:src="data.text_block_video"
					autoplay
					muted
					loop
				></video>
				<h3 class="article-2__h article-2__h--1">
					{{ data.text_block_title }}
				</h3>
				<div
					class="article-2__h article-2__h--2"
					v-html="data.text_block_description"
				></div>
			</article>

			<div class="center1">
				<h3 class="center1__h">{{ data.center_text_block_title }}</h3>
				<div
					class="center1__underh"
					v-html="data.center_text_block_description"
				></div>
				<img
					class="center1__image"
					:src="data.image_on_beige_background"
				/>
			</div>

			<div
				class="article-2 news"
				v-if="false"
			>
				<div class="article-2__h">
					{{ i18n.universal.news?.[langStore.activeLang] }}
				</div>
				<Slider
					:slider-type="2"
					:count="news?.length"
				>
					<RouterLink
						class="slide"
						v-for="article in news.results"
						:id="article.id"
						:to="`/news/${article.id}/${langStore.activeLang}`"
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
				</Slider>
			</div>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from "@/components/icons/logo.vue";
import Slider from "@/components/Slider.vue";
import API from "@/composables/API";
import { useLangStore } from "@/stores/lang";
import { useLoaderStore } from "@/stores/loader";
import { computed, onMounted, ref, watch } from "vue";

let langStore = useLangStore()
let news = ref([]),
  data = ref({})
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => langStore.activeLang, async () => {
  data.value = await API.AboutCompanyPage.get();
  news.value = await API.News.get();
})

onMounted(async () => {
	useLoaderStore().isLoading = true;
  data.value = await API.AboutCompanyPage.get();
  news.value = await API.News.get();
	useLoaderStore().isLoading = false;
  news.value = await API.News.get();
})
</script>

<style lang="scss" scoped>
.name {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 80px;
  padding: 80px 76px;
  background-color: #EAE8E2;

  &__letters {
    display: flex;
    flex-direction: row;
    gap: 20px;

    .letter {
      width: 100%;
      border-top: 1px solid #000;
      padding-top: 24px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 24px;

      &__letter {
        font-family: Tenor Sans;
        font-size: 56px;
        line-height: 1;
      }

      &__text {
        font-size: 16px;
        line-height: 1.25;
      }
    }
  }
}

.values {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 80px 76px;

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.25;
  }

  &__underh {
    margin-top: 16px;
    margin-bottom: 24px;
    font-size: 24px;
    line-height: 1.2;
    text-align: center;
    max-width: 520px;
  }

  &__items {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    align-items: flex-start;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      overflow-wrap: anywhere;

      &__image {
        aspect-ratio: 417/545;
        height: 545px;
        object-fit: cover;
      }

      &__h {
        font-family: Tenor Sans;
        font-size: 24px;
        line-height: 1.25;
        margin-top: 16px;
        margin-bottom: 12px;
      }

      &__text {
        font-size: 16px;
        line-height: 1.2;
        text-align: center;
      }
    }
  }
}

.center1 {
  padding: 80px 76px;
  background-color: #EAE8E2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 64.4px;
    text-align: center;
    max-width: 584px;
  }

  &__underh {
    margin-top: 16px;
    margin-bottom: 24px;
    font-family: Tenor Sans;
    font-size: 16px;
    line-height: 18.4px;
    max-width: 806px;
    text-align: center;
  }

  &__image {
    width: 100%;
  }
}

.article {
  &-2 {
    position: relative;
    min-height: 577px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;

    &__video {
      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(.5);
    }

    &__h {
      &--2 {
        font-size: 24px;
        line-height: 1.15;
      }
    }
  }
}

@media screen and (max-width: 876px) {
  .name {
    padding: 50px 16px;

    &__logo {
      width: 100%;
    }

    &__letters {
      flex-direction: column;

      .letter {
        gap: 14px;

        &__letter {
          min-width: 42px;
          font-size: 28px;
          text-align: center;
        }

        &__text {
          width: 100%;
          font-size: 14px;
        }
      }
    }
  }

  .values {
    margin: 50px 16px;

    &__h {
      font-size: 36px;
    }

    &__text {
      font-size: 16px;
    }

    &__items {
      width: 100%;
      overflow-x: auto;
      justify-content: flex-start;
      align-items: stretch;

      .item {
        height: 100%;

        &__image {
          aspect-ratio: 314/410;
          height: unset;
          width: 314px;
        }
      }
    }
  }

  .center1 {
    padding: 50px 16px;

    &__h {
      font-size: 36px;
    }

    &__text {
      font-size: 14px;
    }
  }
}
</style>
