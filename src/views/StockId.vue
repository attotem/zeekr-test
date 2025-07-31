<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<div
			class="bg"
			v-else-if="data"
		>
			<div class="page">
				<div class="back">
					<Back />
					Назад
				</div>

				<main class="main">
					<Slider :slider-type="1">
						<article
							class="slide"
							v-for="slide in data.exterior_images"
							:style="{ backgroundImage: `url(${slide})` }"
						></article>
					</Slider>

					<div class="main__h">{{ data.car_model_name }}</div>
					<div class="main__underh">
						{{ i18n.pages.stock.newCar[langStore.activeLang] }}
					</div>
					<div class="block characteristics">
						<div class="block__h">
							{{ i18n.pages.stock.baseCharacteristics[langStore.activeLang] }}
						</div>
						<div class="characteristics__inner">
							<div
								class="characteristic"
								v-for="char in data.data.base_features"
							>
								<img
									class="characteristic__image"
									v-if="char.icon"
									:src="char.icon"
								/>
								<span class="characteristic__name">{{ char.key }}</span>
								<span class="characteristic__value">{{ char.value }}</span>
							</div>
						</div>
					</div>

					<div class="block__divider"></div>

					<div class="block">
						<div class="block__h">
							{{ i18n.pages.stock.description[langStore.activeLang] }}
						</div>
						<div class="block__text">{{ data.description }}</div>
					</div>

					<div class="block__divider"></div>

					<div class="block">
						<div class="block__h">
							{{ i18n.pages.stock.techCharacteristics[langStore.activeLang] }}
						</div>
						<div class="techs">
							<div
								class="tech"
								v-for="tech in data.data.tech_features"
							>
								<span>{{ tech.key }}</span>
								<div class="tech__divider"></div>
								<span class="tech__value">{{ tech.value }}</span>
							</div>
						</div>
						<a
							class="show"
							target="_blank"
							v-if="false"
							>Show all characteristics</a
						>
					</div>
				</main>

				<aside class="aside">
					<div
						class="block"
						v-if="data.video_review"
					>
						<img
							class="block__img"
							src=""
						/>
						<div class="block__overlay">
							<Video />
							{{ i18n.pages.stock.videoReview[langStore.activeLang] }}
						</div>
					</div>

					<div class="block">
						<img
							class="block__img"
							:src="data.interior_images?.[0]"
						/>
						<div class="block__overlay">
							<Eye />
							{{ i18n.pages.stock.interior[langStore.activeLang] }}
						</div>
					</div>

					<div class="block price">
						<div class="price__price">
							{{ moneyFormat(data.price_uah) }} UAH
							<div class="price__price--additional">
								{{ moneyFormat(data.price) }}$
							</div>
						</div>

						<div class="block__divider"></div>

						<div class="block__h">{{ data.dealership.name }}</div>

						<div class="block__text">
							<a :href="`tel:${data.dealership.phone_number}`">
								<Phone />
								{{ data.dealership.phone_number }}
							</a>
							<div>{{ data.dealership.address }}</div>
						</div>

						<div class="btn btn--orange">
							{{ i18n.pages.stock.contactWithDealer[langStore.activeLang] }}
							<Phone />
						</div>
					</div>
				</aside>
			</div>

			<div class="article-2 recommend news">
				<div class="article-2__h">
					{{ i18n.pages.stock.interestedIn[langStore.activeLang] }}
				</div>
				<Slider
					:slider-type="2"
					:count="data.similar_cars?.length"
				>
					<RouterLink
						class="slide"
						v-for="article in data.similar_cars"
						:to="`stock/${article.id}`"
						:key="article.id"
					>
						<img
							class="slide__image"
							v-if="article.main_photo"
							:src="article.main_photo"
						/>
						<div class="slide__name">{{ article.car_model_name }}</div>
						<div class="slide__price">
							{{ moneyFormat(article.price_uah) }} UAH
							<div class="slide__price--additional">
								{{ moneyFormat(article.price) }} $
							</div>
						</div>
					</RouterLink>
				</Slider>
			</div>
		</div>
	</TransitionGroup>

	<!--
  TODO add modal for images
  -->
</template>

<script setup>
import Back from '@/components/icons/back.vue';
import Eye from '@/components/icons/eye.vue';
import Logo from '@/components/icons/logo.vue';
import Phone from '@/components/icons/phone.vue';
import Video from '@/components/icons/video.vue';
import Modal from '@/components/Modal.vue';
import Slider from '@/components/Slider.vue';
import API from '@/composables/API';
import { useLangStore } from '@/stores/lang';
import { useLoaderStore } from '@/stores/loader';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

let data = ref({})
let langStore = useLangStore()
let isLoading = computed(() => useLoaderStore().isLoading)

const moneyFormat = (price) => new Intl.NumberFormat("ua-UA").format(price)

