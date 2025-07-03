<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>
		<template v-if="data">
			<article
				class="article-1"
				:style="{ backgroundImage: `url(${data?.banner_image})` }"
			>
				<h1 class="article-1__h article-1__h--1">
					{{ data?.banner_title }}
				</h1>
				<h2 class="article-1__h article-1__h--2">
					{{ data?.banner_subtitle }}
				</h2>
			</article>

			<article
				class="guide"
				v-if="models"
			>
				<div
					class="guide__text"
					v-html="data?.text_block"
				></div>
				<h3 class="guide__h">
					{{ i18n.pages.guarantee.userGuide?.[langStore.activeLang] }}
				</h3>
				<div class="guide__models">
					<a
						class="model"
						v-for="model in data?.auto_cards"
						:href="model.value.document.url"
						:key="model.id"
					>
						<img
							class="model__image"
							:src="model.value.image.url"
						/>
						<div class="model__name">{{ model.value.title }}</div>
						<div class="model__learn">{{ data.learn_more_button_text }}</div>
					</a>
				</div>
			</article>

			<article class="guarantee">
				<h3 class="guarantee__h">
					{{ i18n.pages.guarantee.conditions?.[langStore.activeLang] }}
				</h3>
				<div class="guarantee__text">
					<ul>
						<li
							v-for="text in data?.guarantee_clauses"
							v-html="text.value.title"
							:key="text.id"
						></li>
					</ul>
				</div>
			</article>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from "@/components/icons/logo.vue";
import API from "@/composables/API";
import { useLangStore } from "@/stores/lang";
import { useLoaderStore } from "@/stores/loader";
import { computed, onMounted, ref } from "vue";

let models = ref([]),
  data = ref({})

let langStore = useLangStore()
let isLoading = computed(() => useLoaderStore().isLoading)

onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.GuaranteePage.get();
  models.value = (await API.Models.get()).car_models;
  console.log(models.value)
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
.guide {
  margin: 60px 76px;

  &__text {
    font-size: 28px;
    line-height: 1.25;
    text-align: center;
    margin-bottom: 60px;
  }

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
    text-align: center;
    margin-bottom: 24px;
  }

  &__models {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 40px 20px;
  }

  .model {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // 20px here for parent h-gap
    width: calc((100% - (20px * 3)) / 4);

    &:hover {
      .model__learn {
        text-decoration: underline;
      }
    }

    &__image {
      width: 100%;
      aspect-ratio: 307/173;
      object-fit: contain;
    }

    &__name {
      font-family: Tenor Sans;
      font-size: 28px;
      line-height: 1.2;
      text-align: center;
    }

    &__learn {
      margin-top: 8px;
      font-size: 16px;
      line-height: 1.15;
      color: #69514B;
    }
  }
}

@media screen and (max-width: 876px) {
  .guide {
    margin: 50px 16px;

    &__text {
      font-size: 18px;
    }

    &__h {
      margin-top: 5px;
      margin-bottom: 16px;
      font-size: 36px;
    }

    &__models {
      gap: 20px 15px;
    }

    .model {
      width: calc((100% - 15px) / 2);

      &__image {
        aspect-ratio: 165/83;
      }

      &__name {
        font-size: 20px;
      }

      &__learn {
        font-size: 14px;
      }
    }
  }

  .guarantee {
    margin: 50px 16px;

    &__h {
      font-size: 36px;
      text-align: center;
    }

    &__text {
      columns: 1;
    }
  }
}
</style>
