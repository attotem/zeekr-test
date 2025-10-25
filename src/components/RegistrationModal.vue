<template>
	<div
		class="modal"
		:class="{ 'modal--opened': isOpened }"
		@click="emits('close')"
	>
		<div class="modal__inner" @click.stop>
			<template v-if="!isSent">
				<div class="modal__h">Реєстрація на подію</div>
				<div class="modal__underh">
					Заповніть форму для реєстрації на презентацію Zeekr 9X
				</div>

				<div class="modal__inputs">
					<Input name="ПІБ" :isRequired="true" ref="fullName" type="text" />
					<Input name="Пошта" :isRequired="true" ref="email" type="email" />
					<Input name="Номер телефону" :isRequired="true" ref="phone" type="tel" />

					<div class="select-wrapper">
						<label class="select-label">
							<span class="select-label__text">Місто *</span>
							<select class="select-input" v-model="selectedCity" required>
								<option value="" disabled>Оберіть місто</option>
								<option value="Львів">Львів</option>
								<option value="Київ">Київ</option>
								<option value="Дніпро">Дніпро</option>
							</select>
						</label>
					</div>

					<div class="checkbox-wrapper">
						<label class="checkbox-label">
							<input type="checkbox" class="checkbox-input" v-model="isZeekrOwner" />
							<span class="checkbox-text">Є власником Zeekr</span>
						</label>
					</div>
				</div>

				<div class="btn btn--orange" @click="send">
					Зареєструватися
				</div>
			</template>

			<template v-else>
				<div class="modal__h">Дякуємо за реєстрацію!</div>
				<div class="modal__underh">
					Ми зв'яжемося з вами найближчим часом для підтвердження участі
				</div>
				<div class="btn btn--orange" @click="emits('close')">OK</div>
			</template>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Input from './input.vue';

let isSent = ref(false);
let fullName = ref();
let email = ref();
let phone = ref();
let selectedCity = ref('');
let isZeekrOwner = ref(false);

let props = defineProps(['isOpened']);
let emits = defineEmits(['close']);

// 🚀 Отправка напрямую в Google Sheets
const send = async () => {
	if (!fullName.value?.content || !email.value?.content || !phone.value?.content || !selectedCity.value) {
		alert("Будь ласка, заповніть всі обов'язкові поля");
		return;
	}

	if (phone.value.isError) {
		alert('Будь ласка, введіть коректний номер телефону');
		return;
	}

    try {
	await fetch('https://script.google.com/macros/s/AKfycbzq0v9VRMg3g2ZptvJE8uG9yd8tl9jl3Y1AQuo53cBFSP1jRy1XAEuYMD3mm9mnQRrh/exec', {
		method: 'POST',
		mode: 'no-cors',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: fullName.value.content,
			phone: phone.value.content,
			email: email.value.content,
			city: selectedCity.value,
			isZeekrOwner: isZeekrOwner.value
		})
	});
	isSent.value = true;
} catch (error) {
	console.error('Error sending registration:', error);
	alert('Помилка при відправці. Спробуйте ще раз.');
}

};

// Сброс при повторном открытии модалки
watch(() => props.isOpened, () => {
	isSent.value = false;
	selectedCity.value = '';
	isZeekrOwner.value = false;
});
</script>

<style lang="scss" scoped>
.modal {
	z-index: -1;
	position: fixed;
	left: 0;
	top: 0;
	width: 100dvw;
	height: 100dvh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #00000066;
	transition: 0.5s ease-in-out;
	opacity: 0;
	cursor: pointer;
	user-select: none;

	&--opened {
		z-index: 100000;
		opacity: 1;
		user-select: unset;
	}

	&__inner {
		display: flex;
		flex-direction: column;
		width: 540px;
		padding: 32px;
		border-radius: 12px;
		background-color: #fff;
		cursor: auto;
		max-height: 90vh;
		overflow-y: auto;
	}

	&__h {
		width: 100%;
		font-family: Tenor Sans;
		font-size: 40px;
		line-height: 1.2;
		text-align: center;
	}

	&__underh {
		width: 100%;
		font-size: 20px;
		line-height: 1.2;
		text-align: center;
		margin-top: 10px;
		margin-bottom: 24px;
	}

	&__inputs {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 32px;
	}
}

.select-wrapper {
	.select-label {
		display: flex;
		flex-direction: column;
		gap: 8px;

		&__text {
			font-size: 12px;
			color: #9da2a5;

			&::after {
				content: '*';
				color: #f75400;
			}
		}
	}

	.select-input {
		width: 100%;
		padding: 10px 16px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 16px;
		background-color: #fff;
		cursor: pointer;
		transition: border-color 0.3s ease;

		&:hover {
			border-color: #9da2a5;
		}

		&:focus {
			outline: none;
			border-color: #f75400;
		}

		&:invalid {
			border-color: #f75400;
		}
	}
}

.checkbox-wrapper {
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;

		.checkbox-input {
			width: 18px;
			height: 18px;
			cursor: pointer;
		}

		.checkbox-text {
			font-size: 16px;
			color: #000;
		}
	}
}

.btn {
	width: 198px;
	align-self: center;
}

@media screen and (max-width: 876px) {
	.modal {
		&__inner {
			width: calc(100dvw - (16px * 2));
			padding: 16px;
		}

		&__h {
			font-size: 28px;
		}

		&__underh {
			font-size: 16px;
			margin-top: 6px;
			margin-bottom: 16px;
		}

		&__inputs {
			gap: 12px;
			margin-bottom: 24px;
		}
	}

	.select-wrapper .select-input {
		padding: 10px 12px;
		font-size: 14px;
	}

	.checkbox-wrapper .checkbox-text {
		font-size: 14px;
	}
}
</style>