watch(() => langStore.activeLang, async () => {
  data.value = await API.CarsInStock.getById(useRoute().params.id)
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.CarsInStock.getById(useRoute().params.id)
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
.bg{
	background-color: #f6f6f6;
}

.page{
	display: grid;
	grid-template-columns: 852px 416px;
	gap: 0 20px;
	width: fit-content;
  padding: 80px 76px;
	margin: auto;
}

.back {
	grid-column: 1 / span 2;
	display: flex;
	align-items: center;
	gap: 10px;
	margin: 34px 0 26px 0;
	font-weight: 500;
	font-size: 16px;
	line-height: 1.2;
}

.main {
	overflow: hidden;
	max-width: 852px;
	margin-left: auto;
	display: flex;
	flex-direction: column;
	border-radius: 6px;
	background-color: #fff;

	:deep(.slider) {
		aspect-ratio: 852/488;
	}

	&__h {
		padding: 24px 0 0 24px;
		font-size: 42px;
		line-height: 1.15;
	}
	&__underh {
		padding-left: 24px;
		font-size: 16px;
		line-height: 1.2;
		color: #9DA2A5;
	}
}

.block {
	padding: 24px;
	&__h {
		font-weight: 600;
		font-size: 24px;
		line-height: 1.25;
		margin-bottom: 16px;
	}
	&__text {
		font-weight: 400;
		font-size: 16px;
		line-height: 130%;
	}
	&__divider {
		width: 100%;
		height: 1px;
		background-color: #DDDDDD;
	}
}

.characteristic {
	&s {
		&__inner {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
			margin-top: 24px;
		}
	}

	display: grid;
	grid-template-columns: 40px auto;
	grid-template-rows: auto auto;
	gap: 4px 12px;
	font-size: 16px;
	line-height: 120%;

	&__image {
		grid-column: 1;
		grid-row: 1 / span 2;
		border-radius: 100%;
		padding: 8px;
		width: 40px;
		height: 40px;
		background-color: #EAE8E2;
	}
	&__name {
		font-weight: 500;
	}
	&__value {
		font-weight: 400;
	}
}

.tech {
	&s{
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	display: grid;
	grid-template-columns: auto 1fr 502px;
	gap: 10px;
	width: 100%;
	font-weight: 500;
	font-size: 16px;
	line-height: 120%;

	&__divider {
		height: 100%;
		width: 100%;
		color: #DDDDDD;
		background-image: url('data:image/svg+xml,<svg viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="1" fill="%23dddddd" /></svg>');
		background-position: left bottom;
		background-repeat: repeat-x;
		background-size: 6px;
	}
	&__value {
		font-weight: 400;
	}
}

.aside {
	display: flex;
	flex-direction: column;
	gap: 20px;

	.block {
		padding: unset;
		position: relative;
		aspect-ratio: 416/234;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 6px;
		overflow: hidden;

		&__img {
			position: absolute;
			width: 100%;
			height: 100%;
			object-fit: cover;
			left: 0;
			top: 0;
		}
		&__overlay {
			z-index: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 8px;
			width: 100%;
			height: 100%;
			background-color: #00000080;
			cursor: pointer;

			font-weight: 500;
			font-size: 16px;
			line-height: 120%;
			color: #fff;
		}
		&__h {
			margin: unset;
		}
		&__text {
			display: flex;
			flex-direction: column;
			gap: 10px;

			a {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 12px;
				font-weight: 699;
			}
		}
		.btn {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 10px;
			svg:deep(g path) {
				fill: #fff;
			}
		}
	}

	.price {
		aspect-ratio: unset;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 16px;
		padding: 24px;
		background-color: #fff;

		&__price {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-weight: 600;
			font-size: 24px;
			line-height: 125%;

			&--additional {
				margin-left: 12px;
				font-weight: 400;
				font-size: 16px;
				line-height: 120%;
				color: #9DA2A5;
			}
		}
	}
}

.recommend {
	position: relative !important;
	margin-bottom: unset;
	padding-bottom: 80px;

	.slide {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		width: 36dvw;

		&__image {
			grid-column: 1 / span 2;
			aspect-ratio: 525/300;
			width: 100%;
		}
		&__name {
			font-family: Tenor Sans;
			font-size: 30px;
			line-height: 1.15;
		}
		&__price {
			display: flex;
			flex-direction: column;
			gap: 4px;
			margin-left: auto;

			font-weight: 500;
			font-size: 20px;
			line-height: 125%;

			&--additional {
				font-weight: 400;
				font-size: 16px;
				line-height: 125%;
				text-align: right;
				color: #9DA2A5;
			}
		}
	}
}

@media screen and (max-width: 876px) {
	.page {
		padding: 96px 16px;
		display: flex;
		flex-direction: column;
		gap: 50px;
		width: 100%;
	}
	.back {
		margin-top: unset;
		margin-bottom: -24px;
		font-size: 14px;
	}
	.main {
		width: 100%;
		max-width: unset;

		&__h {
			font-size: 28px;
			padding: 16px 0 0 12px;
		}
		&__underh {
			padding-left: 12px;
			font-size: 14px;
		}
	}
	.block {
		padding: 18px 12px;

		&__h {
			font-size: 18px;
		}
		&__text {
			font-size: 14px;
		}
	}
	.characteristic {
		&s {
			&__inner {
				grid-template-columns: 1fr 1fr;
				gap: 16px;
			}
		}

		height: min-content;
		font-size: 14px;
	}

	.tech {
		grid-template-columns: auto 1fr auto;
		font-size: 14px;
	}

	.price {
		order: -1;
	}

	.recommend {
		.slide {
			width: 70dvw;
		}
	}
}
</style>
