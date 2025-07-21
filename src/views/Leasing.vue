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

			<article class="guarantee">
				<div
					class="guarantee__uppertext"
					v-html="data.text_block"
				></div>
				<h3 class="guarantee__h">{{ data.list_title }}</h3>
				<div class="guarantee__text">
					<ul>
						<li v-for="item in data.advantages_list">
							{{ item }}
						</li>
					</ul>
				</div>
			</article>

			<article class="specifications">
				<div class="specifications__inner">
					<h3 class="specifications__h">
						{{ data.leasing_terms?.[0]?.value?.table?.table_caption }}
					</h3>

					<div
						class="table"
						v-if="data.leasing_terms?.[0]?.value?.table?.data?.length"
					>
						<div
							class="table__body"
							:style="{ gridTemplateColumns: `repeat(${data.leasing_terms?.[0]?.value?.table?.data?.[0]?.length}, 1fr)` }"
						>
							<div
								class="table__heading"
								v-for="(h, counter) in data.leasing_terms?.[0]?.value?.table?.data?.[0]"
							>
								{{ h }}
							</div>

							<template
								v-for="item in data.leasing_terms?.[0]?.value?.table?.data?.slice(1)"
							>
								<template v-for="cell in item">
									<div class="table__cell">{{ cell }}</div>
								</template>
							</template>
						</div>
					</div>
				</div>
			</article>

			<article
				class="article-1"
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

			<Modal
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
import Modal from "@/components/Modal.vue";
import API from "@/composables/API";
import { useLangStore } from "@/stores/lang";
import { useLoaderStore } from "@/stores/loader";
import { computed, onMounted, ref, watch } from "vue";

let data = ref({})
let isLoading = computed(() => useLoaderStore().isLoading),
	isModalOpened = ref(false)

watch(() => useLangStore().activeLang, async () => {
  data.value = await API.LeasingPage.get();
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.LeasingPage.get();
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
.guarantee {
  &__uppertext {
    margin: -20px 44px 60px;
  }
}

.specifications {
  &__h {
    max-width: 800px;
    margin: 0 auto 34px;
  }
}

.table {
  &__body {
    grid-template-columns: unset;
    grid-auto-flow: row;
  }
}
</style>
