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
				:style="{ backgroundImage: `url(${data.banner_image})` }"
			>
				<h1 class="article-1__h article-1__h--1">
					{{ data.banner_title }}
				</h1>
				<h2 class="article-1__h article-1__h--2">
					{{ data.banner_subtitle }}
				</h2>
			</article>

			<article class="article-4">
				<h3 class="article-4__h">{{ data.text_block_title }}</h3>
				<div
					class="article-4__text"
					v-html="data.text_block"
				></div>
			</article>

			<article
				class="specifications"
				v-if="data.credit_terms"
			>
				<div class="specifications__inner">
					<div class="specifications__h">
						{{ data.credit_terms?.[0]?.value?.table_caption }}
					</div>
					<div class="specifications__categories">
						<div
							class="category"
							v-for="(category, counter) in data.credit_terms"
							:class="{ 'category--active': counter == activeCategoryIndex }"
							@click="activeCategoryIndex = counter"
						>
							<img
								:src="category.value.bank_icon"
								class="category__image"
							/>
							<div class="category__text">
								{{ category.value.table.table_caption }}
							</div>
						</div>
					</div>

					<div
						class="table"
						v-if="data.credit_terms?.[activeCategoryIndex]?.value?.table?.data?.length"
					>
						<div
							class="table__body"
							:style="{ gridTemplateColumns: `repeat(${data.credit_terms[activeCategoryIndex]?.value?.table?.data?.[0]?.length}, 1fr)` }"
						>
							<div
								class="table__heading"
								v-for="(h, counter) in data.credit_terms[activeCategoryIndex]?.value?.table?.data[0]"
							>
								{{ h }}
							</div>

							<template
								v-for="item in data.credit_terms[activeCategoryIndex]?.value?.table?.data?.slice(1)"
							>
								<template v-for="cell in item">
									<div class="table__cell">{{ cell }}</div>
								</template>
							</template>
						</div>
					</div>

					<a
						:href="data.credit_terms?.[0]?.value?.all_conditions"
						target="_blank"
						class="show"
						>{{ i18n.pages.lending.moreDetailsAboutConditions?.[langStore.activeLang] }}
					</a>
				</div>
			</article>

			<article
				class="article-1 credit"
				:style="{ backgroundImage: `url(${data.contact_banner_image})` }"
			>
				<h3 class="article-1__h article-1__h--1">
					{{ data.contact_banner_title }}
				</h3>
				<div class="article-1__h article-1__h--2">
					{{ data.contact_banner_subtitle }}
				</div>
				<div
					class="btn btn--white"
					@click="isModalOpened = true"
				>
					{{ data.contact_banner_button_text }}
				</div>
			</article>

			<ModalContact
				:heading="i18n.modal.service"
				:is-opened="isModalOpened"
				:mailObj="{type: 'financial_service', page: 'financial_service'}"
				@close="isModalOpened = false"
			/>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from "@/components/icons/logo.vue";
import Battery from "@/components/icons/techs/battery.vue";
import Comfort from "@/components/icons/techs/comfort.vue";
import Dimensions from "@/components/icons/techs/dimensions.vue";
import Engine from "@/components/icons/techs/engine.vue";
import Main from "@/components/icons/techs/main.vue";
import Multimedia from "@/components/icons/techs/multimedia.vue";
import Safety from "@/components/icons/techs/safety.vue";
import Wheels from "@/components/icons/techs/wheels.vue";
import ModalContact from "@/components/ModalContact.vue";
import API from '@/composables/API';
import { useLangStore } from "@/stores/lang";
import { useLoaderStore } from "@/stores/loader";
import { computed, markRaw, onMounted, ref, watch } from 'vue';

let data = ref({}),
  langStore = useLangStore(),
  categories = ref([
    {
      icon: markRaw(Main),
      name: 'ПриватБанк'
    }, {
      icon: markRaw(Comfort),
      name: 'ОщадБанк'
    }, {
      icon: markRaw(Multimedia),
      name: 'УкрГазБанк'
    }, {
      icon: markRaw(Safety),
      name: 'А-банк'
    }, {
      icon: markRaw(Wheels),
      name: 'Credit agricole'
    }, {
      icon: markRaw(Battery),
      name: 'ОТР Банк'
    }, {
      icon: markRaw(Engine),
      name: 'Правекс Банк'
    }, {
      icon: markRaw(Dimensions),
      name: 'Пумб'
    }
  ]),
  techs = ref({}),
  activeCategoryIndex = ref(0),
	isModalOpened = ref(false)
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => langStore.activeLang, async () => {
  data.value = await API.LendingPage.get();
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.LendingPage.get();
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
.table {
  &__body {
    grid-template-columns: unset;
    grid-auto-flow: row;
  }
}

.article-4 {
  background-color: #fff;

  &__h {
    max-width: 456px;
  }
}

.specifications {
  &__categories {
    background-color: unset;
    flex-wrap: wrap;
    gap: 20px;
    max-width: 80%;
  }

  .category {
    width: fit-content;
    background-color: #fff;

    &__image {
      width: 20px;
    }

    &::before {
      display: none;
    }
  }
}

.credit {
  padding: 50px;
  justify-content: flex-start;
}

@media screen and (max-width:876px) {
  .article-1 {
    &__btns {
      flex-direction: column;
      gap: 16px;
    }
  }

  .specifications {
    &__inner {
      padding: 50px 16px;
    }

    &__h {
      font-size: 36px;
    }

    &__categories {
      width: 100%;
      padding: 0;
      background-color: unset;
      flex-wrap: wrap;
      gap: 12px 4px;
    }

    .category {
      width: fit-content;
      padding: 7px 12px;
      gap: 6px;
      background-color: #fff;

      &::before {
        display: none;
      }
    }
  }
}
</style>
