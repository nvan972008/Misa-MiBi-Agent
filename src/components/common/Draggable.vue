<template>
  <div ref="draggable" class="draggable" @mousedown="startDrag">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const draggable = ref<HTMLElement | null>(null);

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  if (draggable.value) {
    startX.value = e.clientX - draggable.value.offsetLeft;
    startY.value = e.clientY - draggable.value.offsetTop;
  }
  document.addEventListener("mousemove", doDrag);
  document.addEventListener("mouseup", stopDrag);
};

const doDrag = (e: MouseEvent) => {
  if (!isDragging.value || !draggable.value) return;

  const elementWidth = draggable.value.offsetWidth;
  const elementHeight = draggable.value.offsetHeight;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let x = e.clientX - startX.value;
  let y = e.clientY - startY.value;

  // Keep the element within the window boundaries
  x = Math.min(Math.max(x, 0), windowWidth - elementWidth);
  y = Math.min(Math.max(y, 0), windowHeight - elementHeight);

  draggable.value.style.left = x + "px";
  draggable.value.style.top = y + "px";
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", doDrag);
  document.removeEventListener("mouseup", stopDrag);
};

onMounted(() => {
  draggable.value = document.querySelector(".draggable");
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", doDrag);
  document.removeEventListener("mouseup", stopDrag);
});
</script>

<style scoped>
.draggable {
  position: absolute;
  cursor: move;
}
</style>
