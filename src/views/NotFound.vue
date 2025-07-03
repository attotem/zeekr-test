<template>
	<div class="page">
		<h1 class="page__h">
			{{ i18n.pages["404"].heading?.[langStore.activeLang] }}
		</h1>
		<div class="page__underh">
			{{ i18n.pages["404"].text?.[langStore.activeLang] }}
		</div>
		<RouterLink
			class="btn btn--orange"
			to="/"
			>{{ i18n.pages["404"].cta?.[langStore.activeLang] }}</RouterLink
		>
		<img
			class="page__img_404"
			src="@/assets/img/404.png"
		/>
	</div>
</template>

<script setup>
import { useLangStore } from '@/stores/lang';

let langStore = useLangStore()
</script>

<style lang="scss" scoped>

.page__img_404{
  width: 40%;
}

.page {
  margin: 96px 76px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__h {
    font-family: Tenor Sans;
    font-size: 150px;
    line-height: 1.25;
    text-align: center;
  }

  &__underh {
    font-size: 24px;
    line-height: 1.4;
    letter-spacing: 0%;
  }

  &__img {
    width: 50%;
  }
}

.btn {
  margin-top: 40px;
  margin-bottom: 32px;
}

@media screen and (max-width: 876px) {

  .page__img_404{
      width: 80%;
    }

  .page {
    margin: 114px 16px 50px;
    &__h {
      font-family: Tenor Sans;
      font-size: 80px;
      line-height: 1.25;
    }

    &__underh {
      font-size: 20px;
      line-height: 1.4;
      text-align: center;
    }

    &__img {
      width: 100%;
    }
  }
}
</style>
