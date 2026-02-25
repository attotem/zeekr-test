<template>
	<TransitionGroup name="loading">
		<div
			v-if="isLoading"
			class="loading-spinner"
		>
			<Logo />
		</div>

		<div v-else-if="serviceData">
			<article class="article-1">
				<picture class="picture intro-background">
					<source
						v-if="serviceData?.banner_image_pc"
						:srcset="serviceData.banner_image_pc"
						media="(min-width: 992px)"
					/>
					<source
						v-if="serviceData?.banner_image_tablet"
						:srcset="serviceData.banner_image_tablet"
						media="(min-width: 576px) and (max-width: 991px)"
					/>
					<source
						v-if="serviceData?.banner_image_phone"
						:srcset="serviceData.banner_image_phone"
						media="(max-width: 575px)"
					/>
					<img
						:src="serviceData?.banner_image_pc || serviceData?.banner_image_tablet || serviceData?.banner_image_phone || serviceData?.banner_image"
						alt="Zeekr"
						loading="lazy"
					/>
				</picture>
				<h1 class="article-1__h article-1__h--1">
					{{ serviceData?.banner_title }}
				</h1>
				<h2 class="article-1__h article-1__h--2">
					{{ serviceData?.banner_subtitle }}
				</h2>
				<div
					class="btn btn--orange"
					@click="isModalOpened = true"
				>
					{{ i18n.pages.service.signUpForTheService?.[langStore.activeLang] }}
				</div>
			</article>

			<article class="article-3">
				<section
					class="section"
					v-for="service in serviceData?.services"
					:key="service.id"
				>
					<img
						class="section__image"
						:src="service.value.image?.url"
					/>
					<div class="section__info">
						<h4 class="section__h">{{ service.value.name }}</h4>
						<div
							class="section__text"
							v-html="service.value.description"
						></div>
					</div>
				</section>
			</article>

			<article
				class="article-1 enjoy"
				:style="{ backgroundImage: `url(${serviceData?.contacts_banner_image})` }"
			>
				<h2 class="article-2__h article-1__h--1">
					{{ serviceData?.contacts_banner_title }}
				</h2>
				<div class="article-1__h article-1__h--2">
					{{ serviceData?.contacts_description }}
				</div>
				<div
					class="btn btn--white"
					@click="isModalOpened = true"
				>
					{{ i18n.pages.service.signUpForTheService?.[langStore.activeLang] }}
				</div>
			</article>

			<article
				class="FAQ article-2"
				v-if="serviceData.faq?.length > 0"
			>
				<h2 class="FAQ__h">{{ serviceData?.faq_title }}</h2>
				<div class="FAQ__inner">
					<div
						class="FAQ__column"
						v-for="num in 2"
						:key="num"
					>
						<div
							class="question"
							v-for="q in serviceData.faq.slice(
              num === 1 ? 0 : Math.ceil(serviceData.faq.length / 2),
              num === 1
                ? serviceData.faq.length % 2
                  ? Math.ceil(serviceData.faq.length / 2)
                  : serviceData.faq.length / 2
                : serviceData.faq.length
            )"
							:id="`question-${q.id}`"
						>
							<h4 class="question__h">{{ q.value.question }}</h4>
							<Expand />
							<div
								class="dropdown"
								:id="`question-${q.id}-dropdown`"
							>
								{{ q.value.answer }}
							</div>
						</div>
					</div>
				</div>
			</article>

			<Map :chosenCenterId="chosenCenterId"></Map>

			<div class="centers">
				<div
					class="center"
					v-for="center in centers?.center_contacts"
					:key="center.id"
					@click="chosenCenterId = center.id"
				>
					<h3 class="center__name">
						{{ center.value.center_name }}
					</h3>
					<div class="center__item center__item--phones">
						<Phone />
						<div class="center__phones">
							<a
								v-for="(phone, idx) in splitPhones(center.value.center_phone)"
								:key="idx"
								:href="phone.href"
								style="text-decoration: underline;"
								class="center__phone"
							>
								{{ phone.display }}
							</a>
						</div>
					</div>
					<div class="center__item">
						<Geo />
						{{ center.value.center_address }}
					</div>
					<div class="center__item">
						<Calendar />
						{{ center.value.center_working_hours }}
					</div>
				</div>
			</div>

			<ModalContact
				:heading="i18n.modal.service"
				:is-opened="isModalOpened"
				:mailObj="{type: 'signup_for_service', page: 'signup_for_service'}"
				@close="isModalOpened = false"
			/>
		</div>
	</TransitionGroup>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useLangStore } from '@/stores/lang'
