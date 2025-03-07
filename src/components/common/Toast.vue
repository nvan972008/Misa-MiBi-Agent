<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}>();

const visible = ref(false);
let timer: number | null = null;

onMounted(() => {
  visible.value = true;

  if (props.duration !== 0) {
    timer = window.setTimeout(() => {
      close();
    }, props.duration || 3000);
  }
});

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
  }
});

const close = () => {
  visible.value = false;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  // Give time for the exit animation to complete
  setTimeout(() => {
    if (props.onClose) {
      props.onClose();
    }
  }, 300);
};
</script>

<template>
  <div
    class="toast-container"
    :class="[`toast-${type}`, { 'toast-visible': visible }]"
  >
    <div class="toast-content">
      <div class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast-message">{{ message }}</div>
      <button class="toast-close" @click="close">&times;</button>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: -400px;
  width: 350px;
  max-width: 90%;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  transition: right 0.3s ease-in-out;
}

.toast-visible {
  right: 20px;
}

.toast-success {
  background-color: rgba(66, 184, 131, 0.9);
  color: white;
}

.toast-error {
  background-color: rgba(255, 76, 76, 0.9);
  color: white;
}

.toast-info {
  background-color: rgba(100, 108, 255, 0.9);
  color: white;
}

.toast-content {
  display: flex;
  align-items: center;
}

.toast-icon {
  flex: 0 0 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
}

.toast-message {
  flex: 1;
  font-size: 14px;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  margin-left: 12px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

@media (prefers-color-scheme: light) {
  .toast-container {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>