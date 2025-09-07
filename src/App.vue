<template>
	<Header />
	<RouterView />
	<Cookies />
	<Chat />
	<Footer />
	<Legal />

	<div class="developer-global">
		<a href="https://t.me/dmytro_obka" target="_blank" rel="noopener noreferrer">
      <span>Developed by </span>
			<img src="@/assets/img/leetsoft_logo.svg" alt="LeetSoft logo" class="developer-global__logo" />
			<span>LeetSoft</span>
		</a>
	</div>
</template>

<script setup>
import Header from './components/Header.vue';
import Cookies from './components/Cookies.vue';
import Chat from './components/Chat.vue';
import Footer from './components/Footer.vue';
import Legal from './components/Legal.vue';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLoaderStore } from './stores/loader';

let route = useRoute()
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => route.fullPath, () => {
  console.log(route.fullPath)
  nextTick(() => {
    setTimeout(() => {
      scrollTo(0,0)
    }, 100)
  })
})
</script>

<style lang="scss">
* {
  font-family: "FixelText";
  box-sizing: border-box;
  scroll-behavior: smooth;

}

h1,h2,h3,h4 {
  margin-block-start: unset;
  margin-block-end: unset;
  font-weight: unset;
}

.dropdown {
  cursor: auto;
  position: absolute;
  top: 100%;
  left: 0;
  display: flex;
  max-height: 0;
  overflow: hidden;
  transition: .3s;
}

.dropdown-icon {
  transition: .3s;
  transform: rotateX(0deg);

  &--active {
    transform: rotateX(180deg);
  }
}

a {
  color: #000;
  text-decoration: none;
}
p{
  margin: 5px 0;
}
body {
  margin: 0;
  padding: 0;
  background-color: #fff;
  overflow-x: hidden;
}

#app {
  overflow-x: hidden;
  width: 100%;
  height: 100%;
}

.developer-global {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 16px 20px;
  background: #000;

  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #e0e0e0;
    font-size: 14px;
    text-decoration: none;
    position: relative;
    transition: color .2s ease;
  }

  a::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px;
    background: currentColor;
    opacity: .35;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .2s ease, opacity .2s ease;
  }

  a:hover {
    color: #fff;
  }

  a:hover::after {
    transform: scaleX(1);
    opacity: .6;
  }

  &__logo {
    height: 16px;
    width: auto;
  }
}

