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
						<div class="center__item center__item--phones">
							<Phone />
							<div class="center__phones">
								<a
									v-for="(phone, idx) in splitPhones(center.value.center_phone)"
									:key="idx"
									:href="phone.href"
									style="text-decoration: underline;"
									class="center__phone"
								>
									{{ phone.display }}
								</a>
							</div>
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

			<ModalContact
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
import ModalContact from "@/components/ModalContact.vue";
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

const splitPhones = (raw) => {
  if (!raw) return []
  return raw
    .split(/[,;]+/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => {
      const match = p.match(/[+0-9\s]+/)
      const phoneForTel = (match ? match[0] : p).replace(/\s+/g, '')
      return {
        display: p,
        href: `tel:${phoneForTel}`
      }
    })
}

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
.center__item--phones {
  align-items: flex-start;
}

.center__phones {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.center__phone {
  font-size: 14px;
}

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
