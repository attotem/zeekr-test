<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<template v-else-if="data">
			<div class="contacts">
				<h1 class="contacts__h">{{ data?.block_title }}</h1>
				<div
					class="contacts__underh"
					v-html="data?.text_block"
				></div>

				<Map :chosenCenterId="chosenCenterId"></Map>

				<div class="centers">
					<div
						class="center"
						v-for="center in data?.center_contacts"
						:key="center.id"
						@click="chosenCenterId = center.id"
					>
						<h3 class="center__name">
							{{ center.value.center_name }}
						</h3>
						<div class="center__item">
							<Phone />
							<a
								:href="`tel:${center.value.center_phone}`"
								style="text-decoration: underline;"
								>{{ center.value.center_phone }}</a
							>
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
		</template>
	</TransitionGroup>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Calendar from "@/components/icons/calendar.vue";
import Geo from "@/components/icons/geo.vue";
import Phone from "@/components/icons/phone.vue";
import API from "@/composables/API";
import Map from "@/components/Map.vue";
import Logo from "@/components/icons/logo.vue";
import { useLoaderStore } from "@/stores/loader";
import { useLangStore } from "@/stores/lang";
const data = ref({});
let chosenCenterId = ref()
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => useLangStore().activeLang, async () => {
  data.value = await API.ContactsPage.get();
})

onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.ContactsPage.get();
  useLoaderStore().isLoading = false
});
</script>

<style scoped lang="scss">
.contacts {
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

.map-wrapper {
  position: relative;
}

.custom-popup {
  position: absolute;
  z-index: 999;
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

.btn {
  display: flex;
  height: 40px;
  padding: 5px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 50px;
  border: 1px solid #000;
  color: #000;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  width: 100%;
}

.btn:hover {
  background-color: #f5f5f5;
}

.centers {
  margin: 24px 0 50px;
}

@media screen and (max-width: 876px) {

  .custom-popup {
    position: absolute;
    z-index: 999;
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

  .contacts {
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
  .custom-popup{
    left: 32px !important;
    bottom: 20px;
    top: auto !important;
    width: calc(100% - 64px) !important;

  }
}
</style>
