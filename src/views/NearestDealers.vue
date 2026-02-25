<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>
		<div
			class="dealers"
			v-if="data"
		>
			<div class="dealers__h">{{ data?.block_title }}</div>
			<div
				class="dealers__underh"
				v-html="data?.text_block"
			></div>

			<Map :chosenCenterId="chosenCenterId"></Map>

			<div class="centers">
				<div
					class="center"
					v-for="center in centers?.center_contacts"
					:key="center.id"
					@click="chosenCenterId = center.id"
				>
					<div class="center__name">
						{{ center.value.center_name }}
					</div>
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

			<div class="centers">
				<div
					class="center"
					v-for="center in data?.center_dealers"
					:key="center.id"
				>
					<div class="center__name">{{ center.value.center_name }}</div>
					<div class="center__item center__item--phones">
						<Phone />
						<div class="center__phones">
							<a
								v-for="(phone, idx) in splitPhones(center.value.center_phone)"
								:key="idx"
								:href="phone.href"
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
		</div>
	</TransitionGroup>
</template>

<script setup>
import Calendar from '@/components/icons/calendar.vue';
import Geo from '@/components/icons/geo.vue';
import Phone from '@/components/icons/phone.vue';
import API from '@/composables/API';
import Map from '@/components/Map.vue';
import { computed, onMounted, ref, watch } from 'vue';
import Logo from '@/components/icons/logo.vue';
import { useLoaderStore } from '@/stores/loader';
import { useLangStore } from '@/stores/lang';

let data = ref({})
let isLoading = computed(() => useLoaderStore().isLoading)
let chosenCenterId = ref()
let centers = ref({})

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
watch(() => useLangStore().activeLang, async () => {
  centers.value = await API.ContactsPage.get();
  //data.value = await API.dealersPage.get();
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  centers.value = await API.ContactsPage.get();
  //data.value = await API.dealersPage.get();
  useLoaderStore().isLoading = false
})
</script>

<style lang="scss" scoped>
.dealers {
  margin: 114px 76px 50px;

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
  }

  &__underh {
    margin-top: 16px;
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 1.25;
  }
}

.center {
  width: calc((100% - 50px) / 2);
  display: flex;
  flex-direction: column;
  gap: 10px;

  &s {
    width: auto;
    margin-top: 24px;
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

@media screen and (max-width: 876px) {
  .dealers {
    margin: 96px 16px 50px;

    &__h {
      font-size: 42px;
      line-height: 1.15;
    }

    &__underh {
      margin-top: 12px;
      margin-bottom: 16px;
      font-size: 16px;
      line-height: 1.25;
    }
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
    }

    &__name {
      font-weight: 600;
      font-size: 22px;
      line-height: 1.2;
      margin-bottom: 4px;
    }
  }
}
</style>
