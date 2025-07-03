<template>
	<div
		class="cookies"
		:class="{ 'cookies--accepted': isAccepted }"
	>
		<div class="cookies__h--1">
			{{ i18n.cookies.heading?.[langStore.activeLang] }}
		</div>
		<div class="cookies__p">
			{{ i18n.cookies.text1?.[langStore.activeLang] }}
			<RouterLink to="/cookies">
				{{ i18n.cookies.cookies?.[langStore.activeLang] }}
			</RouterLink>
			{{ i18n.cookies.text2?.[langStore.activeLang] }}
			<RouterLink to="/privacy-policy">
				{{ i18n.cookies.privacyPolicy?.[langStore.activeLang] }} </RouterLink
			>.
		</div>
		<div
			class="btn btn--orange"
			@click="accept"
		>
			{{ i18n.cookies.acceptAll?.[langStore.activeLang] }}
		</div>
	</div>
</template>

<script setup>
import { useLangStore } from '@/stores/lang';
import { onMounted, ref } from 'vue';

let isAccepted = ref(true),
  langStore = useLangStore()

const accept = () => {
  isAccepted.value = true;
  localStorage.setItem('isAccepted', 1)
}

onMounted(() => {
  setTimeout(() => {
    isAccepted.value = localStorage.getItem('isAccepted') || false
  }, 2000)
})
</script>

<style lang="scss" scoped>
.cookies {
  z-index: 10;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  gap: 16px 0;
  padding: 40px 76px;
  transition: .5s ease-in-out;
  background-color: #000;
  color: #fff;

  &--accepted {
    z-index: -1;
    opacity: 0;
    user-select: none;
  }

  &__h {
    &--1 {
      font-weight: 600;
      font-size: 18px;
      line-height: 1.25;
    }
  }

  &__p {
    font-weight: 400;
    font-size: 16px;
    line-height: 1.25;
    max-width: 900px;

    :deep(a) {
      color: #F75400;
    }
  }

  .btn {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: center;
    justify-self: flex-end;
  }
}

@media screen and (max-width: 876px) {
  .cookies {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px 16px 6px;

    &__h {
      &--1 {
        font-size: 16px;
        line-height: 1.25;
      }
    }

    &__p {
      font-size: 14px;
      line-height: 1.25;
    }
  }

  .btn {
    margin-top: 20px;
    align-self: flex-start !important;
  }
}
</style>
