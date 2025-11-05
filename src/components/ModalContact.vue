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
			<template v-if="!isSent">
				<div class="modal__h">{{ props.heading?.[langStore.activeLang] }}</div>
				<div class="modal__underh">
					{{ i18n.modal.fillInYourInfo?.[langStore.activeLang] }}
				</div>

				<div class="modal__inputs">
					<Input
						:name="langStore.activeLang == 'en' ? 'Your name' : 'Ваше ім\'я'"
						:isRequired="true"
						ref="name"
						:type="'text'"
					/>

					<Input
						:name="langStore.activeLang == 'en' ? 'City' : 'Місто'"
						:isRequired="true"
						ref="city"
						:type="'text'"
					/>

					<Input
						:name="langStore.activeLang == 'en' ? 'Your phone number' : 'Ваш телефон'"
						:isRequired="true"
						ref="phone"
						:type="'tel'"
					/>
				</div>

				<div
					class="btn btn--orange"
					@click="send"
				>
					Відправити
				</div>
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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Input from './input.vue';
import { useLangStore } from '@/stores/lang';
import API from '@/composables/API';

const router = useRouter();
let langStore = useLangStore()
let isSent = ref(false)
let phone = ref(),
  name = ref(),
  city = ref()

let props = defineProps(['heading', 'isOpened', 'mailObj'])
let emits = defineEmits(['close'])

const send = async () => {
  const nameOk = name.value?.content?.length > 0
  const cityOk = city.value?.content?.length > 0
  const phoneOk = !!phone.value?.content && !phone.value?.isError
  if (!(nameOk && cityOk && phoneOk)) return;
  let res = await API.Mail.send({
    type: props.mailObj.type,
    page: props.mailObj.page,
    name: name.value.content,
    phone: phone.value.content,
    city: city.value.content
  })
  isSent.value = true
  emits('close')
  router.push('/thank-you-page')
}

watch(() => props.isOpened, () => {
  isSent.value = false;
})

watch(() => city.value?.content, (val) => {
  if (val == null) return
  const cleaned = val.replace(/[^A-Za-zА-Яа-яЁёІіЇїЄєҐґ\s-]/g, '')
  if (cleaned !== val) city.value.content = cleaned
})

watch(() => name.value?.content, (val) => {
  if (val == null) return
  const cleaned = val.replace(/[^A-Za-zА-Яа-яЁёІіЇїЄєҐґ\s-]/g, '')
  if (cleaned !== val) name.value.content = cleaned
})
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
    display: flex;
    flex-direction: column;
    width: 540px;
    padding: 32px;
    border-radius: 12px;
    background-color: #fff;
    cursor: auto;
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
  }
}

@media screen and (max-width: 876px) {
  .modal {
    &__inner {
      width: calc(100dvw - (16px * 2));
      padding: 16px;
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
