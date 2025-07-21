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

			<article class="article-3">
				<section
					class="section"
					v-for="service in data?.services"
				>
					<img
						class="section__image"
						:src="service.value.image.url"
					/>
					<div class="section__info">
						<h4 class="section__h">{{ service.value.name }}</h4>
						<div
							class="section__text"
							v-html="service.value.description"
						></div>
					</div>
				</section>
			</article>

			<article
				class="article-1 dealers"
				:style="{ backgroundImage: `url(${data?.find_dealer_banner_image})` }"
			>
				<h3 class="article-1__h article-1__h--1">
					{{ data?.find_dealer_banner_title }}
				</h3>
				<div class="article-1__h article-1__h--2">
					{{ data?.find_dealer_banner_subtitle }}
				</div>
				<div
					class="btn btn--white"
					@click="isModalOpened = true"
				>
					{{ i18n.universal.show?.[langStore.activeLang] }}
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

let langStore = useLangStore(),
  data = ref({}),
  isModalOpened = ref(false)
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => langStore.activeLang, async () => {
  data.value = await API.FinancialServicesPage.get()
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.FinancialServicesPage.get()
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
.article {
  &-3 {
    margin: 80px 76px;

    .section {
      display: flex;
      flex-direction: row;
      width: 100%;

      &:nth-of-type(2n) {
        flex-direction: row-reverse;
      }

      &__image {
        width: 50%;
        object-fit: cover;
      }

      &__info {
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        background-color: #EAE8E2;
      }

      &__h {
        font-size: 28px;
        line-height: 1.25;
      }

      &__text {
        font-size: 16px;
        line-height: 1.25;
      }
    }
  }
}

.dealers {
  padding: 50px;
  justify-content: flex-start;
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

    &-3 {
      margin: 50px 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .section {
        flex-direction: column !important;

        &__image {
          width: 100%;
        }

        &__info {
          padding: 16px;
        }
      }
    }
  }

  .dealers {
    width: auto;
    margin: 0 16px;

    .article {
      &-1 {
        &__h {
          &--1 {
            font-size: 36px;
          }

          &--2 {
            font-size: 20px;

          }
        }
      }
    }
  }
}
</style>
