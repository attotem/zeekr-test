<template>
	<div class="map-wrapper article-2">
		<GMapMap
			ref="mapRef"
			:center="mapCenter"
			:zoom="zoom"
			style="width: 100%; height: 450px; border-radius: 8px; margin-bottom: 32px"
			@loaded="handleMapLoad"
		>
			<GMapMarker
				v-for="center in centers"
				:key="center.id"
				:position="{ lat: center.lat, lng: center.lng }"
				:clickable="true"
				@click="onMarkerClick(center)"
			/>
		</GMapMap>

		<TransitionGroup>
			<div
				v-if="activePopup"
				class="custom-popup"
				style="top: 100px; left: 5%"
			>
				<div class="popup-header">
					<div>{{ activePopup.name }}</div>
					<div
						@click="closePopup"
						class="popup-close"
					>
						×
					</div>
				</div>
				<div class="popup-body">
					<div class="center__item">
						<Phone />
						{{ activePopup.phone }}
					</div>
					<div class="center__item">
						<Geo />
						{{ activePopup.address }}
					</div>
					<div class="center__item">
						<Calendar />
						{{ activePopup.hours }}
					</div>

					<br />
					<a
						class="btn btn--transparent btn--transparent-black"
						:href="activePopup.link"
						target="_blank"
						>Прокласти маршрут в Google Maps
						<GoogleMaps />
					</a>
					<a
						class="btn btn--transparent btn--transparent-black"
						:href="`https://waze.com/ul?ll=${activePopup.lat},${activePopup.lng}`"
						target="_blank"
						>Прокласти маршрут в Waze
						<Waze />
					</a>
				</div>
			</div>
		</TransitionGroup>
	</div>
</template>

<script setup>
import API from '@/composables/API'
import { nextTick, onMounted, ref, watch } from 'vue'
import Phone from './icons/phone.vue'
import Geo from './icons/geo.vue'
import Calendar from './icons/calendar.vue'
import GoogleMaps from './icons/googleMaps.vue'
import Waze from './icons/waze.vue'
import { useLangStore } from '@/stores/lang'

const props = defineProps(['chosenCenterId'])

const centers = ref([])
const mapRef = ref(null)
const mapInstance = ref(null)
const activePopup = ref(null)
const mapCenter = ref({ lat: 48.3794, lng: 31.1656 })
const zoom = ref(6)

function handleMapLoad(map) {
	mapInstance.value = map
}

function onMarkerClick(center) {
	activePopup.value = center
	mapRef.value.panTo({lat: center.lat, lng: center.lng})
	zoom.value = 14;
}

function closePopup() {
	activePopup.value = null
}

watch(() => useLangStore().activeLang, async () => {
  const coordinatesMap = {
		"ae039f08-23cb-4384-814c-dbab8d54417d": { lat: 50.473385, lng: 30.518172, name: 'Автосалон+Електромобілів+«SKM-1»', link: 'https://www.google.com/maps/place/%D0%90%D0%B2%D1%82%D0%BE%D1%81%D0%B0%D0%BB%D0%BE%D0%BD+%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BC%D0%BE%D0%B1%D1%96%D0%BB%D1%96%D0%B2+%C2%ABSKM-1%C2%BB/@50.4732628,30.515803,17z/data=!3m1!4b1!4m6!3m5!1s0x40d4cf6b50a498f1:0xef1666fc9b9b1d8!8m2!3d50.4732594!4d30.5183779!16s%2Fg%2F11w918zsyj?entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D' },
		"25af8dc3-9b17-4547-be4d-48de4c6c3ef4": { lat: 50.396877, lng: 30.620526, name: 'Автосалон+Zeekr+Позняки', link: 'https://www.google.com/maps/place/%D0%90%D0%B2%D1%82%D0%BE%D1%81%D0%B0%D0%BB%D0%BE%D0%BD+Zeekr+%D0%9F%D0%BE%D0%B7%D0%BD%D1%8F%D0%BA%D0%B8/@50.3969181,30.6179639,17z/data=!3m1!4b1!4m6!3m5!1s0x40d4c583ea7c3ef1:0x18f3fe9250161f11!8m2!3d50.3969147!4d30.6205388!16s%2Fg%2F11x7pn58jv?entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D' },
		"ac901e17-73b9-4b7e-a25f-1564ee2b103e": { lat: 46.418262, lng: 30.725243, name: 'Автосалон+Zeekr+Одеса', link: 'https://www.google.com/maps/place/%D0%90%D0%B2%D1%82%D0%BE%D1%81%D0%B0%D0%BB%D0%BE%D0%BD+Zeekr+%D0%9E%D0%B4%D0%B5%D1%81%D0%B0/@46.4181256,30.7226968,17z/data=!3m1!4b1!4m6!3m5!1s0x40c6333bd4933525:0xd7a6bb1665ccbe60!8m2!3d46.4181219!4d30.7252717!16s%2Fg%2F11m759cd9l?entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D' }
		};
	let contactsData = await API.ContactsPage.get();

	if (contactsData.center_contacts?.length) {
		centers.value = contactsData.center_contacts.map(c => {
			console.log(c);
			const coords = coordinatesMap[c.id] || { lat: 0, lng: 0 }
			return {
				id: c.id,
				direction: coords.name,
				name: c.value.center_name,
				link: coords.link,
				phone: c.value.center_phone,
				address: c.value.center_address,
				hours: c.value.center_working_hours,
				lat: coords.lat,
				lng: coords.lng
			}
		})
	}

	console.log(centers.value)

	if(props.chosenCenterId) activePopup.value = centers.value.find(el => el.id == props.chosenCenterId)
	else activePopup.value = centers.value[0]
})

