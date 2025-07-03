<template>
	<div
		class="btn btn--orange"
		@click="isModalOpened = true"
	>
		<ChatIcon />
	</div>

	<Teleport to="body">
		<Modal
			:heading="i18n.modal.chat"
			:is-opened="isModalOpened !== false"
			:mailObj="{type: 'chat', page: $route.path}"
			@close="isModalOpened = false"
		/>
	</Teleport>
</template>

<script setup>
import { ref } from 'vue';
import ChatIcon from './icons/chat.vue';
import Modal from './Modal.vue';

let isModalOpened = ref(false)
</script>

<style lang="scss" scoped>
.btn {
  min-width: auto !important;
  position: fixed;
  bottom: 32px;
  right: 76px;
  z-index: 1;

  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;

  svg {
    width: 100%;
    height: 100%;
  }
}

@media screen and (max-width: 876px) {
  .btn {
    right: 16px;
  }
}
</style>
