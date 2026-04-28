<template>
	<div
		class="modal"
		:class="{ 'modal--opened': isOpened }"
		@click="emits('close')"
	>
		<div
			class="modal__inner"
			@click.stop
		>
			<button
				type="button"
				class="modal__close"
				aria-label="Close"
				@click="emits('close')"
			>
				×
			</button>
			<template v-if="!isSent">
				<div class="modal__h">{{ typeof props.heading === 'string' ? props.heading : props.heading?.[langStore.activeLang] }}</div>
				<div class="modal__underh">
					{{ i18n.modal.fillInYourInfo?.[langStore.activeLang] }}
				</div>

				<div class="modal__inputs">
					<Input
						:name="langStore.activeLang == 'en' ? 'Your name' : 'Ваше ім\'я'"
						:is-required="true"
						:use-internal-validation="false"
						:errors-visible="submitAttempted"
						:error-message="fieldErrors.name"
						ref="nameRef"
						type="text"
					/>

					<Input
						:name="langStore.activeLang == 'en' ? 'City' : 'Місто'"
						:is-required="true"
						:use-internal-validation="false"
						:errors-visible="submitAttempted"
						:error-message="fieldErrors.city"
						ref="cityRef"
						type="text"
					/>

					<Input
						:name="langStore.activeLang == 'en' ? 'Your phone number' : 'Ваш телефон'"
						:is-required="true"
						:use-internal-validation="false"
						:errors-visible="submitAttempted"
						:error-message="fieldErrors.phone"
						ref="phoneRef"
						type="tel"
					/>

					<Input
						:name="i18n.modal.emailOptional?.[langStore.activeLang]"
						:is-required="false"
						:use-internal-validation="false"
						:errors-visible="submitAttempted"
						:error-message="fieldErrors.email"
						ref="emailRef"
						type="email"
					/>
				</div>

				<button
					type="button"
					class="btn btn--orange"
					:class="{ 'btn--disabled': isSending }"
					@click="!isSending && send()"
				>
					{{ i18n.modal.submit?.[langStore.activeLang] }}
				</button>
			</template>
			<template v-else>
				<div class="modal__h">
					{{ i18n.modal.sentRequest?.[langStore.activeLang] }}
				</div>
				<div class="modal__underh">
					{{ i18n.modal.managerWillContactYou?.[langStore.activeLang] }}
				</div>
				<div
					class="btn btn--orange"
					@click="emits('close')"
				>
					{{ i18n.modal.OK?.[langStore.activeLang] }}
				</div>
			</template>
		</div>
	</div>
</template>

