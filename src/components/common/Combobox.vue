<script setup lang="ts">
import { computed } from "vue";
import { DxComboBox } from "devextreme-vue";

const props = defineProps<{
  options: any[];
  modelValue: string;
  placeholder: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const sortedUsers = computed(() => {
  return [...props.options].sort((a, b) =>
    a.UserName.localeCompare(b.UserName)
  );
});

const onValueChanged = (e: any) => {
  emit("update:modelValue", e.value);
};
</script>

<template>
  <DxComboBox
    :data-source="sortedUsers"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    value-expr="UserName"
    display-expr="UserName"
    :search-enabled="true"
    @value-changed="onValueChanged"
    :style="{ width: '100%' }"
  />
</template>

<style scoped>
/* Remove existing styles */
</style>
