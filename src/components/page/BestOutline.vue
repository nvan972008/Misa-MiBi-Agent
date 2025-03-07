<script setup lang="ts">
import { ref, inject, watch, Ref } from "vue";
import { DxSelectBox } from "devextreme-vue";

import { KeywordResult, userService } from "../../services/api";
import UserSelector from "../common/UserSelector.vue";
import Draggable from "../common/Draggable.vue";

const selectedUser = ref("");
const result = ref("");
const selectedKeyWord = ref<KeywordResult>({});
const showResults = ref(false);

let keywordCache = localStorage.getItem("key_word");

const loading = inject<Ref<boolean>>("loading");
const toast = inject<{
  error: (msg: string) => void;
  success: (msg: string) => void;
}>("toast");

const selectKeyWordConfig = ref<DxSelectBox>({
  items: [],
  searchEnabled: true,
  placeholder: "",
  noDataText: "Không có dữ liệu",
  elementAttr: { style: "width: 100%" },
  displayExpr: "value",
  value: localStorage.getItem("key_word") || "",
  valueExpr: "key",
  onSelectionChanged(e) {
    if (e && e.selectedItem) {
      {
        selectedKeyWord.value = e.selectedItem;
        localStorage.setItem("key_word", e.selectedItem.key);
      }
    }
  },
});

const generateOutline = async () => {
  if (!selectedUser.value) {
    toast?.error("Vui lòng chọn người dùng");
    return;
  }

  loading && (loading.value = true);
  const response = await userService.createBestOutline(
    selectedUser.value,
    selectedKeyWord.value.value ?? ""
  );
  result.value = response;
  showResults.value = true;
  loading && (loading.value = false);

  toast?.success("Tạo outline thành công");
};

const getListKeyWord = async () => {
  loading && (loading.value = true);
  if (selectedUser.value) {
    const response = await userService.getKeyWordByUser(selectedUser.value);
    if (response && response.length > 0) {
      selectKeyWordConfig.value.items = response;
    } else {
      selectKeyWordConfig.value.items = [];
    }
  }
  loading && (loading.value = false);
};

watch(selectedUser, () => {
  getListKeyWord();
});
</script>

<template>
  <div class="card">
    <h2>Tạo outline tốt nhất</h2>
    <UserSelector v-model="selectedUser" />
    <div class="form-group mt-25">
      <label class="label-input">Keyword đã tìm kiếm</label>
      <div class="form-group group-add-user">
        <DxSelectBox v-bind="selectKeyWordConfig" />
      </div>
    </div>
    <button @click="generateOutline" class="btn-green">Tạo</button>
  </div>

  <div v-if="showResults" class="popup">
    <Draggable>
      <div class="popup-content">
        <h3>Đang tạo outline tốt nhất:</h3>
        <div style="margin-bottom: 15px">
          Chi tiết tại:
          <a class="link" :href="result" target="_blank">{{ result }}</a>
        </div>
        <button @click="showResults = false">Đóng</button>
      </div>
    </Draggable>
  </div>
</template>

<style scoped>
.outline-result {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: rgba(100, 108, 255, 0.1);
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  text-align: left;
}
</style>