<script setup>
import { nextTick, reactive, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import Input from './input.vue';
import { useLangStore } from '@/stores/lang';
import API from '@/composables/API';
import { createContactFormSchema } from '@/schemas/contactFormSchema';

const router = useRouter();
const langStore = useLangStore();
const isSent = ref(false);
const isSending = ref(false);
const submitAttempted = ref(false);

const nameRef = ref();
const cityRef = ref();
const phoneRef = ref();
const emailRef = ref();

const fieldErrors = reactive({
	name: '',
	city: '',
	phone: '',
	email: '',
});

const props = defineProps(['heading', 'isOpened', 'mailObj']);
const emits = defineEmits(['close']);

function unwrapFieldContent(comp) {
	if (!comp) return '';
	const c = comp.content;
	if (c && typeof c === 'object' && 'value' in c) return String(c.value ?? '');
	return String(c ?? '');
}

function getFormValues() {
	return {
		name: unwrapFieldContent(nameRef.value),
		city: unwrapFieldContent(cityRef.value),
		phone: unwrapFieldContent(phoneRef.value),
		email: unwrapFieldContent(emailRef.value),
	};
}

function runValidation() {
	const schema = createContactFormSchema(langStore.activeLang);
	const parsed = schema.safeParse(getFormValues());
	fieldErrors.name = '';
	fieldErrors.city = '';
	fieldErrors.phone = '';
	fieldErrors.email = '';
	if (!parsed.success) {
		const fe = parsed.error.flatten().fieldErrors;
		if (fe.name?.[0]) fieldErrors.name = fe.name[0];
		if (fe.city?.[0]) fieldErrors.city = fe.city[0];
		if (fe.phone?.[0]) fieldErrors.phone = fe.phone[0];
		if (fe.email?.[0]) fieldErrors.email = fe.email[0];
		return false;
	}
	return true;
}

const send = async () => {
	if (isSending.value) return;

	submitAttempted.value = true;
	if (!runValidation()) return;

	try {
		isSending.value = true;
		const values = getFormValues();
		const payload = {
			type: props.mailObj?.type,
			page: props.mailObj?.page,
			name: values.name,
			phone: values.phone,
			city: values.city,
			email: values.email.trim() || undefined,
		};

		await API.Mail.send(payload);

		isSent.value = true;
		emits('close');
		router.push('/thank-you-page');
	} catch {
		/* залишаємо форму відкритою для повтору */
	} finally {
		isSending.value = false;
	}
};

function clearFormUi() {
	submitAttempted.value = false;
	fieldErrors.name = '';
	fieldErrors.city = '';
	fieldErrors.phone = '';
	fieldErrors.email = '';
	nameRef.value?.clear?.();
	cityRef.value?.clear?.();
	phoneRef.value?.clear?.();
	emailRef.value?.clear?.();
}

watch(() => props.isOpened, (open) => {
	isSent.value = false;
	if (open) nextTick(() => clearFormUi());
});

watchEffect(() => {
	if (!submitAttempted.value) return;
	unwrapFieldContent(nameRef.value);
	unwrapFieldContent(cityRef.value);
	unwrapFieldContent(phoneRef.value);
	unwrapFieldContent(emailRef.value);
	langStore.activeLang;
	runValidation();
});

watch(
	() => unwrapFieldContent(cityRef.value),
	(val) => {
		if (val == null || !cityRef.value?.content) return;
		const cleaned = val.replace(/[^A-Za-zА-Яа-яЁёІіЇїЄєҐґ\s'-]/g, '');
		if (cleaned !== val && cityRef.value.content && 'value' in cityRef.value.content) {
			cityRef.value.content.value = cleaned;
		}
	},
);

watch(
	() => unwrapFieldContent(nameRef.value),
	(val) => {
		if (val == null || !nameRef.value?.content) return;
		const cleaned = val.replace(/[^A-Za-zА-Яа-яЁёІіЇїЄєҐґ\s'-]/g, '');
		if (cleaned !== val && nameRef.value.content && 'value' in nameRef.value.content) {
			nameRef.value.content.value = cleaned;
		}
	},
);
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
  transition: .5s ease-in-out;
  opacity: 0;
  cursor: pointer;
  user-select: none;

  &--opened {
    z-index: 100000;
    opacity: 1;
    user-select: unset;
  }

  &__inner {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 540px;
    padding: 32px;
    border-radius: 12px;
    background-color: #fff;
    cursor: auto;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    color: #000;
    transition: background-color 0.2s ease, color 0.2s ease;
    z-index: 10;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      color: #111;
    }

    &:active {
      background: rgba(0, 0, 0, 0.15);
    }
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
    gap: 4px;
    margin-bottom: 32px;
  }

  .btn {
    width: 198px;
    align-self: center;
    border: none;
  }

  .btn--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

@media screen and (max-width: 876px) {
  .modal {
    &__inner {
      width: calc(100dvw - (16px * 2));
      padding: 16px;
    }

    &__close {
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      font-size: 20px;
    }

    &__h {
      font-size: 28px;
      line-height: 1.2;
    }

    &__underh {
      font-size: 16px;
      line-height: 1.2;
      margin-top: 6px;
      margin-bottom: 16px;
    }

    .input {
      &__inner {
        font-size: 14px;
        line-height: 1.4;
      }

      &__name, &__error {
        font-size: 10px;
        line-height: 1.4;
      }
    }
  }
}
</style>
