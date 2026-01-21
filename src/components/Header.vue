<template>
	<header
		class="header header--desktop header--desktop-transparent"
		:class="{ 'header--black': ['models', 'contacts', 'NotFound', 'stock', 'stockId'].includes($route.name) }"
	>
		<div class="header__left">
			<RouterLink
				style="color: inherit;"
				to="/"
			>
				<LogoIcon class="header__logo" />
			</RouterLink>

			<div class="menu">
				<div
					v-for="(item, counter) in headerItems"
					:key="item.name"
					:id="item.name"
				>
					<!-- "Моделі" — без перехода, только открытие меню -->
					<button
						v-if="item.name === 'models'"
						type="button"
						class="menu__item"
						:class="{ 'menu__item--dropdown': Object.hasOwn(item, 'children') }"
					>
						{{ item.label.ua }}
						<template v-if="Object.hasOwn(item, 'children')">
							<Dropdown />

							<Teleport to="body">
								<div
									class="dropdown"
									id="models-dropdown"
								>
									<div
										class="dropdown__inner"
										v-if="counter == 0"
									>
										<button
											type="button"
											class="dropdown__close"
										>
											<span class="dropdown__close-text">Сховати</span>
											<Dropdown class="dropdown__close-icon" />
										</button>

										<div class="name">
											<div class="name__heading">
												{{ i18n.header.models?.[langStore.activeLang] }}
											</div>
											<div class="name__text">
												{{ i18n.header.discoverTheRange?.[langStore.activeLang] }}
											</div>
										</div>

										<div
											class="models"
											v-if="item.children"
										>
											<RouterLink
												class="model"
												v-for="model in item.children"
												:to="getModelLink(model)"
											>
												<img
													v-if="model.image"
													class="model__image"
													:src="model.image"
												/>
												<div class="model__name">{{ model.name }}</div>
												<div class="model__learn">
													{{ i18n.header.learn?.[langStore.activeLang] }}
												</div>
											</RouterLink>
										</div>
									</div>
								</div>
							</Teleport>
						</template>
					</button>

					<RouterLink
						v-else
						class="menu__item"
						:class="{ 'menu__item--dropdown': Object.hasOwn(item, 'children'), 'btn btn--transparent btn--transparent-white': item.isConfigurator }"
						:to="item.name ? `/${item.name}` : ''"
					>
						{{ item.label.ua }}
					</RouterLink>
				</div>
			</div>
		</div>

		<div class="header__brand">
			<img src="@/assets/img/logo.png" alt="ZEEKR" class="header__brand-image header__brand-image--light" />
			<img src="@/assets/img/logo_black.png" alt="ZEEKR" class="header__brand-image header__brand-image--dark" />
		</div>

		<div class="actions">
			<a
				v-if="phoneNumber"
				class="phone"
				:href="`tel:${phoneNumber.replace(/\s/g, '')}`"
			>
				<Phone />
				<span>{{ phoneNumber }}</span>
			</a>

			<div
				class="lang"
				id="langs"
			>
				{{ langStore.activeLang }}
				<Dropdown />

				<div
					class="dropdown dropdown--langs"
					id="langs-dropdown"
				>
					<div class="dropdown__inner">
						<div
							v-for="lang in langStore.langs"
							class="dropdown__item"
							:class="{ 'dropdown__item--active': lang == langStore.activeLang }"
							@click="langStore.changeLang(lang); sessionStorage.setItem('lang', lang);"
						>
							{{ lang }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<header
		class="header header--mobile"
		:class="{ 'header--expanded': isExpanded, 'header--black': $route.name == 'models', 'header--mobile-bg': isMobileBg, 'header--mobile-hidden': !isMobileBg }"
	>
		<div class="header__top">
			<RouterLink to="/">
				<Logo class="header__logo" />
			</RouterLink>

			<Burger
				@click="isExpanded = !isExpanded"
				:is-expanded="isExpanded"
			/>
		</div>

		<div class="header__expandable">
			<div class="menu">
				<div class="menu__divider"></div>
				<div
					class="menu__item"
					:class="{ 'menu__item--dropdown': Object.hasOwn(item, 'children') }"
					v-for="(item, counter) in headerItems"
					:id="`${item.name}-mobile`"
				>
					<RouterLink :to="item.name ? item.name : ''">
						{{ item.label.ua }}
					</RouterLink>
					<template v-if="Object.hasOwn(item, 'children')">
						<div class="dropdown-icon--outer">
							<Expand />
						</div>
						<div
							class="dropdown"
							:id="`${item.name}-dropdown-mobile`"
						>
							<RouterLink
								class="dropdown__item"
								v-for="item in item.children"
								:to="counter == 0 ? getModelLink(item) : ''"
							>
								{{ item.name }}
							</RouterLink>
						</div>
					</template>
				</div>
			</div>

			<a
				v-if="phoneNumber"
				class="phone phone--mobile"
				:href="`tel:${phoneNumber.replace(/\s/g, '')}`"
			>
				<Phone />
				<span>{{ phoneNumber }}</span>
			</a>

			<div class="langs">
				<div
					class="lang"
					v-for="lang in langStore.langs"
					:class="{ 'lang--active': lang == langStore.activeLang }"
					@click="langStore.changeLang(lang); sessionStorage.setItem('lang', lang);"
				>
					{{ lang }}
				</div>
			</div>
		</div>
	</header>
</template>

<script setup>
import Logo from "@/components/icons/logo.vue"
import LogoIcon from "@/components/icons/logoIcon.vue"
import LogoWord from "@/components/icons/logoWord.vue"
import { RouterLink, useRoute } from "vue-router";
import Dropdown from "./icons/dropdown.vue";
import { useLangStore } from "@/stores/lang";
import { nextTick, onMounted, ref, watch } from "vue";
import API from "@/composables/API";
import Burger from "./icons/burger.vue";
import Expand from "./icons/expand.vue";
import addDropdown from "@/composables/dropdown";
import Phone from "./icons/phone.vue";

let langStore = useLangStore()

const getModelLink = (model) => {
  if (!model.model_page?.url?.child) return ''
  
  const modelId = model.model_page.url.child.toLowerCase()
  const modelName = model.name?.toLowerCase() || ''
  
  if (modelId === '001' || modelId === 'car-001' || modelName === '001' || modelName.includes('001')) {
    return '/car/001'
  }
  
  if (modelId === '7x' || modelId === 'car-7x' || modelName === '7x' || modelName.includes('7x')) {
    return '/car/7x'
  }
  
  return `/${model.model_page.url.child}`
}

let isExpanded = ref(false),
  isMobileBg = ref(true),
  phoneNumber = ref('')

let headerItems = ref([
  {
    label: {
      en: 'Models',
      ua: 'Моделі'
    },
    name: 'models',
    children: []
  },
  {
    label: {
      en: 'Service',
      ua: 'Сервіс'
    },
    name: 'service',
    /*
    children: [
      { name: 'example-service', id: 1 }
    ]
    */
  },
  /*
  {
    label: {
      en: 'Available cars',
      ua: 'Доступні автівки'
    },
    name: 'available-cars'
  },
  */
  {
    label: {
      en: 'Financial services',
      ua: 'Фінансовий сервіс'
    },
    name: 'financial-services',
    /*
    children: [
      { name: 'example-service', id: 1 }
    ]
    */
  },
  {
    label: {
      en: 'Warranty',
      ua: 'Гарантійна політика'
    },
    name: 'warranty'
  },
  {
    label: {
      en: 'About the company',
      ua: 'Про нас'
    },
    name: 'about'
  },
  /*
  {
    label: {
      en: 'Configurator',
      ua: 'Конфігуратор'
    },
    isConfigurator: true,
    name: 'configurator'
  }
    */
])

watch(useRoute(), () => {
  console.log('CHANGE')
  let parent = document.querySelector(`#models`),
    dropdown = document.querySelector(`#models-dropdown`),
    header = document.querySelector('.header')

  dropdown.style.maxHeight = 0;
  header.classList.remove('header--black')
  parent.querySelector('.dropdown-icon').classList.remove('dropdown-icon--active')
  isExpanded.value = false;
}, { flush: 'pre', deep: true })

watch(() => langStore.activeLang, async () => {
  headerItems.value[0].children = (await API.Models.get()).car_models;

  console.log(headerItems.value[0].children)

  // Load phone number from API
  const contacts = await API.Contacts.get();
  if (contacts && Array.isArray(contacts)) {
    const phoneContact = contacts.find(contact => 
      contact.short_name?.toLowerCase() === 'phone'
    );
    if (phoneContact && phoneContact.url) {
      phoneNumber.value = phoneContact.url;
    }
  }

  nextTick(() => {
    headerItems.value.map(el => {
      if (Object.hasOwn(el, 'children')) addDropdown(el.name)
    })
  })
  addDropdown('langs', true)
})

onMounted(async () => {
  // Логика скролла для хедера: белый фон при любом скролле, прозрачный только в самом верху
  const handleScroll = () => {
    const header = document.querySelector('.header--desktop');
    if (!header) return;
    
    // Если меню моделей открыто (есть класс header--black), не меняем фон при скролле
    if (header.classList.contains('header--black')) {
      return;
    }
    
    const scrollTop = document.scrollingElement?.scrollTop || window.scrollY || 0;
    
    if (scrollTop === 0) {
      // В самом верху — прозрачный фон
      header.classList.remove('header--desktop-bg');
      header.classList.add('header--desktop-transparent');
    } else {
      // Как только ушли от верха — белый фон
      header.classList.add('header--desktop-bg');
      header.classList.remove('header--desktop-transparent');
    }
  };

  // Инициализация при загрузке
  handleScroll();
  
  // Отслеживание скролла
  window.addEventListener('scroll', handleScroll, { passive: true });

  let lastPhoneY = null
  document.addEventListener('touchstart', (e) => {
    lastPhoneY = e.touches[0].clientY
  })

  document.addEventListener('touchend', (e) => {
    let deltaY = lastPhoneY - e.changedTouches[0].clientY,
      threshold = 20

    console.log(lastPhoneY, e.changedTouches[0].clientY, deltaY > threshold, deltaY < (-1 * threshold))

    if (deltaY > threshold) {
      // swipe from down to up = scroll down
      isMobileBg.value = false
    }
    else if (deltaY < (-1 * threshold)) {
      // swipe from up to down = scroll up
      isMobileBg.value = true;
    }
  });

  headerItems.value[0].children = (await API.Models.get()).car_models;

  console.log(headerItems.value[0].children)

  // Load phone number from API
  const contacts = await API.Contacts.get();
  if (contacts && Array.isArray(contacts)) {
    const phoneContact = contacts.find(contact => 
      contact.short_name?.toLowerCase() === 'phone'
    );
    if (phoneContact && phoneContact.url) {
      phoneNumber.value = phoneContact.url;
    }
  }

  nextTick(() => {
    headerItems.value.map(el => {
      if (Object.hasOwn(el, 'children')) addDropdown(el.name)
    })
  })
  addDropdown('langs', true)
})
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  color: #fff;
  width: 100dvw;
  z-index: 1000;

  &--black {
    color: black;
  }

  &--desktop {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 16px 76px;
    transition: none;
    background-color: transparent;
    max-height: 70px;
    opacity: 1;
    color: #fff;

    &-transparent {
      background-color: transparent;
      color: #fff;
    }

    &-bg {
      background-color: #ffffff;
      color: #000;
    }

    &.header--collapsed {
      transform: translateY(-100%);
      transition: transform .4s ease, opacity .4s ease;
    }
  }

  &--mobile {
    display: none;
    color: #000;
    transition-duration: .75s;
    transition-timing-function: linear, ease-in-out;
    transition-property: background-color, opacity;
    transition-delay: .5s, 0s;
    background-color: transparent;
    opacity: 1;

    &-hidden {
      opacity: 0;
      color: #000;
    }

    &-bg {
      background-color: #ffffffd0;
      backdrop-filter: blur(2px);
      color: #000;
    }
  }

  &__logo {
    height: 32px;
    width: auto;
    transition: .5s ease-in-out;
    color: inherit;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__brand {
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;

    &-image {
      height: 14px;
      width: auto;
      display: none;
    }

    &-image--light {
      display: block;
    }

    &-image--dark {
      display: none;
    }
  }
}

/* Когда хедер на белом фоне или в чёрном варианте — показываем чёрный логотип */
.header--desktop-bg .header__brand-image--light,
.header--black .header__brand-image--light {
  display: none;
}

.header--desktop-bg .header__brand-image--dark,
.header--black .header__brand-image--dark {
  display: block;
}

/* Когда хедер прозрачный — показываем белый логотип */
.header--desktop-transparent .header__brand-image--light {
  display: block;
}

.header--desktop-transparent .header__brand-image--dark {
  display: none;
}

.menu {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;

  &__item {
    transition: .3s;
    color: currentColor;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    font: inherit;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    &--dropdown {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 0px;
    }
  }
}

.actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
}