.btn {
  min-width: 196px;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
  padding: 10px 24px;
  border-radius: 50px;
  transition: .3s;
  height: fit-content;
  width: fit-content;
  cursor: pointer;
  text-align: center;

  &--white {
    background-color: #FFFBF3;
    color: #000;

    &:hover {
      background-color: #FFF4E2;
    }
  }

  &--orange {
    background-color: #F75400;
    color: #fff;

    &:hover {
      background-color: #EA512A;
    }
  }

  &--black {
    background-color: #000;
    color: #fff;

    &:hover {
      background-color: #232323;
    }
  }

  &--transparent {
    background-color: transparent;
    border: 1px solid currentColor;

    &-black {
      color: #000;

      &:hover {
        background-color: #232323;
        color: #fff !important;
        border-color: transparent;
      }
    }

    &-white {
      color: #fff;

      &:hover {
        background-color: #FFFBF3;
        color: #000 !important;
        border-color: transparent;
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: .3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  position: absolute;
}

.loading-enter-active,
.loading-leave-active {
  transition: .5s ease-in-out;
  transition-delay: .5s;
}

.loading-leave-to {
  position: fixed;
  opacity: 0;
  scale: 1 !important;
}

.loading-spinner {
  position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
  width: 100dvw;
	height: 100dvh;
	font-size: 24px;
	color: #000;
  background-color: #fff;
  z-index: 100;
  scale: 1.5;

  svg {
    min-width: 128px;
    max-width: 256px;
    width: 25%;
    height: auto;
  }
}

.map-wrapper {
  position: relative;
}

.custom-popup {
  position: absolute;
  z-index: 10;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 300px;

  display: flex;
  width: 394px;
  padding: 12px 12px 24px 24px;
  flex-direction: column;
  align-items: flex-start;

  border-radius: 6px;
  background: #FFF;
  box-shadow: 4px 4px 15px 0px rgba(0, 0, 0, 0.10);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 8px;
  width: 100%;
  align-items: flex-start;
}

.popup-body {
  font-size: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popup-close {
  cursor: pointer;
  font-size: 32px;
  font-weight: normal;
}

.center__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

svg {
  flex-shrink: 0;
}

.map {
  position: relative;
  width: 100%;
  height: 470px;
  background-color: beige;

  .info {
    z-index: 10;
    position: absolute;
    left: 76px;
    top: 76px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-color: #fff;

    &__h {
      font-family: Tenor Sans;
      font-size: 34px;
      line-height: 1.15;
    }

    &__text {
      font-size: 16px;
      line-height: 1.2;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 24px;
    }

    &__line {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
    }
  }
}

.article {
  &-1 {
    width: 100dvw;
    height: 736px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-size: cover;
    background-position: center;

    &__h {
      font-weight: 400;
      text-align: center;
      max-width: 1320px;

      &--1 {
        font-family: "Tenor Sans";
        font-size: 82px;
        line-height: 1.2;
      }

      &--2 {
        font-size: 30px;
        line-height: 1.4;
        margin-top: 20px;
        margin-bottom: 50px;
      }
    }
  }

  &-2 {
    margin: 80px 76px;

    &__h {
      font-family: Tenor Sans;
      font-weight: 400;
      font-size: 56px;
      line-height: 1.15;
      margin-bottom: 24px;
      text-align: center;
      justify-self: center;
      max-width: 512px;
    }

    &__underh {
      font-weight: 457;
      font-size: 24px;
      line-height: 1.25;
      text-align: center;
    }
  }

  &-3 {
    margin: 80px 76px;

    .section {
      display: flex;
      flex-direction: row-reverse;
      width: 100%;

      &:nth-of-type(2n) {
        flex-direction: row;
      }

      &__image {
        width: 50%;
      }

      &__info {
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
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

  &-4 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 60px 120px;

    background-color: #EAE8E2;

    &__h {
      max-width: 380px;
      font-family: Tenor Sans;
      font-size: 56px;
      line-height: 1.15;
    }

    &__text {
      width: 50%;
      font-size: 16px;
      line-height: 1.2;
    }
  }
}

.news {
  position: relative;
  color: #000 !important;
  align-self: flex-start !important;

  .article-2__h {
    width: fit-content;
    max-width: unset;
  }

  .btn {
    justify-self: center;
    width: 198px;
    margin-top: 40px;
  }

  .slide {
    width: 23dvw;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: #000;
    align-items: flex-start;

    &__date {
      margin-top: 6px;
      font-size: 16px;
      line-height: 1.25;
    }

    &__h {
      font-weight: 500;
      font-size: 20px;
      line-height: 1.25;
    }

    &__image {
      width: 100%;
    }
  }
}

ul {
  margin: 8px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  li {
    &::marker {
      color: #F75400;
    }

    border-bottom: 1px solid #000;
    padding-bottom: 12px;
    margin-bottom: 12px;
    align-content: center;

    &:nth-child(2n+1):not(:has(+li)) {
      grid-column: 1 / span 2;
      align-items: center;
      justify-self: center;
      border-bottom: unset;
    }
  }
}

.specifications {
  background-color: #EAE8E2;

  &__inner {
    padding: 80px 76px;
  }

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
    text-align: center;
  }

  &__categories {
    width: fit-content;
    margin: 24px auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 3px;
    background-color: #fff;
    border-radius: 60px;
    padding: 3px;

    .category {
      width: 100%;
      height: 36px;
      white-space: nowrap;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 7px 24px;
      border-radius: 30px;
      cursor: pointer;
      transition: .3s ease-in-out;

      &:has(+.category):not(&:first-of-type)::before,
      &:last-of-type::before {
        content: '';
        position: relative;
        height: 30px;
        width: 1px;
        left: -25.5px;
        background-color: #ddd;
        transition: inherit;
      }

      &:hover {
        background-color: #DDDDDD;

        &::before,
        &+.category::before {
          opacity: 0;
        }
      }

      &--active {
        background-color: #000 !important;
        color: #fff;

        &::before,
        &+.category::before {
          opacity: 0;
        }

        .category__image {
          filter: invert(1);
        }
      }

      &__text {
        font-weight: 500;
        font-size: 16px;
        line-height: 1.4;
      }

      &__image {
        max-width: 36px;
        transition: .3s;
        filter: invert(0);
      }
    }
  }
}

.table {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-auto-flow: row;

  &__heading {
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    line-height: 1.15;
    text-align: center;
  }

  &__body {
    grid-column: 1 / span all;
    display: inherit;
    grid-template-columns: inherit;
    grid-auto-flow: row;
    gap: 2px;
    background-color: #ddd;
  }

  &__cell {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 16px 24px;
    background-color: #fff;

    font-size: 16px;
    line-height: 1.15;
  }
}

.show {
  display: block;
  width: fit-content;
  margin: 24px 0 0 auto;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.2;
  text-align: right;
  text-decoration: underline;
  cursor: pointer;
}

.swiper {
  &--black {
    background-color: #232323;
    color: #fff;
    margin: 0;
    padding: 80px 76px;
  }

  &__inner {
    display: flex;
    flex-direction: row;
    gap: 20px;
    user-select: none;
    user-drag: none;
    -webkit-user-drag: none;
    -moz-user-select: none;
    transition: .5s ease-in-out;
  }

  &__image {
    height: 537px;
    object-fit: cover;
    aspect-ratio: 961/537;
    user-select: none;
    user-drag: none;
    -webkit-user-drag: none;
    -moz-user-select: none;
    transition: .5s ease-in-out !important;
    filter: opacity(0.5);
    cursor: pointer;
  }
}

.swiper {
  &:has(.swiper-button-prev, .swiper-button-next) {
    padding-bottom: 40px;
  }
  &-slide {
    &-active {
      filter: opacity(1);
    }
  }
  &-button {
    &-next, &-prev {
      top: unset !important;
      bottom: 0 !important;
      width: 34px !important;
      height: 34px !important;
      border: 1px solid #000;
      border-radius: 100%;
      padding: 9px !important;
      color: black !important;
      cursor: pointer;
      transition: .3s ease-in-out;

      &::after {
        font-size: unset !important;
      }

      &--inactive {
        cursor: not-allowed;
        opacity: .5;
      }
    }
    &-prev {
      left: 24px !important;
    }
    &-next {
      right: 24px !important;
    }
  }
}

.guarantee {
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
  align-items: center;
  margin: 30px 76px;

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
  }

  &__text {
    font-size: 16px;
    line-height: 1.2;

    ul {
      columns: 2;
    }
  }
}

.center {
  width: calc((100% - 50px) / 2);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid transparent;
  border-radius: 28px;
  transition: .3s;
  cursor: pointer;

  &:hover {
    border-color: #b0b0b0;
    box-shadow: 2px 2px 4px #b0b0b0;
  }

  &s {
    width: auto;
    margin: 24px 76px 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: stretch;
    gap: 50px;
  }

  &__name {
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 24px;
    line-height: 1.2;
  }

  &__item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.20;
  }
}

.sort {
  &__inner {}

  &__active {}

  &__item {
    &--active {}
  }
}

@media screen and (max-width: 876px) {

ul {
  grid-template-columns: 1fr;

}
  .center {
    width: 100%;
    gap: 8px;

    &:has(+.center) {
      padding-bottom: 16px;
      border-bottom: 1px solid #ddd;
    }

    &s {
      flex-direction: column;
      gap: 16px;
      margin: 24px 12px;
    }

    &__name {
      font-weight: 600;
      font-size: 22px;
      line-height: 1.2;
      margin-bottom: 4px;
    }
  }

  .btn {
    font-size: 14px;
    line-height: 1.2;
    padding: 12px 24px;
  }

  .custom-popup {
    width: 90%;
    padding: 12px;
  }

  .map {
    height: 600px;

    .info {
      left: 16px;
      right: 16px;
      top: 40px;

      &__h {
        font-size: 24px;
      }

      &__line {
        font-size: 14px;
      }

      .btn {
        width: 100%;
      }
    }
  }

  .article {
    &-1 {
      gap: 16px;
      height: 700px;
      padding: 0;

      &__h {
        &--1 {
          font-size: 42px;
          line-height: 1.15;
        }

        &--2 {
          font-size: 22px;
          line-height: 1.25;
        }
      }
    }

    &-2 {
      margin: 50px 16px;
      position: relative;

      &__h {
        font-size: 36px;
        line-height: 1.15;
        width: 100%;
      }

      &__underh {
        font-weight: 400;
        font-size: 22px;
        line-height: 1.25;
      }
    }

    &-3 {
      margin: 50px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .section {
        gap: 16px;
        flex-direction: column-reverse !important;

        &__image {
          width: 100%;
        }

        &__info {
          padding: 0;

          ul {
            margin: 12px 0;
            padding-left: 16px;
          }
        }
      }
    }

    &-4 {
      padding: 50px 16px;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 16px;

      &__h {
        max-width: 223px;
        font-size: 36px;
      }

      &__text {
        width: 100%;
        font-size: 14px;
      }
    }
  }

  .specifications {
    &__inner {
      padding: 50px 16px;
    }

    &__h {
      font-size: 36px;
    }

    &__categories {
      width: 100%;
      padding: 0;
      background-color: unset;
      flex-wrap: wrap;
      gap: 12px 4px;
    }

    .category {
      width: fit-content;
      padding: 7px 12px;
      gap: 6px;
      background-color: #fff;

      &::before {
        display: none;
      }
    }
  }

  .table {
    overflow-x: auto;

    &__heading,
    &__cell {
      padding: 12px 10px;
    }
  }

  .swiper {
    &--black {
      padding: 50px 16px;
    }

    .article-2__h {
      margin-bottom: 16px;
    }

    &__image {
      height: 300px;
      aspect-ratio: 1/1;
    }
  }

  .guarantee {
    margin: 50px 16px;

    &__h {
      font-size: 36px;
      text-align: center;
    }

    &__text {
      columns: 1 !important;
    }
  }

  .news {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;

    .btn {
      width: 100%;
      margin-top: 16px;
    }

    .slide {
      width: 100%;
      color: #000 !important;

      &:has(+.slide) {
        padding-bottom: 24px;
        border-bottom: 1px solid #ddd;
      }
    }
  }
}
</style>
