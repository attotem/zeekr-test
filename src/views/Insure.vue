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

			<article class="article-3">
				<section
					class="section"
					v-for="item in data.insurance_types"
				>
					<img
						class="section__image"
						:src="item.value.image.url"
					/>
					<div class="section__info">
						<div
							class="section__main-title"
							v-if="item.value.main_title"
						>
							{{ item.value.main_title }}
						</div>
						<div class="section__h">
							<div
								v-if="item.value.list_number"
								class="section__number"
							>
								{{ item.value.list_number }}
							</div>
							{{ item.value.block_title }}
						</div>
						<div
							class="section__text"
							v-html="item.value.description"
						></div>
					</div>
				</section>
			</article>

			<div
				class="details"
				v-html="data.contact_text"
			></div>

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
import { computed, markRaw, onMounted, ref, watch } from "vue";

let data = ref(),
	isModalOpened = ref(false)
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => useLangStore().activeLang, async () => {
  data.value = await API.InsurancePage.get();
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.InsurancePage.get();
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
.details {
  padding: 80px 76px;
  font-size: 28px;
  line-height: 1.25;
  text-align: center;
  color: #fff;
  background-color: #232323;
}

.section {
  &__main-title {
    font-family: Tenor Sans;
    font-size: 40px;
    line-height: 1.15;
    margin-bottom: 16px;
  }

  &__h {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  &__number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    color: #fff;
    background-color: #000;
    border-radius: 100%;

    font-size: 16px;
    line-height: 1.25;
  }
}

@media screen and (max-width: 876px) {
  .details {
    padding: 56px 24px;
  }
}
</style>
