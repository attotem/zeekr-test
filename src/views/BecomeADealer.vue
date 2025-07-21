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

			<article class="how">
				<div class="how__h">{{ data.value_block_title }}</div>
				<div
					class="how__text"
					v-html="data.value_block_text"
				></div>

				<div class="how__items">
					<div
						class="item"
						v-for="item in data.value_cards"
					>
						<div class="item__icon">
							<img :src="item.value?.image?.url" />
						</div>
						<div class="item__h">{{ item.value.title }}</div>

						<div
							class="item__text"
							v-html="item.value.description"
						></div>
					</div>
				</div>

				<a
					class="btn btn--orange"
					:href="data.dealer_form"
					target="_blank"
				>
					Завантажити форму
				</a>
			</article>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from '@/components/icons/logo.vue';
import API from '@/composables/API';
import { useLangStore } from '@/stores/lang';
import { useLoaderStore } from '@/stores/loader';
import { computed, onMounted, ref, watch } from 'vue';

let data = ref({})
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => useLangStore().activeLang, async () => {
  data.value = await API.BecomeADealer.get();
})

onMounted(async () => {
	useLoaderStore().isLoading = true;
  data.value = await API.BecomeADealer.get();
	useLoaderStore().isLoading = false;
})
</script>

<style lang="scss" scoped>
.how {
  padding: 80px 76px;

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
  }

  &__text {
    font-size: 16px;
    line-height: 1.2;
    margin-top: 16px;
    margin-bottom: 24px;
    max-width: 72%;
  }

  &__items {
    margin-bottom: 40px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    .item {
      display: grid;
      grid-template-columns: 34px auto;
      justify-content: center;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid #000;

      &__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 34px;
        height: 34px;
        background-color: #EAE8E2;
        border-radius: 50%;
      }

      &__h {
        font-size: 24px;
        font-weight: 500;
        line-height: 1.25;
      }

      &__text {
        font-size: 16px;
        line-height: 1.2;
        grid-column: 1 / span 2;
      }
    }
  }
}

@media screen and (max-width: 876px) {
  .how {
    padding: 50px 16px;

    &__h {
      font-size: 36px;
    }

    &__text {
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 24px;
      max-width: unset;
    }

    &__items {
      display: flex;
      flex-direction: column;
      margin-bottom: 32px;

      .item {
        &__h {
          font-size: 22px;
        }

        &__text {
          font-size: 14px;
        }

        &:last-of-type {
          border-bottom: unset;
          padding-bottom: unset;
        }
      }
    }

    .btn {
      width: 100%;
    }
  }
}
</style>