.phone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: currentColor;
  transition: .3s;

  svg {
    width: 18px;
    height: 18px;
  }

  span {
    font-weight: 400;
  }
}

#models {
  position: static;
}

#models-dropdown {
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 10;
  background-color: #fff;

  .dropdown__inner {
    position: relative;
    width: 100%;
    height: fit-content;
    padding: 88px 76px 40px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 24px;

    color: #000;
    transition: 1s;
  }

  .dropdown__close {
    position: absolute;
    top: 120px;
    left: 76px;
    padding: 8px 14px;
    border: none;
    border-radius: 999px;
    background: none;
    cursor: pointer;
    line-height: 1.2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .dropdown__close-text {
    font-size: 14px;
    white-space: nowrap;
  }

  .dropdown__close-icon {
    width: 14px;
    height: 14px;
  }

  .name {
    &__heading {
      font-family: "Tenor Sans";
      font-size: 34px;
      line-height: 1.15;
    }

    &__text {
      width: 283px;
      font-size: 16px;
      line-height: 1.2;
    }
  }

  .model {
    position: relative;
    z-index: 1;
    text-align: center;

    &s {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 16px;
    }

    &__image {
      height: 130px;
      width: clamp(230px, 15.972dvw, 300px);
      object-fit: contain;
    }

    &__name {
      font-size: 16px;
      font-weight: 500;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    &__learn {
      width: fit-content;
      margin: 0 auto;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.2;
      text-decoration-line: underline;
      color: #69514B;
    }
  }
}

.lang {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
  transition: .3s;
  color: currentColor;
  text-transform: uppercase;
  width: 50px;
  cursor: pointer;

  .dropdown {
    top: 0;
    left: -25px;

    &__inner {
      height: fit-content;
      display: flex;
      flex-direction: column;
      gap: 16px;
      justify-content: center;
      align-items: center;
      padding: 24px 36px;
      background-color: #fff;
    }

    &__item {
      font-size: 14px;
      line-height: 1.2;
      color: #000;
      transition: .3s;
      cursor: pointer;

      &--active {
        text-decoration-line: underline;
        color: #69514B;
      }
    }
  }
}

@media screen and (max-width: 876px) {
  .header {
    &--desktop {
      display: none;
    }

    &--mobile {
      display: flex;
      flex-direction: column;
    }

    &--expanded {
      .header__top {
        color: #000;
      }

      .header__expandable {
        background-color: #fff;
        left: 0 !important;
      }
    }

    &__top {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 22px;
      transition: .5s;
      background-color: transparent;

      svg {
        height: 20px;
        cursor: pointer;
      }
    }

    &__logo {
      transition: .5s;
    }

    &__expandable {
      position: absolute;
      left: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-top: 64px;
      padding-bottom: 16px;
      transition: .5s;
      color: #000;
    }

    .menu {
      width: 100%;
      display: inherit;
      flex-direction: inherit;
      align-items: inherit;
      gap: 16px;

      &__divider {
        background-color: #DDDDDD;
        width: 100%;
        height: 1px;
      }

      &__item {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 14px;

        &--dropdown {
          display: grid;
          grid-template-columns: auto 1fr;
        }
      }
    }

    .phone--mobile {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 12px 16px 0;
      font-size: 16px;
    }

    .dropdown {
      position: relative;
      top: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      grid-column: 1 / span 2;

      &-icon {
        cursor: pointer;

        &--outer {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          cursor: pointer;
        }
      }

      &__item {
        font-size: 14px;
        line-height: 1.2;
        transition: .3s ease-in-out;

        &:hover {
          text-decoration: underline;
          color: #69514B;
        }
      }
    }

    .lang {
      width: auto;

      &--active {
        text-decoration: underline;
        color: #69514B;
      }

      &s {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 0 24px;
        margin: 16px;
        padding-top: 16px;
        border-top: 1px solid #DDDDDD;
      }
    }
  }
}
</style>
