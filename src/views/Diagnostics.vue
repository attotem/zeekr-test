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
				<div
					class="btn btn--orange"
					@click="isModalOpened = true"
				>
					{{ data.banner_button_text }}
				</div>
			</article>

			<article class="article-4">
				<h3 class="article-4__h">{{ data.text_block_title }}</h3>
				<div
					class="article-4__text"
					v-html="data.text_block_description"
				></div>
			</article>

			<article class="article-3">
				<section
					class="section"
					v-for="item in data.content_blocks"
				>
					<img
						class="section__image"
						:src="item.value.image"
					/>
					<div class="section__info">
						<div
							class="section__text"
							v-html="item.value.text_block"
						></div>
					</div>
				</section>
			</article>

			<Map :chosenCenterId="chosenCenterId"></Map>

			<div class="centers">
				<div
					class="center"
					v-for="center in centers?.center_contacts"
					:key="center.id"
					@click="chosenCenterId = center.id"
				>
					<h3 class="center__name">
						{{ center.value.center_name }}
					</h3>
					<div class="center__item">
						<Phone />
						<a
							:href="`tel:${center.value.center_phone}`"
							style="text-decoration: underline;"
							>{{ center.value.center_phone }}</a
						>
					</div>
					<div class="center__item">
						<Geo />
						{{ center.value.center_address }}
					</div>
					<div class="center__item">
						<Calendar />
						{{ center.value.center_working_hours }}
					</div>
				</div>
			</div>

			<Modal
				:heading="i18n.modal.diagnostics"
				:is-opened="isModalOpened"
				:mailObj="{type: 'signup_for_service', page: 'signup_for_service'}"
				@close="isModalOpened = false"
			/>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from "@/components/icons/logo.vue";
import Map from "@/components/Map.vue";
import Modal from "@/components/Modal.vue";
import API from "@/composables/API";
import { useLangStore } from "@/stores/lang";
import { useLoaderStore } from "@/stores/loader";
import { computed, onMounted, ref, watch } from "vue";

let langStore = useLangStore()
let isModalOpened = ref(false),
  data = ref({}),
	centers = ref({})
let isLoading = computed(() => useLoaderStore().isLoading)
let chosenCenterId = ref()

watch(() => langStore.activeLang, async () => {
  data.value = await API.DiagnosticsPage.get();
  centers.value = await API.ContactsPage.get();
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.DiagnosticsPage.get();
  centers.value = await API.ContactsPage.get();
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
@media screen and (max-width: 876px) {
  .article {
    &-1 {
      &__h {
        &--2 {
          max-width: 250px;
          margin-top: -4px;
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>
