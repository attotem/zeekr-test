<template>
	<div class="legal">
		<div class="legal__text">
			{{ i18n.legal.copy?.[langStore.activeLang]?.replace('{year}', new Date().getFullYear()) }}
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
  padding: 16px 76px;
  background-color: #000;

  &__text {
    font-size: 12px;
    line-height: 1.3;
    color: #fff;

    &--pale {
      color: #D9C5B7;
      margin-left: 4px;
    }

    &--big {
      margin-top: 8px;
    }
  }
}

@media screen and (max-width: 876px) {
  .legal {
    padding: 12px 16px;

    &__text {
      font-size: 10px;
      line-height: 1.3;
    }
  }
}
</style>
