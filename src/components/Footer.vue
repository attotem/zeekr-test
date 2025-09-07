<template>
	<footer class="footer">
		<div class="footer__first">
			<Logo class="footer__logo" />

			<div class="text">
				<div class="text__heading">
					{{ first.heading[langStore.activeLang] }}
				</div>
				<div class="text__text">
					{{ first.text[langStore.activeLang] }}
				</div>
			</div>

			<div class="socials">
				<a
					v-for="item in socials"
					:href="item.href"
					target="_blank"
					rel="noopener noreferrer"
					class="social"
				>
					<component :is="item.component" />
				</a>
			</div>


		</div>

		<div
			class="footer__second"
			v-if="data"
		>
			<div
				class="category"
				v-for="(cat, counter) in Object.entries(data)"
				:id="`footer-${counter}-mobile`"
			>
				<div class="category__heading dropdown-icon--outer">
					{{ cat[0] }}
					<Dropdown />
				</div>
				<div
					:id="`footer-${counter}-dropdown-mobile`"
					class="category__dropdown"
				>
					<RouterLink
						class="category__item"
						v-for="item in Object.entries(cat[1])"
						:to="item[1]"
						>{{ item[0] }}</RouterLink
					>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { markRaw, nextTick, onMounted, ref, watch } from 'vue';
import Logo from './icons/logo.vue';
import { useLangStore } from '@/stores/lang';
import Instagram from './icons/socials/instagram.vue';
import Facebook from './icons/socials/facebook.vue';
import Xtwitter from './icons/socials/xtwitter.vue';
import Linkedin from './icons/socials/linkedin.vue';
import Dropdown from './icons/dropdown.vue';
import addDropdown from '@/composables/dropdown';
import API from '@/composables/API';

const langStore = useLangStore()

let first = ref({
  heading: {
    en: "Innovation, convenience, profitability - Zeekr"
  },
  text: {
    en: "Official importer and distributor of Zeekr electric vehicles in Ukraine"
  }
})

let socials = ref([
  {
    href: 'https://www.instagram.com/zeekr.ukraine',
    component: markRaw(Instagram)
  }, {
    href: 'https://www.facebook.com/people/Zeekr-Ukraine/61565869926215/',
    component: markRaw(Facebook)
  }, {
    href: '',
    component: markRaw(Xtwitter)
  }, {
    href: '',
    component: markRaw(Linkedin)
  }
])

let data = ref()

watch(() => langStore.activeLang, async () => {
  data.value = await API.Footer.get();
  nextTick(() => {
    Object.entries(data.value).map((el, counter) => {
      addDropdown(`footer-${counter}`)
    })
  })
})

onMounted(async () => {
  data.value = await API.Footer.get();
  nextTick(() => {
    Object.entries(data.value).map((el, counter) => {
      addDropdown(`footer-${counter}`)
    })
  })
})
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 60px 76px;
  background: #EAE8E2;

  &__first {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__logo {
    height: 32px;
    width: auto;
    align-self: flex-start;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 416px;

    &__heading {
      font-weight: 600;
      font-size: 18px;
      line-height: 1.25;
    }

    &__text {
      font-size: 16px;
      line-height: 1.25;
    }
  }

  .social {
    cursor: pointer;

    &s {
      display: flex;
      flex-direction: row;
      gap: 24px;
      margin-top: 8px;
    }
  }

  .developer {
    margin-top: 12px;
    font-size: 14px;
    color: #6f6f6f;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    a {
      color: inherit;
      text-decoration: none;
      position: relative;
      transition: color .2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    &__logo {
      height: 16px;
      width: auto;
      display: block;
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
      color: #000;
    }

    a:hover::after {
      transform: scaleX(1);
      opacity: .6;
    }
  }

  &__second {
    display: flex;
    flex-direction: row;
    gap: 64px;
  }

  .category {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__heading {
      font-weight: 600;
      font-size: 18px;
      line-height: 1.25;
      margin-bottom: 2px;

      .dropdown-icon {
        display: none;
      }
    }

    &__dropdown {
      display: inherit;
      flex-direction: inherit;
      gap: inherit;
    }

    &__item {
      font-size: 16px;
      line-height: 1.25;
    }
  }
}

@media screen and (max-width: 876px) {
  .footer {
    flex-direction: column;
    gap: 32px;
    padding: 40px 16px;

    &__first {
      gap: 16px;
    }

    &__logo {
      height: 20px;
    }

    .text {
      max-width: unset;

      &__heading {
        font-size: 16px;
        line-height: 1.25;
      }

      &__text {
        font-size: 14px;
        line-height: 1.25;
      }
    }

    .developer {
      font-size: 12px;
      margin-top: 8px;
    }

    &__second {
      flex-direction: column;
      gap: 12px;
    }

    .category {
      gap: unset;

      &:has(+.category) {
        padding-bottom: 12px;
        border-bottom: 1px solid #000;
      }

      &__heading {
        display: flex;
        flex-direction: row;
        gap: 6px;
        justify-content: space-between;
        align-items: center;

        font-size: 16px;
        line-height: 1.25;

        .dropdown-icon {
          display: block;
        }
      }

      &__dropdown {
        max-height: 0;
        overflow: hidden;
        transition: .3s ease-in-out;
        gap: 8px;
      }

      &__item {
        &:nth-of-type(1) {
          margin-top: 12px;
        }

        font-size: 14px;
        line-height: 1.25;
      }
    }
  }
}
</style>