onMounted(async () => {
	const coordinatesMap = {
		"ae039f08-23cb-4384-814c-dbab8d54417d": { lat: 50.473385, lng: 30.518172, name: 'Автосалон+Електромобілів+«SKM-1»', link: 'https://www.google.com/maps/place/%D0%90%D0%B2%D1%82%D0%BE%D1%81%D0%B0%D0%BB%D0%BE%D0%BD+%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BC%D0%BE%D0%B1%D1%96%D0%BB%D1%96%D0%B2+%C2%ABSKM-1%C2%BB/@50.4732628,30.515803,17z/data=!3m1!4b1!4m6!3m5!1s0x40d4cf6b50a498f1:0xef1666fc9b9b1d8!8m2!3d50.4732594!4d30.5183779!16s%2Fg%2F11w918zsyj?entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D' },
		"25af8dc3-9b17-4547-be4d-48de4c6c3ef4": { lat: 50.396877, lng: 30.620526, name: 'Автосалон+Zeekr+Позняки', link: 'https://www.google.com/maps/place/%D0%90%D0%B2%D1%82%D0%BE%D1%81%D0%B0%D0%BB%D0%BE%D0%BD+Zeekr+%D0%9F%D0%BE%D0%B7%D0%BD%D1%8F%D0%BA%D0%B8/@50.3969181,30.6179639,17z/data=!3m1!4b1!4m6!3m5!1s0x40d4c583ea7c3ef1:0x18f3fe9250161f11!8m2!3d50.3969147!4d30.6205388!16s%2Fg%2F11x7pn58jv?entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D' },
		"ac901e17-73b9-4b7e-a25f-1564ee2b103e": { lat: 46.418262, lng: 30.725243, name: 'Автосалон+Zeekr+Одеса', link: 'https://www.google.com/maps/place/%D0%90%D0%B2%D1%82%D0%BE%D1%81%D0%B0%D0%BB%D0%BE%D0%BD+Zeekr+%D0%9E%D0%B4%D0%B5%D1%81%D0%B0/@46.4181256,30.7226968,17z/data=!3m1!4b1!4m6!3m5!1s0x40c6333bd4933525:0xd7a6bb1665ccbe60!8m2!3d46.4181219!4d30.7252717!16s%2Fg%2F11m759cd9l?entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D' }
		};
	let contactsData = await API.ContactsPage.get();

	if (contactsData.center_contacts?.length) {
		centers.value = contactsData.center_contacts.map(c => {
			console.log(c);
			const coords = coordinatesMap[c.id] || { lat: 0, lng: 0 }
			return {
				id: c.id,
				direction: coords.name,
				name: c.value.center_name,
				link: coords.link,
				phone: c.value.center_phone,
				address: c.value.center_address,
				hours: c.value.center_working_hours,
				lat: coords.lat,
				lng: coords.lng
			}
		})
	}

	console.log(centers.value)

	if(props.chosenCenterId) activePopup.value = centers.value.find(el => el.id == props.chosenCenterId)
	else activePopup.value = centers.value[0]
})

watch(() => props.chosenCenterId, () => {
	if(props.chosenCenterId) onMarkerClick(centers.value.find(el => el.id == props.chosenCenterId))
})
</script>

<style scoped>
.btn {
	display: flex;
	flex-direction: row;
	gap: 8px;
	justify-content: center;
	align-items: center;
}
</style>