import API from '@/composables/API'
import addDropdown from '@/composables/dropdown'
import isMobileFn from '@/composables/isMobile'
import Expand from '@/components/icons/expand.vue'
import Logo from '@/components/icons/logo.vue'
import Map from '@/components/Map.vue'
import { useLoaderStore } from '@/stores/loader'
import Phone from '@/components/icons/phone.vue'
import Geo from '@/components/icons/geo.vue'
import Calendar from '@/components/icons/calendar.vue'
import ModalContact from '@/components/ModalContact.vue'
const langStore = useLangStore()

const serviceData = ref({}),
  centers = ref({})
const questions = ref([])
const isModalOpened = ref(false)
let isLoading = computed(() => useLoaderStore().isLoading)
let chosenCenterId = ref()

const isMobile = computed(() => isMobileFn())

const splitPhones = (raw) => {
  if (!raw) return []
  return raw
    .split(/[,;]+/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => {
      const match = p.match(/[+0-9\s]+/)
      const phoneForTel = (match ? match[0] : p).replace(/\s+/g, '')
      return {
        display: p,
        href: `tel:${phoneForTel}`
      }
    })
}

watch(() => langStore.activeLang, async () => {
  serviceData.value = await API.ServicePage.get()
  centers.value = await API.ContactsPage.get();

  setTimeout(() => {
    nextTick(() => {
      serviceData.value.faq.forEach(q => {
        addDropdown(`question-${q.id}`, false, true)
      })
    })
  }, 100)
})

onMounted(async () => {
  try {
    useLoaderStore().isLoading = true
    serviceData.value = await API.ServicePage.get()
    centers.value = await API.ContactsPage.get();

    setTimeout(() => {
      nextTick(() => {
        serviceData.value.faq.forEach(q => {
          addDropdown(`question-${q.id}`, false, true)
        })
      })
    }, 100)
  } catch (e) {
    console.error('Ошибка при загрузке данных:', e)
  } finally {
    useLoaderStore().isLoading = false
  }
})
</script>

<style lang="scss" scoped>
.article {
  &-1 {
    position: relative;
    overflow: hidden;

    .picture {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }

    h1, h2, .btn {
      position: relative;
      z-index: 1;
    }
  }

  &-3 {
    margin: 80px 76px;

    .section {
      display: flex;
      flex-direction: row;
      width: 100%;

      &:nth-of-type(2n) {
        flex-direction: row-reverse;
      }

      &__image {
        width: 50%;
        flex-shrink: 0;
      }

      &__info {
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        background-color: #EAE8E2;
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
}

.center__item--phones {
  align-items: flex-start;
}

.center__phones {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.center__phone {
  font-size: 14px;
}

.enjoy {
  .article-1__h--1 {
    max-width: 700px;
  }

  padding: 50px;
  justify-content: flex-start;
}

.FAQ {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__h {
    font-family: Tenor Sans;
    font-size: 42px;
    line-height: 1.15;
    max-width: 862px;
  }

  &__inner {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0 20px;
  }
}

.question {
  display: grid;
  grid-template-columns: auto 18px;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-top: 1px solid #000;
  cursor: pointer;

  &__h {
    font-family: Tenor Sans;
    font-size: 24px;
    line-height: 1.15;
  }

  .dropdown {
    position: relative;
    top: 10px;
    grid-column: 1 / span 2;
  }
}

@media screen and (max-width: 876px) {
  .article {
    &-1 {
      &__h {
        &--2 {
          max-width: 250px;
          margin-top: -4px;
          margin-bottom: 16px;
        }
      }
    }

    &-3 {
      margin: 50px 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .section {
        flex-direction: column !important;

        &__image {
          width: 100%;
        }

        &__info {
          padding: 16px;
        }
      }
    }
  }

  .enjoy {
    width: auto;
    margin: 0 16px;

    .article {
      &-1 {
        &__h {
          &--1 {
            font-size: 36px;
          }

          &--2 {
            font-size: 20px;

          }
        }
      }
    }
  }

  .FAQ {
    &__h {
      font-size: 28px;
    }

    &__inner {
      display: flex;
      flex-direction: column;
    }

    .question {
      padding: 16px 0;

      &__h {
        max-width: 233px;
        font-size: 18px;
      }

      .dropdown {
        font-size: 14px;
        top: 8px;
      }
    }
  }
}
</style>
