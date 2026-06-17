<template>
  <section class="eight-x-select">
    <picture class="eight-x-select__bg" aria-hidden="true">
      <source :srcset="bgMobile" media="(max-width: 876px)" />
      <img :src="bgDesktop" alt="" />
    </picture>

    <div class="eight-x-select__panels">
      <RouterLink
        to="/zeekr-8x"
        class="eight-x-select__panel eight-x-select__panel--ultra"
      >
        <div class="eight-x-select__panel-inner">
          <h1 class="eight-x-select__title">{{ getText(variants.ultra.title) }}</h1>
          <span class="eight-x-select__btn">{{ getText(btnLabel) }}</span>
        </div>
      </RouterLink>

      <RouterLink
        to="/zeekr-8x-dawn"
        class="eight-x-select__panel eight-x-select__panel--dawn"
      >
        <div class="eight-x-select__panel-inner">
          <h1 class="eight-x-select__title">{{ getText(variants.dawn.title) }}</h1>
          <span class="eight-x-select__btn">{{ getText(btnLabel) }}</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useLangStore } from '@/stores/lang'
import bgDesktop from '@/assets/pages/8x/8x_page.webp'
import bgMobile from '@/assets/pages/8x/8x_page_mb.webp'

const langStore = useLangStore()

const btnLabel = {
  ua: 'Детальніше',
  en: 'Learn more'
}

const variants = {
  ultra: {
    title: { ua: 'ZEEKR 8X', en: 'ZEEKR 8X' }
  },
  dawn: {
    title: { ua: 'Zeekr 8X Dawn', en: 'Zeekr 8X Dawn' }
  }
}

const getText = (textObj) => {
  if (!textObj) return ''
  if (typeof textObj === 'string') return textObj
  const lang = langStore.activeLang
  if (lang && textObj[lang]) return textObj[lang]
  if (lang === 'uk' && textObj.ua) return textObj.ua
  if (lang === 'ua' && textObj.uk) return textObj.uk
  return textObj.uk || textObj.ua || textObj.en || ''
}

onMounted(() => {
  document.title = 'ZEEKR 8X'
  document.documentElement.style.scrollBehavior = 'auto'
  document.body.style.scrollBehavior = 'auto'
  document.body.classList.add('eight-x-select-page')
  window.scrollTo(0, 0)
})

onUnmounted(() => {
  document.documentElement.style.scrollBehavior = ''
  document.body.style.scrollBehavior = ''
  document.body.classList.remove('eight-x-select-page')
})
</script>

<style lang="scss" scoped>
.eight-x-select {
  position: relative;
  width: 100%;
  height: 100dvh;
  min-height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
  background: #111;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
    }
  }

  &__panels {
    position: relative;
    z-index: 1;
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  &__panel {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: #fff;
    padding: 0 24px;
    box-sizing: border-box;

    &:hover {
      .eight-x-select__btn {
        background: #fff;
        color: #111;
        border-color: #fff;
      }
    }
  }

  &__panel--ultra {
    grid-column: 1;
    grid-row: 1;
  }

  &__panel--dawn {
    grid-column: 1;
    grid-row: 2;
  }

  &__panel-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 20px;
    width: 100%;
    max-width: 360px;
  }

  &__title {
    margin: 0;
    font-family: ZeekrText-Regular, FZLanTingHeiS-R-GB, "Tenor Sans", sans-serif;
    font-size: clamp(28px, 3.2vw, 48px);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: 0.04em;
    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 132px;
    padding: 10px 28px;
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 999px;
    font-size: 14px;
    line-height: 1.2;
    background: transparent;
    color: #fff;
  }
}

@media screen and (max-width: 876px) {
  .eight-x-select {
    &__panels {
      height: auto;
      max-height: 50vh;
      padding-top: 120px;
      gap: 30px;
    }

    &__panel {
      height: auto;
      padding: 0 20px;
    }

    &__title {
      font-size: 32px;
      letter-spacing: 0.06em;
    }

    &__panel-inner {
      gap: 16px;
    }
  }
}
</style>
