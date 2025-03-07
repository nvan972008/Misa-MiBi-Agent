<script setup lang="ts">
import { ref, markRaw, defineComponent, h } from "vue";
import Toast from "./Toast.vue";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

const toasts = ref<ToastItem[]>([]);
let nextId = 1;

const addToast = (
  message: string,
  type: "success" | "error" | "info",
  duration?: number
) => {
  const id = nextId++;
  toasts.value.push({ id, message, type, duration });
  return id;
};

const removeToast = (id: number) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

// Expose methods to parent components
defineExpose({
  addToast,
  success: (message: string, duration?: number) =>
    addToast(message, "success", duration),
  error: (message: string, duration?: number) =>
    addToast(message, "error", duration),
  info: (message: string, duration?: number) =>
    addToast(message, "info", duration),
});
</script>

<template>
  <div class="toast-manager">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      :onClose="() => removeToast(toast.id)"
    />
  </div>
</template>