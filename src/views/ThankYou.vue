<template>
	<article class="thank-you">
		<div class="thank-you__content">
			<h1 class="thank-you__title">Дякуємо</h1>
			<div class="thank-you__message">Ми отримали вашу заявку. Наш менеджер зв'яжеться з вами найближчим часом.</div>
			<RouterLink
				class="btn btn--orange"
				to="/"
			>
				{{ i18n.modal?.backToHome?.[langStore.activeLang] || 'Повернутися на головну' }}
			</RouterLink>
		</div>
	</article>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useLangStore } from "@/stores/lang";

const langStore = useLangStore();
let i18n = ref({});

onMounted(async () => {
	try {
		const resp = await fetch(`/i18n.json`);
		i18n.value = await resp.json();
	} catch (error) {
		console.error('Failed to load i18n:', error);
	}
});
</script>

<style lang="scss" scoped>
.thank-you {
	min-height: calc(100vh - 200px);
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 80px 76px;
	background-color: #EAE8E2;

	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 700px;
		text-align: center;
	}

	&__title {
		font-family: Tenor Sans;
		font-size: 56px;
		line-height: 1.25;
		margin-bottom: 24px;
		color: #000;
	}

	&__message {
		font-size: 20px;
		line-height: 1.5;
		margin-bottom: 40px;
		color: #000;
	}
}

.btn {
	width: 260px;
}

@media screen and (max-width: 876px) {
	.thank-you {
		padding: 50px 16px;
		min-height: calc(100vh - 150px);

		&__title {
			font-size: 36px;
			margin-bottom: 16px;
		}

		&__message {
			font-size: 16px;
			margin-bottom: 32px;
		}
	}
}
</style>

