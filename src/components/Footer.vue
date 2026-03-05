<template>
	<footer class="footer">
		<div class="footer__first">
			<Logo class="footer__logo" />

			<div class="text">
				<div class="text__heading">
					{{ getFirstText(first.heading) }}
				</div>
				<div class="text__text">
					{{ getFirstText(first.text) }}
				</div>
			</div>

			<div
				class="socials"
				v-if="socials.length > 0"
			>
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
import XTwitter from './icons/socials/xtwitter.vue';
import Dropdown from './icons/dropdown.vue';
import addDropdown from '@/composables/dropdown';
import API from '@/composables/API';

const langStore = useLangStore()

let first = ref({
  heading: {
    en: "Innovation, convenience, profitability - Zeekr",
    ua: "Інновації, комфорт, вигода — Zeekr"
  },
  text: {
    en: "Official importer and distributor of Zeekr electric vehicles in Ukraine",
    ua: "Офіційний імпортер та дистриб’ютор електромобілів Zeekr в Україні"
  }
})

const getFirstText = (field) => {
  if (!field) return ''
  const lang = langStore.activeLang || 'en'

  if ((lang === 'uk' || lang === 'ua') && (field.ua || field.uk)) {
    return field.ua || field.uk
  }

  if (field[lang]) return field[lang]

  return field.ua || field.uk || field.en || Object.values(field)[0] || ''
}

let socials = ref([])

let data = ref()

const updateSocials = (contacts) => {
  if (!contacts || !Array.isArray(contacts)) return;
  
  socials.value = [];
  
  const socialMap = {
    'inst': { component: markRaw(Instagram) },
    'instagram': { component: markRaw(Instagram) },
    'x': { component: markRaw(XTwitter) },
    'xcom': { component: markRaw(XTwitter) },
    'twitter': { component: markRaw(XTwitter) },
    'xtwitter': { component: markRaw(XTwitter) },
    'facebook': { component: markRaw(Facebook) },
    'fb': { component: markRaw(Facebook) }
  };
  
  contacts.forEach(contact => {
    const shortName = contact.short_name?.toLowerCase();
    if (socialMap[shortName]) {
      socials.value.push({
        href: contact.url,
        component: socialMap[shortName].component
      });
    }
  });
}

watch(() => langStore.activeLang, async () => {
  data.value = await API.Footer.get();
  const contacts = await API.Contacts.get();
  updateSocials(contacts);
  nextTick(() => {
    Object.entries(data.value).map((el, counter) => {
      addDropdown(`footer-${counter}`)
    })
  })
})

onMounted(async () => {
  data.value = await API.Footer.get();
  const contacts = await API.Contacts.get();
  updateSocials(contacts);
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

  &__developer {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);

    a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(17, 17, 17, 0.5);
      font-size: 12px;
      font-weight: 400;
      text-decoration: none;
      transition: color 0.2s ease;
      
      span:first-child {
        font-weight: 300;
      }
      
      span:last-child {
        font-weight: 400;
      }
    }

    a:hover {
      color: rgba(17, 17, 17, 0.8);
    }

    &-logo {
      height: 14px;
      width: auto;
      opacity: 0.6;
      transition: opacity 0.2s ease;
      filter: brightness(0);
    }

    a:hover &-logo {
      opacity: 0.9;
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
    gap: 80px;
  }

  .category {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__heading {
      font-weight: 600;
      font-size: 18px;
      line-height: 1.3;
      margin-bottom: 4px;
      color: #111;
      letter-spacing: -0.01em;

      .dropdown-icon {
        display: none;
      }
    }

    &__dropdown {
      display: inherit;
      flex-direction: inherit;
      gap: 12px;
    }

    &__item {
      font-size: 16px;
      line-height: 1.5;
      color: rgba(17, 17, 17, 0.7);
      text-decoration: none;
      transition: color 0.2s ease, transform 0.2s ease;
      display: inline-block;
      
      &:hover {
        color: #111;
        transform: translateX(4px);
      }
    }
  }
}

@media screen and (max-width: 876px) {
  .footer {
    flex-direction: column;
    gap: 40px;
    padding: 48px 20px;
    background: linear-gradient(180deg, #f5f5f5 0%, #EAE8E2 100%);

    &__first {
      gap: 24px;
    }

    &__logo {
      height: 24px;
    }

    .text {
      max-width: unset;

      &__heading {
        font-size: 18px;
        line-height: 1.4;
      }

      &__text {
        font-size: 15px;
        line-height: 1.5;
      }
    }
    
    .social {
      width: 36px;
      height: 36px;
      
      &s {
        gap: 10px;
      }
    }

    &__developer {
      margin-top: 24px;
      padding-top: 20px;
      
      a {
        font-size: 11px;
        gap: 6px;
      }
      
      &-logo {
        height: 12px;
      }
    }

    .developer {
      font-size: 12px;
      margin-top: 8px;
    }

    &__second {
      flex-direction: column;
      gap: 0;
    }

    .category {
      gap: 0;

      &:has(+.category) {
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      &__heading {
        display: flex;
        flex-direction: row;
        gap: 8px;
        justify-content: space-between;
        align-items: center;
        font-size: 17px;
        line-height: 1.3;
        margin-bottom: 0;
        padding: 12px 0;

        .dropdown-icon {
          display: block;
        }
      }

      &__dropdown {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-in-out;
        gap: 10px;
      }

      &__item {
        &:nth-of-type(1) {
          margin-top: 8px;
        }

        font-size: 15px;
        line-height: 1.5;
        padding: 6px 0;
      }
    }
  }
}
</style>
