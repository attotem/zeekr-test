<template>
	<div class="legal">
		<div class="legal__text">
			{{ i18n.legal.copy?.[langStore.activeLang] }}
			<span class="legal__text--pale">
				{{ i18n.legal.info?.[langStore.activeLang] }}
			</span>
		</div>
		<div class="legal__text legal__text--big">
			{{ i18n.legal.text1?.[langStore.activeLang] }}
			{{ (new Date()).toLocaleDateString() }}
			{{ i18n.legal.text2?.[langStore.activeLang] }}
		</div>
	</div>
</template>

<script setup>
import { useLangStore } from '@/stores/lang';

let langStore = useLangStore()
</script>

<style lang="scss" scoped>
.legal {
  padding: 60px 76px;
  background-color: #000;

  &__text {
    font-size: 16px;
    line-height: 1.25;
    color: #fff;

    &--pale {
      color: #D9C5B7;
      margin-left: 6px;
    }

    &--big {
      margin-top: 16px;
    }
  }
}

@media screen and (max-width: 876px) {
  .legal {
    padding: 40px 16px;

    &__text {
      font-size: 14px;
      line-height: 1.25;
    }
  }
}
</style>
